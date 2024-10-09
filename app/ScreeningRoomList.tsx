import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import AddScreeningRoomDialog from './features/ScreeningRoom/AddScreeningRoomDialog';
import { ScreeningRoom } from './model/ScreeningRoom ';
import { addNewScreeningRoom, editScreeningRoom, fetchScreeningRooms, removeScreeningRoom } from './features/ScreeningRoom/screeningSlice';
import ScreeningRoomItem from './features/ScreeningRoom/ScreeningRoomItem ';

const ScreeningRoomList = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { screeningRooms, loading, error } = useSelector((state: RootState) => state.screeningRoom);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [screeningRoomToEdit, setScreeningRoomToEdit] = useState<ScreeningRoom | undefined>(undefined);
    const [screeningRoomToDelete, setScreeningRoomToDelete] = useState<ScreeningRoom | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchScreeningRooms());
    }, [dispatch]);

    const handleEditScreeningRoom = (screeningRoom: ScreeningRoom) => {
        setScreeningRoomToEdit(screeningRoom);
        setDialogVisible(true);
    };

    const handleDeleteScreeningRoom = (screeningRoom: ScreeningRoom) => {
        setScreeningRoomToDelete(screeningRoom);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        if (screeningRoomToDelete) {
            dispatch(removeScreeningRoom(screeningRoomToDelete.id));
            setScreeningRoomToDelete(undefined);
        }
        setDeleteDialogVisible(false);
    };

    const handleAddScreeningRoom = (screeningRoom: ScreeningRoom) => {
        dispatch(addNewScreeningRoom(screeningRoom));
    };

    const handleEditScreeningRoomAction = (screeningRoom: ScreeningRoom) => {
        dispatch(editScreeningRoom(screeningRoom));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredScreeningRooms = screeningRooms.filter(screeningRoom =>
        screeningRoom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: ScreeningRoom }) => (
        <ScreeningRoomItem
            screeningRoom={item}
            onEdit={() => handleEditScreeningRoom(item)}
            onDelete={() => handleDeleteScreeningRoom(item)}
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
                placeholder="Tìm kiếm phòng chiếu..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredScreeningRooms}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <Button title="Thêm phòng chiếu" onPress={() => {
                setScreeningRoomToEdit(undefined); // Reset for new room
                setDialogVisible(true);
            }} />
            <AddScreeningRoomDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddScreeningRoom={handleAddScreeningRoom}
                onEditScreeningRoom={handleEditScreeningRoomAction}
                screeningRoomToEdit={screeningRoomToEdit}
            />
            <ConfirmDeleteDialog
                visible={deleteDialogVisible}
                onClose={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                itemName={screeningRoomToDelete?.name || ''}
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

export default ScreeningRoomList;
