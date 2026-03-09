import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Compass, AlertCircle, MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

// Kaaba coords
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

interface QiblaViewProps {
    onBack: () => void;
}

export const QiblaView = ({ onBack }: QiblaViewProps) => {
    const { location } = useLocation();
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaBearing, setQiblaBearing] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [needsPermission, setNeedsPermission] = useState(false);

    useEffect(() => {
        if (!location) return;

        const latK = KAABA_LAT * (Math.PI / 180.0);
        const lngK = KAABA_LNG * (Math.PI / 180.0);
        const phi = Number(location.latitude) * (Math.PI / 180.0);
        const lambda = Number(location.longitude) * (Math.PI / 180.0);

        const y = Math.sin(lngK - lambda);
        const x = Math.cos(phi) * Math.tan(latK) - Math.sin(phi) * Math.cos(lngK - lambda);
        let qibla = Math.atan2(y, x) * (180.0 / Math.PI);
        if (qibla < 0) qibla += 360.0;
        setQiblaBearing(qibla);
    }, [location]);

    const handleOrientation = useCallback((event: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
        if (event.webkitCompassHeading !== undefined) {
            setHeading(event.webkitCompassHeading);
        } else if (event.alpha !== null) {
            // Standard fallback (Android usually uses alpha 0 for North in absolute mode)
            // Often alpha is counter-clockwise, so we use 360 - alpha
            setHeading(360 - event.alpha);
        }
    }, [setHeading]);

    // Request permission for iOS 13+ devices
    const startCompass = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
                if (permissionState === 'granted') {
                    setNeedsPermission(false);
                    window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
                } else {
                    setError("Izin akses sensor/kompas ditolak oleh browser.");
                }
            } catch (err: unknown) {
                console.error(err);
                setError("Gagal meminta izin kompas (Pastikan memakai HTTPS).");
            }
        } else {
            // Non iOS 13+ devices
            setNeedsPermission(false);
            // Try absolute first for precise compass
            window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
            // Fallback for some browsers
            window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
        }
    }, [handleOrientation]);

    useEffect(() => {
        if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
            setNeedsPermission(true);
        } else {
            startCompass();
        }

        // Timer to show error if component mounted for 3s but still null heading and no permission prompt
        const t = setTimeout(() => {
            if (heading === null && !needsPermission && !error) {
                // If it's a desktop, deviceorientation will fire but alpha is null, or it won't fire.
                setError("Kompas tidak aktif. Pastikan dibuka di HP dan izinkan akses sensor.");
            }
        }, 3000);

        return () => {
            clearTimeout(t);
            window.removeEventListener('deviceorientation', handleOrientation, true);
            window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
        };
    }, [startCompass, needsPermission, heading, error]);

    // Difference between heading and qibla to see if we are currently pointing to Kaaba
    const isPointingToKaaba = heading !== null && Math.abs(heading - qiblaBearing) < 5;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-6 px-4 pb-20 h-[calc(100vh-4rem)] flex flex-col"
        >
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
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-5">
                {!location ? (
                    <div className="text-center p-5 rounded-2xl bg-muted/50 w-full max-w-sm">
                        <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-sm font-bold">Lokasi Belum Terdeteksi</h3>
                        <p className="text-xs text-muted-foreground mt-1">Nyalakan GPS untuk menghitung sudut Kiblat secara akurat.</p>
                    </div>
                ) : needsPermission ? (
                    <div className="text-center p-5 rounded-2xl bg-muted/50 w-full max-w-sm border border-border">
                        <Compass className="w-10 h-10 text-primary mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-foreground">Izin Sensor Dibutuhkan</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">iPhone dan Safari butuh izin manual untuk menampilkan kompas cerdas.</p>
                        <button
                            onClick={startCompass}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-sm"
                        >
                            Buka Kunci Kompas
                        </button>
                    </div>
                ) : error ? (
                    <div className="text-center p-5 rounded-2xl bg-destructive/10 w-full max-w-sm border border-destructive/20 text-destructive">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-sm font-bold">Sensor Tidak Tersedia</h3>
                        <p className="text-xs mt-1 leading-relaxed">{error}</p>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10">
                            {heading === null ? 'Mencari Sensor...' : (isPointingToKaaba ? 'Tepat Ke Arah Kiblat' : 'Putar HP Anda')}
                        </p>

                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Outer shadow / bezel */}
                            <div className={`absolute inset-0 rounded-full shadow-neu transition-shadow duration-300 ${isPointingToKaaba ? 'shadow-primary/50 ring-2 ring-primary border-primary' : 'bg-background'}`} />

                            {heading !== null && (
                                <div
                                    className="absolute inset-5 rounded-full border-4 border-muted/50 flex items-center justify-center transition-transform duration-200"
                                    style={{ transform: `rotate(${-heading}deg)` }}
                                >
                                    {/* North Marker */}
                                    <div className="absolute top-2 w-1 h-3 bg-red-500 rounded-full" />
                                    <span className="absolute top-6 text-xs font-bold text-muted-foreground">U</span>

                                    {/* South Marker */}
                                    <div className="absolute bottom-2 w-1 h-3 bg-muted-foreground rounded-full" />
                                    <span className="absolute bottom-6 text-xs text-muted-foreground opacity-50">S</span>

                                    {/* West Marker */}
                                    <div className="absolute left-2 w-3 h-1 bg-muted-foreground rounded-full" />
                                    <span className="absolute left-6 text-xs text-muted-foreground opacity-50">B</span>

                                    {/* East Marker */}
                                    <div className="absolute right-2 w-3 h-1 bg-muted-foreground rounded-full" />
                                    <span className="absolute right-6 text-xs text-muted-foreground opacity-50">T</span>

                                    {/* Kaaba Target Arrow (Fixed on dial) */}
                                    <div
                                        className="absolute inset-0 flex flex-col items-center"
                                        style={{ transform: `rotate(${qiblaBearing}deg)` }}
                                    >
                                        <div className="-mt-8">
                                            <svg width="32" height="40" viewBox="0 0 32 40" className={isPointingToKaaba ? 'text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-foreground'}>
                                                <path d="M16 0 L32 16 L24 16 L24 40 L8 40 L8 16 L0 16 Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Center Dot */}
                            <div className="w-3 h-3 bg-background border-2 border-foreground rounded-full z-10 shadow-sm" />
                        </div>

                        <div className="mt-12 text-center">
                            <h4 className="text-3xl font-mono-timer font-bold tracking-tight text-foreground">
                                {heading !== null ? Math.round(heading) : '0'}°
                            </h4>
                            <p className="text-xs text-muted-foreground">Kiblat di angka <strong className="text-primary">{Math.round(qiblaBearing)}°</strong></p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
