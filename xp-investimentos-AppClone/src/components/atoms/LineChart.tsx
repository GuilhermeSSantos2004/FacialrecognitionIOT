import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Svg, { Polyline, Circle, Text as SvgText } from "react-native-svg";

interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  spacing?: number;
  strokeColor?: string;
  pointColor?: string;
  strokeWidth?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  labels = [],
  height = 140,
  spacing = 40,
  strokeColor = "#3F3DFF",
  pointColor = "#3F3DFF",
  strokeWidth = 2,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartWidth = data.length * spacing;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  // Adicionamos margem vertical para melhor visualização
  const margin = range * 0.2;
  const adjustedMax = maxValue + margin;
  const adjustedMin = Math.max(0, minValue - margin);

  const scaleY = (value: number) => {
    return height - ((value - adjustedMin) / (adjustedMax - adjustedMin)) * height;
  };

  // Altura extra para tooltip e labels
  const chartPaddingTop = 20;
  const chartPaddingBottom = 40;
  const totalHeight = height + chartPaddingTop + chartPaddingBottom;

  // Pontos para a linha
  const points = data.map((value, i) => {
    const x = i * spacing + spacing/2;
    const y = scaleY(value) + chartPaddingTop;
    return `${x},${y}`;
  });

  return (
    <View style={styles.chartContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing/2 }}
      >
        <Svg width={chartWidth} height={totalHeight}>
          {/* Linha conectando os pontos */}
          <Polyline
            points={points.join(" ")}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* Pontos e tooltips */}
          {data.map((value, index) => {
            const cx = index * spacing + spacing/2;
            const cy = scaleY(value) + chartPaddingTop;

            return (
              <React.Fragment key={index}>
                {/* Tooltip */}
                {selectedIndex === index && (
                  <SvgText
                    x={cx}
                    y={Math.max(cy - 12, chartPaddingTop + 10)}
                    fill="#00FF00"
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {`R$ ${value.toFixed(2)}`}
                  </SvgText>
                )}

                {/* Ponto clicável */}
                <Circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={pointColor}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  onPress={() => setSelectedIndex(selectedIndex === index ? null : index)}
                />

                {/* Label abaixo do gráfico */}
                <SvgText
                  x={cx}
                  y={totalHeight - 15}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="400"
                  textAnchor="middle"
                >
                  {labels[index] ?? ""}
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
    width: "100%",
    backgroundColor: "#181A1D",
    paddingVertical: 10,
  },
});

export default LineChart;