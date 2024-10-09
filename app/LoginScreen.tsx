import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { loginUser } from './features/User/userSlice';
import { validateEmail } from './validate/Validate';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng.');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        console.log(resultAction.payload); // Thông báo thành công
        navigation.navigate('Drawer', { screen: 'Home' }); // Điều hướng sau khi đăng nhập thành công
      } else {
        console.log('Login failed:', resultAction.payload); // Thông báo lỗi
        // Display an alert when login fails
        Alert.alert('Lỗi', 'Sai thông tin tài khoản hoặc mật khẩu.');
      }
    } catch (err) {
      console.log('Login failed:', err);
      // Display an alert when there is an error
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
  };


  const handleRegister = () => {

    navigation.navigate('RegisterScreen')
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/564x/03/44/44/034444d5de9b0a4f5af17e9eadf8fa48.jpg' }} // Link hình nền
        style={styles.imageBackground}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Email của bạn"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.QMk} onPress={handleLogin}>
          <Text style={styles.textline}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.text}>Hoặc</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng kí tài khoản CGV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.QMk} onPress={handleLogin}>
          <Text style={styles.textline}>Kích hoạt tài khoản </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 0.5,

  },
  backButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ cho nút quay lại
    marginBottom: 20, // Khoảng cách từ dưới cùng
    alignSelf: 'flex-start', // Đặt nút quay lại ở bên trái
    margin: 20, // Khoảng cách từ trái
  },
  backButtonText: {
    color: '#fff', // Màu chữ của nút Quay lại
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Căn giữa các phần tử trong formContainer
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trắng với độ trong suốt
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    height: 50, // Chiều cao của TextInput
    width: '100%', // Chiều dài của TextInput
    borderColor: '#ddd', // Màu viền của TextInput
    borderWidth: 1, // Độ dày của viền
    borderRadius: 8, // Độ bo góc của viền
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff', // Màu nền của TextInput
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: '#007BFF', // Màu nền của nút
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // Màu chữ của nút
    fontSize: 18,
    fontWeight: 'bold',
  },
  QMk: {
    alignSelf: 'center',
    marginTop: 20
  },
  textline: {
    textDecorationLine: 'underline',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000', // Màu của đường line
  },
  text: {
    marginHorizontal: 10, // Khoảng cách giữa dòng và văn bản
    fontSize: 16,
    color: '#000', // Màu của văn bản
  },
});

export default LoginScreen;
