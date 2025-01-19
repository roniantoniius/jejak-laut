import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, Animated, Image } from 'react-native';
import { useRef, useState } from 'react';
import { TagProvider } from '../../components/TagContext';
import { NoteProvider } from '@/components/NoteContext';
import { PopupCard } from '@/components/PopupCard';
import { EditTagsModal } from '@/components/EditTagsModal';
import { GuideModal } from '@/components/GuideModal';
import React from 'react';
import { TutorMarkdownModal } from '@/components/TutorMarkdown';

export default function TabLayout() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const [isEditTagsVisible, setEditTagsVisible] = useState(false);
  const [isGuideVisible, setGuideVisible] = useState(false);
  const [isTutorMarkdownVisible, setTutorMarkdownVisible] = useState(false);
  
  const animateIcon = (focused: boolean) => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const styles = {
    guideButton: {
      backgroundColor: '#4CAF50', // Green button for guide
      padding: 12,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginVertical: 5,
    },
    markdownButton: {
      backgroundColor: '#f0b041',
      padding: 12,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginVertical: 5,
    },
    iconText: {
      fontSize: 24,
      color: 'white',
      fontFamily: 'Montserrat-Bold',
    },
    addButton: {
      backgroundColor: '#052844',
      padding: 12,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginVertical: 5,
    },
    addButtonText: {
      fontFamily: 'Montserrat-Bold',
      color: 'white',
      fontSize: 16,
    },
  };

  return (
    <NoteProvider>
      <TagProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#052844',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerShadowVisible: true,
            headerTintColor: '#052844',
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
            },
            tabBarStyle: {
              backgroundColor: 'white',
              height: 70, 
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
            },
            tabBarShowLabel: false,
            animation: 'shift',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: '',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'home-sharp' : 'home-outline'}
                  size={24}
                  style={{ marginBottom: -23 }}
                  color={color}
                />
              ),
              headerTitleStyle: {
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
              },
              headerRight: () => (
                <PopupCard
                  icon={<Text style={styles.iconText}>?</Text>}
                  title="Menu Jejak Laut"
                  buttons={[
                    {
                      label: 'Panduan',
                      onPress: () => setGuideVisible(true),
                      style: styles.guideButton,
                      textStyle: styles.addButtonText,
                    },
                    {
                      label: 'Tutorial Markdown',
                      onPress: () => setTutorMarkdownVisible(true),
                      style: styles.markdownButton,
                      textStyle: styles.addButtonText,
                    },
                    {
                      label: 'Ubah Kategori',
                      onPress: () => setEditTagsVisible(true),
                      style: styles.addButton,
                      textStyle: styles.addButtonText,
                    },
                  ]}
                />
              ),
              headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}>
                  <Image
                    source={require('../../assets/images/dark-nobg.png')} 
                    style={{ width: 45, height: 45 }}
                  />
                  <Text style={{ 
                    marginLeft: 8, 
                    fontSize: 30, 
                    fontFamily: 'Montserrat-Bold', 
                    color: '#052844',
                  }}>
                    Jejak Laut AI
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="newnote"
            options={{
              title: 'Catatan Baru!',
              headerTitleStyle: {
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
              },
              tabBarIcon: ({ focused }) => {
                animateIcon(focused);
                return (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.2,
                      shadowRadius: 5,
                      elevation: 5,
                    }}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: scaleAnim }],
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: focused ? '#052844' : 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: focused ? 0 : 1,
                        borderColor: '#052844',
                      }}
                    >
                      <Text
                        style={{
                          color: focused ? 'white' : '#052844',
                          fontSize: 30,
                        }}
                      >
                        +
                      </Text>
                    </Animated.View>
                  </View>
                );
              },
              tabBarItemStyle: {
                height: 0,
              },
            }}
          />
          <Tabs.Screen
            name="konfigurasi"
            options={{
              title: 'Konfigurasi Jejak Laut',
              headerTitleStyle: {
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
              },
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'settings' : 'settings-outline'}
                  size={24}
                  color={color}
                  style={{ marginBottom: -23 }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="note/[id]"
            options={{
              title: '',
              headerTitleStyle: {
                fontSize: 24,
                fontFamily: 'Montserrat-Bold',
              },
              
              tabBarStyle: { display: 'none' },
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
              headerLeft: ({ tintColor }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Ionicons
                    name="arrow-back"
                    size={35}
                    color={tintColor || '#052844'}
                    onPress={() => router.back()}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 24,
                      color: tintColor || '#052844',
                      fontFamily: 'Montserrat-Bold',
                    }}
                    onPress={() => router.back()}
                  >
                    Kembali
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="pilihlokasi"
            options={{
              title: '',
              headerTitleStyle: {
                fontSize: 24,
                fontFamily: 'Montserrat-Bold',
              },
              
              tabBarStyle: { display: 'none' },
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
              headerLeft: ({ tintColor }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Ionicons
                    name="arrow-back"
                    size={35}
                    color={tintColor || '#052844'}
                    onPress={() => router.back()}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 24,
                      color: tintColor || '#052844',
                      fontFamily: 'Montserrat-Bold',
                    }}
                    onPress={() => router.back()}
                  >
                    Kembali
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="edit/[id]"
            options={{
              title: '',
              headerTitleStyle: {
                fontSize: 24,
                fontFamily: 'Montserrat-Bold',
              },
              
              tabBarStyle: { display: 'none' },
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
              headerLeft: ({ tintColor }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Ionicons
                    name="arrow-back"
                    size={35}
                    color={tintColor || '#052844'}
                    onPress={() => router.back()}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 24,
                      color: tintColor || '#052844',
                      fontFamily: 'Montserrat-Bold',
                    }}
                    onPress={() => router.back()}
                  >
                    Kembali
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="periksalokasi/[id]"
            options={{
              title: '',
              headerTitleStyle: {
                fontSize: 24,
                fontFamily: 'Montserrat-Bold',
              },
              
              tabBarStyle: { display: 'none' },
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
              headerLeft: ({ tintColor }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Ionicons
                    name="arrow-back"
                    size={35}
                    color={tintColor || '#052844'}
                    onPress={() => router.back()}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 24,
                      color: tintColor || '#052844',
                      fontFamily: 'Montserrat-Bold',
                    }}
                    onPress={() => router.back()}
                  >
                    Kembali
                  </Text>
                </View>
              ),
            }}
          />
        </Tabs>
      </TagProvider>
    </NoteProvider>
  );
}