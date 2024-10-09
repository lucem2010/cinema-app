import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const [imgBackground, setImgBackground] = useState(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  useEffect(() => {
    const fetchImgBackground = async () => {
      try {
        // Thay 'vOCmguWkuFwMigel630B' bằng ID thực tế của tài liệu bạn muốn truy vấn
        const imgBackgroundDoc = doc(firestore, 'imgBackgrounds', 'Gead973sFXkRk61a2DEP');
        const docSnapshot = await getDoc(imgBackgroundDoc);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data(); // Dữ liệu của tài liệu
          console.log('Fetched imgBackground:', data);
          setImgBackground(data); // Cập nhật state với dữ liệu của tài liệu
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching imgBackground from Firestore:', error);
      }
    };

    fetchImgBackground();

    Animated.timing(translateX, {
      toValue: -100, // Move 100 pixels to the left
      duration: 5000,
      useNativeDriver: true,
    }).start(() => {
      // // Callback after animation completes
      // // Nếu bạn muốn điều hướng đến màn hình "Home" trong "DrawerNavigator"
      navigation.navigate('Drawer', { screen: 'Home' });

    });
  }, [translateX, navigation]);

  return (
    <View style={styles.container}>
      {imgBackground && (
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Image
            source={{ uri: imgBackground.link }} // Sử dụng link từ tài liệu Firestore
            style={styles.backgroundImage}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: 600,
    height: 1000,
  },
});

export default Welcome;
