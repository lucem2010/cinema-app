import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const AdminScreen = () => {
    const navigation = useNavigation(); // Khởi tạo đối tượng navigation

    return (
        <SafeAreaView style={styles.container}>
            {/* Quản lí loại phim */}
            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('FilmTypeList')} // Điều hướng tới màn hình quản lí loại phim
            >
                <Text style={styles.itemText}>Quản lí loại phim</Text>
            </TouchableOpacity>

            {/* Quản lí phim */}
            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('MovieList')} // Điều hướng tới màn hình quản lí phim
            >
                <Text style={styles.itemText}>Quản lí phim</Text>
            </TouchableOpacity>

            {/* Quản lí tin tức */}
            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('NewsListAdminScreen')} // Điều hướng tới màn hình quản lí phim
            >
                <Text style={styles.itemText}>Quản lí tin tức</Text>
            </TouchableOpacity>

            {/* Quản lí đồ ăn kèm */}
            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('FoodList')} // Điều hướng tới màn hình quản lí đồ ăn kèm
            >
                <Text style={styles.itemText}>Quản lí đồ ăn kèm</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('ScreeningRoomList')} // Điều hướng tới màn hình quản lí đồ ăn kèm
            >
                <Text style={styles.itemText}>Quản lí phòng chiếu</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('TicketScreen')} // Điều hướng tới màn hình quản lí đồ ăn kèm
            >
                <Text style={styles.itemText}>Danh sách vé </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('RevenueScreen')} // Điều hướng tới màn hình quản lí đồ ăn kèm
            >
                <Text style={styles.itemText}>Doanh thu </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('PerformerListAdminScreen')} // Điều hướng tới màn hình quản lí đồ ăn kèm
            >
                <Text style={styles.itemText}>Danh sách diễn viên  </Text>
            </TouchableOpacity>




        </SafeAreaView>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    itemText: {
        fontSize: 18,
        alignSelf: 'center',
    },
});
