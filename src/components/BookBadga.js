import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Linking } from "react-native";

function BookBadga(props) {

  function openUrl() {
    Linking.openURL(props.link);
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => openUrl()}>
      <Text style={styles.berbayar}>DAFTAR (BERBAYAR)</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F44336",
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
  berbayar: {
    color: "#fff",
    fontSize: 12
  }
});

export default BookBadga;
