import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CurrencyData } from '@/services/currency';
import MiniChart from './MiniChart';

interface CurrencyCardProps {
  data: CurrencyData;
  isCrypto: boolean;
  onPress: () => void;
}

const CRYPTO_ICONS: Record<string, { bg: string; text: string }> = {
  BTC: { bg: '#F7931A', text: '₿' },
  ETH: { bg: '#627EEA', text: 'Ξ' },
  SOL: { bg: '#9945FF', text: 'S' },
  XRP: { bg: '#346AA9', text: 'X' },
  BNB: { bg: '#F3BA2F', text: 'B' },
  LTC: { bg: '#BFBBBB', text: 'Ł' },
};

const FIAT_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
};

const FIAT_NAMES: Record<string, string> = {
  USD: 'Dólar Americano',
  EUR: 'Euro',
  GBP: 'Libra Esterlina',
  JPY: 'Iene Japonês',
  CAD: 'Dólar Canadense',
  AUD: 'Dólar Australiano',
};

function formatPrice(bid: string, code: string): string {
  const num = parseFloat(bid);
  if (isNaN(num)) return bid;
  if (num >= 1000) {
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (num < 1) {
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 5, maximumFractionDigits: 5 })}`;
  }
  return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`;
}

export default function CurrencyCard({ data, isCrypto, onPress }: CurrencyCardProps) {
  const isPositive = parseFloat(data.pctChange) >= 0;
  const changeColor = isPositive ? '#22C55E' : '#EF4444';
  const sign = isPositive ? '+' : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.topRow}>
        {isCrypto ? (
          <View style={[styles.cryptoIcon, { backgroundColor: CRYPTO_ICONS[data.code]?.bg ?? '#555' }]}>
            <Text style={styles.cryptoIconText}>{CRYPTO_ICONS[data.code]?.text ?? data.code[0]}</Text>
          </View>
        ) : (
          <Text style={styles.fiatFlag}>{FIAT_FLAGS[data.code] ?? '🏳️'}</Text>
        )}
        <Text style={styles.code}>{data.code}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {isCrypto ? data.name.split('/')[0] : FIAT_NAMES[data.code] ?? data.name}
      </Text>

      <Text style={styles.price}>{formatPrice(data.bid, data.code)}</Text>

      <View style={styles.bottomRow}>
        <Text style={[styles.change, { color: changeColor }]}>
          {sign}{data.pctChange}%
        </Text>
        <MiniChart symbol={data.code} isPositive={isPositive} width={72} height={32} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#161B27',
    borderRadius: 16,
    padding: 14,
    margin: 5,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cryptoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cryptoIconText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  fiatFlag: {
    fontSize: 22,
    marginRight: 6,
  },
  code: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  name: {
    color: '#7A8499',
    fontSize: 11,
    marginBottom: 6,
    marginTop: 1,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});
