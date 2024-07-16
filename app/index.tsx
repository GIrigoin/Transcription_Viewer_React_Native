import { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  Surface,
  TouchableRipple,
  Text,
  IconButton,
  Button,
  ProgressBar,
} from "react-native-paper";
import axios from "axios";
import { useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme();

  const [transcription, setTranscription] = useState([]);

  useEffect(() => {
    const loadTranscription = async () => {
      try {
        const { data } = await axios(
          "https://res.cloudinary.com/dyt4p8agq/raw/upload/v1720479186/xol1azvhus4oznorce7l.json"
        );

        setTranscription(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadTranscription();
  }, []);

  const mapTranscription = () => {
    return transcription.map((element, index) => (
      <TouchableOpacity key={index}>
        <Surface
          elevation={2}
          style={{
            padding: 20,
            margin: 20,
            marginLeft: element.role === "agent" ? 20 : 60,
            marginRight: element.role === "agent" ? 60 : 20,

            alignSelf: element.role === "agent" ? "flex-start" : "flex-end",
          }}
        >
          <Text variant="bodyMedium">{element.content}</Text>
        </Surface>
      </TouchableOpacity>
    ));
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
        width: "100%",
      }}
    >
      <View style={{ height: "85%" }}>
        <ScrollView
          contentContainerStyle={{
            margin: 0,
            padding: 5,
            // backgroundColor: theme.colors.tertiary,
            width: "100%",
          }}
        >
          {mapTranscription()}
        </ScrollView>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.colors.secondary,
          width: "100%",
          height: "15%",
          padding: 10,
          alignSelf: "flex-end",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ width: "100%", height: 20 }}>
          <ProgressBar progress={0.5}></ProgressBar>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            // backgroundColor: theme.colors.secondary,
          }}
        >
          <IconButton
            icon="skip-backward"
            mode="contained"
            size={30}
            onPress={() => console.log("Pressed")}
          ></IconButton>
          <IconButton icon="play" mode="contained" size={40}></IconButton>
          <IconButton
            icon="skip-forward"
            mode="contained"
            size={30}
            onPress={() => console.log("Pressed")}
          ></IconButton>
        </View>
      </View>
      {/* <TouchableOpacity>
        <Surface style={{ padding: 4 }}>
          <Text>Edit app/index.tsx to edit this screen.</Text>
        </Surface>
      </TouchableOpacity> */}
    </View>
  );
}
