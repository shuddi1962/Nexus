# NEXUS — Ultimate Production-Ready All-In-One SaaS Platform

[![CI Status](https://github.com/shuddi1962/Nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/shuddi1962/Nexus/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

> **Replace 55+ tools with one platform.** CRM, marketing, creative studio, advertising, automation — all connected.

## 🚀 Platform Overview

NEXUS is a comprehensive SaaS platform that combines multiple business tools into a single, integrated solution. Built with modern technologies and designed for scalability, it serves agencies, businesses, and creators worldwide.

### ✨ Key Features (Phase 1 Complete)

- **🔐 Authentication System**: Complete user management with JWT tokens, role-based access control, and secure password handling
- **🗝️ API Keys Vault**: AES-256-GCM encrypted storage for all platform integrations (OpenRouter, Kie.ai, etc.)
- **📊 Admin Dashboard**: Full platform administration with user management and system monitoring
- **🏗️ Modern Architecture**: Turborepo monorepo with Next.js 15 frontend and Fastify backend
- **🗄️ Database Integration**: InsForge database with 15+ collections for CRM, Ads, Content, and more
- **🔄 Background Jobs**: BullMQ queues for AI model syncing and automation
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🚀 CI/CD Pipeline**: GitHub Actions with automated testing and deployment

### 🛠️ Tech Stack

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand + TanStack Query
- **Animation**: Framer Motion
- **Icons**: Lucide React

#### Backend
- **Runtime**: Node.js 22 LTS
- **Framework**: Fastify 5.0
- **Language**: TypeScript (strict mode)
- **Database**: InsForge (PostgreSQL)
- **Queue**: BullMQ + Redis
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Pino

#### Infrastructure
- **Deployment**: Vercel (frontend), Railway/Fly.io (backend)
- **Database**: InsForge (https://wk49fyqm.us-east.insforge.app)
- **CI/CD**: GitHub Actions
- **Package Manager**: npm workspaces

## 📋 Development Status

### ✅ Phase 1: Foundation & Infrastructure (PUSHED & READY)

**Infrastructure & Setup**
- ✅ Turborepo monorepo configuration
- ✅ InsForge database integration
- ✅ GitHub Actions CI/CD pipeline
- ✅ Environment validation with Zod

**Authentication & Security**
- ✅ User registration and login system
- ✅ JWT token management (access + refresh)
- ✅ Role-based access control (admin/owner/manager/staff/viewer)
- ✅ API Keys Vault with AES-256-GCM encryption

**Backend Architecture**
- ✅ Fastify server with security middleware
- ✅ Database collections (15+ tables)
- ✅ Background job processing (BullMQ)
- ✅ Model syncing for AI services

**Frontend Foundation**
- ✅ Next.js 15 with App Router
- ✅ Admin dashboard layout
- ✅ Marketing homepage structure
- ✅ Responsive design system

**Quality Assurance**
- ✅ TypeScript strict mode compliance
- ✅ ESLint configuration
- ✅ Production build validation
- ✅ CI pipeline passing

### 🚧 Phase 2: User Dashboard & CRM (NEXT)

**Planned Features**
- User dashboard with sidebar navigation
- CRM module (contacts, conversations, pipelines)
- Basic email and SMS integration
- User profile management
- Organization settings

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 22 LTS
- npm 10+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shuddi1962/Nexus.git
   cd Nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy environment files:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

   Configure required environment variables in `apps/api/.env`:
   ```env
   # InsForge
   INSFORGE_URL=https://wk49fyqm.us-east.insforge.app
   INSFORGE_API_KEY=your_api_key_here

   # Auth
   JWT_SECRET=your_64_char_jwt_secret
   JWT_REFRESH_SECRET=your_64_char_refresh_secret

   # Encryption
   ENCRYPTION_KEY=your_64_char_encryption_key

   # Redis
   REDIS_URL=redis://localhost:6379
   ```

4. **Database Setup**
   ```bash
   # Seed demo accounts
   npm run seed --workspace=apps/api
   ```

5. **Development**
   ```bash
   # Start all services
   npm run dev

   # Or start individually
   npm run dev --workspace=apps/web    # Frontend (http://localhost:3000)
   npm run dev --workspace=apps/api    # Backend (http://localhost:3001)
   ```

### 🧪 Testing

```bash
# Run all tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Build check
npm run build
```

### 📦 Build for Production

```bash
# Build all workspaces
npm run build

# Start production servers
npm run start --workspace=apps/web
npm run start --workspace=apps/api
```

## 🔐 Demo Accounts

The platform includes pre-configured demo accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | admin@nexus.demo | NexusAdmin2025! | Full platform access |
| **Owner** | owner@nexus.demo | NexusOwner2025! | Agency plan features |
| **Pro User** | pro@nexus.demo | NexusPro2025! | Pro plan features |
| **Starter** | starter@nexus.demo | NexusStarter2025! | Basic features |
| **Staff** | staff@nexus.demo | NexusStaff2025! | Limited permissions |

## 📁 Project Structure

```
nexus/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (marketing)/      # Public pages
│   │   │   │   ├── (auth)/           # Authentication
│   │   │   │   ├── dashboard/        # User dashboard
│   │   │   │   └── admin/            # Admin panel
│   │   │   ├── components/           # Reusable components
│   │   │   ├── lib/                  # Utilities
│   │   │   └── types/                # TypeScript types
│   │   └── public/                   # Static assets
│   └── api/                          # Fastify backend
│       ├── src/
│       │   ├── routes/               # API routes
│       │   ├── services/             # Business logic
│       │   ├── middleware/           # Route middleware
│       │   ├── jobs/                 # Background jobs
│       │   ├── lib/                  # Utilities
│       │   └── types/                # TypeScript types
│       └── scripts/                  # Database scripts
├── packages/
│   └── shared/                       # Shared types/utilities
├── .github/
│   └── workflows/                    # CI/CD pipelines
└── turbo.json                        # Turborepo configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m "feat: add your feature"`
6. Push: `git push origin feature/your-feature`
7. Create a Pull Request

### Development Guidelines

- **TypeScript**: Strict mode enabled - no `any` types
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Write tests for new features
- **Code Style**: ESLint configuration must pass
- **CI**: All checks must pass before merge

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support, please contact the development team.

---

**Built with ❤️ for modern businesses**