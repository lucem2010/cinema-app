import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Showtime } from '@/app/model/Showtime';

interface ShowtimeItemProps {
    showtime: Showtime;

    onDelete: () => void;
}

const ShowtimeItem: React.FC<ShowtimeItemProps> = ({ showtime, onEdit, onDelete }) => {
    // No need to convert `date` to a Date object since it already contains the date as a string
    const formatDate = (dateString: string) => {
        return dateString; // Assuming the date is already formatted as "DD/MM/YYYY"
    };

    // `startTime` and `endTime` only contain time (HH:MM)
    const formatTime = (timeString: string) => {
        return timeString; // Assuming the time is already formatted as "HH:MM"
    };

    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.date}>
                    {formatDate(showtime.date)} {/* Show formatted date */}
                </Text>
                <Text style={styles.time}>
                    {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}
                </Text>
                <Text style={styles.movieTitle}>
                    Phim: {showtime.movieName} {/* Display movie info */}
                </Text>
                <Text style={styles.movieTitle}>
                    Giá: {showtime.ticketPrice} {/* Display ticket price */}
                </Text>
            </View>
            <View style={styles.actions}>

                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
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
    date: {
        fontSize: 14,
        color: '#555',
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    movieTitle: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ShowtimeItem;
