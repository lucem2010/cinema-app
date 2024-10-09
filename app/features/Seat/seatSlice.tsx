import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    addSeats,
    deleteSeat,
    getAllSeats,
    getSeatsByIds, // Import the new function
    getSeatsByScreeningId,
    updateSeatIsSet,
    updateSeatStatus
} from './seatFirebaseService'; // Đảm bảo đường dẫn chính xác đến dịch vụ Firebase của bạn
import { Seat } from '@/app/model/Seat';

// Khởi tạo state ban đầu
interface SeatState {
    seats: Seat[];
    loading: boolean;
    error: string | null;
    seatsByScreeningId: Record<string, Seat[]>; // Thêm state để lưu danh sách ghế theo ScreeningID
    fetchedSeatsByIdss: Record<string, Seat | null>; // Thêm state để lưu ghế theo ID
}

const initialState: SeatState = {
    seats: [],
    loading: false,
    error: null,
    seatsByScreeningId: {}, // Khởi tạo rỗng
    fetchedSeatsByIdss: {}, // Khởi tạo rỗng
};

// Async Thunk để lấy tất cả Seats từ Firestore
export const fetchSeats = createAsyncThunk(
    'seat/fetchSeats',
    async (_, { rejectWithValue }) => {
        try {
            const seats = await getAllSeats();
            return seats;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm Seat mới vào Firestore
export const addNewSeats = createAsyncThunk(
    'seat/addNewSeats',
    async (seats: Seat[], { rejectWithValue }) => {
        try {
            await addSeats(seats); // Thực hiện thêm ghế mới vào Firestore
            return seats;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeSeat = createAsyncThunk(
    'seat/removeSeat',
    async (seatId: string, { rejectWithValue }) => {
        try {
            await deleteSeat(seatId);
            return seatId; // Trả về ID của Seat đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy danh sách Seats theo ScreeningID
export const fetchSeatsByScreeningId = createAsyncThunk(
    'seat/fetchSeatsByScreeningId',
    async (screeningId: string, { rejectWithValue }) => {
        try {
            const seats = await getSeatsByScreeningId(screeningId);
            return { screeningId, seats }; // Trả về object bao gồm ScreeningID và danh sách ghế
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy danh sách Seats theo danh sách ID
export const fetchSeatsByIds = createAsyncThunk(
    'seat/fetchSeatsByIds',
    async (seatIds: string[], { rejectWithValue }) => {
        try {
            const seats = await getSeatsByIds(seatIds); // Gọi hàm mới để lấy danh sách ghế theo ID
            return { seatIds, seats }; // Trả về object bao gồm seatIds và danh sách ghế
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSeatStatusSlice = createAsyncThunk(
    'seat/updateSeatStatus',
    async ({ seatId, newStatus }: { seatId: string; newStatus: boolean }, { rejectWithValue }) => {
        try {
            await updateSeatStatus(seatId, newStatus); // Thực hiện cập nhật trạng thái ghế trong Firestore
            return { seatId, newStatus }; // Trả về ID ghế và trạng thái mới
        } catch (error: any) {
            return rejectWithValue(error.message); // Nếu có lỗi, trả về thông báo lỗi
        }
    }
);


export const updateSeatIsSetSlice = createAsyncThunk(
    'seat/updateSeatIsSet',
    async ({ seatId, newIsSet }: { seatId: string; newIsSet: boolean }, { rejectWithValue }) => {
        try {
            await updateSeatIsSet(seatId, newIsSet); // Thực hiện cập nhật trạng thái ghế trong Firestore
            return { seatId, newIsSet }; // Trả về ID ghế và trạng thái mới
        } catch (error: any) {
            return rejectWithValue(error.message); // Nếu có lỗi, trả về thông báo lỗi
        }
    }
);

// Slice chứa reducer và action cho Seat
const seatSlice = createSlice({
    name: 'seat',
    initialState,
    reducers: {
        // Bạn có thể thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả Seats
        builder.addCase(fetchSeats.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSeats.fulfilled, (state, action) => {
            state.loading = false;
            state.seats = action.payload;
        });
        builder.addCase(fetchSeats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm Seat mới
        builder.addCase(addNewSeats.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewSeats.fulfilled, (state, action) => {
            state.loading = false;
            state.seats.push(...action.payload); // Thêm nhiều ghế vào danh sách
        });
        builder.addCase(addNewSeats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa Seat
        builder.addCase(removeSeat.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeSeat.fulfilled, (state, action) => {
            state.loading = false;
            state.seats = state.seats.filter((seat) => seat.id !== action.payload);
        });
        builder.addCase(removeSeat.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy danh sách Seats theo ScreeningID
        builder.addCase(fetchSeatsByScreeningId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSeatsByScreeningId.fulfilled, (state, action) => {
            state.loading = false;
            const { screeningId, seats } = action.payload as { screeningId: string; seats: Seat[] };
            state.seatsByScreeningId[screeningId] = seats; // Lưu danh sách ghế theo ScreeningID
        });
        builder.addCase(fetchSeatsByScreeningId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy danh sách Seats theo danh sách ID
        builder.addCase(fetchSeatsByIds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSeatsByIds.fulfilled, (state, action) => {
            state.loading = false;
            const { seatIds, seats } = action.payload as { seatIds: string[]; seats: Seat[] };
            seatIds.forEach((seatId, index) => {
                state.fetchedSeatsByIdss[seatId] = seats[index] || null; // Lưu ghế tương ứng theo ID
            });
        });
        builder.addCase(fetchSeatsByIds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật trạng thái ghế
        builder.addCase(updateSeatStatusSlice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateSeatStatusSlice.fulfilled, (state, action) => {
            state.loading = false;
            const { seatId, newStatus } = action.payload;
            const seat = state.seats.find(seat => seat.id === seatId);
            if (seat) {
                seat.Status = newStatus; // Cập nhật trạng thái ghế
            }
        });
        builder.addCase(updateSeatStatusSlice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Lưu thông báo lỗi
        });

        // Cập nhật  ghế  được đặt 
        builder.addCase(updateSeatIsSetSlice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateSeatIsSetSlice.fulfilled, (state, action) => {
            state.loading = false;
            const { seatId, newIsSet } = action.payload;
            const seat = state.seats.find(seat => seat.id === seatId);
            if (seat) {
                seat.IsSet = newIsSet; // Cập nhật trạng thái ghế
            }
        });
        builder.addCase(updateSeatIsSetSlice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; // Lưu thông báo lỗi
        });
    },
});

export default seatSlice.reducer;
