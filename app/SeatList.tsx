import React, { useEffect } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchSeatsByScreeningId, addNewSeats } from './features/Seat/seatSlice'; // Updated actions
import { Seat } from '@/app/model/Seat';
import SeatItem from './features/Seat/seatItem';

interface SeatListProps {
    roomId: string;
    sum: number;
}

const SeatList: React.FC<SeatListProps> = ({ roomId, sum }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { seats, loading, error } = useSelector((state: RootState) => state.seat);

    useEffect(() => {
        if (roomId) {
            dispatch(fetchSeatsByScreeningId(roomId));
        }
    }, [roomId, dispatch]);

    const getNextSeatNumber = () => {
        const seatNumbers = seats.map(seat => parseInt(seat.Name.replace(/\D/g, ''), 10));
        const maxNumber = seatNumbers.length > 0 ? Math.max(...seatNumbers) : 0;
        return maxNumber + 1;
    };

    const handleOpenAddSeatDialog = () => {
        const nextSeatNumber = getNextSeatNumber();
        const newSeats: Seat[] = [];

        for (let i = 0; i < sum; i++) {
            const seatNumber = nextSeatNumber + i;
            const newSeat: Seat = {
                id: (Date.now() + i).toString(), // Generate a new unique ID
                ScreeningID: roomId,
                Name: seatNumber.toString(),
                Status: false,
                IsSet: false
            };
            newSeats.push(newSeat);
        }

        console.log('Adding seats:', newSeats); // Check newSeats values
        dispatch(addNewSeats(newSeats));
    };

    const renderItem = ({ item }: { item: Seat }) => (
        <SeatItem seat={item} />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={seats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <Button title="Thêm ghế" onPress={handleOpenAddSeatDialog} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default SeatList;
