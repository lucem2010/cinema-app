import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { News } from '@/app/model/News'; // Adjust the path to the News model if necessary

interface NewsDetailsRouteParams {
    news: News;
}

const NewsDetails: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: NewsDetailsRouteParams }, 'params'>>();
    const { news } = route.params;

    // Function to handle going back
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* Image */}
            <Image source={{ uri: news.link }} style={styles.image} resizeMode="contain" />

            {/* News information */}
            <Text style={styles.newsInfo}>{news.information}</Text>
        </View>
    );
};

export default NewsDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        zIndex: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200, // You can adjust this height as needed
        borderRadius: 10,
        marginTop: 60, // Adjusted to leave space for the back button
    },
    newsInfo: {
        marginTop: 20,
        fontSize: 16,
        color: '#000',
    },
});
