import { StyleSheet, Text, View, Modal, Button, TouchableOpacity, FlatList, SafeAreaView, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Movie } from '@/app/model/Movie';
import { User } from '@/app/model/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchScreeningRoomsByIds } from '@/app/features/ScreeningRoom/screeningSlice';
import { fetchShowtimesByMovieId } from '@/app/features/Showtime/showtimeSlice';
import { ScreeningRoom } from '@/app/model/ScreeningRoom ';
import { fetchSeatsByScreeningId, updateSeatIsSetSlice } from '@/app/features/Seat/seatSlice';
import { Seat } from '@/app/model/Seat';
import SeatGrid from './SeatList';
import { Icon } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FloatingInfoButton from './FloatButtonDatVe';
import { Showtime } from '@/app/model/Showtime';
import ChooseFoodModal from './ChooseFoodModal';
import { SelectedFood } from '@/app/model/SelectedFood';
import { addNewTicket } from '@/app/features/Ticket/ticketSlice';
import { Ticket } from '@/app/model/Ticket';
import { updateFoodQuantityAndSold } from '@/app/features/Food/foodSlice';
import { useNavigation } from '@react-navigation/native';


interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    movie: Movie;
    user: User;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose, movie, user }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { showtimes, loading: loadingShowtimes, error: errorShowtimes } = useSelector((state: RootState) => state.showtime);
    const { screeningRooms, loading: loadingScreeningRooms, error: errorScreeningRooms } = useSelector((state: RootState) => state.screeningRoom);

    const [selectedScreeningRoom, setSelectedScreeningRoom] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);  // Update to handle string dates
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);  // Update to handle string times
    const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>(showtimes);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedShowTime, setSelectedshowTime] = useState<Showtime | null>(null);
    const [foodModalVisible, setFoodModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(Number);
    const [foodPrice, setfoodPrice] = useState(Number);

    const navigation = useNavigation();

    const selectedScreenRoom = screeningRooms.find(room => room.id === selectedScreeningRoom);
    const [selectedFoodQuantities, setSelectedFoodQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (seats.length > 0 && selectedShowTime) {
            setTotalPrice(selectedShowTime.ticketPrice * seats.length + foodPrice);
        }
    }, [seats, selectedShowTime, foodPrice]);

    useEffect(() => {
        dispatch(fetchShowtimesByMovieId(movie.id)).unwrap()
            .then((fetchedShowtimes) => {
                const ids = fetchedShowtimes.map(showtime => showtime.idScreeningRoom);
                dispatch(fetchScreeningRoomsByIds(ids));
            })
            .catch((error: any) => {
                console.error("Failed to fetch showtimes or screening rooms:", error);
            });
    }, [dispatch, movie.id, selectedScreeningRoom]);

    useEffect(() => {
        const updatedShowtimes = showtimes.filter(showtime =>
            showtime.idScreeningRoom === selectedScreeningRoom &&
            (!selectedDate || showtime.date === selectedDate) &&
            (!selectedStartTime || showtime.startTime === selectedStartTime)
        );
        setFilteredShowtimes(updatedShowtimes);
    }, [selectedScreeningRoom, showtimes, selectedDate, selectedStartTime]);

    const handleSelectScreeningRoom = (screeningRoomId: string) => {
        if (selectedScreeningRoom === screeningRoomId) {
            setSelectedScreeningRoom(null);
            setSelectedDate(null);
            setSelectedStartTime(null);
        } else {
            setSelectedScreeningRoom(screeningRoomId);
            setSelectedDate(null);
            setSelectedStartTime(null);
        }
    };

    const handleDateSelect = (date: string) => {
        if (selectedDate === date) {
            setSelectedDate(null);
            setSelectedStartTime(null);
        } else {
            setSelectedDate(date);
        }
    };

    const handleStartTimeSelect = (time: string) => {
        if (selectedStartTime === time) {
            setSelectedStartTime(null);
        } else {
            setSelectedStartTime(time);
        }
    };

    const renderScreeningRoom = ({ item }: { item: ScreeningRoom }) => (
        <TouchableOpacity
            style={[
                styles.screeningRoomItem,
                selectedScreeningRoom === item.id ? styles.selectedItem : styles.defaultItem
            ]}
            onPress={() => handleSelectScreeningRoom(item.id)}
        >
            <Text style={styles.screeningRoomName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderDateOption = (showTime: Showtime) => (
        <TouchableOpacity
            key={showTime.date}
            style={[
                styles.dateOption,
                selectedDate === showTime.date ? styles.selectedOption : styles.defaultOption
            ]}
            onPress={() => {
                handleDateSelect(showTime.date);
                setSelectedshowTime(showTime);
            }}
        >
            <Text style={styles.optionText}>{showTime.date}</Text>
        </TouchableOpacity>
    );

    const renderTimeOption = (time: string) => (
        <TouchableOpacity
            key={time}
            style={[
                styles.timeOption,
                selectedStartTime === time ? styles.selectedOption : styles.defaultOption
            ]}
            onPress={() => handleStartTimeSelect(time)}
        >
            <Text style={styles.optionText}>{time}</Text>
        </TouchableOpacity>
    );

    const handleModalClose = (updatedPrice: number, selectedFoods: { [key: string]: number }) => {
        setfoodPrice(updatedPrice);
        setSelectedFoodQuantities(selectedFoods);
        setFoodModalVisible(false);
    };
    const handleSubmit = async () => {
        const convertToSelectedFood = (): SelectedFood[] => {
            return Object.entries(selectedFoodQuantities).map(([foodID, quantity]) => ({
                foodID,
                quantity,
            }));
        };

        const selectedFood: SelectedFood[] = convertToSelectedFood();

        // Update food quantities
        for (const food of selectedFood) {
            await dispatch(updateFoodQuantityAndSold({
                foodId: food.foodID,
                quantitySold: food.quantity,
            }));
        }

        // Create ticket object
        const ticket: Ticket = {
            id: Date.now().toString(),
            MovieID: movie.id,
            ScreeningRoomID: selectedScreenRoom?.id!,
            ShowtimeID: selectedShowTime?.id!,
            SeatID: seats.map(seat => seat.id),
            UserID: user.id,
            TotalPrice: totalPrice,
            selectedFood,
        };

        // Update seat statuses
        for (const seat of seats) {
            await dispatch(updateSeatIsSetSlice({
                seatId: seat.id,
                newIsSet: true, // Set this according to your logic (e.g., reserved, booked)
            }));
        }

        // Add the new ticket
        await dispatch(addNewTicket(ticket));

        // Show success message
        Alert.alert("Success", "Đặt vé thành công!", [
            {
                text: "OK", onPress: () => {
                    // Reset fields
                    setSelectedScreeningRoom(null);
                    setSelectedDate(null);
                    setSelectedStartTime(null);
                    setSeats([]);
                    setSelectedshowTime(null);
                    setFoodModalVisible(false);
                    setSelectedFoodQuantities({});
                    setTotalPrice(0);
                    setfoodPrice(0);

                    // Navigate to Home
                    navigation.navigate('Drawer', { screen: 'Home' });
                }
            }
        ]);
    };



    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Text style={[styles.title, { justifyContent: 'center' }]}>Đặt vé</Text>
                </View>
                <View style={{ justifyContent: 'center', width: '100%' }}>
                    <Text style={styles.title}>{movie.Name}</Text>
                </View>

                <Text style={{ color: 'white' }}>Duration: {movie.Duration}</Text>
                <View>
                    <Text style={styles.title}>Select Screening Room</Text>
                    {screeningRooms.length > 0 ? (
                        <FlatList
                            data={screeningRooms}
                            renderItem={renderScreeningRoom}
                            keyExtractor={item => item.id}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <Text style={styles.noScheduleText}>Phim tạm thời chưa có lịch chiếu</Text> // Add your desired style for this text
                    )}
                </View>


                <View>
                    {selectedScreeningRoom && (
                        <>
                            <Text style={styles.title}>Select Date</Text>
                            <ScrollView horizontal style={styles.optionContainer}>
                                {showtimes.filter(showtime => showtime.idScreeningRoom === selectedScreeningRoom)
                                    .map(showtime => renderDateOption(showtime))}
                            </ScrollView>
                        </>
                    )}
                </View>

                <View>
                    {selectedDate && (
                        <>
                            <Text style={styles.title}>Select Start Time</Text>
                            <ScrollView horizontal style={styles.optionContainer}>
                                {filteredShowtimes.map(showtime => renderTimeOption(showtime.startTime))}
                            </ScrollView>
                        </>
                    )}
                </View>

                {selectedStartTime && selectedScreenRoom && selectedShowTime && (
                    <SeatGrid screeningId={selectedScreeningRoom!} setSeat={setSeats} />
                )}

                {selectedStartTime && selectedScreenRoom && selectedShowTime && seats.length > 0 && (
                    <FloatingInfoButton
                        movieName={movie.Name}
                        AgeRating={movie.AgeRating}
                        screenType={selectedScreenRoom?.screenType}
                        Price={totalPrice}
                        onSubmit={handleSubmit}
                        onChooseFood={() => setFoodModalVisible(true)}
                    />
                )}

                {selectedScreeningRoom && selectedShowTime && seats.length > 0 && (
                    <ChooseFoodModal
                        visible={foodModalVisible}
                        onClose={handleModalClose}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};



export default BookingModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#333',
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    loadingText: {
        marginVertical: 10,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    optionContainer: {
        height: 45
    },
    dateOption: {
        padding: 10,
        height: 45,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        marginRight: 5,
    },
    timeOption: {
        padding: 10,
        height: 45,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        marginRight: 5,
    },
    selectedOption: {
        backgroundColor: 'red', // Change to red for selected items
    },
    defaultOption: {
        backgroundColor: '#444', // Dark gray for unselected items
    },

    selectedItem: {
        backgroundColor: 'red', // Change to red for selected screening rooms
    },
    defaultItem: {
        backgroundColor: '#444', // Dark gray for unselected screening rooms
    },
    optionText: {
        color: '#fff',
    },

    screeningRoomItem: {

        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: 70, // Adjust the width for horizontal layout
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        marginRight: 10, // Add margin to space out items horizontally

    },
    screeningRoomName: {
        fontSize: 16,
        color: '#fff',
        flex: 1,
    },

    navigateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    navigateButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    showtimesList: {
        marginTop: 10,
    },
    noScheduleText: {
        color: 'white', // or any other color you prefer
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },

});
