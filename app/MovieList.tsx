import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Movie } from './model/Movie';
import { addNewMovie, editMovie, fetchMovies, removeMovie } from './features/TestMovie/TestMovieSlice';
import MovieItem from './features/TestMovie/TestMovieItem';
import { ActivityIndicator } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddMovieDialog from './features/TestMovie/AddTestMovieDialog';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

const MovieList = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { movies, loading, error } = useSelector((state: RootState) => state.movie);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState<Movie | undefined>(undefined);
    const [movieToDelete, setMovieToDelete] = useState<Movie | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);


    const handleEditMovie = (movie: Movie) => {
        setMovieToEdit(movie);
        setDialogVisible(true);
    };
    const handleDeleteMovie = (movie: Movie) => {
        setMovieToDelete(movie);
        setDeleteDialogVisible(true);
    };
    const confirmDelete = () => {
        if (movieToDelete) {
            dispatch(removeMovie(movieToDelete.id)); // Ensure `id` is the correct property
            setMovieToDelete(undefined);
        }
        setDeleteDialogVisible(false);
    };
    const handleAddMovie = (movie: Movie) => {
        dispatch(addNewMovie(movie));
    };

    const handleEditMovieAction = (movie: Movie) => {
        dispatch(editMovie(movie));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredMovies = movies.filter(movie => {
        const name = movie.Name || ''; // Nếu Name là undefined, sử dụng chuỗi rỗng
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const renderItem = ({ item }: { item: Movie }) => (
        <MovieItem
            movie={item}
            onEdit={() => handleEditMovie(item)}
            onDelete={() => handleDeleteMovie(item)}
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
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredMovies}
                keyExtractor={(item) => item.id.toString()} // Ensure `id` is a string or convert to string
                renderItem={renderItem}
            />
            <Button title="Thêm phim mới" onPress={() => {
                setMovieToEdit(undefined); // Reset for new movie
                setDialogVisible(true);
            }} />
            <AddMovieDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddMovie={handleAddMovie}
                onEditMovie={handleEditMovieAction}
                movieToEdit={movieToEdit}
            />
            <ConfirmDeleteDialog
                visible={deleteDialogVisible}
                onClose={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                itemName={movieToDelete?.Name || ''} // Ensure `Name` is a valid property
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

export default MovieList;

