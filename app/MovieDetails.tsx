import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Movie } from './model/Movie';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import timdo from '../assets/images/timdo.jpg'; // đường dẫn đúng tới file ảnh
import chiase from '../assets/images/chiase.jpg'; // đường dẫn đúng tới file ảnh
import dongho from '../assets/images/dongho.jpg'; // đường dẫn đúng tới file ảnh
import lich from '../assets/images/lich.jpg'; // đường dẫn đúng tới file ảnh
import { Promotion } from './model/Promotion';
import PromotionList from './Home/Promotion/PromotionList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchFilmTypesByIds } from './features/Filmtype/filmSlice';
import { FilmType } from './model/FilmType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './model/User';
import { loadUserFromAsyncStorage } from './features/User/userSlice';
import BookingModal from '@/components/BookingModal';
import { formatReleaseDate } from '@/components/Format';

import { LinearGradient } from 'expo-linear-gradient';
import LogoutButton from '@/components/LogoutButton';
import PerformersListMovieDetails from '@/components/PerformersListMovieDetails ';


type MovieDetailsRouteProp = RouteProp<{ params: { movie: Movie } }, 'params'>;




const MovieDetails = () => {
    const navigation = useNavigation();
    const route = useRoute<MovieDetailsRouteProp>();
    const { movie } = route.params;
    const [showFullText, setShowFullText] = useState(false);
    const MAX_LENGTH = 100; // Độ dài tối đa trước khi cắt
    const dispatch = useDispatch();

    const filmTypes = useSelector((state: RootState) => state.filmType.filmTypes);
    const loading = useSelector((state: RootState) => state.filmType.loading);
    const error = useSelector((state: RootState) => state.filmType.error);
    const userData = useSelector((state: RootState) => state.user.user); // Lấy thông tin người dùng từ Redux store
    const [isModalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        if (movie.FilmTypeID) {
            dispatch(fetchFilmTypesByIds(movie.FilmTypeID));
        }
    }, [dispatch, movie.FilmTypeID]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('user');
                if (userDataString) {
                    const parsedUserData = JSON.parse(userDataString) as User;
                    dispatch(loadUserFromAsyncStorage(parsedUserData)); // Cập nhật Redux store
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

        fetchUserData();
    }, [dispatch]);


    const toggleTextDisplay = () => {
        setShowFullText(!showFullText);
    };
    const handleLogout = () => {
        navigation.goBack();
    };




    const handleCloseModal = () => {
        setModalVisible(false); // Đóng modal khi người dùng hủy
    };
    const handlePressBookTickets = () => {
        // Logic đặt vé ở đây, có thể dùng userData cho xác thực người dùng
        if (userData) {
            // Kiểm tra vai trò của người dùng
            if (userData.role === 'admin') {
                Alert.alert(
                    'Thông báo',
                    'Admin không được phép đặt vé.',
                    [{ text: 'OK' }]
                );
            } else {
                setModalVisible(true);


            }
        } else {
            navigation.navigate('LoginScreen'); // Chuyển hướng đến màn hình đăng nhập
            console.log('User chưa đăng nhập.');
        }
    };




    return (
        <LinearGradient
            colors={['#6A9ED8', '#4252A0']}
            style={styles.container}
        >

            <StatusBar
                barStyle="light-content" // This changes the text and icons color in the status bar
                translucent={true} // Makes the status bar transparent
                backgroundColor="transparent" // Removes the background color from the status bar
            />

            {header(handleLogout)}
            {body(movie, showFullText, toggleTextDisplay, MAX_LENGTH, filmTypes)}

            <BookingModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                movie={movie}
                user={userData}
            />

            {datVe(handlePressBookTickets)}
        </LinearGradient>



    );
};


const header = (handleLogout: () => void) => {
    return (
        <View style={styles.containerHeader}>
            <LogoutButton onLogout={handleLogout} />




        </View>
    );
};


const body = (movie: Movie, showFullText: boolean, toggleTextDisplay: () => void, MAX_LENGTH: number, filmTypes: FilmType[]) => {
    return (
        <View style={styles.containerbody}>
            <Video
                source={{ uri: movie.Trailer }} // URL của trailer video
                style={styles.video}
                controls // Hiển thị điều khiển phát video
                resizeMode="contain" // Tùy chỉnh chế độ resize (contain, cover, stretch)
                isLooping // Phát lại video khi kết thúc
                useNativeControls // Sử dụng điều khiển phát video của hệ thống
                volume={1.0} // Âm lượng từ 0.0 đến 1.0
                rate={1.0} // Tốc độ phát video (1.0 là bình thường)
            />
            <View style={styles.box1}>
                <Image source={{ uri: movie.Poster }} style={styles.image} />
                <View style={styles.textContainer}>

                    <Text style={styles.nameMovie}>{movie.Name}</Text>
                    <Text style={styles.text}> Phát hành:{formatReleaseDate(movie.ReleaseDate)}</Text>
                    <Text style={styles.text}>Thời lượng:{movie.Duration}'</Text>
                    <Text style={styles.text}>Đánh giá:{movie.Rating}</Text>


                </View>
            </View>
            <View style={styles.containerTT}>
                <View style={{ flex: 1.5 }}>
                    {/* Có thể thêm các thành phần khác tại đây */}
                </View>
                <View style={{ flex: 5.5, padding: 10 }}>
                    <Text style={styles.text}>
                        {showFullText || movie.Introduction.length <= MAX_LENGTH
                            ? movie.Introduction
                            : `${movie.Introduction.slice(0, MAX_LENGTH)}...`}
                    </Text>
                    {movie.Introduction.length > MAX_LENGTH && (
                        <TouchableOpacity onPress={toggleTextDisplay}>
                            <Text style={styles.seeMoreText}>
                                {showFullText ? 'Thu gọn' : 'Xem thêm'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {footer(movie, filmTypes)}
                </View>
            </View>
        </View>
    );
};

const footer = (movie: Movie, filmTypes: FilmType[]) => {
    return (
        <View style={styles.continueFooter}>
            <View style={styles.box1ContinueFooter}>
                <Text style={styles.titleBox1ContinueFooter}>Kiểm duyệt:</Text>

                <Text style={styles.textBox1ContinueFooter}>{movie.AgeRating + '+'}</Text>


            </View>
            <View style={styles.box1ContinueFooter}>
                <Text style={styles.titleBox1ContinueFooter}>Thể loại:</Text>
                <Text style={styles.textBox1ContinueFooter}>
                    {filmTypes.map((type) => type.name).join(', ')}
                </Text>

            </View>
            <View style={styles.box1ContinueFooter}>
                <Text style={styles.titleBox1ContinueFooter}>Đạo diễn:</Text>
                <Text style={styles.textBox1ContinueFooter}>{movie.Director}</Text>

            </View>

            <View style={styles.box1ContinueFooter}>
                <Text style={styles.titleBox1ContinueFooter}>Ngôn ngữ:</Text>
                <Text style={styles.textBox1ContinueFooter}>{movie.Language}</Text>

            </View>
            <Text style={styles.titleBox1ContinueFooter}>Diễn viên</Text>
            <PerformersListMovieDetails performerIds={movie.ActorID}></PerformersListMovieDetails>

        </View>
    );
};

const datVe = (handlePressBookTickets: () => void) => {
    return (
        <View>
            <TouchableOpacity style={styles.fab} onPress={handlePressBookTickets}>
                <Text style={styles.textDatVe}>Đặt vé ngay</Text>
            </TouchableOpacity>
        </View>
    )
}



export default MovieDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
    seeMoreText: {
        color: '#FBC423', // Màu đỏ cho văn bản
        fontSize: 15, // Cỡ chữ to
        fontWeight: 'bold', // Tùy chọn nếu muốn chữ đậm
    },
    poster: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        marginBottom: 5,
    },
    containerHeader: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 18,
        padding: 10

    },

    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    containerbody: {
        flex: 1,

    },
    video: {
        flex: 1,
        zIndex: 1,
    },
    containerTT: {
        flex: 2.6,

    },
    box1: {
        width: '100%',
        height: 180, // Chiều cao của box1
        flexDirection: 'row',
        position: 'absolute', // Cho phép box1 đè lên video
        top: '20%', // Đặt box1 ở vị trí phía trên containerTT
        zIndex: 2, // Đảm bảo box1 đè lên video
        padding: 10
    },
    image: {
        width: 150,              // Set the width of the image
        height: '100%',          // Set the height to fill the parent container
        resizeMode: 'contain',   // Ensures the image is fully displayed within the bounds of the container

    },

    textContainer: {
        width: 210,
        flexDirection: 'column',
        justifyContent: 'flex-end', // Đưa nội dung xuống cuối box1
        margin: 12, // Khoảng cách từ hình ảnh đến văn bản
    },
    styletextincontainer: {
        flexDirection: 'row',
        width: '100%',

    },
    styletextin2container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',


    },
    boxText: {
        flexDirection: 'row',
        borderColor: 'black', // Màu đường viền
        borderWidth: 1, // Độ dày của đường viền
        borderRadius: 5, // Góc bo tròn (tuỳ chọn)
        padding: 2, // Khoảng cách bên trong hộp
        marginRight: 10,
        alignItems: 'center',


    },
    nameMovie: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imgcalendarStyle: {
        width: 25,
        height: 25,
    },
    imglockStyle: {
        width: 13,
        height: 13,
    },
    imgStyle: {
        width: 40,
        height: 30,
        marginLeft: 10
    },
    continueFooter: {
        flexDirection: 'column',
        padding: 10
    },
    box1ContinueFooter: {
        flexDirection: 'row',
        marginBottom: 10, // Tạo khoảng cách giữa các hàng bên dưới
    },
    titleBox1ContinueFooter: {
        fontWeight: 'bold', // Tùy chọn, chữ đậm
        marginRight: 5, // Khoảng cách giữa tiêu đề và nội dung
        color: 'white'
    },
    textBox1ContinueFooter: {
        marginLeft: 20, // Khoảng cách bên trái để tách biệt giữa title và text
        color: 'white'
    },
    fab: {
        position: 'absolute',
        width: '80%',
        height: 35,
        borderRadius: 28,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 25,
        elevation: 8, // For Android shadow
        shadowColor: 'black', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        alignSelf: 'center'
    },
    textDatVe: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    text: {
        color: 'white'
    }
});
