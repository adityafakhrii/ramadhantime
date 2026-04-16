import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Moon, Sun, Bell, MapPin, Smartphone, Info, LogOut, ChevronRight, X, Shield } from 'lucide-react';

interface ProfileMenuProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const ProfileMenu = ({ isDark, onToggleTheme, onOpenSettings }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: User, label: 'Profil Saya', action: () => { setOpen(false); /* dummy */ }, color: 'text-primary' },
    { icon: Settings, label: 'Pengaturan', action: () => { setOpen(false); onOpenSettings(); }, color: 'text-foreground' },
    { icon: isDark ? Sun : Moon, label: isDark ? 'Mode Terang' : 'Mode Gelap', action: () => { onToggleTheme(); }, color: 'text-foreground' },
    { icon: Bell, label: 'Notifikasi', action: () => { setOpen(false); }, color: 'text-foreground' },
    { icon: Shield, label: 'Privasi & Keamanan', action: () => { setOpen(false); }, color: 'text-foreground' },
    { icon: Info, label: 'Tentang Aplikasi', action: () => { setOpen(false); }, color: 'text-foreground' },
  ];

  return (
    <>
      {/* Profile avatar button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full bg-background shadow-neu-sm hover:opacity-90 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm select-none">
          😊
        </div>
        <span className="text-xs font-semibold text-foreground hidden sm:block">Ahmad</span>
      </button>

      {/* Menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-background shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Menu</h3>
                  <button onClick={() => setOpen(false)} className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* User card */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl select-none">
                    😊
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Ahmad Fauzi</p>
                    <p className="text-xs text-muted-foreground">ahmad.fauzi@email.com</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <div className="space-y-1">
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/30 transition-colors text-left"
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-border/30">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
