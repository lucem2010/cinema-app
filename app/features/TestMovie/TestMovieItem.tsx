import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScreeningRooms } from '../ScreeningRoom/screeningSlice';
import { fetchShowtimesByRoomId } from '../Showtime/showtimeSlice';
import { RootState } from '@/store/store';
import { Movie } from '@/app/model/Movie';
import ShowtimeList from '@/app/ShowtimeList';
import { updateMovieStatusById } from './TestMovieSlice';

interface MovieItemProps {
    movie: Movie;
    onEdit: () => void;
    onDelete: () => void;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie, onEdit, onDelete }) => {
    const dispatch = useDispatch();
    const { screeningRooms } = useSelector((state: RootState) => state.screeningRoom);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedScreeningRoom, setSelectedScreeningRoom] = useState<string | null>(null);

    // Open modal and fetch screening rooms
    const openModal = () => {
        dispatch(fetchScreeningRooms());
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Fetch showtimes when a screening room is selected
    useEffect(() => {
        if (selectedScreeningRoom) {
            dispatch(fetchShowtimesByRoomId(selectedScreeningRoom));
        }
    }, [dispatch, selectedScreeningRoom]);



    const handleSave = () => {
        if (!selectedScreeningRoom) {
            alert('Trùng lịch');
            return;
        }

        // Check if the movie status is "Sắp chiếu"
        if (movie.Status === 'Sắp chiếu') {
            dispatch(updateMovieStatusById({ movieId: movie.id, newStatus: 'Đang Chiếu' }));
        }

        console.log('Selected Screening Room:', selectedScreeningRoom);
        closeModal();
    };


    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.name}>{movie.Name}</Text>
                <Text style={styles.duration}>{`${Math.floor(movie.Duration / 60)}h ${movie.Duration % 60}m`}</Text>
                <Text style={styles.screeningRooms}>Screening Rooms: {movie.ScreeningRoomsID.join(', ')}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={onEdit}>
                    <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
                    <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.scheduleButton]} onPress={openModal}>
                    <Text style={styles.buttonText}>lịch trình</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for updating screening schedule */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <SafeAreaView style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View>
                            <Text style={styles.modalTitle}>Update Screening Schedule</Text>

                            {/* Screening Room Selection */}
                            <Text style={styles.subTitle}>Select Screening Room:</Text>
                            {screeningRooms && screeningRooms.length > 0 ? (
                                screeningRooms.map(room => (
                                    <TouchableOpacity
                                        key={room.id}
                                        style={styles.screeningRoomButton}
                                        onPress={() => setSelectedScreeningRoom(room.id)}
                                    >
                                        <Text
                                            style={[styles.screeningRoomText, selectedScreeningRoom === room.id ? styles.selectedRoom : null]}
                                        >
                                            {room.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No screening rooms available</Text>
                            )}


                            {selectedScreeningRoom && (
                                <>
                                    <Text style={styles.subTitle}>Select Start Time:</Text>

                                    <ShowtimeList

                                        roomId={selectedScreeningRoom}
                                        duration={typeof movie.Duration === 'number' ? movie.Duration : parseInt(movie.Duration, 10)}
                                        idMovie={movie.id}
                                        movieName={movie.Name}
                                    />

                                </>
                            )}

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={closeModal}>
                                <Text style={styles.saveButtonText}>close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    duration: {
        fontSize: 14,
        color: '#555',
    },
    screeningRooms: {
        fontSize: 12,
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 4,
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
    },
    scheduleButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        margin: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    screeningRoomButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
    },
    screeningRoomText: {
        fontSize: 16,
    },
    selectedRoom: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default MovieItem;
