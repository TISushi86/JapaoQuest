import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainMenu from './src/screens/MainMenu';
import MapScreen from './src/screens/MapScreen';
import BattleScreen from './src/screens/BattleScreen';
import LessonScreen from './src/screens/LessonScreen';
import LessonsListScreen from './src/screens/LessonsListScreen';
import PrologueScreen from './src/screens/PrologueScreen';
import KanaRainScreen from './src/screens/KanaRainScreen';
import EimeiTempleScreen from './src/screens/EimeiTempleScreen';
import BattleTempleSelectScreen from './src/screens/BattleTempleSelectScreen';
import SimuladoScreen from './src/screens/SimuladoScreen';
import { PlayerProvider } from './src/context/PlayerContext';
import ConquestModalLayer from './src/components/ConquestModalLayer';

const Stack = createStackNavigator();

// Incrementar sempre que o banco de dados for atualizado
const DB_VERSION = '3';

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    async function loadDatabase() {
      if (Platform.OS === 'web') {
        setDbLoaded(true);
        return;
      }

      const dbName = 'japaoquest.db';
      const dbAsset = require('./src/assets/japaoquest.db');
      const dbUri = Asset.fromModule(dbAsset).uri;
      const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
      const versionPath = `${FileSystem.documentDirectory}db_version.txt`;

      let needsCopy = false;

      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (!fileInfo.exists) {
        needsCopy = true;
      } else {
        try {
          const versionInfo = await FileSystem.getInfoAsync(versionPath);
          if (versionInfo.exists) {
            const stored = await FileSystem.readAsStringAsync(versionPath);
            if (stored.trim() !== DB_VERSION) needsCopy = true;
          } else {
            needsCopy = true;
          }
        } catch {
          needsCopy = true;
        }
      }

      if (needsCopy) {
        console.log(`Copiando banco de dados (v${DB_VERSION})...`);
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`,
          { intermediates: true }
        );
        await FileSystem.downloadAsync(dbUri, dbPath);
        await FileSystem.writeAsStringAsync(versionPath, DB_VERSION);
      } else {
        console.log(`Banco de dados v${DB_VERSION} já atualizado.`);
      }

      setDbLoaded(true);
    }

    loadDatabase().catch(e => console.error(e));
  }, []);

  if (!dbLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={{ color: '#fff', marginTop: 20 }}>Carregando Dicionários...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlayerProvider>
        <ConquestModalLayer />
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainMenu" component={MainMenu} />
            <Stack.Screen name="Prologue" component={PrologueScreen} />
            <Stack.Screen name="KanaRain" component={KanaRainScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Battle" component={BattleScreen} />
            <Stack.Screen name="BattleTempleSelect" component={BattleTempleSelectScreen} />
            <Stack.Screen name="LessonsList" component={LessonsListScreen} />
            <Stack.Screen name="Lesson" component={LessonScreen} />
            <Stack.Screen name="EimeiTemple" component={EimeiTempleScreen} />
            <Stack.Screen name="Simulado" component={SimuladoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </GestureHandlerRootView>
  );
}
