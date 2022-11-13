import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btntolak(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onReject}>
      <Text style={styles.tolak}>TOLAK</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  tolak: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btntolak;
