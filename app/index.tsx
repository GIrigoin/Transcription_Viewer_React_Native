import { useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
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
import { Audio } from "expo-av";

export default function Index() {
  const theme = useTheme();

  const [transcription, setTranscription] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  //Expo av
  const [sound, setSound] = useState();

  const handlePlaybackUpdate = (status) => {
    const progress = status.positionMillis / status.durationMillis;
    setCurrentTime((prev) => progress);
    let newSegment = -1;
    for (let i = 0; i < transcription.length && newSegment === -1; i++) {
      if (
        status.positionMillis / 1000 >= transcription[i].start &&
        status.positionMillis / 1000 <= transcription[i].end
      )
        newSegment = i;

      if (newSegment !== -1) setCurrentSegment((prev) => newSegment);
    }
  };

  async function playSound() {
    // console.log("Loading Sound");
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://res.cloudinary.com/dyt4p8agq/video/upload/v1720479201/epn2vs0g0wxnowelcjef.wav",
        },
        { progressUpdateIntervalMillis: 100 },
        handlePlaybackUpdate
      );
      setCurrentSegment(0);
      setSound(sound);
      // let status = await sound.getStatusAsync();
      // console.log(status);

      // console.log("Playing Sound");
      await sound.playAsync();

      // status = await sound.getStatusAsync();
      // console.log(status);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSkip = async (index) => {
    if (
      currentSegment + index < transcription.length &&
      currentSegment + index > -1
    ) {
      try {
        setCurrentSegment((prev) => prev + index);
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: "https://res.cloudinary.com/dyt4p8agq/video/upload/v1720479201/epn2vs0g0wxnowelcjef.wav",
          },
          {
            positionMillis: transcription[currentSegment + index].start * 1000,
            progressUpdateIntervalMillis: 100,
          },
          handlePlaybackUpdate
        );

        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.log(error);
      }
    }
  };
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

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleSegmentTouch = async (index) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://res.cloudinary.com/dyt4p8agq/video/upload/v1720479201/epn2vs0g0wxnowelcjef.wav",
        },
        {
          positionMillis: transcription[index].start * 1000,
          progressUpdateIntervalMillis: 100,
        },
        handlePlaybackUpdate
      );
      setSound(sound);
      await sound.playAsync();
      setCurrentSegment((prev) => index);
    } catch (error) {}
  };

  const mapTranscription = () => {
    return transcription.map((element, index) => (
      <Pressable
        key={index}
        onPress={() => {
          handleSegmentTouch(index);
        }}
      >
        <Surface
          elevation={index === currentSegment ? 5 : 2}
          style={{
            borderRadius: 10,
            padding: 20,
            margin: 20,
            marginLeft: element.role === "agent" ? 20 : 100,
            marginRight: element.role === "agent" ? 100 : 20,

            alignSelf: element.role === "agent" ? "flex-start" : "flex-end",
            backgroundColor:
              index === currentSegment
                ? theme.colors.onPrimaryContainer
                : element.role === "agent"
                ? theme.colors.primaryContainer
                : theme.colors.tertiaryContainer,
            // transform: index === currentSegment ? "scale(1.04)" : "none",
            transition: "all 0.4s ease-out",
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              color:
                index === currentSegment
                  ? theme.colors.onPrimary
                  : theme.colors.onBackground,
              fontWeight: index === currentSegment ? "bold" : "normal",
            }}
          >
            {element.content}
          </Text>
        </Surface>
      </Pressable>
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
        height: "100%",
      }}
    >
      <View style={{ height: "80%" }}>
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
          height: "20%",
          padding: 10,
          alignSelf: "flex-end",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ width: "100%", height: 20 }}>
          <ProgressBar
            animatedValue={currentTime}
            color={theme.colors.onPrimaryContainer}
          ></ProgressBar>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            marginBottom: 10,
            // backgroundColor: theme.colors.secondary,
          }}
        >
          <IconButton
            icon="skip-backward"
            mode="contained"
            size={30}
            onPress={() => handleSkip(-1)}
          ></IconButton>
          <IconButton
            icon="play"
            mode="contained"
            size={40}
            onPress={playSound}
          ></IconButton>
          <IconButton
            icon="skip-forward"
            mode="contained"
            size={30}
            onPress={() => handleSkip(1)}
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
