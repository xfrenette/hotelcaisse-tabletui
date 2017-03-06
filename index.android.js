/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import UIElements from './app/components/UIElements';

export default class HotelCaisse extends Component {
  render() {
    return (
      <UIElements />
    );
  }
}

AppRegistry.registerComponent('HotelCaisse', () => HotelCaisse);
