import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MiniChartProps {
  symbol: string;
  isPositive: boolean;
  width?: number;
  height?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePoints(symbol: string, count: number, width: number, height: number) {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = seededRandom(seed);
  const values: number[] = [];
  let val = 0.5;
  for (let i = 0; i < count; i++) {
    val += (rand() - 0.5) * 0.18;
    val = Math.max(0.05, Math.min(0.95, val));
    values.push(val);
  }
  return values.map((v, i) => ({
    x: (i / (count - 1)) * width,
    y: height - v * height,
  }));
}

export default function MiniChart({ symbol, isPositive, width = 80, height = 36 }: MiniChartProps) {
  const color = isPositive ? '#22C55E' : '#EF4444';
  const gradientId = `grad_${symbol}`;

  const points = useMemo(
    () => generatePoints(symbol, 20, width, height),
    [symbol, width, height]
  );

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const fillPath =
    d +
    ` L${width},${height} L0,${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={fillPath} fill={`url(#${gradientId})`} />
      <Path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
