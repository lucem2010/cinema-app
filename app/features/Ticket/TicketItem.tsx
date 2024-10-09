import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ticket } from '@/app/model/Ticket'; // Import interfaces
import { useDispatch, useSelector } from 'react-redux';
import { SelectedFood } from '@/app/model/SelectedFood';
import { RootState } from '@/store/store';
import { fetchFoods } from '../Food/foodSlice';
import { format } from 'date-fns';
import { fetchShowtimesId } from '../Showtime/showtimeSlice';
import { fetchScreeningRoomById } from '../ScreeningRoom/screeningSlice';
import { fetchSeatsByIds } from '../Seat/seatSlice';

interface TicketItemProps {
    ticket: Ticket;
    onPress?: () => void; // Optional onPress handler for item click
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onPress }) => {
    const dispatch = useDispatch();
    const { fetchedSeatsByIdss } = useSelector((state: RootState) => state.seat);
    const { foods } = useSelector((state: RootState) => state.food);
    const { movies } = useSelector((state: RootState) => state.movie);
    const { showtimes } = useSelector((state: RootState) => state.showtime);
    const { screeningRooms } = useSelector((state: RootState) => state.screeningRoom);

    useEffect(() => {
        // Dispatch actions when the component mounts
        dispatch(fetchFoods());
        dispatch(fetchShowtimesId(ticket.ShowtimeID)); // Fetch showtimes by ID
        dispatch(fetchScreeningRoomById(ticket.ScreeningRoomID)); // Fetch screening room name by ID
        dispatch(fetchSeatsByIds(ticket.SeatID)); // Fetch screening room name by ID

    }, [dispatch, ticket.ShowtimeID, ticket.ScreeningRoomID, ticket.SeatID]);

    // Extract data from the Redux store
    const screeningRoom = screeningRooms.find(room => room.id === ticket.ScreeningRoomID);
    const movie = movies.find(m => m.id === ticket.MovieID);
    const showtime = showtimes.find(s => s.id === ticket.ShowtimeID);



    // Retrieve seats based on the SeatID from the ticket
    const seatIds = Array.isArray(ticket.SeatID) ? ticket.SeatID : [ticket.SeatID];
    const fetchedSeats = seatIds.map(id => fetchedSeatsByIdss[id]).filter(seat => seat !== null);

    // Filter the seat names from the fetched seats
    const seatNames = fetchedSeats.map(seat => seat?.Name).join(', ');

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.ticketInfo}>
                <Text style={styles.movieTitle}> {movie?.Name || 'Loading...'}</Text>
                <Text style={styles.showtime}>Ngày chiếu: {showtime?.date}</Text>
                <Text style={styles.room}>Phòng: {screeningRoom?.name || 'Loading...'}</Text>

                <Text style={styles.seat}>Ghế ngồi: {seatNames}</Text>

                <Text style={styles.totalPrice}>Tổng tiền: {ticket.TotalPrice.toFixed(2)}Đ</Text>

                {ticket.selectedFood.length > 0 && (
                    <View style={styles.foodsContainer}>
                        <Text style={styles.foodsTitle}>Đồ ăn:</Text>
                        {ticket.selectedFood.map((selectedFood: SelectedFood) => {
                            const food = foods.find(f => f.id === selectedFood.foodID);
                            return (
                                food && (
                                    <Text key={selectedFood.foodID} style={styles.foodItem}>
                                        {food.name} (x{selectedFood.quantity})
                                    </Text>
                                )
                            );
                        })}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    ticketInfo: {
        flexDirection: 'column',
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    room: {
        fontSize: 14,
        marginBottom: 5,
    },
    seat: {
        fontSize: 14,
        marginBottom: 5,
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        color: '#ff6347',
    },
    foodsContainer: {
        marginTop: 10,
    },
    foodsTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    foodItem: {
        fontSize: 14,
    },
});

export default TicketItem;
