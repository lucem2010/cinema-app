// PromotionList.tsx

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import PromotionItem from './PromotionItem';
import { Promotion } from '@/app/model/Promotion';

interface PromotionListProps {
    promotions: Promotion[];
}

const PromotionList: React.FC<PromotionListProps> = ({ promotions }) => {
    const renderItem = ({ item }: { item: Promotion }) => <PromotionItem promotion={item} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={promotions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true} // Set FlatList to horizontal
                showsHorizontalScrollIndicator={false} // Optional: Hide horizontal scroll indicator
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {


    },
});

export default PromotionList;
