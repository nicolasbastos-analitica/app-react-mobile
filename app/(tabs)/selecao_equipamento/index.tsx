import React from "react";
import { View } from "react-native";
import { Avatar, Button, Dialog, MD3Colors, Modal, Portal, ProgressBar, TextInput, } from 'react-native-paper';
import { styles } from './styles'

export default function SelecaoEquipamento() {
    return (
        <View>
            <View style={styles.containerAvatar}>
            <Avatar.Image style={styles.avatar} size={23} source={require('@/assets/images/favicon.png')} />
            </View>
        </View>
    );
}