import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    addScreeningRoom,
    deleteScreeningRoom,
    getAllScreeningRooms,
    getScreeningRoomById,
    getScreeningRoomsByIds,
    updateScreeningRoom
} from './screeningFirebaseService';
import { ScreeningRoom } from '@/app/model/ScreeningRoom ';

// Initial state for the screening room
interface ScreeningRoomState {
    screeningRooms: ScreeningRoom[];
    loading: boolean;
    error: string | null;
}

const initialState: ScreeningRoomState = {
    screeningRooms: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all screening rooms from Firestore
export const fetchScreeningRooms = createAsyncThunk(
    'screeningRoom/fetchScreeningRooms',
    async (_, { rejectWithValue }) => {
        try {
            const screeningRooms = await getAllScreeningRooms();
            return screeningRooms;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to add a new screening room
export const addNewScreeningRoom = createAsyncThunk(
    'screeningRoom/addNewScreeningRoom',
    async (screeningRoom: ScreeningRoom, { rejectWithValue }) => {
        try {
            await addScreeningRoom(screeningRoom);
            return screeningRoom; // Return the newly added screening room
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch a screening room by ID
export const fetchScreeningRoomById = createAsyncThunk(
    'screeningRoom/fetchScreeningRoomById',
    async (id: string, { rejectWithValue }) => {
        try {
            const screeningRoom = await getScreeningRoomById(id);
            if (!screeningRoom) {
                throw new Error('Screening room not found');
            }
            return screeningRoom; // Return the screening room
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update a screening room
export const editScreeningRoom = createAsyncThunk(
    'screeningRoom/editScreeningRoom',
    async (screeningRoom: ScreeningRoom, { rejectWithValue }) => {
        try {
            await updateScreeningRoom(screeningRoom);
            return screeningRoom; // Return the updated screening room
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to remove a screening room
export const removeScreeningRoom = createAsyncThunk(
    'screeningRoom/removeScreeningRoom',
    async (screeningRoomId: string, { rejectWithValue }) => {
        try {
            await deleteScreeningRoom(screeningRoomId);
            return screeningRoomId; // Return the ID of the deleted screening room
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch screening rooms by a list of IDs
export const fetchScreeningRoomsByIds = createAsyncThunk(
    'screeningRoom/fetchScreeningRoomsByIds',
    async (screeningRoomIds: string[], { rejectWithValue }) => {
        try {
            const screeningRooms = await getScreeningRoomsByIds(screeningRoomIds);
            return screeningRooms; // Return the list of screening rooms
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Create a slice for screening rooms
const screeningRoomSlice = createSlice({
    name: 'screeningRoom',
    initialState,
    reducers: {
        // Add any synchronous reducers here if needed
    },
    extraReducers: (builder) => {
        // Handle fetching all screening rooms
        builder.addCase(fetchScreeningRooms.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchScreeningRooms.fulfilled, (state, action) => {
            state.loading = false;
            state.screeningRooms = action.payload; // Update state with the fetched screening rooms
        });
        builder.addCase(fetchScreeningRooms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });

        // Handle adding a new screening room
        builder.addCase(addNewScreeningRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewScreeningRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.screeningRooms.push(action.payload); // Add the new screening room to the state
        });
        builder.addCase(addNewScreeningRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });

        // Handle updating a screening room
        builder.addCase(editScreeningRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editScreeningRoom.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.screeningRooms.findIndex((room) => room.id === action.payload.id);
            if (index !== -1) {
                state.screeningRooms[index] = action.payload; // Update existing screening room
            }
        });
        builder.addCase(editScreeningRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });

        // Handle removing a screening room
        builder.addCase(removeScreeningRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeScreeningRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.screeningRooms = state.screeningRooms.filter((room) => room.id !== action.payload); // Remove screening room from state
        });
        builder.addCase(removeScreeningRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });

        // Handle fetching a screening room by ID
        builder.addCase(fetchScreeningRoomById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchScreeningRoomById.fulfilled, (state, action: PayloadAction<ScreeningRoom>) => {
            state.loading = false;
            const index = state.screeningRooms.findIndex(screeningRoom => screeningRoom.id === action.payload.id);
            if (index !== -1) {
                state.screeningRooms[index] = action.payload; // Update existing screening room
            } else {
                state.screeningRooms.push(action.payload); // Or add it if not found
            }
        });
        builder.addCase(fetchScreeningRoomById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });

        // Handle fetching screening rooms by IDs
        builder.addCase(fetchScreeningRoomsByIds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchScreeningRoomsByIds.fulfilled, (state, action) => {
            state.loading = false;
            state.screeningRooms = action.payload; // Update state with the list of screening rooms
        });
        builder.addCase(fetchScreeningRoomsByIds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Set the error message
        });
    },
});

export default screeningRoomSlice.reducer;
