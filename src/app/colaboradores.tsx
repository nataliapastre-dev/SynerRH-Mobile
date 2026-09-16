import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ColaboradoresScreen() {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 6;

  const colaboradores = [
    {
      id: 1,
      nome: 'Natália Pastre',
      cargo: 'Analista de Desenvolvimento',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'NP',
    },
    {
      id: 2,
      nome: 'Ana Souza',
      cargo: 'Analista de Recursos Humanos',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'AS',
    },
    {
      id: 3,
      nome: 'Bruno Almeida',
      cargo: 'UX Designer',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'BA',
    },
    {
      id: 4,
      nome: 'Carla Mendes',
      cargo: 'Coordenadora Administrativa',
      departamento: 'Administrativo',
      status: 'FÉRIAS',
      iniciais: 'CM',
    },
    {
      id: 5,
      nome: 'Daniel Oliveira',
      cargo: 'Desenvolvedor Front-end',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'DO',
    },
    {
      id: 6,
      nome: 'Fernanda Lima',
      cargo: 'Analista Financeira',
      departamento: 'Financeiro',
      status: 'AFASTADO',
      iniciais: 'FL',
    },
    {
      id: 7,
      nome: 'Gabriel Santos',
      cargo: 'Analista de Sistemas',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'GS',
    },
    {
      id: 8,
      nome: 'Helena Martins',
      cargo: 'Assistente Administrativa',
      departamento: 'Administrativo',
      status: 'ATIVO',
      iniciais: 'HM',
    },
    {
      id: 9,
      nome: 'Igor Ferreira',
      cargo: 'Analista Comercial',
      departamento: 'Comercial',
      status: 'ATIVO',
      iniciais: 'IF',
    },
    {
      id: 10,
      nome: 'Juliana Rocha',
      cargo: 'Business Partner',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'JR',
    },
    {
      id: 11,
      nome: 'Lucas Pereira',
      cargo: 'Desenvolvedor Back-end',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'LP',
    },
    {
      id: 12,
      nome: 'Mariana Costa',
      cargo: 'Analista de Marketing',
      departamento: 'Marketing',
      status: 'ATIVO',
      iniciais: 'MC',
    },
    {
      id: 13,
      nome: 'Nicolas Ribeiro',
      cargo: 'Analista de Dados',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'NR',
    },
    {
      id: 14,
      nome: 'Olívia Martins',
      cargo: 'Assistente Financeira',
      departamento: 'Financeiro',
      status: 'ATIVO',
      iniciais: 'OM',
    },
    {
      id: 15,
      nome: 'Paulo Henrique',
      cargo: 'Coordenador Comercial',
      departamento: 'Comercial',
      status: 'ATIVO',
      iniciais: 'PH',
    },
    {
      id: 16,
      nome: 'Rafaela Souza',
      cargo: 'Analista de Produto',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'RS',
    },
    {
      id: 17,
      nome: 'Ricardo Lima',
      cargo: 'Supervisor Operacional',
      departamento: 'Operações',
      status: 'ATIVO',
      iniciais: 'RL',
    },
    {
      id: 18,
      nome: 'Sabrina Alves',
      cargo: 'Analista de Treinamento',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'SA',
    },
    {
      id: 19,
      nome: 'Thiago Mendes',
      cargo: 'Product Owner',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'TM',
    },
    {
      id: 20,
      nome: 'Valéria Gomes',
      cargo: 'Analista de Controladoria',
      departamento: 'Financeiro',
      status: 'ATIVO',
      iniciais: 'VG',
    },
    {
      id: 21,
      nome: 'Vinícius Rocha',
      cargo: 'Desenvolvedor Mobile',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'VR',
    },
    {
      id: 22,
      nome: 'Yasmin Oliveira',
      cargo: 'Analista de Qualidade',
      departamento: 'Operações',
      status: 'ATIVO',
      iniciais: 'YO',
    },
    {
      id: 23,
      nome: 'Amanda Ribeiro',
      cargo: 'Assistente de RH',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'AR',
    },
    {
      id: 24,
      nome: 'Eduardo Martins',
      cargo: 'Analista de Suporte',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'EM',
    },
  ];

  const colaboradoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return colaboradores;
    }

    return colaboradores.filter((colaborador) =>
      colaborador.nome.toLowerCase().includes(termo),
    );
  }, [busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(colaboradoresFiltrados.length / itensPorPagina),
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const colaboradoresPagina = colaboradoresFiltrados.slice(
    inicio,
    fim,
  );

  function handleBusca(texto: string) {
    setBusca(texto);
    setPaginaAtual(1);
  }

  function paginaAnterior() {
    if (paginaAtual > 1) {
      setPaginaAtual((pagina) => pagina - 1);
    }
  }

  function proximaPagina() {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual((pagina) => pagina + 1);
    }
  }

  function voltarAoInicio() {
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* Cabeçalho */}
      <View style={styles.header}>
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

        <Text style={styles.badge}>
          EQUIPE
        </Text>

        <Text style={styles.title}>
          Colaboradores
        </Text>

        <Text style={styles.description}>
          Acompanhe as pessoas da equipe, cargos, departamentos
          e situação atual de cada colaborador.
        </Text>
      </View>

      {/* Resumo */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>
            TOTAL DE COLABORADORES
          </Text>

          <Text style={styles.summaryNumber}>
            24
          </Text>

          <Text style={styles.summaryDescription}>
            colaboradores cadastrados
          </Text>
        </View>

        <View style={styles.summaryBadge}>
          <Text style={styles.summaryBadgeText}>
            22 ativos
          </Text>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>
          Buscar colaborador
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do colaborador"
          placeholderTextColor="#9AA7BA"
          value={busca}
          onChangeText={handleBusca}
        />
      </View>

      {/* Lista */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            Equipe
          </Text>

          <Text style={styles.resultCount}>
            {colaboradoresFiltrados.length} encontrado(s)
          </Text>
        </View>

        {colaboradoresPagina.length > 0 ? (
          colaboradoresPagina.map((colaborador) => (
            <View
              key={colaborador.id}
              style={styles.employeeCard}
            >
              <View style={styles.employeeTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {colaborador.iniciais}
                  </Text>
                </View>

                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>
                    {colaborador.nome}
                  </Text>

                  <Text style={styles.employeeRole}>
                    {colaborador.cargo}
                  </Text>

                  <Text style={styles.employeeDepartment}>
                    {colaborador.departamento}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    colaborador.status === 'ATIVO'
                      ? styles.statusActive
                      : colaborador.status === 'FÉRIAS'
                        ? styles.statusVacation
                        : styles.statusAway,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      colaborador.status === 'ATIVO'
                        ? styles.statusActiveText
                        : colaborador.status === 'FÉRIAS'
                          ? styles.statusVacationText
                          : styles.statusAwayText,
                    ]}
                  >
                    {colaborador.status}
                  </Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.cardFooter,
                  pressed && styles.cardFooterPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/colaborador/[id]',
                    params: {
                      id: String(colaborador.id),
                      nome: colaborador.nome,
                      cargo: colaborador.cargo,
                      departamento: colaborador.departamento,
                      status: colaborador.status,
                      iniciais: colaborador.iniciais,
                    },
                  })
                }
              >
                <Text style={styles.detailsText}>
                  Ver perfil do colaborador
                </Text>

                <Text style={styles.arrow}>
                  →
                </Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Nenhum colaborador encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente buscar por outro nome.
            </Text>
          </View>
        )}
      </View>

      {/* Paginação */}
      {colaboradoresFiltrados.length > 0 && (
        <View style={styles.pagination}>
          <Pressable
            onPress={paginaAnterior}
            disabled={paginaAtual === 1}
            style={[
              styles.paginationButton,
              paginaAtual === 1 &&
                styles.paginationButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.paginationButtonText,
                paginaAtual === 1 &&
                  styles.paginationButtonTextDisabled,
              ]}
            >
              ← Anterior
            </Text>
          </Pressable>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              Página {paginaAtual} de {totalPaginas}
            </Text>
          </View>

          <Pressable
            onPress={proximaPagina}
            disabled={paginaAtual === totalPaginas}
            style={[
              styles.paginationButton,
              paginaAtual === totalPaginas &&
                styles.paginationButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.paginationButtonText,
                paginaAtual === totalPaginas &&
                  styles.paginationButtonTextDisabled,
              ]}
            >
              Próxima →
            </Text>
          </Pressable>
        </View>
      )}
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

  // CABEÇALHO

  header: {
    marginBottom: 22,
  },

  backHomeButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    marginBottom: 16,
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

  backHomeButtonText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },

  badge: {
    alignSelf: 'flex-start',

    backgroundColor: '#EAF2FF',
    color: '#146EF5',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,

    fontSize: 10,
    fontWeight: '800',
  },

  title: {
    marginTop: 14,

    fontSize: 28,
    fontWeight: '800',

    color: '#0A1633',
  },

  description: {
    marginTop: 8,

    fontSize: 14,
    lineHeight: 21,

    color: '#53627A',
  },

  // RESUMO

  summaryCard: {
    backgroundColor: '#4936F5',

    borderRadius: 18,
    padding: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',

    marginBottom: 24,
  },

  summaryLabel: {
    color: '#DAD5FF',

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 0.7,
  },

  summaryNumber: {
    marginTop: 8,

    color: '#FFFFFF',

    fontSize: 34,
    fontWeight: '800',
  },

  summaryDescription: {
    marginTop: 2,

    color: '#E7E4FF',

    fontSize: 10,
  },

  summaryBadge: {
    backgroundColor: '#715FFF',

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,
  },

  summaryBadgeText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '700',
  },

  // BUSCA

  searchSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    marginBottom: 12,

    fontSize: 17,
    fontWeight: '800',

    color: '#0A1633',
  },

  searchInput: {
    width: '100%',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 14,

    paddingHorizontal: 15,
    paddingVertical: 13,

    fontSize: 13,
    color: '#263653',
  },

  // LISTA

  listSection: {
    gap: 12,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resultCount: {
    marginBottom: 12,

    color: '#8290A8',

    fontSize: 10,
    fontWeight: '600',
  },

  employeeCard: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 16,

    padding: 16,
  },

  employeeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: '#EEEAFE',

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#4936F5',

    fontSize: 14,
    fontWeight: '800',
  },

  employeeInfo: {
    flex: 1,

    marginLeft: 12,
  },

  employeeName: {
    color: '#0A1633',

    fontSize: 14,
    fontWeight: '800',
  },

  employeeRole: {
    marginTop: 3,

    color: '#53627A',

    fontSize: 11,
    fontWeight: '600',
  },

  employeeDepartment: {
    marginTop: 2,

    color: '#8290A8',

    fontSize: 10,
  },

  // STATUS

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '800',
  },

  statusActive: {
    backgroundColor: '#E8FFF5',
  },

  statusActiveText: {
    color: '#078A5B',
  },

  statusVacation: {
    backgroundColor: '#FFF6DD',
  },

  statusVacationText: {
    color: '#A36C00',
  },

  statusAway: {
    backgroundColor: '#FFEAEA',
  },

  statusAwayText: {
    color: '#C23C3C',
  },

  // RODAPÉ DO CARD

  cardFooter: {
    marginTop: 14,
    paddingTop: 12,

    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardFooterPressed: {
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

  // PAGINAÇÃO

  pagination: {
    marginTop: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,
  },

  paginationButton: {
    flex: 1,

    minHeight: 44,

    borderRadius: 12,

    backgroundColor: '#4936F5',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
  },

  paginationButtonDisabled: {
    backgroundColor: '#E6EAF1',
  },

  paginationButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',

    textAlign: 'center',
  },

  paginationButtonTextDisabled: {
    color: '#9AA7BA',
  },

  pageIndicator: {
    minHeight: 44,

    paddingHorizontal: 12,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    alignItems: 'center',
    justifyContent: 'center',
  },

  pageIndicatorText: {
    color: '#53627A',

    fontSize: 10,
    fontWeight: '700',
  },

  // BUSCA VAZIA

  emptyCard: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 16,

    padding: 24,

    alignItems: 'center',
  },

  emptyTitle: {
    color: '#0A1633',

    fontSize: 14,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 6,

    color: '#8290A8',

    fontSize: 11,
  },
});