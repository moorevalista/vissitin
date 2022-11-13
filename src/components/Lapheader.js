import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Laporanheader from "./Laporanheader";

function Lapheader({props}) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect1}></View>
      <Laporanheader style={styles.laporanheadet} props={props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect1: {
    height: 31,
    backgroundColor: "#efeff4"
  },
  laporanheadet: {
    height: 44
  }
});

export default Lapheader;
