import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Video } from 'expo-av';

const ThuNghiem = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4' }} // Đường dẫn video hợp lệ
        style={styles.video}
        resizeMode="contain" // Tùy chỉnh chế độ resize (contain, cover, stretch)
        isLooping // Phát lại video khi kết thúc
        useNativeControls // Sử dụng điều khiển phát video của hệ thống
        volume={1.0} // Âm lượng từ 0.0 đến 1.0
        rate={1.0} // Tốc độ phát video (1.0 là bình thường)
      />
    </View>
  );
}

export default ThuNghiem;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo View chiếm toàn bộ không gian
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center', // Canh giữa theo chiều ngang
  },
  video: {
    width: '100%', // Chiều rộng của video
    height: 300, // Chiều cao của video
  },
});
