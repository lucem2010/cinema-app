import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FilmTypeItem from './features/Filmtype/FilmTypeItem';
import { FilmType } from '@/app/model/FilmType';
import { AppDispatch, RootState } from '@/store/store';
import { addNewFilmType, editFilmType, fetchFilmTypes, removeFilmType } from './features/Filmtype/filmSlice';
import AddFilmTypeDialog from './features/Filmtype/AddFilmTypeDialog';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

const FilmTypeList = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { filmTypes, loading, error } = useSelector((state: RootState) => state.filmType);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [filmTypeToEdit, setFilmTypeToEdit] = useState<FilmType | undefined>(undefined);
    const [filmTypeToDelete, setFilmTypeToDelete] = useState<FilmType | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchFilmTypes());
    }, [dispatch]);

    const handleEditFilmType = (filmType: FilmType) => {
        setFilmTypeToEdit(filmType);
        setDialogVisible(true);
    };

    const handleDeleteFilmType = (filmType: FilmType) => {
        setFilmTypeToDelete(filmType);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        if (filmTypeToDelete) {
            dispatch(removeFilmType(filmTypeToDelete.id));
            setFilmTypeToDelete(undefined);
        }
        setDeleteDialogVisible(false);
    };

    const handleAddFilmType = (filmType: FilmType) => {
        dispatch(addNewFilmType(filmType));
    };

    const handleEditFilmTypeAction = (filmType: FilmType) => {
        dispatch(editFilmType(filmType));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredFilmTypes = filmTypes.filter(filmType =>
        filmType.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: FilmType }) => (
        <FilmTypeItem
            filmType={item}
            onEdit={() => handleEditFilmType(item)}
            onDelete={() => handleDeleteFilmType(item)}
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
                placeholder="Tìm kiếm loại phim..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredFilmTypes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <Button title="Thêm loại phim" onPress={() => {
                setFilmTypeToEdit(undefined); // Reset for new film type
                setDialogVisible(true);
            }} />
            <AddFilmTypeDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddFilmType={handleAddFilmType}
                onEditFilmType={handleEditFilmTypeAction}
                filmTypeToEdit={filmTypeToEdit}
            />
            <ConfirmDeleteDialog
                visible={deleteDialogVisible}
                onClose={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                itemName={filmTypeToDelete?.name || ''}
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

export default FilmTypeList;
