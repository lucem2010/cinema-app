import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { News } from '@/app/model/News'; // Điều chỉnh đường dẫn nhập nếu cần

interface NewsItemProps {
    news: News;
    onEdit: () => void;
    onDelete: () => void;
}

const NewsItemAdmin: React.FC<NewsItemProps> = ({ news, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigation = useNavigation(); // Get the navigation object

    const maxLength = 100; // Define a max length for truncated text

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Navigate to the NewsDetails screen and pass the News object
    const handleViewDetails = () => {
        navigation.navigate('NewsDetails', { news });
    };

    // Determine if the text should be truncated
    const textToDisplay = isExpanded || news.information.length <= maxLength
        ? news.information
        : `${news.information.substring(0, maxLength)}...`;

    return (
        <View style={styles.itemContainer}>
            <View style={styles.contentRow}>
                <Image source={{ uri: news.link }} style={styles.image} />
                
                <View style={styles.textContainer}>
                    {isExpanded ? (
                        <ScrollView style={styles.scrollableText}>
                            <Text style={styles.title}>{news.information}</Text>
                        </ScrollView>
                    ) : (
                        <Text style={styles.title}>{textToDisplay}</Text>
                    )}
                    {news.information.length > maxLength && (
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={styles.seeMore}>
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            {/* Action buttons below the image */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleViewDetails} style={styles.actionButton}>
                    <Text style={styles.actionText}>Xem chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                    <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    contentRow: {
        flexDirection: 'row', // Arrange items in a row
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Take up remaining space
        justifyContent: 'center',
    },
    scrollableText: {
        maxHeight: 100, // Limit scrollable area
    },
    title: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    seeMore: {
        color: '#00f',
        marginTop: 5,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default NewsItemAdmin;
