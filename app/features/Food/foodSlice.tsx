import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Food } from '@/app/model/Food';
import { addFood, deleteFood, getAllFoods, updateFood, getFoodsByIds } from './foodFirebaseService';

// Khởi tạo state ban đầu
interface FoodState {
    foods: Food[];
    loading: boolean;
    error: string | null;
}

const initialState: FoodState = {
    foods: [],
    loading: false,
    error: null,
};

// Async Thunk để lấy tất cả Foods từ Firestore
export const fetchFoods = createAsyncThunk(
    'food/fetchFoods',
    async (_, { rejectWithValue }) => {
        try {
            const foods = await getAllFoods();
            return foods;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để lấy Foods theo danh sách foodID
export const fetchFoodsByIds = createAsyncThunk(
    'food/fetchFoodsByIds',
    async (foodIds: string[], { rejectWithValue }) => {
        try {
            const foods = await getFoodsByIds(foodIds); // Sử dụng hàm getFoodsByIds đã định nghĩa
            return foods;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để thêm Food mới vào Firestore
export const addNewFood = createAsyncThunk(
    'food/addNewFood',
    async (food: Food, { rejectWithValue }) => {
        try {
            await addFood(food);
            return food; // Trả về Food mới sau khi thêm thành công
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để cập nhật Food trong Firestore
export const editFood = createAsyncThunk(
    'food/editFood',
    async (food: Food, { rejectWithValue }) => {
        try {
            await updateFood(food);
            return food; // Trả về Food đã cập nhật
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk để xóa Food khỏi Firestore
export const removeFood = createAsyncThunk(
    'food/removeFood',
    async (foodId: string, { rejectWithValue }) => {
        try {
            await deleteFood(foodId);
            return foodId; // Trả về ID của Food đã xóa
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateFoodQuantityAndSold = createAsyncThunk(
    'food/updateFoodQuantityAndSold',
    async ({ foodId, quantitySold }: { foodId: string, quantitySold: number }, { rejectWithValue }) => {
        try {
            // Lấy thông tin Food hiện tại
            const food = await getFoodsByIds([foodId]);
            if (!food || food.length === 0) {
                throw new Error('Food not found');
            }
            const updatedFood = food[0];

            // Kiểm tra số lượng còn đủ không
            if (updatedFood.quantity < quantitySold) {
                throw new Error('Insufficient quantity');
            }

            // Cập nhật số lượng và số lượng đã bán
            updatedFood.quantity -= quantitySold;
            updatedFood.sold += quantitySold;

            // Lưu lại vào Firestore
            await updateFood(updatedFood);
            return updatedFood;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice chứa reducer và action cho Food
const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        // Bạn có thể thêm các reducer đồng bộ ở đây nếu cần
    },
    extraReducers: (builder) => {
        // Lấy tất cả Foods
        builder.addCase(fetchFoods.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchFoods.fulfilled, (state, action) => {
            state.loading = false;
            state.foods = action.payload;
        });
        builder.addCase(fetchFoods.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Lấy Foods theo danh sách foodID
        builder.addCase(fetchFoodsByIds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchFoodsByIds.fulfilled, (state, action) => {
            state.loading = false;
            // Thêm Foods mới vào state hoặc cập nhật danh sách hiện có
            state.foods = action.payload;
        });
        builder.addCase(fetchFoodsByIds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Thêm Food mới
        builder.addCase(addNewFood.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewFood.fulfilled, (state, action) => {
            state.loading = false;
            state.foods.push(action.payload);
        });
        builder.addCase(addNewFood.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật Food
        builder.addCase(editFood.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editFood.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.foods.findIndex((fd) => fd.id === action.payload.id);
            if (index !== -1) {
                state.foods[index] = action.payload;
            }
        });
        builder.addCase(editFood.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Xóa Food
        builder.addCase(removeFood.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeFood.fulfilled, (state, action) => {
            state.loading = false;
            state.foods = state.foods.filter((fd) => fd.id !== action.payload);
        });
        builder.addCase(removeFood.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cập nhật số lượng và số lượng đã bán
        builder.addCase(updateFoodQuantityAndSold.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateFoodQuantityAndSold.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.foods.findIndex((fd) => fd.id === action.payload.id);
            if (index !== -1) {
                state.foods[index] = action.payload;
            }
        });
        builder.addCase(updateFoodQuantityAndSold.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default foodSlice.reducer;
