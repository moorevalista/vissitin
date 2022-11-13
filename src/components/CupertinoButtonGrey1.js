import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CupertinoButtonGrey1(props) {
  const [styleButton, setStyleButton] = useState('');

  useEffect(() => {
    props.buttonDaftar ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.buttonDaftar]);

  return (
    <TouchableOpacity disabled={props.buttonDaftar} style={[styleButton, props.style]} onPress={props.handleSubmit}>
      <Text style={styles.daftar}>Daftar</Text>
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
  containerDisabled: {
    backgroundColor: "rgba(74,74,74,0.50)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  daftar: {
    color: "#fff",
    fontSize: 17
  },
});

export default CupertinoButtonGrey1;
