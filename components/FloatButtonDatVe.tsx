import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FloatingInfoButtonProps {
    movieName: string;
    AgeRating: string;
    screenType: string;
    Price: number;
    onSubmit: () => void; // Thêm hàm cho nút Submit
    onChooseFood: () => void;

}

const FloatingInfoButton: React.FC<FloatingInfoButtonProps> = ({
    movieName,
    AgeRating,
    screenType,
    Price,
    onSubmit,
    onChooseFood

}) => {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{movieName}</Text>
                <Text style={styles.itemPrice}>Độ tuổi: {AgeRating}</Text>
                <Text style={styles.itemPrice}>Giá: {Price} VNĐ</Text>
                <Text style={styles.itemPrice}>Loại màn hình: {screenType}</Text>

            </View>

            <View style={{
                flexDirection: 'column', flex: 1
            }}></View>

            <View style={{
                flexDirection: 'column', flex: 1
            }}>
                <TouchableOpacity style={styles.submitButton} onPress={onChooseFood}>
                    <Text style={styles.buttonText}>Chọn đồ ăn </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Đặt vé</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default FloatingInfoButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: '#6200ea',
        borderRadius: 20,
        elevation: 5, // Tạo bóng cho button
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoContainer: {
        marginBottom: 2,
        flexDirection: 'column',
        flex: 1
    },
    itemName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        color: '#fff',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#03dac5',
        borderRadius: 20,
        padding: 10,
        width: 110,
        alignItems: 'center',
        marginBottom: 3,
        marginTop: 10

    },
    closeButton: {
        backgroundColor: '#ff3d00',
        borderRadius: 20,
        padding: 10,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    loaiManHinDatVe: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
