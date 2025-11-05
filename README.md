# VestIA — Front-end (React)

O **VestIA** é uma plataforma gamificada de estudos para vestibulares (ENEM, Fuvest e afins).
Este repositório contém o **front-end** responsável pela interface web, interação com a API, autenticação de usuários e experiência de gamificação com assistente de IA para explicações conceituais e análise de erros.

---

## 🧱 Arquitetura e Tecnologias

* React 19 + React Router (SPA e navegação dinâmica)
* TypeScript (segurança de tipos e legibilidade)
* Vite (build e servidor de desenvolvimento rápidos)
* Tailwind CSS 4 (design responsivo e acessível)
* Axios (requisições HTTP e camada de serviço configurável)
* React-Toastify (notificações e feedback ao usuário)
* SDK OpenAI com **OpenRouter** (assistente de IA)

Configuração por variáveis de ambiente no `.env`:

```env
VITE_BACKEND_URL=https://api.seudominio.com
VITE_OPENROUTER_API_KEY=sua_chave_openrouter
```

Essas variáveis permitem a comunicação segura com o back-end e a integração com o modelo de IA.

---

## 🗃️ Estrutura e Fluxos (resumo)

**Arquitetura de pastas:**

```
src/
 ├── api/                # Configuração do OpenRouter e integração com IA
 ├── components/         # Layouts, elementos visuais e componentes reutilizáveis
 ├── context/            # Contexto de autenticação (AuthContext)
 ├── hooks/              # Lógicas de quiz, estatísticas e amostragem de questões
 ├── models/             # Tipagens TypeScript (interfaces de Usuário, Questão, Resposta etc.)
 ├── pages/              # Páginas principais (Home, Login, Registro, Perfil, Quiz)
 ├── services/           # Comunicação com a API (Axios)
 ├── App.tsx             # Definição de rotas e layout base
 └── main.tsx            # Ponto de entrada da aplicação
```

**Fluxos principais:**

* **Autenticação (`AuthContext`)**

  * Persistência de `usuario` e `token` via `localStorage`.
  * Funções `handleLogin` e `handleLogout` para controle de sessão.
  * Integração com `auth.service` para login, cadastro e atualização.

* **Camada HTTP (`auth.service.ts`)**

  * Instância Axios com `baseURL` definida por `VITE_BACKEND_URL`.
  * Métodos de autenticação, atualização de pontos e consulta de questões.

* **Quiz e Gamificação (`useQuiz.ts`, `QuizForm`, `Quiz`)**

  * Embaralhamento de questões e controle de pontuação.
  * Atualização de streaks e taxa de acerto.
  * Sincronização com o back-end e fallback local em caso de falha de rede.

* **Questão Diária / Home (`useQuestao.ts`)**

  * Carregamento aleatório de questão rápida.
  * Exibição imediata e responsiva com animações leves.

* **Assistente de IA (`openRouter.api.ts`)**

  * Explicação de conceitos e análise de respostas.
  * Detecção de truncamento e complementação de saída.

* **Acessibilidade e UX**

  * Navegação por teclado garantida em formulários e botões.
  * Feedback visual e auditivo via toasts não bloqueantes.
  * Design responsivo com Tailwind e sem dependência de frameworks pesados.

---

## 🔐 Integração com o Back-end

O front-end consome os endpoints REST do back-end (`Spring Boot`) para:

* **Autenticação:** login, registro, atualização de dados.
* **Questões:** listagem, filtro por assunto, busca individual.
* **Gamificação:** envio de pontuação e histórico de acertos.

A autenticação é feita via **JWT**, armazenado no `localStorage` e injetado automaticamente no cabeçalho
`Authorization: Bearer <token>` nas requisições Axios autenticadas.

---

## 💻 Como Rodar Localmente

### 🧩 Requisitos

* [Node.js 20+](https://nodejs.org/)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Backend em execução (ex.: [`http://localhost:8080`](http://localhost:8080))

### ⚙️ Passo a passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ProjetoVestIA/VestIA_Front-end.git
   cd VestIA_Front-end
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o arquivo `.env` na raiz do projeto:**

   ```env
   VITE_BACKEND_URL=http://localhost:8080
   VITE_OPENROUTER_API_KEY=sua_chave_openrouter
   ```

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   O app será iniciado em:

   ```
   http://localhost:5173
   ```

---

## 📸 Snippets de Tela

Alguns exemplos das principais interfaces do **VestIA**:

| Tela                      | Descrição                                                                       | Exemplo                                                                 |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Home / Questão Diária** | Mostra uma questão aleatória com feedback imediato e opção de tentar novamente. | ![Home](https://github.com/user-attachments/assets/391bb41c-eb1f-4aa8-9205-1bbfec3bffe8) |
| **Login / Registro**      | Campos com validação em tempo real e feedback de autenticação via toasts.       | ![Login](https://github.com/user-attachments/assets/1944aa66-e9ec-4f55-bdb7-bb964a2ce8fd) |
| **Formulário de Quiz**    | Página de configuração do quiz, onde o usuário define **quantidade de questões**, **assunto** e, quando aplicável, a **língua estrangeira**. | ![Formulário de Quiz](https://github.com/user-attachments/assets/d89e69c2-1239-46fd-857a-1aa23d090bdf) |
| **Quiz**                  | Exibição sequencial de questões com contagem de acertos e barra de progresso.   | ![Quiz](https://github.com/user-attachments/assets/d51b4358-7633-4ae3-a2d8-bb6396066f57) |
| **Perfil do Usuário**     | Estatísticas pessoais, pontuação acumulada e histórico de quizzes.              | ![Profile](https://github.com/user-attachments/assets/b381007f-851f-4872-88c3-d5948a041c17) |

---

## ☁️ Deploy e Serviços em Nuvem

O front-end é preparado para **deploy contínuo** e hospedagem em ambientes **cloud-native**, como **Vercel**, **Render** ou **Netlify**.

### 🔹 Infraestrutura e serviços utilizados

* **Vite Build + Node**
  Gera artefatos otimizados (HTML/CSS/JS minificados) prontos para deploy estático.

* **OpenRouter (IA)**
  Serviço conectado via SDK OpenAI, hospedado em servidores AWS, fornecendo explicações e feedback inteligente no quiz.

Esses serviços garantem velocidade, confiabilidade e escalabilidade para a interface do VestIA.

---

> 💡 **Dica:** O front-end foi desenvolvido priorizando acessibilidade, velocidade e compatibilidade entre navegadores modernos.
> Recursos como feedback visual instantâneo, responsividade e integração com IA tornam o VestIA uma experiência fluida tanto para desktop quanto dispositivos móveis.
