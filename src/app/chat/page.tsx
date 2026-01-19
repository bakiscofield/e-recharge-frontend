'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { resetUnreadCount } from '@/store/slices/chatSlice';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Paperclip,
  Check,
  CheckCheck,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/socket';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
}

interface Conversation {
  id: string;
  clientId: string;
  agentId?: string;
  lastMessageAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  messages: Message[];
}

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialiser WebSocket
  useEffect(() => {
    if (!user) return;

    const newSocket = createSocket(user.id);

    // Le logging de connexion est déjà géré dans createSocket

    newSocket.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      setMessages((prev) => {
        // Si c'est notre propre message, remplacer le message optimiste temporaire
        if (message.senderId === user.id) {
          // Trouver et remplacer le message temporaire le plus récent
          const tempMessageIndex = prev.findIndex(
            (m) => m.senderId === user.id && m.id.startsWith('temp-')
          );
          if (tempMessageIndex !== -1) {
            const updated = [...prev];
            updated[tempMessageIndex] = message;
            return updated;
          }
        }
        // Sinon, ajouter le nouveau message normalement
        return [...prev, message];
      });
      // Marquer comme lu si le message n'est pas de moi
      if (message.senderId !== user.id && conversation) {
        newSocket.emit('mark_read', { conversationId: conversation.id, userId: user.id });
      }
    });

    newSocket.on('admin_joined', (data) => {
      toast.success(`${data.agent.firstName} a rejoint la conversation`);
      loadConversation();
    });

    newSocket.on('conversation_closed', () => {
      toast('Cette conversation a été fermée par le support', { icon: 'ℹ️' });
      // Réinitialiser pour créer une nouvelle conversation
      setConversation(null);
      setMessages([]);
      // Recharger pour créer une nouvelle conversation
      setTimeout(() => loadConversation(), 1000);
    });

    newSocket.on('message_error', (data) => {
      toast.error(data.error || 'Erreur lors de l\'envoi du message');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, conversation?.id]);

  // Charger ou créer la conversation
  const loadConversation = async () => {
    try {
      const response = await api.get('/chat/conversations/my-conversation');
      setConversation(response.data);

      if (response.data) {
        loadMessages(response.data.id);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Créer une nouvelle conversation
        try {
          const createResponse = await api.post('/chat/conversations');
          setConversation(createResponse.data);
          // Charger les messages de la conversation (au cas où elle existait déjà)
          if (createResponse.data?.id) {
            loadMessages(createResponse.data.id);
          } else {
            setMessages([]);
          }
        } catch (createError) {
          console.error('Error creating conversation:', createError);
          toast.error('Erreur lors de la création de la conversation');
        }
      } else {
        console.error('Error loading conversation:', error);
        toast.error('Erreur lors du chargement de la conversation');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
    // Réinitialiser le compteur de messages non lus quand on ouvre le chat
    dispatch(resetUnreadCount());
  }, [dispatch]);

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  // Rejoindre la room WebSocket quand le socket et la conversation sont prêts
  useEffect(() => {
    if (socket && conversation?.id) {
      console.log('Joining conversation room:', conversation.id);
      socket.emit('join_conversation', { conversationId: conversation.id });
      socket.emit('mark_read', { conversationId: conversation.id, userId: user?.id });
    }
  }, [socket, conversation?.id, user?.id]);

  // Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return;

    setSending(true);
    const messageContent = newMessage.trim();

    try {
      if (socket) {
        // Créer un message optimiste pour affichage immédiat
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`, // ID temporaire
          content: messageContent,
          senderId: user.id,
          createdAt: new Date().toISOString(),
          isRead: false,
          sender: {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            avatar: user.avatar,
            role: user.role,
          },
        };

        // Ajouter le message immédiatement à l'affichage
        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        // Envoyer au serveur
        socket.emit('send_message', {
          conversationId: conversation.id,
          senderId: user.id,
          content: messageContent,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  // Scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Support Client</h2>
                <p className="text-sm sm:text-base text-white/90">
                  {conversation?.agent
                    ? `Agent: ${conversation.agent.firstName} ${conversation.agent.lastName}`
                    : 'Notre équipe est disponible pour vous répondre'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Fermer"
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle className="h-16 w-16 sm:h-20 sm:w-20 mb-4 opacity-20" />
              <p className="text-base sm:text-lg text-center px-4">
                Bienvenue ! Envoyez un message pour démarrer la conversation.
              </p>
              <p className="text-xs sm:text-sm mt-2 text-center px-4">
                Notre équipe vous répondra dans les plus brefs délais.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => {
                const isMe = message.senderId === user?.id;
                const isAdmin = message.sender.role === 'ADMIN' || message.sender.role === 'SUPER_ADMIN';

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                        isMe
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                          <p className="text-xs sm:text-sm font-semibold opacity-70">
                            {message.sender.firstName} {message.sender.lastName}
                            {isAdmin && ' (Support)'}
                          </p>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
                        {message.content}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          isMe ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
                          <>
                            {message.isRead ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input message */}
        <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Écrivez votre message..."
                rows={1}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-primary hover:bg-primary/90 text-white p-2.5 sm:p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
