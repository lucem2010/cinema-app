import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Food } from '@/app/model/Food';

// 1. Thêm mới Food
export const addFood = async (food: Food): Promise<void> => {
    try {
        const { sellingPrice, ...foodData } = food; // Loại bỏ sellingPrice
        const foodRef = doc(firestore, 'food', food.id);
        await setDoc(foodRef, foodData);  // Thêm mới Food vào Firestore
    } catch (error) {
        throw new Error(`Failed to add Food: ${error.message}`);
    }
};

// 2. Cập nhật Food
export const updateFood = async (food: Food): Promise<void> => {
    try {
        const { sellingPrice, ...foodData } = food; // Loại bỏ sellingPrice
        const foodRef = doc(firestore, 'food', food.id);
        await updateDoc(foodRef, {
            name: foodData.name,                  // Cập nhật tên Food
            price: foodData.price,                // Cập nhật giá của Food
            quantity: foodData.quantity,          // Cập nhật số lượng Food
            sold: foodData.sold,                  // Cập nhật số lượng đã bán của Food
            imageUrl: foodData.imageUrl           // Cập nhật link ảnh của Food
        });
    } catch (error) {
        throw new Error(`Failed to update Food: ${error.message}`);
    }
};

// 3. Xóa Food
export const deleteFood = async (foodId: string): Promise<void> => {
    try {
        const foodRef = doc(firestore, 'food', foodId);
        await deleteDoc(foodRef);  // Xóa Food
    } catch (error) {
        throw new Error(`Failed to delete Food: ${error.message}`);
    }
};

// 4. Lấy tất cả các Food
export const getAllFoods = async (): Promise<Food[]> => {
    try {
        const foodCollection = collection(firestore, 'food');
        const foodSnapshot = await getDocs(foodCollection);

        const foods: Food[] = foodSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Food[];

        return foods;  // Trả về danh sách tất cả các Food
    } catch (error) {
        throw new Error(`Failed to fetch Foods: ${error.message}`);
    }
};

// 5. Lấy Food theo ID
export const getFoodById = async (foodId: string): Promise<Food | null> => {
    try {
        const foodRef = doc(firestore, 'food', foodId);
        const foodDoc = await getDoc(foodRef);

        if (foodDoc.exists()) {
            return foodDoc.data() as Food;  // Trả về Food nếu tồn tại
        } else {
            return null;  // Trả về null nếu không tìm thấy
        }
    } catch (error) {
        throw new Error(`Failed to fetch Food: ${error.message}`);
    }
};


export const getFoodsByIds = async (foodIds: string[]): Promise<Food[]> => {
    try {
        const foodPromises = foodIds.map(foodId => getFoodById(foodId));
        const foods = await Promise.all(foodPromises);

        // Lọc ra các food không null
        return foods.filter((food): food is Food => food !== null);
    } catch (error) {
        throw new Error(`Failed to fetch Foods: ${error.message}`);
    }
};
