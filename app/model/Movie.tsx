
export interface Movie {
    id: string; // Mã định danh phim
    FilmTypeID: string[];   // Danh sách các loại phim
    Name: string; // Tên phim
    Duration: number; // Thời lượng phim
    Rating: number; // Đánh giá phim
    Poster: string; // Ảnh bìa phim
    Trailer: string; // Đường dẫn trailer phim
    Language: string; // Ngôn ngữ của phim
    Status: string; // Trạng thái phim (đang chiếu, sắp ra mắt, ...)
    Director: string; // Đạo diễn phim
    ActorID: string[]; // Diễn viên tham gia
    ScreeningRoomsID: string[];  // Danh sách phòng chiếu phim
    Introduction: string; // Giới thiệu về phim
    ReleaseDate: string; // Ngày ra mắt phim
    AgeRating: string; // Độ tuổi phù hợp cho phim
}

