import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Food } from '@/app/model/Food';
import { formatPrice } from '@/components/Format';

interface FoodItemProps {
    food: Food;
    onEdit: () => void;
    onDelete: () => void;
}

const FoodItem: React.FC<FoodItemProps> = ({ food, onEdit, onDelete }) => {
    return (
        <View style={styles.container}>
            {food.imageUrl ? (
                <Image source={{ uri: food.imageUrl }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                </View>
            )}
            <View style={styles.details}>
                <Text style={styles.name}>{food.name}</Text>
                <Text style={styles.price}>Gía: {formatPrice(food.price)} Đ</Text>
                <Text style={styles.quantity}>Số lượng: {food.quantity}</Text>
                <Text style={styles.sold}>Đã bán: {food.sold}</Text>
                <Text style={styles.sold}>Doanh thu: {food.price * food.sold}</Text>
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
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    imagePlaceholderText: {
        color: '#a0a0a0',
        fontSize: 14,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#333',
    },
    quantity: {
        fontSize: 14,
        color: '#333',
    },
    sold: {
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

export default FoodItem;
