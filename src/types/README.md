# Types Directory

This directory contains TypeScript type definitions organized by their scope and usage.

## Structure

### `_api/` - API Types
Type definitions for API requests, responses, and external service integrations:
- **order.ts** - Order-related API types and interfaces

### `_ui/` - UI Types
Type definitions for UI components, props, and user interface elements:
- **menu.ts** - Menu and navigation type definitions

### `_data/` - Data Types
Type definitions for data models, entities, and business objects:
- **blog.ts** - Blog post and content types
- **feature.ts** - Feature and service type definitions
- **product.ts** - Product and e-commerce types
- **project.ts** - Project and portfolio types
- **testimonial.ts** - Testimonial and review types

## Usage Guidelines

1. **API types** should define request/response structures and external service contracts
2. **UI types** should define component props, state, and interface elements
3. **Data types** should define business entities, models, and data structures
4. Use descriptive and consistent naming conventions
5. Export types as both interfaces and types as appropriate
6. Use generic types for reusable patterns
7. Document complex types with JSDoc comments

## Import Examples

```typescript
// API types
import type { Order, OrderItem } from '@/types/_api/order'

// UI types
import type { MenuItem, NavigationProps } from '@/types/_ui/menu'

// Data types
import type { BlogPost, BlogCategory } from '@/types/_data/blog'
import type { Product, ProductVariant } from '@/types/_data/product'
import type { Project, ProjectStatus } from '@/types/_data/project'
```

## Type Patterns

- Use interfaces for object shapes
- Use type aliases for unions and computed types
- Use generic types for reusable patterns
- Use utility types (Partial, Required, Pick, Omit) when appropriate
- Define strict types for API responses
- Use branded types for IDs and special values
- Consider using const assertions for literal types