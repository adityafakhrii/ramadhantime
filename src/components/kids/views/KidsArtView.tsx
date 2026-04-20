import { FC } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { Palette, UploadCloud, HeartHandshake } from 'lucide-react';

const KidsArtView: FC<{ character: KidsCharacter }> = ({ character }) => {
    return (
        <div className="absolute inset-0 bg-[#fffbeb] pt-24 pb-32 px-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-2xl">
                    <Palette className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Militan Akyash</h2>
                    <p className="text-sm text-amber-700/70 font-medium">Upload karya senimu di sini!</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Upload Karya Widget */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-800">Karya Seni</h3>
                        <Palette className="text-amber-300 w-6 h-6" />
                    </div>
                    <div className="border-2 border-dashed border-amber-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-amber-50 transition-colors bg-[#fefdf8]">
                        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center shadow-inner">
                            <UploadCloud className="w-6 h-6 text-amber-600" />
                        </div>
                        <p className="font-bold text-slate-600 mt-2">Ketuk untuk unggah fotomu</p>
                        <p className="text-xs text-slate-400">Pamerkan karyamu ke teman-teman!</p>
                    </div>
                </div>

                {/* Donasi Widget */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-400 p-6 rounded-3xl shadow-md text-white border border-rose-300 relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">Donasi</h3>
                        <HeartHandshake className="text-white/80 w-6 h-6" />
                    </div>
                    <p className="text-sm text-rose-100 mb-5 leading-relaxed">Berbagi kebaikan dengan teman-teman yang membutuhkan melalui program Militan Akyash.</p>
                    <button className="w-full py-3 bg-white text-rose-600 rounded-xl font-extrabold shadow-sm hover:bg-rose-50 transition-colors uppercase tracking-widest text-sm">
                        Mulai Donasi
                    </button>
                </div>
            </div>
        </div>
    )
}
export default KidsArtView;
