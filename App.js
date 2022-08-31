import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { icons } from "./icons";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const WordBox = styled(Animated.createAnimatedComponent(View))`
  z-index: 25;
`;

const Word = styled.Text`
  color: white;
  font-size: 35px;
  font-weight: 500;
`;

const IconContainer = styled(Animated.createAnimatedComponent(View))`
  background-color: ${GREY};
  padding: 10px;
  border-radius: 15px;
`;

const StateCard = styled(Animated.createAnimatedComponent(View))`
  position: absolute;
  z-index: 10;
  width: 320px;
  height: 320px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 20px;
`;

const CardText = styled.Text`
  font-size: 32px;
  font-weight: 600;
  color: white;
  margin-top: -20px;
`;
export default function App() {
  const [box, setBox] = useState([]);
  const [index, setIndex] = useState(0);
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleCorrect = useRef(new Animated.Value(0)).current;
  const scaleWrong = useRef(new Animated.Value(0)).current;

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
  
  useEffect(() => {
    let newBox = [];
    newBox.push(icons[index]);
    while (true) {
      let randomIndex = Math.floor(Math.random() * icons.length);
      if (index !== randomIndex) {
        newBox.push(icons[randomIndex]);
        break;
      }
    }
    shuffle(newBox);
    setBox((prev) => newBox);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({
          x: dx,
          y: dy,
        });
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        if (dy < -250) {
          if (box.length === 2 && box[0].label === icons[index].label) {
            //맞춘경우
            Animated.parallel([
              correctScaleBigger,
              // wrongScaleBigger,
              removeOpacity,
              initPosition,
            ]).start(callNewData);

            setTimeout(() => {
              Animated.parallel([
                initCorrectScale,
                // initWrongScale,
                initOpacity,
                initScale,
              ]).start();
            }, 1500);
          } else {
            //틀린경우
            Animated.parallel([
              // correctScaleBigger,
              wrongScaleBigger,
              removeOpacity,
              initPosition,
            ]).start(callNewData);

            setTimeout(() => {
              Animated.parallel([
                // initCorrectScale,
                initWrongScale,
                initOpacity,
                initScale,
              ]).start();
            }, 1500);
          }
        } else if (dy > 250) {
          if (box.length === 2 && box[1].label === icons[index].label) {
            //맞춘경우
            Animated.parallel([
              correctScaleBigger,
              // wrongScaleBigger,
              removeOpacity,
              initPosition,
            ]).start(callNewData);

            setTimeout(() => {
              Animated.parallel([
                initCorrectScale,
                // initWrongScale,
                initOpacity,
                initScale,
              ]).start();
            }, 1500);
          } else {
            //틀린경우
            Animated.parallel([
              // correctScaleBigger,
              wrongScaleBigger,
              removeOpacity,
              initPosition,
            ]).start(callNewData);

            setTimeout(() => {
              Animated.parallel([
                // initCorrectScale,
                initWrongScale,
                initOpacity,
                initScale,
              ]).start();
            }, 1500);
          }
        } else {
          Animated.parallel([onPressOut, goBack]).start();
        }
      },
    })
  ).current;

  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goBack = Animated.spring(position, {
    toValue: {
      x: 0,
      y: 0,
    },
    useNativeDriver: true,
  });

  const scaleOne = position.y.interpolate({
    inputRange: [-300, -120],
    outputRange: [1.5, 1],
    extrapolate: "clamp",
  });

  const scaleTwo = position.y.interpolate({
    inputRange: [120, 300],
    outputRange: [1, 1.5],
    extrapolate: "clamp",
  });

  const correctScaleBigger = Animated.spring(scaleCorrect, {
    toValue: 1,
    useNativeDriver: true,
  });

  const initCorrectScale = Animated.spring(scaleCorrect, {
    toValue: 0,
    useNativeDriver: true,
  });

  const wrongScaleBigger = Animated.spring(scaleWrong, {
    toValue: 1,
    useNativeDriver: true,
  });

  const initWrongScale = Animated.spring(scaleWrong, {
    toValue: 0,
    useNativeDriver: true,
  });

  const removeOpacity = Animated.timing(opacity, {
    toValue: 0,
    useNativeDriver: true,
    duration: 50,
    easing: Easing.linear,
  });
  const initOpacity = Animated.spring(opacity, {
    toValue: 1,
    useNativeDriver: true,
  });

  const initPosition = Animated.timing(position, {
    toValue: {
      x: 0,
      y: 0,
      duration: 50,
      easing: Easing.linear,
    },
    useNativeDriver: true,
  });

  const initScale = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const callNewData = () => {
    if (icons.length > index + 1) {
      let newIndex = index + 1;
      let newBox = [];
      newBox.push(icons[newIndex]);
      while (true) {
        let randomIndex = Math.floor(Math.random() * icons.length);
        if (newIndex !== randomIndex) {
          newBox.push(icons[randomIndex]);
          break;
        }
      }
      shuffle(newBox);
      setBox((prev) => newBox); //문제를 구성해주고
      setIndex((index) => newIndex);
    }
  };

  return (
    <Container>
      <Edge>
        <IconContainer
          style={{
            transform: [
              {
                scale: scaleOne,
              },
            ],
          }}
        >
          <Ionicons
            name={box.length === 2 && box[0].name}
            size={78}
            color="white"
          />
        </IconContainer>
      </Edge>
      <Center>
        <WordBox
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Word>{icons[index].label}</Word>
        </WordBox>
        <StateCard
          style={{
            transform: [{ scale: scaleCorrect }],
          }}
        >
          <Ionicons name="checkbox-outline" size={250} color={GREEN} />
          <CardText>Correct!</CardText>
        </StateCard>
        <StateCard
          style={{
            transform: [{ scale: scaleWrong }],
          }}
        >
          <Ionicons name="alert-circle-outline" size={250} color={RED} />
          <CardText>Wrong..</CardText>
        </StateCard>
      </Center>
      <Edge>
        <IconContainer
          style={{
            transform: [{ scale: scaleTwo }],
          }}
        >
          <Ionicons
            name={box.length === 2 && box[1].name}
            size={78}
            color="white"
          />
        </IconContainer>
      </Edge>
    </Container>
  );
}
