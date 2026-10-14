# Axé com Pimentas — Copilot Instructions

## Projeto

Angular e-commerce de artigos de Axé/Umbanda.
Projeto também serve como portfólio e aprendizado de Angular.

## Arquitetura

- Organizar por feature.
- Não criar pastas globais `components/`, `services/` ou `models/`.
- Manter arquivos relacionados próximos da feature.
- Usar standalone components.
- Não introduzir NgModule em código novo.
- Responsividade dos componentes deve ser considerada desde o início.

Estrutura:

src/app/
├── features/
│ ├── products/
│ └── cart/
└── app.routes.ts

## Cart

A feature `cart` possui:

cart.ts → componente
cart.html → template
cart.scss → estilos
cart-service.ts → estado/lógica do carrinho
cart.spec.ts → testes

O `CartService` é a fonte de verdade do estado compartilhado do carrinho.

Antes de criar algo novo, verificar se existe componente ou lógica reutilizável.

`ProductCard` e `ProductGrid` podem ser reutilizados quando houver boa coesão; não forçar reutilização quando o layout/comportamento do carrinho for diferente.

## Angular

Sempre consultar a documentação atual em:
https://angular.dev

Preferir APIs e padrões modernos do Angular.

Prioridades:

1. compatibilidade com a arquitetura existente;
2. documentação oficial atual;
3. simplicidade;
4. coesão da feature;
5. reutilização adequada;
6. testabilidade.

## Código

- TypeScript strict.
- Evitar `any`.
- Usar nomes descritivos.
- Não colocar regra de negócio complexa no template.
- Não duplicar estado sem necessidade.
- Preferir Signals quando apropriado.
- Usar Angular Material quando houver componente adequado.
- Usar SCSS.

## Templates

Preferir:

@if
@for
@switch

Evitar introduzir novas ocorrências de sintaxes legadas quando a sintaxe moderna resolver o problema.

## Testes

Usar Vitest.

Testar comportamento, não detalhes internos de implementação.

Manter testes próximos da feature:

cart.spec.ts
product-card.spec.ts

## Git

- Não fazer commit sem solicitação.
- Não fazer push sem solicitação.
- Não sobrescrever alterações existentes.
- Antes de alterações grandes, verificar o código atual.
- Após alterações relevantes, executar testes e/ou build.

## Processo

Antes de implementar:

1. Entender o código existente.
2. Procurar componentes/serviços reutilizáveis.
3. Identificar a feature responsável.
4. Consultar `angular.dev` quando houver dúvida.
5. Fazer a menor alteração coerente.
6. Testar.
7. Verificar erros de TypeScript/build.

Não fazer grandes refatorações para resolver problemas pequenos.

O objetivo é manter o projeto moderno, simples, didático, testável e fácil de explicar em uma entrevista técnica.
