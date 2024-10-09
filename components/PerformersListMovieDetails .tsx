import { fetchPerformersByIds } from '@/app/features/Performer/PerformerSlice';
import { RootState } from '@/store/store';
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const PerformersListMovieDetails = ({ performerIds }) => {
    const dispatch = useDispatch();

    const { performerList, loading, error } = useSelector((state: RootState) => state.performer);

    useEffect(() => {
        if (performerIds.length > 0) {
            dispatch(fetchPerformersByIds(performerIds));
        }
    }, [performerIds, dispatch]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <FlatList
            data={performerList}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.performerCard}>
                    <Image source={{ uri: item.img }} style={styles.image} resizeMode="contain" />
                    <Text style={styles.performerName}>{item.name}</Text>
                    {/* Optionally display more performer details or images */}
                </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
    },
    performerCard: {
        marginHorizontal: 10,
        padding: 5,
        borderRadius: 8,
    
        alignItems: 'center',
    },
    performerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color:'white'
    },
    image: {
        width: 80,
        height: 90
    }
});

export default PerformersListMovieDetails;
