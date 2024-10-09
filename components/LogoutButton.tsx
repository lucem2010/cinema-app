import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Bạn có thể sử dụng icon khác nếu muốn

const LogoutButton = ({ onLogout }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onLogout}>
            <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        left: 3, // Đặt vị trí cho mũi tên
        padding: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ cho button
        borderRadius: 10, // Làm tròn button
    },
});

export default LogoutButton;
