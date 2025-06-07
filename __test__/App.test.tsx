import React from 'react';
import App from '../App';
import { render } from '@testing-library/react-native';
import { hideNavigationBar } from 'react-native-navigation-bar-color';

jest.mock('react-native-navigation-bar-color', () => ({
    hideNavigationBar: jest.fn()
}))

jest.mock('../src/routes', () => () => <></>);


jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn()
}))

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }),
}));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

jest.mock("react-native-mmkv-storage");
jest.mock('react-native-picker-select', () => 'RNPickerSelect');
jest.mock('react-native-bouncy-checkbox', () => 'BouncyCheckbox');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

test('renders correctly', async () => {
  render(<App />)

  expect(hideNavigationBar).toHaveBeenCalled();
});