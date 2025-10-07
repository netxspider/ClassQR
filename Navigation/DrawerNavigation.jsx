import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigation from './BottomTabNavigation';

const DrawerNavigation = () => {
    const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
        <Drawer.Screen name="Home" component={BottomTabNavigation} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation