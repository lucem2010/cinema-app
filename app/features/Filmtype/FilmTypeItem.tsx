import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FilmType } from '../../model/FilmType';


interface FilmTypeItemProps {
    filmType: FilmType;
    onEdit: () => void;
    onDelete: () => void;
}

const FilmTypeItem: React.FC<FilmTypeItemProps> = ({ filmType, onEdit, onDelete }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{filmType.name}</Text>
            <Button title="Sửa" onPress={onEdit} />
            <Button title="Xóa" onPress={onDelete} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 18,
    },
});

export default FilmTypeItem;
