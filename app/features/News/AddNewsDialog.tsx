import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView } from 'react-native';
import { News } from '@/app/model/News'; // Import your News interface

interface AddNewDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddNew: (newsItem: News) => void;
    onEditNew: (newsItem: News) => void;
    newsToEdit?: News; // Prop to handle the news item being edited
}

const AddNewDialog: React.FC<AddNewDialogProps> = ({
    visible,
    onClose,
    onAddNew,
    onEditNew,
    newsToEdit,
}) => {
    const [link, setLink] = useState('');
    const [information, setInformation] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    // Reset the form fields when the dialog opens or when a news item is provided
    useEffect(() => {
        if (newsToEdit) {
            setLink(newsToEdit.link);
            setInformation(newsToEdit.information);
            setErrorMessage(''); // Clear error message when editing
        } else {
            setLink('');
            setInformation('');
            setErrorMessage(''); // Clear error message when adding
        }
    }, [newsToEdit]);

    const handleSave = () => {
        // Reset error message
        setErrorMessage('');

        // Validate fields
        if (link.trim() === '' || information.trim() === '') {
            setErrorMessage('Hãy điền đủ thông tin .'); // Set error message
            return;
        }

        const newsItem: News = {
            id: newsToEdit ? newsToEdit.id : Date.now().toString(), // Use existing ID if editing, else generate a new one
            link,
            information,
        };

        if (newsToEdit) {
            onEditNew(newsItem); // Edit the existing news item
        } else {
            onAddNew(newsItem); // Add a new news item
            setLink('');
            setInformation('');
        }

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>{newsToEdit ? 'Edit News' : 'Add News'}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Đường dẫn ảnh"
                            value={link}
                            onChangeText={setLink}
                        />

                        <TextInput
                            style={[styles.input, styles.multilineInput]} // Specific style for multiline
                            placeholder="Thông tin"
                            value={information}
                            onChangeText={setInformation}
                            multiline
                            numberOfLines={4} // Show 4 lines initially
                            textAlignVertical="top" // Align text at the top
                        />

                        {/* Display error message if it exists */}
                        {errorMessage ? (
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                        ) : null}

                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSave} />
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
    multilineInput: {
        height: 100, // Set height for multiline input
    },
    errorMessage: {
        color: 'red', // Style for the error message
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default AddNewDialog;
