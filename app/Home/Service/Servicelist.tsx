import { Service } from '@/app/model/Service';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Item from './ServiceItem';


interface ServiceListProps {
    services: Service[];
}

const Servicelist: React.FC<ServiceListProps> = ({ services }) => {
    const renderItem = ({ item }: { item: Service }) => <Item service={item} />;

    return (
        <View style={styles.listContainer}>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true} // Set FlatList to horizontal
               
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: '100%',
     
    },
  
});

export default Servicelist;
