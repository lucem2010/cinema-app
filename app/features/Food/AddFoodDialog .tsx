import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView } from 'react-native';
import { Food } from '@/app/model/Food';

interface AddFoodDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddFood: (food: Food) => void;
    onEditFood: (food: Food) => void;
    foodToEdit?: Food;
}

const AddFoodDialog: React.FC<AddFoodDialogProps> = ({
    visible,
    onClose,
    onAddFood,
    onEditFood,
    foodToEdit
}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sold, setSold] = useState('0'); // Default to 0
    const [imageUrl, setImageUrl] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (foodToEdit) {
            setName(foodToEdit.name);
            setPrice(foodToEdit.price.toString());
            setQuantity(foodToEdit.quantity.toString());
            setSold(foodToEdit.sold.toString());
            setImageUrl(foodToEdit.imageUrl);
        } else {
            setName('');
            setPrice('');
            setQuantity('');
            setSold('0'); // Default to 0
            setImageUrl('');
        }
    }, [foodToEdit]);

    const handleSave = () => {
        // Reset error message
        setErrorMessage('');

        // Validate inputs
        if (!name || !price || !quantity || !imageUrl) {
            setErrorMessage('Vui lòng điền tất cả các trường.'); // Show error if any field is empty
            return;
        }

        if (isNaN(Number(price)) || isNaN(Number(quantity))) {
            setErrorMessage('Giá và Số lượng phải là số hợp lệ.'); // Show error if price or quantity is not a number
            return;
        }

        const food: Food = {
            id: foodToEdit ? foodToEdit.id : Date.now().toString(), // Use a unique ID for new food items
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            sold: parseInt(sold, 10),
            imageUrl,
        };

        if (foodToEdit) {
            onEditFood(food);
        } else {
            onAddFood(food);
        }

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>{foodToEdit ? 'Edit Food' : 'Add Food'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên đồ ăn"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Gía"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Số lượng"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: '#f0f0f0' }]} // Different background for readonly
                            placeholder="Số lượng đã bán"
                            keyboardType="numeric"
                            value={sold}
                            editable={false} // Make this field readonly
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Đường dẫn hình ảnh"
                            value={imageUrl}
                            onChangeText={setImageUrl}
                        />
                        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default AddFoodDialog;
