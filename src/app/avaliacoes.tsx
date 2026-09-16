import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FiltroStatus =
  | 'TODAS'
  | 'CONCLUÍDA'
  | 'PENDENTE'
  | 'EM ANDAMENTO';

export default function AvaliacoesScreen() {
  const [filtro, setFiltro] = useState<FiltroStatus>('TODAS');

  const avaliacoes = [
    {
      id: 1,
      colaborador: 'Natália Pastre',
      cargo: 'Analista de Desenvolvimento',
      iniciais: 'NP',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,7',
    },
    {
      id: 2,
      colaborador: 'Ana Souza',
      cargo: 'Analista de Recursos Humanos',
      iniciais: 'AS',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,9',
    },
    {
      id: 3,
      colaborador: 'Bruno Almeida',
      cargo: 'UX Designer',
      iniciais: 'BA',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'EM ANDAMENTO',
      nota: null,
    },
    {
      id: 4,
      colaborador: 'Daniel Oliveira',
      cargo: 'Desenvolvedor Front-end',
      iniciais: 'DO',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'PENDENTE',
      nota: null,
    },
    {
      id: 5,
      colaborador: 'Gabriel Santos',
      cargo: 'Analista de Sistemas',
      iniciais: 'GS',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,6',
    },
    {
      id: 6,
      colaborador: 'Helena Martins',
      cargo: 'Assistente Administrativa',
      iniciais: 'HM',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'PENDENTE',
      nota: null,
    },
  ];

  const avaliacoesFiltradas = useMemo(() => {
    if (filtro === 'TODAS') {
      return avaliacoes;
    }

    return avaliacoes.filter(
      (avaliacao) => avaliacao.status === filtro,
    );
  }, [filtro]);

  function voltarAoInicio() {
    router.replace('/');
  }

  function getStatusStyle(status: string) {
    if (status === 'CONCLUÍDA') {
      return {
        container: styles.statusCompleted,
        text: styles.statusCompletedText,
      };
    }

    if (status === 'EM ANDAMENTO') {
      return {
        container: styles.statusProgress,
        text: styles.statusProgressText,
      };
    }

    return {
      container: styles.statusPending,
      text: styles.statusPendingText,
    };
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* VOLTAR */}
      <TouchableOpacity
        onPress={voltarAoInicio}
        activeOpacity={0.7}
        hitSlop={10}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao início"
      >
        <Ionicons
          name="home-outline"
          size={18}
          color="#334155"
        />

        <Text style={styles.backButtonText}>
          Voltar ao início
        </Text>
      </TouchableOpacity>

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.badge}>
          DESEMPENHO
        </Text>

        <Text style={styles.title}>
          Avaliações
        </Text>

        <Text style={styles.description}>
          Acompanhe o ciclo de avaliação de desempenho da equipe,
          resultados e avaliações pendentes.
        </Text>
      </View>

      {/* CICLO */}
      <View style={styles.cycleCard}>
        <View style={styles.cycleTop}>
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleLabel}>
              CICLO ATUAL
            </Text>

            <Text style={styles.cycleTitle}>
              1º Ciclo de Avaliação 2026
            </Text>
          </View>

          <View style={styles.cycleBadge}>
            <Text style={styles.cycleBadgeText}>
              EM ANDAMENTO
            </Text>
          </View>
        </View>

        <Text style={styles.cycleDates}>
          31/08/2026 → 14/12/2026
        </Text>

        <View style={styles.progressBackground}>
          <View style={styles.progressValue} />
        </View>

        <View style={styles.progressFooter}>
          <Text style={styles.progressLabel}>
            Participação da equipe
          </Text>

          <Text style={styles.progressNumber}>
            58%
          </Text>
        </View>
      </View>

      {/* INDICADORES */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>
            📝
          </Text>

          <Text style={styles.metricNumber}>
            24
          </Text>

          <Text style={styles.metricLabel}>
            Avaliações
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>
            ✅
          </Text>

          <Text style={styles.metricNumber}>
            14
          </Text>

          <Text style={styles.metricLabel}>
            Concluídas
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>
            ⏳
          </Text>

          <Text style={styles.metricNumber}>
            5
          </Text>

          <Text style={styles.metricLabel}>
            Pendentes
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>
            📊
          </Text>

          <Text style={styles.metricNumber}>
            8,5
          </Text>

          <Text style={styles.metricLabel}>
            Média geral
          </Text>
        </View>
      </View>

      {/* FILTROS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Avaliações da equipe
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {[
            'TODAS',
            'CONCLUÍDA',
            'PENDENTE',
            'EM ANDAMENTO',
          ].map((item) => (
            <Pressable
              key={item}
              onPress={() =>
                setFiltro(item as FiltroStatus)
              }
              style={[
                styles.filterButton,
                filtro === item &&
                  styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === item &&
                    styles.filterTextActive,
                ]}
              >
                {item === 'TODAS'
                  ? 'Todas'
                  : item === 'CONCLUÍDA'
                    ? 'Concluídas'
                    : item === 'PENDENTE'
                      ? 'Pendentes'
                      : 'Em andamento'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* LISTA */}
        <View style={styles.list}>
          {avaliacoesFiltradas.map((avaliacao) => {
            const statusStyle = getStatusStyle(
              avaliacao.status,
            );

            return (
              <View
                key={avaliacao.id}
                style={styles.evaluationCard}
              >
                <View style={styles.evaluationTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {avaliacao.iniciais}
                    </Text>
                  </View>

                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>
                      {avaliacao.colaborador}
                    </Text>

                    <Text style={styles.employeeRole}>
                      {avaliacao.cargo}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      statusStyle.container,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        statusStyle.text,
                      ]}
                    >
                      {avaliacao.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.evaluationBottom}>
                  <View style={styles.cycleSmall}>
                    <Text style={styles.smallLabel}>
                      CICLO
                    </Text>

                    <Text style={styles.smallValue}>
                      {avaliacao.ciclo}
                    </Text>
                  </View>

                  {avaliacao.nota ? (
                    <View style={styles.scoreArea}>
                      <Text style={styles.smallLabel}>
                        NOTA
                      </Text>

                      <Text style={styles.score}>
                        {avaliacao.nota}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.scoreArea}>
                      <Text style={styles.smallLabel}>
                        NOTA
                      </Text>

                      <Text style={styles.noScore}>
                        —
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed &&
                      styles.detailsButtonPressed,
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: '/avaliacao/[id]',
                      params: { id: String(avaliacao.id) },
                    })
                  }
                >
                  <Text style={styles.detailsText}>
                    Ver detalhes da avaliação
                  </Text>

                  <Text style={styles.arrow}>
                    →
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {/* AVISO */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>
          💡
        </Text>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Acompanhamento do ciclo
          </Text>

          <Text style={styles.infoText}>
            Os dados desta tela são demonstrativos nesta etapa.
            Depois conectaremos as avaliações reais do SynerRH.
          </Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9FE',
  },

  container: {
    flex: 1,
    backgroundColor: '#F6F9FE',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    zIndex: 10,
    elevation: 2,
  },

  backButtonText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },

  header: {
    marginBottom: 22,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEAFE',
    color: '#4936F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: '800',
  },

  title: {
    marginTop: 14,
    color: '#0A1633',
    fontSize: 28,
    fontWeight: '800',
  },

  description: {
    marginTop: 8,
    color: '#53627A',
    fontSize: 14,
    lineHeight: 21,
  },

  cycleCard: {
    backgroundColor: '#4936F5',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  cycleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  cycleInfo: {
    flex: 1,
  },

  cycleLabel: {
    color: '#DAD5FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  cycleTitle: {
    marginTop: 7,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  cycleBadge: {
    backgroundColor: '#715FFF',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  cycleBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  cycleDates: {
    marginTop: 10,
    color: '#E7E4FF',
    fontSize: 10,
  },

  progressBackground: {
    marginTop: 18,
    height: 7,
    width: '100%',
    backgroundColor: '#715FFF',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressValue: {
    width: '58%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  progressFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressLabel: {
    color: '#DAD5FF',
    fontSize: 9,
  },

  progressNumber: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 16,
    padding: 16,
  },

  metricIcon: {
    fontSize: 18,
  },

  metricNumber: {
    marginTop: 10,
    color: '#0A1633',
    fontSize: 25,
    fontWeight: '800',
  },

  metricLabel: {
    marginTop: 2,
    color: '#71809A',
    fontSize: 10,
    fontWeight: '600',
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    color: '#0A1633',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },

  filters: {
    gap: 8,
    paddingBottom: 16,
  },

  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterButtonActive: {
    backgroundColor: '#4936F5',
    borderColor: '#4936F5',
  },

  filterText: {
    color: '#71809A',
    fontSize: 10,
    fontWeight: '700',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  list: {
    gap: 12,
  },

  evaluationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 16,
    padding: 16,
  },

  evaluationTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#4936F5',
    fontSize: 13,
    fontWeight: '800',
  },

  employeeInfo: {
    flex: 1,
    marginLeft: 11,
  },

  employeeName: {
    color: '#0A1633',
    fontSize: 13,
    fontWeight: '800',
  },

  employeeRole: {
    marginTop: 3,
    color: '#71809A',
    fontSize: 9,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 7,
    fontWeight: '800',
  },

  statusCompleted: {
    backgroundColor: '#E8FFF5',
  },

  statusCompletedText: {
    color: '#078A5B',
  },

  statusProgress: {
    backgroundColor: '#EEEAFE',
  },

  statusProgressText: {
    color: '#4936F5',
  },

  statusPending: {
    backgroundColor: '#FFF6DD',
  },

  statusPendingText: {
    color: '#A36C00',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginVertical: 14,
  },

  evaluationBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cycleSmall: {
    flex: 1,
    paddingRight: 10,
  },

  smallLabel: {
    color: '#9AA7BA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  smallValue: {
    marginTop: 4,
    color: '#53627A',
    fontSize: 10,
    fontWeight: '600',
  },

  scoreArea: {
    alignItems: 'flex-end',
  },

  score: {
    marginTop: 3,
    color: '#4936F5',
    fontSize: 20,
    fontWeight: '800',
  },

  noScore: {
    marginTop: 3,
    color: '#9AA7BA',
    fontSize: 20,
    fontWeight: '800',
  },

  detailsButton: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailsButtonPressed: {
    opacity: 0.6,
  },

  detailsText: {
    color: '#146EF5',
    fontSize: 10,
    fontWeight: '700',
  },

  arrow: {
    color: '#4936F5',
    fontSize: 18,
    fontWeight: '700',
  },

  infoCard: {
    marginTop: 22,
    backgroundColor: '#EAF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    fontSize: 18,
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    color: '#0A1633',
    fontSize: 12,
    fontWeight: '800',
  },

  infoText: {
    marginTop: 4,
    color: '#53627A',
    fontSize: 10,
    lineHeight: 16,
  },
});