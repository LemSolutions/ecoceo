# Utils Directory

This directory contains utility functions and helpers organized by their purpose and scope.

## Structure

### `_env/` - Environment Utilities
Utilities for environment variable management, configuration, and environment-specific logic:
- **envCheck.ts** - Environment variable validation and checking utilities

### `_validation/` - Validation Utilities
Utilities for data validation, form validation, and input sanitization:
- Currently empty - ready for validation utilities

## Usage Guidelines

1. **Environment utilities** should handle environment variable validation, configuration loading, and environment-specific logic
2. **Validation utilities** should contain data validation, form validation, and input sanitization functions
3. Use TypeScript for all utility functions
4. Implement proper error handling and validation
5. Use consistent naming conventions
6. Export utilities as both default and named exports as appropriate
7. Make utilities pure functions when possible
8. Document function parameters and return values

## Import Examples

```typescript
// Environment utilities
import { checkEnvVars } from '@/utils/_env/envCheck'
import { getEnvConfig } from '@/utils/_env/envCheck'

// Validation utilities (when added)
import { validateEmail, validatePassword } from '@/utils/_validation/validators'
import { sanitizeInput } from '@/utils/_validation/sanitizers'
```

## Utility Patterns

- Use pure functions when possible (no side effects)
- Implement proper input validation
- Use TypeScript for type safety
- Provide clear error messages
- Use consistent return value patterns
- Consider implementing utility function testing
- Use JSDoc for function documentation
- Group related utilities in the same file