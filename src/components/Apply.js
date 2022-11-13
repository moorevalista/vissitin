import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Linking } from "react-native";

function Apply(props) {
  function openUrl() {
    Linking.openURL(props.link);
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => openUrl()}>
      <Text style={styles.daftar}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  daftar: {
    color: "#fff",
    fontSize: 14
  }
});

export default Apply;
