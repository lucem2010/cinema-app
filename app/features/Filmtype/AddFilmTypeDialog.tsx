import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { FilmType } from '@/app/model/FilmType'; // Ensure the path is correct

interface AddFilmTypeDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddFilmType: (filmType: FilmType) => void;
    onEditFilmType: (filmType: FilmType) => void;
    filmTypeToEdit?: FilmType; // Optional prop to handle edit mode
}

const AddFilmTypeDialog: React.FC<AddFilmTypeDialogProps> = ({
    visible,
    onClose,
    onAddFilmType,
    onEditFilmType,
    filmTypeToEdit
}) => {
    const [filmTypeName, setFilmTypeName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (filmTypeToEdit) {
            setFilmTypeName(filmTypeToEdit.name);
            setErrorMessage(''); // Clear error message when editing
        } else {
            setFilmTypeName('');
            setErrorMessage(''); // Clear error message when adding new
        }
    }, [filmTypeToEdit]);

    const handleAddFilmType = () => {
        if (filmTypeName.trim() === '') {
            setErrorMessage('Vui lòng nhập tên loại phim.'); // Show error message
            return;
        }

        setErrorMessage(''); // Clear error message if valid input

        if (filmTypeToEdit) {
            onEditFilmType({ ...filmTypeToEdit, name: filmTypeName });
        } else {
            onAddFilmType({ id: Date.now().toString(), name: filmTypeName });
        }

        setFilmTypeName('');
        onClose();
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>
                        {filmTypeToEdit ? 'Sửa loại phim' : 'Thêm loại phim'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên loại phim"
                        value={filmTypeName}
                        onChangeText={setFilmTypeName}
                    />
                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                    <View style={styles.buttons}>
                        <Button title="Hủy" onPress={onClose} />
                        <Button title="Xác nhận" onPress={handleAddFilmType} />
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
    dialog: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 5,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    error: {
        color: 'red',
      
    },
});

export default AddFilmTypeDialog;
