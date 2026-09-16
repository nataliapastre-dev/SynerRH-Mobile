import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function DetalheAvaliacaoScreen() {
  const { id } = useLocalSearchParams();

  const avaliacoes = [
    {
      id: 1,
      colaborador: 'Natália Pastre',
      cargo: 'Analista de Desenvolvimento',
      departamento: 'Tecnologia',
      iniciais: 'NP',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,7',
      desempenho: 'Muito bom',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [
        {
          titulo: 'Qualidade das entregas',
          nota: '9,0',
          descricao:
            'Mantém boa qualidade nas entregas e demonstra atenção aos detalhes.',
        },
        {
          titulo: 'Colaboração',
          nota: '8,5',
          descricao:
            'Boa interação com a equipe e disponibilidade para apoiar colegas.',
        },
        {
          titulo: 'Organização',
          nota: '8,7',
          descricao:
            'Organiza bem as atividades e acompanha os prazos definidos.',
        },
      ],
      pontosFortes:
        'Comprometimento, evolução técnica e boa capacidade de aprendizado.',
      desenvolvimento:
        'Continuar desenvolvendo autonomia técnica e aprofundar conhecimentos em arquitetura e integração de sistemas.',
      comentarioGestor:
        'Apresentou boa evolução durante o ciclo e demonstra interesse constante em aprender e assumir novos desafios.',
    },

    {
      id: 2,
      colaborador: 'Ana Souza',
      cargo: 'Analista de Recursos Humanos',
      departamento: 'Recursos Humanos',
      iniciais: 'AS',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,9',
      desempenho: 'Muito bom',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [
        {
          titulo: 'Qualidade das entregas',
          nota: '9,1',
          descricao:
            'Entrega atividades com qualidade e mantém atenção aos processos.',
        },
        {
          titulo: 'Comunicação',
          nota: '8,8',
          descricao:
            'Mantém comunicação clara com colaboradores e gestores.',
        },
        {
          titulo: 'Organização',
          nota: '8,9',
          descricao:
            'Possui bom controle das demandas e organização das rotinas.',
        },
      ],
      pontosFortes:
        'Organização, comunicação e relacionamento com a equipe.',
      desenvolvimento:
        'Aprofundar o uso de indicadores para apoiar decisões de gestão de pessoas.',
      comentarioGestor:
        'Mantém ótimo relacionamento com a equipe e demonstra responsabilidade nas atividades do setor.',
    },

    {
      id: 3,
      colaborador: 'Bruno Almeida',
      cargo: 'UX Designer',
      departamento: 'Produto',
      iniciais: 'BA',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'EM ANDAMENTO',
      nota: null,
      desempenho: 'Em avaliação',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [
        {
          titulo: 'Qualidade das entregas',
          nota: '—',
          descricao:
            'Competência ainda em processo de avaliação neste ciclo.',
        },
        {
          titulo: 'Criatividade',
          nota: '—',
          descricao:
            'Competência ainda em processo de avaliação neste ciclo.',
        },
        {
          titulo: 'Colaboração',
          nota: '—',
          descricao:
            'Competência ainda em processo de avaliação neste ciclo.',
        },
      ],
      pontosFortes:
        'A avaliação ainda está em andamento.',
      desenvolvimento:
        'Os pontos de desenvolvimento serão definidos após a conclusão da avaliação.',
      comentarioGestor:
        'Avaliação em andamento. O parecer final ainda não foi registrado.',
    },

    {
      id: 4,
      colaborador: 'Daniel Oliveira',
      cargo: 'Desenvolvedor Front-end',
      departamento: 'Tecnologia',
      iniciais: 'DO',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'PENDENTE',
      nota: null,
      desempenho: 'Pendente',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [],
      pontosFortes:
        'A avaliação ainda não foi iniciada.',
      desenvolvimento:
        'Os pontos de desenvolvimento serão definidos após a realização da avaliação.',
      comentarioGestor:
        'Avaliação aguardando preenchimento pelo responsável.',
    },

    {
      id: 5,
      colaborador: 'Gabriel Santos',
      cargo: 'Analista de Sistemas',
      departamento: 'Tecnologia',
      iniciais: 'GS',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'CONCLUÍDA',
      nota: '8,6',
      desempenho: 'Muito bom',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [
        {
          titulo: 'Conhecimento técnico',
          nota: '8,8',
          descricao:
            'Apresenta bom domínio técnico e capacidade de resolução de problemas.',
        },
        {
          titulo: 'Qualidade das entregas',
          nota: '8,5',
          descricao:
            'Mantém consistência e atenção na execução das atividades.',
        },
        {
          titulo: 'Trabalho em equipe',
          nota: '8,5',
          descricao:
            'Participa bem das atividades e colabora com outros profissionais.',
        },
      ],
      pontosFortes:
        'Conhecimento técnico, responsabilidade e colaboração.',
      desenvolvimento:
        'Buscar maior participação em decisões técnicas e compartilhamento de conhecimento.',
      comentarioGestor:
        'Apresentou bom desempenho durante o ciclo e mantém entregas consistentes.',
    },

    {
      id: 6,
      colaborador: 'Helena Martins',
      cargo: 'Assistente Administrativa',
      departamento: 'Administrativo',
      iniciais: 'HM',
      ciclo: '1º Ciclo de Avaliação 2026',
      status: 'PENDENTE',
      nota: null,
      desempenho: 'Pendente',
      periodo: '31/08/2026 → 14/12/2026',
      competencias: [],
      pontosFortes:
        'A avaliação ainda não foi iniciada.',
      desenvolvimento:
        'Os pontos serão definidos após a conclusão da avaliação.',
      comentarioGestor:
        'Avaliação ainda pendente de preenchimento.',
    },
  ];

  const avaliacao = avaliacoes.find(
    (item) => item.id === Number(id),
  );

  function voltarParaAvaliacoes() {
    router.replace('/avaliacoes');
  }

  if (!avaliacao) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundIcon}>🔎</Text>

        <Text style={styles.notFoundTitle}>
          Avaliação não encontrada
        </Text>

        <Text style={styles.notFoundText}>
          Não encontramos uma avaliação com esse identificador.
        </Text>

        <TouchableOpacity
          style={styles.notFoundButton}
          onPress={voltarParaAvaliacoes}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar para avaliações"
        >
          <Ionicons
            name="clipboard-outline"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.notFoundButtonText}>
            Voltar para avaliações
          </Text>
        </TouchableOpacity>
      </View>
    );
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

  const statusStyle = getStatusStyle(avaliacao.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <TouchableOpacity
        onPress={voltarParaAvaliacoes}
        activeOpacity={0.7}
        hitSlop={10}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Voltar para avaliações"
      >
        <Ionicons
          name="clipboard-outline"
          size={18}
          color="#334155"
        />

        <Text style={styles.backButtonText}>
          Voltar para avaliações
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.badge}>
          DETALHES DA AVALIAÇÃO
        </Text>

        <Text style={styles.title}>
          Avaliação de desempenho
        </Text>

        <Text style={styles.description}>
          Consulte o resultado, as competências avaliadas e os
          principais pontos de desenvolvimento.
        </Text>
      </View>

      <View style={styles.employeeCard}>
        <View style={styles.employeeTop}>
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

            <Text style={styles.employeeDepartment}>
              {avaliacao.departamento}
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

        <View style={styles.cycleInfo}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              CICLO
            </Text>

            <Text style={styles.infoValue}>
              {avaliacao.ciclo}
            </Text>
          </View>

          <View style={styles.infoBlockRight}>
            <Text style={styles.infoLabel}>
              PERÍODO
            </Text>

            <Text style={styles.infoValueRight}>
              {avaliacao.periodo}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.resultCard}>
        <View>
          <Text style={styles.resultLabel}>
            RESULTADO
          </Text>

          <Text style={styles.resultTitle}>
            {avaliacao.desempenho}
          </Text>

          <Text style={styles.resultDescription}>
            Desempenho registrado no ciclo atual.
          </Text>
        </View>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreLabel}>
            NOTA
          </Text>

          <Text style={styles.scoreNumber}>
            {avaliacao.nota ?? '—'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Competências avaliadas
        </Text>

        {avaliacao.competencias.length > 0 ? (
          <View style={styles.competenciesList}>
            {avaliacao.competencias.map(
              (competencia, index) => (
                <View
                  key={`${competencia.titulo}-${index}`}
                  style={styles.competencyCard}
                >
                  <View style={styles.competencyTop}>
                    <Text style={styles.competencyTitle}>
                      {competencia.titulo}
                    </Text>

                    <View style={styles.competencyScoreBadge}>
                      <Text style={styles.competencyScore}>
                        {competencia.nota}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.competencyDescription}>
                    {competencia.descricao}
                  </Text>
                </View>
              ),
            )}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📝
            </Text>

            <Text style={styles.emptyTitle}>
              Avaliação ainda não preenchida
            </Text>

            <Text style={styles.emptyText}>
              As competências aparecerão aqui quando a avaliação
              for realizada.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Síntese da avaliação
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>
              ⭐
            </Text>

            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>
                Pontos fortes
              </Text>

              <Text style={styles.summaryText}>
                {avaliacao.pontosFortes}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>
              🎯
            </Text>

            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>
                Desenvolvimento
              </Text>

              <Text style={styles.summaryText}>
                {avaliacao.desenvolvimento}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Comentário do gestor
        </Text>

        <View style={styles.commentCard}>
          <Text style={styles.commentQuote}>
            “
          </Text>

          <Text style={styles.commentText}>
            {avaliacao.comentarioGestor}
          </Text>
        </View>
      </View>

      <View style={styles.demoWarning}>
        <Text style={styles.demoIcon}>
          💡
        </Text>

        <View style={styles.demoContent}>
          <Text style={styles.demoTitle}>
            Dados demonstrativos
          </Text>

          <Text style={styles.demoText}>
            Nesta etapa, os dados são utilizados para construir e
            validar a experiência mobile. Depois conectaremos essa
            tela à API do SynerRH.
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
    marginBottom: 20,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEAFE',
    color: '#4936F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  title: {
    marginTop: 14,
    color: '#0A1633',
    fontSize: 27,
    fontWeight: '800',
  },

  description: {
    marginTop: 8,
    color: '#53627A',
    fontSize: 13,
    lineHeight: 20,
  },

  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 18,
    padding: 18,
  },

  employeeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#4936F5',
    fontSize: 16,
    fontWeight: '800',
  },

  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },

  employeeName: {
    color: '#0A1633',
    fontSize: 15,
    fontWeight: '800',
  },

  employeeRole: {
    marginTop: 3,
    color: '#53627A',
    fontSize: 10,
    fontWeight: '600',
  },

  employeeDepartment: {
    marginTop: 2,
    color: '#8290A8',
    fontSize: 9,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
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
    marginVertical: 16,
  },

  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  infoBlock: {
    flex: 1,
  },

  infoBlockRight: {
    flex: 1,
    alignItems: 'flex-end',
  },

  infoLabel: {
    color: '#9AA7BA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  infoValue: {
    marginTop: 5,
    color: '#263653',
    fontSize: 10,
    fontWeight: '700',
  },

  infoValueRight: {
    marginTop: 5,
    color: '#263653',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'right',
  },

  resultCard: {
    marginTop: 16,
    backgroundColor: '#4936F5',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultLabel: {
    color: '#DAD5FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  resultTitle: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  resultDescription: {
    marginTop: 4,
    color: '#E7E4FF',
    fontSize: 9,
    maxWidth: 190,
  },

  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#715FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreLabel: {
    color: '#DAD5FF',
    fontSize: 7,
    fontWeight: '800',
  },

  scoreNumber: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    color: '#0A1633',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },

  competenciesList: {
    gap: 10,
  },

  competencyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 15,
    padding: 16,
  },

  competencyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  competencyTitle: {
    flex: 1,
    color: '#263653',
    fontSize: 12,
    fontWeight: '800',
  },

  competencyScoreBadge: {
    backgroundColor: '#EEEAFE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  competencyScore: {
    color: '#4936F5',
    fontSize: 11,
    fontWeight: '800',
  },

  competencyDescription: {
    marginTop: 9,
    color: '#71809A',
    fontSize: 10,
    lineHeight: 16,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 24,
  },

  emptyTitle: {
    marginTop: 10,
    color: '#0A1633',
    fontSize: 12,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 5,
    color: '#8290A8',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 16,
    padding: 16,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  summaryIcon: {
    fontSize: 18,
  },

  summaryContent: {
    flex: 1,
    marginLeft: 10,
  },

  summaryTitle: {
    color: '#263653',
    fontSize: 11,
    fontWeight: '800',
  },

  summaryText: {
    marginTop: 5,
    color: '#71809A',
    fontSize: 10,
    lineHeight: 16,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginVertical: 16,
  },

  commentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9F7',
    borderRadius: 16,
    padding: 18,
  },

  commentQuote: {
    color: '#4936F5',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 32,
  },

  commentText: {
    color: '#53627A',
    fontSize: 11,
    lineHeight: 18,
  },

  demoWarning: {
    marginTop: 24,
    backgroundColor: '#EAF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  demoIcon: {
    fontSize: 18,
  },

  demoContent: {
    flex: 1,
    marginLeft: 10,
  },

  demoTitle: {
    color: '#0A1633',
    fontSize: 11,
    fontWeight: '800',
  },

  demoText: {
    marginTop: 4,
    color: '#53627A',
    fontSize: 10,
    lineHeight: 16,
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: '#F6F9FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  notFoundIcon: {
    fontSize: 36,
  },

  notFoundTitle: {
    marginTop: 12,
    color: '#0A1633',
    fontSize: 20,
    fontWeight: '800',
  },

  notFoundText: {
    marginTop: 7,
    color: '#71809A',
    fontSize: 12,
    textAlign: 'center',
  },

  notFoundButton: {
    marginTop: 20,
    minHeight: 44,
    backgroundColor: '#4936F5',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  notFoundButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});