import React, { Component, TouchableHighlight } from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";


function Petapasien(props) {

  const lat = props.lat;
  const lon = props.lon;

  function openMaps() {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lon}`;
    const label = 'Lokasi Klien';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);  
  }

  return (
    <View style={[styles.container, props.style]}>
      <MapView
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={[]}
        style={styles.MapView1}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={{ latitude : lat, longitude : lon }}
          onPress={openMaps}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  MapView1: {
    flex: 1,
    backgroundColor: "rgb(230,230,230)"
  },
  title: {
    flex: 1,
    padding: 5,
    backgroundColor: "rgba(65,170,223,1)",
    borderRadius: 10,
  }
});

export default Petapasien;
