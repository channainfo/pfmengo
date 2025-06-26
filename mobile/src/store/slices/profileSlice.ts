import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfilePhoto } from '../../types';
import { profileAPI } from '../../services/api';

interface ProfileState {
  currentProfile: Profile | null;
  viewedProfile: Profile | null;
  photos: ProfilePhoto[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  viewedProfile: null,
  photos: [],
  isLoading: false,
  isUploading: false,
  error: null,
};

// Async thunks
export const getCurrentProfile = createAsyncThunk(
  'profile/getCurrentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getCurrentProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (profileId: string, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfile(profileId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateBasicProfile = createAsyncThunk(
  'profile/updateBasicProfile',
  async (updateData: Partial<Profile>, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateBasicProfile(updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  'profile/uploadPhoto',
  async (photoData: { uri: string; type: string }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.uploadMedia(photoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
    }
  }
);

export const deletePhoto = createAsyncThunk(
  'profile/deletePhoto',
  async (photoId: string, { rejectWithValue }) => {
    try {
      await profileAPI.deleteMedia(photoId);
      return photoId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete photo');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
    updatePhoto: (state, action: PayloadAction<ProfilePhoto>) => {
      const index = state.photos.findIndex(photo => photo.id === action.payload.id);
      if (index !== -1) {
        state.photos[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Get current profile
    builder
      .addCase(getCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.photos = action.payload.photos || [];
        state.error = null;
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.viewedProfile = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update basic profile
    builder
      .addCase(updateBasicProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBasicProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(updateBasicProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload photo
    builder
      .addCase(uploadPhoto.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<ProfilePhoto>) => {
        state.isUploading = false;
        state.photos.push(action.payload);
        state.error = null;
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Delete photo
    builder
      .addCase(deletePhoto.fulfilled, (state, action: PayloadAction<string>) => {
        state.photos = state.photos.filter(photo => photo.id !== action.payload);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearViewedProfile, updatePhoto } = profileSlice.actions;
export default profileSlice.reducer;