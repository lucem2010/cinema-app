import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchTickets } from './features/Ticket/ticketSlice';
import { fetchMovies } from './features/TestMovie/TestMovieSlice';
import { fetchFoods } from './features/Food/foodSlice'; // Giả sử bạn có slice này để lấy danh sách đồ ăn

const RevenueScreen = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Fetch tickets, movies, and foods data
    const { tickets, loading: ticketsLoading, error: ticketsError } = useSelector((state: RootState) => state.ticket);
    const { movies, loading: moviesLoading, error: moviesError } = useSelector((state: RootState) => state.movie);
    const { foods, loading: foodsLoading, error: foodsError } = useSelector((state: RootState) => state.food);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFoodData, setSelectedFoodData] = useState([]); // Chứa dữ liệu đồ ăn đã chọn để hiển thị trong modal

    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchMovies());
        dispatch(fetchFoods()); // Lấy danh sách đồ ăn
    }, [dispatch]);

    // Tính tổng doanh thu từ vé cho một bộ phim
    const calculateRevenueForMovie = (movieID: string) => {
        const ticketsForMovie = tickets.filter(ticket => ticket.MovieID === movieID);
        const totalRevenue = ticketsForMovie.reduce((acc, ticket) => acc + ticket.TotalPrice, 0);
        return totalRevenue;
    };

    // Tính doanh thu từ đồ ăn đã bán dựa trên các vé liên quan đến phim
    const calculateFoodRevenueForMovie = (movieID: string) => {
        const ticketsForMovie = tickets.filter(ticket => ticket.MovieID === movieID);
        const foodRevenueMap = ticketsForMovie.reduce((acc, ticket) => {
            ticket.selectedFood.forEach(selectedFoodItem => {
                const { foodID, quantity } = selectedFoodItem;
                const foodItem = foods.find(food => food.id === foodID);
                if (foodItem) {
                    if (!acc[foodID]) {
                        acc[foodID] = {
                            food: foodItem,
                            totalQuantity: 0,
                            totalRevenue: 0,
                        };
                    }
                    acc[foodID].totalQuantity += quantity;
                    acc[foodID].totalRevenue += quantity * foodItem.price;
                }
            });
            return acc;
        }, {} as Record<string, { food: any; totalQuantity: number; totalRevenue: number }>);

        return Object.values(foodRevenueMap);
    };

    // Hàm xử lý khi nhấn vào nút "Chi tiết"
    const handleShowDetails = (foodData) => {
        setSelectedFoodData(foodData); // Cập nhật dữ liệu đồ ăn vào state
        setModalVisible(true); // Hiển thị modal
    };

    // Hàm render hiển thị doanh thu cho mỗi phim
    const renderMovieRevenue = ({ item: movie }) => {
        const ticketRevenue = calculateRevenueForMovie(movie.id);
        const foodData = calculateFoodRevenueForMovie(movie.id);
        const totalFoodRevenue = foodData.reduce((acc, foodItem) => acc + foodItem.totalRevenue, 0);
        const netTicketRevenue = ticketRevenue - totalFoodRevenue;

        return (
            <View style={styles.movieContainer}>
                <Text style={styles.movieTitle}>{movie.Name}</Text>
                <Text style={styles.revenueText}>
                    Tổng doanh thu vé : {netTicketRevenue.toLocaleString()} VND
                </Text>
                <Text style={styles.revenueText}>
                    Tổng doanh thu từ đồ ăn: {totalFoodRevenue.toLocaleString()} VND
                </Text>

                {/* Nút hiển thị chi tiết */}
                <TouchableOpacity onPress={() => handleShowDetails(foodData)} style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Chi tiết</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Doanh thu phim</Text>
            <FlatList
                data={movies}
                renderItem={renderMovieRevenue}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No data available.</Text>}
            />

            {/* Modal hiển thị chi tiết đồ ăn */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chi tiết doanh thu đồ ăn</Text>

                        {/* Hiển thị chi tiết về doanh thu từ từng loại đồ ăn */}
                        {selectedFoodData.map(foodItem => (
                            <View key={foodItem.food.id} style={styles.foodContainer}>
                                <Text style={styles.foodTitle}>Đồ ăn: {foodItem.food.name}</Text>
                                <Text>Số lượng : {foodItem.food.quantity}</Text>
                                <Text>Số lượng đã bán: {foodItem.totalQuantity}</Text>
                                <Text>Giá mỗi phần: {foodItem.food.price.toLocaleString()} VND</Text>
                                <Text>Tổng doanh thu: {foodItem.totalRevenue.toLocaleString()} VND</Text>
                            </View>
                        ))}

                        {/* Nút đóng modal */}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RevenueScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    movieContainer: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    revenueText: {
        fontSize: 16,
        marginTop: 8,
    },
    detailButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    detailButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    foodContainer: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    foodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
