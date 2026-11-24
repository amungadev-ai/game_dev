import React, { useState } from 'react';
import { Pressable, StatusBar, TextInput, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Courtyard from './Courtyard';
import { initialState, advance } from '../../packages/game-core/discovery.mjs';

export default function App() { return <SafeAreaProvider><Game /></SafeAreaProvider>; }
function Game() {
  const [show3d,setShow3d]=useState(false);
  const [host,setHost]=useState('192.168.0.101');const [lanUrl,setLanUrl]=useState<string|undefined>();
  const [state, setState] = useState(initialState);
  if(show3d)return <SafeAreaView style={styles.safe}><Courtyard url={lanUrl} onBack={()=>setShow3d(false)}/></SafeAreaView>;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.page}>
        <Text style={styles.eyebrow}>TREASURE HUNT • DEVELOPMENT BUILD</Text>
        <Text style={styles.title}>The Forgotten Wall</Text>
        <Text style={styles.subtitle}>Every discovery opens another possibility.</Text>
        <View style={styles.scene}>
          <Text style={styles.symbol}>{state.revealed ? '✧' : state.hasLamp ? '◈' : '◇'}</Text>
          <Text style={styles.sceneTitle}>{state.revealed ? 'A hidden route!' : state.hasLamp ? 'The Waylamp is yours' : 'An unusual wall'}</Text>
          <Text style={styles.body}>{state.revealed ? 'The light reveals a secret passage. Your discovery is recorded for this session.' : state.hasLamp ? 'Return to the familiar wall and uncover its secret.' : 'Strange markings hint that there is more here than meets the eye.'}</Text>
        </View>
        <Pressable accessibilityRole="button" style={({pressed}) => [styles.button, pressed && {opacity:0.8}]} onPress={() => setState(s => advance(s))}>
          <Text style={styles.buttonText}>{state.revealed ? 'Restart experiment' : state.hasLamp ? 'Reveal hidden markings' : 'Discover the Waylamp'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={()=>{setLanUrl(undefined);setShow3d(true);}}><Text style={styles.buttonText}>Enter Lantern Quay (3D)</Text></Pressable>
        <TextInput value={host} onChangeText={setHost} autoCapitalize="none" autoCorrect={false} style={{color:"white",borderWidth:1,borderColor:"#526A6B",padding:10}} placeholder="Laptop LAN IP"/><Pressable style={styles.button} onPress={()=>{setLanUrl("http://"+host.trim()+":2567");setShow3d(true);}}><Text style={styles.buttonText}>Join local multiplayer</Text></Pressable>
        <Text style={styles.footer}>Prototype 01 · Interaction logic · No accounts or network</Text>
      </View>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#101E28'},
 page:{flex:1,padding:24,justifyContent:'center',gap:16},
 eyebrow:{color:'#E7BC72',fontSize:11,letterSpacing:1.2,fontWeight:'700'},
 title:{fontSize:34,fontWeight:'800',color:'#FFF6E5'},
 subtitle:{color:'#B9CCC8',fontSize:16},
 scene:{minHeight:230,borderRadius:20,borderWidth:1,borderColor:'#526A6B',backgroundColor:'#20353D',padding:24,justifyContent:'center',alignItems:'center',gap:12},
 symbol:{fontSize:64,color:'#E7BC72'},
 sceneTitle:{fontSize:22,color:'#FFF6E5',fontWeight:'700',textAlign:'center'},
 body:{fontSize:16,color:'#CCDAD6',textAlign:'center',lineHeight:23},
 button:{backgroundColor:'#E7BC72',borderRadius:12,padding:17,alignItems:'center'},
 buttonText:{color:'#17252B',fontSize:16,fontWeight:'700'},
 footer:{color:'#A0B3B2',fontSize:12,textAlign:'center'}
});

