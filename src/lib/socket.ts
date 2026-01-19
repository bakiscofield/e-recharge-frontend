import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';

// Configuration optimisée pour mobile
const SOCKET_OPTIONS = {
  // Reconnection settings
  reconnection: true,
  reconnectionAttempts: Infinity, // Toujours essayer de se reconnecter
  reconnectionDelay: 1000, // Délai initial de 1s
  reconnectionDelayMax: 5000, // Délai max de 5s
  randomizationFactor: 0.5, // Ajouter un peu de randomisation

  // Timeout settings
  timeout: 20000, // 20 secondes pour la connexion initiale

  // Transport settings
  transports: ['websocket', 'polling'], // Préférer websocket, fallback sur polling
  upgrade: true,

  // Heartbeat settings (ping/pong)
  pingTimeout: 30000, // 30 secondes avant de considérer la connexion morte
  pingInterval: 25000, // Ping toutes les 25 secondes

  // Auto reconnect sur fermeture
  autoConnect: true,
  forceNew: false,
};

// Créer une instance de socket avec les options optimisées
export const createSocket = (userId: string): Socket => {
  const socket = io(SOCKET_URL, {
    ...SOCKET_OPTIONS,
    query: { userId },
    auth: {
      token: localStorage.getItem('token'),
    },
  });

  // Gestion de la visibilité de la page (important pour mobile)
  if (typeof document !== 'undefined') {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page visible, s'assurer que le socket est connecté
        if (!socket.connected) {
          console.log('Page visible, reconnecting socket...');
          socket.connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Nettoyer l'event listener quand le socket est déconnecté
    socket.on('disconnect', () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  }

  // Gestion de la connexion/déconnexion réseau
  if (typeof window !== 'undefined') {
    const handleOnline = () => {
      console.log('Network online, reconnecting socket...');
      if (!socket.connected) {
        socket.connect();
      }
    };

    const handleOffline = () => {
      console.log('Network offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    socket.on('disconnect', () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });
  }

  // Logging pour debug
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    // Si le serveur a fermé la connexion, tenter de se reconnecter
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.log('Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Socket reconnect attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.log('Socket reconnect error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.log('Socket reconnect failed after all attempts');
  });

  return socket;
};

export default createSocket;
