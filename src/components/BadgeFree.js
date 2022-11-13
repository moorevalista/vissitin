import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Linking } from "react-native";

function BadgeFree(props) {
  function openUrl() {
    Linking.openURL(props.link);
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => openUrl()}>
      <Text style={styles.free}>DAFTAR (GRATIS)</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(10,139,9,1)",
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
    elevation: 2
  },
  free: {
    color: "#fff",
    fontSize: 12
  }
});

export default BadgeFree;
