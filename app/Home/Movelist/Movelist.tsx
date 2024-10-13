import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from 'expo-router';


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6; // Width of the centered item
const ITEM_SPACING = (width - ITEM_WIDTH) / 2; // Spacing between items

const MovieListHome = ({movies} ) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Get navigation instance

  // Add looping for the FlatList (handle empty data safely)
  const dataWithLoop = movies.length > 0
    ? [movies[movies.length - 1], ...movies, movies[0]]
    : [];  // Only add looping when data is available

  // Ensure flatList scrolls to initial index when data changes
  useEffect(() => {
    if (movies.length > 0) {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }
  }, [movies]);

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);

    // Handle looping logic
    if (index === 0) {
      flatListRef.current?.scrollToIndex({ index: movies.length, animated: false });
    } else if (index === movies.length + 1) {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
    });

    const handlePress = () => {
      navigation.navigate('MovieDetails', { movie: item });
    };

    return (
      <View style={{ width: ITEM_WIDTH }}>
        <TouchableOpacity onPress={handlePress}>
          <Animated.View style={[styles.imageContainer, { transform: [{ scale }], opacity }]}>
            <Image source={{ uri: item?.Poster }} style={styles.image} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  return (
    <View style={styles.container}>
      {movies.length > 0 ? (
        <Animated.FlatList
          ref={flatListRef}
          data={dataWithLoop}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={handleScrollEnd}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
        />
      ) : (
        <View />
      )}
    </View>
  );
};


export default MovieListHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    margin: 5,
  },
  image: {
    width: '100%',
    height: 330,
    borderRadius: 14,
  },
});
