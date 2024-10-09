import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { FilmType } from '@/app/model/FilmType';

// 1. Thêm mới FilmType
export const addFilmType = async (filmType: FilmType): Promise<void> => {
    try {
        const filmTypeRef = doc(firestore, 'filmType', filmType.id);
        await setDoc(filmTypeRef, filmType);  // Thêm mới FilmType vào Firestore
    } catch (error) {
        throw new Error(`Failed to add FilmType: ${error.message}`);
    }
};

// 2. Cập nhật FilmType
export const updateFilmType = async (filmType: FilmType): Promise<void> => {
    try {
        const filmTypeRef = doc(firestore, 'filmType', filmType.id);
        await updateDoc(filmTypeRef, {
            name: filmType.name,  // Cập nhật tên FilmType
        });
    } catch (error) {
        throw new Error(`Failed to update FilmType: ${error.message}`);
    }
};

// 3. Xóa FilmType
export const deleteFilmType = async (filmTypeId: string): Promise<void> => {
    try {
        const filmTypeRef = doc(firestore, 'filmType', filmTypeId);
        await deleteDoc(filmTypeRef);  // Xóa FilmType
    } catch (error) {
        throw new Error(`Failed to delete FilmType: ${error.message}`);
    }
};

// 4. Lấy tất cả các FilmType
export const getAllFilmTypes = async (): Promise<FilmType[]> => {
    try {
        const filmTypeCollection = collection(firestore, 'filmType');
        const filmTypeSnapshot = await getDocs(filmTypeCollection);

        const filmTypes: FilmType[] = filmTypeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as FilmType[];

        return filmTypes;  // Trả về danh sách tất cả các FilmType
    } catch (error) {
        throw new Error(`Failed to fetch FilmTypes: ${error.message}`);
    }
};

// 5. Lấy FilmType theo ID
export const getFilmTypeById = async (filmTypeId: string): Promise<FilmType | null> => {
    try {
        const filmTypeRef = doc(firestore, 'filmType', filmTypeId);
        const filmTypeDoc = await getDoc(filmTypeRef);

        if (filmTypeDoc.exists()) {
            return filmTypeDoc.data() as FilmType;  // Trả về FilmType nếu tồn tại
        } else {
            return null;  // Trả về null nếu không tìm thấy
        }
    } catch (error) {
        throw new Error(`Failed to fetch FilmType: ${error.message}`);
    }
};


export const getFilmTypesByIds = async (filmTypeIds: string[]): Promise<FilmType[]> => {
    try {
        const filmTypePromises = filmTypeIds.map(async (id) => {
            const filmTypeRef = doc(firestore, 'filmType', id);
            const filmTypeDoc = await getDoc(filmTypeRef);

            if (filmTypeDoc.exists()) {
                return filmTypeDoc.data() as FilmType;  // Trả về FilmType nếu tồn tại
            } else {
                return null;  // Trả về null nếu không tìm thấy
            }
        });

        const filmTypes = await Promise.all(filmTypePromises);  // Chờ tất cả các promises hoàn thành
        return filmTypes.filter((filmType): filmType is FilmType => filmType !== null);  // Lọc các giá trị null
    } catch (error) {
        throw new Error(`Failed to fetch FilmTypes: ${error.message}`);
    }
};