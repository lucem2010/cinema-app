import { StyleSheet, Text, View, FlatList, Image, Modal, Button, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchFoods } from '@/app/features/Food/foodSlice';



interface ChooseFoodModalProps {
    visible: boolean;
    onClose: (updatedPrice: number, selectedFoods: { [key: string]: number }) => void;
}

const ChooseFoodModal: React.FC<ChooseFoodModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const { foods } = useSelector((state: RootState) => state.food);

    const [totalPrice, setTotalPrice] = useState<number>(0); // Initialize to 0
    const [selectedFoodQuantities, setSelectedFoodQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        dispatch(fetchFoods());
    }, [dispatch]);

    const updateQuantity = (id: string, delta: number, availableQuantity: number, price: number) => {
        setSelectedFoodQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[id] || 0;
            const newQuantity = currentQuantity + delta;

            // Ngăn không cho số lượng nhỏ hơn 0 và lớn hơn số lượng có sẵn
            if (newQuantity < 0 || newQuantity > availableQuantity) return prevQuantities;

            // Cập nhật tổng giá
            const priceChange = (newQuantity - currentQuantity) * price;
            setTotalPrice(prevTotal => prevTotal + priceChange);

            return {
                ...prevQuantities,
                [id]: newQuantity,
            };
        });
    };

    const handleClose = () => {
        console.log("Total Price:", totalPrice); // Debugging
        const validPrice = isNaN(totalPrice) ? 0 : totalPrice; // Ensure valid price
        onClose(validPrice, selectedFoodQuantities); // Send valid data to parent
    };


    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={foods}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const currentQuantity = selectedFoodQuantities[item.id] || 0;

                            return (
                                <View style={styles.foodItem}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                    <View style={styles.details}>
                                        <Text style={styles.foodName}>{item.name}</Text>
                                        <Text style={styles.foodPrice}>Giá: ${item.price}</Text>
                                        <Text style={styles.foodSold}>Số lượng có sẵn: {item.quantity}</Text>

                                        <View style={styles.quantityContainer}>
                                            <TouchableOpacity onPress={() => updateQuantity(item.id, -1, item.quantity, item.price)}>
                                                <Text style={styles.quantityButton}>-</Text>
                                            </TouchableOpacity>

                                            <TextInput
                                                style={styles.quantityInput}
                                                value={String(currentQuantity)} // Hiển thị giá trị đã cập nhật
                                                keyboardType="numeric"
                                                editable={false}
                                            />

                                            <TouchableOpacity onPress={() => updateQuantity(item.id, 1, item.quantity, item.price)}>
                                                <Text style={styles.quantityButton}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <Button title="Đóng" onPress={handleClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ChooseFoodModal;


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    foodItem: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 15,
        borderRadius: 5,
    },
    details: {
        flex: 1,
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    foodPrice: {
        fontSize: 16,
        color: 'green',
    },
    foodSold: {
        fontSize: 14,
        color: 'gray',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityButton: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        backgroundColor: '#ccc',
        textAlign: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityInput: {
        width: 40,
        height: 30,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        borderRadius: 5,
    },
});
