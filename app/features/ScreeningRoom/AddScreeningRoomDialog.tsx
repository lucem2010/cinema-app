import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { addNewSeats } from '../Seat/seatSlice';
import { ScreeningRoom } from '@/app/model/ScreeningRoom ';
import { Seat } from '@/app/model/Seat';



interface AddScreeningRoomDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddScreeningRoom: (screeningRoom: ScreeningRoom) => void;
    onEditScreeningRoom: (screeningRoom: ScreeningRoom) => void;
    screeningRoomToEdit?: ScreeningRoom;
}

const AddScreeningRoomDialog: React.FC<AddScreeningRoomDialogProps> = ({
    visible,
    onClose,
    onAddScreeningRoom,
    onEditScreeningRoom,
    screeningRoomToEdit,
}) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [screenType, setScreenType] = useState('');
    const [location, setLocation] = useState('');
    const [seats, setSeats] = useState<Seat[]>([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (visible) {
            if (screeningRoomToEdit) {
                setId(screeningRoomToEdit.id);
                setName(screeningRoomToEdit.name);
                setCapacity(screeningRoomToEdit.capacity.toString());
                setScreenType(screeningRoomToEdit.screenType);
                setLocation(screeningRoomToEdit.location);
                setSeats(createSeats(screeningRoomToEdit.id, parseInt(screeningRoomToEdit.capacity.toString(), 10)));
            } else {
                setId(Date.now().toString()); // Generate a new unique ID
                setName('');
                setCapacity('');
                setScreenType('');
                setLocation('');
                setSeats([]);
            }
        }
    }, [visible, screeningRoomToEdit]);

    const isFormValid = name !== '' && capacity !== '' && screenType !== '' && location !== '';

    const handleSave = async () => {
        if (isFormValid) {
            const screeningRoom: ScreeningRoom = {
                id,
                name,
                capacity: parseInt(capacity, 10),
                screenType,
                location,
            };

            if (screeningRoomToEdit) {
                onEditScreeningRoom(screeningRoom);
            } else {
                onAddScreeningRoom(screeningRoom);
            }

            // Dispatch the async thunk to save seats to Firestore
            try {
                await dispatch(addNewSeats(seats));
                console.log('Seats saved successfully');
            } catch (error) {
                console.error('Failed to save seats:', error);
            }

            onClose();
        } else {
            alert('Please fill in all fields');
        }
    };

    const createSeats = (screeningRoomID: string, capacity: number): Seat[] => {
        const seatsArray: Seat[] = [];
        for (let i = 1; i <= capacity; i++) {
            seatsArray.push({
                id: `${screeningRoomID}-Seat-${i}`,  // Unique ID with ScreeningRoomID and seat number
                ScreeningID: screeningRoomID,
                Name: ` ${i}`,
                Status: false,
                IsSet: false,
                // Assuming seats are unavailable by default
            });
        }
        return seatsArray;
    };

    useEffect(() => {
        if (capacity) {
            setSeats(createSeats(id, parseInt(capacity, 10)));
        }
    }, [capacity, id]);

    const renderSeat = ({ item }: { item: Seat }) => (
        <View style={[styles.seatItem, { backgroundColor: item.Status ? '#4CAF50' : '#F44336' }]}>
            <Text style={styles.seatText}>{item.Name}</Text>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>{screeningRoomToEdit ? 'Edit Screening Room' : 'Add Screening Room'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Capacity"
                            keyboardType="numeric"
                            value={capacity}
                            onChangeText={setCapacity}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Screen Type"
                            value={screenType}
                            onChangeText={setScreenType}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={location}
                            onChangeText={setLocation}
                        />
                        <View style={styles.screen}>
                            <Text style={styles.screenText}>Cinema Screen</Text>
                        </View>

                        <View style={styles.seatListContainer}>
                            <FlatList
                                data={seats}
                                renderItem={renderSeat}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSave} disabled={!isFormValid} />
                            <Button title="Cancel" onPress={onClose} color="#ff4d4d" />
                        </View>
                    </ScrollView>
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
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    seatListContainer: {
        width: '100%',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    screen: {
        width: '80%',
        height: 40,
        backgroundColor: '#ccc',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    screenText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    seatItem: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    seatText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddScreeningRoomDialog;
