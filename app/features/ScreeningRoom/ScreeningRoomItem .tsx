import { ScreeningRoom } from '@/app/model/ScreeningRoom ';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ScreeningRoomItemProps {
    screeningRoom: ScreeningRoom;
    onEdit: () => void;
    onDelete: () => void;
}

const ScreeningRoomItem: React.FC<ScreeningRoomItemProps> = ({ screeningRoom, onEdit, onDelete }) => {
    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.name}>{screeningRoom.name}</Text>
                <Text style={styles.capacity}>Capacity: {screeningRoom.capacity}</Text>
                <Text style={styles.screenType}>Screen Type: {screeningRoom.screenType}</Text>
                <Text style={styles.location}>Location: {screeningRoom.location}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={onEdit}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
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
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    capacity: {
        fontSize: 14,
        color: '#333',
    },
    screenType: {
        fontSize: 14,
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: '#333',
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

export default ScreeningRoomItem;
