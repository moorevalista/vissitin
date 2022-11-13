import React, { Component, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

function MaterialStackedLabelTextboxPaket(props) {
  const [biaya, setBiaya] = useState(props.biaya_layanan)
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.stackedLabel}>Set Biaya Khusus Per-Jam</Text>
      <TextInput
        placeholder="Input"
        style={styles.inputStyle}
        editable={props.updateData}
        onChangeText={setBiaya}
        onEndEditing={(e) => props.onChangeBiaya(e)}
        defaultValue={biaya}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent"
  },
  stackedLabel: {
    fontFamily: "roboto-italic",
    fontSize: 12,
    textAlign: "left",
    color: "#000",
    opacity: 0.6,
    paddingTop: 16
  },
  inputStyle: {
    color: "#000",
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 8,
    paddingBottom: 8
  }
});

export default MaterialStackedLabelTextboxPaket;
