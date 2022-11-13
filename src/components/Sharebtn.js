import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Sharebtn(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onSubmit}>
      <Text style={styles.bagikan}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(74,74,74,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  bagikan: {
    color: "#fff",
    fontSize: 17
  }
});

export default Sharebtn;
