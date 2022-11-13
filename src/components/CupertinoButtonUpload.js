import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CupertinoButtonUpload(props) {
  const updateData = props.updateData;
  const setUpdateData = props.setUpdateData;

  const handleChoosePhoto = (name) => {
    //setUpdateData(!updateData);
    props.handleChoosePhoto(name);
  }

  return (
    <TouchableOpacity disabled={!updateData} style={[!updateData ? styles.containerUpdate : styles.container, props.style]} onPress={() => handleChoosePhoto(props.name)}>
      <Text style={styles.updateData}>Upload Foto {props.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(18, 93, 146)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  containerUpdate: {
    backgroundColor: "rgba(18, 93, 146, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  updateData: {
    color: "#fff",
    fontSize: 14
  }
});

export default CupertinoButtonUpload;
