import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { ScreeningRoom } from '@/app/model/ScreeningRoom ';

// 1. Thêm mới ScreeningRoom
export const addScreeningRoom = async (screeningRoom: ScreeningRoom): Promise<void> => {
    try {
        const screeningRoomRef = doc(firestore, 'screeningRoom', screeningRoom.id);
        await setDoc(screeningRoomRef, screeningRoom);  // Thêm mới ScreeningRoom vào Firestore
    } catch (error) {
        throw new Error(`Failed to add ScreeningRoom: ${error.message}`);
    }
};

// 2. Cập nhật ScreeningRoom
export const updateScreeningRoom = async (screeningRoom: ScreeningRoom): Promise<void> => {
    try {
        const screeningRoomRef = doc(firestore, 'screeningRoom', screeningRoom.id);
        await updateDoc(screeningRoomRef, {
            name: screeningRoom.name,  // Cập nhật tên ScreeningRoom
            capacity: screeningRoom.capacity,  // Cập nhật sức chứa
            screenType: screeningRoom.screenType,  // Cập nhật loại màn hình
            location: screeningRoom.location,  // Cập nhật vị trí
        });
    } catch (error) {
        throw new Error(`Failed to update ScreeningRoom: ${error.message}`);
    }
};

// 3. Xóa ScreeningRoom
export const deleteScreeningRoom = async (screeningRoomId: string): Promise<void> => {
    try {
        const screeningRoomRef = doc(firestore, 'screeningRoom', screeningRoomId);
        await deleteDoc(screeningRoomRef);  // Xóa ScreeningRoom
    } catch (error) {
        throw new Error(`Failed to delete ScreeningRoom: ${error.message}`);
    }
};

// 4. Lấy tất cả các ScreeningRoom
export const getAllScreeningRooms = async (): Promise<ScreeningRoom[]> => {
    try {
        const screeningRoomCollection = collection(firestore, 'screeningRoom');
        const screeningRoomSnapshot = await getDocs(screeningRoomCollection);

        const screeningRooms: ScreeningRoom[] = screeningRoomSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ScreeningRoom[];

        return screeningRooms;  // Trả về danh sách tất cả các ScreeningRoom
    } catch (error) {
        throw new Error(`Failed to fetch ScreeningRooms: ${error.message}`);
    }
};

// 5. Lấy ScreeningRoom theo ID
export const getScreeningRoomById = async (screeningRoomId: string): Promise<ScreeningRoom | null> => {
    try {
        const screeningRoomRef = doc(firestore, 'screeningRoom', screeningRoomId);
        const screeningRoomDoc = await getDoc(screeningRoomRef);

        if (screeningRoomDoc.exists()) {
            return screeningRoomDoc.data() as ScreeningRoom;  // Trả về ScreeningRoom nếu tồn tại
        } else {
            return null;  // Trả về null nếu không tìm thấy
        }
    } catch (error) {
        throw new Error(`Failed to fetch ScreeningRoom: ${error.message}`);
    }
};

export const getScreeningRoomsByIds = async (screeningRoomIds: string[]): Promise<ScreeningRoom[]> => {
    try {
        const screeningRooms: ScreeningRoom[] = [];

        for (const id of screeningRoomIds) {
            const screeningRoomRef = doc(firestore, 'screeningRoom', id);
            const screeningRoomDoc = await getDoc(screeningRoomRef);

            if (screeningRoomDoc.exists()) {
                screeningRooms.push(screeningRoomDoc.data() as ScreeningRoom);
            }
        }

        return screeningRooms;
    } catch (error) {
        throw new Error(`Failed to fetch ScreeningRooms: ${error.message}`);
    }
};
