# ⚽ BALLERS — Football Squad Manager

Aplicação web de gerenciamento de jogadores de futebol com foco em experiência de usuário moderna, inspirada em interfaces de jogos como FIFA.

> Projeto desenvolvido com foco em UX, organização de código e praticar React + TypeScript.

---

## 🚀 Demonstração

📌 Em breve: deploy online +  criação de tela de Login/Register
📌 Projeto local rodando via Vite

---

## 🧠 Objetivo do Projeto

O **BALLERS** é um CRUD completo de jogadores com diferenciais de produto:

* Interface moderna e imersiva (estilo game UI)
* Microinterações (animações e efeitos sonoros)
* Validação robusta de dados
* Arquitetura modular e escalável

---

## 🧱 Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* CSS

### APIs

* [REST Countries](https://restcountries.com)

### Outros

* localStorage (persistência)
* FlagCDN (bandeiras)

## 📁 Estrutura do Projeto

```bash
src/
  assets/
    images/
      background.jpeg
      hero.png
      logo.png
    sounds/
      hover.wav
      confirm.wav

  components/
    common/
      ConfirmModal.tsx
      Toast.tsx

    player/
      PlayerCard.tsx
      PlayerFormModal.tsx
      PlayersFilters.tsx

  hooks/
    usePlayers.ts

  pages/
    Players/
      index.tsx

    Auth/
      Login.tsx
      Register.tsx

  services/
    country/
      countryHelpers.ts
      getCountryCode.ts

  utils/
    getPlayerImage.ts
    playerValidation.ts
    sound.ts

  data/
    playersData.ts

  types/
    player.ts

  App.tsx
  main.tsx
  styles.css
```

## ⚙️ Funcionalidades

### 🧩 CRUD Completo

* Criar jogador
* Editar jogador
* Excluir jogador
* Filtros e listagem dinâmica

---

### 🔍 Filtros Avançados

* Nome
* Posição
* Nacionalidade
* Faixa etária

---

### 🌍 Integração com API

* Busca inteligente de países
* Suporte a PT/EN
* Exibição de bandeiras

---

### 🖼️ Upload de Imagem

* Upload opcional
* Resize automático (120x120)
* Validação de tipo e tamanho

### 🔊 Sound Effects

* Hover (UI feedback)
* Confirm (ações)

---

### ✨ UX / UI Diferenciada

* Animações suaves
* Efeito shine nos cards
* Toasts customizados
* Modal de confirmação
* Feedback visual completo

---

## 🎨 Design

* Tema escuro com destaque roxo
* Tipografia inspirada em interfaces esportivas
* Layout centralizado e responsivo
* Microinterações inspiradas em jogos

## 🧠 Arquitetura

O projeto foi estruturado com separação clara de responsabilidades:

* **Components** → UI
* **Hooks** → estado e lógica
* **Utils** → regras de negócio
* **Pages** → orquestração

## 🧪 Validações

* Nome obrigatório
* Idade entre 16 e 50
* Overall entre 0 e 99
* País válido via API
* Prevenção de duplicidade

## 💾 Persistência

* Dados salvos no `localStorage`
* Inicialização com dataset padrão

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/ballers.git
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Rodar o projeto

```bash
npm run dev
```

---

### 4. Acessar no navegador

```bash
http://localhost:5173/players
```

## 📈 Próximos Passos

* Backend com Node.js + MongoDB
* Autenticação de usuário
* Formação tática (drag & drop)
  
---

# ⚽ BALLERS — Football Squad Manager

Aplicação web de gerenciamento de jogadores de futebol com foco em experiência de usuário moderna, inspirada em interfaces de jogos como FIFA.

> Projeto desenvolvido com foco em UX, organização de código e praticar React + TypeScript.

---

## 🚀 Demonstração

📌 Em breve: deploy online +  criação de tela de Login/Register
📌 Projeto local rodando via Vite

---

## 🧠 Objetivo do Projeto

O **BALLERS** é um CRUD completo de jogadores com diferenciais de produto:

* Interface moderna e imersiva (estilo game UI)
* Microinterações (animações e efeitos sonoros)
* Validação robusta de dados
* Arquitetura modular e escalável

---

## 🧱 Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* CSS

### APIs

* [REST Countries](https://restcountries.com)

### Outros

* localStorage (persistência)
* FlagCDN (bandeiras)

## 📁 Estrutura do Projeto

```bash
src/
  assets/
    images/
      background.jpeg
      hero.png
      logo.png
    sounds/
      hover.wav
      confirm.wav

  components/
    common/
      ConfirmModal.tsx
      Toast.tsx

    player/
      PlayerCard.tsx
      PlayerFormModal.tsx
      PlayersFilters.tsx

  hooks/
    usePlayers.ts

  pages/
    Players/
      index.tsx

    Auth/
      Login.tsx
      Register.tsx

  services/
    country/
      countryHelpers.ts
      getCountryCode.ts

  utils/
    getPlayerImage.ts
    playerValidation.ts
    sound.ts

  data/
    playersData.ts

  types/
    player.ts

  App.tsx
  main.tsx
  styles.css
```

## ⚙️ Funcionalidades

### 🧩 CRUD Completo

* Criar jogador
* Editar jogador
* Excluir jogador
* Filtros e listagem dinâmica

---

### 🔍 Filtros Avançados

* Nome
* Posição
* Nacionalidade
* Faixa etária

---

### 🌍 Integração com API

* Busca inteligente de países
* Suporte a PT/EN
* Exibição de bandeiras

---

### 🖼️ Upload de Imagem

* Upload opcional
* Resize automático (120x120)
* Validação de tipo e tamanho

### 🔊 Sound Effects

* Hover (UI feedback)
* Confirm (ações)

---

### ✨ UX / UI Diferenciada

* Animações suaves
* Efeito shine nos cards
* Toasts customizados
* Modal de confirmação
* Feedback visual completo

---

## 🎨 Design

* Tema escuro com destaque roxo
* Tipografia inspirada em interfaces esportivas
* Layout centralizado e responsivo
* Microinterações inspiradas em jogos

## 🧠 Arquitetura

O projeto foi estruturado com separação clara de responsabilidades:

* **Components** → UI
* **Hooks** → estado e lógica
* **Utils** → regras de negócio
* **Pages** → orquestração

## 🧪 Validações

* Nome obrigatório
* Idade entre 16 e 50
* Overall entre 0 e 99
* País válido via API
* Prevenção de duplicidade

## 💾 Persistência

* Dados salvos no `localStorage`
* Inicialização com dataset padrão

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/Ballers_CRUD.git
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Rodar o projeto

```bash
npm run dev
```

---

### 4. Acessar no navegador

```bash
http://localhost:5173/players
```

## 📈 Próximos Passos

* Backend com Node.js + MongoDB
* Autenticação de usuário
* Formação tática (drag & drop)
  
---

