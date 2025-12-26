import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversations: any[];
  currentConversation: any;
  messages: any[];
  isConnected: boolean;
  unreadCount: number;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isConnected: false,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setConversations: (state, action: PayloadAction<any[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<any>) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setConnected,
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  setUnreadCount,
  incrementUnreadCount,
  resetUnreadCount
} = chatSlice.actions;
export default chatSlice.reducer;
