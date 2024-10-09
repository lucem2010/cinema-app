import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import StackNavigator from './StackNavigator';

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
