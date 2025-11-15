import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { useState } from "react";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function TelaComoAcharMacAddress(){
    const [modalVisible, setModalVisible] = useState(false);
    const [textoSelecionado, setTextoSelecionado] = useState("");

    const marcas = ['Android (Samsung, Motorola, Xiaomi, etc.)', 'iOS (iPhone, iPad)', 'Windows', 'macOS (Apple)'];
    const navigation = useNavigation<NavigationProps>();

    const instrucoes: Record<string, string> = {
      "Android (Samsung, Motorola, Xiaomi, etc.)":
        "1️⃣ Abra o app **Configurações** do celular.\n\n" +
        "2️⃣ Toque em **Sobre o telefone** ou **Informações do telefone**.\n\n" +
        "3️⃣ Toque em **Status** ou **Informações de hardware**.\n\n" +
        "4️⃣ Procure **Endereço MAC do Wi-Fi**.\n\n" +
        "💡 Dica: Em alguns aparelhos, vá em **Configurações → Rede e Internet → Wi-Fi → (toque na rede) → Avançado**.",
      "iOS (iPhone, iPad)":
        "1️⃣ Vá em **Ajustes → Geral → Sobre**.\n\n" +
        "2️⃣ Procure **Endereço Wi-Fi**.\n\n" +
        "⚠️ Se o 'Endereço Privado' estiver ativado, o número pode mudar. Desative essa opção para ver o real.",
      "Windows":
        "1️⃣ Clique no **ícone de Wi-Fi** (no canto inferior direito da tela).\n\n" +
        "2️⃣ Clique em **Propriedades da conexão**.\n\n" +
        "3️⃣ Role para baixo até **Endereço físico (MAC)**.\n\n" +
        "💡 Ou vá em **Configurações → Rede e Internet → Wi-Fi → Propriedades da rede**.",
      "macOS (Apple)":
        "1️⃣ Clique no **menu da maçã ()** no canto superior esquerdo.\n\n" +
        "2️⃣ Vá em **Ajustes do Sistema → Rede**.\n\n" +
        "3️⃣ Clique em **Wi-Fi → Avançado**.\n\n" +
        "4️⃣ Veja o **Endereço Wi-Fi** — esse é o seu MAC Address.",
    };

    const abrirModal = (marca: string) => {
        setTextoSelecionado(instrucoes[marca]);
        setModalVisible(true);
    };

    function renderFormattedText(text: string) {
        const parts = text.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <Text key={index} style={{ fontWeight: "bold" }}>
                {part.replace(/\*\*/g, "")}
                </Text>
            );
            } else {
            return <Text key={index}>{part}</Text>;
            }
        });
    }

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            onPress={() => abrirModal(item)}
        >
            <Text testID={`text-${item}`} style={{ fontWeight: 'bold', fontSize: 22}}>{item}</Text>
        </TouchableOpacity>
    );

    return(
      <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
            <View style={{ flex: 1, alignItems: 'center', width: '100%'}}>
              <View style={{height: '40%'}}>
                    <Text style={[styles.textoExplicativo, {fontSize: 17}]}>
                      O que é o MAC Address? {'\n'}{'\n'}

                      O MAC Address é um código que identifica o seu aparelho na internet ou na rede Wi-Fi.
                      {'\n'}Ele parece com isso: {'\n'}
                      👉 28:C5:D2:4C:AA:A9
                  </Text>
                </View>
                <SafeAreaView style={[styles.spaceContainerAddBlock, {marginBottom: 100, height: '60%'}]}>
                    <FlatList
                      data={marcas}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      testID="list-dispositivos"
                    />
                </SafeAreaView>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    <View
                        style={{
                        backgroundColor: "#fff",
                        padding: 20,
                        borderRadius: 15,
                        width: "85%",
                        maxHeight: "80%",
                        }}
                    >
                    <ScrollView>
                        <Text style={{ fontSize: 18, color: "#333", lineHeight: 26 }}>
                            {renderFormattedText(textoSelecionado)}
                        </Text>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                            backgroundColor: "#6495ED",
                            padding: 12,
                            borderRadius: 10,
                            marginTop: 20,
                            alignItems: "center",
                        }}
                        >
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                            Fechar
                        </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
               
            </View>
        </SafeAreaView>
    )
}
