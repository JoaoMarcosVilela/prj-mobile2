import Home from './src/pages/home';
import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#8000FF" barStyle="light-content"/>
      <Routes/> 
    </NavigationContainer>
  );
}


