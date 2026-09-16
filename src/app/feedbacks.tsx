import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TipoFeedback =
  | "Positivo"
  | "Desenvolvimento"
  | "Reconhecimento"
  | "Outro";

type TipoFeedbackBackend =
  | "POSITIVO"
  | "DESENVOLVIMENTO"
  | "RECONHECIMENTO"
  | "OUTRO";

type Colaborador = {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
};

type Feedback = {
  id: number;
  colaboradorId: number;
  colaborador: string;
  autorId: number | null;
  autor: string;
  titulo: string;
  tipo: TipoFeedback;
  data: string;
  mensagem: string;
};

type NovoFeedback = {
  colaboradorId: string;
  autorId: string;
  titulo: string;
  tipo: TipoFeedback;
  mensagem: string;
};

const API_URL = "https://synerrh.onrender.com";

const tipoToBackend: Record<TipoFeedback, TipoFeedbackBackend> = {
  Positivo: "POSITIVO",
  Desenvolvimento: "DESENVOLVIMENTO",
  Reconhecimento: "RECONHECIMENTO",
  Outro: "OUTRO",
};

function tipoFromBackend(tipo: TipoFeedbackBackend): TipoFeedback {
  switch (tipo) {
    case "POSITIVO":
      return "Positivo";
    case "DESENVOLVIMENTO":
      return "Desenvolvimento";
    case "RECONHECIMENTO":
      return "Reconhecimento";
    default:
      return "Outro";
  }
}

function formatarData(data?: string | null) {
  if (!data) return "Data não informada";

  const dataSomente = data.slice(0, 10);
  const [ano, mes, dia] = dataSomente.split("-").map(Number);

  if (!ano || !mes || !dia) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(ano, mes - 1, dia)
  );
}

function getTipoIcone(tipo: TipoFeedback) {
  switch (tipo) {
    case "Positivo":
      return "thumbs-up-outline";
    case "Desenvolvimento":
      return "bulb-outline";
    case "Reconhecimento":
      return "trophy-outline";
    default:
      return "chatbubble-outline";
  }
}

function getTipoCores(tipo: TipoFeedback) {
  switch (tipo) {
    case "Positivo":
      return {
        fundo: "#ECFDF5",
        texto: "#047857",
        borda: "#A7F3D0",
      };

    case "Desenvolvimento":
      return {
        fundo: "#FFFBEB",
        texto: "#B45309",
        borda: "#FDE68A",
      };

    case "Reconhecimento":
      return {
        fundo: "#EFF6FF",
        texto: "#1D4ED8",
        borda: "#BFDBFE",
      };

    default:
      return {
        fundo: "#F1F5F9",
        texto: "#475569",
        borda: "#CBD5E1",
      };
  }
}

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  const [filtroTipo, setFiltroTipo] =
    useState<"Todos" | TipoFeedback>("Todos");

  const [filtroColaborador, setFiltroColaborador] =
    useState("Todos");

  const [modalFiltros, setModalFiltros] = useState(false);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalColaborador, setModalColaborador] = useState(false);
  const [modalAutor, setModalAutor] = useState(false);
  const [modalTipo, setModalTipo] = useState(false);

  const [feedbackEditandoId, setFeedbackEditandoId] =
    useState<number | null>(null);

  const [novoFeedback, setNovoFeedback] =
    useState<NovoFeedback>({
      colaboradorId: "",
      autorId: "",
      titulo: "",
      tipo: "Positivo",
      mensagem: "",
    });

  async function carregarDados(refresh = false) {
    try {
      if (refresh) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      setErro("");

      const [feedbacksResponse, colaboradoresResponse] =
        await Promise.all([
          fetch(`${API_URL}/feedbacks`),
          fetch(`${API_URL}/colaboradores`),
        ]);

      if (!feedbacksResponse.ok) {
        throw new Error("Erro ao buscar feedbacks.");
      }

      if (!colaboradoresResponse.ok) {
        throw new Error("Erro ao buscar colaboradores.");
      }

      const feedbacksApi = await feedbacksResponse.json();
      const colaboradoresApi = await colaboradoresResponse.json();

      const colaboradoresFormatados: Colaborador[] =
        colaboradoresApi.map((colaborador: Colaborador) => ({
          id: colaborador.id,
          nome: colaborador.nome,
          cargo: colaborador.cargo,
          departamento: colaborador.departamento,
        }));

      const feedbacksFormatados: Feedback[] =
        feedbacksApi.map(
          (feedback: {
            id: number;
            titulo: string;
            conteudo: string;
            tipo: TipoFeedbackBackend;
            data?: string | null;
            createdAt?: string | null;
            colaboradorId: number;
            colaborador?: {
              id: number;
              nome: string;
              cargo?: string;
            };
            autor?: {
              id: number;
              nome: string;
              cargo?: string;
            } | null;
          }) => ({
            id: feedback.id,

            colaboradorId: feedback.colaboradorId,

            colaborador:
              feedback.colaborador?.nome ??
              colaboradoresFormatados.find(
                (colaborador) =>
                  colaborador.id === feedback.colaboradorId
              )?.nome ??
              "Colaborador não encontrado",

            autorId: feedback.autor?.id ?? null,

            autor: feedback.autor?.nome ?? "Não informado",

            titulo: feedback.titulo,

            tipo: tipoFromBackend(feedback.tipo),

            data: formatarData(
              feedback.data ?? feedback.createdAt
            ),

            mensagem: feedback.conteudo,
          })
        );

      setColaboradores(colaboradoresFormatados);
      setFeedbacks(feedbacksFormatados);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados."
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const feedbacksFiltrados = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const correspondeTipo =
        filtroTipo === "Todos" ||
        feedback.tipo === filtroTipo;

      const correspondeColaborador =
        filtroColaborador === "Todos" ||
        String(feedback.colaboradorId) === filtroColaborador;

      return correspondeTipo && correspondeColaborador;
    });
  }, [feedbacks, filtroTipo, filtroColaborador]);

  const totalPositivos = useMemo(
    () =>
      feedbacks.filter(
        (feedback) => feedback.tipo === "Positivo"
      ).length,
    [feedbacks]
  );

  const totalDesenvolvimento = useMemo(
    () =>
      feedbacks.filter(
        (feedback) => feedback.tipo === "Desenvolvimento"
      ).length,
    [feedbacks]
  );

  const totalReconhecimento = useMemo(
    () =>
      feedbacks.filter(
        (feedback) => feedback.tipo === "Reconhecimento"
      ).length,
    [feedbacks]
  );

  const colaboradorFiltroSelecionado =
    colaboradores.find(
      (colaborador) =>
        String(colaborador.id) === filtroColaborador
    );

  const colaboradorNovoSelecionado =
    colaboradores.find(
      (colaborador) =>
        String(colaborador.id) ===
        novoFeedback.colaboradorId
    );

  const autorSelecionado =
    colaboradores.find(
      (colaborador) =>
        String(colaborador.id) === novoFeedback.autorId
    );

  function abrirNovoFeedback() {
    setErro("");
    setFeedbackEditandoId(null);

    setNovoFeedback({
      colaboradorId: "",
      autorId: "",
      titulo: "",
      tipo: "Positivo",
      mensagem: "",
    });

    setModalNovo(true);
  }

  function abrirEditarFeedback(feedback: Feedback) {
    setErro("");
    setFeedbackEditandoId(feedback.id);

    setNovoFeedback({
      colaboradorId: String(feedback.colaboradorId),
      autorId: feedback.autorId
        ? String(feedback.autorId)
        : "",
      titulo: feedback.titulo,
      tipo: feedback.tipo,
      mensagem: feedback.mensagem,
    });

    setModalNovo(true);
  }

  function fecharNovoFeedback() {
    setModalNovo(false);
    setFeedbackEditandoId(null);

    setNovoFeedback({
      colaboradorId: "",
      autorId: "",
      titulo: "",
      tipo: "Positivo",
      mensagem: "",
    });
  }

  function limparFiltros() {
    setFiltroTipo("Todos");
    setFiltroColaborador("Todos");
  }

  function voltarAoInicio() {
    router.replace("/");
  }

  async function salvarFeedback() {
    if (!novoFeedback.colaboradorId) {
      Alert.alert(
        "Campo obrigatório",
        "Selecione um colaborador."
      );
      return;
    }

    if (!novoFeedback.titulo.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Digite um título para o feedback."
      );
      return;
    }

    if (!novoFeedback.mensagem.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Digite uma mensagem para o feedback."
      );
      return;
    }

    try {
      setSalvando(true);

      const editando =
        feedbackEditandoId !== null;

      const response = await fetch(
        editando
          ? `${API_URL}/feedbacks/${feedbackEditandoId}`
          : `${API_URL}/feedbacks`,
        {
          method: editando ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            titulo: novoFeedback.titulo.trim(),

            conteudo: novoFeedback.mensagem.trim(),

            tipo: tipoToBackend[novoFeedback.tipo],

            colaboradorId: Number(
              novoFeedback.colaboradorId
            ),

            autorId: novoFeedback.autorId
              ? Number(novoFeedback.autorId)
              : null,
          }),
        }
      );

      if (!response.ok) {
        const resultado = await response
          .json()
          .catch(() => null);

        throw new Error(
          resultado?.mensagem ??
            (editando
              ? "Não foi possível atualizar o feedback."
              : "Não foi possível cadastrar o feedback.")
        );
      }

      await carregarDados();

      setModalNovo(false);
      setFeedbackEditandoId(null);

      setNovoFeedback({
        colaboradorId: "",
        autorId: "",
        titulo: "",
        tipo: "Positivo",
        mensagem: "",
      });

      Alert.alert(
        editando
          ? "Feedback atualizado"
          : "Feedback registrado",
        editando
          ? "As alterações foram salvas com sucesso."
          : "O feedback foi salvo com sucesso."
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : feedbackEditandoId !== null
            ? "Erro ao atualizar feedback."
            : "Erro ao cadastrar feedback."
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(id: number) {
    Alert.alert(
      "Excluir feedback",
      "Tem certeza que deseja excluir este feedback?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirFeedback(id),
        },
      ]
    );
  }

  async function excluirFeedback(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/feedbacks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const resultado = await response
          .json()
          .catch(() => null);

        throw new Error(
          resultado?.mensagem ??
            "Não foi possível excluir o feedback."
        );
      }

      setFeedbacks((feedbacksAtuais) =>
        feedbacksAtuais.filter(
          (feedback) => feedback.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Erro ao excluir feedback."
      );
    }
  }

  function MetricCard({
    titulo,
    valor,
    subtitulo,
    icone,
    corIcone,
    fundoIcone,
  }: {
    titulo: string;
    valor: number;
    subtitulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    corIcone: string;
    fundoIcone: string;
  }) {
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricTopo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metricTitulo}>{titulo}</Text>

            <Text style={styles.metricValor}>
              {carregando ? "—" : valor}
            </Text>

            <Text style={styles.metricSubtitulo}>
              {subtitulo}
            </Text>
          </View>

          <View
            style={[
              styles.metricIcone,
              { backgroundColor: fundoIcone },
            ]}
          >
            <Ionicons
              name={icone}
              size={18}
              color={corIcone}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderFeedback({
    item,
  }: {
    item: Feedback;
  }) {
    const cores = getTipoCores(item.tipo);

    return (
      <View style={styles.feedbackCard}>
        <View style={styles.feedbackTopo}>
          <View
            style={[
              styles.tipoIcone,
              {
                backgroundColor: cores.fundo,
                borderColor: cores.borda,
              },
            ]}
          >
            <Ionicons
              name={
                getTipoIcone(
                  item.tipo
                ) as keyof typeof Ionicons.glyphMap
              }
              size={20}
              color={cores.texto}
            />
          </View>

          <View style={styles.feedbackCabecalho}>
            <View style={styles.nomeLinha}>
              <Text style={styles.colaboradorNome}>
                {item.colaborador}
              </Text>

              <View
                style={[
                  styles.tipoBadge,
                  {
                    backgroundColor: cores.fundo,
                    borderColor: cores.borda,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tipoBadgeTexto,
                    { color: cores.texto },
                  ]}
                >
                  {item.tipo}
                </Text>
              </View>
            </View>

            <Text style={styles.feedbackTitulo}>
              {item.titulo}
            </Text>

            <Text style={styles.autorTexto}>
              Registrado por{" "}
              <Text style={styles.autorNome}>
                {item.autor}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.dataLinha}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#94A3B8"
          />

          <Text style={styles.dataTexto}>{item.data}</Text>
        </View>

        <View style={styles.mensagemBox}>
          <Text style={styles.mensagemTexto}>
            {item.mensagem}
          </Text>
        </View>

        <View style={styles.feedbackActions}>
          <Pressable
            style={styles.editarButton}
            onPress={() => abrirEditarFeedback(item)}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color="#4F46E5"
            />

            <Text style={styles.editarTexto}>Editar</Text>
          </Pressable>

          <Pressable
            style={styles.excluirButton}
            onPress={() => confirmarExclusao(item.id)}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#DC2626"
            />

            <Text style={styles.excluirTexto}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={feedbacksFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderFeedback}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregarDados(true)}
          />
        }
        ListHeaderComponent={
          <>
            <TouchableOpacity
              onPress={voltarAoInicio}
              activeOpacity={0.7}
              hitSlop={10}
              style={styles.backHomeButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar ao início"
            >
              <Ionicons
                name="home-outline"
                size={18}
                color="#334155"
              />

              <Text style={styles.backHomeButtonText}>
                Voltar ao início
              </Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.headerTextos}>
                <Text style={styles.tituloPagina}>
                  Feedbacks
                </Text>

                <Text style={styles.subtituloPagina}>
                  Registre, acompanhe e consulte os feedbacks
                  relacionados ao desenvolvimento dos
                  colaboradores.
                </Text>
              </View>

              <Pressable
                style={styles.novoButton}
                onPress={abrirNovoFeedback}
              >
                <Ionicons
                  name="add"
                  size={22}
                  color="#FFFFFF"
                />

                <Text style={styles.novoButtonTexto}>
                  Novo feedback
                </Text>
              </Pressable>
            </View>

            {erro ? (
              <View style={styles.erroBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC2626"
                />

                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            ) : null}

            <View style={styles.metricGrid}>
              <MetricCard
                titulo="Total de feedbacks"
                valor={feedbacks.length}
                subtitulo="Registrados"
                icone="chatbubbles-outline"
                corIcone="#4F46E5"
                fundoIcone="#EEF2FF"
              />

              <MetricCard
                titulo="Feedbacks positivos"
                valor={totalPositivos}
                subtitulo="Positivos"
                icone="thumbs-up-outline"
                corIcone="#059669"
                fundoIcone="#ECFDF5"
              />

              <MetricCard
                titulo="Desenvolvimento"
                valor={totalDesenvolvimento}
                subtitulo="Para evolução"
                icone="bulb-outline"
                corIcone="#D97706"
                fundoIcone="#FFFBEB"
              />

              <MetricCard
                titulo="Reconhecimentos"
                valor={totalReconhecimento}
                subtitulo="Reconhecimentos"
                icone="trophy-outline"
                corIcone="#2563EB"
                fundoIcone="#EFF6FF"
              />
            </View>

            <View style={styles.filtroCard}>
              <View style={styles.filtroHeader}>
                <View>
                  <Text style={styles.filtroTitulo}>
                    Filtros
                  </Text>

                  <Text style={styles.filtroSubtitulo}>
                    Refine os feedbacks exibidos.
                  </Text>
                </View>

                {(filtroTipo !== "Todos" ||
                  filtroColaborador !== "Todos") && (
                  <Pressable onPress={limparFiltros}>
                    <Text style={styles.limparTexto}>
                      Limpar
                    </Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                style={styles.filtroButton}
                onPress={() => setModalFiltros(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color="#475569"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroButtonLabel}>
                    Colaborador
                  </Text>

                  <Text style={styles.filtroButtonValor}>
                    {colaboradorFiltroSelecionado?.nome ??
                      "Todos os colaboradores"}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>

              <Pressable
                style={styles.filtroButton}
                onPress={() => setModalFiltros(true)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color="#475569"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroButtonLabel}>
                    Tipo
                  </Text>

                  <Text style={styles.filtroButtonValor}>
                    {filtroTipo === "Todos"
                      ? "Todos os tipos"
                      : filtroTipo}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>
            </View>

            <View style={styles.listaHeader}>
              <Text style={styles.listaTitulo}>
                Feedbacks registrados
              </Text>

              <Text style={styles.listaQuantidade}>
                {feedbacksFiltrados.length} resultado
                {feedbacksFiltrados.length === 1 ? "" : "s"}
              </Text>
            </View>

            {carregando && (
              <View style={styles.loadingBox}>
                <ActivityIndicator
                  size="large"
                  color="#4F46E5"
                />

                <Text style={styles.loadingTexto}>
                  Carregando feedbacks...
                </Text>
              </View>
            )}

            {!carregando &&
              feedbacksFiltrados.length === 0 && (
                <View style={styles.vazioBox}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={38}
                    color="#94A3B8"
                  />

                  <Text style={styles.vazioTitulo}>
                    Nenhum feedback encontrado
                  </Text>

                  <Text style={styles.vazioTexto}>
                    Altere os filtros ou registre um novo
                    feedback.
                  </Text>
                </View>
              )}
          </>
        }
      />

      {/* FILTROS */}

      <Modal
        visible={modalFiltros}
        transparent
        animationType="slide"
        onRequestClose={() => setModalFiltros(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Filtros</Text>

              <Pressable
                onPress={() => setModalFiltros(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.campoLabel}>
                Colaborador
              </Text>

              <Pressable
                style={[
                  styles.opcao,
                  filtroColaborador === "Todos" &&
                    styles.opcaoSelecionada,
                ]}
                onPress={() =>
                  setFiltroColaborador("Todos")
                }
              >
                <Text style={styles.opcaoTexto}>
                  Todos os colaboradores
                </Text>
              </Pressable>

              {colaboradores.map((colaborador) => (
                <Pressable
                  key={colaborador.id}
                  style={[
                    styles.opcao,
                    filtroColaborador ===
                      String(colaborador.id) &&
                      styles.opcaoSelecionada,
                  ]}
                  onPress={() =>
                    setFiltroColaborador(
                      String(colaborador.id)
                    )
                  }
                >
                  <Text style={styles.opcaoTexto}>
                    {colaborador.nome}
                  </Text>

                  <Text style={styles.opcaoSubtexto}>
                    {colaborador.cargo}
                  </Text>
                </Pressable>
              ))}

              <Text
                style={[
                  styles.campoLabel,
                  { marginTop: 20 },
                ]}
              >
                Tipo de feedback
              </Text>

              {(
                [
                  "Todos",
                  "Positivo",
                  "Desenvolvimento",
                  "Reconhecimento",
                  "Outro",
                ] as const
              ).map((tipo) => (
                <Pressable
                  key={tipo}
                  style={[
                    styles.opcao,
                    filtroTipo === tipo &&
                      styles.opcaoSelecionada,
                  ]}
                  onPress={() => setFiltroTipo(tipo)}
                >
                  <Text style={styles.opcaoTexto}>
                    {tipo === "Todos"
                      ? "Todos os tipos"
                      : tipo}
                  </Text>
                </Pressable>
              ))}

              <Pressable
                style={styles.aplicarButton}
                onPress={() => setModalFiltros(false)}
              >
                <Text style={styles.aplicarButtonTexto}>
                  Aplicar filtros
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* NOVO FEEDBACK */}

      <Modal
        visible={modalNovo}
        transparent
        animationType="slide"
        onRequestClose={fecharNovoFeedback}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetGrande}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitulo}>
                  {feedbackEditandoId !== null
                    ? "Editar feedback"
                    : "Registrar novo feedback"}
                </Text>

                <Text style={styles.modalSubtitulo}>
                  {feedbackEditandoId !== null
                    ? "Atualize as informações do feedback selecionado."
                    : "Registre uma observação sobre o desenvolvimento do colaborador."}
                </Text>
              </View>

              <Pressable onPress={fecharNovoFeedback}>
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.campoLabel}>
                Colaborador *
              </Text>

              <Pressable
                style={styles.selectCampo}
                onPress={() => setModalColaborador(true)}
              >
                <Text
                  style={
                    colaboradorNovoSelecionado
                      ? styles.selectTexto
                      : styles.placeholderTexto
                  }
                >
                  {colaboradorNovoSelecionado
                    ? `${colaboradorNovoSelecionado.nome} — ${colaboradorNovoSelecionado.cargo}`
                    : "Selecione um colaborador"}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>

              <Text style={styles.campoLabel}>
                Registrado por
              </Text>

              <Pressable
                style={styles.selectCampo}
                onPress={() => setModalAutor(true)}
              >
                <Text
                  style={
                    autorSelecionado
                      ? styles.selectTexto
                      : styles.placeholderTexto
                  }
                >
                  {autorSelecionado
                    ? `${autorSelecionado.nome} — ${autorSelecionado.cargo}`
                    : "Não informar autor"}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>

              <Text style={styles.campoLabel}>
                Título *
              </Text>

              <TextInput
                style={styles.input}
                value={novoFeedback.titulo}
                onChangeText={(titulo) =>
                  setNovoFeedback((atual) => ({
                    ...atual,
                    titulo,
                  }))
                }
                placeholder="Ex.: Excelente evolução no projeto"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.campoLabel}>
                Tipo de feedback *
              </Text>

              <Pressable
                style={styles.selectCampo}
                onPress={() => setModalTipo(true)}
              >
                <Text style={styles.selectTexto}>
                  {novoFeedback.tipo}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>

              <Text style={styles.campoLabel}>
                Feedback *
              </Text>

              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoFeedback.mensagem}
                onChangeText={(mensagem) =>
                  setNovoFeedback((atual) => ({
                    ...atual,
                    mensagem,
                  }))
                }
                placeholder="Digite o feedback..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelarButton}
                  onPress={fecharNovoFeedback}
                >
                  <Text style={styles.cancelarTexto}>
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.salvarButton,
                    salvando && styles.buttonDisabled,
                  ]}
                  disabled={salvando}
                  onPress={salvarFeedback}
                >
                  {salvando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#FFFFFF"
                      />

                      <Text style={styles.salvarTexto}>
                        {feedbackEditandoId !== null
                          ? "Salvar alterações"
                          : "Salvar feedback"}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SELECIONAR COLABORADOR */}

      <Modal
        visible={modalColaborador}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalColaborador(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                Selecionar colaborador
              </Text>

              <Pressable
                onPress={() =>
                  setModalColaborador(false)
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <ScrollView>
              {colaboradores.map((colaborador) => (
                <Pressable
                  key={colaborador.id}
                  style={styles.opcao}
                  onPress={() => {
                    setNovoFeedback((atual) => ({
                      ...atual,
                      colaboradorId: String(
                        colaborador.id
                      ),
                    }));

                    setModalColaborador(false);
                  }}
                >
                  <Text style={styles.opcaoTexto}>
                    {colaborador.nome}
                  </Text>

                  <Text style={styles.opcaoSubtexto}>
                    {colaborador.cargo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SELECIONAR AUTOR */}

      <Modal
        visible={modalAutor}
        transparent
        animationType="slide"
        onRequestClose={() => setModalAutor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                Registrado por
              </Text>

              <Pressable
                onPress={() => setModalAutor(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <ScrollView>
              <Pressable
                style={styles.opcao}
                onPress={() => {
                  setNovoFeedback((atual) => ({
                    ...atual,
                    autorId: "",
                  }));

                  setModalAutor(false);
                }}
              >
                <Text style={styles.opcaoTexto}>
                  Não informar autor
                </Text>
              </Pressable>

              {colaboradores.map((colaborador) => (
                <Pressable
                  key={colaborador.id}
                  style={styles.opcao}
                  onPress={() => {
                    setNovoFeedback((atual) => ({
                      ...atual,
                      autorId: String(colaborador.id),
                    }));

                    setModalAutor(false);
                  }}
                >
                  <Text style={styles.opcaoTexto}>
                    {colaborador.nome}
                  </Text>

                  <Text style={styles.opcaoSubtexto}>
                    {colaborador.cargo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SELECIONAR TIPO */}

      <Modal
        visible={modalTipo}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTipo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                Tipo de feedback
              </Text>

              <Pressable
                onPress={() => setModalTipo(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </Pressable>
            </View>

            {(
              [
                "Positivo",
                "Desenvolvimento",
                "Reconhecimento",
                "Outro",
              ] as TipoFeedback[]
            ).map((tipo) => {
              const cores = getTipoCores(tipo);

              return (
                <Pressable
                  key={tipo}
                  style={styles.tipoOpcao}
                  onPress={() => {
                    setNovoFeedback((atual) => ({
                      ...atual,
                      tipo,
                    }));

                    setModalTipo(false);
                  }}
                >
                  <View
                    style={[
                      styles.tipoIcone,
                      {
                        backgroundColor: cores.fundo,
                        borderColor: cores.borda,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        getTipoIcone(
                          tipo
                        ) as keyof typeof Ionicons.glyphMap
                      }
                      size={20}
                      color={cores.texto}
                    />
                  </View>

                  <Text style={styles.opcaoTexto}>
                    {tipo}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  backHomeButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    zIndex: 10,
    elevation: 2,
  },

  backHomeButtonText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },

  header: {
    gap: 14,
    marginBottom: 18,
  },

  headerTextos: {
    flex: 1,
  },

  tituloPagina: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtituloPagina: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  novoButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 18,
  },

  novoButtonTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  erroBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  erroTexto: {
    color: "#B91C1C",
    fontSize: 13,
    flex: 1,
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },

  metricCard: {
    width: "48.5%",
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
  },

  metricTopo: {
    flexDirection: "row",
    gap: 8,
  },

  metricTitulo: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: "#64748B",
  },

  metricValor: {
    marginTop: 7,
    fontSize: 25,
    fontWeight: "800",
    color: "#0F172A",
  },

  metricSubtitulo: {
    marginTop: 5,
    fontSize: 10,
    color: "#94A3B8",
  },

  metricIcone: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  filtroCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },

  filtroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  filtroTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  filtroSubtitulo: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  limparTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  filtroButton: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  filtroButtonLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },

  filtroButtonValor: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
    marginTop: 2,
  },

  listaHeader: {
    marginBottom: 12,
  },

  listaTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  listaQuantidade: {
    marginTop: 3,
    fontSize: 11,
    color: "#94A3B8",
  },

  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  feedbackTopo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },

  tipoIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  feedbackCabecalho: {
    flex: 1,
  },

  nomeLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 7,
  },

  colaboradorNome: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
  },

  tipoBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  tipoBadgeTexto: {
    fontSize: 10,
    fontWeight: "700",
  },

  feedbackTitulo: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  autorTexto: {
    marginTop: 5,
    fontSize: 11,
    color: "#94A3B8",
  },

  autorNome: {
    fontWeight: "700",
    color: "#64748B",
  },

  dataLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 14,
  },

  dataTexto: {
    fontSize: 11,
    color: "#94A3B8",
  },

  mensagemBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 13,
    marginTop: 12,
  },

  mensagemTexto: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },

  feedbackActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  editarButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  editarTexto: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "700",
  },

  excluirButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  excluirTexto: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
  },

  loadingBox: {
    paddingVertical: 45,
    alignItems: "center",
    gap: 12,
  },

  loadingTexto: {
    fontSize: 13,
    color: "#64748B",
  },

  vazioBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    alignItems: "center",
    padding: 30,
  },

  vazioTitulo: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  vazioTexto: {
    marginTop: 5,
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "82%",
  },

  modalSheetGrande: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "92%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    paddingBottom: 15,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },

  modalSubtitulo: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  campoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },

  textArea: {
    minHeight: 130,
    paddingTop: 13,
  },

  selectCampo: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  selectTexto: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
  },

  placeholderTexto: {
    flex: 1,
    fontSize: 13,
    color: "#94A3B8",
  },

  opcao: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
  },

  opcaoSelecionada: {
    backgroundColor: "#EEF2FF",
    borderColor: "#A5B4FC",
  },

  opcaoTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  opcaoSubtexto: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },

  tipoOpcao: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  aplicarButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },

  aplicarButtonTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  modalActions: {
    gap: 9,
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  cancelarButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelarTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },

  salvarButton: {
    minHeight: 48,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  salvarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});