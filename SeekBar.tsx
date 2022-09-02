import { useState, useRef } from "react";
import {
  ViewStyle,
  StyleSheet,
  View,
  GestureResponderEvent,
} from "react-native";

type ProgressSeekBarProps = {
  progressHeight?: number;
  progressBackgroundColor?: string;
  progressColor?: string;
  thumbSize?: number;
  thumbColor?: string;
  thumbColorPressed?: string;
  min?: number;
  max?: number;
  progress?: number;
  style?: ViewStyle;
  onProgressChanged?: (value: number) => void;
  onStartTouch?: (value: number) => void;
  onStopTouch?: (value: number) => void;
};

const getPositionFromValue = (
  x: number,
  min: number,
  max: number,
  left: number,
  right: number
) => {
  if (max <= min) {
    return 0;
  }
  let position = left + ((right - left) * (x - min)) / (max - min);
  return position;
};

const ProgressSeekBar = (props: ProgressSeekBarProps) => {

  const {
    progressHeight = props.progressHeight ?? 4,
    progressBackgroundColor = props.progressBackgroundColor ?? "#666666",
    progressColor = props.progressColor ?? "#cccccc",
    thumbSize = props.thumbSize ?? 12,
    thumbColor = props.thumbColor ?? "#dddddd",
    thumbColorPressed = props.thumbColorPressed ?? "#eeeeee",
    min = props.min ?? 0,
    max = props.max ?? 100,
    progress = props.progress ?? 0,
  } = props;

  const containerHeight = Math.max(progressHeight, thumbSize) * 2;

  const styles = StyleSheet.create({
    container: {
      height: containerHeight,
      padding: progressHeight,
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    progressBackground: {
      height: progressHeight,
      borderRadius: progressHeight / 2,
      overflow: "hidden",
      backgroundColor: progressBackgroundColor,
    },
    innerProgressCompleted: {
      height: progressHeight,
      backgroundColor: progressColor,
    },
    progressThumb: {
      width: thumbSize,
      height: thumbSize,
      position: "absolute",
      backgroundColor: thumbColor,
      borderStyle: "solid",
      borderRadius: thumbSize / 2,
    },
  });

  const containerLeft = useRef(0);
  const progressLeft = useRef(0);
  const progressRight = useRef(0);

  const [value, setValue] = useState(progress);
  const [isPressed, setIsPressed] = useState(false);
  const [progressPosition, setProgressPosition] = useState(
    getPositionFromValue(
      progress,
      min,
      max,
      progressLeft.current,
      progressRight.current
    )
  );

  const setProgress = (value: number) => {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    let position = getPositionFromValue(
      value,
      min,
      max,
      progressLeft.current,
      progressRight.current
    );
    updatePosition(position);
  };

  const getPositionFromEvent = (event: GestureResponderEvent) => {
    let mX = event.nativeEvent.pageX;
    let position = mX - containerLeft.current;
    return position;
  };

  const updatePosition = (position: number, fromUser = false) => {
    // console.log("updatePosition: " + position);
    let newValue;
    if (position < progressLeft.current) {
      position = progressLeft.current;
      newValue = min;
    } else if (position > progressRight.current) {
      position = progressRight.current;
      newValue = max;
    } else {
      newValue =
        min +
        ((max - min) * (position - progressLeft.current)) /
          (progressRight.current - progressLeft.current);
    }

    setValue(newValue);
    setProgressPosition(position);

    if (fromUser && props.onProgressChanged !== undefined) {
      props.onProgressChanged(newValue);
    }
  };

  const onGrant = (event: GestureResponderEvent) => {
    // console.log("onGrant");
    let position = getPositionFromEvent(event);
    updatePosition(position, true);
    setIsPressed(true);

    if (props.onStartTouch !== undefined) {
      props.onStartTouch(value);
    }
  };

  const onMoving = (event: GestureResponderEvent) => {
    let position = getPositionFromEvent(event);
    updatePosition(position, true);
  };

  const onPressEnd = (event: GestureResponderEvent) => {
    // console.log("onPressEnd");
    let position = getPositionFromEvent(event);
    updatePosition(position, true);
    setIsPressed(false);

    if (props.onStopTouch !== undefined) {
      props.onStopTouch(value);
    }
  };

  return (
    <View
      style={[styles.container, props.style]}
      onLayout={(e) => {
        containerLeft.current = e.nativeEvent.layout.x;
        // console.log("onLayout_Container: " + containerLeft.current);
        setProgress(value);
      }}
      onStartShouldSetResponder={() => thumbSize > 0}
      onMoveShouldSetResponder={() => thumbSize > 0}
      onResponderGrant={(event) => onGrant(event)}
      onResponderMove={(event) => onMoving(event)}
      onResponderEnd={(event) => onPressEnd(event)}
    >
      <View
        style={styles.progressBackground}
        onLayout={(e) => {
          progressLeft.current = e.nativeEvent.layout.x;
          progressRight.current =
            progressLeft.current + e.nativeEvent.layout.width;
          // console.log(
          //   "onLayout_ProgressBkg: " + progressLeft + ", " + progressRight
          // );
        }}
      >
        <View
          style={[
            styles.innerProgressCompleted,
            {
              width: progressPosition - progressLeft.current,
              backgroundColor:
                progressColor || styles.innerProgressCompleted.backgroundColor,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.progressThumb,
          {
            left: progressPosition - thumbSize / 2,
            backgroundColor: isPressed ? thumbColorPressed : thumbColor,
          },
        ]}
      />
    </View>
  );
};

export default ProgressSeekBar;
