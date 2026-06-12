import { router } from 'expo-router';
import { Bell, ChevronRight, LogOut, Settings, Shield, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_ITEMS = [
  { icon: Bell, label: 'Notificações' },
  { icon: Shield, label: 'Segurança' },
  { icon: Settings, label: 'Configurações' },
];

export default function ProfileScreen() {
  function handleLogout() {
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Perfil</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User color="#3B82F6" size={40} />
          </View>
          <Text style={styles.userName}>Emily Svensson</Text>
          <Text style={styles.userEmail}>emilys@example.com</Text>
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map(({ icon: Icon, label }) => (
            <TouchableOpacity key={label} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}>
                <Icon color="#3B82F6" size={18} />
              </View>
              <Text style={styles.menuLabel}>{label}</Text>
              <ChevronRight color="#4A5568" size={16} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color="#EF4444" size={18} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#161B27',
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: '#7A8499',
    fontSize: 13,
  },
  menuSection: {
    gap: 8,
    marginBottom: 'auto',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B27',
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E2A42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A0F0F',
    borderRadius: 12,
    padding: 15,
    gap: 10,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B1A1A',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
