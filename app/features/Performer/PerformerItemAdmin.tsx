import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { Performer } from '@/app/model/Performer'; // Adjust the import path if necessary

interface PerformerItemProps {
    performer: Performer;
    onEdit: () => void;
    onDelete: () => void;
}

const PerformerItemAdmin: React.FC<PerformerItemProps> = ({ performer, onEdit, onDelete }) => {
    const navigation = useNavigation(); // Get the navigation object

    // Navigate to the PerformerDetails screen and pass the Performer object
    const handleViewDetails = () => {
        navigation.navigate('PerformerDetails', { performer });
    };

    return (
        <View style={styles.itemContainer}>
            <View style={styles.contentRow}>
                <Image source={{ uri: performer.img }} style={styles.image} />

                <View style={styles.textContainer}>
                    <Text style={styles.name}>{performer.name}</Text>
                </View>
            </View>

            {/* Action buttons below the image */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                    <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    contentRow: {
        flexDirection: 'row', // Arrange items in a row
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Take up remaining space
        justifyContent: 'center',
    },
    name: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PerformerItemAdmin;
