import React, { Component, useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { form_validation } from "../form_validation";

function MaterialStackedLabelTextbox(props) {
  const formValidation = useContext(form_validation);
  const [biaya_layanan, setBiaya_layanan] = useState('');

  async function convertDecimal(ev, name) {
    const biaya = await formValidation.convertDecimal(props.dataBiaya.biaya_layanan);
    await setBiaya_layanan(biaya);
  }

  useEffect(() => {
    convertDecimal();
  },[props.dataBiaya.biaya_layanan]);

  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.stackedLabel}>Set Biaya Reguler Per-Jam (Minimum Rp. 250.000)</Text>
      <TextInput
        placeholder="Input"
        style={styles.inputStyle}
        editable={props.updateData}
        //onChangeText={setBiayaLayanan}
        onEndEditing={(e) => props.handleChange(e, props.name)}
        defaultValue={biaya_layanan}
        //value={biayaLayanan}
        keyboardType="numeric"
        ref={props.refBiayaLayanan}
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
    paddingTop: 0,
    paddingBottom: 0
  }
});

export default MaterialStackedLabelTextbox;
