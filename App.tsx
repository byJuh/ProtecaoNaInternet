import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./src/constants/styles";

export default function TelaPrincipal(){
    return(
        <View style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
          <ScrollView>
            <View style={styles.spaceContainer}>

            </View>
          </ScrollView>
        </View>
    )
}
