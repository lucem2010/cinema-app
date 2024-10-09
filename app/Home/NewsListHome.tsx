import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNews } from '../features/News/NewsSlice';
import { News } from '../model/News';

const NewsListHome = () => {
    const dispatch = useDispatch();
    const { newsList, loading, error } = useSelector((state: any) => state.news);

    const [expandedNews, setExpandedNews] = useState<{ [key: string]: boolean }>({});

    // Gọi fetch tin tức khi component được mount
    React.useEffect(() => {
        dispatch(fetchAllNews());
    }, [dispatch]);

    // Hàm để mở rộng hoặc thu gọn phần thông tin
    const toggleExpand = (id: string) => {
        setExpandedNews((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    // Render từng mục tin tức
    const renderItem = ({ item }: { item: News }) => {
        const isExpanded = expandedNews[item.id];
        const infoToShow = isExpanded ? item.information : `${item.information.substring(0, 100)}...`;

        return (
            <View style={styles.newsItem}>
                {/* Ảnh bên trái */}
                <Image source={{ uri: item.link }} style={styles.image} />

                {/* Thông tin bên phải */}
                <View style={styles.infoContainer}>
                    <Text style={styles.information}>{infoToShow}</Text>

                    {/* Xem thêm / Thu gọn */}
                    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                        <Text style={styles.readMore}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={newsList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>

    );
}

export default NewsListHome

const styles = StyleSheet.create({

    newsItem: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    information: {
        fontSize: 14,
        color: '#333',
    },
    readMore: {
        marginTop: 5,
        color: '#1E90FF',
        fontSize: 12,
        fontWeight: 'bold',
    },
})