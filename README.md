# Referral Capital Application

A comprehensive business loan application platform built with Next.js, featuring a 14-step application process, compliance checking, and campaign management.

## 🏗️ Project Overview

This application provides a streamlined process for businesses to apply for capital funding through Keep Technologies. It includes features for user management, business verification, compliance checking, and application tracking.

### Key Features

- **14-Step Application Process**: Complete loan application workflow
- **Personal & Business Information Collection**: KYC/KYB data gathering
- **Canadian Business Registry Integration**: Automated business verification
- **Compliance & Risk Assessment**: Adverse media monitoring and AI categorization
- **Campaign Management**: UTM tracking and user analytics
- **Real-time Validation**: Client and server-side form validation
- **Analytics Integration**: Microsoft Clarity, Google Analytics, Facebook Pixel

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- npm or yarn
- Supabase account and project
- API keys (see [API Keys Setup](#api-keys-setup))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd referral-capital-application

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

The application will be available at `http://localhost:3009`

## 📊 Tech Stack

### Frontend

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: React hooks and localStorage

### External Integrations

- **Business Data**: Canadian Business Registry API
- **Compliance**: NewsAPI, OpenAI
- **Analytics**: Microsoft Clarity, Google Tag Manager, Facebook Pixel
- **Meeting Scheduling**: HubSpot Meetings

## 🗂️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── business-search/      # Business registry integration
│   │   ├── compliance/           # Compliance checking APIs
│   │   ├── users/                # User management APIs
│   │   └── test-*/               # Testing endpoints
│   ├── step/[id]/               # Multi-step form pages
│   ├── page.tsx                 # Homepage
│   └── layout.tsx               # Root layout with analytics
├── components/                   # Reusable React components
│   ├── EligibilityCriteria.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   └── TestimonialsSection.tsx
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client functions
│   ├── businessRegistry.ts     # Business lookup logic
│   ├── compliance.ts            # Compliance checking
│   ├── geoapify.ts             # Address validation
│   ├── ipAddress.ts            # IP detection
│   └── supabase.ts             # Database client
public/
├── css/                         # Webflow-imported styles
├── images/                      # Static assets
└── js/                         # Legacy JavaScript
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External API Keys
NEWSAPI_KEY=your_newsapi_key
OPENAI_API_KEY=your_openai_key

# Canadian Business Registry
CANADA_BUSINESS_API_KEY=your_business_registry_key

# Optional: Development URLs
TEST_URL=http://localhost:3009
```

### Database Setup

The application uses Supabase with the following main tables:

- `users` - User/contact management
- `applications` - Loan application data
- `businesses` - Canadian business registry data
- `compliance_checks` - Risk assessment results

Run the setup scripts to create tables:

```bash
# Create tables and policies
node setup-supabase.js
node setup-users-table.js
```

## 📝 API Keys Setup

Detailed instructions for obtaining required API keys:

### 1. Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get URL and anon key from Settings → API
3. Get service role key for server operations

### 2. NewsAPI (Compliance)

1. Sign up at [newsapi.org](https://newsapi.org)
2. Free tier: 1,000 requests/month
3. Used for adverse media monitoring

### 3. OpenAI (AI Categorization)

1. Get API key from [openai.com/api](https://openai.com/api)
2. Used for business categorization (~$0.002/request)

See [get-api-keys.md](./get-api-keys.md) for detailed setup instructions.

## 🎯 Application Flow

### User Journey

1. **Homepage** - Landing page with CTA
2. **Step 1: Loan Type** - Select funding type
3. **Step 2: Personal Info** - Contact details + address
4. **Step 3: Business Owner** - Ownership verification
5. **Step 4: Business Search** - Find/verify business
6. **Step 5: Monthly Sales** - Revenue information
7. **Step 6: Existing Loans** - Current debt details
8. **Step 7: Funding Amount** - Loan requirements
9. **Step 8: Funding Purpose** - Use of funds
10. **Step 9: Business Details** - Company information
11. **Step 10: Financial Info** - Revenue and credit
12. **Step 11: Bank Connection** - Financial verification
13. **Step 12: Additional Details** - Final information
14. **Step 13: Review & Submit** - Final submission

### Data Flow

1. **Form Data**: Stored in localStorage during completion
2. **User Creation**: Personal data saved at Step 2
3. **Business Verification**: Registry lookup at Step 4
4. **Compliance Checks**: Background verification throughout
5. **Final Submission**: Complete application to database

## 🧪 Testing

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Check code formatting
npm run format:check

# Format code
npm run format

# Test compliance system
npm run test:compliance

# Test against production
npm run test:compliance:prod
```

### Testing Endpoints

- `/test-api` - Manual API testing interface
- `/api/debug` - Environment variables check
- `/api/test-compliance` - Compliance system test

### Automated Tests

```bash
# Test complete form workflow
node test-form-simulation.js

# Test business search
node test-business-search.js

# Test user creation
node test-user-creation.js

# Test compliance checks
node test-compliance.js
```

## 🚀 Deployment

### Vercel (Recommended)

The application is configured for deployment on Vercel:

1. **Connect Repository**

   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   - Add all `.env.local` variables to Vercel dashboard
   - Ensure database URLs are production-ready

3. **Build Configuration**
   - Next.js build automatically configured
   - Static assets served from `/public`

### Production URLs

- **Staging**: `https://referral-capital-application-1gv42zxj3-try-keep.vercel.app`
- **Production**: Configure custom domain in Vercel

### Database Migration

For production deployment:

```sql
-- Run in Supabase SQL editor
-- 1. Create tables
\i supabase-setup.sql
\i supabase-users-table.sql
\i supabase-businesses-table.sql
\i supabase-compliance-table.sql

-- 2. Set up RLS policies
\i fix-users-rls.sql
\i fix-applications-rls.sql
```

## 🔒 Security

### Data Protection

- All PII encrypted in database
- RLS (Row Level Security) enabled
- API rate limiting implemented
- Input validation on all endpoints

### Compliance Features

- Adverse media monitoring
- Business verification
- Credit check authorization
- GDPR-compliant consent tracking

## 📈 Analytics & Tracking

### Integrated Analytics

- **Microsoft Clarity**: Heatmaps and session recordings
- **Google Tag Manager**: Custom event tracking
- **Facebook Pixel**: Conversion tracking
- **UTM Tracking**: Campaign attribution

### Custom Events

- Form step completions
- Business search interactions
- Application submissions
- Error tracking

## 🛠️ Development

### Code Organization

- **Monolithic Form**: Single 2000+ line form component (needs refactoring)
- **API Layer**: Organized by feature in `/api` directory
- **Type Safety**: TypeScript interfaces for all data
- **Validation**: Client and server-side validation

### Code Quality

- **Linting**: ESLint with Next.js configuration for code quality
- **Formatting**: Prettier for consistent code formatting
- **Type Checking**: TypeScript for compile-time error detection

**Code Quality Commands:**

```bash
# Check and fix linting issues
npm run lint

# Check code formatting
npm run format:check

# Auto-format code
npm run format

# Type checking
npx tsc --noEmit
```

### Known Technical Debt

1. **Large Form Component**: Step components should be extracted
2. **State Management**: Consider Redux/Zustand for complex state
3. **Error Handling**: Needs centralized error boundary
4. **Testing**: Unit tests needed for critical paths

### Recommended Refactoring

See development notes for breaking down the monolithic form into manageable components.

## 🐛 Troubleshooting

### Common Issues

**Build Errors**

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection**

```bash
# Test Supabase connection
node test-supabase-connection.js
```

**API Keys**

```bash
# Verify all keys are configured
curl http://localhost:3009/api/debug
```

### Debug Tools

- `/api/debug` - Environment check
- Browser DevTools - Network and console logs
- Supabase Dashboard - Database queries
- Vercel Analytics - Performance monitoring

## 📞 Support

### Documentation

- [API Keys Setup](./get-api-keys.md)
- [Testing Guide](./README-TESTING.md)

### Contact

For development questions or issues, please refer to the project repository or contact the development team.

---

**Built with ❤️ by Devin (the real one)**
