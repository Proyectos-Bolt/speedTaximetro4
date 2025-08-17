import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkIfInstalled();

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar el prompt después de un breve delay si no está instalada
      if (!isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    // Escuchar cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
    } else {
      console.log('Usuario rechazó instalar la PWA');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // No mostrar de nuevo en esta sesión
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // No mostrar si ya está instalada o fue rechazada en esta sesión
  if (isInstalled || !showInstallPrompt || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-xl shadow-2xl border-2 border-yellow-300 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <Smartphone className="w-6 h-6 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">¡Instala Speed Cabs!</h3>
              <p className="text-xs opacity-90">
                Instala la app para usarla sin conexión y acceso rápido
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-black text-yellow-400 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg font-bold text-sm hover:bg-black/10 transition-colors"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;