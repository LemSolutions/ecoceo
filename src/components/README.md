# Components Directory

This directory contains all React components organized by their usage context.

## Structure

### `_public/` - Public Components
Components used in public-facing pages and features:
- **About/** - About page components
- **Blog/** - Blog-related components
- **Common/** - Shared utility components
- **Contact/** - Contact form and related components
- **Features/** - Feature showcase components
- **Footer/** - Site footer components
- **Header/** - Site header components
- **Hero/** - Hero section components
- **Navigation/** - Navigation components
- **Projects/** - Project showcase components
- **ScrollToTop/** - Scroll to top functionality
- **Services/** - Service-related components
- **Shop/** - E-commerce components
- **Testimonials/** - Testimonial components
- **ThreeJS/** - 3D visualization components

### `_dashboard/` - Dashboard Components
Components used in private dashboard and admin areas:
- **Auth/** - Authentication components (Login, Logout, ProtectedRoute)
- **Analytics/** - Analytics and reporting components
- **Dashboard/** - Main dashboard components and widgets

## Usage Guidelines

1. **Public components** should be reusable and not contain business logic
2. **Dashboard components** may contain more complex state management
3. Use TypeScript for all components
4. Follow the existing naming conventions
5. Export components from index files when appropriate

## Import Examples

```typescript
// Public components
import { Hero } from '@/components/_public/Hero'
import { Footer } from '@/components/_public/Footer'

// Dashboard components
import { LoginForm } from '@/components/_dashboard/Auth'
import { DashboardOverview } from '@/components/_dashboard/Dashboard'
```