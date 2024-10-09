import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Ticket } from '@/app/model/Ticket';

// 1. Thêm mới Ticket
export const addTicket = async (ticket: Ticket): Promise<void> => {
    try {
        const ticketRef = doc(firestore, 'ticket', ticket.id);
        await setDoc(ticketRef, ticket);  // Thêm mới Ticket vào Firestore
    } catch (error) {
        throw new Error(`Failed to add Ticket: ${error.message}`);
    }
};

// 2. Cập nhật Ticket
export const updateTicket = async (ticket: Ticket): Promise<void> => {
    try {
        const ticketRef = doc(firestore, 'ticket', ticket.id);
        await updateDoc(ticketRef, {
            MovieID: ticket.MovieID,                    // Cập nhật MovieID
            ScreeningRoomID: ticket.ScreeningRoomID,    // Cập nhật ScreeningRoomID
            ShowtimeID: ticket.ShowtimeID,              // Cập nhật ShowtimeID
            SeatID: ticket.SeatID,                      // Cập nhật danh sách ghế
            UserID: ticket.UserID,                      // Cập nhật UserID
            TotalPrice: ticket.TotalPrice,              // Cập nhật tổng giá
            selectedFood: ticket.selectedFood           // Cập nhật danh sách đồ ăn đã chọn
        });
    } catch (error) {
        throw new Error(`Failed to update Ticket: ${error.message}`);
    }
};

// 3. Xóa Ticket
export const deleteTicket = async (ticketId: string): Promise<void> => {
    try {
        const ticketRef = doc(firestore, 'ticket', ticketId);
        await deleteDoc(ticketRef);  // Xóa Ticket
    } catch (error) {
        throw new Error(`Failed to delete Ticket: ${error.message}`);
    }
};

// 4. Lấy tất cả các Ticket
export const getAllTickets = async (): Promise<Ticket[]> => {
    try {
        const ticketCollection = collection(firestore, 'ticket');
        const ticketSnapshot = await getDocs(ticketCollection);

        const tickets: Ticket[] = ticketSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Ticket[];

        return tickets;  // Trả về danh sách tất cả các Ticket
    } catch (error) {
        throw new Error(`Failed to fetch Tickets: ${error.message}`);
    }
};

// 5. Lấy Ticket theo ID
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
    try {
        const ticketRef = doc(firestore, 'ticket', ticketId);
        const ticketDoc = await getDoc(ticketRef);

        if (ticketDoc.exists()) {
            return ticketDoc.data() as Ticket;  // Trả về Ticket nếu tồn tại
        } else {
            return null;  // Trả về null nếu không tìm thấy
        }
    } catch (error) {
        throw new Error(`Failed to fetch Ticket: ${error.message}`);
    }
};


export const getTicketsByUserId = async (userId: string): Promise<Ticket[]> => {
    try {
        const ticketsRef = collection(firestore, 'ticket');
        const q = query(ticketsRef, where('UserID', '==', userId));
        const querySnapshot = await getDocs(q);

        const tickets: Ticket[] = [];
        querySnapshot.forEach((doc) => {
            tickets.push(doc.data() as Ticket); // Lưu trữ từng Ticket vào mảng
        });

        return tickets;  // Trả về danh sách các Ticket của người dùng
    } catch (error) {
        throw new Error(`Failed to fetch Tickets for userId ${userId}: ${error.message}`);
    }
};