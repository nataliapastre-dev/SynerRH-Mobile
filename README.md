# 📱 SynerRH Mobile

<div align="center">
  <img 
    src="https://i.postimg.cc/KYnZp6FM/imagem-Syner-RH-mobile.png"
    alt="SynerRH Mobile"
    width="650"
  />
</div>

<br>

<div align="center">

**Gestão de pessoas na palma da mão.**

Aplicativo desenvolvido com **React Native, Expo e TypeScript**, criado a partir da evolução do projeto SynerRH Web.

[🌐 Testar aplicação](https://synerrh-mobile.onrender.com) •
[💻 SynerRH Web](https://synerrh-frontend.onrender.com/) •
[👩‍💻 Meu GitHub](https://github.com/nataliapastre-dev)

</div>

---

## 💜 Sobre o SynerRH Mobile

O **SynerRH Mobile** é uma aplicação de gestão e desenvolvimento de pessoas criada como evolução do projeto **SynerRH Web**.

Depois de desenvolver a versão web, surgiu uma nova pergunta durante o projeto:

> **Como seria levar a experiência do SynerRH também para o celular?**

A partir dessa ideia comecei a estudar e desenvolver uma versão mobile utilizando **React Native e Expo**.

Além de ampliar o projeto original, o SynerRH Mobile se tornou meu **primeiro aplicativo mobile** e uma oportunidade de aprender uma nova tecnologia construindo uma aplicação completa na prática.

A proposta é permitir que informações importantes relacionadas à gestão de pessoas possam ser acessadas de maneira simples e organizada pelo celular, reunindo colaboradores, avaliações, PDIs, feedbacks, cronograma e indicadores em uma única experiência.

---

## 🎯 Objetivo do projeto

O objetivo do SynerRH é centralizar informações relacionadas ao desenvolvimento e acompanhamento de pessoas dentro de uma organização.

Na versão mobile, procurei manter os principais conceitos existentes no projeto web, mas adaptando a experiência para uma interface pensada para telas menores e navegação por toque.

Entre os principais objetivos estão:

- Facilitar o acesso às informações dos colaboradores
- Centralizar avaliações e acompanhamento de desempenho
- Organizar Planos de Desenvolvimento Individual
- Registrar e consultar feedbacks
- Disponibilizar indicadores de pessoas
- Acompanhar eventos e ciclos pelo cronograma
- Explorar uma experiência mobile integrada ao ecossistema SynerRH

---

## ✨ Principais funcionalidades

### 🔐 Autenticação

O aplicativo possui fluxo de autenticação com:

- Login
- Cadastro de usuário
- Validações de formulário
- Recuperação de senha
- Persistência de sessão
- Logout

A sessão do usuário é armazenada localmente utilizando **AsyncStorage**.

---

### 🏠 Dashboard

A tela inicial funciona como ponto central de navegação do aplicativo.

Ela reúne:

- Informações do usuário
- Indicadores gerais
- Acesso ao Cronograma
- Avaliações
- PDI
- Feedbacks
- Colaboradores
- People Insights
- Ações rápidas

O objetivo foi permitir que as principais áreas do SynerRH fossem acessadas diretamente pela Home.

---

### 👥 Colaboradores

O módulo de colaboradores permite:

- Visualizar a lista de colaboradores
- Pesquisar colaboradores
- Consultar cargo e departamento
- Visualizar status
- Abrir o perfil individual
- Consultar informações relacionadas ao desenvolvimento de cada pessoa

Os dados são obtidos através da **API do SynerRH**.

---

### 👤 Perfil do colaborador

Cada colaborador possui uma página individual com informações consolidadas.

O perfil utiliza **rotas dinâmicas com Expo Router**, permitindo acessar cada colaborador através do seu identificador.

Além das informações básicas, a tela pode reunir dados relacionados a:

- Avaliações
- PDI
- Feedbacks
- Indicadores individuais
- Informações profissionais

Essa foi uma das partes que mais exigiu trabalho durante o desenvolvimento, principalmente na integração entre navegação, parâmetros de rota e carregamento dos dados da API.

---

### 📝 Avaliações

O módulo de avaliações permite acompanhar informações relacionadas aos ciclos de avaliação de desempenho.

A interface apresenta dados de maneira adaptada para dispositivos móveis, facilitando a consulta das avaliações pelo aplicativo.

---

### 🎯 PDI

O módulo de **Plano de Desenvolvimento Individual** permite acompanhar objetivos e ações relacionadas ao desenvolvimento profissional.

Os PDIs podem apresentar diferentes situações, facilitando a visualização do progresso de cada plano.

---

### 💬 Feedbacks

Área dedicada ao acompanhamento de feedbacks dentro do sistema.

O objetivo é concentrar informações importantes relacionadas ao desenvolvimento e à comunicação entre colaboradores e liderança.

---

### 📅 Cronograma

O Cronograma organiza eventos e etapas importantes do ciclo de gestão de pessoas.

A versão mobile permite consultar essas informações diretamente pelo aplicativo.

---

### 🤖 People Insights

O **People Insights** reúne indicadores relacionados às pessoas e aos processos de desenvolvimento.

A proposta é facilitar a visualização de informações que possam ajudar no acompanhamento do cenário organizacional.

---

### 👤 Minha Conta

O aplicativo também possui uma área dedicada ao usuário.

É possível:

- Visualizar dados pessoais
- Editar informações
- Consultar dados da conta
- Encerrar a sessão

---

## 🔗 Integração com API

O SynerRH Mobile consome dados da API utilizada pelo ecossistema SynerRH.

Entre os dados consultados estão informações relacionadas a:

```text
/colaboradores
/avaliacoes
/pdis
/feedbacks
```

Isso permite que o aplicativo trabalhe com dados do projeto em vez de funcionar apenas como uma interface estática.

Durante o carregamento das informações, o aplicativo também possui estados visuais para indicar ao usuário que os dados estão sendo consultados.

---

## 🧭 Navegação

A navegação foi desenvolvida utilizando **Expo Router**.

O projeto trabalha com diferentes tipos de rotas, incluindo rotas comuns e dinâmicas.

Exemplo da estrutura:

```text
src/app/
│
├── _layout.tsx
├── index.tsx
├── login.tsx
├── cadastro.tsx
├── esqueci-senha.tsx
├── minha-conta.tsx
├── colaboradores.tsx
├── colaborador/
│   └── [id].tsx
├── avaliacoes.tsx
├── avaliacao/
│   └── [id].tsx
├── pdi.tsx
├── feedbacks.tsx
├── cronograma.tsx
└── people-insights.tsx
```

As rotas `[id].tsx` permitem trabalhar com conteúdos específicos de acordo com o item selecionado.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **React Native** | Desenvolvimento da interface mobile |
| **Expo** | Ambiente de desenvolvimento e execução |
| **Expo Router** | Navegação e rotas |
| **TypeScript** | Tipagem e desenvolvimento da aplicação |
| **AsyncStorage** | Persistência local da sessão |
| **API REST** | Comunicação com os dados do SynerRH |
| **Git** | Controle de versão |
| **GitHub** | Repositório do projeto |
| **Render** | Hospedagem da demonstração web |

---

## 🧠 Desafios e aprendizados

Como este foi meu **primeiro aplicativo mobile**, o projeto trouxe vários desafios que não estavam presentes da mesma forma durante o desenvolvimento da versão web.

Um dos principais aprendizados foi perceber que desenvolver para mobile não significa simplesmente diminuir uma interface web.

Foi necessário pensar em:

- Espaço disponível na tela
- Organização dos componentes
- Navegação por toque
- Fluxo entre telas
- Rotas
- Estados de carregamento
- Experiência do usuário
- Integração com serviços externos

### Alguns desafios encontrados

Durante o desenvolvimento trabalhei na resolução de problemas relacionados a:

**Navegação entre telas**

Foi necessário estruturar corretamente as rotas do Expo Router e entender o comportamento de `push`, `replace`, retorno de telas e rotas dinâmicas.

**Perfil dos colaboradores**

A abertura do perfil individual exigiu trabalhar com parâmetros de rota e identificação correta do colaborador selecionado.

**Integração com API**

As telas precisam aguardar respostas do backend e tratar situações em que os serviços podem levar alguns segundos para responder.

**Persistência da sessão**

Foi necessário armazenar os dados necessários para manter o usuário conectado utilizando AsyncStorage.

**Adaptação da interface**

Elementos originalmente pensados para desktop precisaram ser reorganizados para funcionar melhor em telas menores.

Cada problema resolvido durante o projeto ajudou a entender melhor o funcionamento do React Native e do desenvolvimento mobile.

---

## 📱 Testes

Durante o desenvolvimento, o aplicativo foi testado utilizando:

### Expo Go

O **Expo Go** foi utilizado para executar e testar o aplicativo diretamente em um dispositivo móvel durante o desenvolvimento.

### Web

O Expo também permite executar o projeto no navegador, o que foi utilizado para realizar testes adicionais e disponibilizar uma demonstração pública.

---

## 🌐 Demonstração online

Você pode testar o projeto diretamente pelo navegador:

### 👉 [Abrir SynerRH Mobile](https://synerrh-mobile.onrender.com)

Não é necessário instalar o Expo Go para visualizar a demonstração.

> **Observação:** a primeira inicialização ou algumas consultas podem levar alguns segundos devido à hospedagem dos serviços utilizados pelo projeto.

---

## 💻 SynerRH Web

O SynerRH Mobile nasceu como uma evolução do projeto **SynerRH Web**.

A versão web possui uma experiência desenvolvida originalmente para desktop e serviu como base conceitual para a criação do aplicativo.

### 👉 [Acessar SynerRH Web](https://synerrh-frontend.onrender.com/)

A criação da versão mobile permitiu explorar como uma mesma solução pode oferecer experiências diferentes dependendo da plataforma utilizada.

---

## 🚀 Como executar localmente

### Pré-requisitos

Antes de começar, tenha instalado:

- Node.js
- npm
- Git
- Expo Go, caso queira testar em um dispositivo móvel

---

### 1. Clone o repositório

```bash
git clone https://github.com/nataliapastre-dev/SynerRH-Mobile.git
```

### 2. Acesse a pasta

```bash
cd SynerRH-Mobile
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o Expo

```bash
npx expo start
```

O terminal exibirá um QR Code.

Para executar no celular, abra o **Expo Go** e leia o QR Code.

Também é possível escolher a execução no navegador para testar a versão web.

---

## 📂 Estrutura principal

```text
SynerRH-Mobile/
│
├── assets/
│   └── images/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   └── hooks/
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

A pasta `src/app` concentra as principais telas e rotas da aplicação.

A pasta `components` reúne componentes reutilizáveis utilizados na interface.

---

## 🔄 Do Web para o Mobile

O SynerRH Mobile não começou como um projeto isolado.

Ele nasceu durante a evolução do **SynerRH Web**.

Depois de desenvolver funcionalidades relacionadas a colaboradores, avaliações, PDIs, feedbacks e indicadores na aplicação web, decidi explorar como essas mesmas informações poderiam ser apresentadas em uma experiência mobile.

Esse processo permitiu trabalhar com uma nova tecnologia e, ao mesmo tempo, continuar evoluindo um projeto que já possuía contexto, regras e funcionalidades definidas.

O resultado foi meu primeiro contato mais completo com o desenvolvimento de aplicações utilizando **React Native**.

---

## 📌 Status do projeto

✅ Primeira versão funcional concluída  
✅ Integração com API  
✅ Navegação entre módulos  
✅ Testes no Expo Go  
✅ Versão web para demonstração  
✅ Código publicado no GitHub

O projeto continua aberto para melhorias e novos aprendizados.

---

## 💡 Possíveis evoluções

Algumas possibilidades para versões futuras incluem:

- Evolução da autenticação
- Melhorias na experiência mobile
- Novos indicadores
- Evolução do People Insights
- Notificações
- Novas funcionalidades de gestão
- Aprimoramento da integração entre web e mobile

---

## 👩‍💻 Desenvolvido por

### Natália Pastre

Estudante de **Análise e Desenvolvimento de Sistemas**, desenvolvendo projetos para ampliar meus conhecimentos em desenvolvimento de software e transformar aprendizado em prática.

**Tecnologias que venho trabalhando:**  
React • React Native • TypeScript • JavaScript • Node.js • Java • Spring Boot

🔗 **GitHub:**  
https://github.com/nataliapastre-dev

🔗 **LinkedIn:**  
https://www.linkedin.com/in/nataliapastre-dev/

---

<div align="center">

### 💜 SynerRH

**Pessoas no centro. Tecnologia como aliada.**

</div>
