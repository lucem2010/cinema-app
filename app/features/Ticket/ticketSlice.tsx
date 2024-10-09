import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Ticket } from '@/app/model/Ticket';
import { addTicket, deleteTicket, getAllTickets, getTicketsByUserId, updateTicket } from './ticketFirebaseService';

// Khởi tạo state ban đầu
interface TicketState {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
}

const initialState: TicketState = {
    tickets: [],
    loading: false,
    error: null,
};

// Async Thunk để lấy tất cả Tickets từ Firestore
export const fetchTickets = createAsyncThunk(
    'ticket/fetchTickets',
    async (_, { rejectWithValue }) => {
        try {
            const tickets = await getAllTickets();
            return tickets;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy tất cả Tickets theo userId từ Firestore
export const fetchTicketsByUserId = createAsyncThunk(
    'ticket/fetchTicketsByUserId',
    async (userId: string, { rejectWithValue }) => {
        try {
            const tickets = await getTicketsByUserId(userId);
            return tickets;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm Ticket mới vào Firestore
export const addNewTicket = createAsyncThunk(
    'ticket/addNewTicket',
    async (ticket: Ticket, { rejectWithValue }) => {
        try {
            await addTicket(ticket);
            return ticket; // Trả về Ticket mới sau khi thêm thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để cập nhật Ticket trong Firestore
export const editTicket = createAsyncThunk(
    'ticket/editTicket',
    async (ticket: Ticket, { rejectWithValue }) => {
        try {
            await updateTicket(ticket);
            return ticket; // Trả về Ticket đã cập nhật
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để xóa Ticket khỏi Firestore
export const removeTicket = createAsyncThunk(
    'ticket/removeTicket',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            await deleteTicket(ticketId);
            return ticketId; // Trả về ID của Ticket đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice chứa reducer và action cho Ticket
const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        // Thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả Tickets
        builder.addCase(fetchTickets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTickets.fulfilled, (state, action) => {
            state.loading = false;
            state.tickets = action.payload;
        });
        builder.addCase(fetchTickets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy tất cả Tickets theo userId
        builder.addCase(fetchTicketsByUserId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTicketsByUserId.fulfilled, (state, action) => {
            state.loading = false;
            state.tickets = action.payload;
        });
        builder.addCase(fetchTicketsByUserId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm Ticket mới
        builder.addCase(addNewTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.tickets.push(action.payload);
        });
        builder.addCase(addNewTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật Ticket
        builder.addCase(editTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editTicket.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tickets.findIndex((tk) => tk.id === action.payload.id);
            if (index !== -1) {
                state.tickets[index] = action.payload;
            }
        });
        builder.addCase(editTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa Ticket
        builder.addCase(removeTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.tickets = state.tickets.filter((tk) => tk.id !== action.payload);
        });
        builder.addCase(removeTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default ticketSlice.reducer;
