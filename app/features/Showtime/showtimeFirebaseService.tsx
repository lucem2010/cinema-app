import {
    collection,
    query,
    where,
    doc,
    setDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Showtime } from '@/app/model/Showtime';

// 1. Thêm mới Showtime
export const addShowtime = async (showtime: Showtime): Promise<void> => {
    try {
        const showtimeRef = doc(firestore, 'showtime', showtime.id);
        await setDoc(showtimeRef, {
            ...showtime,
            date: showtime.date, // Keep as string if stored as such
            startTime: showtime.startTime,
            endTime: showtime.endTime,
            ticketPrice: showtime.ticketPrice
        });
    } catch (error) {
        throw new Error(`Failed to add Showtime: ${error.message}`);
    }
};

// 2. Cập nhật Showtime
export const updateShowtime = async (showtime: Showtime): Promise<void> => {
    try {
        const showtimeRef = doc(firestore, 'showtime', showtime.id);
        await updateDoc(showtimeRef, {
            ...showtime,
            date: showtime.date,
            startTime: showtime.startTime,
            endTime: showtime.endTime,
            ticketPrice: showtime.ticketPrice
        });
    } catch (error) {
        throw new Error(`Failed to update Showtime: ${error.message}`);
    }
};

// 3. Xóa Showtime
export const deleteShowtime = async (showtimeId: string): Promise<void> => {
    try {
        const showtimeRef = doc(firestore, 'showtime', showtimeId);
        await deleteDoc(showtimeRef);
    } catch (error) {
        throw new Error(`Failed to delete Showtime: ${error.message}`);
    }
};

// 4. Lấy tất cả các Showtime
export const getAllShowtimes = async (): Promise<Showtime[]> => {
    try {
        const showtimeCollection = collection(firestore, 'showtime');
        const showtimeSnapshot = await getDocs(showtimeCollection);

        return showtimeSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                idScreeningRoom: data.idScreeningRoom,
                idMovie: data.idMovie,
                movieName: data.movieName,
                date: data.date, // Keep as string
                startTime: data.startTime, // Keep as string
                endTime: data.endTime, // Keep as string
                ticketPrice: data.ticketPrice
            } as Showtime;
        });
    } catch (error) {
        throw new Error(`Failed to fetch Showtimes: ${error.message}`);
    }
};

// 5. Lấy Showtime theo ID
export const getShowtimeById = async (showtimeId: string): Promise<Showtime | null> => {
    try {
        const showtimeRef = doc(firestore, 'showtime', showtimeId);
        const showtimeDoc = await getDoc(showtimeRef);

        if (showtimeDoc.exists()) {
            const data = showtimeDoc.data();
            return {
                id: showtimeDoc.id,
                idScreeningRoom: data.idScreeningRoom,
                idMovie: data.idMovie,
                movieName: data.movieName,
                date: data.date, // Keep as string
                startTime: data.startTime, // Keep as string
                endTime: data.endTime, // Keep as string
                ticketPrice: data.ticketPrice
            } as Showtime;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Failed to fetch Showtime: ${error.message}`);
    }
};

// 6. Lấy Showtime theo ID phòng chiếu
export const getShowtimesByRoomId = async (roomId: string): Promise<Showtime[]> => {
    try {
        const showtimeCollection = collection(firestore, 'showtime');
        const q = query(showtimeCollection, where('idScreeningRoom', '==', roomId));
        const showtimeSnapshot = await getDocs(q);

        return showtimeSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                idScreeningRoom: data.idScreeningRoom,
                idMovie: data.idMovie,
                movieName: data.movieName,
                date: data.date, // Keep as string
                startTime: data.startTime, // Keep as string
                endTime: data.endTime, // Keep as string
                ticketPrice: data.ticketPrice
            } as Showtime;
        });
    } catch (error) {
        throw new Error(`Failed to fetch Showtimes by room ID: ${error.message}`);
    }
};

// 7. Lấy Showtime theo Movie và Room ID
export const getShowtimesByMovieAndRoom = async (
    movieID: string,
    screeningRoomID: string
): Promise<Showtime[]> => {
    try {
        const showtimeQuery = query(
            collection(firestore, 'showtime'),
            where('idMovie', '==', movieID),
            where('idScreeningRoom', '==', screeningRoomID)
        );

        const querySnapshot = await getDocs(showtimeQuery);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                idScreeningRoom: data.idScreeningRoom,
                idMovie: data.idMovie,
                movieName: data.movieName,
                date: data.date, // Keep as string
                startTime: data.startTime, // Keep as string
                endTime: data.endTime, // Keep as string
                ticketPrice: data.ticketPrice,
            } as Showtime;
        });
    } catch (error) {
        throw new Error(`Failed to fetch showtimes: ${error.message}`);
    }
};

// 8. Lấy Showtime theo Movie ID
export const getShowtimesByMovieId = async (movieId: string): Promise<Showtime[]> => {
    try {
        const showtimeCollection = collection(firestore, 'showtime');
        const q = query(showtimeCollection, where('idMovie', '==', movieId));
        const showtimeSnapshot = await getDocs(q);

        return showtimeSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                idScreeningRoom: data.idScreeningRoom,
                idMovie: data.idMovie,
                movieName: data.movieName,
                date: data.date, // Keep as string
                startTime: data.startTime, // Keep as string
                endTime: data.endTime, // Keep as string
                ticketPrice: data.ticketPrice
            } as Showtime;
        });
    } catch (error) {
        throw new Error(`Failed to fetch Showtimes by movie ID: ${error.message}`);
    }
};
