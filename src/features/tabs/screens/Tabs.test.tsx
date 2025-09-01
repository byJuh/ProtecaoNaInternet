import { fireEvent, render } from "@testing-library/react-native";
import Tabs from ".";
import { NavigationContainer } from "@react-navigation/native";

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock("react-native-mmkv-storage");
jest.mock('react-native-picker-select', () => 'RNPickerSelect');
jest.mock('react-native-bouncy-checkbox', () => 'BouncyCheckbox');

jest.useFakeTimers();

describe('Testando Tabs', () => {
  it('Tab inicial', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    );
    

    expect(getByTestId('tab-Bloquear')).toBeTruthy();
    expect(getByTestId('tab-Bloquear').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('tab-AdicionarGrupo')).toBeTruthy();
  });

  it('Navegando pelo Tab', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    );
    

    expect(getByTestId('tab-Bloquear')).toBeTruthy();
    expect(getByTestId('tab-Bloquear').props.accessibilityState.selected).toBe(true);

    const tabAdicionarGrupo = getByTestId('tab-AdicionarGrupo');
    fireEvent.press(tabAdicionarGrupo);

    expect(tabAdicionarGrupo.props.accessibilityState.selected).toBe(true);
    expect(getByTestId('tab-Bloquear').props.accessibilityState.selected).toBe(false);
  
    const tabBloquear = getByTestId('tab-Bloquear');
    fireEvent.press(tabBloquear);

    expect(tabBloquear.props.accessibilityState.selected).toBe(true);
    expect(tabAdicionarGrupo.props.accessibilityState.selected).toBe(false);
  });
});