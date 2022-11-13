import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Jadwalheader from "./Jadwalheader";

function Headerjadwal({props}) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect5}></View>
      <Jadwalheader style={styles.jadwalheader} props={props}></Jadwalheader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect5: {
    height: 31,
    backgroundColor: "#efeff4"
  },
  jadwalheader: {
    height: 44
  }
});

export default Headerjadwal;
