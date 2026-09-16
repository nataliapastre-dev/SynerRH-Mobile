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

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] =
    useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [
    mostrarConfirmacao,
    setMostrarConfirmacao,
  ] = useState(false);

  function formatarDataNascimento(
    valor: string
  ) {
    const apenasNumeros = valor.replace(
      /\D/g,
      ""
    );

    const limitado =
      apenasNumeros.slice(0, 8);

    if (limitado.length <= 2) {
      return limitado;
    }

    if (limitado.length <= 4) {
      return `${limitado.slice(
        0,
        2
      )}/${limitado.slice(2)}`;
    }

    return `${limitado.slice(
      0,
      2
    )}/${limitado.slice(
      2,
      4
    )}/${limitado.slice(4)}`;
  }

  function formatarCelular(valor: string) {
    const apenasNumeros = valor.replace(
      /\D/g,
      ""
    );

    const limitado =
      apenasNumeros.slice(0, 11);

    if (limitado.length <= 2) {
      return limitado;
    }

    if (limitado.length <= 7) {
      return `(${limitado.slice(
        0,
        2
      )}) ${limitado.slice(2)}`;
    }

    return `(${limitado.slice(
      0,
      2
    )}) ${limitado.slice(
      2,
      7
    )}-${limitado.slice(7)}`;
  }

  function validarDataNascimento(
    data: string
  ) {
    const partes = data.split("/");

    if (partes.length !== 3) {
      return false;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    if (
      !dia ||
      !mes ||
      !ano ||
      ano < 1900
    ) {
      return false;
    }

    const dataInformada = new Date(
      ano,
      mes - 1,
      dia
    );

    const dataValida =
      dataInformada.getDate() === dia &&
      dataInformada.getMonth() ===
        mes - 1 &&
      dataInformada.getFullYear() === ano;

    if (!dataValida) {
      return false;
    }

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    if (dataInformada > hoje) {
      return false;
    }

    return true;
  }

  async function cadastrar() {
    const nomeLimpo = nome.trim();

    const emailLimpo = email
      .trim()
      .toLowerCase();

    const celularNumeros =
      celular.replace(/\D/g, "");

    if (
      !nomeLimpo ||
      !dataNascimento.trim() ||
      !celular.trim() ||
      !emailLimpo ||
      !senha.trim() ||
      !confirmarSenha.trim()
    ) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );

      return;
    }

    const partesNome =
      nomeLimpo.split(/\s+/);

    if (partesNome.length < 2) {
      Alert.alert(
        "Nome incompleto",
        "Digite seu nome completo, incluindo nome e sobrenome."
      );

      return;
    }

    if (
      !validarDataNascimento(
        dataNascimento
      )
    ) {
      Alert.alert(
        "Data inválida",
        "Digite uma data de nascimento válida no formato DD/MM/AAAA."
      );

      return;
    }

    if (celularNumeros.length !== 11) {
      Alert.alert(
        "Celular inválido",
        "Digite um celular válido com DDD."
      );

      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailLimpo
      );

    if (!emailValido) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
      );

      return;
    }

    const temMinimo8 =
      senha.length >= 8;

    const temMaiuscula =
      /[A-Z]/.test(senha);

    const temMinuscula =
      /[a-z]/.test(senha);

    const temNumero =
      /[0-9]/.test(senha);

    const temEspecial =
      /[^A-Za-z0-9]/.test(senha);

    if (
      !temMinimo8 ||
      !temMaiuscula ||
      !temMinuscula ||
      !temNumero ||
      !temEspecial
    ) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );

      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        "Senhas diferentes",
        "A senha e a confirmação precisam ser iguais."
      );

      return;
    }

    try {
      const usuario = {
        nome: nomeLimpo,
        dataNascimento,
        celular,
        email: emailLimpo,
        senha,
      };

      await AsyncStorage.setItem(
        "@synerrh_usuario",
        JSON.stringify(usuario)
      );

      console.log(
        "Usuário salvo:",
        usuario
      );

      Alert.alert(
        "Conta criada!",
        "Seu cadastro foi realizado com sucesso."
      );

      router.replace("/login");
    } catch (error) {
      console.error(
        "Erro ao salvar usuário:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível criar sua conta. Tente novamente."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#0F172A"
          />

          <Text style={styles.backText}>
            Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View
            style={styles.logoContainer}
          >
            <Ionicons
              name="person-add-outline"
              size={34}
              color="#2563EB"
            />
          </View>

          <Text style={styles.title}>
            Criar sua conta
          </Text>

          <Text style={styles.subtitle}>
            Cadastre-se para conhecer o
            SynerRH Mobile.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Nome completo
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>
            Data de nascimento
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#94A3B8"
              value={dataNascimento}
              onChangeText={(texto) =>
                setDataNascimento(
                  formatarDataNascimento(
                    texto
                  )
                )
              }
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>
            Celular
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
            <Ionicons
              name="call-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="(16) 99999-9999"
              placeholderTextColor="#94A3B8"
              value={celular}
              onChangeText={(texto) =>
                setCelular(
                  formatarCelular(texto)
                )
              }
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <Text style={styles.label}>
            E-mail
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
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
            />
          </View>

          <Text style={styles.label}>
            Senha
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Crie uma senha segura"
              placeholderTextColor="#94A3B8"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={
                !mostrarSenha
              }
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarSenha(
                  !mostrarSenha
                )
              }
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

          <Text
            style={
              styles.passwordHint
            }
          >
            A senha deve conter pelo
            menos 8 caracteres, uma letra
            maiúscula, uma letra
            minúscula, um número e um
            caractere especial.
          </Text>

          <Text style={styles.label}>
            Confirmar senha
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite novamente sua senha"
              placeholderTextColor="#94A3B8"
              value={confirmarSenha}
              onChangeText={
                setConfirmarSenha
              }
              secureTextEntry={
                !mostrarConfirmacao
              }
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmacao(
                  !mostrarConfirmacao
                )
              }
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
            style={styles.button}
            onPress={cadastrar}
            activeOpacity={0.85}
          >
            <Text
              style={styles.buttonText}
            >
              Criar conta
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View
            style={styles.loginArea}
          >
            <Text
              style={styles.loginText}
            >
              Já tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace(
                  "/login"
                )
              }
            >
              <Text
                style={styles.loginLink}
              >
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          SynerRH Mobile • Gestão de
          Pessoas
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

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  loginArea: {
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 14,
    color: "#64748B",
  },

  loginLink: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
  },
});