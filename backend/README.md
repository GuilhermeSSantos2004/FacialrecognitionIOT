# AdvInvestor Backend API

API REST desenvolvida em Node.js com Express e SQLite para o aplicativo AdvInvestor.

## 🚀 Tecnologias

- Node.js
- Express
- SQLite3
- JWT (JSON Web Tokens)
- Bcrypt.js
- CORS

## 📦 Instalação

```bash
npm install
```

## ▶️ Execução

```bash
npm start
# ou
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📝 Endpoints Disponíveis

### Autenticação

#### POST /api/auth/login
Realiza login de usuário.

**Body:**
```json
{
  "username": "admin",
  "password": "1234"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@advinvestor.com"
  }
}
```

#### POST /api/auth/register
Registra novo usuário.

**Body:**
```json
{
  "username": "novouser",
  "password": "senha123",
  "email": "user@email.com"
}
```

#### GET /api/auth/profile
Retorna perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

### Investimentos

Todas as rotas de investimento requerem autenticação via token JWT no header.

#### GET /api/investments
Lista todos os investimentos do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "logo": "https://...",
    "title": "Apple Inc.",
    "description": "AAPL | Nasdaq",
    "price": "190.45",
    "growth": "1.82",
    "growthValue": "3.42",
    "acoes": 10,
    "precoMedio": 180.0,
    "valorTotal": 1904.5,
    "resultado": 104.5,
    "resultadoPercentual": 5.8,
    "chartData": []
  }
]
```

#### GET /api/investments/:id
Busca um investimento específico.

#### POST /api/investments
Cria novo investimento (compra).

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "logo": "https://...",
  "title": "Apple Inc.",
  "description": "AAPL | Nasdaq",
  "price": 190.45,
  "growth": 1.82,
  "growthValue": 3.42,
  "acoes": 10,
  "precoMedio": 180.0
}
```

#### PUT /api/investments/:id
Atualiza investimento existente (comprar mais ações).

**Body:**
```json
{
  "acoes": 15,
  "price": 195.0
}
```

#### DELETE /api/investments/:id
Remove investimento (vende todas as ações).

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token nas requisições:

```
Authorization: Bearer {seu_token_aqui}
```

## 👤 Usuário Padrão

- **Username:** admin
- **Password:** 1234
- **Email:** admin@advinvestor.com

## 🗄️ Banco de Dados

O banco de dados SQLite é criado automaticamente em `database.sqlite` na raiz do projeto backend.

### Estrutura das Tabelas

**users**
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT - hash bcrypt)
- email (TEXT)
- created_at (DATETIME)

**investments**
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- logo (TEXT)
- title (TEXT)
- description (TEXT)
- price (REAL)
- growth (REAL)
- growth_value (REAL)
- acoes (INTEGER)
- preco_medio (REAL)
- valor_total (REAL)
- resultado (REAL)
- resultado_percentual (REAL)
- created_at (DATETIME)
