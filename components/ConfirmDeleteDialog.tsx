import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface ConfirmDeleteDialogProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string; // Tên loại phim để hiển thị trong thông báo
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ visible, onClose, onConfirm, itemName }) => {
    return (
        <Modal visible={visible} transparent>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>Xác nhận xóa</Text>
                    <Text style={styles.message}>Bạn có chắc chắn muốn xóa loại phim "{itemName}"?</Text>
                    <View style={styles.buttons}>
                        <Button title="Hủy" onPress={onClose} />
                        <Button title="Xóa" onPress={onConfirm} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dialog: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default ConfirmDeleteDialog;
