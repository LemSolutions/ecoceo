# Lib Directory

This directory contains library modules and utilities organized by their scope and dependencies.

## Structure

### `_external/` - External Libraries
Libraries and utilities that interact with external services, APIs, or third-party integrations:
- **supabase.ts** - Supabase client configuration and utilities
- **ai-integrations.ts** - AI service integrations and utilities

### `_internal/` - Internal Libraries
Internal utilities, helpers, and business logic modules:
- **marketing.ts** - Marketing utilities and business logic
- **business-plan-helpers.ts** - Business plan calculation and analysis utilities
- **translation.ts** - Translation and localization utilities

## Usage Guidelines

1. **External libraries** should handle third-party service configurations and integrations
2. **Internal libraries** should contain business logic, utilities, and internal operations
3. Use TypeScript for all library modules
4. Implement proper error handling and validation
5. Use consistent naming conventions
6. Export utilities as both default and named exports as appropriate
7. Document complex functions and modules

## Import Examples

```typescript
// External libraries
import { supabase } from '@/lib/_external/supabase'
import { aiService } from '@/lib/_external/ai-integrations'

// Internal libraries
import { marketingUtils } from '@/lib/_internal/marketing'
import { calculateBusinessPlan } from '@/lib/_internal/business-plan-helpers'
import { translateText } from '@/lib/_internal/translation'
```

## Library Patterns

- Use singleton pattern for service clients
- Implement proper configuration management
- Use environment variables for sensitive data
- Provide fallback values and error handling
- Use TypeScript interfaces for configuration objects
- Consider implementing retry logic for external services
- Use proper logging for debugging and monitoring