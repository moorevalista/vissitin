import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import IconPanah from 'react-native-vector-icons/Ionicons';

export default function KonfirmasiVCall(props) {
  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconFeather
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(255, 255, 255, 1)',
            fontSize: 18,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
    return (
      <IconPanah
        style={{
          backgroundColor: 'transparent',
          color: color ? color : 'rgba(0,32,51,1)',
          fontSize: 18,
          opacity: 0.8,
        }}
        name={name}
      />
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingTop: 10,
      }}>
      <View style={styles.User}>
        <View style={styles.subUser}>
          <Image
            style={styles.Useravatar}
            source={{
              uri: 'http://placeimg.com/640/480/any',
            }}
          />
          <View style={styles.Text}>
            <Text style={styles.Txt2541}>Aldiory Xavian Shaquille</Text>
            <View style={styles.subUser}>
              <Text style={styles.Txt6811}>1234567891239545</Text>
              <TouchableOpacity
                onPress={() => {
                  copyKodeNakes('1234567891239545');
                }}>
                <Icons name="copy" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <View style={styles.IconHeader}>
            <Icons name="chevron-back-sharp" color="rgba(255, 255, 255, 1)" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapperCardAtas}>
        <View style={styles.Group378}>
          <View style={styles.Jenis_layanan_kiri}>
            <Text style={styles.Txt319}>Nama Pasien</Text>
            <Text style={styles.Txt656}>
              Annisa Putri Qoryatullistya, SST.FT, FTr
            </Text>
          </View>
          <View style={styles.Jenis_layanan_kanan}>
            <Text style={styles.Txt319}>Nama Nakes</Text>
            <Text style={styles.Txt656}>Qoryatullistya, SST.FT, FTr</Text>
          </View>
        </View>

        <View style={styles.Jadwal1}>
          <Text style={styles.Txt091}>Jadwal Reservasi</Text>
          <Text style={styles.Txt710}>Sabtu, 26/07/2022 - 10.00 WIB</Text>
        </View>
      </View>
      <View style={styles.wrepperVidio}>
        <Text>Gambar disini</Text>
      </View>
      <View style={styles.wrepperIcon}>
        <TouchableOpacity onPress={() => null}>
          <View style={styles.Tbl_iconPanah_kiri}>
            <Icons label="Panah" name="video-off" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => null}>
          <View style={styles.Tbl_iconPanah_kanan}>
            <Icons label="Panah" name="phone-call" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Txt656: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  Txt319: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
  },

  Jenis_layanan_kiri: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
    maxWidth: '50%',
  },
  Jenis_layanan_kanan: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
    maxWidth: '50%',
  },

  Jadwal1: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  Txt710: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Txt091: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Group378: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  wrapperCardAtas: {
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
  },

  wrepperVidio: {
    height: '50%',
    backgroundColor: 'rgba(217,217,217,1)',
    borderRadius: 20,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrepperIcon: {
    flexDirection: 'row',
    marginHorizontal: 60,
    justifyContent: 'space-around',
  },
  Tbl_iconPanah_kiri: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(239,70,62,1)',
    borderRadius: 100,
    marginBottom: 10,
    width: 50,
    height: 50,
  },
  Tbl_iconPanah_kanan: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,1)',
    borderRadius: 100,
    marginBottom: 10,
    width: 50,
    height: 50,
  },
  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subUser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Useravatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 100,
  },
  IconHeader: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  Txt254: {
    fontSize: 16,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    paddingRight: 25,
  },
  Txt2541: {
    fontSize: 16,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
  Txt6811: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,32,51,1)',
    paddingRight: 25,
  },
});
