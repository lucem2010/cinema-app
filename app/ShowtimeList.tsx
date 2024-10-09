import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import AddShowtimeDialog from './features/Showtime/AddShowtimeDialog';
import { Showtime } from './model/Showtime';
import { addNewShowtime, editShowtime, fetchShowtimesByRoomId, removeShowtime } from './features/Showtime/showtimeSlice';
import ShowtimeItem from './features/Showtime/ShowtimeItem';
import { fetchScreeningRoomById } from './features/ScreeningRoom/screeningSlice';

interface ShowtimeListProps {
    roomId: string;
    duration: number;
    idMovie: string;
    movieName: string;
}

const ShowtimeList: React.FC<ShowtimeListProps> = ({ roomId, duration, idMovie, movieName }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { showtimes, loading, error } = useSelector((state: RootState) => state.showtime);
    const [screeningRoomName, setScreeningRoomName] = useState<string>('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | undefined>(undefined);
    const [editShowtime, setEditShowtime] = useState<Showtime | undefined>(undefined); // State for editing

    useEffect(() => {
        if (roomId) {
            dispatch(fetchShowtimesByRoomId(roomId));
            dispatch(fetchScreeningRoomById(roomId))
                .unwrap()
                .then((screeningRoom) => {
                    setScreeningRoomName(screeningRoom.name);
                })
                .catch((error) => {
                    console.error('Failed to fetch screening room:', error);
                });
        }
    }, [dispatch, roomId]);

    const handleDeleteShowtime = (showtime: Showtime) => {
        setShowtimeToDelete(showtime);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        if (showtimeToDelete) {
            dispatch(removeShowtime(showtimeToDelete.id));
            setShowtimeToDelete(undefined);
        }
        setDeleteDialogVisible(false);
    };

    const handleAddShowtime = (showtime: Showtime) => {
        dispatch(addNewShowtime(showtime));
    };

    const handleEditShowtime = (showtime: Showtime) => {
        setEditShowtime(showtime); // Set the showtime to edit
        setDialogVisible(true); // Open dialog
    };

    const renderItem = ({ item }: { item: Showtime }) => (
        <ShowtimeItem
            showtime={item}
            onEdit={() => handleEditShowtime(item)} // Edit action
            onDelete={() => handleDeleteShowtime(item)}
        />
    );


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.backButton}>{screeningRoomName || 'Tên phòng chiếu'}</Text>

            {showtimes.length === 0 ? (
                <Text>Không có lịch chiếu nào.</Text>
            ) : (
                <FlatList
                    data={showtimes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
            <Button title="Thêm lịch chiếu" onPress={() => {
                setEditShowtime(undefined); // Clear edit state for new showtime
                setDialogVisible(true);
                console.log(showtimes)
            }} />
            <AddShowtimeDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddShowtime={handleAddShowtime}
                onEditShowtime={editShowtime ? handleEditShowtime : undefined} // Pass edit function if editing
                roomId={roomId}
                duration={duration}
                showtimesList={showtimes}
                idMovie={idMovie}
                movieName={movieName}
                editShowtime={editShowtime} // Pass editShowtime for editing
            />
            <ConfirmDeleteDialog
                visible={deleteDialogVisible}
                onClose={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                itemName={showtimeToDelete?.movieName || ''}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    backButton: {
        margin: 7,
        width: 100,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center',
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ShowtimeList;
