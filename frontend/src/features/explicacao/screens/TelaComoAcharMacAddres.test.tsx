import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import TelaComoAcharMacAddress from "./TelaComoAcharMacAddress";

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('@react-navigation/native-stack');

const mockNavigate = jest.fn();
const mockReplace= jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace
  })
}));

describe("Testando TelaComoAcharMacAddress", () => {

  beforeEach(() => {
    mockNavigate.mockClear();
    mockReplace.mockClear();
    jest.clearAllMocks();
  });

  it("Renderiza a tela e mostra a lista de dispositivos", () => {
    const { getByText, getByTestId } = render(<TelaComoAcharMacAddress />);

    // Verifica descrição inicial
    expect(
      getByText(/O que é o MAC Address?/i)
    ).toBeTruthy();

    // Verifica lista pelo testID
    const list = getByTestId("list-dispositivos");
    expect(list).toBeTruthy();

    // Verifica alguns itens
    expect(getByText("Android (Samsung, Motorola, Xiaomi, etc.)")).toBeTruthy();
    expect(getByText("iOS (iPhone, iPad)")).toBeTruthy();
  });

  it("Abre o modal ao clicar em um item da lista", () => {
    const { getByText, queryByText } = render(<TelaComoAcharMacAddress />);

    expect(queryByText(/Endereço Wi-Fi/i)).toBeNull(); // modal ainda fechado

    const item = getByText("iOS (iPhone, iPad)");
    fireEvent.press(item);

    // Após clicar o modal deve aparecer
    expect(getByText(/Endereço Wi-Fi/i)).toBeTruthy();
  });

  it("Fecha o modal ao clicar no botão Fechar", () => {
    const { getByText, queryByText } = render(<TelaComoAcharMacAddress />);

    // Abre modal clicando no item Android
    fireEvent.press(getByText("Android (Samsung, Motorola, Xiaomi, etc.)"));

    // Confirma modal aberto
    expect(getByText(/Endereço MAC do Wi-Fi/i)).toBeTruthy();

    const fecharButton = getByText("Fechar");
    fireEvent.press(fecharButton);

    // Agora modal deve desaparecer
    expect(queryByText(/Endereço MAC do Wi-Fi/i)).toBeNull();
  });

});
