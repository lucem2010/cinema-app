import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '@/app/Welcome';
import DrawerNavigator from './Drawer';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MovieDetails from './MovieDetails';
import AdminScreen from './AdminScreen';
import FilmTypeList from './FilmTypeList';
import FoodList from './FoodList';
import ScreeningRoomList from './ScreeningRoomList';
import MovieList from './MovieList';
import TicketScreen from './TicketScreen';
import RevenueScreen from './RevenueScreen';
import NewsListAdminScreen from './NewsListAdminScreen';
import NewsDetails from './NewsDetails';
import ThuNghiem from './ThuNghiem';
import PerformerListAdminScreen from './PerformerListAdminScreen';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="FilmTypeList" component={FilmTypeList} />
      <Stack.Screen name="FoodList" component={FoodList} />
      <Stack.Screen name="ScreeningRoomList" component={ScreeningRoomList} />
      <Stack.Screen name="MovieList" component={MovieList} />

      <Stack.Screen name="TicketScreen" component={TicketScreen} />
      <Stack.Screen name="RevenueScreen" component={RevenueScreen} />
      <Stack.Screen name="NewsListAdminScreen" component={NewsListAdminScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="PerformerListAdminScreen" component={PerformerListAdminScreen} />


      <Stack.Screen name="ThuNghiem" component={ThuNghiem} />





    </Stack.Navigator>
  );
};

export default StackNavigator;
