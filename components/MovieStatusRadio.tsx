import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const MovieStatusRadio = ({ status = '', setStatus }) => {
    return (
        <View>
            <Text style={styles.label}>Status</Text>
            <View style={styles.radioGroup}>
                <View style={styles.radioItem}>
                    <RadioButton
                        value="Sắp Chiếu"
                        status={status === "Sắp Chiếu" ? "checked" : "unchecked"}
                        onPress={() => setStatus("Sắp Chiếu")}
                    />
                    <Text style={styles.radioText}>Sắp Chiếu</Text>
                </View>
                <View style={styles.radioItem}>
                    <RadioButton
                        value="Đang Chiếu"
                        status={status === "Đang Chiếu" ? "checked" : "unchecked"}
                        onPress={() => setStatus("Đang Chiếu")}
                    />
                    <Text style={styles.radioText}>Đang Chiếu</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioText: {
        fontSize: 16,
        marginLeft: 4,
    },
});

export default MovieStatusRadio;
