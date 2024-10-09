import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FilmType } from '@/app/model/FilmType';
import { addFilmType, deleteFilmType, getAllFilmTypes, updateFilmType } from './filmFirebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';

// Khởi tạo state ban đầu
interface FilmTypeState {
    filmTypes: FilmType[];
    loading: boolean;
    error: string | null;
}

const initialState: FilmTypeState = {
    filmTypes: [],
    loading: false,
    error: null,
};

// Async Thunk để lấy tất cả FilmTypes từ Firestore
export const fetchFilmTypes = createAsyncThunk(
    'filmType/fetchFilmTypes',
    async (_, { rejectWithValue }) => {
        try {
            const filmTypes = await getAllFilmTypes();
            return filmTypes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm FilmType mới vào Firestore
export const addNewFilmType = createAsyncThunk(
    'filmType/addNewFilmType',
    async (filmType: FilmType, { rejectWithValue }) => {
        try {
            await addFilmType(filmType);
            return filmType; // Trả về FilmType mới sau khi thêm thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để cập nhật FilmType trong Firestore
export const editFilmType = createAsyncThunk(
    'filmType/editFilmType',
    async (filmType: FilmType, { rejectWithValue }) => {
        try {
            await updateFilmType(filmType);
            return filmType; // Trả về FilmType đã cập nhật
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để xóa FilmType khỏi Firestore
export const removeFilmType = createAsyncThunk(
    'filmType/removeFilmType',
    async (filmTypeId: string, { rejectWithValue }) => {
        try {
            await deleteFilmType(filmTypeId);
            return filmTypeId; // Trả về ID của FilmType đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy các FilmType theo IDs
export const fetchFilmTypesByIds = createAsyncThunk(
    'filmType/fetchFilmTypesByIds',
    async (filmTypeIds: string[], { rejectWithValue }) => {
        try {
            const filmTypePromises = filmTypeIds.map(async (id) => {
                const filmTypeRef = doc(firestore, 'filmType', id);
                const filmTypeDoc = await getDoc(filmTypeRef);

                if (filmTypeDoc.exists()) {
                    return filmTypeDoc.data() as FilmType;
                } else {
                    return null;
                }
            });

            const filmTypes = await Promise.all(filmTypePromises);
            return filmTypes.filter((filmType): filmType is FilmType => filmType !== null);
        } catch (error: any) {
            return rejectWithValue(`Failed to fetch FilmTypes: ${error.message}`);
        }
    }
);

// Slice chứa reducer và action cho FilmType
const filmTypeSlice = createSlice({
    name: 'filmType',
    initialState,
    reducers: {
        // Bạn có thể thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả FilmTypes
        builder.addCase(fetchFilmTypes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchFilmTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.filmTypes = action.payload;
        });
        builder.addCase(fetchFilmTypes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm FilmType mới
        builder.addCase(addNewFilmType.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewFilmType.fulfilled, (state, action) => {
            state.loading = false;
            state.filmTypes.push(action.payload);
        });
        builder.addCase(addNewFilmType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật FilmType
        builder.addCase(editFilmType.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editFilmType.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.filmTypes.findIndex((ft) => ft.id === action.payload.id);
            if (index !== -1) {
                state.filmTypes[index] = action.payload;
            }
        });
        builder.addCase(editFilmType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa FilmType
        builder.addCase(removeFilmType.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeFilmType.fulfilled, (state, action) => {
            state.loading = false;
            state.filmTypes = state.filmTypes.filter((ft) => ft.id !== action.payload);
        });
        builder.addCase(removeFilmType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy các FilmTypes theo IDs
        builder.addCase(fetchFilmTypesByIds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchFilmTypesByIds.fulfilled, (state, action) => {
            state.loading = false;
            state.filmTypes = action.payload;
        });
        builder.addCase(fetchFilmTypesByIds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default filmTypeSlice.reducer;
