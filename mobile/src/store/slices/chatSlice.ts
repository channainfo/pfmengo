import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '../../types';
import { chatAPI } from '../../services/api';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isLoadingMessages: false,
  error: null,
};

// Async thunks
export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    messageData: {
      conversationId: string;
      content: {
        text?: string;
        mediaUrl?: string;
      };
      messageType: 'text' | 'image' | 'video' | 'audio';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.sendMessage(messageData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      // Update last message in conversation
      const conversation = state.conversations.find(
        c => c.id === action.payload.conversationId
      );
      if (conversation) {
        conversation.lastMessage = action.payload;
        conversation.messageCount += 1;
      }
    },
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.readAt = new Date().toISOString();
      }
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Get conversations
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.error = null;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get messages
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.isLoadingMessages = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
        // Update conversation
        const conversation = state.conversations.find(
          c => c.id === action.payload.conversationId
        );
        if (conversation) {
          conversation.lastMessage = action.payload;
          conversation.messageCount += 1;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentConversation,
  clearCurrentConversation,
  addMessage,
  markMessageAsRead,
  updateConversation,
} = chatSlice.actions;

export default chatSlice.reducer;