import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado con éxito:', registration);
            
            // Mantener la app activa enviando mensajes periódicos
            const keepAlive = () => {
              if (registration.active) {
                const channel = new MessageChannel();
                registration.active.postMessage({
                  type: 'KEEP_ALIVE'
                }, [channel.port2]);
              }
            };

            // Enviar keep-alive cada 30 segundos
            setInterval(keepAlive, 30000);
          })
          .catch((error) => {
            console.log('SW falló al registrarse:', error);
          });
      });
    }
  }, []);
};