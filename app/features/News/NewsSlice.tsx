import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { News } from '@/app/model/News';
import { addNews, deleteNews, getAllNews, updateNews } from './NewsFirebaseService';

// Initial state for News
interface NewsState {
    newsList: News[];
    loading: boolean;
    error: string | null;
}

const initialState: NewsState = {
    newsList: [],
    loading: false,
    error: null,
};

// Async Thunk to fetch all News from Firestore
export const fetchAllNews = createAsyncThunk(
    'news/fetchAllNews',
    async (_, { rejectWithValue }) => {
        try {
            const news = await getAllNews();
            return news;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to add a new News item to Firestore
export const addNewNews = createAsyncThunk(
    'news/addNewNews',
    async (news: News, { rejectWithValue }) => {
        try {
            await addNews(news);
            return news; // Return the newly added News object
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to update a News item in Firestore
export const editNews = createAsyncThunk(
    'news/editNews',
    async (news: News, { rejectWithValue }) => {
        try {
            await updateNews(news);
            return news; // Return the updated News object
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk to delete a News item from Firestore
export const removeNews = createAsyncThunk(
    'news/removeNews',
    async (newsId: string, { rejectWithValue }) => {
        try {
            await deleteNews(newsId);
            return newsId; // Return the ID of the deleted News
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice containing the reducer and actions for News
const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        // Add synchronous reducers if needed
    },
    extraReducers: (builder) => {
        // Fetch all News
        builder.addCase(fetchAllNews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllNews.fulfilled, (state, action) => {
            state.loading = false;
            state.newsList = action.payload;
        });
        builder.addCase(fetchAllNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Add new News
        builder.addCase(addNewNews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewNews.fulfilled, (state, action) => {
            state.loading = false;
            state.newsList.push(action.payload);
        });
        builder.addCase(addNewNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Edit News
        builder.addCase(editNews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editNews.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.newsList.findIndex((news) => news.id === action.payload.id);
            if (index !== -1) {
                state.newsList[index] = action.payload;
            }
        });
        builder.addCase(editNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Remove News
        builder.addCase(removeNews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeNews.fulfilled, (state, action) => {
            state.loading = false;
            state.newsList = state.newsList.filter((news) => news.id !== action.payload);
        });
        builder.addCase(removeNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default newsSlice.reducer;
