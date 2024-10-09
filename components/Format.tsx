import { format } from "date-fns";

export const formatReleaseDate = (releaseDate: string) => {
    const date = new Date(releaseDate); // Chuyển chuỗi ngày tháng thành đối tượng Date
    return format(date, 'dd/MM/yyyy'); // Định dạng ngày thành 'dd/MM/yyyy'
};

export const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};