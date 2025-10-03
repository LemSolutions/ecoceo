# Services Directory

This directory contains service modules organized by their scope and purpose.

## Structure

### `_external/` - External Services
Services that interact with external APIs, databases, or third-party services:
- **analyticsService.ts** - Analytics and tracking services
- **marketingService.ts** - Marketing automation and campaign services
- **orderService.ts** - Order processing and e-commerce services
- **sanityDataService.ts** - Sanity CMS data services

### `_internal/` - Internal Services
Services that handle internal business logic and data processing:
- **mockDataService.ts** - Mock data generation for development/testing
- **sanitySync.ts** - Data synchronization services

## Usage Guidelines

1. **External services** should handle API calls, data fetching, and external integrations
2. **Internal services** should contain business logic, data transformation, and internal operations
3. Use TypeScript for all services
4. Implement proper error handling
5. Use consistent naming conventions
6. Export services as default exports or named exports as appropriate

## Import Examples

```typescript
// External services
import analyticsService from '@/services/_external/analyticsService'
import { marketingService } from '@/services/_external/marketingService'

// Internal services
import mockDataService from '@/services/_internal/mockDataService'
import { syncData } from '@/services/_internal/sanitySync'
```

## Service Patterns

- Use async/await for asynchronous operations
- Implement proper error handling with try/catch
- Return consistent response formats
- Use TypeScript interfaces for service responses
- Consider implementing service caching where appropriate