import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

interface GoalsChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  barWidth?: number;
  spacing?: number;
  color?: string;
}

const GoalsChart: React.FC<GoalsChartProps> = ({
  data,
  labels = [],
  height = 140,
  barWidth = 20,
  spacing = 16,
  color = "#3F3DFF",
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartWidth = data.length * (barWidth + spacing);
  const maxValue = Math.max(...data, 1); // evitar divisão por zero
  const scaleY = (value: number) => (value / maxValue) * height;

  const chartPaddingTop = 30;
  const chartPaddingBottom = 30;
  const totalHeight = height + chartPaddingTop + chartPaddingBottom;

  const safeLabels = labels.length === data.length ? labels : Array(data.length).fill("");

  return (
    <View style={styles.chartContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={chartWidth} height={totalHeight}>
          {data.map((value, index) => {
            const x = index * (barWidth + spacing);
            const barHeight = scaleY(value);
            const y = totalHeight - chartPaddingBottom - barHeight;

            return (
              <React.Fragment key={index}>
                {selectedIndex === index && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={Math.max(y - 10, 12)}
                    fill="#00FF00"
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {`+${value}`}
                  </SvgText>
                )}

                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx={4}
                  onPress={() =>
                    setSelectedIndex(selectedIndex === index ? null : index)
                  }
                />

                <SvgText
                  x={x + barWidth / 2}
                  y={totalHeight - 10}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="400"
                  textAnchor="middle"
                >
                  {safeLabels[index]}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GoalsChart;
