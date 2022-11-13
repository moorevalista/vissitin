import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function MaterialButtonDark(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.checkIn}>Check-in</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "rgba(230, 230, 230,1)"
  },
  checkIn: {
    color: "#fff",
    fontSize: 13
  }
});

export default MaterialButtonDark;
