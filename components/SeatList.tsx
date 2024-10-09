import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeatsByScreeningId, updateSeatStatusSlice } from "@/app/features/Seat/seatSlice";
import { RootState } from "@/store/store";
import { Seat } from "@/app/model/Seat";

interface SeatGridProps {
    screeningId: string;
    setSeat: (seats: Seat[]) => void; // Update type for setSeat
}

const SeatGrid: React.FC<SeatGridProps> = ({ screeningId, setSeat }) => {
    const dispatch = useDispatch();
    const seats = useSelector((state: RootState) => state.seat.seatsByScreeningId[screeningId]);
    const loading = useSelector((state: RootState) => state.seat.loading);
    const error = useSelector((state: RootState) => state.seat.error);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // Store selected seat IDs

    useEffect(() => {
        dispatch(fetchSeatsByScreeningId(screeningId));
    }, [dispatch, screeningId]);

    const handleSelectSeat = (seatId: string, currentStatus: boolean) => {
        // If the seat is already set, do nothing
        if (currentStatus) {
            return; // If seat is already set (IsSet = true), do nothing
        }

        // Update the list of selected seats
        if (selectedSeats.includes(seatId)) {
            // Deselect seat
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
            dispatch(updateSeatStatusSlice({ seatId, newStatus: false })); // Update seat status to false
            setSeat(prevSeats => prevSeats.filter(seat => seat.id !== seatId)); // Remove seat from setSeat
        } else {
            // Select seat
            setSelectedSeats([...selectedSeats, seatId]);
            dispatch(updateSeatStatusSlice({ seatId, newStatus: true })); // Update seat status to true
            const selectedSeat = seats.find(seat => seat.id === seatId);
            if (selectedSeat) {
                setSeat(prevSeats => [...prevSeats, selectedSeat]); // Add seat to setSeat
            }
        }
    };

    const renderRow = ({ item, index }: { item: any[]; index: number }) => (
        <View style={styles.row}>
            {/* Display row number on the left */}
            <View style={styles.rowNumber}>
                <Text style={styles.textWhite}>{index + 1}</Text>
            </View>

            {item.map((seat) => (
                <TouchableOpacity
                    key={seat.id}
                    style={[
                        styles.seat,
                        seat.IsSet && styles.setSeat, // Apply style for already set seats
                        selectedSeats.includes(seat.id) && !seat.IsSet && styles.selectedSeat // Highlight selected seats
                    ]}
                    onPress={() => handleSelectSeat(seat.id, seat.IsSet)} // Use seat.IsSet to determine if the seat is selectable
                    disabled={seat.IsSet} // Disable interaction for seats that are set
                >
                    <Text style={styles.textWhite}>{seat.Name}</Text>
                </TouchableOpacity>
            ))}

            {/* Display row number on the right */}
            <View style={styles.rowNumber}>
                <Text style={styles.textWhite}>{index + 1}</Text>
            </View>
        </View>
    );

    // Sort seats by name in ascending order (based on number)
    const sortedSeats = seats
        ? [...seats].sort((a, b) => parseInt(a.Name) - parseInt(b.Name))
        : [];

    // Divide seats into rows, each containing 9 seats
    const seatRows = [];
    for (let i = 0; i < sortedSeats.length; i += 9) {
        seatRows.push(sortedSeats.slice(i, i + 9)); // Ensure each row has 9 seats
    }

    return (
        <View style={styles.containerSeat}>
            <View style={styles.screenArc}></View>
            {seatRows.length > 0 ? (
                <FlatList
                    data={seatRows}
                    renderItem={renderRow}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text>No seats available.</Text>
            )}
        </View>
    );
};

export default SeatGrid;

const styles = StyleSheet.create({
    containerSeat: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rowNumber: {
        width: 30, // Width for row number column
        alignItems: 'center',
        justifyContent: 'center',
    },
    screenArc: {
        width: '80%',
        height: 25,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderWidth: 5,
        borderColor: 'green',
        alignSelf: 'center',
        marginBottom: 20,
    },
    seat: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
        marginRight: 5,
    },
    selectedSeat: {
        backgroundColor: 'green', // Color for selected seats
    },
    setSeat: {
        backgroundColor: 'skyblue', // Color for already set seats
    },
    textWhite: {
        color: '#fff', // White text color
    },
});
