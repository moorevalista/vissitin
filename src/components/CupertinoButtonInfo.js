import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CupertinoButtonInfo(props) {
  const updateData = props.updateData;
  const setUpdateData = props.setUpdateData;

  const setUpdate = () => {
    if(updateData) {
      props.onSubmit();
    }else {
      setUpdateData(!updateData);
    }
  }

  return (
    <TouchableOpacity style={[!updateData ? styles.container : styles.containerUpdate, props.style]} onPress={setUpdate}>
      <Text style={styles.updateData}>{updateData ? 'Submit' : 'Update Data'}</Text>
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
  containerUpdate: {
    backgroundColor: "rgba(25, 183, 160, 1)",
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

export default CupertinoButtonInfo;
