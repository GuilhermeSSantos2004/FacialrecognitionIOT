import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

interface CandleStickChartProps {
  data: { open: number; close: number; high?: number; low?: number }[]; // preço abertura, fechamento, máximo e mínimo
  height?: number;
  candleWidth?: number;
  spacing?: number;
}

const CandleStickChart: React.FC<CandleStickChartProps> = ({
  data,
  height = 200,
  candleWidth = 12,
  spacing = 4,
}) => {
  if (!data || data.length === 0) return null;

  // Largura total do gráfico
  const chartWidth = data.length * (candleWidth + spacing);

  // Encontra os valores mínimo e máximo para escalar o gráfico
  const allValues = data.flatMap(d => [
    d.open, 
    d.close, 
    d.high || Math.max(d.open, d.close), 
    d.low || Math.min(d.open, d.close)
  ]);
  const minPrice = Math.min(...allValues);
  const maxPrice = Math.max(...allValues);
  const padding = (maxPrice - minPrice) * 0.1;

  // Escala para converter preços em posições Y
  const scaleY = (price: number) => {
    const scaled = ((price - (minPrice - padding)) / ((maxPrice + padding) - (minPrice - padding))) * height;
    return height - scaled;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Svg width={chartWidth} height={height}>
          {data.map((item, index) => {
            const x = index * (candleWidth + spacing) + spacing / 2;
            const openY = scaleY(item.open);
            const closeY = scaleY(item.close);
            const highY = scaleY(item.high || Math.max(item.open, item.close));
            const lowY = scaleY(item.low || Math.min(item.open, item.close));

            const isGrowth = item.close >= item.open;
            const fillColor = isGrowth ? '#4CAF50' : '#FF3B30';
            const wickColor = isGrowth ? '#388E3C' : '#D32F2F';

            // Corpo da vela (entre abertura e fechamento)
            const candleHeight = Math.abs(closeY - openY);
            const candleY = Math.min(openY, closeY);

            // Se abertura e fechamento forem iguais, mostra uma linha
            const isDoji = item.open === item.close;

            return (
              <React.Fragment key={index}>
                {/* Pavio (linha superior/inferior) */}
                <Line
                  x1={x + candleWidth / 2}
                  y1={highY}
                  x2={x + candleWidth / 2}
                  y2={lowY}
                  stroke={wickColor}
                  strokeWidth={1}
                />
                
                {/* Corpo da vela */}
                {isDoji ? (
                  <Line
                    x1={x}
                    y1={openY}
                    x2={x + candleWidth}
                    y2={openY}
                    stroke={wickColor}
                    strokeWidth={1}
                  />
                ) : (
                  <Rect
                    x={x}
                    y={candleY}
                    width={candleWidth}
                    height={Math.max(1, candleHeight)}
                    fill={fillColor}
                    rx={2}
                    ry={2}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default CandleStickChart;