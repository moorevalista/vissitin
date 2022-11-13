import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MaterialSpinner from "../components/MaterialSpinner";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Loader(props) {
  alert(JSON.stringify(props))
  //props.navigation.navigate('loginScreen', {...props});
  return (
    <View style={styles.container}>
      <MaterialSpinner style={styles.materialSpinner}></MaterialSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  materialSpinner: {
    width: 22,
    height: 22,
    alignSelf: "center"
  }
});

export default Loader;
