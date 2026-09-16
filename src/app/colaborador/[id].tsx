import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PerfilColaboradorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const detalhesDemo = [
    {
      id: 1,
      nome: 'Natália Pastre',
      cargo: 'Analista de Desenvolvimento',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'NP',
      email: 'natalia.pastre@synerhcorp.com.br',
      matricula: 'SYR0001',
      admissao: '04/06/2021',
      desempenho: '8,7',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 2,
      nome: 'Ana Souza',
      cargo: 'Analista de Recursos Humanos',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'AS',
      email: 'ana.souza@synerhcorp.com.br',
      matricula: 'SYR0002',
      admissao: '12/04/2021',
      desempenho: '8,9',
      pdis: 2,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 3,
      nome: 'Bruno Almeida',
      cargo: 'UX Designer',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'BA',
      email: 'bruno.almeida@synerhcorp.com.br',
      matricula: 'SYR0003',
      admissao: '09/01/2023',
      desempenho: '8,4',
      pdis: 1,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 4,
      nome: 'Carla Mendes',
      cargo: 'Coordenadora Administrativa',
      departamento: 'Administrativo',
      status: 'FÉRIAS',
      iniciais: 'CM',
      email: 'carla.mendes@synerhcorp.com.br',
      matricula: 'SYR0004',
      admissao: '18/03/2020',
      desempenho: '8,6',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 5,
      nome: 'Daniel Oliveira',
      cargo: 'Desenvolvedor Front-end',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'DO',
      email: 'daniel.oliveira@synerhcorp.com.br',
      matricula: 'SYR0005',
      admissao: '07/02/2022',
      desempenho: '8,8',
      pdis: 3,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 6,
      nome: 'Fernanda Lima',
      cargo: 'Analista Financeira',
      departamento: 'Financeiro',
      status: 'AFASTADO',
      iniciais: 'FL',
      email: 'fernanda.lima@synerhcorp.com.br',
      matricula: 'SYR0006',
      admissao: '22/08/2019',
      desempenho: '8,2',
      pdis: 1,
      feedbacks: 2,
      avaliacoes: 2,
    },
    {
      id: 7,
      nome: 'Gabriel Santos',
      cargo: 'Analista de Sistemas',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'GS',
      email: 'gabriel.santos@synerhcorp.com.br',
      matricula: 'SYR0007',
      admissao: '10/05/2022',
      desempenho: '8,6',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 8,
      nome: 'Helena Martins',
      cargo: 'Assistente Administrativa',
      departamento: 'Administrativo',
      status: 'ATIVO',
      iniciais: 'HM',
      email: 'helena.martins@synerhcorp.com.br',
      matricula: 'SYR0008',
      admissao: '14/09/2023',
      desempenho: '8,3',
      pdis: 1,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 9,
      nome: 'Igor Ferreira',
      cargo: 'Analista Comercial',
      departamento: 'Comercial',
      status: 'ATIVO',
      iniciais: 'IF',
      email: 'igor.ferreira@synerhcorp.com.br',
      matricula: 'SYR0009',
      admissao: '20/06/2021',
      desempenho: '8,5',
      pdis: 2,
      feedbacks: 3,
      avaliacoes: 3,
    },
    {
      id: 10,
      nome: 'Juliana Rocha',
      cargo: 'Business Partner',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'JR',
      email: 'juliana.rocha@synerhcorp.com.br',
      matricula: 'SYR0010',
      admissao: '03/11/2020',
      desempenho: '9,0',
      pdis: 2,
      feedbacks: 6,
      avaliacoes: 3,
    },
    {
      id: 11,
      nome: 'Lucas Pereira',
      cargo: 'Desenvolvedor Back-end',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'LP',
      email: 'lucas.pereira@synerhcorp.com.br',
      matricula: 'SYR0011',
      admissao: '17/01/2022',
      desempenho: '8,8',
      pdis: 3,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 12,
      nome: 'Mariana Costa',
      cargo: 'Analista de Marketing',
      departamento: 'Marketing',
      status: 'ATIVO',
      iniciais: 'MC',
      email: 'mariana.costa@synerhcorp.com.br',
      matricula: 'SYR0012',
      admissao: '11/04/2023',
      desempenho: '8,4',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 2,
    },
    {
      id: 13,
      nome: 'Nicolas Ribeiro',
      cargo: 'Analista de Dados',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'NR',
      email: 'nicolas.ribeiro@synerhcorp.com.br',
      matricula: 'SYR0013',
      admissao: '06/02/2024',
      desempenho: '8,6',
      pdis: 2,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 14,
      nome: 'Olívia Martins',
      cargo: 'Assistente Financeira',
      departamento: 'Financeiro',
      status: 'ATIVO',
      iniciais: 'OM',
      email: 'olivia.martins@synerhcorp.com.br',
      matricula: 'SYR0014',
      admissao: '15/05/2023',
      desempenho: '8,1',
      pdis: 1,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 15,
      nome: 'Paulo Henrique',
      cargo: 'Coordenador Comercial',
      departamento: 'Comercial',
      status: 'ATIVO',
      iniciais: 'PH',
      email: 'paulo.henrique@synerhcorp.com.br',
      matricula: 'SYR0015',
      admissao: '09/09/2019',
      desempenho: '8,9',
      pdis: 2,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 16,
      nome: 'Rafaela Souza',
      cargo: 'Analista de Produto',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'RS',
      email: 'rafaela.souza@synerhcorp.com.br',
      matricula: 'SYR0016',
      admissao: '21/03/2022',
      desempenho: '8,7',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 17,
      nome: 'Ricardo Lima',
      cargo: 'Supervisor Operacional',
      departamento: 'Operações',
      status: 'ATIVO',
      iniciais: 'RL',
      email: 'ricardo.lima@synerhcorp.com.br',
      matricula: 'SYR0017',
      admissao: '10/10/2018',
      desempenho: '8,5',
      pdis: 2,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 18,
      nome: 'Sabrina Alves',
      cargo: 'Analista de Treinamento',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'SA',
      email: 'sabrina.alves@synerhcorp.com.br',
      matricula: 'SYR0018',
      admissao: '08/08/2022',
      desempenho: '8,7',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 19,
      nome: 'Thiago Mendes',
      cargo: 'Product Owner',
      departamento: 'Produto',
      status: 'ATIVO',
      iniciais: 'TM',
      email: 'thiago.mendes@synerhcorp.com.br',
      matricula: 'SYR0019',
      admissao: '19/07/2021',
      desempenho: '8,9',
      pdis: 3,
      feedbacks: 5,
      avaliacoes: 3,
    },
    {
      id: 20,
      nome: 'Valéria Gomes',
      cargo: 'Analista de Controladoria',
      departamento: 'Financeiro',
      status: 'ATIVO',
      iniciais: 'VG',
      email: 'valeria.gomes@synerhcorp.com.br',
      matricula: 'SYR0020',
      admissao: '04/04/2020',
      desempenho: '8,4',
      pdis: 2,
      feedbacks: 4,
      avaliacoes: 3,
    },
    {
      id: 21,
      nome: 'Vinícius Rocha',
      cargo: 'Desenvolvedor Mobile',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'VR',
      email: 'vinicius.rocha@synerhcorp.com.br',
      matricula: 'SYR0021',
      admissao: '12/12/2023',
      desempenho: '8,6',
      pdis: 2,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 22,
      nome: 'Yasmin Oliveira',
      cargo: 'Analista de Qualidade',
      departamento: 'Operações',
      status: 'ATIVO',
      iniciais: 'YO',
      email: 'yasmin.oliveira@synerhcorp.com.br',
      matricula: 'SYR0022',
      admissao: '01/02/2024',
      desempenho: '8,3',
      pdis: 1,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 23,
      nome: 'Amanda Ribeiro',
      cargo: 'Assistente de RH',
      departamento: 'Recursos Humanos',
      status: 'ATIVO',
      iniciais: 'AR',
      email: 'amanda.ribeiro@synerhcorp.com.br',
      matricula: 'SYR0023',
      admissao: '13/05/2024',
      desempenho: '8,5',
      pdis: 1,
      feedbacks: 3,
      avaliacoes: 2,
    },
    {
      id: 24,
      nome: 'Eduardo Martins',
      cargo: 'Analista de Suporte',
      departamento: 'Tecnologia',
      status: 'ATIVO',
      iniciais: 'EM',
      email: 'eduardo.martins@synerhcorp.com.br',
      matricula: 'SYR0024',
      admissao: '22/01/2024',
      desempenho: '8,4',
      pdis: 2,
      feedbacks: 3,
      avaliacoes: 2,
    },
  ];

  const [colaborador, setColaborador] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(false);
  const [dadosParciais, setDadosParciais] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function buscarLista(url: string) {
      try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
          return { ok: false, dados: [] as any[] };
        }

        const dados = await resposta.json();

        return {
          ok: true,
          dados: Array.isArray(dados) ? dados : [],
        };
      } catch {
        return { ok: false, dados: [] as any[] };
      }
    }

    async function carregarColaborador() {
      try {
        setCarregando(true);
        setErroApi(false);
        setDadosParciais(false);

        const respostaColaboradores = await fetch(
          'https://synerrh.onrender.com/colaboradores',
        );

        if (!respostaColaboradores.ok) {
          throw new Error('Não foi possível carregar os colaboradores.');
        }

        const colaboradoresApi = await respostaColaboradores.json();

        const colaboradorApi = Array.isArray(colaboradoresApi)
          ? colaboradoresApi.find(
              (item: any) => item.id === Number(id),
            )
          : null;

        if (!ativo) {
          return;
        }

        if (!colaboradorApi) {
          setColaborador(null);
          return;
        }

        const [avaliacoesResultado, pdisResultado, feedbacksResultado] =
          await Promise.all([
            buscarLista('https://synerrh.onrender.com/avaliacoes'),
            buscarLista('https://synerrh.onrender.com/pdis'),
            buscarLista('https://synerrh.onrender.com/feedbacks'),
          ]);

        if (!ativo) {
          return;
        }

        const possuiDadosParciais =
          !avaliacoesResultado.ok ||
          !pdisResultado.ok ||
          !feedbacksResultado.ok;

        setDadosParciais(possuiDadosParciais);

        const colaboradorId = Number(colaboradorApi.id);

        const avaliacoesDoColaborador = avaliacoesResultado.dados.filter(
          (avaliacao: any) =>
            Number(
              avaliacao.colaboradorId ?? avaliacao.colaborador?.id,
            ) === colaboradorId,
        );

        const pdisDoColaborador = pdisResultado.dados.filter(
          (pdi: any) =>
            Number(pdi.colaboradorId ?? pdi.colaborador?.id) ===
            colaboradorId,
        );

        const feedbacksDoColaborador = feedbacksResultado.dados.filter(
          (feedback: any) =>
            Number(
              feedback.colaboradorId ?? feedback.colaborador?.id,
            ) === colaboradorId,
        );

        const notasValidas = avaliacoesDoColaborador
          .map((avaliacao: any) => avaliacao.nota)
          .filter(
            (nota: any) =>
              nota !== null &&
              nota !== undefined &&
              nota !== '' &&
              Number.isFinite(Number(nota)),
          )
          .map((nota: any) => Number(nota));

        const mediaDesempenho =
          notasValidas.length > 0
            ? (
                notasValidas.reduce(
                  (total: number, nota: number) => total + nota,
                  0,
                ) / notasValidas.length
              )
                .toFixed(1)
                .replace('.', ',')
            : '—';

        const prioridadeStatus: Record<string, number> = {
          EM_ANDAMENTO: 1,
          ATRASADO: 2,
          NAO_INICIADO: 3,
          CONCLUIDO: 4,
        };

        const pdisOrdenados = [...pdisDoColaborador].sort(
          (a: any, b: any) => {
            const prioridadeA = prioridadeStatus[a.status] ?? 99;
            const prioridadeB = prioridadeStatus[b.status] ?? 99;

            if (prioridadeA !== prioridadeB) {
              return prioridadeA - prioridadeB;
            }

            return Number(b.id ?? 0) - Number(a.id ?? 0);
          },
        );

        const pdiApi = pdisOrdenados[0] ?? null;

        const statusPdi = pdiApi
          ? pdiApi.status === 'EM_ANDAMENTO'
            ? 'EM ANDAMENTO'
            : pdiApi.status === 'CONCLUIDO'
              ? 'CONCLUÍDO'
              : pdiApi.status === 'ATRASADO'
                ? 'ATRASADO'
                : 'A INICIAR'
          : 'SEM PDI';

        const pdiAtual = pdiApi
          ? {
              titulo:
                pdiApi.titulo ??
                pdiApi.objetivo ??
                'Plano de desenvolvimento',
              descricao:
                pdiApi.descricao ??
                pdiApi.objetivo ??
                'Acompanhe os objetivos de desenvolvimento deste colaborador.',
              progresso: Math.min(
                100,
                Math.max(0, Number(pdiApi.progresso ?? 0)),
              ),
              status: statusPdi,
            }
          : null;

        const demo = detalhesDemo.find(
          (item) =>
            item.email === colaboradorApi.email ||
            item.nome === colaboradorApi.nome,
        );

        const nome = colaboradorApi.nome ?? 'Colaborador';
        const partesNome = nome.trim().split(/\s+/);
        const iniciais =
          partesNome.length > 1
            ? `${partesNome[0][0]}${partesNome[partesNome.length - 1][0]}`.toUpperCase()
            : nome.slice(0, 2).toUpperCase();

        const statusApi = colaboradorApi.status ?? 'ATIVO';
        const status =
          statusApi === 'FERIAS'
            ? 'FÉRIAS'
            : statusApi === 'AFASTADO'
              ? 'AFASTADO'
              : statusApi;

        const admissao = colaboradorApi.dataAdmissao
          ? new Date(colaboradorApi.dataAdmissao).toLocaleDateString('pt-BR', {
              timeZone: 'UTC',
            })
          : demo?.admissao ?? '—';

        setColaborador({
          ...demo,
          ...colaboradorApi,
          iniciais,
          status,
          admissao,
          desempenho: avaliacoesResultado.ok ? mediaDesempenho : '—',
          avaliacoes: avaliacoesResultado.ok
            ? avaliacoesDoColaborador.length
            : '—',
          pdis: pdisResultado.ok ? pdisDoColaborador.length : '—',
          feedbacks: feedbacksResultado.ok
            ? feedbacksDoColaborador.length
            : '—',
          pdiAtual,
          possuiAvaliacao: avaliacoesDoColaborador.length > 0,
          possuiPdi: pdisDoColaborador.length > 0,
          possuiFeedback: feedbacksDoColaborador.length > 0,
        });
      } catch (error) {
        if (!ativo) {
          return;
        }

        const fallback = detalhesDemo.find(
          (item) => item.id === Number(id),
        );

        setColaborador(fallback ?? null);
        setErroApi(true);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarColaborador();

    return () => {
      ativo = false;
    };
  }, [id]);

  function voltarParaColaboradores() {
    router.back();
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4936F5" />

          <Text style={styles.loadingTitle}>
            Carregando perfil...
          </Text>

          <Text style={styles.loadingText}>
            Buscando os dados do colaborador no SynerRH.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!colaborador) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>
          Colaborador não encontrado
        </Text>

        <Text style={styles.notFoundText}>
          Não foi possível localizar esse perfil.
        </Text>

        <TouchableOpacity
          style={styles.backButtonNotFound}
          onPress={voltarParaColaboradores}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar para colaboradores"
        >
          <Ionicons
            name="people-outline"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.backButtonNotFoundText}>
            Voltar para colaboradores
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* Voltar */}
      <TouchableOpacity
        onPress={voltarParaColaboradores}
        activeOpacity={0.7}
        hitSlop={10}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Voltar para colaboradores"
      >
        <Ionicons
          name="people-outline"
          size={18}
          color="#334155"
        />

        <Text style={styles.backButtonText}>
          Voltar para colaboradores
        </Text>
      </TouchableOpacity>

      {erroApi && (
        <View style={styles.apiWarning}>
          <Ionicons
            name="cloud-offline-outline"
            size={18}
            color="#A36C00"
          />

          <Text style={styles.apiWarningText}>
            A API não respondeu agora. Exibindo os dados demonstrativos salvos no app.
          </Text>
        </View>
      )}

      {dadosParciais && !erroApi && (
        <View style={styles.apiWarning}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#A36C00"
          />

          <Text style={styles.apiWarningText}>
            O perfil foi carregado, mas alguns indicadores não puderam ser atualizados agora.
          </Text>
        </View>
      )}

      {/* Cabeçalho do perfil */}
      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {colaborador.iniciais}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {colaborador.nome}
            </Text>

            <Text style={styles.profileRole}>
              {colaborador.cargo}
            </Text>

            <Text style={styles.profileDepartment}>
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

        <View style={styles.profileDivider} />

        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>
              MATRÍCULA
            </Text>

            <Text style={styles.dataValue}>
              {colaborador.matricula}
            </Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>
              ADMISSÃO
            </Text>

            <Text style={styles.dataValue}>
              {colaborador.admissao}
            </Text>
          </View>
        </View>

        <View style={styles.emailArea}>
          <Text style={styles.dataLabel}>
            E-MAIL
          </Text>

          <Text style={styles.emailText}>
            {colaborador.email}
          </Text>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Visão geral
        </Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              Desempenho
            </Text>

            <Text style={styles.metricNumber}>
              {colaborador.desempenho}
            </Text>

            <Text style={styles.metricDescription}>
              média atual
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              Avaliações
            </Text>

            <Text style={styles.metricNumber}>
              {colaborador.avaliacoes === 0
                ? 'Sem avaliação'
                : colaborador.avaliacoes}
            </Text>

            <Text style={styles.metricDescription}>
              {colaborador.avaliacoes === 0 ? 'nenhuma registrada' : 'registradas'}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              PDIs
            </Text>

            <Text style={styles.metricNumber}>
              {colaborador.pdis === 0
                ? 'Sem PDI'
                : colaborador.pdis}
            </Text>

            <Text style={styles.metricDescription}>
              {colaborador.pdis === 0 ? 'nenhum cadastrado' : 'planos'}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              Feedbacks
            </Text>

            <Text style={styles.metricNumber}>
              {colaborador.feedbacks === 0
                ? 'Sem feedback'
                : colaborador.feedbacks}
            </Text>

            <Text style={styles.metricDescription}>
              {colaborador.feedbacks === 0 ? 'nenhum recebido' : 'recebidos'}
            </Text>
          </View>
        </View>
      </View>

      {/* Desenvolvimento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Desenvolvimento
        </Text>

        <View style={styles.developmentCard}>
          <View style={styles.developmentHeader}>
            <View style={styles.developmentTitleArea}>
              <Text style={styles.developmentLabel}>
                PDI ATUAL
              </Text>

              <Text style={styles.developmentTitle}>
                {colaborador.pdiAtual?.titulo ?? 'Nenhum PDI cadastrado'}
              </Text>
            </View>

            <View style={styles.developmentBadge}>
              <Text style={styles.developmentBadgeText}>
                {colaborador.pdiAtual?.status ?? 'SEM PDI'}
              </Text>
            </View>
          </View>

          <Text style={styles.developmentDescription}>
            {colaborador.pdiAtual?.descricao ??
              'Este colaborador ainda não possui um plano de desenvolvimento registrado.'}
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressValue,
                {
                  width: `${colaborador.pdiAtual?.progresso ?? 0}%` as any,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {colaborador.pdiAtual
              ? `${colaborador.pdiAtual.progresso ?? 0}% concluído`
              : 'Sem progresso para acompanhar'}
          </Text>
        </View>
      </View>

      {/* Atividades recentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Atividades recentes
        </Text>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Text>📝</Text>
          </View>

          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>
              Avaliação de desempenho
            </Text>

            <Text style={styles.activityDescription}>
              {colaborador.possuiAvaliacao
                ? 'Há avaliação registrada para este colaborador.'
                : 'Nenhuma avaliação registrada até o momento.'}
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Text>🎯</Text>
          </View>

          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>
              PDI atualizado
            </Text>

            <Text style={styles.activityDescription}>
              {colaborador.possuiPdi
                ? 'Há plano de desenvolvimento registrado.'
                : 'Nenhum PDI registrado até o momento.'}
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Text>💬</Text>
          </View>

          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>
              Feedback registrado
            </Text>

            <Text style={styles.activityDescription}>
              {colaborador.possuiFeedback
                ? 'Há feedback disponível no histórico.'
                : 'Nenhum feedback registrado até o momento.'}
            </Text>
          </View>
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  loadingTitle: {
    marginTop: 14,
    color: '#0A1633',
    fontSize: 16,
    fontWeight: '800',
  },

  loadingText: {
    marginTop: 6,
    color: '#71809A',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  apiWarning: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF6DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  apiWarningText: {
    flex: 1,
    color: '#805B00',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
  },

  container: {
    flex: 1,
    backgroundColor: '#F6F9FE',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // VOLTAR

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

  // PERFIL

  profileCard: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 20,

    padding: 18,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 62,
    height: 62,

    borderRadius: 31,

    backgroundColor: '#EEEAFE',

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#4936F5',

    fontSize: 18,
    fontWeight: '800',
  },

  profileInfo: {
    flex: 1,

    marginLeft: 14,
  },

  profileName: {
    color: '#0A1633',

    fontSize: 20,
    fontWeight: '800',
  },

  profileRole: {
    marginTop: 4,

    color: '#53627A',

    fontSize: 12,
    fontWeight: '600',
  },

  profileDepartment: {
    marginTop: 3,

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

  profileDivider: {
    height: 1,

    backgroundColor: '#EEF2F7',

    marginVertical: 18,
  },

  dataGrid: {
    flexDirection: 'row',

    gap: 12,
  },

  dataItem: {
    flex: 1,

    backgroundColor: '#F8FAFE',

    borderRadius: 12,

    padding: 12,
  },

  dataLabel: {
    color: '#8290A8',

    fontSize: 8,
    fontWeight: '800',

    letterSpacing: 0.6,
  },

  dataValue: {
    marginTop: 5,

    color: '#263653',

    fontSize: 11,
    fontWeight: '700',
  },

  emailArea: {
    marginTop: 12,

    backgroundColor: '#F8FAFE',

    borderRadius: 12,

    padding: 12,
  },

  emailText: {
    marginTop: 5,

    color: '#263653',

    fontSize: 11,
    fontWeight: '600',
  },

  // SEÇÕES

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    color: '#0A1633',

    fontSize: 17,
    fontWeight: '800',

    marginBottom: 12,
  },

  // MÉTRICAS

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

  metricLabel: {
    color: '#71809A',

    fontSize: 11,
    fontWeight: '700',
  },

  metricNumber: {
    marginTop: 8,

    color: '#4936F5',

    fontSize: 18,
    fontWeight: '800',
  },

  metricDescription: {
    marginTop: 3,

    color: '#8290A8',

    fontSize: 9,
  },

  // DESENVOLVIMENTO

  developmentCard: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 18,

    padding: 18,
  },

  developmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    gap: 10,
  },

  developmentLabel: {
    color: '#4936F5',

    fontSize: 8,
    fontWeight: '800',

    letterSpacing: 0.6,
  },

  developmentTitleArea: {
    flex: 1,
    paddingRight: 10,
  },

  developmentTitle: {
    marginTop: 6,

    color: '#0A1633',

    fontSize: 15,
    fontWeight: '800',
  },

  developmentBadge: {
    backgroundColor: '#EEEAFE',

    borderRadius: 20,

    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  developmentBadgeText: {
    color: '#4936F5',

    fontSize: 7,
    fontWeight: '800',
  },

  developmentDescription: {
    marginTop: 12,

    color: '#71809A',

    fontSize: 11,
    lineHeight: 17,
  },

  progressBackground: {
    marginTop: 16,

    width: '100%',
    height: 7,

    backgroundColor: '#E7EAF3',

    borderRadius: 10,

    overflow: 'hidden',
  },

  progressValue: {
    width: '60%',
    height: '100%',

    backgroundColor: '#4936F5',

    borderRadius: 10,
  },

  progressText: {
    marginTop: 7,

    color: '#71809A',

    fontSize: 9,
  },

  // ATIVIDADES

  activityCard: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#DFE9F7',

    borderRadius: 14,

    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 10,
  },

  activityIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: '#F3F0FF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  activityInfo: {
    flex: 1,

    marginLeft: 12,
  },

  activityTitle: {
    color: '#263653',

    fontSize: 12,
    fontWeight: '800',
  },

  activityDescription: {
    marginTop: 3,

    color: '#8290A8',

    fontSize: 10,
  },

  // NÃO ENCONTRADO

  notFoundContainer: {
    flex: 1,

    backgroundColor: '#F6F9FE',

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  notFoundTitle: {
    color: '#0A1633',

    fontSize: 20,
    fontWeight: '800',

    textAlign: 'center',
  },

  notFoundText: {
    marginTop: 8,

    color: '#71809A',

    fontSize: 12,

    textAlign: 'center',
  },

  backButtonNotFound: {
    marginTop: 20,
    minHeight: 44,
    backgroundColor: '#4936F5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  backButtonNotFoundText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },
});