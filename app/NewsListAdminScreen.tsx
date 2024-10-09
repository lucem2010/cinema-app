import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { News } from '@/app/model/News';
import NewsItemAdmin from './features/News/NewsItemAdmin';
import AddNewDialog from './features/News/AddNewsDialog';
import { addNewNews, editNews, fetchAllNews, removeNews } from './features/News/NewsSlice';

const NewsListAdminScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { newsList, loading, error } = useSelector((state: any) => state.news);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newsToEdit, setNewsToEdit] = useState<News | null>(null);

    // Fetch news on component mount
    useEffect(() => {
        dispatch(fetchAllNews());
    }, [dispatch]);

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredNews = newsList.filter(news =>
        news.information.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddNew = (newsItem: News) => {
        dispatch(addNewNews(newsItem));
        setDialogVisible(false);
        setNewsToEdit(null); // Clear newsToEdit to reset input fields
        
    };

    const handleEditNews = (newsItem: News) => {
        dispatch(editNews(newsItem));
        setDialogVisible(false);
        setNewsToEdit(null); // Clear newsToEdit to reset input fields
    };

    const handleDeleteNews = (newsItem: News) => {
        dispatch(removeNews(newsItem.id));
    };

    const renderItem = ({ item }: { item: News }) => (
        <NewsItemAdmin
            news={item}
            onEdit={() => {
                setNewsToEdit(item);
                setDialogVisible(true);
            }}
            onDelete={() => handleDeleteNews(item)}
        />
    );

    const openAddNewDialog = () => {
        setNewsToEdit(null); // Clear the news item when opening dialog
        setDialogVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <FlatList
                data={filteredNews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
            <Button title="Thêm tin tức" onPress={openAddNewDialog} />
            <AddNewDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onAddNew={handleAddNew}
                onEditNew={handleEditNews}
                newsToEdit={newsToEdit}
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

export default NewsListAdminScreen;
