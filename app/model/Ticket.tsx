import { SelectedFood } from "./SelectedFood";

export interface Ticket {
    id: string;
    MovieID: string;
    ScreeningRoomID: string;
    ShowtimeID: string;
    SeatID: string[];
    UserID: string;
    TotalPrice: number;
    selectedFood: SelectedFood[] ; // Cập nhật để lưu trữ danh sách đồ ăn đã chọn và số lượng
}
