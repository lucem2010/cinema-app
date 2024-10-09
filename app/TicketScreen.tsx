import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '@/store/store';
import { fetchTicketsByUserId, fetchTickets } from './features/Ticket/ticketSlice';
import TicketItem from './features/Ticket/TicketItem';
import { Ticket } from './model/Ticket';

const TicketList = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { tickets, loading, error } = useSelector((state: RootState) => state.ticket);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('user');
                console.log("User Data from AsyncStorage:", userDataString);
                if (userDataString) {
                    const parsedUserData = JSON.parse(userDataString);
                    const { id: userId, role } = parsedUserData;

                    console.log("UserID:", userId, "Role:", role);

                    if (role === 'admin') {
                        console.log("Fetching all tickets (Admin)");
                        dispatch(fetchTickets());
                    } else {
                        console.log(`Fetching tickets for userId: ${userId}`);
                        dispatch(fetchTicketsByUserId(userId));
                    }
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

        fetchUserData();
    }, [dispatch]);

    useEffect(() => {
        console.log("Tickets:", tickets);
        console.log("Loading:", loading);
        console.log("Error:", error);
    }, [tickets, loading, error]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredTickets = tickets.filter(ticket => {
        // Ensure MovieID and ScreeningRoomID exist and are strings
        return (
            (ticket.MovieID && ticket.MovieID.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (ticket.ScreeningRoomID && ticket.ScreeningRoomID.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const renderItem = ({ item }: { item: Ticket }) => (
        <TicketItem ticket={item} />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm vé..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredTickets}
                keyExtractor={(item) => item.id.toString()} // Ensure the ID is a string
                renderItem={renderItem}
                contentContainerStyle={filteredTickets.length === 0 ? styles.emptyList : null} // Optional styling for empty list
                ListEmptyComponent={<Text style={styles.emptyMessage}>Không có vé nào.</Text>} // Show message when there are no tickets
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    backButton: {
        margin: 7,
        width: 100,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        color: '#999',
    },
});

export default TicketList;
