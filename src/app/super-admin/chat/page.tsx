'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Search,
  Paperclip,
  Check,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io, { Socket } from 'socket.io-client';

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

export default function SuperAdminChatPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialiser WebSocket
  useEffect(() => {
    if (!user) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
      query: { userId: user.id },
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('new_message', (message: Message) => {
      if (selectedConversation && message) {
        setMessages((prev) => {
          // Si c'est notre propre message, remplacer le message optimiste temporaire
          if (message.senderId === user.id) {
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
      }
      // Rafraîchir la liste des conversations
      loadConversations();
    });

    newSocket.on('new_client_message', (data) => {
      console.log('New client message:', data);
      toast.success(`Nouveau message de ${data.sender.firstName} ${data.sender.lastName}`);
      loadConversations();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedConversation]);

  // Charger les conversations
  const loadConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);

      // Rejoindre la room WebSocket
      if (socket) {
        socket.emit('join_conversation', { conversationId });
        socket.emit('mark_read', { conversationId, userId: user?.id });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  // Sélectionner une conversation
  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  // Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    const messageContent = newMessage.trim();

    try {
      if (socket) {
        // Créer un message optimiste pour affichage immédiat
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          content: messageContent,
          senderId: user.id,
          createdAt: new Date().toISOString(),
          isRead: false,
          sender: {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            avatar: user.avatar,
          },
        };

        // Ajouter le message immédiatement à l'affichage
        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        // Envoyer au serveur
        socket.emit('send_message', {
          conversationId: selectedConversation.id,
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

  // Filtrer les conversations
  const filteredConversations = conversations.filter((conv) =>
    `${conv.client.firstName} ${conv.client.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="h-[calc(100vh-80px)] flex">
        {/* Liste des conversations */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              Conversations clients
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune conversation</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((conv) => {
                  const lastMessage = conv.messages[0];
                  const unreadCount = conv.messages.filter(
                    (m) => !m.isRead && m.senderId !== user?.id
                  ).length;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conv.client.firstName[0]}
                          {conv.client.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conv.client.firstName} {conv.client.lastName}
                            </h3>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-gray-600 truncate">
                              {lastMessage.content}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(conv.lastMessageAt).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      {conv.agent && (
                        <div className="mt-2 text-xs text-primary flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Assigné à {conv.agent.firstName}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Zone de messages */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.client.firstName[0]}
                    {selectedConversation.client.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedConversation.client.firstName}{' '}
                      {selectedConversation.client.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">Client</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => {
                    const isMe = message.senderId === user?.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMe
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          {!isMe && (
                            <p className="text-xs font-semibold mb-1 opacity-70">
                              {message.sender.firstName}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                              isMe ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
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
                <div ref={messagesEndRef} />
              </div>

              {/* Input message */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary hover:bg-primary/90 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
