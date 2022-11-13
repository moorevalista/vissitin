import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Transaksiheader from "./Transaksiheader";

function Transaksihead({props}) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect2}></View>
      <Transaksiheader style={styles.cupertinoHeaderWithActionButton1} props={props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cupertinoHeaderWithActionButton1: {
    height: 44,
  },
  rect2: {
    height: 31,
    backgroundColor: "#efeff4"
  }
});

export default Transaksihead;
