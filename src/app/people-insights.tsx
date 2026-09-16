import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ColaboradorApi = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: "ATIVO" | "FERIAS" | "AFASTADO" | "INATIVO";
};

type AvaliacaoApi = {
  id: number;
  nota: number | null;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
  colaboradorId: number;
  cicloId: number;
  colaborador?: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
  };
};

type PdiApi = {
  id: number;
  titulo: string;
  descricao?: string | null;
  objetivo?: string | null;
  prazo?: string | null;
  progresso: number;
  status:
    | "NAO_INICIADO"
    | "EM_ANDAMENTO"
    | "CONCLUIDO"
    | "ATRASADO";
  responsavel?: string | null;
  colaboradorId: number;
  colaborador?: {
    id: number;
    nome: string;
    cargo?: string;
    departamento?: string;
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
  data: string | null;
  colaboradorId: number;
  autorId?: number | null;
  colaborador?: {
    id: number;
    nome: string;
    cargo?: string;
    departamento?: string;
  };
  autor?: {
    id: number;
    nome: string;
    cargo?: string;
  } | null;
};

type InsightNivel =
  | "CRITICO"
  | "ATENCAO"
  | "POSITIVO"
  | "INFORMATIVO";

type Insight = {
  id: string;
  nivel: InsightNivel;
  titulo: string;
  descricao: string;
  recomendacao: string;
  icone: string;
};

type PessoaDestaque = {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  media: number;
};

type AreaResumo = {
  departamento: string;
  media: number;
  quantidade: number;
};

type FiltroNivel = "TODOS" | InsightNivel;

const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  "https://synerrh.onrender.com";

function formatarNota(valor: number) {
  return valor.toFixed(1).replace(".", ",");
}

function nomeNivel(nivel: InsightNivel) {
  switch (nivel) {
    case "CRITICO":
      return "Crítico";
    case "ATENCAO":
      return "Atenção";
    case "POSITIVO":
      return "Positivo";
    default:
      return "Informativo";
  }
}

function coresInsight(nivel: InsightNivel) {
  switch (nivel) {
    case "CRITICO":
      return {
        fundo: "#FEF2F2",
        borda: "#FECACA",
        badge: "#FEE2E2",
        texto: "#B91C1C",
        titulo: "#7F1D1D",
      };

    case "ATENCAO":
      return {
        fundo: "#FFFBEB",
        borda: "#FDE68A",
        badge: "#FEF3C7",
        texto: "#B45309",
        titulo: "#92400E",
      };

    case "POSITIVO":
      return {
        fundo: "#ECFDF5",
        borda: "#A7F3D0",
        badge: "#D1FAE5",
        texto: "#047857",
        titulo: "#065F46",
      };

    default:
      return {
        fundo: "#EFF6FF",
        borda: "#BFDBFE",
        badge: "#DBEAFE",
        texto: "#1D4ED8",
        titulo: "#1E3A8A",
      };
  }
}

export default function PeopleInsights() {
  const [colaboradores, setColaboradores] = useState<ColaboradorApi[]>(
    [],
  );

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoApi[]>([]);
  const [pdis, setPdis] = useState<PdiApi[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackApi[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const [filtroNivel, setFiltroNivel] =
    useState<FiltroNivel>("TODOS");

  const carregarDados = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setAtualizando(true);
        } else {
          setCarregando(true);
        }

        setErro("");

        const [
          colaboradoresResponse,
          avaliacoesResponse,
          pdisResponse,
          feedbacksResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/colaboradores`),
          fetch(`${API_URL}/avaliacoes`),
          fetch(`${API_URL}/pdis`),
          fetch(`${API_URL}/feedbacks`),
        ]);

        if (
          !colaboradoresResponse.ok ||
          !avaliacoesResponse.ok ||
          !pdisResponse.ok ||
          !feedbacksResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os dados para análise.",
          );
        }

        const [
          colaboradoresData,
          avaliacoesData,
          pdisData,
          feedbacksData,
        ] = await Promise.all([
          colaboradoresResponse.json(),
          avaliacoesResponse.json(),
          pdisResponse.json(),
          feedbacksResponse.json(),
        ]);

        setColaboradores(
          Array.isArray(colaboradoresData)
            ? colaboradoresData
            : [],
        );

        setAvaliacoes(
          Array.isArray(avaliacoesData) ? avaliacoesData : [],
        );

        setPdis(Array.isArray(pdisData) ? pdisData : []);

        setFeedbacks(
          Array.isArray(feedbacksData) ? feedbacksData : [],
        );
      } catch (error) {
        console.error("Erro People Insights:", error);

        setErro(
          "Não foi possível carregar os dados do People Insights.",
        );
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [],
  );

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const colaboradorPorId = useCallback(
    (id: number) =>
      colaboradores.find(
        (colaborador) => colaborador.id === id,
      ),
    [colaboradores],
  );

  const avaliacoesConcluidas = useMemo(
    () =>
      avaliacoes.filter(
        (avaliacao) => avaliacao.status === "CONCLUIDA",
      ),
    [avaliacoes],
  );

  const avaliacoesPendentes = useMemo(
    () =>
      avaliacoes.filter(
        (avaliacao) => avaliacao.status === "PENDENTE",
      ),
    [avaliacoes],
  );

  const avaliacoesEmAndamento = useMemo(
    () =>
      avaliacoes.filter(
        (avaliacao) => avaliacao.status === "EM_ANDAMENTO",
      ),
    [avaliacoes],
  );

  const pdisAtrasados = useMemo(
    () => pdis.filter((pdi) => pdi.status === "ATRASADO"),
    [pdis],
  );

  const pdisConcluidos = useMemo(
    () => pdis.filter((pdi) => pdi.status === "CONCLUIDO"),
    [pdis],
  );

  const feedbacksDesenvolvimento = useMemo(
    () =>
      feedbacks.filter(
        (feedback) => feedback.tipo === "DESENVOLVIMENTO",
      ),
    [feedbacks],
  );

  const feedbacksPositivos = useMemo(
    () =>
      feedbacks.filter(
        (feedback) =>
          feedback.tipo === "POSITIVO" ||
          feedback.tipo === "RECONHECIMENTO",
      ),
    [feedbacks],
  );

  const desempenhoMedio = useMemo(() => {
    const avaliacoesComNota = avaliacoes.filter(
      (avaliacao) => typeof avaliacao.nota === "number",
    );

    if (avaliacoesComNota.length === 0) {
      return 0;
    }

    return (
      avaliacoesComNota.reduce(
        (total, avaliacao) =>
          total + Number(avaliacao.nota),
        0,
      ) / avaliacoesComNota.length
    );
  }, [avaliacoes]);

  const pessoasDestaque = useMemo<PessoaDestaque[]>(() => {
    const notasPorPessoa = new Map<number, number[]>();

    avaliacoes.forEach((avaliacao) => {
      if (typeof avaliacao.nota !== "number") {
        return;
      }

      const notas =
        notasPorPessoa.get(avaliacao.colaboradorId) ?? [];

      notas.push(avaliacao.nota);

      notasPorPessoa.set(avaliacao.colaboradorId, notas);
    });

    return Array.from(notasPorPessoa.entries())
      .map(([colaboradorId, notas]) => {
        const colaborador = colaboradores.find(
          (item) => item.id === colaboradorId,
        );

        if (!colaborador) {
          return null;
        }

        const media =
          notas.reduce((total, nota) => total + nota, 0) /
          notas.length;

        return {
          id: colaborador.id,
          nome: colaborador.nome,
          cargo: colaborador.cargo,
          departamento: colaborador.departamento,
          media,
        };
      })
      .filter(
        (item): item is PessoaDestaque => item !== null,
      )
      .sort((a, b) => b.media - a.media)
      .slice(0, 5);
  }, [avaliacoes, colaboradores]);

  const desempenhoPorArea = useMemo<AreaResumo[]>(() => {
    const areas = new Map<string, number[]>();

    avaliacoes.forEach((avaliacao) => {
      if (typeof avaliacao.nota !== "number") {
        return;
      }

      const colaborador =
        avaliacao.colaborador ??
        colaboradores.find(
          (item) => item.id === avaliacao.colaboradorId,
        );

      if (!colaborador) {
        return;
      }

      const notas =
        areas.get(colaborador.departamento) ?? [];

      notas.push(avaliacao.nota);

      areas.set(colaborador.departamento, notas);
    });

    return Array.from(areas.entries())
      .map(([departamento, notas]) => ({
        departamento,
        media:
          notas.reduce((total, nota) => total + nota, 0) /
          notas.length,
        quantidade: notas.length,
      }))
      .sort((a, b) => b.media - a.media);
  }, [avaliacoes, colaboradores]);

  const insights = useMemo<Insight[]>(() => {
    const resultado: Insight[] = [];

    if (pdisAtrasados.length > 0) {
      const nomes = pdisAtrasados
        .slice(0, 3)
        .map(
          (pdi) =>
            pdi.colaborador?.nome ??
            colaboradorPorId(pdi.colaboradorId)?.nome ??
            "Colaborador",
        )
        .join(", ");

      resultado.push({
        id: "pdis-atrasados",
        nivel: "CRITICO",
        titulo: `${pdisAtrasados.length} PDIs estão atrasados`,
        descricao: `Os planos atrasados exigem acompanhamento prioritário. Entre os colaboradores impactados estão ${nomes}.`,
        recomendacao:
          "Revisar prazos, remover bloqueios e combinar uma nova data de acompanhamento com os responsáveis.",
        icone: "🎯",
      });
    }

    if (avaliacoesPendentes.length > 0) {
      resultado.push({
        id: "avaliacoes-pendentes",
        nivel: "ATENCAO",
        titulo: `${avaliacoesPendentes.length} avaliações ainda não foram iniciadas`,
        descricao:
          "Parte do ciclo ainda aguarda início, o que pode reduzir a participação final caso não haja acompanhamento.",
        recomendacao:
          "Priorizar a comunicação com colaboradores e gestores que ainda possuem avaliações pendentes.",
        icone: "📋",
      });
    }

    if (avaliacoesEmAndamento.length > 0) {
      resultado.push({
        id: "avaliacoes-andamento",
        nivel: "INFORMATIVO",
        titulo: `${avaliacoesEmAndamento.length} avaliações estão em andamento`,
        descricao:
          "Existem avaliações já iniciadas que ainda precisam ser concluídas dentro do ciclo.",
        recomendacao:
          "Acompanhar a evolução e reforçar o prazo de conclusão do ciclo.",
        icone: "↗️",
      });
    }

    if (feedbacksDesenvolvimento.length > 0) {
      const pessoas = Array.from(
        new Set(
          feedbacksDesenvolvimento.map(
            (feedback) =>
              feedback.colaborador?.nome ??
              colaboradorPorId(feedback.colaboradorId)?.nome ??
              "Colaborador",
          ),
        ),
      );

      resultado.push({
        id: "feedback-desenvolvimento",
        nivel: "ATENCAO",
        titulo: `${feedbacksDesenvolvimento.length} feedbacks de desenvolvimento`,
        descricao: `Os feedbacks estão concentrados em ${pessoas.length} colaborador(es), indicando oportunidades de evolução.`,
        recomendacao:
          "Transformar pontos recorrentes em ações de PDI e acompanhar a evolução nos próximos feedbacks.",
        icone: "💬",
      });
    }

    if (feedbacksPositivos.length > 0) {
      resultado.push({
        id: "feedbacks-positivos",
        nivel: "POSITIVO",
        titulo: `${feedbacksPositivos.length} feedbacks positivos`,
        descricao:
          "Há sinais de reconhecimento e reforço positivo registrados no período.",
        recomendacao:
          "Manter a frequência de reconhecimento e aproveitar os destaques como referência de boas práticas.",
        icone: "✨",
      });
    }

    if (
      pessoasDestaque.length > 0 &&
      pessoasDestaque[0].media >= 9
    ) {
      const destaque = pessoasDestaque[0];

      resultado.push({
        id: "destaque-desempenho",
        nivel: "POSITIVO",
        titulo: `${destaque.nome} é destaque de desempenho`,
        descricao: `A média atual é ${formatarNota(
          destaque.media,
        )}, uma das maiores entre as avaliações registradas.`,
        recomendacao:
          "Reconhecer o resultado e avaliar oportunidades de novos desafios, protagonismo ou compartilhamento de conhecimento.",
        icone: "🏆",
      });
    }

    const areaMenorMedia =
      desempenhoPorArea.length > 0
        ? desempenhoPorArea[
            desempenhoPorArea.length - 1
          ]
        : null;

    if (
      areaMenorMedia &&
      areaMenorMedia.media < desempenhoMedio
    ) {
      resultado.push({
        id: "area-atencao",
        nivel: "ATENCAO",
        titulo: `${areaMenorMedia.departamento} está abaixo da média`,
        descricao: `A área apresenta média ${formatarNota(
          areaMenorMedia.media,
        )}, enquanto a média geral é ${formatarNota(
          desempenhoMedio,
        )}.`,
        recomendacao:
          "Analisar o contexto, feedbacks e PDIs da área antes de definir ações de desenvolvimento.",
        icone: "📊",
      });
    }

    if (pdisConcluidos.length > 0) {
      resultado.push({
        id: "pdis-concluidos",
        nivel: "POSITIVO",
        titulo: `${pdisConcluidos.length} PDIs já foram concluídos`,
        descricao:
          "Há planos de desenvolvimento finalizados, demonstrando avanço nas ações propostas.",
        recomendacao:
          "Registrar aprendizados e definir próximos desafios para manter a evolução contínua.",
        icone: "✅",
      });
    }

    return resultado;
  }, [
    pdisAtrasados,
    pdisConcluidos,
    avaliacoesPendentes,
    avaliacoesEmAndamento,
    feedbacksDesenvolvimento,
    feedbacksPositivos,
    pessoasDestaque,
    desempenhoPorArea,
    desempenhoMedio,
    colaboradorPorId,
  ]);

  const insightsFiltrados = useMemo(() => {
    if (filtroNivel === "TODOS") {
      return insights;
    }

    return insights.filter(
      (insight) => insight.nivel === filtroNivel,
    );
  }, [insights, filtroNivel]);

  const totalCriticos = insights.filter(
    (insight) => insight.nivel === "CRITICO",
  ).length;

  const totalAtencao = insights.filter(
    (insight) => insight.nivel === "ATENCAO",
  ).length;

  const totalPositivos = insights.filter(
    (insight) => insight.nivel === "POSITIVO",
  ).length;

  const participacao =
    avaliacoes.length > 0
      ? Math.round(
          (avaliacoesConcluidas.length / avaliacoes.length) *
            100,
        )
      : 0;

  const dadosAnalisados =
    avaliacoes.length + pdis.length + feedbacks.length;

  const filtros: {
    label: string;
    value: FiltroNivel;
  }[] = [
    { label: "Todos", value: "TODOS" },
    { label: "Críticos", value: "CRITICO" },
    { label: "Atenção", value: "ATENCAO" },
    { label: "Positivos", value: "POSITIVO" },
    { label: "Informativos", value: "INFORMATIVO" },
  ];

  function voltarAoInicio() {
    router.replace("/");
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <Text style={styles.loadingEmoji}>✦</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />

        <Text style={styles.loadingTitle}>
          Analisando dados...
        </Text>

        <Text style={styles.loadingText}>
          Preparando os People Insights do SynerRH.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={() => carregarDados(true)}
          colors={["#2563EB"]}
          tintColor="#2563EB"
        />
      }
    >
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

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.badgesRow}>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeBlueText}>
              PEOPLE INSIGHTS
            </Text>
          </View>

          <View style={styles.badgePurple}>
            <Text style={styles.badgePurpleText}>
              Dados reais
            </Text>
          </View>
        </View>

        <Text style={styles.title}>People Insights</Text>

        <Text style={styles.subtitle}>
          Transforme dados de avaliações, PDIs e feedbacks em
          sinais para apoiar decisões de RH e liderança.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => carregarDados(true)}
        >
          <Text style={styles.refreshButtonText}>
            ↻ Atualizar análises
          </Text>
        </Pressable>
      </View>

      {/* ERRO */}
      {erro ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Não foi possível carregar os dados
          </Text>

          <Text style={styles.errorText}>{erro}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => carregarDados()}
          >
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* MÉTRICAS */}
      <Text style={styles.sectionLabel}>VISÃO GERAL</Text>

      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <View style={styles.metricTop}>
            <Text style={styles.metricIcon}>✦</Text>
            <Text style={styles.metricValue}>
              {dadosAnalisados}
            </Text>
          </View>

          <Text style={styles.metricTitle}>
            Dados analisados
          </Text>

          <Text style={styles.metricDescription}>
            {avaliacoes.length} avaliações · {pdis.length} PDIs ·{" "}
            {feedbacks.length} feedbacks
          </Text>
        </View>

        <View style={[styles.metricCard, styles.metricRed]}>
          <View style={styles.metricTop}>
            <Text style={styles.metricIcon}>⚠️</Text>
            <Text
              style={[
                styles.metricValue,
                styles.metricValueRed,
              ]}
            >
              {totalCriticos}
            </Text>
          </View>

          <Text style={styles.metricTitle}>
            Pontos críticos
          </Text>

          <Text style={styles.metricDescriptionRed}>
            Exigem prioridade
          </Text>
        </View>

        <View style={[styles.metricCard, styles.metricAmber]}>
          <View style={styles.metricTop}>
            <Text style={styles.metricIcon}>👀</Text>
            <Text
              style={[
                styles.metricValue,
                styles.metricValueAmber,
              ]}
            >
              {totalAtencao}
            </Text>
          </View>

          <Text style={styles.metricTitle}>
            Pontos de atenção
          </Text>

          <Text style={styles.metricDescriptionAmber}>
            Merecem acompanhamento
          </Text>
        </View>

        <View style={[styles.metricCard, styles.metricGreen]}>
          <View style={styles.metricTop}>
            <Text style={styles.metricIcon}>🚀</Text>
            <Text
              style={[
                styles.metricValue,
                styles.metricValueGreen,
              ]}
            >
              {totalPositivos}
            </Text>
          </View>

          <Text style={styles.metricTitle}>
            Sinais positivos
          </Text>

          <Text style={styles.metricDescriptionGreen}>
            Destaques identificados
          </Text>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>MÉDIA GERAL</Text>

          <Text style={styles.summaryValue}>
            {desempenhoMedio > 0
              ? formatarNota(desempenhoMedio)
              : "—"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>PARTICIPAÇÃO</Text>

          <Text style={styles.summaryValue}>
            {participacao}%
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            PDIS ATRASADOS
          </Text>

          <Text
            style={[
              styles.summaryValue,
              styles.summaryRed,
            ]}
          >
            {pdisAtrasados.length}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            FEEDBACKS POSITIVOS
          </Text>

          <Text
            style={[
              styles.summaryValue,
              styles.summaryGreen,
            ]}
          >
            {feedbacksPositivos.length}
          </Text>
        </View>
      </View>

      {/* INSIGHTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          💡 Insights gerados
        </Text>

        <Text style={styles.sectionSubtitle}>
          Recomendações calculadas automaticamente a partir
          dos dados atuais.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filtros.map((filtro) => {
            const ativo = filtroNivel === filtro.value;

            return (
              <Pressable
                key={filtro.value}
                onPress={() =>
                  setFiltroNivel(filtro.value)
                }
                style={[
                  styles.filterButton,
                  ativo && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    ativo && styles.filterButtonTextActive,
                  ]}
                >
                  {filtro.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.insightsList}>
          {insightsFiltrados.length > 0 ? (
            insightsFiltrados.map((insight) => {
              const cores = coresInsight(insight.nivel);

              return (
                <View
                  key={insight.id}
                  style={[
                    styles.insightCard,
                    {
                      backgroundColor: cores.fundo,
                      borderColor: cores.borda,
                    },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <View
                      style={[
                        styles.insightIcon,
                        {
                          backgroundColor: cores.badge,
                        },
                      ]}
                    >
                      <Text style={styles.insightEmoji}>
                        {insight.icone}
                      </Text>
                    </View>

                    <View style={styles.insightHeaderText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: cores.titulo },
                        ]}
                      >
                        {insight.titulo}
                      </Text>

                      <View
                        style={[
                          styles.insightBadge,
                          {
                            backgroundColor: cores.badge,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.insightBadgeText,
                            { color: cores.texto },
                          ]}
                        >
                          {nomeNivel(insight.nivel)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.insightDescription,
                      { color: cores.texto },
                    ]}
                  >
                    {insight.descricao}
                  </Text>

                  <View style={styles.recommendation}>
                    <Text style={styles.recommendationLabel}>
                      RECOMENDAÇÃO
                    </Text>

                    <Text style={styles.recommendationText}>
                      {insight.recomendacao}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🔎</Text>

              <Text style={styles.emptyTitle}>
                Nenhum insight encontrado
              </Text>

              <Text style={styles.emptyText}>
                Não existem dados para esse filtro no momento.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* DESTAQUES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Destaques</Text>

        <Text style={styles.sectionSubtitle}>
          Maiores médias entre as avaliações registradas.
        </Text>

        <View style={styles.rankingList}>
          {pessoasDestaque.length > 0 ? (
            pessoasDestaque.map((pessoa, index) => (
              <View
                key={pessoa.id}
                style={styles.rankingCard}
              >
                <View style={styles.rankingPosition}>
                  <Text style={styles.rankingPositionText}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.rankingInfo}>
                  <Text
                    style={styles.rankingName}
                    numberOfLines={1}
                  >
                    {pessoa.nome}
                  </Text>

                  <Text
                    style={styles.rankingRole}
                    numberOfLines={1}
                  >
                    {pessoa.cargo}
                  </Text>

                  <Text
                    style={styles.rankingDepartment}
                    numberOfLines={1}
                  >
                    {pessoa.departamento}
                  </Text>
                </View>

                <View style={styles.rankingScore}>
                  <Text style={styles.rankingScoreText}>
                    {formatarNota(pessoa.media)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🏆</Text>

              <Text style={styles.emptyTitle}>
                Sem avaliações com nota
              </Text>

              <Text style={styles.emptyText}>
                Os destaques aparecerão quando existirem
                avaliações concluídas com nota.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* DESEMPENHO POR ÁREA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📊 Leitura por departamento
        </Text>

        <Text style={styles.sectionSubtitle}>
          Comparação das médias atuais entre as áreas.
        </Text>

        <View style={styles.departmentList}>
          {desempenhoPorArea.length > 0 ? (
            desempenhoPorArea.map((area) => {
              const percentual = Math.min(
                100,
                area.media * 10,
              );

              return (
                <View
                  key={area.departamento}
                  style={styles.departmentCard}
                >
                  <View style={styles.departmentHeader}>
                    <View style={styles.departmentInfo}>
                      <Text style={styles.departmentName}>
                        {area.departamento}
                      </Text>

                      <Text
                        style={styles.departmentQuantity}
                      >
                        {area.quantidade} avaliação(ões) com nota
                      </Text>
                    </View>

                    <Text style={styles.departmentScore}>
                      {formatarNota(area.media)}
                    </Text>
                  </View>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentual}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📊</Text>

              <Text style={styles.emptyTitle}>
                Sem dados por departamento
              </Text>

              <Text style={styles.emptyText}>
                As médias aparecerão quando existirem
                avaliações com notas.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ANÁLISE INTELIGENTE */}
      <View style={styles.aiCard}>
        <View style={styles.aiIcon}>
          <Text style={styles.aiEmoji}>🤖</Text>
        </View>

        <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>
            People Insights — análise inteligente
          </Text>

          <Text style={styles.aiText}>
            Esta versão analisa automaticamente os dados reais
            do SynerRH e transforma indicadores de avaliações,
            PDIs e feedbacks em alertas e recomendações.
          </Text>

          <Text style={styles.aiImportant}>
            Os insights apoiam a decisão e não substituem a
            análise humana de RH e gestores.
          </Text>
        </View>
      </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
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
    marginBottom: 22,
  },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  badgeBlue: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeBlueText: {
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  badgePurple: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgePurpleText: {
    color: "#6D28D9",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  title: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },

  refreshButton: {
    marginTop: 16,
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#DBE4F0",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  refreshButtonText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  errorCard: {
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },

  errorTitle: {
    color: "#991B1B",
    fontWeight: "800",
    fontSize: 14,
  },

  errorText: {
    marginTop: 5,
    color: "#B91C1C",
    fontSize: 12,
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#DC2626",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  sectionLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  metricCard: {
    width: "48.5%",
    minHeight: 145,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 14,
  },

  metricRed: {
    borderColor: "#FECACA",
  },

  metricAmber: {
    borderColor: "#FDE68A",
  },

  metricGreen: {
    borderColor: "#A7F3D0",
  },

  metricTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metricIcon: {
    fontSize: 19,
  },

  metricValue: {
    color: "#0F172A",
    fontSize: 25,
    fontWeight: "800",
  },

  metricValueRed: {
    color: "#DC2626",
  },

  metricValueAmber: {
    color: "#D97706",
  },

  metricValueGreen: {
    color: "#059669",
  },

  metricTitle: {
    marginTop: 17,
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
  },

  metricDescription: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 9.5,
    lineHeight: 14,
  },

  metricDescriptionRed: {
    marginTop: 5,
    color: "#DC2626",
    fontSize: 9.5,
  },

  metricDescriptionAmber: {
    marginTop: 5,
    color: "#D97706",
    fontSize: 9.5,
  },

  metricDescriptionGreen: {
    marginTop: 5,
    color: "#059669",
    fontSize: 9.5,
  },

  summaryGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  summaryCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    padding: 14,
  },

  summaryLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  summaryValue: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "800",
  },

  summaryRed: {
    color: "#DC2626",
  },

  summaryGreen: {
    color: "#059669",
  },

  section: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 16,
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionSubtitle: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },

  filtersContainer: {
    paddingTop: 16,
    paddingBottom: 3,
    gap: 8,
  },

  filterButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  filterButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterButtonText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },

  filterButtonTextActive: {
    color: "#FFFFFF",
  },

  insightsList: {
    marginTop: 14,
    gap: 12,
  },

  insightCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 14,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },

  insightIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  insightEmoji: {
    fontSize: 18,
  },

  insightHeaderText: {
    flex: 1,
    alignItems: "flex-start",
  },

  insightTitle: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },

  insightBadge: {
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  insightBadgeText: {
    fontSize: 8.5,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  insightDescription: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 19,
  },

  recommendation: {
    marginTop: 13,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 13,
    padding: 12,
  },

  recommendationLabel: {
    color: "#64748B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  recommendationText: {
    marginTop: 5,
    color: "#334155",
    fontSize: 11.5,
    lineHeight: 18,
  },

  rankingList: {
    marginTop: 15,
    gap: 9,
  },

  rankingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 14,
    padding: 12,
  },

  rankingPosition: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  rankingPositionText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "800",
  },

  rankingInfo: {
    flex: 1,
    paddingRight: 8,
  },

  rankingName: {
    color: "#1E293B",
    fontSize: 12.5,
    fontWeight: "800",
  },

  rankingRole: {
    marginTop: 3,
    color: "#64748B",
    fontSize: 10,
  },

  rankingDepartment: {
    marginTop: 2,
    color: "#94A3B8",
    fontSize: 9.5,
  },

  rankingScore: {
    backgroundColor: "#D1FAE5",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  rankingScoreText: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "900",
  },

  departmentList: {
    marginTop: 15,
    gap: 10,
  },

  departmentCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 13,
  },

  departmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  departmentInfo: {
    flex: 1,
  },

  departmentName: {
    color: "#1E293B",
    fontSize: 12.5,
    fontWeight: "800",
  },

  departmentQuantity: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 9.5,
  },

  departmentScore: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "900",
  },

  progressBackground: {
    marginTop: 13,
    height: 7,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 999,
  },

  aiCard: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    backgroundColor: "#F5F3FF",
    borderRadius: 20,
    padding: 16,
  },

  aiIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  aiEmoji: {
    fontSize: 20,
  },

  aiContent: {
    marginTop: 13,
  },

  aiTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "800",
  },

  aiText: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 11.5,
    lineHeight: 18,
  },

  aiImportant: {
    marginTop: 9,
    color: "#6D28D9",
    fontSize: 11.5,
    lineHeight: 18,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 24,
  },

  emptyTitle: {
    marginTop: 8,
    color: "#334155",
    fontSize: 13,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 10.5,
    lineHeight: 16,
    textAlign: "center",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingEmoji: {
    color: "#2563EB",
    fontSize: 28,
  },

  loadingTitle: {
    marginTop: 18,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  loadingText: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
  },

  bottomSpace: {
    height: 35,
  },
});