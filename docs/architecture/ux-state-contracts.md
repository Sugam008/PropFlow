# PropFlow UX State Contracts

This document defines the strategy and standards for managing application state across the PropFlow frontend ecosystem (Dashboard and Mobile).

## 1. State Classification

| Category | Description | Recommended Tool |
| :--- | :--- | :--- |
| **Server State** | Data from the API (properties, valuations, users). Requires caching, revalidation, and synchronization. | **TanStack Query (React Query)** |
| **Global UI State** | State shared across multiple unrelated components (auth status, theme preference, global notifications). | **Zustand** |
| **Local UI State** | State confined to a single component or a small tree (dropdown open/closed, tabs). | **React `useState` / `useReducer`** |
| **Form State** | Temporary input values, validation errors, and submission status. | **React Hook Form** + **Zod** |
| **URL State** | State that should be shareable or survive refreshes (filters, search queries, pagination). | **Next.js Router / SearchParams** |

## 2. Server State Standards (TanStack Query)

- **Query Keys**: Use a centralized factory for query keys to ensure consistency and prevent accidental cache collisions.
- **Stale Time**: Default to `5 minutes` for most data, `0` for highly dynamic data.
- **Mutations**: Always implement optimistic updates or invalidation on success to keep the UI snappy.
- **Error Handling**: Use global error boundaries or `onError` callbacks for standardized toast notifications.

## 3. Global UI State Standards (Zustand)

- **Atomic Stores**: Prefer small, focused stores (e.g., `useAuthStore`, `useConfigStore`) over one giant store.
- **Actions**: Define actions within the store to keep state transitions predictable.
- **Persistence**: Use Zustand's `persist` middleware for state that needs to survive refreshes (e.g., user preferences).

## 4. Form State Standards

- **Validation**: All forms must use Zod schemas for validation, synchronized with backend Pydantic models where possible.
- **Performance**: Use uncontrolled components (via `register`) to prevent unnecessary re-renders on every keystroke.
- **UX**: Show validation errors only after the field has been touched or the form submitted.

## 5. State Persistence Strategy

- **Auth Tokens**: Securely stored in `HttpOnly` cookies (for Web) or `SecureStore` (for Mobile).
- **User Preferences**: LocalStorage (Web) / AsyncStorage (Mobile).
- **Draft Data**: Use `persist` middleware or LocalStorage for long-lived form drafts.

## 6. Communication Patterns

- **Cross-Component**: Use Global Stores or Context only when props-drilling becomes deep (>3 levels).
- **Parent-Child**: Strict props-down, events-up pattern.
- **API Communication**: All API calls must go through TanStack Query hooks; never call fetch/axios directly inside components.

## 7. Verification Checklist

- [ ] Is server data cached and revalidated correctly?
- [ ] Are form validations consistent with backend schemas?
- [ ] Does the URL reflect the current view state (filters/search)?
- [ ] Is global state kept to a minimum?
- [ ] Are there clear boundaries between local and global state?
