# Quick Start Guide - AdvInvestor

## 🚀 Início Rápido

### 1. Iniciar o Backend (obrigatório primeiro!)

```bash
cd backend
npm install  # Primeira vez apenas
npm start    # Servidor rodará em http://localhost:3000
```

Você verá:
```
🚀 Servidor rodando na porta 3000
📊 API disponível em: http://localhost:3000
💡 Usuário padrão: admin / 1234
```

**Importante**: Mantenha este terminal aberto! O backend precisa estar rodando para o app funcionar.

### 2. Iniciar o App Mobile

Em outro terminal:

```bash
cd xp-investimentos-AppClone
npm install  # Primeira vez apenas
npx expo start
```

Use as opções do Expo:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web
- Ou escaneie o QR code com o app Expo Go

### 3. Login

Use as credenciais padrão:
- **Usuário**: `admin`
- **Senha**: `1234`

## 🧪 Testando as APIs

### Testar Login (com curl)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}'
```

Resposta esperada:
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@advinvestor.com"
  }
}
```

### Testar Criar Investimento (com curl)

**1. Primeiro, faça login e copie o token**

**2. Use o token para criar investimento:**

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "logo": "https://example.com/apple.png",
    "title": "Apple Inc.",
    "description": "AAPL | Nasdaq",
    "price": 190.45,
    "growth": 1.82,
    "growthValue": 3.42,
    "acoes": 10,
    "precoMedio": 180.0
  }'
```

### Testar Listar Investimentos

```bash
curl -X GET http://localhost:3000/api/investments \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📱 Usando no App Mobile

### 1. Tela de Login
- Abra o app
- Digite: `admin` / `1234`
- Clique em "Entrar"
- O app fará login via API e receberá um token JWT

### 2. Criando Investimentos
Use a tela de compra no app. Os dados agora serão salvos no banco de dados SQLite do backend.

### 3. Visualizando Investimentos
Vá para a aba "Carteira" para ver seus investimentos carregados do backend.

## 🗄️ Banco de Dados

O banco de dados SQLite é criado automaticamente em:
```
backend/database.sqlite
```

Você pode inspecioná-lo com ferramentas como:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Viewer (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer)

## 🔍 Troubleshooting

### Backend não inicia
- Verifique se tem Node.js instalado: `node --version`
- Certifique-se de ter rodado `npm install` na pasta backend

### App não conecta ao backend
- Certifique-se que o backend está rodando (terminal aberto)
- Verifique se a URL no `axios-client.ts` é `http://localhost:3000/api`
- Em Android, pode precisar usar `http://10.0.2.2:3000/api` (emulador) ou IP da sua máquina

### Erro de autenticação
- Verifique se o token está sendo salvo no AsyncStorage
- Tente fazer logout e login novamente
- Verifique o console do backend para ver os erros

## 📚 Documentação Adicional

- [Backend README](backend/README.md) - Documentação completa da API
- [Investment Service README](xp-investimentos-AppClone/src/service/investment/README.md) - Exemplos de uso
- [CLAUDE.md](CLAUDE.md) - Arquitetura completa do projeto

## 🛠️ Estrutura do Projeto

```
projects/
├── backend/              → API Node.js + Express + SQLite
└── xp-investimentos-AppClone/  → App React Native + Expo
```

## ✅ Checklist de Desenvolvimento

- [ ] Backend rodando em http://localhost:3000
- [ ] App mobile conectado (Expo)
- [ ] Login funcionando com admin/1234
- [ ] Token JWT sendo retornado
- [ ] Investimentos sendo salvos no banco SQLite
- [ ] Investimentos sendo listados do backend

---

**Desenvolvido por:**
- Enricco Rossi de Souza Carvalho Miranda - RM551717
- Gabriel Marquez Trevisan - RM99227
- Guilherme Silva dos Santos - RM551168
- Samuel Ramos de Almeida - RM99134
- Laura Claro Mathias - RM98747
