import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Performer } from '@/app/model/Performer';
import PerformerItemAdmin from './features/Performer/PerformerItemAdmin';
import AddPerformerDialog from './features/Performer/AddPerformerDialog';
import { addNewPerformer, editPerformer, fetchAllPerformers, removePerformer } from './features/Performer/PerformerSlice';

const PerformerListAdminScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { performerList, loading, error } = useSelector((state: any) => state.performer);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [performerToEdit, setPerformerToEdit] = useState<Performer | null>(null);

    useEffect(() => {
        dispatch(fetchAllPerformers());
    }, [dispatch]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredPerformers = performerList.filter(performer =>
        performer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPerformer = (performerItem: Performer) => {
        dispatch(addNewPerformer(performerItem));
        setDialogVisible(false);
        setPerformerToEdit(null);
    };

    const handleEditPerformer = (performerItem: Performer) => {
        dispatch(editPerformer(performerItem));
        setDialogVisible(false);
        setPerformerToEdit(null);
    };

    const handleDeletePerformer = (performerItem: Performer) => {
        dispatch(removePerformer(performerItem.id));
    };

    const renderItem = ({ item }: { item: Performer }) => (
        <PerformerItemAdmin
            performer={item}
            onEdit={() => {
                setPerformerToEdit(item);
                setDialogVisible(true);
            }}
            onDelete={() => handleDeletePerformer(item)}
        />
    );

    const openAddPerformerDialog = () => {
        setPerformerToEdit(null);
        setDialogVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm nghệ sĩ..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={filteredPerformers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
            <Button title="Thêm nghệ sĩ" onPress={openAddPerformerDialog} />
            <AddPerformerDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddPerformer={handleAddPerformer}
                onEditPerformer={handleEditPerformer}
                performerToEdit={performerToEdit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    errorText: {
        color: 'red',
    },
});

export default PerformerListAdminScreen;
