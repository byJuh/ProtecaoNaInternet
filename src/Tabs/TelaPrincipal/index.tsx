import React from "react";
import { View } from "react-native";
import { styles } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TelaPrincipal(){
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <SafeAreaView style={styles.spaceContainer}>

            </SafeAreaView>
          </View>
        </SafeAreaView>
    )
}
