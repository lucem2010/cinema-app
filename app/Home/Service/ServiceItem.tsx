import { Service } from '@/app/model/Service';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ItemProps {
    service: Service;
}

const Item: React.FC<ItemProps> = ({ service }) => {
    return (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: service.link }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.name}>{service.Name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 40, // Rounded corners
       
    },
    name: {
        fontSize: 10,
        color: '#333',
    },
});

export default Item;
