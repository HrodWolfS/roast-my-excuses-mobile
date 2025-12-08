import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  SafeAreaView,
  ImageBackground,
  Platform,
  ScrollView,
  ActivityIndicator, 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux'; 
//import { login } from '../reducers/user'; 

export default function LoginScreen({ navigation }) {

  const dispatch = useDispatch(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {

    setError(null);

    if (email.length === 0 || password.length === 0) {
      setError("Nan, t'as vraiment pas le droit d'avoir autant la flemme.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("On a pas les yeux en face des trous?");
      return;
    }

    setIsLoading(true);

    fetch('http://localhost3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
          console.log('Connexion réussie ! Token :', data.token);
          dispatch(login({ username: data.username, token: data.token }));
          setEmail('');
          setPassword('');
          setIsLoading(false);
          navigation.navigate('TabNavigator');
        } else {
          setIsLoading(false);
          setError(data.error || "Email ou mot de passe incorrect.");
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        setError("Impossible de contacter le serveur. Vérifie ta connexion.");
      });
  };
  
  let submitContent;

  if (isLoading) {
    submitContent = <ActivityIndicator size="small" color="#0f172a" />;
  } else {
    submitContent = <Text style={styles.loginButtonText}>Se connecter</Text>;
  }

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      resizeMode="cover" 
      style={styles.container}
    >
      <SafeAreaView style={styles.contentContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.form}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Image source={require('../assets/logo.png')} style={styles.logo}/>
              <Text style={styles.title}>RoastMyExcuses</Text>
              <Text style={styles.subtitle}>La procrastination s'arrête ici.</Text>
            </View>

            {error && <Text style={{color: 'red', textAlign: 'center', marginBottom: 10}}>{error}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputEmail]} 
              placeholder="bn.email@flemme.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="1234jesuisunmongol"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true} 
            />

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>
                Mot de passe oublié ? Tant pis pour toi. Vilain. 
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.loginButtonContainer} 
                onPress={handleLogin}
                disabled={isLoading} 
            >
              <LinearGradient
                colors={['#bef264', '#22d3ee']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {submitContent}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.createAccountText}>CRÉER UN COMPTE</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
} 

const styles = StyleSheet.create({

  // 1.CONTENEUR GLOBAL
  container: {
    flex: 1, 
  },
  contentContainer: {
    flex: 1,
  },

  // 2.LE HEADER
  header: {
    alignItems: 'center', 
    marginBottom: 40, 
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 10,
    marginBottom: 10,
    tintColor: '#bef264', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#22d3ee', 
  },

  // 3.FORMULAIRE
  form: {
    flex: 1,
    width: '100%', 
  },
  label: {
    color: '#94a3b8',
    marginBottom: 8, 
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1e293b', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20, 
    color: '#fff', 
    borderWidth: 1, 
    borderColor: '#334155', 
  },
  inputEmail: {
    borderColor: '#bef264', 
    shadowColor: '#bef264', 
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, 
  },
  forgotPassword: {
    color: '#38bdf8',
    textAlign: 'right', 
    fontSize: 12,
    marginBottom: 30,
  },

  // 4.BOUTONS 
  loginButtonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden', 
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 15, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1, 
  },

  // 5.FOOTER 
  footer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#94a3b8',
  },
  createAccountText: {
    color: '#bef264', 
    fontWeight: 'bold',
  },
});