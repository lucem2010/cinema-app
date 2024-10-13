import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Movie } from '../model/Movie';
import useHandleScroll from './Movelist/useHandleScroll';
import useBackgroundImage from './Movelist/useBackgroundImage';
import CustomToolbar from '@/components/Toolbar';
import { News } from '../model/News';
import NewsList from './Newslist/NewsList';
import renderTab from './Movelist/renderTab';
import ButtonComponent from '@/components/ButtonComponent';
import { Service } from '../model/Service';
import Servicelist from './Service/Servicelist';
import { Promotion } from '../model/Promotion';
import PromotionList from './Promotion/PromotionList';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromAsyncStorage } from '../features/User/userSlice';
import { AppDispatch, RootState } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../model/User';
import { FilmType } from '../model/FilmType';
import { fetchMovies, fetchMoviesByStatus } from '../features/TestMovie/TestMovieSlice';
import { fetchAllNews } from '../features/News/NewsSlice';
import NewsListHome from './NewsListHome';
import { LinearGradient } from 'expo-linear-gradient';
import MovieList from '../MovieList';
import MovieListHome from './Movelist/Movelist';




const Home = () => {

  const backgroundImage = useBackgroundImage('Gead973sFXkRk61a2DEP');
  const dispatch = useDispatch<AppDispatch>();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<User | null>(null); // State để lưu thông tin người dùng
  const { newsList, status: newsStatus, error: newsError } = useSelector((state: RootState) => state.news); // Get news state
  const [activeTab, setActiveTab] = useState('Tab 3'); // Mặc định là "Toàn bộ"
  const { movies, status: moviesStatus, error: moviesError } = useSelector((state: RootState) => state.movie);


  useEffect(() => {
    const checkAndLoadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUserData = JSON.parse(userData) as User;
          setUserExists(true);
          setUserData(parsedUserData);
          dispatch(loadUserFromAsyncStorage(parsedUserData));
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
        setUserExists(false);
      }
    };

    checkAndLoadUser();
    dispatch(fetchMovies());  // Dispatch fetchMovies to load movie data
    dispatch(fetchAllNews());
  }, [dispatch]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Cập nhật tab hiện tại

    if (tab === 'Tab 3') {
      // Nếu tab là "Toàn bộ" thì gọi hàm fetchAllMovies để lấy toàn bộ phim
      dispatch(fetchMovies());
    } else {
      let status = '';
      switch (tab) {
        case 'Tab 1': // Đang chiếu
          status = ' Đang Chiếu';
          break;
        case 'Tab 2': // Sắp chiếu
          status = 'Sắp Chiếu';
          break;
        default:
          status = 'All';
      }

      // Gọi fetchMoviesByStatus để lấy danh sách phim dựa trên status
      dispatch(fetchMoviesByStatus(status));
    }
  };


  return (
    <View style={styles.container} >

      <ImageBackground source={{ uri: backgroundImage }} style={styles.imageBackground}>
        <CustomToolbar />


        <View style={styles.list1}>
          <NewsList newsData={newsList} />
        </View>

        {renderTab(handleTabPress, activeTab)}

        <View style={styles.list2}>
          <MovieListHome movies={movies}></MovieListHome>
        </View>

      </ImageBackground>
      <LinearGradient
        colors={['#6A9ED8', '#4252A0']}
        style={styles.linearGradient}
      >
        <NewsListHome></NewsListHome>
      </LinearGradient>


    </View >



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    height: 650,
    width: '100%',
    justifyContent: 'center',
  },
  linearGradient: {

    width: '100%',
    height:300
  },
  list1: {
    flex: 1,
    marginTop: 10,
  },
  list2: {
    flex: 3,
  },
});

export default Home;
