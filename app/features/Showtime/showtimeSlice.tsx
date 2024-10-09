import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Showtime } from '@/app/model/Showtime';
import { addShowtime, deleteShowtime, getAllShowtimes, getShowtimeById, getShowtimesByMovieAndRoom, getShowtimesByMovieId, getShowtimesByRoomId, updateShowtime } from './showtimeFirebaseService';

// Khởi tạo state ban đầu
interface ShowtimeState {
    showtimes: Showtime[];
    loading: boolean;
    error: string | null;
}

const initialState: ShowtimeState = {
    showtimes: [],
    loading: false,
    error: null,
};

// Async Thunk để lấy tất cả Showtimes từ Firestore
export const fetchShowtimes = createAsyncThunk(
    'showtime/fetchShowtimes',
    async (_, { rejectWithValue }) => {
        try {
            const showtimes = await getAllShowtimes();
            return showtimes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchShowtimesByRoomId = createAsyncThunk(
    'showtime/fetchShowtimesByRoomId',
    async (roomId: string, { rejectWithValue }) => {
        try {
            const showtimes = await getShowtimesByRoomId(roomId);
            return showtimes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm Showtime mới vào Firestore
export const addNewShowtime = createAsyncThunk(
    'showtime/addNewShowtime',
    async (showtime: Showtime, { rejectWithValue }) => {
        try {
            await addShowtime(showtime);
            return showtime; // Trả về Showtime mới sau khi thêm thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để cập nhật Showtime trong Firestore
export const editShowtime = createAsyncThunk(
    'showtime/editShowtime',
    async (showtime: Showtime, { rejectWithValue }) => {
        try {
            await updateShowtime(showtime);
            return showtime; // Trả về Showtime đã cập nhật
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để xóa Showtime khỏi Firestore
export const removeShowtime = createAsyncThunk(
    'showtime/removeShowtime',
    async (showtimeId: string, { rejectWithValue }) => {
        try {
            await deleteShowtime(showtimeId);
            return showtimeId; // Trả về ID của Showtime đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


// Thunk để lấy danh sách showtimes theo movieID và screeningRoomID
export const fetchShowtimesByMovieAndRoom = createAsyncThunk(
    'showtime/fetchShowtimesByMovieAndRoom',
    async (
        { movieID, screeningRoomID }: { movieID: string; screeningRoomID: string },
        { rejectWithValue }
    ) => {
        try {
            const showtimes = await getShowtimesByMovieAndRoom(movieID, screeningRoomID);
            return showtimes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchShowtimesByMovieId = createAsyncThunk(
    'showtime/fetchShowtimesByMovieId',
    async (movieId: string, { rejectWithValue }) => {
        try {
            const showtimes = await getShowtimesByMovieId(movieId);
            return showtimes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchShowtimesId = createAsyncThunk(
    'showtime/fetchShowtimesId',
    async (showtimesId: string, { rejectWithValue }) => {
        try {
            const showtimes = await getShowtimeById(showtimesId);
            return showtimes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);




// Slice chứa reducer và action cho Showtime
const showtimeSlice = createSlice({
    name: 'showtime',
    initialState,
    reducers: {
        // Bạn có thể thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả Showtimes
        builder.addCase(fetchShowtimes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchShowtimes.fulfilled, (state, action: PayloadAction<Showtime[]>) => {
            state.loading = false;
            state.showtimes = action.payload;
        });
        builder.addCase(fetchShowtimes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm Showtime mới
        builder.addCase(addNewShowtime.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewShowtime.fulfilled, (state, action: PayloadAction<Showtime>) => {
            state.loading = false;
            state.showtimes.push(action.payload);
        });
        builder.addCase(addNewShowtime.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật Showtime
        builder.addCase(editShowtime.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editShowtime.fulfilled, (state, action: PayloadAction<Showtime>) => {
            state.loading = false;
            const index = state.showtimes.findIndex((showtime) => showtime.id === action.payload.id);
            if (index !== -1) {
                state.showtimes[index] = action.payload;
            }
        });
        builder.addCase(editShowtime.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa Showtime
        builder.addCase(removeShowtime.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeShowtime.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.showtimes = state.showtimes.filter((showtime) => showtime.id !== action.payload);
        });
        builder.addCase(removeShowtime.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy showtimes theo ID phòng
        builder.addCase(fetchShowtimesByRoomId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchShowtimesByRoomId.fulfilled, (state, action: PayloadAction<Showtime[]>) => {
            state.loading = false;
            state.showtimes = action.payload;
        });
        builder.addCase(fetchShowtimesByRoomId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });


        // Lấy showtimes theo ID 
        // Fetch showtimes by ID
        builder.addCase(fetchShowtimesId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchShowtimesId.fulfilled, (state, action: PayloadAction<Showtime>) => {
            state.loading = false;
            // Update or add the showtime based on your application's logic
            const index = state.showtimes.findIndex(showtime => showtime.id === action.payload.id);
            if (index !== -1) {
                state.showtimes[index] = action.payload; // Update existing showtime
            } else {
                state.showtimes.push(action.payload); // Or add it if not found
            }
        });


        builder.addCase(fetchShowtimesId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy showtimes theo movieID và screeningRoomID
        builder.addCase(fetchShowtimesByMovieAndRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchShowtimesByMovieAndRoom.fulfilled, (state, action: PayloadAction<Showtime[]>) => {
            state.loading = false;
            state.showtimes = action.payload;
        });
        builder.addCase(fetchShowtimesByMovieAndRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        // Fetch showtimes by movie ID
        builder.addCase(fetchShowtimesByMovieId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchShowtimesByMovieId.fulfilled, (state, action: PayloadAction<Showtime[]>) => {
            state.loading = false;
            state.showtimes = action.payload;
        });
        builder.addCase(fetchShowtimesByMovieId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default showtimeSlice.reducer;
