import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import GlobalStyles from './GlobalStyles';
import { StyleSheet, Image, Text, View, SafeAreaView, AppState, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from "axios";
import moment from 'moment';

/* const GET_WEATHER_DATA = "save-weather-data";

TaskManager.defineTask(GET_WEATHER_DATA, () => {
  try {
    // fetch data here...
    const receivedNewData = "Simulated fetch " + Math.random()
    console.log("My task ", receivedNewData)
    return receivedNewData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData
  } catch (err) {
    return BackgroundFetch.Result.Failed
  }
}) */

export default function App() {
  const [weatherArray, setWeatherArray] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {

    /* TO GET THE CURRENT LATITUDE AND LONGITUDE */
    (async () => {
      await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      let fileUri = FileSystem.documentDirectory + "text.txt";
      console.log(fileUri);
      await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      console.log(asset);
      const newAlbum = await MediaLibrary.createAlbumAsync("Download", asset, false)
      console.log(newAlbum);
/*     let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy:Location.Accuracy.High
    });
    console.log("lat"+location.coords.latitude);
    console.log("long"+location.coords.longitude);
    await axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/weather?lat="+location.coords.latitude+"&lon="+location.coords.longitude+"&&appid=e498fd1f1bfddcec1485687867944128&units=metric",
    }).then((result) => {
      console.log(result.data)
    }).catch((error) => {
      console.log(error)
    }) */
  })();

  /* TO REGISTER THE SERVICE TO RUN IN BACKGROUND */
    //RegisterBackgroundTask();

  }, [])

  const RegisterBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(GET_WEATHER_DATA, {
        minimumInterval: 3600, // seconds,
      })
      console.log("Task registered")
    } catch (err) {
      console.log("Task Register failed:", err)
    }
  }

  const onSubmit = async () => {
    console.log(text);
    await axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + text + "&appid=e498fd1f1bfddcec1485687867944128&units=metric",
    }).then((result) => {
      setWeatherArray(result.data);
    }).catch((error) => {
      console.log(error)
    })
  }

  return (

    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.tab1} onPress={onSubmit}><Text>Check weather</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab2} onPress={onSubmit}><Text>Check CPU temperature</Text></TouchableOpacity>
        </View>
        <View style={styles.inputBar}>
          <TextInput
            placeholder=" Enter your city name"
            placeholderTextColor="gray"
            style={styles.input}
            onChangeText={text => setText(text)}
            value={text}
          />
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}><Text>Submit</Text></TouchableOpacity>
        </View>
        {Object.keys(weatherArray).length > 0 && (<View style={styles.detail}>
          {/* <View style={styles.detailContent}> */}
          <View style={styles.upperText}>
            <Text style={styles.dayname}>{moment.unix(weatherArray.dt).format("dddd")}</Text>
            <Text style={styles.fullDatePlaceName}>{moment.unix(weatherArray.dt).format("DD-MMMM-YYYY")}</Text>
            <Text style={styles.fullDatePlaceName}><Feather name="map-pin" size={20} color="white" /> {weatherArray.name}</Text>
          </View>
          <View style={styles.imageContent}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: 'https://openweathermap.org/img/wn/' + weatherArray.weather[0].icon + '@2x.png',
              }}
            />
            <Text style={styles.mainText}>{weatherArray.main.temp} °C</Text>
            <Text style={styles.mainText}>{weatherArray.weather[0].main} ({weatherArray.weather[0].description})</Text>
          </View>
          {/* </View> */}
        </View>)}
        {Object.keys(weatherArray).length > 0 && (<View style={styles.detailLowerPart}>
          {/* <View style={styles.detailContent}> */}
          <View style={styles.tempDetail}>
            <Text style={styles.dayname}>HUMIDITY </Text>
            <Text style={styles.dayname}>{weatherArray.main.humidity} %</Text>
          </View>
          <View style={styles.tempDetail}>
            <Text style={styles.dayname}>WIND </Text>
            <Text style={styles.dayname}>{weatherArray.wind.speed} Km/h</Text>
          </View>
          {/* </View> */}
        </View>)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /*   outContainer: {
      flex: 1
    }, */
  container: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "gray",
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },
  tab1: {
    padding: 10,
  },
  tab2: {
    padding: 10,
    borderLeftWidth: 2,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 15,
  },
  input: {
    height: 35,
    width: 300,
    borderWidth: 1.2,
    borderRadius: 6,
    fontSize: 20,
    padding: 7
  },
  submitButton: {
    borderRadius: 5,
    borderWidth: 2,
    height: 35,
    width: 65,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detail: {
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    backgroundColor: "rgb(129,207,237)",
    height: "55%",
    width: "90%",
    alignSelf: "center"
  },
  /*   detailContent:{
      flexDirection:"column",
      flex:1,
      alignItems:"center",
    }, */
  upperText: {
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 20
  },
  dayname: {
    color: "white",
    fontSize: 25,
    fontWeight: "900",
    margin: 5
  },
  fullDatePlaceName: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    margin: 1
  },
  imageContent: {
    justifyContent: "flex-end",
    paddingLeft: 20,
    width: "100%",
    height: "70%"
  },
  tinyLogo: {
    width: 150,
    height: 90,
  },
  mainText: {
    color: "white",
    fontSize: 18,
    margin: 3,
    fontWeight: "800"
  },
  detailLowerPart: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "rgb(34,40,49)",
    height: "20%",
    width: "90%",
    alignSelf: "center"
  },
  tempDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10
  }
});