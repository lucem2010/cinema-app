import { User } from "@/app/model/User";
import { auth, firestore } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where, limit, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const registerUserWithFirebase = async (
  email: string,
  password: string,
  name: string,
  phoneNumber: string,
  gender: string,
  role: string
): Promise<User> => {
  try {
    // Đăng ký người dùng với Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Tạo tài liệu Firestore với ID của người dùng từ Firebase Authentication
    const newDocRef = doc(firestore, 'users', userCredential.user.uid);

    const userData: User = {
      id: userCredential.user.uid, // Sử dụng ID từ Firebase Authentication
      name,
      phoneNumber,
      email,
      gender,
      role,
    };

    // Lưu thông tin người dùng vào Firestore
    await setDoc(newDocRef, userData);

    // Lưu thông tin người dùng vào AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(userData));

    return userData;
  } catch (error) {
    throw new Error(error.message); // Ném lỗi để hàm gọi có thể xử lý
  }
};

export const loginUserWithFirebase = async (email: string, password: string): Promise<User> => {
  try {
    // Đăng nhập người dùng với Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Lấy thông tin người dùng từ Firestore
    const userDocRef = doc(firestore, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('Tài liệu người dùng không tồn tại.');
    }

    const userData = userDoc.data() as User;

    // Lưu thông tin người dùng vào AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(userData));

    return userData;
  } catch (error) {
    throw new Error(error.message); // Ném lỗi để hàm gọi có thể xử lý
  }
};
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const userQuery = query(
      collection(firestore, 'users'),
      where('email', '==', email),
      limit(1)
    );

    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data() as User;
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message); // Ném lỗi để hàm gọi có thể xử lý
  }
};
