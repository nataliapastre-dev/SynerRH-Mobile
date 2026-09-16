import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Usuario = {
  nome: string;
  dataNascimento: string;
  celular: string;
  email: string;
  senha?: string;
};

export default function MinhaConta() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [editando, setEditando] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [nome, setNome] = useState("");

  const [
    dataNascimento,
    setDataNascimento,
  ] = useState("");

  const [celular, setCelular] =
    useState("");

  const [email, setEmail] =
    useState("");

  useFocusEffect(
    useCallback(() => {
      carregarUsuario();
    }, [])
  );

  async function carregarUsuario() {
    try {
      const usuarioSalvo =
        await AsyncStorage.getItem(
          "@synerrh_usuario"
        );

      if (!usuarioSalvo) {
        console.log(
          "Nenhum usuário encontrado."
        );

        return;
      }

      const dadosUsuario: Usuario =
        JSON.parse(usuarioSalvo);

      setUsuario(dadosUsuario);

      preencherFormulario(
        dadosUsuario
      );
    } catch (error) {
      console.error(
        "Erro ao carregar usuário:",
        error
      );
    } finally {
      setCarregando(false);
    }
  }

  function preencherFormulario(
    dados: Usuario
  ) {
    setNome(dados.nome || "");

    setDataNascimento(
      dados.dataNascimento || ""
    );

    setCelular(
      dados.celular || ""
    );

    setEmail(
      dados.email || ""
    );
  }

  function obterNomeExibicao(
    nomeCompleto: string
  ) {
    const partes = nomeCompleto
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (partes.length <= 1) {
      return nomeCompleto;
    }

    return `${partes[0]} ${
      partes[partes.length - 1]
    }`;
  }

  function obterInicial(
    nomeCompleto: string
  ) {
    return nomeCompleto
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  function formatarDataNascimento(
    valor: string
  ) {
    const apenasNumeros =
      valor.replace(/\D/g, "");

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

  function formatarCelular(
    valor: string
  ) {
    const apenasNumeros =
      valor.replace(/\D/g, "");

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
    const partes =
      data.split("/");

    if (partes.length !== 3) {
      return false;
    }

    const dia =
      Number(partes[0]);

    const mes =
      Number(partes[1]);

    const ano =
      Number(partes[2]);

    if (
      !dia ||
      !mes ||
      !ano ||
      ano < 1900
    ) {
      return false;
    }

    const dataInformada =
      new Date(
        ano,
        mes - 1,
        dia
      );

    const dataValida =
      dataInformada.getDate() ===
        dia &&
      dataInformada.getMonth() ===
        mes - 1 &&
      dataInformada.getFullYear() ===
        ano;

    if (!dataValida) {
      return false;
    }

    const hoje = new Date();

    hoje.setHours(
      0,
      0,
      0,
      0
    );

    if (dataInformada > hoje) {
      return false;
    }

    return true;
  }

  function editarDados() {
    if (!usuario) {
      return;
    }

    preencherFormulario(
      usuario
    );

    setEditando(true);
  }

  function cancelarEdicao() {
    if (!usuario) {
      return;
    }

    preencherFormulario(
      usuario
    );

    setEditando(false);
  }

  async function salvarAlteracoes() {
    if (!usuario) {
      return;
    }

    const nomeLimpo =
      nome.trim();

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    const celularNumeros =
      celular.replace(/\D/g, "");

    if (
      !nomeLimpo ||
      !dataNascimento.trim() ||
      !celular.trim() ||
      !emailLimpo
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

    if (
      celularNumeros.length !== 11
    ) {
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

    try {
      setSalvando(true);

      const usuarioAtualizado: Usuario =
        {
          ...usuario,
          nome: nomeLimpo,
          dataNascimento,
          celular,
          email: emailLimpo,
        };

      await AsyncStorage.setItem(
        "@synerrh_usuario",
        JSON.stringify(
          usuarioAtualizado
        )
      );

      const sessaoSalva =
        await AsyncStorage.getItem(
          "@synerrh_sessao"
        );

      if (sessaoSalva) {
        const sessao =
          JSON.parse(sessaoSalva);

        const sessaoAtualizada = {
          ...sessao,
          nome: nomeLimpo,
          email: emailLimpo,
        };

        await AsyncStorage.setItem(
          "@synerrh_sessao",
          JSON.stringify(
            sessaoAtualizada
          )
        );
      }

      setUsuario(
        usuarioAtualizado
      );

      setEditando(false);

      console.log(
        "Dados atualizados:",
        usuarioAtualizado
      );

      Alert.alert(
        "Dados atualizados!",
        "Suas informações foram salvas com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar dados:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível salvar suas alterações."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    try {
      await AsyncStorage.removeItem(
        "@synerrh_sessao"
      );

      console.log(
        "Sessão encerrada."
      );

      router.replace(
        "/login"
      );
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error
      );
    }
  }

  if (carregando) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#4936F5"
        />

        <Text
          style={styles.loadingText}
        >
          Carregando sua conta...
        </Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Ionicons
          name="alert-circle-outline"
          size={44}
          color="#64748B"
        />

        <Text
          style={styles.emptyTitle}
        >
          Dados não encontrados
        </Text>

        <Text
          style={styles.emptyText}
        >
          Não foi possível carregar
          os dados da sua conta.
        </Text>

        <Pressable
          style={
            styles.backHomeButton
          }
          onPress={() =>
            router.replace("/")
          }
        >
          <Text
            style={
              styles.backHomeButtonText
            }
          >
            Voltar para o início
          </Text>
        </Pressable>
      </View>
    );
  }

  const nomeExibicao =
    obterNomeExibicao(
      usuario.nome
    );

  const inicial =
    obterInicial(
      usuario.nome
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabeçalho */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#0F172A"
          />

          <Text
            style={styles.backText}
          >
            Voltar
          </Text>
        </Pressable>
      </View>

      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Minha conta
        </Text>

        <Text
          style={styles.subtitle}
        >
          Consulte e atualize as
          informações da sua conta no
          SynerRH Mobile.
        </Text>
      </View>

      {/* Perfil */}
      <View
        style={styles.profileCard}
      >
        <View style={styles.avatar}>
          <Text
            style={styles.avatarText}
          >
            {inicial}
          </Text>
        </View>

        <Text
          style={styles.userName}
        >
          {nomeExibicao}
        </Text>

        <Text
          style={styles.userEmail}
        >
          {usuario.email}
        </Text>
      </View>

      {/* Dados pessoais */}
      <View style={styles.section}>
        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Dados pessoais
          </Text>

          {!editando && (
            <Pressable
              style={({
                pressed,
              }) => [
                styles.editButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={editarDados}
            >
              <Ionicons
                name="create-outline"
                size={17}
                color="#4936F5"
              />

              <Text
                style={
                  styles.editButtonText
                }
              >
                Editar dados
              </Text>
            </Pressable>
          )}
        </View>

        {!editando ? (
          <View
            style={styles.infoCard}
          >
            {/* Nome */}
            <View
              style={styles.infoRow}
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#4936F5"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Nome completo
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {usuario.nome}
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            {/* Nascimento */}
            <View
              style={styles.infoRow}
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#4936F5"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Data de nascimento
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {usuario.dataNascimento ||
                    "Não informado"}
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            {/* Celular */}
            <View
              style={styles.infoRow}
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#4936F5"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Celular
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {usuario.celular ||
                    "Não informado"}
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            {/* E-mail */}
            <View
              style={styles.infoRow}
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#4936F5"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  E-mail
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {usuario.email}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={styles.editCard}
          >
            {/* Nome */}
            <Text
              style={styles.fieldLabel}
            >
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
                style={
                  styles.inputIcon
                }
              />

              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
              />
            </View>

            {/* Data */}
            <Text
              style={styles.fieldLabel}
            >
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
                style={
                  styles.inputIcon
                }
              />

              <TextInput
                style={styles.input}
                value={dataNascimento}
                onChangeText={(texto) =>
                  setDataNascimento(
                    formatarDataNascimento(
                      texto
                    )
                  )
                }
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Celular */}
            <Text
              style={styles.fieldLabel}
            >
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
                style={
                  styles.inputIcon
                }
              />

              <TextInput
                style={styles.input}
                value={celular}
                onChangeText={(texto) =>
                  setCelular(
                    formatarCelular(
                      texto
                    )
                  )
                }
                placeholder="(16) 99999-9999"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            {/* E-mail */}
            <Text
              style={styles.fieldLabel}
            >
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
                style={
                  styles.inputIcon
                }
              />

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Botões */}
            <View
              style={
                styles.editActions
              }
            >
              <Pressable
                style={({
                  pressed,
                }) => [
                  styles.cancelButton,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={
                  cancelarEdicao
                }
                disabled={salvando}
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={({
                  pressed,
                }) => [
                  styles.saveButton,
                  pressed &&
                    styles.buttonPressed,
                  salvando &&
                    styles.disabledButton,
                ]}
                onPress={
                  salvarAlteracoes
                }
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.saveButtonText
                      }
                    >
                      Salvar alterações
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Conta */}
      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
        >
          Conta
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={sair}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#E5484D"
          />

          <Text
            style={styles.logoutText}
          >
            Sair da conta
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        SynerRH Mobile • Gestão de Pessoas
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9FE",
  },

  content: {
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F9FE",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#64748B",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#64748B",
  },

  backHomeButton: {
    marginTop: 20,
    backgroundColor: "#4936F5",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backHomeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  topBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5ECF7",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  buttonPressed: {
    opacity: 0.6,
  },

  disabledButton: {
    opacity: 0.7,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0A1633",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  profileCard: {
    marginHorizontal: 16,
    marginTop: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4936F5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  userName: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "800",
    color: "#0A1633",
  },

  userEmail: {
    marginTop: 5,
    fontSize: 12,
    color: "#71809A",
  },

  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A1633",
    marginBottom: 11,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEEAFE",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  editButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4936F5",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8290A8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  infoValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#263653",
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginLeft: 53,
  },

  editCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 7,
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 13,
    paddingHorizontal: 13,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginRight: 9,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },

  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: 13,
    backgroundColor: "#4936F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  saveButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  logoutButton: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1C7C9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E5484D",
  },

  footer: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
  },
});