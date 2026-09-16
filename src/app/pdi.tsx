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

type StatusPDI =
  | "A iniciar"
  | "Em andamento"
  | "Concluído"
  | "Atrasado";

type StatusPDIBackend =
  | "NAO_INICIADO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "ATRASADO";

type Colaborador = {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
};

type PDIItem = {
  id: number;
  colaboradorId: number;
  colaborador: string;
  cargo: string;
  objetivo: string;
  descricao: string;
  prazo: string;
  progresso: number;
  status: StatusPDI;
  responsavel: string;
};

type NovoPDI = {
  colaboradorId: string;
  objetivo: string;
  descricao: string;
  prazo: string;
  responsavel: string;
};

const API_URL = "https://synerrh.onrender.com";

const statusToBackend: Record<StatusPDI, StatusPDIBackend> = {
  "A iniciar": "NAO_INICIADO",
  "Em andamento": "EM_ANDAMENTO",
  Concluído: "CONCLUIDO",
  Atrasado: "ATRASADO",
};

function formatarData(data?: string | null) {
  if (!data) return "Sem prazo";

  const dataSomente = data.slice(0, 10);
  const [ano, mes, dia] = dataSomente.split("-").map(Number);

  if (!ano || !mes || !dia) {
    return "Sem prazo";
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(ano, mes - 1, dia),
  );
}

function obterStatus(
  progresso: number,
  statusBackend: StatusPDIBackend,
): StatusPDI {
  if (statusBackend === "ATRASADO") {
    return "Atrasado";
  }

  if (
    statusBackend === "CONCLUIDO" ||
    progresso >= 100
  ) {
    return "Concluído";
  }

  if (
    statusBackend === "EM_ANDAMENTO" ||
    progresso > 0
  ) {
    return "Em andamento";
  }

  return "A iniciar";
}

function getStatusColors(status: StatusPDI) {
  switch (status) {
    case "Concluído":
      return {
        background: "#ECFDF5",
        border: "#A7F3D0",
        text: "#047857",
        progress: "#10B981",
      };

    case "Em andamento":
      return {
        background: "#EFF6FF",
        border: "#BFDBFE",
        text: "#1D4ED8",
        progress: "#3B82F6",
      };

    case "Atrasado":
      return {
        background: "#FEF2F2",
        border: "#FECACA",
        text: "#B91C1C",
        progress: "#EF4444",
      };

    default:
      return {
        background: "#FFFBEB",
        border: "#FDE68A",
        text: "#B45309",
        progress: "#F59E0B",
      };
  }
}

export default function PDI() {
  const [pdis, setPdis] = useState<PDIItem[]>([]);
  const [colaboradores, setColaboradores] = useState<
    Colaborador[]
  >([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<string>("Todos");

  const [modalFiltros, setModalFiltros] =
    useState(false);

  const [modalNovoPDI, setModalNovoPDI] =
    useState(false);

  const [modalColaborador, setModalColaborador] =
    useState(false);

  const [modalDetalhes, setModalDetalhes] =
    useState(false);

  const [pdiSelecionado, setPdiSelecionado] =
    useState<PDIItem | null>(null);

  const [novoPDI, setNovoPDI] = useState<NovoPDI>({
    colaboradorId: "",
    objetivo: "",
    descricao: "",
    prazo: "",
    responsavel: "",
  });

  async function carregarDados(
    modoAtualizacao = false,
  ) {
    try {
      if (modoAtualizacao) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      const [pdisResponse, colaboradoresResponse] =
        await Promise.all([
          fetch(`${API_URL}/pdis`),
          fetch(`${API_URL}/colaboradores`),
        ]);

      if (!pdisResponse.ok) {
        throw new Error(
          "Não foi possível carregar os PDIs.",
        );
      }

      if (!colaboradoresResponse.ok) {
        throw new Error(
          "Não foi possível carregar os colaboradores.",
        );
      }

      const pdisApi = await pdisResponse.json();
      const colaboradoresApi =
        await colaboradoresResponse.json();

      const colaboradoresFormatados: Colaborador[] =
        colaboradoresApi.map(
          (colaborador: Colaborador) => ({
            id: colaborador.id,
            nome: colaborador.nome,
            cargo: colaborador.cargo,
            departamento:
              colaborador.departamento,
          }),
        );

      const pdisFormatados: PDIItem[] =
        pdisApi.map(
          (pdi: {
            id: number;
            titulo: string;
            descricao: string | null;
            objetivo: string | null;
            prazo: string | null;
            progresso: number;
            status: StatusPDIBackend;
            responsavel: string | null;
            colaboradorId: number;
            colaborador?: {
              id: number;
              nome: string;
              cargo: string;
            };
          }) => {
            const colaborador =
              colaboradoresFormatados.find(
                (item) =>
                  item.id === pdi.colaboradorId,
              );

            return {
              id: pdi.id,
              colaboradorId: pdi.colaboradorId,

              colaborador:
                pdi.colaborador?.nome ??
                colaborador?.nome ??
                "Colaborador não encontrado",

              cargo:
                pdi.colaborador?.cargo ??
                colaborador?.cargo ??
                "Cargo não informado",

              objetivo: pdi.objetivo ?? "",

              descricao: pdi.descricao ?? "",

              prazo: formatarData(pdi.prazo),

              progresso: pdi.progresso ?? 0,

              status: obterStatus(
                pdi.progresso ?? 0,
                pdi.status,
              ),

              responsavel:
                pdi.responsavel ??
                "Não informado",
            };
          },
        );

      setColaboradores(colaboradoresFormatados);
      setPdis(pdisFormatados);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados.",
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const pdisFiltrados = useMemo(() => {
    return pdis.filter((pdi) => {
      const termo = busca
        .trim()
        .toLowerCase();

      const correspondeBusca =
        !termo ||
        pdi.colaborador
          .toLowerCase()
          .includes(termo) ||
        pdi.objetivo
          .toLowerCase()
          .includes(termo) ||
        pdi.descricao
          .toLowerCase()
          .includes(termo);

      const correspondeStatus =
        filtroStatus === "Todos" ||
        pdi.status === filtroStatus;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });
  }, [pdis, busca, filtroStatus]);

  const totalPDIs = pdis.length;

  const pdisEmAndamento = pdis.filter(
    (pdi) =>
      pdi.status === "Em andamento",
  ).length;

  const pdisConcluidos = pdis.filter(
    (pdi) =>
      pdi.status === "Concluído",
  ).length;

  const pdisAtrasados = pdis.filter(
    (pdi) =>
      pdi.status === "Atrasado",
  ).length;

  const progressoMedio =
    totalPDIs > 0
      ? Math.round(
          pdis.reduce(
            (total, pdi) =>
              total + pdi.progresso,
            0,
          ) / totalPDIs,
        )
      : 0;

  const colaboradorSelecionado =
    colaboradores.find(
      (colaborador) =>
        String(colaborador.id) ===
        novoPDI.colaboradorId,
    );

  function abrirDetalhes(pdi: PDIItem) {
    setPdiSelecionado(pdi);
    setModalDetalhes(true);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("Todos");
    setModalFiltros(false);
  }

  function voltarAoInicio() {
    router.replace("/");
  }

  async function cadastrarPDI() {
    if (
      !novoPDI.colaboradorId ||
      !novoPDI.objetivo.trim() ||
      !novoPDI.prazo.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha colaborador, objetivo e prazo.",
      );

      return;
    }

    const formatoData =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoData.test(novoPDI.prazo)) {
      Alert.alert(
        "Prazo inválido",
        "Digite a data no formato AAAA-MM-DD. Exemplo: 2026-12-20.",
      );

      return;
    }

    try {
      setSalvando(true);

      const response = await fetch(
        `${API_URL}/pdis`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            titulo: novoPDI.objetivo.trim(),

            objetivo:
              novoPDI.objetivo.trim(),

            descricao:
              novoPDI.descricao.trim() ||
              null,

            prazo: `${novoPDI.prazo}T00:00:00.000Z`,

            progresso: 0,

            status: "NAO_INICIADO",

            responsavel:
              novoPDI.responsavel.trim() ||
              null,

            colaboradorId: Number(
              novoPDI.colaboradorId,
            ),
          }),
        },
      );

      if (!response.ok) {
        const resultado = await response
          .json()
          .catch(() => null);

        throw new Error(
          resultado?.mensagem ??
            "Não foi possível cadastrar o PDI.",
        );
      }

      setNovoPDI({
        colaboradorId: "",
        objetivo: "",
        descricao: "",
        prazo: "",
        responsavel: "",
      });

      setModalNovoPDI(false);

      await carregarDados(true);

      Alert.alert(
        "Sucesso",
        "PDI cadastrado com sucesso.",
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar PDI.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(
    pdi: PDIItem,
  ) {
    Alert.alert(
      "Excluir PDI",
      `Deseja realmente excluir o PDI "${pdi.objetivo}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            excluirPDI(pdi.id),
        },
      ],
    );
  }

  async function excluirPDI(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/pdis/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const resultado = await response
          .json()
          .catch(() => null);

        throw new Error(
          resultado?.mensagem ??
            "Não foi possível excluir o PDI.",
        );
      }

      setPdis((atuais) =>
        atuais.filter(
          (pdi) => pdi.id !== id,
        ),
      );

      if (
        pdiSelecionado?.id === id
      ) {
        setModalDetalhes(false);
        setPdiSelecionado(null);
      }

      Alert.alert(
        "PDI excluído",
        "O plano foi removido com sucesso.",
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Erro ao excluir PDI.",
      );
    }
  }

  async function atualizarProgresso(
    progresso: number,
  ) {
    if (!pdiSelecionado) return;

    const progressoNormalizado =
      Math.max(
        0,
        Math.min(100, progresso),
      );

    let novoStatus: StatusPDI;

    if (progressoNormalizado >= 100) {
      novoStatus = "Concluído";
    } else if (
      progressoNormalizado > 0
    ) {
      novoStatus = "Em andamento";
    } else {
      novoStatus = "A iniciar";
    }

    try {
      const response = await fetch(
        `${API_URL}/pdis/${pdiSelecionado.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            progresso: progressoNormalizado,
            status:
              statusToBackend[
                novoStatus
              ],
          }),
        },
      );

      if (!response.ok) {
        const resultado = await response
          .json()
          .catch(() => null);

        throw new Error(
          resultado?.mensagem ??
            "Não foi possível atualizar o progresso.",
        );
      }

      const atualizado = {
        ...pdiSelecionado,
        progresso: progressoNormalizado,
        status: novoStatus,
      };

      setPdis((atuais) =>
        atuais.map((pdi) =>
          pdi.id === atualizado.id
            ? atualizado
            : pdi,
        ),
      );

      setPdiSelecionado(atualizado);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Erro ao atualizar progresso.",
      );
    }
  }

  function renderMetricCard(
    titulo: string,
    valor: string | number,
    subtitulo: string,
    icon:
      | "flag-outline"
      | "trending-up-outline"
      | "checkmark-circle-outline"
      | "rocket-outline",
    iconBackground: string,
    iconColor: string,
  ) {
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View style={styles.metricText}>
            <Text style={styles.metricTitle}>
              {titulo}
            </Text>

            <Text style={styles.metricValue}>
              {valor}
            </Text>
          </View>

          <View
            style={[
              styles.metricIcon,
              {
                backgroundColor:
                  iconBackground,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={21}
              color={iconColor}
            />
          </View>
        </View>

        <Text style={styles.metricSubtitle}>
          {subtitulo}
        </Text>
      </View>
    );
  }

  function renderPDI({
    item,
  }: {
    item: PDIItem;
  }) {
    const colors =
      getStatusColors(item.status);

    return (
      <View style={styles.pdiCard}>
        <View style={styles.pdiTop}>
          <View style={styles.pdiTitleArea}>
            <Text style={styles.pdiTitle}>
              {item.objetivo ||
                "PDI sem objetivo"}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={15}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            {item.colaborador}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="briefcase-outline"
            size={15}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            {item.cargo}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={15}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            Prazo: {item.prazo}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="people-outline"
            size={15}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            Responsável:{" "}
            {item.responsavel}
          </Text>
        </View>

        {!!item.descricao && (
          <Text
            style={styles.descricao}
            numberOfLines={2}
          >
            {item.descricao}
          </Text>
        )}

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Progresso
          </Text>

          <Text style={styles.progressValue}>
            {item.progresso}%
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(
                  item.progresso,
                  100,
                )}%`,
                backgroundColor:
                  colors.progress,
              },
            ]}
          />
        </View>

        <View style={styles.cardButtons}>
          <Pressable
            style={styles.detailsButton}
            onPress={() =>
              abrirDetalhes(item)
            }
          >
            <Ionicons
              name="eye-outline"
              size={17}
              color="#475569"
            />

            <Text
              style={
                styles.detailsButtonText
              }
            >
              Ver detalhes
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={() =>
              confirmarExclusao(item)
            }
          >
            <Ionicons
              name="trash-outline"
              size={17}
              color="#DC2626"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  if (carregando) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Carregando PDIs...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={pdisFiltrados}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={renderPDI}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() =>
              carregarDados(true)
            }
            tintColor="#4F46E5"
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
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  PDI
                </Text>

                <Text style={styles.subtitle}>
                  Plano de Desenvolvimento
                  Individual
                </Text>

                <Text
                  style={
                    styles.headerDescription
                  }
                >
                  Acompanhe o desenvolvimento e
                  evolução dos colaboradores.
                </Text>
              </View>

              <Pressable
                style={styles.addButton}
                onPress={() =>
                  setModalNovoPDI(true)
                }
              >
                <Ionicons
                  name="add"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.metricsGrid}>
              {renderMetricCard(
                "Total de PDIs",
                totalPDIs,
                "Planos cadastrados",
                "flag-outline",
                "#EEF2FF",
                "#4F46E5",
              )}

              {renderMetricCard(
                "Em andamento",
                pdisEmAndamento,
                "Em desenvolvimento",
                "trending-up-outline",
                "#EFF6FF",
                "#2563EB",
              )}

              {renderMetricCard(
                "Concluídos",
                pdisConcluidos,
                "Finalizados",
                "checkmark-circle-outline",
                "#ECFDF5",
                "#059669",
              )}

              {renderMetricCard(
                "Progresso médio",
                `${progressoMedio}%`,
                "Média geral",
                "rocket-outline",
                "#FAF5FF",
                "#9333EA",
              )}
            </View>

            {pdisAtrasados > 0 && (
              <View
                style={
                  styles.alertAtrasados
                }
              >
                <View
                  style={
                    styles.alertIcon
                  }
                >
                  <Ionicons
                    name="warning-outline"
                    size={21}
                    color="#DC2626"
                  />
                </View>

                <View
                  style={
                    styles.alertTextArea
                  }
                >
                  <Text
                    style={
                      styles.alertTitle
                    }
                  >
                    {pdisAtrasados}{" "}
                    {pdisAtrasados === 1
                      ? "PDI atrasado"
                      : "PDIs atrasados"}
                  </Text>

                  <Text
                    style={
                      styles.alertDescription
                    }
                  >
                    Verifique os prazos dos
                    planos de desenvolvimento.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.searchArea}>
              <View
                style={
                  styles.searchInputContainer
                }
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  value={busca}
                  onChangeText={setBusca}
                  placeholder="Colaborador ou objetivo..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchInput}
                />
              </View>

              <Pressable
                style={[
                  styles.filterButton,
                  filtroStatus !==
                    "Todos" &&
                    styles.filterButtonActive,
                ]}
                onPress={() =>
                  setModalFiltros(true)
                }
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={
                    filtroStatus !==
                    "Todos"
                      ? "#FFFFFF"
                      : "#475569"
                  }
                />
              </Pressable>
            </View>

            <View
              style={styles.listHeader}
            >
              <View>
                <Text
                  style={
                    styles.listHeaderTitle
                  }
                >
                  PDIs cadastrados
                </Text>

                <Text
                  style={
                    styles.listHeaderSubtitle
                  }
                >
                  {pdisFiltrados.length}{" "}
                  {pdisFiltrados.length ===
                  1
                    ? "resultado"
                    : "resultados"}
                </Text>
              </View>

              {(busca ||
                filtroStatus !==
                  "Todos") && (
                <Pressable
                  onPress={limparFiltros}
                >
                  <Text
                    style={
                      styles.clearFiltersText
                    }
                  >
                    Limpar filtros
                  </Text>
                </Pressable>
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="flag-outline"
                size={28}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum PDI encontrado
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              {pdis.length === 0
                ? "Ainda não existem PDIs cadastrados."
                : "Tente alterar os filtros da pesquisa."}
            </Text>
          </View>
        }
      />

      {/* FILTRO */}

      <Modal
        visible={modalFiltros}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalFiltros(false)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setModalFiltros(false)
          }
        >
          <Pressable
            style={styles.smallModal}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Filtrar PDIs
                </Text>

                <Text
                  style={styles.modalSubtitle}
                >
                  Selecione um status
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() =>
                  setModalFiltros(false)
                }
              >
                <Ionicons
                  name="close"
                  size={23}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <View
              style={
                styles.optionsContainer
              }
            >
              {[
                "Todos",
                "A iniciar",
                "Em andamento",
                "Concluído",
                "Atrasado",
              ].map((status) => {
                const selecionado =
                  filtroStatus === status;

                return (
                  <Pressable
                    key={status}
                    style={[
                      styles.optionButton,
                      selecionado &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      setFiltroStatus(
                        status,
                      );

                      setModalFiltros(
                        false,
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        selecionado &&
                          styles.optionButtonTextSelected,
                      ]}
                    >
                      {status === "Todos"
                        ? "Todos os status"
                        : status}
                    </Text>

                    {selecionado && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4F46E5"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* NOVO PDI */}

      <Modal
        visible={modalNovoPDI}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setModalNovoPDI(false)
        }
      >
        <SafeAreaView
          style={styles.modalPage}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                Novo PDI
              </Text>

              <Text
                style={styles.modalSubtitle}
              >
                Cadastre um novo plano de
                desenvolvimento.
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setModalNovoPDI(false)
              }
            >
              <Ionicons
                name="close"
                size={23}
                color="#64748B"
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={
              styles.form
            }
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>
              Colaborador *
            </Text>

            <Pressable
              style={styles.selectField}
              onPress={() =>
                setModalColaborador(true)
              }
            >
              <Text
                style={[
                  styles.selectFieldText,
                  !colaboradorSelecionado &&
                    styles.placeholderText,
                ]}
              >
                {colaboradorSelecionado
                  ? `${colaboradorSelecionado.nome} — ${colaboradorSelecionado.cargo}`
                  : "Selecione o colaborador"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color="#64748B"
              />
            </Pressable>

            <Text style={styles.label}>
              Objetivo *
            </Text>

            <TextInput
              style={styles.input}
              value={novoPDI.objetivo}
              onChangeText={(texto) =>
                setNovoPDI((atual) => ({
                  ...atual,
                  objetivo: texto,
                }))
              }
              placeholder="Ex.: Desenvolver liderança"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>
              Prazo *
            </Text>

            <TextInput
              style={styles.input}
              value={novoPDI.prazo}
              onChangeText={(texto) =>
                setNovoPDI((atual) => ({
                  ...atual,
                  prazo: texto,
                }))
              }
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#94A3B8"
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.inputHint}>
              Exemplo: 2026-12-20
            </Text>

            <Text style={styles.label}>
              Responsável
            </Text>

            <TextInput
              style={styles.input}
              value={
                novoPDI.responsavel
              }
              onChangeText={(texto) =>
                setNovoPDI((atual) => ({
                  ...atual,
                  responsavel: texto,
                }))
              }
              placeholder="Ex.: Gestor direto"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>
              Descrição
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              value={novoPDI.descricao}
              onChangeText={(texto) =>
                setNovoPDI((atual) => ({
                  ...atual,
                  descricao: texto,
                }))
              }
              placeholder="Descreva as ações, competências ou atividades..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[
                styles.saveButton,
                salvando &&
                  styles.buttonDisabled,
              ]}
              onPress={cadastrarPDI}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="save-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    Cadastrar PDI
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                setModalNovoPDI(false)
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* SELEÇÃO DE COLABORADOR */}

      <Modal
        visible={modalColaborador}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setModalColaborador(false)
        }
      >
        <SafeAreaView
          style={styles.modalPage}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                Colaborador
              </Text>

              <Text
                style={styles.modalSubtitle}
              >
                Selecione quem receberá o PDI.
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setModalColaborador(false)
              }
            >
              <Ionicons
                name="close"
                size={23}
                color="#64748B"
              />
            </Pressable>
          </View>

          <FlatList
            data={colaboradores}
            keyExtractor={(item) =>
              String(item.id)
            }
            contentContainerStyle={
              styles.colaboradoresList
            }
            renderItem={({ item }) => {
              const selecionado =
                novoPDI.colaboradorId ===
                String(item.id);

              return (
                <Pressable
                  style={[
                    styles.colaboradorOption,
                    selecionado &&
                      styles.colaboradorOptionSelected,
                  ]}
                  onPress={() => {
                    setNovoPDI(
                      (atual) => ({
                        ...atual,
                        colaboradorId:
                          String(
                            item.id,
                          ),
                      }),
                    );

                    setModalColaborador(
                      false,
                    );
                  }}
                >
                  <View
                    style={
                      styles.avatar
                    }
                  >
                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {item.nome
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colaboradorInfo
                    }
                  >
                    <Text
                      style={
                        styles.colaboradorNome
                      }
                    >
                      {item.nome}
                    </Text>

                    <Text
                      style={
                        styles.colaboradorCargo
                      }
                    >
                      {item.cargo}
                    </Text>
                  </View>

                  {selecionado && (
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color="#4F46E5"
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* DETALHES */}

      <Modal
        visible={modalDetalhes}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setModalDetalhes(false)
        }
      >
        <SafeAreaView
          style={styles.modalPage}
        >
          {pdiSelecionado && (
            <>
              <View
                style={styles.modalHeader}
              >
                <View
                  style={
                    styles.detailsHeaderText
                  }
                >
                  <Text
                    style={styles.modalTitle}
                  >
                    Detalhes do PDI
                  </Text>

                  <Text
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {
                      pdiSelecionado.colaborador
                    }
                  </Text>
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={() =>
                    setModalDetalhes(false)
                  }
                >
                  <Ionicons
                    name="close"
                    size={23}
                    color="#64748B"
                  />
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={
                  styles.detailsContent
                }
              >
                {(() => {
                  const colors =
                    getStatusColors(
                      pdiSelecionado.status,
                    );

                  return (
                    <View
                      style={[
                        styles.largeStatusBadge,
                        {
                          backgroundColor:
                            colors.background,
                          borderColor:
                            colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.largeStatusText,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {
                          pdiSelecionado.status
                        }
                      </Text>
                    </View>
                  );
                })()}

                <View
                  style={
                    styles.detailSection
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    OBJETIVO
                  </Text>

                  <Text
                    style={
                      styles.detailMainText
                    }
                  >
                    {pdiSelecionado.objetivo ||
                      "Objetivo não informado"}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailSection
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    DESCRIÇÃO
                  </Text>

                  <Text
                    style={
                      styles.detailDescription
                    }
                  >
                    {pdiSelecionado.descricao ||
                      "Nenhuma descrição informada."}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailCards
                  }
                >
                  <View
                    style={
                      styles.detailCard
                    }
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#4F46E5"
                    />

                    <Text
                      style={
                        styles.detailCardLabel
                      }
                    >
                      Colaborador
                    </Text>

                    <Text
                      style={
                        styles.detailCardValue
                      }
                    >
                      {
                        pdiSelecionado.colaborador
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailCard
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#4F46E5"
                    />

                    <Text
                      style={
                        styles.detailCardLabel
                      }
                    >
                      Prazo
                    </Text>

                    <Text
                      style={
                        styles.detailCardValue
                      }
                    >
                      {pdiSelecionado.prazo}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.progressDetailCard
                  }
                >
                  <View
                    style={
                      styles.progressDetailHeader
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.progressDetailTitle
                        }
                      >
                        Progresso
                      </Text>

                      <Text
                        style={
                          styles.progressDetailSubtitle
                        }
                      >
                        Atualize o andamento do
                        plano
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.progressDetailValue
                      }
                    >
                      {
                        pdiSelecionado.progresso
                      }
                      %
                    </Text>
                  </View>

                  <View
                    style={
                      styles.progressBackgroundLarge
                    }
                  >
                    <View
                      style={[
                        styles.progressBarLarge,
                        {
                          width: `${pdiSelecionado.progresso}%`,
                          backgroundColor:
                            getStatusColors(
                              pdiSelecionado.status,
                            ).progress,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={
                      styles.progressControls
                    }
                  >
                    <Pressable
                      style={
                        styles.progressControlButton
                      }
                      onPress={() =>
                        atualizarProgresso(
                          pdiSelecionado.progresso -
                            5,
                        )
                      }
                    >
                      <Ionicons
                        name="remove"
                        size={21}
                        color="#4F46E5"
                      />
                    </Pressable>

                    <Text
                      style={
                        styles.progressControlText
                      }
                    >
                      Ajustar de 5 em 5%
                    </Text>

                    <Pressable
                      style={
                        styles.progressControlButton
                      }
                      onPress={() =>
                        atualizarProgresso(
                          pdiSelecionado.progresso +
                            5,
                        )
                      }
                    >
                      <Ionicons
                        name="add"
                        size={21}
                        color="#4F46E5"
                      />
                    </Pressable>
                  </View>

                  <View
                    style={
                      styles.progressPresets
                    }
                  >
                    {[0, 25, 50, 75, 100].map(
                      (valor) => (
                        <Pressable
                          key={valor}
                          style={[
                            styles.progressPreset,
                            pdiSelecionado.progresso ===
                              valor &&
                              styles.progressPresetActive,
                          ]}
                          onPress={() =>
                            atualizarProgresso(
                              valor,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.progressPresetText,
                              pdiSelecionado.progresso ===
                                valor &&
                                styles.progressPresetTextActive,
                            ]}
                          >
                            {valor}%
                          </Text>
                        </Pressable>
                      ),
                    )}
                  </View>
                </View>

                <View
                  style={
                    styles.responsavelCard
                  }
                >
                  <Ionicons
                    name="people-outline"
                    size={21}
                    color="#4F46E5"
                  />

                  <View>
                    <Text
                      style={
                        styles.responsavelLabel
                      }
                    >
                      RESPONSÁVEL
                    </Text>

                    <Text
                      style={
                        styles.responsavelValue
                      }
                    >
                      {
                        pdiSelecionado.responsavel
                      }
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={
                    styles.deleteDetailButton
                  }
                  onPress={() =>
                    confirmarExclusao(
                      pdiSelecionado,
                    )
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color="#DC2626"
                  />

                  <Text
                    style={
                      styles.deleteDetailText
                    }
                  >
                    Excluir PDI
                  </Text>
                </Pressable>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
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
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },

  headerDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 4,
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 16,
  },

  metricCard: {
    width: "48.5%",
    minHeight: 125,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },

  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 5,
  },

  metricText: {
    flex: 1,
  },

  metricTitle: {
    fontSize: 11,
    lineHeight: 15,
    color: "#64748B",
  },

  metricValue: {
    marginTop: 7,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  metricIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  metricSubtitle: {
    marginTop: 9,
    fontSize: 10,
    color: "#64748B",
  },

  alertAtrasados: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },

  alertIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
  },

  alertTextArea: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#991B1B",
  },

  alertDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: "#B91C1C",
  },

  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 18,
  },

  searchInputContainer: {
    flex: 1,
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },

  filterButton: {
    width: 47,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  filterButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  listHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  listHeaderSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#64748B",
  },

  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },

  pdiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
  },

  pdiTop: {
    marginBottom: 11,
  },

  pdiTitleArea: {
    alignItems: "flex-start",
    gap: 8,
  },

  pdiTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 5,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  descricao: {
    marginTop: 11,
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  progressHeader: {
    marginTop: 15,
    marginBottom: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  progressValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  progressBackground: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
  },

  cardButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 15,
  },

  detailsButton: {
    flex: 1,
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  detailsButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  deleteButton: {
    width: 43,
    height: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },

  emptyCard: {
    paddingVertical: 45,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  emptyDescription: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
    color: "#64748B",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor:
      "rgba(15, 23, 42, 0.45)",
  },

  smallModal: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalPage: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748B",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  optionsContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    gap: 8,
  },

  optionButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 15,
  },

  optionButtonSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
  },

  optionButtonText: {
    fontSize: 14,
    color: "#475569",
  },

  optionButtonTextSelected: {
    fontWeight: "700",
    color: "#4338CA",
  },

  form: {
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    minHeight: 49,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#334155",
    backgroundColor: "#FFFFFF",
  },

  textArea: {
    minHeight: 115,
    paddingTop: 14,
    paddingBottom: 14,
  },

  inputHint: {
    marginTop: 5,
    fontSize: 11,
    color: "#94A3B8",
  },

  selectField: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },

  selectFieldText: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },

  placeholderText: {
    color: "#94A3B8",
  },

  saveButton: {
    marginTop: 25,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  cancelButton: {
    marginTop: 9,
    minHeight: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  colaboradoresList: {
    padding: 18,
    paddingBottom: 40,
  },

  colaboradorOption: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  colaboradorOptionSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  colaboradorInfo: {
    flex: 1,
  },

  colaboradorNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  colaboradorCargo: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  detailsHeaderText: {
    flex: 1,
  },

  detailsContent: {
    padding: 20,
    paddingBottom: 45,
  },

  largeStatusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },

  largeStatusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  detailSection: {
    marginBottom: 22,
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#94A3B8",
  },

  detailMainText: {
    marginTop: 7,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
    color: "#0F172A",
  },

  detailDescription: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },

  detailCards: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  detailCard: {
    flex: 1,
    minHeight: 115,
    padding: 14,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
  },

  detailCardLabel: {
    marginTop: 9,
    fontSize: 11,
    color: "#64748B",
  },

  detailCardValue: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#334155",
  },

  progressDetailCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 17,
    padding: 16,
    marginBottom: 16,
  },

  progressDetailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  progressDetailTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  progressDetailSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#64748B",
  },

  progressDetailValue: {
    fontSize: 23,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackgroundLarge: {
    height: 9,
    marginTop: 18,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
  },

  progressBarLarge: {
    height: "100%",
    borderRadius: 999,
  },

  progressControls: {
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressControlButton: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },

  progressControlText: {
    fontSize: 11,
    color: "#64748B",
  },

  progressPresets: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    marginTop: 15,
  },

  progressPreset: {
    flex: 1,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  progressPresetActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#4F46E5",
  },

  progressPresetText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },

  progressPresetTextActive: {
    color: "#FFFFFF",
  },

  responsavelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
  },

  responsavelLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#6366F1",
  },

  responsavelValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#312E81",
  },

  deleteDetailButton: {
    marginTop: 20,
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },

  deleteDetailText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },
});