import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CurrencyData } from '@/services/currency';
import { SafeAreaView } from 'react-native-safe-area-context';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function DetailChart({ data, width = 320, height = 130 }: { data: CurrencyData; width?: number; height?: number }) {
  const isPositive = parseFloat(data.pctChange) >= 0;
  const color = isPositive ? '#22C55E' : '#EF4444';

  const points = useMemo(() => {
    const seed = data.code.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = seededRandom(seed);
    const count = 48;
    const values: number[] = [];
    let val = 0.6;
    for (let i = 0; i < count; i++) {
      val += (rand() - 0.495) * 0.12;
      val = Math.max(0.05, Math.min(0.95, val));
      values.push(val);
    }
    return values.map((v, i) => ({
      x: (i / (count - 1)) * width,
      y: height - v * (height * 0.75) - height * 0.1,
    }));
  }, [data.code, width, height]);

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const fill = d + ` L${width},${height} L0,${height} Z`;

  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  return (
    <View style={[chartStyles.wrapper, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.25" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={fill} fill="url(#cg)" />
        <Path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={[chartStyles.yLabel, { top: minY - 2 }]}>{parseFloat(data.high).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
      <Text style={[chartStyles.yLabel, { top: maxY - 2 }]}>{parseFloat(data.low).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    left: 4,
    color: '#7A8499',
    fontSize: 10,
  },
});

function formatBRL(val: string): string {
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`;
}

function formatDate(timestamp: string): string {
  const ts = parseInt(timestamp, 10);
  if (!ts) return timestamp;
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function DetailsScreen() {
  const params = useLocalSearchParams<{ data: string }>();
  const data: CurrencyData | null = useMemo(() => {
    try {
      return params.data ? JSON.parse(params.data) : null;
    } catch {
      return null;
    }
  }, [params.data]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Dados não encontrados</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backPill}>
            <Text style={styles.backPillText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPositive = parseFloat(data.pctChange) >= 0;
  const changeColor = isPositive ? '#22C55E' : '#EF4444';
  const sign = isPositive ? '+' : '';
  const pairName = data.name;

  const detailRows: { label: string; value: string; valueColor?: string }[] = [
    { label: 'Alta (high):', value: formatBRL(data.high) },
    { label: 'Baixa (low):', value: formatBRL(data.low) },
    { label: 'Variacao (varBid):', value: formatBRL(data.varBid), valueColor: changeColor },
    { label: 'Variacao % (pctChange):', value: `${sign}${data.pctChange}%`, valueColor: changeColor },
    { label: 'Compra (bid):', value: formatBRL(data.bid) },
    { label: 'Venda (ask):', value: formatBRL(data.ask) },
    { label: 'Ultima Atualizacao:', value: formatDate(data.timestamp) },
    { label: 'Timestamp:', value: data.timestamp },
  ];

  const bid = parseFloat(data.bid);
  const priceDisplay = bid >= 1000
    ? bid.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : bid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 5 });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft color="#3B82F6" size={28} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerCode}>{data.code}/{data.codein}</Text>
          <Text style={styles.headerName}>{pairName}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>
            {data.code} 1 = R${priceDisplay}
          </Text>

          <View style={styles.periodRow}>
            <TouchableOpacity style={styles.periodBtn}>
              <Text style={styles.periodBtnText}>24h</Text>
              <ChevronDown color="#FFFFFF" size={14} />
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <DetailChart data={data} width={340} height={130} />
          </View>

          <View style={[styles.variationBar, { backgroundColor: isPositive ? '#14532D' : '#450A0A' }]}>
            <Text style={styles.variationLabel}>Variação</Text>
            <Text style={[styles.variationValue, { color: changeColor }]}>
              {sign}{data.pctChange}%{'  '}{sign}{formatBRL(data.varBid)}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          {detailRows.map((row, i) => (
            <View
              key={row.label}
              style={[styles.detailRow, i < detailRows.length - 1 && styles.detailRowBorder]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={[styles.detailValue, row.valueColor ? { color: row.valueColor } : null]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Adicionar aos Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
            <Text style={styles.actionBtnText}>Criar Alerta</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  backPill: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backPillText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
  },
  headerCode: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  headerName: {
    color: '#7A8499',
    fontSize: 12,
    marginTop: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  priceCard: {
    backgroundColor: '#161B27',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  priceLabel: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  periodRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2539',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 4,
  },
  periodBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  variationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  variationLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  variationValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: '#161B27',
    borderRadius: 20,
    padding: 4,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E2539',
  },
  detailLabel: {
    color: '#7A8499',
    fontSize: 13,
    flex: 1,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: '#1E3A5F',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
