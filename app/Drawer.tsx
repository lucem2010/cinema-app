// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '@/app/Home/Home';
import CustomDrawerContent from './navigation/drawer/CustomDrawerContent'; // Đảm bảo đường dẫn chính xác
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerPosition: 'right', // Vị trí của Drawer
      drawerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu nền đen với độ trong suốt
        width: 300,
      },
      drawerContentStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền của nội dung trong Drawer với độ trong suốt
      },
      drawerLabelStyle: {
        color: '#fff', // Màu chữ của các mục trong Drawer
      },
    }}
    drawerContent={props => <CustomDrawerContent {...props} />} // Sử dụng CustomDrawerContent
  >
    <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
