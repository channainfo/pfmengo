import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Match {
  id: string;
  targetUserId: string;
  isMatched: boolean;
  createdAt: string;
  targetProfile: {
    id: string;
    firstName: string;
    age: number;
    photos: string[];
    bio?: string;
  };
}

interface MatchingState {
  dailyMatches: Match[];
  tonightMatches: Match[];
  currentMatch: Match | null;
  isLoading: boolean;
  error: string | null;
  likeCount: number;
  matchCount: number;
}

const initialState: MatchingState = {
  dailyMatches: [],
  tonightMatches: [],
  currentMatch: null,
  isLoading: false,
  error: null,
  likeCount: 0,
  matchCount: 0,
};

// Async thunks
export const fetchDailyMatchesAsync = createAsyncThunk(
  'matching/fetchDailyMatches',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/matching/daily', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

export const likeUserAsync = createAsyncThunk(
  'matching/likeUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/v1/matching/like',
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like user');
    }
  }
);

export const passUserAsync = createAsyncThunk(
  'matching/passUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/v1/matching/pass',
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to pass user');
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
    setCurrentMatch: (state, action: PayloadAction<Match | null>) => {
      state.currentMatch = action.payload;
    },
    incrementLikeCount: (state) => {
      state.likeCount += 1;
    },
    incrementMatchCount: (state) => {
      state.matchCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch daily matches
      .addCase(fetchDailyMatchesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyMatchesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyMatches = action.payload;
        state.error = null;
      })
      .addCase(fetchDailyMatchesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Like user
      .addCase(likeUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likeCount += 1;
        if (action.payload.matched) {
          state.matchCount += 1;
        }
        state.error = null;
      })
      .addCase(likeUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Pass user
      .addCase(passUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(passUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(passUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentMatch, incrementLikeCount, incrementMatchCount } = matchingSlice.actions;
export default matchingSlice.reducer;