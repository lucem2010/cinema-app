import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { News } from '@/app/model/News'; // Điều chỉnh đường dẫn nhập nếu cần

interface NewsItemProps {
    item: News;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => (
    <View style={styles.itemContainer}>
        <ImageBackground source={{ uri: item.link }} style={styles.imageBackground}>

        </ImageBackground>
    </View>
);

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        borderRadius: 10, // Bo tròn góc
        borderWidth: 1, // Đặt độ dày border
        borderColor: '#ccc', // Màu border
        overflow: 'hidden',

        height: '100%',
    },
    imageBackground: {
        width: 200,
        height: '100%',
        justifyContent: 'center',
    },

});

export default NewsItem;
