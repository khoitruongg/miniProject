/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  FlatList
} from 'react-native';
import { connect, Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from '@redux'
import { Router, Actions } from 'react-native-router-flux';
import AppRoutes from '@navigation'
import thunk from 'redux-thunk'

let middleware = [
  thunk, // Allows action creators to return functions (not just plain objects)
];

const ReduxWithRouterFlux = connect()(Router)
const store = compose(
  applyMiddleware(...middleware),
)(createStore)(rootReducer);

export default class App extends Component {

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Provider store={store}>
          <ReduxWithRouterFlux scenes={AppRoutes} />
        </Provider>
      </SafeAreaView>
    )
  }

};
