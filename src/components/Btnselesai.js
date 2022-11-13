import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Btnselesai(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.selesai}>Selesai</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,165,50,1)",
    borderRadius: 100
  },
  selesai: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    textAlign: "center",
    height: 'auto',
    width: '100%',
    padding: '1%',
  }
});

export default Btnselesai;
