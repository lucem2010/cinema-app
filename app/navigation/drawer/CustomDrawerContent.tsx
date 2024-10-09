import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromAsyncStorage, logoutUser } from '@/app/features/User/userSlice';
import { User } from '@/app/model/User';
import { AppDispatch, RootState } from '@/store/store';

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.user.user); // Lấy thông tin người dùng từ Redux store

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

  const handleLogout = () => {
    dispatch(logoutUser()); // Gọi action logout
    props.navigation.navigate('Drawer'); // Điều hướng sau khi đăng xuất
  };
  return (
    <View style={styles.drawerContent}>
      {header()}
      {boby(userData, props)}
      {footer(handleLogout, userData)}
    </View>
  );
};

const header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../../assets/images/chuong.jpg')}
        style={styles.imageheader}
      />
      <Image
        source={require('../../../assets/images/toi.jpg')}
        style={styles.imagetoiheader}
      />
      <Image
        source={require('../../../assets/images/caidat.jpg')}
        style={styles.imageheader}
      />
    </View>
  );
};

const boby = (userData: User | null, props: any) => {
  return (
    <View style={styles.bobyContainer}>
      {/* Chỉ hiển thị các nút Đăng nhập và Đăng kí nếu userData là null */}
      {userData === null ? (
        <View style={styles.DN_DK}>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => props.navigation.navigate('LoginScreen')}
          >
            <Text style={[styles.itemText, styles.textline]}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => props.navigation.navigate('RegisterScreen')}
          >
            <Text style={[styles.itemText, styles.textline]}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.itemText}>{userData.name}</Text>
      )}

      {/* Các nút khác */}
      <TouchableOpacity
        style={styles.itemButton}
        onPress={() => props.navigation.navigate('LoginScreen')}
      >
        <Text style={styles.itemText}>Đặt vé theo phim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemButton}
        onPress={() => props.navigation.navigate('LoginScreen')}
      >
        <Text style={styles.itemText}>Đặt vé theo rạp</Text>
      </TouchableOpacity>

      {userData && userData.role === 'admin' && (
        <TouchableOpacity
          style={styles.itemButton}
          onPress={() => props.navigation.navigate('AdminScreen')}
        >
          <Text style={styles.itemText}>Quản lí</Text>
        </TouchableOpacity>
      )}


      <TouchableOpacity
        style={styles.itemButton}
        onPress={() => props.navigation.navigate('TicketScreen')}
      >
        <Text style={styles.itemText}>Vé của tôi</Text>
      </TouchableOpacity>

    </View>
  );
};



const footer = (handleLogout: () => void, userData: User | null) => {
  return (
    <View style={styles.footerContainer}>

      {userData !== null && (
        <TouchableOpacity
          style={styles.itemButton}
          onPress={handleLogout}
        >
          <Text style={styles.itemText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: 35,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 65,
    justifyContent: 'space-evenly',
  },
  imagetoiheader: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageheader: {
    width: 35,
    height: 35,
    borderRadius: 8,
  },
  DN_DK: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center'
  },
  textline: {
    textDecorationLine: 'underline',
  },
  bobyContainer: {
    width: '100%',
  },
  itemButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },

  footerContainer: {
    padding: 20,
    width: '100%',
  },
  box1: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxc: {
    flexDirection: 'column',
  },
});

export default CustomDrawerContent;
