import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import NewsItem from '@/app/Home/Newslist/NewsItem';
import { News } from '@/app/model/News';

interface NewsListProps {
  newsData: News[];
}

const NewsList: React.FC<NewsListProps> = ({ newsData }) => {
  const flatListRef = useRef<FlatList<News>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Ensure data is not empty before starting the interval
    if (newsData.length === 0) return;

    const intervalId = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = currentIndex + 1 >= newsData.length ? 0 : currentIndex + 1;
        
        // Ensure the index is within bounds before scrolling
        if (nextIndex < newsData.length) {
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
          setCurrentIndex(nextIndex);
        }
      }
    }, 3000);

    // Clear interval on component unmount or when data changes
    return () => clearInterval(intervalId);
  }, [currentIndex, newsData.length]);

  // Reset index if the data changes to avoid out-of-range errors
  useEffect(() => {
    if (currentIndex >= newsData.length) {
      setCurrentIndex(0);
    }
  }, [newsData.length]);

  return (
    <FlatList
      ref={flatListRef}
      data={newsData}
      renderItem={({ item }) => <NewsItem item={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text>No news available.</Text>}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      onScrollToIndexFailed={(error) => {
        console.log('Scroll to index failed:', error);
      }}
    />
  );
};

export default NewsList;
