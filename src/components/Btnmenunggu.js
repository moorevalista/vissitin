import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Btnmenunggu(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.antrian}>Antrian</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(252,173,0,1)",
    borderRadius: 10
  },
  antrian: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    textAlign: "center",
    height: 'auto',
    width: '100%',
    padding: '1%',
  }
});

export default Btnmenunggu;
