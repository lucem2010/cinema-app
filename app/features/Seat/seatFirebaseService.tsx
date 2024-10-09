import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Seat } from '@/app/model/Seat';

// 1. Thêm mới Seat
// yourFileName.ts
export const addSeats = async (seats: Seat[]): Promise<void> => {
    try {
        for (const seat of seats) {
            const seatRef = doc(firestore, 'seats', seat.id);
            await setDoc(seatRef, seat);
        }
    } catch (error) {
        throw new Error(`Failed to add Seats: ${error.message}`);
    }
};


// 2. Cập nhật Seat
export const updateSeatStatus = async (seatId: string, newStatus: boolean): Promise<void> => {
    try {
        const seatRef = doc(firestore, 'seats', seatId);
        await updateDoc(seatRef, {
            Status: newStatus,  // Cập nhật trạng thái ghế
        });
    } catch (error) {
        throw new Error(`Failed to update Seat Status: ${error.message}`);
    }
};

// 2. Cập nhật isSet
export const updateSeatIsSet = async (seatId: string, newIsSet: boolean): Promise<void> => {
    try {
        const seatRef = doc(firestore, 'seats', seatId);
        await updateDoc(seatRef, {
            IsSet: newIsSet,  // Cập nhật trạng thái ghế
        });
    } catch (error) {
        throw new Error(`Failed to update Seat Status: ${error.message}`);
    }
};


// 3. Xóa Seat
export const deleteSeat = async (seatId: string): Promise<void> => {
    try {
        const seatRef = doc(firestore, 'seats', seatId);
        await deleteDoc(seatRef);  // Xóa Seat
    } catch (error) {
        throw new Error(`Failed to delete Seat: ${error.message}`);
    }
};

// 4. Lấy tất cả các Seat
export const getAllSeats = async (): Promise<Seat[]> => {
    try {
        const seatCollection = collection(firestore, 'seats');
        const seatSnapshot = await getDocs(seatCollection);

        const seats: Seat[] = seatSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Seat[];

        return seats;  // Trả về danh sách tất cả các Seat
    } catch (error) {
        throw new Error(`Failed to fetch Seats: ${error.message}`);
    }
};

// 5. Lấy Seat theo ID
export const getSeatById = async (seatId: string): Promise<Seat | null> => {
    try {
        const seatRef = doc(firestore, 'seats', seatId);
        const seatDoc = await getDoc(seatRef);

        if (seatDoc.exists()) {
            return seatDoc.data() as Seat;  // Trả về Seat nếu tồn tại
        } else {
            return null;  // Trả về null nếu không tìm thấy
        }
    } catch (error) {
        throw new Error(`Failed to fetch Seat: ${error.message}`);
    }
};

// 6. Lấy Seats theo ScreeningID
export const getSeatsByScreeningId = async (screeningId: string): Promise<Seat[]> => {
    try {
        const seatCollection = collection(firestore, 'seats');
        const q = query(seatCollection, where('ScreeningID', '==', screeningId));
        const seatSnapshot = await getDocs(q);

        const seats: Seat[] = seatSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Seat[];

        return seats;  // Trả về danh sách Seats theo ScreeningID
    } catch (error) {
        throw new Error(`Failed to fetch Seats by ScreeningID: ${error.message}`);
    }
};


// 7. Lấy danh sách Seat theo danh sách seatId
export const getSeatsByIds = async (seatIds: string[]): Promise<Seat[]> => {
    const seats: Seat[] = [];

    try {
        // Tạo một mảng các Promise để lấy dữ liệu cho từng seatId
        const seatPromises = seatIds.map(async (seatId) => {
            const seatRef = doc(firestore, 'seats', seatId);
            const seatDoc = await getDoc(seatRef);
            if (seatDoc.exists()) {
                return seatDoc.data() as Seat;  // Trả về Seat nếu tồn tại
            } else {
                return null;  // Trả về null nếu không tìm thấy
            }
        });

        // Chờ cho tất cả các Promise hoàn thành
        const results = await Promise.all(seatPromises);

        // Lọc ra các seat không null và thêm vào mảng seats
        results.forEach((seat) => {
            if (seat) {
                seats.push(seat);
            }
        });

        return seats;  // Trả về danh sách Seats đã tìm thấy
    } catch (error) {
        throw new Error(`Failed to fetch Seats: ${error.message}`);
    }
};
