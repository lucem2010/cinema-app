import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface Seat {
    id: string;
    ScreeningID: string;
    Name: string;
    Status: boolean;
}

interface SeatItemProps {
    seat: Seat;
  
}

const SeatItem: React.FC<SeatItemProps> = ({ seat }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Text style={styles.menuText}>...</Text>
            </TouchableOpacity>
            <Text style={styles.name}>{seat.Name}</Text>
            <Modal
                transparent
                visible={menuVisible}
                onRequestClose={toggleMenu}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                       
                        <TouchableOpacity style={styles.modalButton} onPress={toggleMenu}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 6,
        borderRadius: 4,
        marginBottom: 6,
        backgroundColor: '#333', // Dark background color
        alignItems: 'flex-start', // Align items to the start (left)
        justifyContent: 'center',
        position: 'relative',
        width: 60, // Ensure minimum width for the item
    },
    menuButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#555', // Slightly lighter for the button
        padding: 4,
        borderRadius: 20,
    },
    menuText: {
        color: '#fff',
        fontSize: 12, // Further reduced font size
    },
    name: {
        fontSize: 14, // Further reduced font size
        color: '#fff',
        fontWeight: '500', // Slightly lighter weight
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: 140, // Further reduced width
        padding: 10, // Further reduced padding
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButton: {
        paddingVertical: 6, // Further reduced padding
        paddingHorizontal: 12, // Further reduced padding
        borderRadius: 4,
        marginBottom: 6,
        backgroundColor: '#2196F3',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '500', // Slightly lighter weight
    },
});

export default SeatItem;
