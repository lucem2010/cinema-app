export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Kiểm tra xem số điện thoại có phải là 10 chữ số không
    return phoneRegex.test(phoneNumber);
};

export const validatePassword = (password) => {
    return password.length > 5;
};