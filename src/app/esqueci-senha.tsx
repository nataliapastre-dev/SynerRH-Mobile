import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function redefinirSenha() {
    const emailLimpo = email.trim().toLowerCase();

    if (
      !emailLimpo ||
      !novaSenha.trim() ||
      !confirmarSenha.trim()
    ) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);

    if (!emailValido) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
      );
      return;
    }

    const temMinimo8 = novaSenha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(novaSenha);
    const temMinuscula = /[a-z]/.test(novaSenha);
    const temNumero = /[0-9]/.test(novaSenha);
    const temEspecial = /[^A-Za-z0-9]/.test(novaSenha);

    if (
      !temMinimo8 ||
      !temMaiuscula ||
      !temMinuscula ||
      !temNumero ||
      !temEspecial
    ) {
      Alert.alert(
        "Senha inválida",
        "A nova senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert(
        "Senhas diferentes",
        "A nova senha e a confirmação precisam ser iguais."
      );
      return;
    }

    try {
      setCarregando(true);

      const usuarioSalvo = await AsyncStorage.getItem(
        "@synerrh_usuario"
      );

      if (!usuarioSalvo) {
        Alert.alert(
          "Conta não encontrada",
          "Nenhum usuário foi cadastrado ainda."
        );
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.email !== emailLimpo) {
        Alert.alert(
          "E-mail não encontrado",
          "O e-mail informado não corresponde à conta cadastrada."
        );
        return;
      }

      const usuarioAtualizado = {
        ...usuario,
        senha: novaSenha,
      };

      await AsyncStorage.setItem(
        "@synerrh_usuario",
        JSON.stringify(usuarioAtualizado)
      );

      await AsyncStorage.removeItem(
        "@synerrh_sessao"
      );

      console.log(
        "Senha atualizada com sucesso."
      );

      Alert.alert(
        "Senha redefinida!",
        "Sua nova senha foi salva com sucesso."
      );

      router.replace("/login");
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível redefinir sua senha. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#334155"
          />

          <Text style={styles.backText}>
            Voltar para o login
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="key-outline"
              size={34}
              color="#2563EB"
            />
          </View>

          <Text style={styles.title}>
            Redefinir senha
          </Text>

          <Text style={styles.subtitle}>
            Informe o e-mail da sua conta e escolha uma nova senha.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            E-mail
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!carregando}
            />
          </View>

          <Text style={styles.label}>
            Nova senha
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite sua nova senha"
              placeholderTextColor="#94A3B8"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!mostrarNovaSenha}
              editable={!carregando}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarNovaSenha(
                  !mostrarNovaSenha
                )
              }
              activeOpacity={0.7}
              disabled={carregando}
            >
              <Ionicons
                name={
                  mostrarNovaSenha
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.passwordHint}>
            A senha deve conter pelo menos 8 caracteres, uma letra maiúscula,
            uma letra minúscula, um número e um caractere especial.
          </Text>

          <Text style={styles.label}>
            Confirmar nova senha
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite novamente a nova senha"
              placeholderTextColor="#94A3B8"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmacao}
              editable={!carregando}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmacao(
                  !mostrarConfirmacao
                )
              }
              activeOpacity={0.7}
              disabled={carregando}
            >
              <Ionicons
                name={
                  mostrarConfirmacao
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.buttonDisabled,
            ]}
            onPress={redefinirSenha}
            activeOpacity={0.85}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando
                ? "Salvando..."
                : "Redefinir senha"}
            </Text>

            {!carregando && (
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          SynerRH Mobile • Gestão de Pessoas
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 35,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 28,
    gap: 7,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#64748B",
    maxWidth: 320,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },

  passwordHint: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginTop: -8,
    marginBottom: 18,
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
  },
});