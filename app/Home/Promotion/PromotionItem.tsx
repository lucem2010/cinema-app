// PromotionItem.tsx

import { Promotion } from '@/app/model/Promotion';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


interface PromotionItemProps {
    promotion: Promotion;
}

const PromotionItem: React.FC<PromotionItemProps> = ({ promotion }) => {
    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: promotion.link }} style={styles.image} />
            <Text style={styles.information}>{promotion.Name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 10,
    },
    information: {
        textAlign: 'center',
    },
});

export default PromotionItem;
