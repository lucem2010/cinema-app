import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const renderTab = (handleTabPress: (tab: string) => void) => {
  return (
    <View style={styles.containerTab}>
      <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Tab 1')}>
        <Text style={styles.tabText}>Đang chiếu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Tab 2')}>
        <Text style={styles.tabText}>Sắp chiếu </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Tab 2')}>
        <Text style={styles.tabText}>Toàn bộ </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  containerTab: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
  },
  tabText: {
    fontSize: 18,

    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabItem: {
    paddingHorizontal: 10,
  },
});

export default renderTab;
