# Frontend technology comparison

**Owner:** Zhuparbai Yerkebulan — Frontend and UX  
**Task:** SSP-39  
**Status:** Draft, based on the current repository and MVP scope.

## Evaluation criteria

Continuity with the existing code, TypeScript support, accessibility and UI conventions, ecosystem support, and setup cost for a small team.

| Option | Strengths for this project | Trade-offs | Fit |
|---|---|---|---|
| React + TypeScript + Vite (selected) | Already present in the repository; component model; TypeScript types for props and API shapes; suitable for a responsive web client | Requires explicit routing, state, form and accessibility conventions; Vite alone does not type-check TypeScript | High; avoids migration |
| Vue + TypeScript | First-party TypeScript guidance, Vite scaffolding and approachable component format | Existing frontend would need replacement; team conventions still need to be defined | Medium |
| Angular + TypeScript | Integrated routing, forms and application conventions | Larger framework surface and migration/setup cost for this MVP | Medium-low |

## Recommendation

Keep React, TypeScript and Vite because they are already in the repository and avoid rework. This is a project-continuity decision, not a claim that React is universally superior. The frontend should use keyboard-accessible forms and must not treat client-side role checks as security enforcement.

## Official references

- React: https://react.dev/reference/react
- React with TypeScript: https://react.dev/learn/typescript
- Vite: https://vite.dev/guide/
- Vue with TypeScript: https://vuejs.org/guide/typescript/overview
- Angular: https://angular.dev/docs
