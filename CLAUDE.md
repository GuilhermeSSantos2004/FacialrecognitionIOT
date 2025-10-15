# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing an educational financial investment mobile application called **AdvInvestor**. The app is built with React Native and Expo, focusing on interactive financial education.

**Default Credentials:**
- Username: `admin`
- Password: `1234`

## Development Commands

### Backend API

```bash
cd backend
npm install        # First time only
npm start          # Start the API server on http://localhost:3000
```

The backend must be running before starting the mobile app.

### Mobile App (Frontend)

```bash
cd xp-investimentos-AppClone
npm install        # First time only
npx expo start     # Start Expo development server
```

### Platform-Specific Builds
```bash
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

## Architecture Overview

### Navigation Structure

The app uses a **nested navigation pattern** with React Navigation:

1. **Root Navigation** ([src/navigation/Navigation/navigation.tsx](xp-investimentos-AppClone/src/navigation/Navigation/navigation.tsx))
   - Stack Navigator that manages authentication flow
   - Routes: `Login` → `HomeTab`

2. **Bottom Tab Navigator** ([src/bottomTabNavigation/tabNavigation.tsx](xp-investimentos-AppClone/src/bottomTabNavigation/tabNavigation.tsx))
   - Main app navigation with 4 tabs:
     - `Feed`: Educational content and articles (FeedStack)
     - `Cofrinho`: Savings goals/"piggy banks" (CofrinhoStack)
     - `Conta`: Account overview with balance and transactions
     - `Carteira`: Investment portfolio (InvestimentoStack)

3. **Nested Stack Navigators**
   - `FeedStackNavigation`: Article browsing and details
   - `CofrinhoStackNavigation`: Savings goal management
   - `InvestimentoStackNavigation`: Investment search, details, buy/sell flows

### Context Architecture

The app uses React Context for global state management:

- **GlobalContext** ([src/contexts/global-context.tsx](xp-investimentos-AppClone/src/contexts/global-context.tsx)): Root context wrapper
- **UserContext** ([src/contexts/user-context.tsx](xp-investimentos-AppClone/src/contexts/user-context.tsx)): Manages user authentication state and credentials
  - Provides: `userCredentials`, `setUserCredentialsContext`, `flushCredentials`, `isLoggedIn`

### Data Management - Cache Service

The app uses **AsyncStorage** for local data persistence via a comprehensive cache service ([src/service/cacheService.ts](xp-investimentos-AppClone/src/service/cacheService.ts)):

**Key Cache Keys:**
- `CACHE_KEYS.USER_PROFILE`
- `CACHE_KEYS.TRANSACTIONS`
- `CACHE_KEYS.NOTIFICATIONS`
- `CACHE_KEYS.PIGGY_BANKS`
- `CACHE_KEYS.INVESTMENTS`
- `CACHE_KEYS.ARTICLES`
- `CACHE_KEYS.PIGGY_TRANSFERS`

**Important Functions:**
- `initializeDefaultData()`: Initializes mock data for development
- `getCachedPiggyBanks()`, `addPiggyBank()`, `updatePiggyBank()`
- `getCachedInvestments()`, `addInvestment()`
- `getCachedArticles()`, `addArticle()`
- `addNotification()`, `addPiggyTransfer()`
- `clearPagesCache()`: Clears all cached data

**When working with cached data**: Always use the helper functions from cacheService.ts rather than directly accessing AsyncStorage.

### Component Architecture

The app follows **Atomic Design** principles:

- **Atoms** ([src/components/atoms/](xp-investimentos-AppClone/src/components/atoms/)): Basic UI components
  - `Box.tsx`: Reusable card container
  - `LineChart.tsx`, `CandleStickChart.tsx`, `GoalChart.tsx`: Chart components using Victory Native
  - `GoalProgressBar.tsx`: Progress indicators
  - `TitleWithUnderline.tsx`: Typography component

- **Molecules** ([src/components/molecules/](xp-investimentos-AppClone/src/components/molecules/)): Composed components
  - `BalanceBox.tsx`: Account balance display
  - `InvestimentCard.tsx`: Investment card UI
  - `GoalsSection.tsx`: Goal display section
  - Notification boxes for transactions and piggy bank transfers

- **Organisms** ([src/components/organism/](xp-investimentos-AppClone/src/components/organism/)): Complex feature components
  - `Notifications.tsx`: Notification list
  - `InvestimentList.tsx`: Investment portfolio list

- **Screens** ([src/components/screen/](xp-investimentos-AppClone/src/components/screen/)): Full page components
  - Main screens: `Home`, `Conta`, `Investimento`, `Cofrinho`, `Login`
  - Detail screens: `InvestimentoDetails`, `CofrinhoDetails`, `ArticleDetails`
  - Flow screens: `InvestimentoBuy`, `InvestimentoSell`, `InvestimentoSearch`, `CofrinhoCreate`

### Dynamic Rendering System

The app implements a **component registry pattern** for dynamic content rendering:

**Core Files:**
- [src/components/Educa-module/DynamicRenderer.tsx](xp-investimentos-AppClone/src/components/Educa-module/DynamicRenderer.tsx): Main renderer component
- [src/components/Educa-module/dynamic-components/index.ts](xp-investimentos-AppClone/src/components/Educa-module/dynamic-components/index.ts): Component registry

**How it works:**
1. Components are registered with unique codes (e.g., `EDU_SNIPPET_001`, `EDU_ARTICLE_002`, `INVEST_LIST_001`)
2. `getComponentByCode(code)` retrieves the component from the registry
3. `DynamicRenderer` accepts a `code` prop and renders the corresponding component with passed props

**To add new dynamic components:**
1. Create component in `src/components/Educa-module/dynamic-components/`
2. Register it in `index.ts` with a unique code
3. Use `<DynamicRenderer code="YOUR_CODE" props={...} />`

### API Integration

The app now uses a **local Node.js + Express backend** with SQLite database.

- **Base URL**: `http://localhost:3000/api` (configured in [src/service/axios-client.ts](xp-investimentos-AppClone/src/service/axios-client.ts))
- **Backend Location**: [backend/](backend/)
- **Database**: SQLite (`backend/database.sqlite`)

**AxiosClient** ([src/service/axios-client.ts](xp-investimentos-AppClone/src/service/axios-client.ts)): Configured HTTP client
- Automatically includes Bearer token from AsyncStorage
- Supports both JSON and FormData requests
- Method: `buildAxiosWithHeaders(isFormData?: boolean)`

**Available Services:**
- **LoginService** ([src/service/login/login-service.ts](xp-investimentos-AppClone/src/service/login/login-service.ts)): Handles authentication
  - `POST /api/auth/login`: User login
  - Returns JWT token and user data
- **InvestmentService** ([src/service/investment/investment-service.ts](xp-investimentos-AppClone/src/service/investment/investment-service.ts)): Manages investments
  - `GET /api/investments`: List all user investments
  - `GET /api/investments/:id`: Get specific investment
  - `POST /api/investments`: Create new investment (buy)
  - `PUT /api/investments/:id`: Update investment (buy more shares)
  - `DELETE /api/investments/:id`: Delete investment (sell all shares)

### Key Technologies & Libraries

**Frontend (Mobile App):**
- **UI Framework**: React Native 0.74.5 with Expo SDK 51
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Charts**: Victory Native (for financial charts)
- **State**: React Context + AsyncStorage
- **HTTP**: Axios
- **UI Components**: React Native Paper
- **Notifications**: Toastify React Native
- **Icons**: React Native Vector Icons (Ionicons)

**Backend (API):**
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Middleware**: CORS, body-parser

## Important Patterns

### Authentication Flow
1. User logs in via [Login](xp-investimentos-AppClone/src/components/screen/Login/index.tsx) screen
2. Frontend calls `LoginService.login()` which sends credentials to `POST /api/auth/login`
3. Backend validates credentials using bcryptjs and returns JWT token
4. Token stored in AsyncStorage on the mobile device
5. `UserContext` updated with user data
6. Navigation redirects to `HomeTab`
7. All subsequent API requests include the JWT token in Authorization header via `AxiosClient`

### Investment Data Structure
Each investment includes:
- Basic info: `logo`, `title`, `description`, `price`
- Performance: `growth`, `growthValue`, `chartData`
- Portfolio details: `acoes`, `precoMedio`, `valorTotal`, `resultado`, `resultadoPercentual`

### Piggy Bank (Cofrinho) Data Structure
Each piggy bank includes:
- Identity: `id`, `nome`, `imagem`
- Financial: `valor`, `meta`, `progresso`
- Analytics: `dadosGrafico`, `labelsGrafico`
- Summary: `resumo` (saldoInicial, entradas, saidas, diferenca)

## File Organization

```
projects/
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQLite configuration
│   │   ├── controllers/
│   │   │   ├── authController.js      # Login/register logic
│   │   │   └── investmentController.js # Investment CRUD
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── investmentRoutes.js
│   │   └── server.js            # Express app entry point
│   ├── database.sqlite          # SQLite database (auto-created)
│   ├── package.json
│   └── README.md
│
└── xp-investimentos-AppClone/   # React Native mobile app
    ├── App.tsx                  # Root component with providers
    ├── src/
    │   ├── bottomTabNavigation/ # Bottom tab configuration
    │   ├── components/
    │   │   ├── atoms/           # Basic UI components
    │   │   ├── molecules/       # Composed components
    │   │   ├── organism/        # Complex features
    │   │   ├── screen/          # Full page screens
    │   │   └── Educa-module/    # Dynamic rendering system
    │   ├── contexts/            # React Context providers
    │   ├── domain/model/        # TypeScript data models
    │   ├── navigation/          # Navigation stacks
    │   ├── service/
    │   │   ├── axios-client.ts  # HTTP client config
    │   │   ├── cacheService.ts  # AsyncStorage utilities
    │   │   ├── login/
    │   │   │   └── login-service.ts
    │   │   └── investment/
    │   │       ├── investment-service.ts  # Investment API calls
    │   │       └── README.md              # Usage examples
    │   └── types/               # TypeScript type definitions
    └── assets/                  # Images and static files
```

## Working with This Codebase

### Adding a New Backend API Endpoint
1. Create controller function in `backend/src/controllers/`
2. Add route in appropriate route file in `backend/src/routes/`
3. Apply `authMiddleware` if authentication is required
4. Create corresponding service in frontend `src/service/`
5. Follow the pattern from `InvestmentService` for API calls

### Adding Frontend Service for New API
1. Create service file in `xp-investimentos-AppClone/src/service/your-feature/`
2. Import and use `AxiosClient` for HTTP calls
3. Define TypeScript interfaces for request/response
4. Handle errors with try/catch and user-friendly messages
5. See [investment-service.ts](xp-investimentos-AppClone/src/service/investment/investment-service.ts) as reference

### Adding a New Screen
1. Create component in `src/components/screen/YourScreen/index.tsx`
2. Add route to appropriate stack navigator
3. Update TypeScript navigation types if needed

### Adding a New Chart Type
1. Create atom component in `src/components/atoms/YourChart.tsx`
2. Use Victory Native components for consistency
3. Accept data format compatible with existing patterns

### Modifying Cached Data
1. Define TypeScript interface in `cacheService.ts`
2. Add cache key to `CACHE_KEYS` constant
3. Create getter/setter functions following existing patterns
4. Update `initializeDefaultData()` if default data needed

### Working with Investments
The app now stores investments in the backend database. Use `InvestmentService` to:
- **Create**: `createInvestment(data)` - Buys new investment
- **Read**: `getInvestments()` - Lists all user investments
- **Update**: `updateInvestment(id, data)` - Buys more shares
- **Delete**: `deleteInvestment(id)` - Sells all shares

See [src/service/investment/README.md](xp-investimentos-AppClone/src/service/investment/README.md) for usage examples.

### Testing Login
Use the credentials: username `admin`, password `1234`. The backend creates this user automatically on first startup. Login now authenticates against the backend API and returns a JWT token.
