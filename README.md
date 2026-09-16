<div align="center">

# 📱 SynerRH Mobile

<img 
  src="https://i.postimg.cc/KYnZp6FM/imagem-Syner-RH-mobile.png"
  alt="SynerRH Mobile"
  width="650"
/>

### Gestão de pessoas na palma da mão.

**Meu primeiro aplicativo mobile, desenvolvido com React Native, Expo e TypeScript a partir da evolução do SynerRH Web.**

[🌐 Testar aplicação](https://synerrh-mobile.onrender.com) •
[💻 SynerRH Web](https://synerrh-frontend.onrender.com/) •
[👩‍💻 GitHub](https://github.com/nataliapastre-dev)

</div>

---

## 💜 Sobre o projeto

O **SynerRH Mobile** é a versão mobile do SynerRH, um sistema voltado à gestão e ao desenvolvimento de pessoas.

Depois de desenvolver a versão web, surgiu a ideia de explorar como as principais funcionalidades do sistema poderiam funcionar também no celular. A partir disso comecei a estudar **React Native e Expo** e transformei essa ideia no meu primeiro aplicativo mobile.

O objetivo foi criar uma experiência adaptada para dispositivos móveis, permitindo acessar informações de colaboradores, avaliações, PDIs, feedbacks, cronograma e indicadores de maneira simples e organizada.

Mais do que reproduzir a versão web em uma tela menor, o desenvolvimento envolveu repensar navegação, organização dos componentes, fluxo entre telas e experiência de uso.

---

## ✨ Principais funcionalidades

### 🔐 Autenticação
- Login e cadastro
- Validações de formulário
- Recuperação de senha
- Persistência de sessão com AsyncStorage
- Logout

### 🏠 Dashboard
- Indicadores gerais da equipe
- Informações do usuário
- Desempenho e participação
- Ciclo atual
- Acesso rápido aos principais módulos

### 👥 Colaboradores
- Listagem de colaboradores
- Pesquisa
- Cargo e departamento
- Status
- Perfil individual
- Informações profissionais

### 📝 Avaliações
Acompanhamento das avaliações de desempenho e dos ciclos avaliativos da equipe.

### 🎯 PDI
Consulta dos Planos de Desenvolvimento Individual e acompanhamento do progresso das ações de desenvolvimento.

### 💬 Feedbacks
Área destinada ao acompanhamento de feedbacks relacionados ao desenvolvimento e à comunicação entre colaboradores e liderança.

### 📅 Cronograma
Visualização de eventos e etapas importantes dos ciclos de gestão de pessoas.

### 🤖 People Insights
Indicadores relacionados às pessoas, desempenho e processos de desenvolvimento.

### 👤 Minha Conta
- Visualização de dados pessoais
- Edição das informações
- Dados da conta
- Encerramento da sessão

---

## 🔗 Integração com a API

O aplicativo consome dados da **API do SynerRH**, permitindo trabalhar com informações reais do projeto em vez de funcionar apenas como uma interface estática.

Entre os principais recursos consumidos estão:

```text
/colaboradores
/avaliacoes
/pdis
/feedbacks
```

As telas trabalham com carregamento dos dados e estados visuais enquanto aguardam as respostas do backend.

---

## 🧭 Navegação e estrutura

A navegação foi desenvolvida utilizando **Expo Router**, trabalhando tanto com rotas comuns quanto com rotas dinâmicas.

Um exemplo é o perfil individual dos colaboradores:

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

As rotas `[id].tsx` permitem abrir conteúdos específicos de acordo com o item selecionado.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **React Native** | Desenvolvimento da interface mobile |
| **Expo** | Ambiente de desenvolvimento e execução |
| **Expo Router** | Navegação e rotas |
| **TypeScript** | Tipagem e desenvolvimento |
| **AsyncStorage** | Persistência local da sessão |
| **API REST** | Comunicação com o backend |
| **Git** | Controle de versão |
| **GitHub** | Repositório do projeto |
| **Render** | Hospedagem da demonstração web |

---

## 🧠 Desafios e aprendizados

Por ser meu **primeiro aplicativo mobile**, o SynerRH Mobile trouxe desafios diferentes dos encontrados durante o desenvolvimento da versão web.

Um dos principais aprendizados foi perceber que desenvolver para mobile não significa simplesmente reduzir uma interface desktop.

Foi necessário trabalhar com:

- Organização dos componentes em telas menores
- Navegação por toque
- Fluxo entre telas
- Rotas comuns e dinâmicas
- Integração com API
- Estados de carregamento
- Persistência da sessão
- Experiência do usuário

### 🧭 Navegação

Durante o desenvolvimento precisei entender melhor o comportamento do **Expo Router**, incluindo navegação com `push`, `replace`, retorno entre telas e parâmetros de rotas dinâmicas.

### 👥 Perfil dos colaboradores

A abertura do perfil individual exigiu trabalhar com o identificador do colaborador, parâmetros de rota e carregamento das informações correspondentes pela API.

### 🌐 Integração com backend

Também foi necessário tratar situações em que o backend leva alguns segundos para responder, garantindo que a interface apresente corretamente os estados de carregamento.

### 💾 Sessão do usuário

Utilizei **AsyncStorage** para persistir as informações necessárias e manter a sessão do usuário no aplicativo.

### 📱 Adaptação para mobile

Componentes originalmente pensados para desktop precisaram ser reorganizados para oferecer uma experiência mais adequada em telas menores.

Cada problema resolvido durante o desenvolvimento contribuiu para ampliar meu conhecimento em React Native e desenvolvimento mobile.

---

## 🌐 Teste o projeto

O aplicativo foi desenvolvido e testado em dispositivo móvel utilizando **Expo Go**.

Para facilitar a avaliação do projeto, também disponibilizei uma versão que pode ser acessada diretamente pelo navegador, sem necessidade de instalar o Expo Go:

### 👉 [Abrir SynerRH Mobile](https://synerrh-mobile.onrender.com)

> **Observação:** a primeira inicialização ou algumas consultas podem levar alguns segundos devido à hospedagem dos serviços utilizados pelo projeto.

Também é possível conhecer o projeto que deu origem à versão mobile:

### 👉 [Abrir SynerRH Web](https://synerrh-frontend.onrender.com/)

---

## 🚀 Como executar localmente

### Pré-requisitos

Tenha instalado:

- Node.js
- npm
- Git
- Expo Go, caso queira testar no celular

### 1. Clone o repositório

```bash
git clone https://github.com/nataliapastre-dev/SynerRH-Mobile.git
```

### 2. Entre na pasta

```bash
cd SynerRH-Mobile
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o projeto

```bash
npx expo start
```

O terminal exibirá um QR Code.

Para testar no celular, abra o **Expo Go** e leia o QR Code. Também é possível executar o projeto pelo navegador.

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

A pasta `src/app` concentra as principais telas e rotas da aplicação, enquanto `components` reúne componentes reutilizáveis da interface.

---

## 📌 Status do projeto

✅ Primeira versão funcional concluída  
✅ Integração com API  
✅ Navegação entre módulos  
✅ Testes no Expo Go  
✅ Demonstração online  
✅ Código publicado no GitHub  

O projeto continua aberto para melhorias e novos aprendizados.

---

## 💡 Próximas evoluções

- Aprimoramento da autenticação
- Melhorias na experiência mobile
- Novos indicadores
- Evolução do People Insights
- Notificações
- Novas funcionalidades de gestão
- Maior integração entre as versões web e mobile

---

<div align="center">

## 👩‍💻 Desenvolvido por

### Natália Pastre

Estudante de **Análise e Desenvolvimento de Sistemas**, transformando aprendizado em projetos práticos de desenvolvimento de software.

**React • React Native • TypeScript • JavaScript • Node.js • Java • Spring Boot**

[GitHub](https://github.com/nataliapastre-dev) •
[LinkedIn](https://www.linkedin.com/in/nataliapastre-dev/)

### 💜 SynerRH

**Pessoas no centro. Tecnologia como aliada.**

</div>
