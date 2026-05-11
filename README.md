# Rigatti Store — Fullstack Challenge

Desafio técnico consistindo em uma API integrada a um assistente de Inteligência Artificial (Google Gemini) e um Frontend moderno com React + Vite.

---

## 🚀 Setup Rápido (Rodar local)

### 1. Subir o Banco de Dados (Docker)
O projeto inclui uma configuração docker para subir o MongoDB instantaneamente. Garanta que seu **Docker Desktop** esteja aberto.
```bash
docker-compose up -d
```
*(O MongoDB subirá na porta 27017)*

### 2. Configurar Backend
Abra um terminal:
```bash
cd backend
npm install
```
1. Copie o `.env.example` para `.env`
2. Configure sua `GOOGLE_GENERATIVE_AI_API_KEY` (obtenha de graça em aistudio.google.com). 
*Nota: O sistema funciona mesmo sem chave de IA ativa graças ao nosso mecanismo de Fallback de Segurança.*
```bash
npm run dev
```
*(O servidor rodará na porta 3000)*

### 3. Configurar Frontend
Abra outro terminal:
```bash
cd frontend
npm install
npm run dev
```
1. Copie o `.env.example` para o seu `.env`

*(O frontend rodará na porta 5173)*

---

## 🛠️ Estrutura e Decisões Arquiteturais

### Backend (Node.js + TypeScript + Express)
- **Resiliência & Fallback**: Implementei uma arquitetura tolerante a falhas no `ChatService`. Caso a API externa da IA falhe (limite de cota ou instabilidade), o sistema chaveia automaticamente para o **Modo de Segurança**, executando a busca direto no banco de dados e gerando uma resposta local para não quebrar a experiência do usuário.
- **Multi-tenancy (Company-based)**: As queries filtram `companyId` forçado a nível de serviço, isolando 100% os dados entre empresas para não haver data leak.
- **Vercel AI SDK**: O chat utiliza `tool calling` no `Google Gemini`, forçando o robô a utilizar a função `searchProducts` para basear suas respostas apenas em dados reais.

### Frontend (React 19 + TypeScript + Vite)
- **Design System Shadcn/UI**: Interface dark-mode sofisticada, focada em usabilidade moderna, construída com Tailwind CSS v4.
- **Hook Pattern**: Separação estrita de preocupações/utilidade. A camada visual (`pages`) não possui lógicas complexas; todo o gerenciamento de estados, side-effects e consumo da API residem nos Custom Hooks (`useAuth`, `useChat`, `useProducts`).
- **UX Otimizada**: O formulário de registro gera dinamicamente IDs de empresa válidos para o MongoDB, removendo fricção de configuração para novos usuários.

---

## 🏭 O que eu faria diferente em Produção?

### Escala e Performance
1. **Cache Distribuído**: Introdução do Redis para cachear as respostas dos produtos.
2. **Monitoramento com Grafana, Prometheus**: Criação de painéis demonstrativos para gerenciar logs do sistema em produção.
3. **Busca Vetorial (Vector Search)**: Migração de buscas por regex do MongoDB para Atlas Vector Search ou Pinecone para permitir buscas semânticas avançadas (ex: usuário digita "algo pra calçar" e retornar tênis, chinelos).
4. **Implementação do Swagger**: Uso do Swagger para documentação. Futuramente, clientes podem integrar nossa API.
### Segurança e Qualidade
1. **JWT Rotate**: Substituição do modelo atual por Refresh Tokens em cookies HTTP-Only para mitigar ataques XSS.
2. **Rate Limiting**: Limitação rigorosa nas rotas de IA para prevenir ataques de DoS financeiro (abuso de tokens).
3. **CI/CD**: Pipelines automatizados no GitHub Actions para rodar a suíte de testes (Jest) a cada push.
