import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Performer } from '@/app/model/Performer';
import { addPerformer, deletePerformer, getAllPerformers, getPerformersByIds, updatePerformer } from './PerformerFirebaseService';

// Initial state for Performer
interface PerformerState {
    performerList: Performer[];
    loading: boolean;
    error: string | null;
}

const initialState: PerformerState = {
    performerList: [],
    loading: false,
    error: null,
};

// Async Thunk to fetch all Performers from Firestore
export const fetchAllPerformers = createAsyncThunk(
    'performers/fetchAllPerformers',
    async (_, { rejectWithValue }) => {
        try {
            const performers = await getAllPerformers();
            return performers;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to fetch Performers by a list of IDs
export const fetchPerformersByIds = createAsyncThunk(
    'performers/fetchPerformersByIds',
    async (performerIds: string[], { rejectWithValue }) => {
        try {
            const performers = await getPerformersByIds(performerIds);
            return performers;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to add a new Performer to Firestore
export const addNewPerformer = createAsyncThunk(
    'performers/addNewPerformer',
    async (performer: Performer, { rejectWithValue }) => {
        try {
            await addPerformer(performer);
            return performer;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to update a Performer in Firestore
export const editPerformer = createAsyncThunk(
    'performers/editPerformer',
    async (performer: Performer, { rejectWithValue }) => {
        try {
            await updatePerformer(performer);
            return performer;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to delete a Performer from Firestore
export const removePerformer = createAsyncThunk(
    'performers/removePerformer',
    async (performerId: string, { rejectWithValue }) => {
        try {
            await deletePerformer(performerId);
            return performerId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice containing the reducer and actions for Performer
const performerSlice = createSlice({
    name: 'performers',
    initialState,
    reducers: {
        // Add synchronous reducers if needed
    },
    extraReducers: (builder) => {
        // Fetch all Performers
        builder.addCase(fetchAllPerformers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllPerformers.fulfilled, (state, action) => {
            state.loading = false;
            state.performerList = action.payload;
        });
        builder.addCase(fetchAllPerformers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Performers by IDs
        builder.addCase(fetchPerformersByIds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPerformersByIds.fulfilled, (state, action) => {
            state.loading = false;
            state.performerList = action.payload;
        });
        builder.addCase(fetchPerformersByIds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Add new Performer
        builder.addCase(addNewPerformer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewPerformer.fulfilled, (state, action) => {
            state.loading = false;
            state.performerList.push(action.payload);
        });
        builder.addCase(addNewPerformer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Edit Performer
        builder.addCase(editPerformer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editPerformer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.performerList.findIndex((performer) => performer.id === action.payload.id);
            if (index !== -1) {
                state.performerList[index] = action.payload;
            }
        });
        builder.addCase(editPerformer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Remove Performer
        builder.addCase(removePerformer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removePerformer.fulfilled, (state, action) => {
            state.loading = false;
            state.performerList = state.performerList.filter((performer) => performer.id !== action.payload);
        });
        builder.addCase(removePerformer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default performerSlice.reducer;
