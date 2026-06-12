import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { fetchQuotes, CurrencyData, CurrencyMap } from '@/services/currency';
import CurrencyCard from '@/components/CurrencyCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const CRYPTO_CODES = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'LTC'];
const FIAT_CODES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const KEY_MAP: Record<string, string> = {
  BTC: 'BTCBRL', ETH: 'ETHBRL', SOL: 'SOLBRL', XRP: 'XRPBRL',
  BNB: 'BNBBRL', LTC: 'LTCBRL', USD: 'USDBRL', EUR: 'EURBRL',
  GBP: 'GBPBRL', JPY: 'JPYBRL', CAD: 'CADBRL', AUD: 'AUDBRL',
};

export default function HomeScreen() {
  const [quotes, setQuotes] = useState<CurrencyMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function loadQuotes(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar cotações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadQuotes(true);
  }, []);

  function getCurrencyData(code: string): CurrencyData | null {
    return quotes[KEY_MAP[code]] ?? null;
  }

  function handleCardPress(code: string) {
    const data = getCurrencyData(code);
    if (!data) return;
    router.push({ pathname: '/details', params: { data: JSON.stringify(data) } });
  }

  function renderGrid(codes: string[]) {
    const rows: string[][] = [];
    for (let i = 0; i < codes.length; i += 2) {
      rows.push(codes.slice(i, i + 2));
    }
    return rows.map((row, ri) => (
      <View key={ri} style={styles.row}>
        {row.map(code => {
          const data = getCurrencyData(code);
          if (!data) {
            return (
              <View key={code} style={[styles.cardPlaceholder]}>
                <ActivityIndicator color="#3B82F6" size="small" />
              </View>
            );
          }
          return (
            <CurrencyCard
              key={code}
              data={data}
              isCrypto={CRYPTO_CODES.includes(code)}
              onPress={() => handleCardPress(code)}
            />
          );
        })}
      </View>
    ));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyCurrency</Text>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Bell color="#FFFFFF" size={22} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Search color="#5A6478" size={16} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Moeda (ex: EURBRL)"
          placeholderTextColor="#5A6478"
          editable={false}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#3B82F6" size="large" />
          <Text style={styles.loadingText}>Carregando cotações...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadQuotes()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
        >
          <Text style={styles.sectionTitle}>Principais Cotacoes</Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Crypto</Text>
            <Text style={styles.periodLabel}>24h</Text>
          </View>
          {renderGrid(CRYPTO_CODES)}

          <View style={[styles.sectionHeader, { marginTop: 16 }]}>
            <Text style={styles.sectionLabel}>Fiat</Text>
            <Text style={styles.periodLabel}>24h</Text>
          </View>
          {renderGrid(FIAT_CODES)}

          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B27',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#2A3148',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#7A8499',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  periodLabel: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  cardPlaceholder: {
    flex: 1,
    backgroundColor: '#161B27',
    borderRadius: 16,
    margin: 5,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
