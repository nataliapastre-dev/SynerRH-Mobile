import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] =
    useState("Usuário");

  const [inicialUsuario, setInicialUsuario] =
    useState("U");

  const currentCycle = {
    status: "EM ANDAMENTO",
    title: "1º Ciclo de Avaliação 2026",
    description:
      "Ciclo de avaliação de desempenho da equipe.",
    startDate: "31/08/2026",
    endDate: "14/12/2026",
    progress: 58,
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsuario();
    }, [])
  );

  async function carregarUsuario() {
    try {
      const sessaoSalva =
        await AsyncStorage.getItem(
          "@synerrh_sessao"
        );

      if (!sessaoSalva) {
        return;
      }

      const sessao = JSON.parse(sessaoSalva);

      if (sessao.nome) {
        const nomeCompleto =
          sessao.nome.trim();

        const partesNome =
          nomeCompleto
            .split(/\s+/)
            .filter(Boolean);

        let nomeExibicao = nomeCompleto;

        if (partesNome.length >= 2) {
          nomeExibicao =
            `${partesNome[0]} ${
              partesNome[
                partesNome.length - 1
              ]
            }`;
        }

        setNomeUsuario(nomeExibicao);

        setInicialUsuario(
          partesNome[0]
            .charAt(0)
            .toUpperCase()
        );
      }
    } catch (error) {
      console.error(
        "Erro ao carregar usuário:",
        error
      );
    }
  }

  async function sair() {
    try {
      await AsyncStorage.removeItem(
        "@synerrh_sessao"
      );

      console.log("Sessão encerrada.");

      router.replace("/login");
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho SynerRH */}
      <View style={styles.header}>
        <View>
          <Image
            source={require(
              "../../assets/images/synerh-logo.png"
            )}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.userArea}>
          <View style={styles.userInfo}>
            <Pressable
              onPress={() =>
                router.push("/minha-conta")
              }
              style={({ pressed }) => [
                styles.accountNameButton,
                pressed &&
                  styles.accountNameButtonPressed,
              ]}
            >
              <Text
                style={styles.userLabel}
                numberOfLines={1}
              >
                {nomeUsuario}
              </Text>
            </Pressable>

            <Pressable
              onPress={sair}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed &&
                  styles.logoutButtonPressed,
              ]}
            >
              <Text style={styles.logoutText}>
                Sair
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              router.push("/minha-conta")
            }
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.avatarPressed,
            ]}
          >
            <Text style={styles.avatarText}>
              {inicialUsuario}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Painel principal */}
      <View style={styles.hero}>
        <View style={styles.badges}>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeBlueText}>
              VISÃO GERAL
            </Text>
          </View>

          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>
              ● Dados atualizados
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          Visão geral da sua equipe
        </Text>

        <Text style={styles.description}>
          Acompanhe desempenho, desenvolvimento
          e os principais indicadores de pessoas
          em um só lugar.
        </Text>

        <Text style={styles.slogan}>
          Pessoas no centro. Dados para decisões
          melhores.
        </Text>

        {/* Equipe monitorada */}
        <View style={styles.teamCard}>
          <Text style={styles.teamLabel}>
            EQUIPE MONITORADA
          </Text>

          <View style={styles.teamRow}>
            <View>
              <Text style={styles.teamNumber}>
                24
              </Text>

              <Text
                style={styles.teamDescription}
              >
                colaboradores cadastrados
              </Text>
            </View>

            <View style={styles.activeBadge}>
              <Text
                style={styles.activeBadgeText}
              >
                22 ativos
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            Colaboradores
          </Text>

          <Text style={styles.metricNumber}>
            24
          </Text>

          <Text style={styles.metricStatus}>
            22 ativos
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            Avaliações
          </Text>

          <Text style={styles.metricNumber}>
            24
          </Text>

          <Text style={styles.metricStatus}>
            5 pendentes
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            PDIs ativos
          </Text>

          <Text style={styles.metricNumber}>
            10
          </Text>

          <Text style={styles.metricStatus}>
            3 atrasados
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            Feedbacks
          </Text>

          <Text style={styles.metricNumber}>
            10
          </Text>

          <Text style={styles.metricStatus}>
            4 positivos · 3 desenvolvimento
          </Text>
        </View>
      </View>

      {/* Desempenho e participação */}
      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>
          Desempenho e participação
        </Text>

        <View style={styles.performanceGrid}>
          <View style={styles.performanceCard}>
            <Text
              style={styles.performanceLabel}
            >
              Desempenho médio
            </Text>

            <Text
              style={styles.performanceNumber}
            >
              8,5
            </Text>

            <Text
              style={
                styles.performanceDescription
              }
            >
              média geral
            </Text>
          </View>

          <View style={styles.performanceCard}>
            <Text
              style={styles.performanceLabel}
            >
              Participação
            </Text>

            <Text
              style={styles.performanceNumber}
            >
              {currentCycle.progress}%
            </Text>

            <Text
              style={
                styles.performanceDescription
              }
            >
              ciclo atual
            </Text>
          </View>
        </View>
      </View>

      {/* Ciclo atual */}
      <View style={styles.cycleSection}>
        <Text style={styles.sectionTitle}>
          Ciclo atual
        </Text>

        <View style={styles.cycleCard}>
          <View style={styles.cycleTop}>
            <View style={styles.cycleBadge}>
              <Text
                style={styles.cycleBadgeText}
              >
                {currentCycle.status}
              </Text>
            </View>

            <Text
              style={styles.cyclePercentage}
            >
              {currentCycle.progress}%
            </Text>
          </View>

          <Text style={styles.cycleTitle}>
            {currentCycle.title}
          </Text>

          <Text style={styles.cycleDescription}>
            {currentCycle.description}
          </Text>

          <View style={styles.cycleDates}>
            <View>
              <Text
                style={styles.cycleDateLabel}
              >
                INÍCIO
              </Text>

              <Text style={styles.cycleDate}>
                {currentCycle.startDate}
              </Text>
            </View>

            <Text style={styles.cycleArrow}>
              →
            </Text>

            <View>
              <Text
                style={styles.cycleDateLabel}
              >
                TÉRMINO
              </Text>

              <Text style={styles.cycleDate}>
                {currentCycle.endDate}
              </Text>
            </View>
          </View>

          <View
            style={styles.progressBackground}
          >
            <View
              style={[
                styles.progressValue,
                {
                  width: `${currentCycle.progress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {currentCycle.progress}% de
            participação no ciclo
          </Text>
        </View>
      </View>

      {/* Ações rápidas */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>
          Ações rápidas
        </Text>

        <View style={styles.quickActionsGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/cronograma")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              📅
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              Cronograma
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/avaliacoes")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              📝
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              Avaliações
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/pdi")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              🎯
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              PDI
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/feedbacks")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              💬
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              Feedbacks
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/colaboradores")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              👥
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              Colaboradores
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed &&
                styles.quickActionCardPressed,
            ]}
            onPress={() =>
              router.push("/people-insights")
            }
          >
            <Text
              style={styles.quickActionIcon}
            >
              🤖
            </Text>

            <Text
              style={styles.quickActionTitle}
            >
              People Insights
            </Text>
          </Pressable>
        </View>
      </View>
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

  // CABEÇALHO

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E5ECF7",
  },

  logoImage: {
    width: 180,
    height: 55,
  },

  userArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userInfo: {
    maxWidth: 130,
    alignItems: "flex-end",
  },

  accountNameButton: {
    alignSelf: "flex-end",
  },

  accountNameButtonPressed: {
    opacity: 0.6,
  },

  userLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#263653",
    textAlign: "right",
  },

  logoutButton: {
    marginTop: 5,
    alignSelf: "flex-end",
  },

  logoutButtonPressed: {
    opacity: 0.6,
  },

  logoutText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#E5484D",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#5538F5",

    alignItems: "center",
    justifyContent: "center",
  },

  avatarPressed: {
    opacity: 0.7,
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  // PAINEL PRINCIPAL

  hero: {
    margin: 16,
    backgroundColor: "#FFFFFF",

    borderRadius: 20,
    padding: 20,

    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  badgeBlue: {
    backgroundColor: "#146EF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeBlueText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  badgeGreen: {
    backgroundColor: "#E8FFF5",
    borderWidth: 1,
    borderColor: "#53D6A1",

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,
  },

  badgeGreenText: {
    color: "#078A5B",
    fontSize: 10,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",

    color: "#0A1633",
    maxWidth: 320,
  },

  description: {
    marginTop: 10,

    fontSize: 14,
    lineHeight: 21,

    color: "#53627A",
  },

  slogan: {
    marginTop: 15,

    fontSize: 12,
    fontWeight: "700",

    color: "#146EF5",
  },

  // EQUIPE MONITORADA

  teamCard: {
    marginTop: 24,
    backgroundColor: "#4936F5",

    borderRadius: 16,
    padding: 18,
  },

  teamLabel: {
    color: "#DAD5FF",

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

    marginTop: 10,
  },

  teamNumber: {
    color: "#FFFFFF",

    fontSize: 32,
    fontWeight: "800",
  },

  teamDescription: {
    color: "#E7E4FF",

    fontSize: 10,
    marginTop: 2,
  },

  activeBadge: {
    backgroundColor: "#715FFF",

    paddingHorizontal: 11,
    paddingVertical: 7,

    borderRadius: 20,
  },

  activeBadgeText: {
    color: "#FFFFFF",

    fontSize: 10,
    fontWeight: "700",
  },

  // INDICADORES

  metricsGrid: {
    marginHorizontal: 16,
    marginTop: 4,

    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  metricCard: {
    width: "48%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,
    padding: 16,

    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  metricLabel: {
    fontSize: 12,
    color: "#71809A",
  },

  metricNumber: {
    marginTop: 8,

    fontSize: 26,
    fontWeight: "800",

    color: "#0A1633",
  },

  metricStatus: {
    marginTop: 5,

    fontSize: 10,
    fontWeight: "700",

    color: "#078A5B",
  },

  // DESEMPENHO E PARTICIPAÇÃO

  performanceSection: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A1633",

    marginBottom: 12,
  },

  performanceGrid: {
    flexDirection: "row",
    gap: 12,
  },

  performanceCard: {
    width: "48%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,
    padding: 16,

    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  performanceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71809A",
  },

  performanceNumber: {
    marginTop: 10,

    fontSize: 30,
    fontWeight: "800",

    color: "#4936F5",
  },

  performanceDescription: {
    marginTop: 4,

    fontSize: 10,
    color: "#8290A8",
  },

  // CICLO ATUAL

  cycleSection: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  cycleCard: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,
    padding: 18,

    borderWidth: 1,
    borderColor: "#DFE9F7",
  },

  cycleTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cycleBadge: {
    backgroundColor: "#EEEAFE",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,
  },

  cycleBadgeText: {
    color: "#4936F5",

    fontSize: 9,
    fontWeight: "800",
  },

  cyclePercentage: {
    color: "#4936F5",

    fontSize: 20,
    fontWeight: "800",
  },

  cycleTitle: {
    marginTop: 16,

    color: "#0A1633",

    fontSize: 18,
    fontWeight: "800",
  },

  cycleDescription: {
    marginTop: 6,

    color: "#71809A",

    fontSize: 11,
    lineHeight: 16,
  },

  cycleDates: {
    marginTop: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cycleDateLabel: {
    color: "#8290A8",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.6,
  },

  cycleDate: {
    marginTop: 4,

    color: "#263653",

    fontSize: 11,
    fontWeight: "700",
  },

  cycleArrow: {
    color: "#4936F5",

    fontSize: 20,
    fontWeight: "700",
  },

  progressBackground: {
    marginTop: 18,

    width: "100%",
    height: 7,

    backgroundColor: "#E7EAF3",

    borderRadius: 10,

    overflow: "hidden",
  },

  progressValue: {
    height: "100%",

    backgroundColor: "#4936F5",

    borderRadius: 10,
  },

  progressText: {
    marginTop: 7,

    color: "#71809A",

    fontSize: 9,
  },

  // AÇÕES RÁPIDAS

  quickActionsSection: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  quickActionCard: {
    width: "48%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    paddingVertical: 20,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: "#DFE9F7",

    alignItems: "center",
    justifyContent: "center",
  },

  quickActionCardPressed: {
    opacity: 0.7,
  },

  quickActionIcon: {
    fontSize: 26,
    marginBottom: 10,
  },

  quickActionTitle: {
    fontSize: 12,
    fontWeight: "700",

    color: "#263653",

    textAlign: "center",
  },
});