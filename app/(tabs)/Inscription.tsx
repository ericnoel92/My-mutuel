import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const API_URL = 'http://192.168.1.80:3000'; // Assurez-vous que l'API est accessible

const AuthPage: React.FC = () => {
  const [nom, setNom] = useState<string>('');
  const [prenom, setPrenom] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true); // Pour basculer entre connexion et inscription
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Pour vérifier si l'utilisateur est connecté

  // Basculer entre le formulaire de connexion et d'inscription
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowResetForm(false); // Réinitialiser l'état du formulaire de réinitialisation
  };

  // Gérer la soumission du formulaire d'inscription ou de connexion
  const handleSubmit = async () => {
    if (email && motDePasse) {
      const endpoint = isLogin ? `${API_URL}/connexion` : `${API_URL}/utilisateurs`;
      const bodyData = isLogin
        ? { email, mot_de_passe: motDePasse }
        : { nom, prenom, email, mot_de_passe: motDePasse };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });

        if (response.ok) {
          if (isLogin) {
            Alert.alert('Succès', 'Connexion réussie.');
            setIsLoggedIn(true); // Utilisateur connecté
          } else {
            setNom('');
            setPrenom('');
            setEmail('');
            setMotDePasse('');
            Alert.alert('Succès', 'Inscription réussie.');
          }
          // Réinitialiser les champs après succès
          setEmail('');
          setMotDePasse('');
          setNom('');
          setPrenom('');
        } else {
          const errorData = await response.json();
          Alert.alert('Erreur', errorData.error || 'Une erreur est survenue.');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la requête.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

  // Gérer la demande de réinitialisation de mot de passe
  const handleResetRequest = async () => {
    if (resetEmail) {
      try {
        const response = await fetch(`${API_URL}/motdepasse/oublié`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail }),
        });

        if (response.ok) {
          Alert.alert('Succès', 'Un email de réinitialisation a été envoyé.');
        } else {
          const errorData = await response.json();
          Alert.alert('Erreur', errorData.error || 'Une erreur est survenue.');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la demande de réinitialisation.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
    }
  };

  return (
    <View style={styles.container}>
      {isLogin && !isLoggedIn ? (
        <>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />
          <Button title="Se connecter" onPress={handleSubmit} disabled={!email || !motDePasse} />
        </>
      ) : isLogin && isLoggedIn ? (
        <>
          <Text style={styles.title}>Mettre à jour votre compte</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />
          <Button title="Mettre à jour" onPress={handleSubmit} disabled={!nom && !prenom && !motDePasse} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Inscription</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />
          <Button title="S'inscrire" onPress={handleSubmit} disabled={!nom || !prenom || !email || !motDePasse} />
        </>
      )}

      <Button
        title={isLogin ? "Inscription" : "se connecter"}
        onPress={toggleForm}
      />

      <Button
        title={showResetForm ? "Annuler" : "Mot de passe oublié ?"}
        onPress={() => setShowResetForm(!showResetForm)}
      />

      {showResetForm && (
        <View style={styles.resetContainer}>
          <Text style={styles.title}>Réinitialisation du Mot de Passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Email pour réinitialisation"
            value={resetEmail}
            onChangeText={setResetEmail}
            keyboardType="email-address"
          />
          <Button title="Envoyer Email de Réinitialisation" onPress={handleResetRequest} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resetContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default AuthPage;
