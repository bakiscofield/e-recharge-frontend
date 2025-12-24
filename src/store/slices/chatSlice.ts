import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversations: any[];
  currentConversation: any;
  messages: any[];
  isConnected: boolean;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isConnected: false,
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
  },
});

export const { setConnected, setConversations, setCurrentConversation, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
