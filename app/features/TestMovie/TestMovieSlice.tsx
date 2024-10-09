import { Movie } from '@/app/model/Movie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addMovie, deleteMovie, getAllMovies, getMovieById, updateMovie, updateMovieStatus } from './testMovieFirebaseService';

// Khởi tạo state ban đầu
interface MovieState {
    movies: Movie[];
    selectedMovie: Movie | null; // Thêm thuộc tính này
    loading: boolean;
    error: string | null;
}

const initialState: MovieState = {
    movies: [],
    selectedMovie: null, // Khởi tạo với null
    loading: false,
    error: null,
};

// Async Thunk để lấy tất cả Movies từ Firestore
export const fetchMovies = createAsyncThunk(
    'movie/fetchMovies',
    async (_, { rejectWithValue }) => {
        try {
            const movies = await getAllMovies();
            return movies;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm Movie mới vào Firestore
export const addNewMovie = createAsyncThunk(
    'movie/addNewMovie',
    async (movie: Movie, { rejectWithValue }) => {
        try {
            await addMovie(movie);
            return movie; // Trả về Movie mới sau khi thêm thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để cập nhật Movie trong Firestore
export const editMovie = createAsyncThunk(
    'movie/editMovie',
    async (movie: Movie, { rejectWithValue }) => {
        try {
            await updateMovie(movie);
            return movie; // Trả về Movie đã cập nhật
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để xóa Movie khỏi Firestore
export const removeMovie = createAsyncThunk(
    'movie/removeMovie',
    async (movieId: string, { rejectWithValue }) => {
        try {
            await deleteMovie(movieId);
            return movieId; // Trả về ID của Movie đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy Movie theo ID
export const fetchMovieById = createAsyncThunk(
    'movie/fetchMovieById',
    async (movieId: string, { rejectWithValue }) => {
        try {
            const movie = await getMovieById(movieId); // Sử dụng hàm getMovieById
            if (movie) {
                return movie; // Trả về dữ liệu Movie nếu có
            } else {
                throw new Error('Movie not found');
            }
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


// Async Thunk để cập nhật trạng thái của Movie
export const updateMovieStatusById = createAsyncThunk(
    'movie/updateMovieStatusById',
    async ({ movieId, newStatus }: { movieId: string, newStatus: string }, { rejectWithValue }) => {
        try {
            await updateMovieStatus(movieId, newStatus); // Gọi hàm cập nhật trạng thái
            return { movieId, newStatus }; // Trả về thông tin sau khi cập nhật thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice chứa reducer và action cho Movie
const movieSlice = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        // Bạn có thể thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả Movies
        builder.addCase(fetchMovies.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.loading = false;
            state.movies = action.payload;
        });
        builder.addCase(fetchMovies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm Movie mới
        builder.addCase(addNewMovie.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewMovie.fulfilled, (state, action) => {
            state.loading = false;
            state.movies.push(action.payload);
        });
        builder.addCase(addNewMovie.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật Movie
        builder.addCase(editMovie.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editMovie.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.movies.findIndex((movie) => movie.id === action.payload.id);
            if (index !== -1) {
                state.movies[index] = action.payload;
            }
        });
        builder.addCase(editMovie.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa Movie
        builder.addCase(removeMovie.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeMovie.fulfilled, (state, action) => {
            state.loading = false;
            state.movies = state.movies.filter((movie) => movie.id !== action.payload);
        });
        builder.addCase(removeMovie.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy Movie theo ID
        builder.addCase(fetchMovieById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMovieById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedMovie = action.payload; // Lưu Movie được chọn vào state
        });
        builder.addCase(fetchMovieById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật trạng thái Movie
        builder.addCase(updateMovieStatusById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateMovieStatusById.fulfilled, (state, action) => {
            state.loading = false;
            const { movieId, newStatus } = action.payload;
            const index = state.movies.findIndex((movie) => movie.id === movieId);
            if (index !== -1) {
                state.movies[index].Status = newStatus; // Cập nhật trạng thái của movie
            }
        });
        builder.addCase(updateMovieStatusById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default movieSlice.reducer;
