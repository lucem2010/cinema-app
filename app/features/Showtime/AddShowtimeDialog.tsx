import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Platform, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Showtime } from '@/app/model/Showtime';

interface AddShowtimeDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddShowtime: (showtime: Showtime) => void;
    roomId: string | null;
    duration: number;
    showtimesList: Showtime[];
    idMovie: string;
    movieName: string;
}

const AddShowtimeDialog: React.FC<AddShowtimeDialogProps> = ({
    visible,
    onClose,
    onAddShowtime,
    roomId,
    duration,
    showtimesList,
    idMovie,
    movieName,
}) => {
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [ticketPrice, setTicketPrice] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);

    // Effect to reset fields when modal is opened
    useEffect(() => {
        if (visible) {
            setDate(new Date());
            setStartTime(new Date());
            setTicketPrice('');
        }
    }, [visible]);

    const handleDateChange = (event: Event, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleStartTimeChange = (event: Event, selectedTime?: Date) => {
        const currentTime = selectedTime || startTime;
        setShowStartTimePicker(Platform.OS === 'ios');
        setStartTime(currentTime);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showStartTimepicker = () => {
        setShowStartTimePicker(true);
    };

    const parseDateTime = (date, time) => {
        const [day, month, year] = date.split('/');
        const [hours, minutes] = time.split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    const checkOverlap = (newStart, newEnd) => {
        // Lọc ra các showtime có cùng ngày với showtime mới
        const overlappingShowtimes = showtimesList.filter(showtime => {
            const showtimeStart = parseDateTime(showtime.date, showtime.startTime);
            const showtimeEnd = parseDateTime(showtime.date, showtime.endTime);

            return (
                newStart.toDateString() === showtimeStart.toDateString()
            );
        });

        // Nếu có showtime chồng lấp, log chúng ra
        if (overlappingShowtimes.length > 0) {
            console.log('Showtimes overlapping with the new start time:', overlappingShowtimes);
        }

        // Kiểm tra sự chồng lấp thời gian
        const hasTimeOverlap = overlappingShowtimes.some(showtime => {
            const showtimeStart = parseDateTime(showtime.date, showtime.startTime);
            const showtimeEnd = parseDateTime(showtime.date, showtime.endTime);

            // Kiểm tra trùng lặp thời gian
            return (
                (newStart < showtimeEnd && newEnd > showtimeStart)   // Khoảng thời gian mới chồng lấp bất kỳ khoảng thời gian nào của showtime cũ
            );
        });

        // Trả về false nếu có sự chồng lấp thời gian, true nếu không có trùng lặp
        return !hasTimeOverlap;
    };



    const handleSave = () => {
        const combinedStartTime = new Date(date);
        combinedStartTime.setHours(startTime.getHours());
        combinedStartTime.setMinutes(startTime.getMinutes());

        const endTime = new Date(combinedStartTime.getTime() + (duration + 30) * 60000);
        const price = parseFloat(ticketPrice);

        if (isNaN(price) || price <= 0) {
            Alert.alert('Error', 'Please enter a valid ticket price.');
            return;
        }

        if (!checkOverlap(combinedStartTime, endTime)) {
            Alert.alert('Error', 'Trùng lịch.');
            return;
        }

        const newShowtime: Showtime = {
            id: Date.now().toString(),
            date: formatDateOnly(date),
            startTime: formatTimeOnly(combinedStartTime),
            endTime: formatTimeOnly(endTime),
            idScreeningRoom: roomId || '',
            idMovie: idMovie,
            movieName: movieName,
            ticketPrice: price
        };

        onAddShowtime(newShowtime);
        Alert.alert('Success', 'Showtime added successfully.');
        onClose();
    };

    const formatDateOnly = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTimeOnly = (time: Date) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Add Showtime</Text>
                    <Text style={styles.title}>Phim: {movieName}</Text>
                    <Button title="Select Date" onPress={showDatepicker} />
                    <Button title="Select Start Time" onPress={showStartTimepicker} />

                    <Text style={styles.selectedText}>{`Selected Date: ${formatDateOnly(date)}`}</Text>
                    <Text style={styles.selectedText}>{`Start Time: ${formatTimeOnly(startTime)}`}</Text>
                    <Text style={styles.selectedText}>{`End Time: ${formatTimeOnly(new Date(startTime.getTime() + (duration + 30) * 60000))}`}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Giá vé"
                        keyboardType="numeric"
                        value={ticketPrice}
                        onChangeText={setTicketPrice}
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            value={date}
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {showStartTimePicker && (
                        <DateTimePicker
                            mode="time"
                            value={startTime}
                            display="default"
                            onChange={handleStartTimeChange}
                        />
                    )}

                    <View style={styles.buttonContainer}>
                        <Button title="Save" onPress={handleSave} />
                        <Button title="Cancel" onPress={onClose} color="#ff4d4d" />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    selectedText: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default AddShowtimeDialog;
