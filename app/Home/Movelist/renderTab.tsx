import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const renderTab = (handleTabPress: (tab: string) => void, activeTab: string) => {
  return (
    <View style={styles.containerTab}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('Tab 1')}
      >
        <Text style={[styles.tabText, activeTab === 'Tab 1' ? styles.activeTabText : styles.inactiveTabText]}>
          Đang chiếu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('Tab 2')}
      >
        <Text style={[styles.tabText, activeTab === 'Tab 2' ? styles.activeTabText : styles.inactiveTabText]}>
          Sắp chiếu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress('Tab 3')}
      >
        <Text style={[styles.tabText, activeTab === 'Tab 3' ? styles.activeTabText : styles.inactiveTabText]}>
          Toàn bộ
        </Text>
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
    marginRight: 8,
  },
  tabText: {
    fontSize: 18,

    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabItem: {
    paddingHorizontal: 10,
  },
  activeTabText: {
    color: 'yellow', // Màu vàng khi được chọn
  },
  inactiveTabText: {
    color: 'white', // Màu trắng khi không được chọn
  },
});

export default renderTab;
