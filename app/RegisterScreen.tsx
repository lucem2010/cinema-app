import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { AppDispatch } from '@/store/store'
import { registerUser } from './features/User/userSlice'
import { useDispatch } from 'react-redux';
import { validateEmail, validatePassword, validatePhoneNumber } from './validate/Validate'

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [gender, setGender] = useState('Khác')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không đúng định dạng.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Lỗi', 'Mật khẩu phải dài hơn 5 ký tự.');
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({ email, password, name: fullName, phoneNumber, gender, role: 'user' }));
      if (registerUser.fulfilled.match(resultAction)) {
        Alert.alert('Đăng ký thành công', 'Bạn đã đăng ký thành công!');
        navigation.navigate('Drawer', { screen: 'Home' }); // Điều hướng về màn hình đăng nhập
      } else {
        Alert.alert('Đăng ký thất bại', resultAction.payload as string);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/564x/42/13/df/4213df0048a776984aed98368699c2a9.jpg' }} // Link hình nền
        style={styles.imageBackground}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng kí</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ tên của bạn"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại của bạn"
          placeholderTextColor="#888"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Chọn giới tính" value="" />
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
          <Picker.Item label="Khác" value="Khác" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu của bạn"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RegisterScreen

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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
})
