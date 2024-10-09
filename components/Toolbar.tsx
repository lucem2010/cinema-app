import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomToolbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Hình ảnh ở bên trái */}
            <Image
                source={{ uri: 'https://i.pinimg.com/564x/c8/cf/64/c8cf649fa6978d9ace53be1b8da314b6.jpg' }}
                style={styles.imageStyle}
            />

            <Image
                source={{ uri: 'https://i.pinimg.com/564x/11/d2/87/11d287fb51c33d3d46a1772f00083dfb.jpg' }}
                style={styles.imageStyle}
            />


            {/* Nút Drawer ở bên phải */}
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Text style={styles.drawerButton}>☰</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        height: 70,
    },
    imageStyle: {
        width: 50,
        height: 30,
        borderRadius: 15,
    },
    logoStyle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    drawerButton: {
        fontSize: 30,
        paddingRight: 10,
    },
};

export default CustomToolbar;
