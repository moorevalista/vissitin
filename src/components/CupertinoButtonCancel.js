import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CupertinoButtonCancel(props) {
  const updateData = props.updateData;
  const setUpdateData = props.setUpdateData;

  const setUpdate = () => {
      //setUpdateData(!updateData);
      props.onCancel();
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={setUpdate}>
      <Text style={styles.updateData}>BATAL</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 77, 53, 1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  updateData: {
    color: "#fff",
    fontSize: 17
  }
});

export default CupertinoButtonCancel;
