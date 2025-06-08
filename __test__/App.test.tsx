import React from 'react';
import App from '../App';
import { fireEvent, render } from '@testing-library/react-native';
import { hideNavigationBar } from 'react-native-navigation-bar-color';

jest.mock('react-native-navigation-bar-color', () => ({
    hideNavigationBar: jest.fn()
}))

jest.mock('../src/routes', () => () => <></>);

jest.mock("react-native-mmkv-storage");
jest.mock('react-native-picker-select', () => 'RNPickerSelect');
jest.mock('react-native-bouncy-checkbox', () => 'BouncyCheckbox');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

test('renders correctly', async () => {
  render(<App />)

  expect(hideNavigationBar).toHaveBeenCalled();
});