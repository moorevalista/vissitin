import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function CupertinoSearchBarBasic(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.inputBox}>
        <Icon name="account-circle" style={styles.inputLeftIcon}></Icon>
        <TextInput placeholder="Search" style={styles.inputStyle}></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#CECED2"
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  inputLeftIcon: {
    color: "#000",
    fontSize: 20,
    alignSelf: "center",
    paddingLeft: 5,
    paddingRight: 5
  },
  inputStyle: {
    height: 32,
    alignSelf: "flex-start",
    fontSize: 15,
    lineHeight: 15,
    color: "#000",
    flex: 1
  }
});

export default CupertinoSearchBarBasic;
