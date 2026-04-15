import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Compass, AlertCircle, MapPin, RotateCcw, Smartphone } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from 'sonner';

// Kaaba coords
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

interface QiblaViewProps {
    onBack: () => void;
}

// Low-pass filter for smoothing sensor data
function lowPassFilter(newVal: number, oldVal: number | null, alpha: number = 0.15): number {
    if (oldVal === null) return newVal;

    // Handle wrap-around (e.g., 359° → 1°)
    let delta = newVal - oldVal;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    return ((oldVal + delta * alpha) % 360 + 360) % 360;
}

// Calculate Qibla bearing using Great Circle formula
function calculateQiblaBearing(lat: number, lng: number): number {
    const latK = KAABA_LAT * (Math.PI / 180.0);
    const lngK = KAABA_LNG * (Math.PI / 180.0);
    const phi = lat * (Math.PI / 180.0);
    const lambda = lng * (Math.PI / 180.0);

    const y = Math.sin(lngK - lambda);
    const x = Math.cos(phi) * Math.tan(latK) - Math.sin(phi) * Math.cos(lngK - lambda);
    let qibla = Math.atan2(y, x) * (180.0 / Math.PI);
    if (qibla < 0) qibla += 360.0;
    return qibla;
}

type SensorStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable' | 'needs-gesture';

export const QiblaView = ({ onBack }: QiblaViewProps) => {
    const { location } = useLocation();
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaBearing, setQiblaBearing] = useState<number>(0);
    const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
    const [accuracy, setAccuracy] = useState<'high' | 'low' | 'unknown'>('unknown');
    const [showCalibration, setShowCalibration] = useState(false);

    // Refs for smoothing
    const smoothedHeading = useRef<number | null>(null);
    const hasAbsolute = useRef(false);
    const eventCount = useRef(0);
    const cleanupRef = useRef<(() => void) | null>(null);

    // Calculate Qibla bearing when location changes
    useEffect(() => {
        if (!location) return;
        const bearing = calculateQiblaBearing(Number(location.latitude), Number(location.longitude));
        setQiblaBearing(bearing);
    }, [location]);

    // Event handler for orientation (stored in ref to avoid re-subscription)
    const handleOrientationEvent = useCallback((event: DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number }) => {
        let rawHeading: number | null = null;

        if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
            // iOS Safari — webkitCompassHeading is heading relative to magnetic north
            rawHeading = event.webkitCompassHeading;

            // iOS also provides accuracy in degrees (lower = better)
            if (event.webkitCompassAccuracy !== undefined) {
                setAccuracy(event.webkitCompassAccuracy < 15 ? 'high' : 'low');
            }
        } else if (event.alpha !== null && event.alpha !== undefined) {
            // Android / standard browsers
            // For absolute orientation: alpha is degrees from North (clockwise)
            // event.absolute === true means it's relative to Earth's reference frame
            if (event.absolute || hasAbsolute.current) {
                rawHeading = (360 - event.alpha) % 360;
                setAccuracy('high');
            } else {
                // Non-absolute fallback — less reliable but better than nothing
                rawHeading = (360 - event.alpha) % 360;
                setAccuracy('low');
            }
        }

        if (rawHeading !== null) {
            eventCount.current++;
            // Apply low-pass filter for smooth rotation
            const smoothed = lowPassFilter(rawHeading, smoothedHeading.current, 0.2);
            smoothedHeading.current = smoothed;
            setHeading(smoothed);
            setSensorStatus('active');

            // Show calibration tip after 10 events if accuracy is low
            if (eventCount.current === 10 && accuracy === 'low') {
                setShowCalibration(true);
            }
        }
    }, [accuracy]);

    // Handler specifically for the `deviceorientationabsolute` event (Chrome Android)
    const handleAbsoluteOrientation = useCallback((event: DeviceOrientationEvent) => {
        hasAbsolute.current = true;
        // Remove the non-absolute listener if we got an absolute one
        handleOrientationEvent(event);
    }, [handleOrientationEvent]);

    // Start compass sensors
    const startCompass = useCallback(async () => {
        setSensorStatus('requesting');

        try {
            // Check if we need iOS-style permission request
            const DOE = DeviceOrientationEvent as unknown as {
                requestPermission?: () => Promise<string>;
            };

            if (typeof DOE.requestPermission === 'function') {
                // iOS 13+ requires user gesture + explicit permission
                const permission = await DOE.requestPermission();
                if (permission !== 'granted') {
                    setSensorStatus('denied');
                    toast.error('Izin sensor ditolak. Aktifkan di Settings > Safari > Motion & Orientation Access');
                    return;
                }
            }

            // Cleanup previous listeners
            if (cleanupRef.current) cleanupRef.current();

            // Strategy: listen to both events, prefer absolute
            // deviceorientationabsolute is Chrome-specific but gives true north
            const absHandler = handleAbsoluteOrientation as EventListener;
            const stdHandler = handleOrientationEvent as EventListener;

            window.addEventListener('deviceorientationabsolute', absHandler, true);
            window.addEventListener('deviceorientation', stdHandler, true);

            cleanupRef.current = () => {
                window.removeEventListener('deviceorientationabsolute', absHandler, true);
                window.removeEventListener('deviceorientation', stdHandler, true);
            };

            // Set a timeout — if no data comes in 4s, sensor is likely unavailable
            setTimeout(() => {
                if (eventCount.current === 0) {
                    setSensorStatus('unavailable');
                }
            }, 4000);

        } catch (err) {
            console.error('Compass init error:', err);
            setSensorStatus('unavailable');
            toast.error('Gagal mengakses sensor kompas. Pastikan pakai HTTPS.');
        }
    }, [handleOrientationEvent, handleAbsoluteOrientation]);

    // Auto-start or prompt for gesture
    useEffect(() => {
        if (!location) return;

        const DOE = DeviceOrientationEvent as unknown as {
            requestPermission?: () => Promise<string>;
        };

        if (typeof DOE.requestPermission === 'function') {
            // iOS — needs user gesture
            setSensorStatus('needs-gesture');
        } else {
            // Android / desktop — start immediately
            startCompass();
        }

        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        };
    }, [location, startCompass]);

    // Calculate if pointing to Kaaba (within 5° tolerance)
    const angleDiff = heading !== null ? Math.abs(((heading - qiblaBearing + 180) % 360) - 180) : 999;
    const isPointingToKaaba = angleDiff < 5;
    const isNearKaaba = angleDiff < 15;

    // Vibrate when pointing to Kaaba
    useEffect(() => {
        if (isPointingToKaaba && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, [isPointingToKaaba]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-6 px-4 pb-20 h-[calc(100vh-4rem)] flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 bg-background border border-border hover:bg-muted rounded-xl transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Compass className="w-6 h-6 text-primary" /> Arah Kiblat
                    </h2>
                    <p className="text-sm text-muted-foreground">Posisi: {location ? location.city : 'Memuat...'}</p>
                </div>
                {/* Accuracy indicator */}
                {sensorStatus === 'active' && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        accuracy === 'high'
                            ? 'bg-primary/10 text-primary'
                            : accuracy === 'low'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-muted text-muted-foreground'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            accuracy === 'high' ? 'bg-primary' : accuracy === 'low' ? 'bg-yellow-500' : 'bg-muted-foreground'
                        }`} />
                        {accuracy === 'high' ? 'Akurat' : accuracy === 'low' ? 'Kalibrasi' : 'Sensor'}
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center p-5">
                {!location ? (
                    <div className="text-center p-5 rounded-2xl bg-muted/50 w-full max-w-sm">
                        <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-sm font-bold">Lokasi Belum Terdeteksi</h3>
                        <p className="text-xs text-muted-foreground mt-1">Nyalakan GPS untuk menghitung sudut Kiblat secara akurat.</p>
                    </div>
                ) : sensorStatus === 'needs-gesture' ? (
                    <div className="text-center p-5 rounded-2xl bg-muted/50 w-full max-w-sm border border-border">
                        <Smartphone className="w-10 h-10 text-primary mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-foreground">Izin Sensor Dibutuhkan</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            Tekan tombol di bawah untuk mengaktifkan sensor kompas di perangkat kamu.
                        </p>
                        <button
                            onClick={startCompass}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
                        >
                            🧭 Aktifkan Kompas
                        </button>
                    </div>
                ) : sensorStatus === 'denied' ? (
                    <div className="text-center p-5 rounded-2xl bg-destructive/10 w-full max-w-sm border border-destructive/20 text-destructive">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-sm font-bold">Izin Ditolak</h3>
                        <p className="text-xs mt-1 leading-relaxed">
                            Akses sensor kompas ditolak. Buka pengaturan browser dan izinkan akses Motion & Orientation.
                        </p>
                        <button
                            onClick={startCompass}
                            className="mt-4 w-full py-2.5 bg-destructive/20 text-destructive rounded-xl font-semibold text-sm"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : sensorStatus === 'unavailable' ? (
                    <div className="text-center p-5 rounded-2xl bg-destructive/10 w-full max-w-sm border border-destructive/20 text-destructive">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-sm font-bold">Sensor Tidak Tersedia</h3>
                        <p className="text-xs mt-1 leading-relaxed">
                            Perangkat ini tidak memiliki sensor kompas, atau browser tidak mendukung. Pastikan dibuka di HP dengan HTTPS.
                        </p>
                        <div className="mt-4 p-3 bg-background rounded-xl text-foreground text-left">
                            <p className="text-xs font-bold mb-1">Info Sudut Kiblat:</p>
                            <p className="text-2xl font-mono-timer font-bold text-primary">{Math.round(qiblaBearing)}°</p>
                            <p className="text-[10px] text-muted-foreground mt-1">dari utara (searah jarum jam)</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center">
                        {/* Status text */}
                        <p className={`text-xs font-medium uppercase tracking-widest mb-8 transition-colors duration-300 ${
                            heading === null
                                ? 'text-muted-foreground'
                                : isPointingToKaaba
                                ? 'text-primary font-bold'
                                : isNearKaaba
                                ? 'text-accent font-semibold'
                                : 'text-muted-foreground'
                        }`}>
                            {heading === null
                                ? 'Membaca Sensor...'
                                : isPointingToKaaba
                                ? '✓ Tepat Ke Arah Kiblat'
                                : isNearKaaba
                                ? 'Hampir... Putar Sedikit Lagi'
                                : 'Putar HP Anda'
                            }
                        </p>

                        {/* Compass */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Outer bezel */}
                            <div className={`absolute inset-0 rounded-full shadow-neu transition-all duration-500 ${
                                isPointingToKaaba
                                    ? 'ring-2 ring-primary shadow-[0_0_20px_rgba(107,158,125,0.3)]'
                                    : isNearKaaba
                                    ? 'ring-1 ring-accent/50'
                                    : 'bg-background'
                            }`} />

                            {heading !== null && (
                                <div
                                    className="absolute inset-5 rounded-full border-4 border-muted/50 flex items-center justify-center"
                                    style={{
                                        transform: `rotate(${-heading}deg)`,
                                        transition: 'transform 0.15s ease-out',
                                    }}
                                >
                                    {/* Degree ticks */}
                                    {Array.from({ length: 36 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute"
                                            style={{
                                                transform: `rotate(${i * 10}deg)`,
                                                transformOrigin: 'center',
                                            }}
                                        >
                                            <div
                                                className={`absolute left-1/2 -translate-x-1/2 -top-[98px] ${
                                                    i % 9 === 0
                                                        ? 'w-0.5 h-3 bg-foreground/40'
                                                        : 'w-px h-2 bg-muted-foreground/20'
                                                }`}
                                            />
                                        </div>
                                    ))}

                                    {/* North Marker */}
                                    <div className="absolute top-2 flex flex-col items-center">
                                        <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-red-500 mt-0.5">U</span>
                                    </div>

                                    {/* South Marker */}
                                    <div className="absolute bottom-2 flex flex-col items-center">
                                        <span className="text-[10px] text-muted-foreground/50 mb-0.5">S</span>
                                        <div className="w-1 h-3 bg-muted-foreground/40 rounded-full" />
                                    </div>

                                    {/* West Marker */}
                                    <div className="absolute left-2 flex flex-row items-center">
                                        <div className="w-3 h-1 bg-muted-foreground/40 rounded-full" />
                                        <span className="text-[10px] text-muted-foreground/50 ml-0.5">B</span>
                                    </div>

                                    {/* East Marker */}
                                    <div className="absolute right-2 flex flex-row items-center">
                                        <span className="text-[10px] text-muted-foreground/50 mr-0.5">T</span>
                                        <div className="w-3 h-1 bg-muted-foreground/40 rounded-full" />
                                    </div>

                                    {/* Kaaba Target Arrow (Fixed on dial at qibla bearing) */}
                                    <div
                                        className="absolute inset-0 flex flex-col items-center"
                                        style={{ transform: `rotate(${qiblaBearing}deg)` }}
                                    >
                                        <div className="-mt-5">
                                            <svg
                                                width="28" height="36" viewBox="0 0 28 36"
                                                className={`transition-all duration-300 ${
                                                    isPointingToKaaba
                                                        ? 'text-primary drop-shadow-[0_0_10px_rgba(107,158,125,0.9)]'
                                                        : isNearKaaba
                                                        ? 'text-accent'
                                                        : 'text-foreground'
                                                }`}
                                            >
                                                <path d="M14 0 L28 14 L21 14 L21 36 L7 36 L7 14 L0 14 Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Loading spinner when waiting for sensor */}
                            {heading === null && sensorStatus === 'active' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full"
                                    />
                                </div>
                            )}

                            {/* Center Kaaba icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center z-10 shadow-sm text-lg transition-all duration-300 ${
                                isPointingToKaaba ? 'bg-primary text-primary-foreground scale-110' : 'bg-background border-2 border-foreground/20'
                            }`}>
                                🕋
                            </div>
                        </div>

                        {/* Heading info */}
                        <div className="mt-10 text-center">
                            <h4 className="text-3xl font-mono-timer font-bold tracking-tight text-foreground">
                                {heading !== null ? Math.round(heading) : '--'}°
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Kiblat di angka <strong className="text-primary">{Math.round(qiblaBearing)}°</strong>
                            </p>
                        </div>

                        {/* Calibration Tip */}
                        <AnimatePresence>
                            {showCalibration && accuracy === 'low' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="mt-6 w-full max-w-xs"
                                >
                                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <RotateCcw className="w-4 h-4 text-accent" />
                                            <p className="text-xs font-bold text-accent">Kalibrasi Kompas</p>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                                            Gerakkan HP membentuk angka 8 di udara beberapa kali untuk meningkatkan akurasi sensor.
                                        </p>
                                        <button
                                            onClick={() => setShowCalibration(false)}
                                            className="mt-2 text-[10px] text-accent font-semibold hover:underline"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
