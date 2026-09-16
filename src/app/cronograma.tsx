import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type StatusAtividade =
  | "Planejada"
  | "Em andamento"
  | "Concluída";

type TipoAtividade =
  | "Avaliação"
  | "Feedback"
  | "PDI";

type Atividade = {
  id: string;
  titulo: string;
  tipo: TipoAtividade;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  status: StatusAtividade;
  descricao: string;
  origem: string;
};

type CicloApi = {
  id: number;
  nome: string;
  descricao?: string | null;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  createdAt?: string;
};

type AvaliacaoApi = {
  id: number;
  nota?: number | null;
  status:
    | "PENDENTE"
    | "EM_ANDAMENTO"
    | "CONCLUIDA";
  comentario?: string | null;
  dataConclusao?: string | null;
  createdAt?: string | null;

  colaborador?: {
    id: number;
    nome: string;
    cargo?: string;
  };

  ciclo?: {
    id: number;
    nome: string;
    dataInicio?: string;
    dataFim?: string;
  };
};

type PdiApi = {
  id: number;
  titulo: string;
  descricao?: string | null;
  objetivo?: string | null;
  prazo?: string | null;
  progresso?: number;
  status:
    | "NAO_INICIADO"
    | "EM_ANDAMENTO"
    | "CONCLUIDO"
    | "ATRASADO";
  responsavel?: string | null;
  createdAt?: string | null;

  colaborador?: {
    id: number;
    nome: string;
    cargo?: string;
  };
};

type FeedbackApi = {
  id: number;
  titulo: string;
  conteudo: string;
  tipo:
    | "POSITIVO"
    | "DESENVOLVIMENTO"
    | "RECONHECIMENTO"
    | "OUTRO";
  data?: string | null;
  createdAt?: string | null;

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
};

const API_URL = "https://synerrh.onrender.com";

function obterLista<T>(dados: unknown): T[] {
  if (Array.isArray(dados)) {
    return dados as T[];
  }

  return [];
}

function formatarData(
  data: string | null | undefined
) {
  if (!data) {
    return "Não informada";
  }

  const dataSomente = data.slice(0, 10);

  const [ano, mes, dia] = dataSomente
    .split("-")
    .map(Number);

  if (!ano || !mes || !dia) {
    return "Não informada";
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(ano, mes - 1, dia)
  );
}

function obterTimestamp(
  data: string | null | undefined
) {
  if (!data) {
    return 0;
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return 0;
  }

  return valor.getTime();
}

function statusCiclo(
  ciclo: CicloApi
): StatusAtividade {
  if (ciclo.ativo) {
    return "Em andamento";
  }

  const agora = new Date().getTime();

  const inicio = obterTimestamp(
    ciclo.dataInicio
  );

  const fim = obterTimestamp(
    ciclo.dataFim
  );

  if (fim && fim < agora) {
    return "Concluída";
  }

  if (
    inicio &&
    inicio <= agora &&
    fim &&
    fim >= agora
  ) {
    return "Em andamento";
  }

  return "Planejada";
}

function statusAvaliacao(
  status: AvaliacaoApi["status"]
): StatusAtividade {
  switch (status) {
    case "CONCLUIDA":
      return "Concluída";

    case "EM_ANDAMENTO":
      return "Em andamento";

    default:
      return "Planejada";
  }
}

function statusPdi(
  status: PdiApi["status"]
): StatusAtividade {
  switch (status) {
    case "CONCLUIDO":
      return "Concluída";

    case "EM_ANDAMENTO":
    case "ATRASADO":
      return "Em andamento";

    default:
      return "Planejada";
  }
}

function getStatusCores(
  status: StatusAtividade
) {
  if (status === "Concluída") {
    return {
      fundo: "#ECFDF5",
      texto: "#047857",
      borda: "#A7F3D0",
    };
  }

  if (status === "Em andamento") {
    return {
      fundo: "#EEF2FF",
      texto: "#4338CA",
      borda: "#C7D2FE",
    };
  }

  return {
    fundo: "#FFFBEB",
    texto: "#B45309",
    borda: "#FDE68A",
  };
}

function getTipoIcone(
  tipo: TipoAtividade
): keyof typeof Ionicons.glyphMap {
  if (tipo === "Avaliação") {
    return "document-text-outline";
  }

  if (tipo === "Feedback") {
    return "chatbubble-outline";
  }

  return "flag-outline";
}

function getTipoCores(
  tipo: TipoAtividade
) {
  if (tipo === "Avaliação") {
    return {
      fundo: "#EEF2FF",
      texto: "#4F46E5",
    };
  }

  if (tipo === "Feedback") {
    return {
      fundo: "#EFF6FF",
      texto: "#2563EB",
    };
  }

  return {
    fundo: "#F5F3FF",
    texto: "#7C3AED",
  };
}

export default function Cronograma() {
  const [atividades, setAtividades] =
    useState<Atividade[]>([]);

  const [filtroStatus, setFiltroStatus] =
    useState<
      "Todos" | StatusAtividade
    >("Todos");

  const [filtroTipo, setFiltroTipo] =
    useState<
      "Todos" | TipoAtividade
    >("Todos");

  const [carregando, setCarregando] =
    useState(true);

  const [atualizando, setAtualizando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [modalFiltros, setModalFiltros] =
    useState(false);

  async function carregarCronograma(
    refresh = false
  ) {
    try {
      if (refresh) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      setErro("");

      const [
        ciclosResponse,
        avaliacoesResponse,
        pdisResponse,
        feedbacksResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/ciclos`),
        fetch(`${API_URL}/avaliacoes`),
        fetch(`${API_URL}/pdis`),
        fetch(`${API_URL}/feedbacks`),
      ]);

      if (!ciclosResponse.ok) {
        throw new Error(
          "Erro ao buscar ciclos."
        );
      }

      if (!avaliacoesResponse.ok) {
        throw new Error(
          "Erro ao buscar avaliações."
        );
      }

      if (!pdisResponse.ok) {
        throw new Error(
          "Erro ao buscar PDIs."
        );
      }

      if (!feedbacksResponse.ok) {
        throw new Error(
          "Erro ao buscar feedbacks."
        );
      }

      const ciclosJson =
        await ciclosResponse.json();

      const avaliacoesJson =
        await avaliacoesResponse.json();

      const pdisJson =
        await pdisResponse.json();

      const feedbacksJson =
        await feedbacksResponse.json();

      const ciclos =
        obterLista<CicloApi>(
          ciclosJson
        );

      const avaliacoes =
        obterLista<AvaliacaoApi>(
          avaliacoesJson
        );

      const pdis =
        obterLista<PdiApi>(
          pdisJson
        );

      const feedbacks =
        obterLista<FeedbackApi>(
          feedbacksJson
        );

      const atividadesCiclos:
        Atividade[] = ciclos.map(
        (ciclo) => ({
          id: `ciclo-${ciclo.id}`,

          titulo: ciclo.nome,

          tipo: "Avaliação",

          responsavel: "RH",

          dataInicio: formatarData(
            ciclo.dataInicio
          ),

          dataFim: formatarData(
            ciclo.dataFim
          ),

          status: statusCiclo(ciclo),

          descricao:
            ciclo.descricao ??
            "Ciclo de avaliação de desempenho.",

          origem:
            "Ciclo de avaliação",
        })
      );

      const atividadesAvaliacoes:
        Atividade[] = avaliacoes.map(
        (avaliacao) => {
          const dataInicio =
            avaliacao.ciclo?.dataInicio ??
            avaliacao.createdAt;

          const dataFim =
            avaliacao.dataConclusao ??
            avaliacao.ciclo?.dataFim ??
            dataInicio;

          return {
            id:
              `avaliacao-${avaliacao.id}`,

            titulo:
              `Avaliação — ${
                avaliacao.colaborador
                  ?.nome ??
                "Colaborador"
              }`,

            tipo: "Avaliação",

            responsavel:
              avaliacao.colaborador
                ?.nome ??
              "Não informado",

            dataInicio:
              formatarData(
                dataInicio
              ),

            dataFim:
              formatarData(
                dataFim
              ),

            status:
              statusAvaliacao(
                avaliacao.status
              ),

            descricao:
              avaliacao.comentario ??
              (
                avaliacao.ciclo?.nome
                  ? `Avaliação vinculada ao ciclo ${avaliacao.ciclo.nome}.`
                  : "Avaliação de desempenho."
              ),

            origem: "Avaliação",
          };
        }
      );

      const atividadesPdis:
        Atividade[] = pdis.map(
        (pdi) => ({
          id: `pdi-${pdi.id}`,

          titulo:
            `PDI — ${pdi.titulo}`,

          tipo: "PDI",

          responsavel:
            pdi.responsavel ??
            pdi.colaborador?.nome ??
            "Não informado",

          dataInicio:
            formatarData(
              pdi.createdAt
            ),

          dataFim:
            formatarData(
              pdi.prazo ??
              pdi.createdAt
            ),

          status:
            statusPdi(
              pdi.status
            ),

          descricao:
            pdi.descricao ??
            pdi.objetivo ??
            "Plano de desenvolvimento individual.",

          origem: "PDI",
        })
      );

      const atividadesFeedbacks:
        Atividade[] = feedbacks.map(
        (feedback) => {
          const data =
            feedback.data ??
            feedback.createdAt;

          return {
            id:
              `feedback-${feedback.id}`,

            titulo:
              `Feedback — ${feedback.titulo}`,

            tipo: "Feedback",

            responsavel:
              feedback.autor?.nome ??
              "Não informado",

            dataInicio:
              formatarData(data),

            dataFim:
              formatarData(data),

            status: "Concluída",

            descricao:
              feedback.conteudo,

            origem:
              feedback.colaborador?.nome
                ? `Feedback para ${feedback.colaborador.nome}`
                : "Feedback",
          };
        }
      );

      const todasAtividades = [
        ...atividadesCiclos,
        ...atividadesAvaliacoes,
        ...atividadesPdis,
        ...atividadesFeedbacks,
      ];

      setAtividades(
        todasAtividades
      );
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o cronograma."
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarCronograma();
  }, []);

  const atividadesFiltradas =
    useMemo(() => {
      return atividades.filter(
        (atividade) => {
          const correspondeStatus =
            filtroStatus ===
              "Todos" ||
            atividade.status ===
              filtroStatus;

          const correspondeTipo =
            filtroTipo ===
              "Todos" ||
            atividade.tipo ===
              filtroTipo;

          return (
            correspondeStatus &&
            correspondeTipo
          );
        }
      );
    }, [
      atividades,
      filtroStatus,
      filtroTipo,
    ]);

  const totalAtividades =
    atividades.length;

  const atividadesConcluidas =
    atividades.filter(
      (atividade) =>
        atividade.status ===
        "Concluída"
    ).length;

  const atividadesAndamento =
    atividades.filter(
      (atividade) =>
        atividade.status ===
        "Em andamento"
    ).length;

  const atividadesPlanejadas =
    atividades.filter(
      (atividade) =>
        atividade.status ===
        "Planejada"
    ).length;

  function limparFiltros() {
    setFiltroStatus("Todos");
    setFiltroTipo("Todos");
  }

  function voltarAoInicio() {
    router.replace("/");
  }

  function MetricCard({
    titulo,
    valor,
    icone,
    cor,
    fundo,
  }: {
    titulo: string;
    valor: number;
    icone: keyof typeof Ionicons.glyphMap;
    cor: string;
    fundo: string;
  }) {
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricTopo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metricTitulo}>
              {titulo}
            </Text>

            <Text style={styles.metricValor}>
              {carregando ? "—" : valor}
            </Text>
          </View>

          <View
            style={[
              styles.metricIcone,
              { backgroundColor: fundo },
            ]}
          >
            <Ionicons
              name={icone}
              size={18}
              color={cor}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderAtividade({
    item,
  }: {
    item: Atividade;
  }) {
    const statusCores =
      getStatusCores(
        item.status
      );

    const tipoCores =
      getTipoCores(
        item.tipo
      );

    return (
      <View style={styles.atividadeCard}>
        <View style={styles.atividadeTopo}>
          <View
            style={[
              styles.tipoIcone,
              {
                backgroundColor:
                  tipoCores.fundo,
              },
            ]}
          >
            <Ionicons
              name={getTipoIcone(
                item.tipo
              )}
              size={20}
              color={tipoCores.texto}
            />
          </View>

          <View style={styles.atividadeConteudo}>
            <Text style={styles.atividadeTitulo}>
              {item.titulo}
            </Text>

            <View style={styles.badgesLinha}>
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoBadgeTexto}>
                  {item.tipo}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      statusCores.fundo,
                    borderColor:
                      statusCores.borda,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeTexto,
                    {
                      color:
                        statusCores.texto,
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.descricao}>
              {item.descricao}
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoLinha}>
            <Ionicons
              name="person-outline"
              size={15}
              color="#64748B"
            />

            <Text style={styles.infoTexto}>
              <Text style={styles.infoNegrito}>
                {item.responsavel}
              </Text>
            </Text>
          </View>

          <View style={styles.infoLinha}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#64748B"
            />

            <Text style={styles.infoTexto}>
              <Text style={styles.infoNegrito}>
                {item.dataInicio}
              </Text>

              {" → "}

              <Text style={styles.infoNegrito}>
                {item.dataFim}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.origemBox}>
          <Text style={styles.origemTexto}>
            {item.origem}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={
          carregando
            ? []
            : atividadesFiltradas
        }
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderAtividade}
        contentContainerStyle={
          styles.container
        }
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() =>
              carregarCronograma(true)
            }
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
              <View style={{ flex: 1 }}>
                <Text style={styles.tituloPagina}>
                  Cronograma
                </Text>

                <Text style={styles.subtituloPagina}>
                  Acompanhe as etapas, períodos e prazos de
                  avaliação, feedback e desenvolvimento dos
                  colaboradores.
                </Text>
              </View>

              <Pressable
                style={styles.atualizarButton}
                onPress={() =>
                  carregarCronograma()
                }
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                  />
                ) : (
                  <Ionicons
                    name="refresh"
                    size={18}
                    color="#FFFFFF"
                  />
                )}

                <Text style={styles.atualizarTexto}>
                  {carregando
                    ? "Atualizando..."
                    : "Atualizar cronograma"}
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

                <Text style={styles.erroTexto}>
                  {erro}
                </Text>
              </View>
            ) : null}

            <View style={styles.metricGrid}>
              <MetricCard
                titulo="Total de atividades"
                valor={totalAtividades}
                icone="calendar-outline"
                cor="#4F46E5"
                fundo="#EEF2FF"
              />

              <MetricCard
                titulo="Concluídas"
                valor={atividadesConcluidas}
                icone="checkmark-circle-outline"
                cor="#059669"
                fundo="#ECFDF5"
              />

              <MetricCard
                titulo="Em andamento"
                valor={atividadesAndamento}
                icone="sync-outline"
                cor="#2563EB"
                fundo="#EFF6FF"
              />

              <MetricCard
                titulo="Planejadas"
                valor={atividadesPlanejadas}
                icone="pin-outline"
                cor="#D97706"
                fundo="#FFFBEB"
              />
            </View>

            <View style={styles.filtroCard}>
              <View style={styles.filtroHeader}>
                <View>
                  <Text style={styles.filtroTitulo}>
                    Filtros
                  </Text>

                  <Text style={styles.filtroSubtitulo}>
                    Refine as atividades exibidas no cronograma.
                  </Text>
                </View>

                {(filtroStatus !== "Todos" ||
                  filtroTipo !== "Todos") && (
                  <Pressable
                    onPress={limparFiltros}
                  >
                    <Text style={styles.limparTexto}>
                      Limpar
                    </Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                style={styles.filtroButton}
                onPress={() =>
                  setModalFiltros(true)
                }
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color="#475569"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroButtonLabel}>
                    Status
                  </Text>

                  <Text style={styles.filtroButtonValor}>
                    {filtroStatus === "Todos"
                      ? "Todos os status"
                      : filtroStatus}
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
                onPress={() =>
                  setModalFiltros(true)
                }
              >
                <Ionicons
                  name="layers-outline"
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
                Atividades
              </Text>

              <Text style={styles.listaQuantidade}>
                {atividadesFiltradas.length} resultado
                {atividadesFiltradas.length === 1
                  ? ""
                  : "s"}
              </Text>
            </View>

            {carregando && (
              <View style={styles.loadingBox}>
                <ActivityIndicator
                  size="large"
                  color="#4F46E5"
                />

                <Text style={styles.loadingTexto}>
                  Carregando cronograma...
                </Text>
              </View>
            )}

            {!carregando &&
              atividadesFiltradas.length === 0 && (
                <View style={styles.vazioBox}>
                  <Ionicons
                    name="calendar-outline"
                    size={38}
                    color="#94A3B8"
                  />

                  <Text style={styles.vazioTitulo}>
                    Nenhuma atividade encontrada
                  </Text>

                  <Text style={styles.vazioTexto}>
                    Não existem atividades para os filtros
                    selecionados.
                  </Text>
                </View>
              )}
          </>
        }
      />

      <Modal
        visible={modalFiltros}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalFiltros(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                Filtros
              </Text>

              <Pressable
                onPress={() =>
                  setModalFiltros(false)
                }
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
                Status
              </Text>

              {(
                [
                  "Todos",
                  "Planejada",
                  "Em andamento",
                  "Concluída",
                ] as const
              ).map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.opcao,
                    filtroStatus === status &&
                      styles.opcaoSelecionada,
                  ]}
                  onPress={() =>
                    setFiltroStatus(status)
                  }
                >
                  <Text style={styles.opcaoTexto}>
                    {status === "Todos"
                      ? "Todos os status"
                      : status}
                  </Text>
                </Pressable>
              ))}

              <Text
                style={[
                  styles.campoLabel,
                  { marginTop: 20 },
                ]}
              >
                Tipo
              </Text>

              {(
                [
                  "Todos",
                  "Avaliação",
                  "Feedback",
                  "PDI",
                ] as const
              ).map((tipo) => (
                <Pressable
                  key={tipo}
                  style={[
                    styles.opcao,
                    filtroTipo === tipo &&
                      styles.opcaoSelecionada,
                  ]}
                  onPress={() =>
                    setFiltroTipo(tipo)
                  }
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
                onPress={() =>
                  setModalFiltros(false)
                }
              >
                <Text style={styles.aplicarButtonTexto}>
                  Aplicar filtros
                </Text>
              </Pressable>
            </ScrollView>
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

  atualizarButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 18,
  },

  atualizarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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
    flex: 1,
    color: "#B91C1C",
    fontSize: 13,
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
    minHeight: 110,
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
    gap: 10,
    marginBottom: 4,
  },

  filtroTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  filtroSubtitulo: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
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
    marginTop: 2,
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
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

  atividadeCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  atividadeTopo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },

  tipoIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  atividadeConteudo: {
    flex: 1,
  },

  atividadeTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 21,
  },

  badgesLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 8,
  },

  tipoBadge: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  tipoBadgeTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },

  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  statusBadgeTexto: {
    fontSize: 10,
    fontWeight: "700",
  },

  descricao: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  infoBox: {
    marginTop: 14,
    gap: 8,
  },

  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  infoTexto: {
    flex: 1,
    fontSize: 11,
    color: "#64748B",
  },

  infoNegrito: {
    fontWeight: "700",
    color: "#475569",
  },

  origemBox: {
    marginTop: 13,
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  origemTexto: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
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
    lineHeight: 18,
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

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  campoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 7,
    marginTop: 8,
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

  aplicarButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 10,
  },

  aplicarButtonTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});