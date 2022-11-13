import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnkirim(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.submitTolak}>
      <Text style={styles.kirim}>KIRIM</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(65,170,223,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  kirim: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnkirim;
