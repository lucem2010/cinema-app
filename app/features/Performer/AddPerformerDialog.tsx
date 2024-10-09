import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView } from 'react-native';
import { Performer } from '@/app/model/Performer';

interface AddPerformerDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddPerformer: (performerItem: Performer) => void;
    onEditPerformer: (performerItem: Performer) => void;
    performerToEdit?: Performer;
}

const AddPerformerDialog: React.FC<AddPerformerDialogProps> = ({
    visible,
    onClose,
    onAddPerformer,
    onEditPerformer,
    performerToEdit,
}) => {
    const [img, setImg] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (performerToEdit) {
            setImg(performerToEdit.img);
            setName(performerToEdit.name);
            setErrorMessage('');
        } else {
            setImg('');
            setName('');
            setErrorMessage('');
        }
    }, [performerToEdit]);

    const handleSave = () => {
        setErrorMessage('');

        if (img.trim() === '' || name.trim() === '') {
            setErrorMessage('Hãy điền đủ thông tin .');
            return;
        }

        const performerItem: Performer = {
            id: performerToEdit ? performerToEdit.id : Date.now().toString(),
            img,
            name,
        };

        if (performerToEdit) {
            onEditPerformer(performerItem);
        } else {
            onAddPerformer(performerItem);
            setImg('');
            setName('');
        }

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>
                            {performerToEdit ? 'Edit Performer' : 'Add Performer'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Đường dẫn ảnh"
                            value={img}
                            onChangeText={setImg}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tên nghệ sĩ"
                            value={name}
                            onChangeText={setName}
                        />
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
    },
    errorMessage: {
        color: 'red',
    },
});

export default AddPerformerDialog;
