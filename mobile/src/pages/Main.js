import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

function Main({ navigation }){
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState('');

  useEffect(()=>{
    async function loadInitialLocation(){
      //Permissão Usuário
      const { granted } = await requestPermissionsAsync();

      if(granted){
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        
        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude,
          longitude,
          //Calculos Navais para obter o zoom dentro do mapa
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
      }
    }
    loadInitialLocation();
  }, []);

  if (!currentRegion){
    return null
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  async function loadDevs(){
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs: "React Native"
      }
    });

    setDevs(response.data.devs)
  }

  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0],
            }} 
          >
            <Image 
              source={{uri: dev.avatar_url}}
              style={styles.avatar}  
            />

            <Callout onPress={()=>{
              navigation.navigate('Profile', { github_username: dev.github_username })
            }}>

              <View style={styles.callout} >
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>

            </Callout>

          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput 
          style={styles.searchInput}
          placeholder='Buscar Devs por Techs...'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons name='my-location' size={25} color='#fff' />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#7d40e7',
  },
  callout: {
    width: 260,
  }, 
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  devBio: {
    color: '#666',
    marginTop: 5,
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    //shadow são de IOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    //Elevation é sombra no android
    elevation: 5,

  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

})

export default Main;