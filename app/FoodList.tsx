import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Food } from '@/app/model/Food';
import { AppDispatch, RootState } from '@/store/store';
import { addNewFood, editFood, fetchFoods, removeFood } from './features/Food/foodSlice';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import FoodItem from './features/Food/FoodItem';
import AddFoodDialog from './features/Food/AddFoodDialog ';

const FoodList = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { foods, loading, error } = useSelector((state: RootState) => state.food);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<Food | undefined>(undefined);
    const [foodToDelete, setFoodToDelete] = useState<Food | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchFoods());
    }, [dispatch]);

    const handleEditFood = (food: Food) => {
        setFoodToEdit(food);
        setDialogVisible(true);
    };

    const handleDeleteFood = (food: Food) => {
        setFoodToDelete(food);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        if (foodToDelete) {
            dispatch(removeFood(foodToDelete.id));
            setFoodToDelete(undefined);
        }
        setDeleteDialogVisible(false);
    };

    const handleAddFood = (food: Food) => {
        dispatch(addNewFood(food));
    };

    const handleEditFoodAction = (food: Food) => {
        dispatch(editFood(food));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: Food }) => (
        <FoodItem
            food={item}
            onEdit={() => handleEditFood(item)}
            onDelete={() => handleDeleteFood(item)}
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredFoods}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <Button title="Thêm món ăn" onPress={() => {
                setFoodToEdit(undefined); // Reset for new food
                setDialogVisible(true);
            }} />
            <AddFoodDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddFood={handleAddFood}
                onEditFood={handleEditFoodAction}
                foodToEdit={foodToEdit}
            />
            <ConfirmDeleteDialog
                visible={deleteDialogVisible}
                onClose={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                itemName={foodToDelete?.name || ''}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    backButton: {
        margin: 7,
        width: 100,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default FoodList;
