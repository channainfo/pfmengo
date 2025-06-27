import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Match, SparkEvent, CompatibilityReport } from '../../types';
import { matchingAPI, eventsAPI } from '../../services/api';

interface MatchingState {
  dailyMatches: Match[];
  tonightMatches: Match[];
  events: SparkEvent[];
  tonightEvents: SparkEvent[];
  compatibilityReport: CompatibilityReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  dailyMatches: [],
  tonightMatches: [],
  events: [],
  tonightEvents: [],
  compatibilityReport: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getDailyMatches = createAsyncThunk(
  'matching/getDailyMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchingAPI.getDailyMatches();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

export const getTonightMatches = createAsyncThunk(
  'matching/getTonightMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchingAPI.getTonightMatches();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tonight matches');
    }
  }
);

export const likeUser = createAsyncThunk(
  'matching/likeUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await matchingAPI.likeUser(targetUserId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like user');
    }
  }
);

export const passUser = createAsyncThunk(
  'matching/passUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await matchingAPI.passUser(targetUserId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to pass user');
    }
  }
);

export const superLike = createAsyncThunk(
  'matching/superLike',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await matchingAPI.superLike(targetUserId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to super like user');
    }
  }
);

// Events (Spark tier)
export const getEvents = createAsyncThunk(
  'matching/getEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getEvents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const getTonightEvents = createAsyncThunk(
  'matching/getTonightEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getTonightEvents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tonight events');
    }
  }
);

export const joinEvent = createAsyncThunk(
  'matching/joinEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.joinEvent(eventId);
      return { eventId, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join event');
    }
  }
);

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.dailyMatches = state.dailyMatches.filter(match => match.id !== action.payload);
      state.tonightMatches = state.tonightMatches.filter(match => match.id !== action.payload);
    },
    setCompatibilityReport: (state, action: PayloadAction<CompatibilityReport>) => {
      state.compatibilityReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Daily matches
    builder
      .addCase(getDailyMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDailyMatches.fulfilled, (state, action: PayloadAction<Match[]>) => {
        state.isLoading = false;
        state.dailyMatches = action.payload;
        state.error = null;
      })
      .addCase(getDailyMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Tonight matches
    builder
      .addCase(getTonightMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTonightMatches.fulfilled, (state, action: PayloadAction<Match[]>) => {
        state.isLoading = false;
        state.tonightMatches = action.payload;
        state.error = null;
      })
      .addCase(getTonightMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Events
    builder
      .addCase(getEvents.fulfilled, (state, action: PayloadAction<SparkEvent[]>) => {
        state.events = action.payload;
      })
      .addCase(getTonightEvents.fulfilled, (state, action: PayloadAction<SparkEvent[]>) => {
        state.tonightEvents = action.payload;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        const event = state.events.find(e => e.id === eventId);
        if (event) {
          event.currentAttendees += 1;
        }
        const tonightEvent = state.tonightEvents.find(e => e.id === eventId);
        if (tonightEvent) {
          tonightEvent.currentAttendees += 1;
        }
      });

    // User actions
    builder
      .addCase(likeUser.fulfilled, (state, action) => {
        if (action.payload.matched) {
          // Handle new match notification
        }
      })
      .addCase(likeUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(passUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(superLike.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, removeMatch, setCompatibilityReport } = matchingSlice.actions;
export default matchingSlice.reducer;