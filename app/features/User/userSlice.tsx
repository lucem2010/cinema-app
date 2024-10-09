import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/app/model/User';
import { loginUserWithFirebase, registerUserWithFirebase } from './userFirebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};

// Thunk để tải dữ liệu người dùng từ AsyncStorage
export const loadUserFromAsyncStorage = createAsyncThunk(
    'user/loadUserFromAsyncStorage',
    async (user: User | null) => {
        return user; // Trả về dữ liệu người dùng
    }
);
// Async thunk để đăng ký người dùng và lưu vào Firestore
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (
        { email, password, name, phoneNumber, gender, role }: Omit<User, 'id'> & { password: string },
        { rejectWithValue }
    ) => {
        try {
            const userData = await registerUserWithFirebase(email, password, name, phoneNumber, gender, role);
            return userData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk để đăng nhập người dùng
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const userData = await loginUserWithFirebase(email, password);
            return userData;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const logoutUser = createAsyncThunk('user/logout', async (_, { dispatch }) => {
    await AsyncStorage.removeItem('user'); // Xóa người dùng từ AsyncStorage
    dispatch(logout()); // Gọi action logout để xóa dữ liệu từ Redux state
});
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loadUserFromAsyncStorage.fulfilled, (state, action: PayloadAction<User | null>) => {
                state.user = action.payload;
            });
    },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
