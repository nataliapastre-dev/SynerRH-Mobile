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

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha o e-mail e a senha."
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
          "Nenhum usuário foi cadastrado ainda. Crie uma conta primeiro."
        );
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (
        usuario.email !== emailLimpo ||
        usuario.senha !== senha
      ) {
        Alert.alert(
          "Login inválido",
          "E-mail ou senha incorretos."
        );
        return;
      }

      const sessao = {
        nome: usuario.nome,
        email: usuario.email,
        logado: true,
      };

      await AsyncStorage.setItem(
        "@synerrh_sessao",
        JSON.stringify(sessao)
      );

      console.log("Sessão criada:", sessao);

      router.replace("/");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      Alert.alert(
        "Erro",
        "Não foi possível realizar o login. Tente novamente."
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
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="people"
              size={36}
              color="#2563EB"
            />
          </View>

          <Text style={styles.logoText}>
            SynerRH
          </Text>

          <Text style={styles.subtitle}>
            Gestão de pessoas mais simples, humana e inteligente.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            Bem-vindo(a)!
          </Text>

          <Text style={styles.description}>
            Entre na sua conta para acessar o SynerRH.
          </Text>

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
            Senha
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
              placeholder="Digite sua senha"
              placeholderTextColor="#94A3B8"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              editable={!carregando}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarSenha(!mostrarSenha)
              }
              activeOpacity={0.7}
              disabled={carregando}
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              router.push("/esqueci-senha")
            }
            disabled={carregando}
          >
            <Text style={styles.forgotText}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              carregando && styles.loginButtonDisabled,
            ]}
            onPress={entrar}
            activeOpacity={0.85}
            disabled={carregando}
          >
            <Text style={styles.loginButtonText}>
              {carregando ? "Entrando..." : "Entrar"}
            </Text>

            {!carregando && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              ou
            </Text>

            <View style={styles.divider} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push("/cadastro")
              }
              disabled={carregando}
            >
              <Text style={styles.registerLink}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 35,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginTop: 7,
    maxWidth: 300,
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

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -7,
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  loginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#94A3B8",
  },

  registerContainer: {
    alignItems: "center",
  },

  registerText: {
    fontSize: 14,
    color: "#64748B",
  },

  registerLink: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },

  footer: {
    marginTop: 25,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
});