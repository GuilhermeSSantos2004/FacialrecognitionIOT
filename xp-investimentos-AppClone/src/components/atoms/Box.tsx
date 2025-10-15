import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface BoxProps {
  withBorder?: boolean;
  children: React.ReactNode;
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>; // novo prop
}

const screenWidth = Dimensions.get('window').width;

const Box: React.FC<BoxProps> = ({
  withBorder = false,
  children,
  width,
  height,
  backgroundColor = '#080808',
  style,
}) => {
  const boxStyle: ViewStyle = {
    width: width ?? screenWidth * 0.95,
    height,
    backgroundColor,
  };

  return (
    <View style={[styles.box, boxStyle, withBorder && styles.withBorder, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 16,
    borderRadius: 14,
    marginLeft: 10,
  },
  withBorder: {
    borderWidth: 1.5,
    borderColor: '#362FFA',
  },
});

export default Box;
