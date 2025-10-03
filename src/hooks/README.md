# Hooks Directory

This directory contains custom React hooks organized by their functionality and purpose.

## Structure

### `_auth/` - Authentication Hooks
Hooks related to user authentication and authorization:
- **useAuth.ts** - Main authentication hook for user state management

### `_data/` - Data Management Hooks
Hooks for data fetching, state management, and data processing:
- **useClientAnalytics.ts** - Client-side analytics data management
- **useClientDate.ts** - Date handling and formatting utilities
- **useMarketingData.ts** - Marketing data fetching and management

### `_ui/` - UI and Interaction Hooks
Hooks for UI state management, notifications, and user interactions:
- **useNotifications.ts** - Notification system management
- **useSanityStyles.ts** - Sanity CMS styling utilities
- **useSanityUIComponents.ts** - Sanity UI component utilities

## Usage Guidelines

1. **Authentication hooks** should handle user state, login/logout, and permissions
2. **Data hooks** should manage data fetching, caching, and state updates
3. **UI hooks** should handle UI state, interactions, and styling
4. Use TypeScript for all hooks
5. Follow React hooks naming conventions (use*)
6. Implement proper error handling and loading states
7. Use consistent return value patterns

## Import Examples

```typescript
// Authentication hooks
import { useAuth } from '@/hooks/_auth/useAuth'

// Data hooks
import { useClientAnalytics } from '@/hooks/_data/useClientAnalytics'
import { useMarketingData } from '@/hooks/_data/useMarketingData'

// UI hooks
import { useNotifications } from '@/hooks/_ui/useNotifications'
import { useSanityStyles } from '@/hooks/_ui/useSanityStyles'
```

## Hook Patterns

- Return objects with consistent property names
- Implement loading and error states
- Use proper dependency arrays in useEffect
- Consider memoization with useMemo and useCallback
- Provide TypeScript interfaces for return values
- Handle cleanup in useEffect when necessary