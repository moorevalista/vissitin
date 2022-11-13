import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Btnbatal(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.batal1}>Batal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(208,2,27,1)",
    borderRadius: 100
  },
  batal1: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    textAlign: "center",
    height: 'auto',
    width: '100%',
    padding: '1%',
  }
});

export default Btnbatal;
