---
applyTo: '**/inventory/**'
---

# Estoque — Frontend

## 1. Princípios gerais

Implementar a interface de estoque do Axé com Pimentas usando Angular e TypeScript, respeitando a arquitetura, os componentes e os padrões existentes no projeto.

O frontend deve permitir cadastrar produtos, gerenciar insumos, acompanhar movimentações, criar fichas técnicas, administrar ordens de produção e simular custos e preços de venda.

O backend é a fonte oficial dos saldos, reservas, consumos, custos calculados e preços sugeridos.

Antes de implementar:

- Inspecionar a estrutura existente.
- Consultar as instruções dos agentes e a documentação oficial atual do Angular em https://angular.dev/.
- Respeitar a versão instalada do Angular.
- Reutilizar os componentes e padrões existentes.
- Não modificar features não relacionadas.
- Fazer a menor alteração necessária.

## 2. Cadastro de produtos

Permitir cadastrar e editar produtos com os campos suportados pela API:

- Nome, descrição e código interno;
- Categoria e unidade de venda;
- Tipo PRONTA_ENTREGA ou SOB_DEMANDA;
- Preço de venda;
- Status ativo/inativo.

A interface deve adaptar os campos conforme o tipo do produto.

Produtos sob demanda devem permitir configurar ou acessar sua ficha técnica. Produtos a pronta entrega devem permitir consultar seu estoque acabado.

Validar os campos obrigatórios, apresentar mensagens claras e evitar envios duplicados.

## 3. Cadastro de insumos

Permitir:

- Cadastrar e editar insumos;
- Informar unidade de medida e custo de aquisição;
- Registrar entradas de estoque;
- Consultar saldo físico, quantidade reservada e quantidade disponível;
- Consultar histórico de compras e movimentações;
- Visualizar o último custo de compra válido;
- Definir estoque mínimo, quando suportado.

O último custo de compra deve ser apresentado como custo de referência atual, sem substituir o histórico de custos utilizado em produções anteriores.

## 4. Ficha técnica

Criar uma interface para adicionar e remover ingredientes, insumos e embalagens da ficha técnica de um produto.

Cada item deve permitir informar:

- Material;
- Quantidade necessária;
- Unidade de medida;
- Perdas previstas, quando suportadas.

Apresentar:

- Quantidade necessária por unidade ou lote;
- Último custo de compra conhecido;
- Custo estimado por material;
- Custo estimado total da ficha técnica;
- Disponibilidade dos materiais;
- Capacidade estimada de produção.

A estimativa oficial deve vir do backend.

Exibir avisos quando um material não possuir custo informado, unidade incompatível ou saldo suficiente.

Alterações na ficha técnica não devem modificar silenciosamente o histórico de ordens já iniciadas ou concluídas.

## 5. Ordens de produção

Implementar uma interface para criar, consultar e acompanhar ordens de produção.

Exibir o produto, a quantidade planejada, os materiais necessários e o estado da ordem.

### Ao iniciar a produção

- Solicitar confirmação da operação.
- Apresentar os materiais necessários e a disponibilidade informada pelo backend.
- Enviar a solicitação de início ao backend.
- Exibir as reservas confirmadas somente após o retorno da API.
- Atualizar os saldos disponíveis apresentados na interface.
- Informar claramente que os materiais foram reservados, mas ainda não tiveram seu consumo definitivo registrado.

### Ao concluir a produção

- Permitir informar o consumo efetivo quando a API oferecer esse recurso.
- Exibir diferenças entre consumo previsto e real.
- Solicitar confirmação antes de concluir.
- Atualizar a interface somente após confirmação do backend.
- Mostrar as quantidades de produtos acabados geradas e os materiais efetivamente consumidos.

### Ao cancelar a produção

- Solicitar confirmação.
- Informar que materiais reservados e ainda não consumidos serão liberados conforme as regras do backend.
- Exibir o resultado confirmado pela API.
- Não apagar registros de movimentações ou histórico.

A interface deve impedir ações incompatíveis com o estado atual da ordem e tratar conflitos de concorrência ou falhas da API.

## 6. Movimentações

Disponibilizar uma tela para consultar entradas, saídas, ajustes, devoluções, perdas, reservas e consumo de produção.

Exibir, quando disponíveis:

- Item;
- Tipo de movimentação;
- Quantidade e unidade;
- Data;
- Motivo;
- Ordem ou operação de origem;
- Responsável;
- Saldo resultante.

Permitir filtros e pesquisa conforme os recursos existentes.

Não simular alterações definitivas de saldo localmente. Recarregar ou atualizar os dados após a confirmação do backend.

## 7. Calculadora de custos e precificação

Criar uma interface para simular custos e preços de venda de um produto.

Apresentar:

- Custo dos ingredientes e insumos;
- Embalagens;
- Mão de obra;
- Perdas;
- Custos indiretos;
- Despesas variáveis;
- Custo unitário estimado;
- Preço de venda atual;
- Margem desejada;
- Preço sugerido;
- Lucro estimado por unidade;
- Margem estimada;
- Markup, quando aplicável.

### Regras de cálculo

- Utilizar o último custo de compra válido como referência para os materiais.
- Buscar os cálculos oficiais no backend.
- Permitir informar a margem desejada e visualizar o preço sugerido.
- Atualizar a simulação conforme os parâmetros forem alterados, respeitando a API e os mecanismos de estado existentes.
- Não alterar automaticamente o preço oficial do produto ao simular.
- Exigir confirmação explícita para salvar um novo preço de venda.
- Não apresentar custos incompletos como valores finais.
- Diferenciar margem de lucro e markup.
- Formatar valores em reais (BRL), respeitando as regras de arredondamento da API.

Se o preço sugerido não puder ser calculado por parâmetros inválidos, como margem somada às despesas variáveis igual ou superior a 100%, exibir uma mensagem explicativa.

## 8. Integração e experiência de uso

- Respeitar os contratos reais da API.
- Tratar carregamento, sucesso, listas vazias, erros e indisponibilidade do backend.
- Desabilitar ações enquanto operações críticas estiverem sendo processadas.
- Evitar requisições duplicadas.
- Exibir mensagens de conflito quando outro processo modificar o estoque.
- Atualizar saldos, reservas e ordens após operações confirmadas.
- Manter a interface responsiva e acessível.
- Utilizar os formulários e padrões de validação já adotados no projeto.

## 9. Critérios de aceitação — Frontend

### Cadastro e estoque

- [ ] É possível cadastrar e editar produtos a pronta entrega e sob demanda.
- [ ] É possível cadastrar insumos com unidade e custo.
- [ ] A interface diferencia saldo físico, reservas e disponibilidade.
- [ ] O histórico de movimentações é consultável.

### Ficha técnica e produção

- [ ] É possível adicionar e remover materiais da ficha técnica.
- [ ] A interface apresenta quantidades e custos de referência.
- [ ] O início da produção exibe e confirma as reservas retornadas pelo backend.
- [ ] Os materiais reservados não são apresentados como definitivamente consumidos.
- [ ] A conclusão atualiza os dados após confirmação do consumo e da entrada de produtos acabados.
- [ ] O cancelamento apresenta o resultado da liberação de reservas.
- [ ] Falhas e conflitos não são apresentados como operações concluídas.

### Precificação

- [ ] A calculadora utiliza o último custo de compra válido informado pelo backend.
- [ ] É possível simular uma margem desejada.
- [ ] O preço sugerido considera custos e despesas variáveis.
- [ ] Lucro, margem e markup são identificados separadamente.
- [ ] Custos ausentes e parâmetros inválidos são sinalizados.
- [ ] A simulação não altera o preço oficial sem confirmação explícita.

### Qualidade

- [ ] Formulários, estados de carregamento e mensagens de erro são testados.
- [ ] Os fluxos de início, conclusão e cancelamento de produção são testados.
- [ ] A integração respeita os contratos reais da API.
- [ ] Os testes relevantes do projeto são executados.

## 10. Implementação

Implementar uma funcionalidade por vez, verificando os componentes e serviços existentes antes de criar novos arquivos.

Consultar a documentação oficial atual do Angular, compatível com a versão instalada, e seguir os padrões do projeto.

Não criar endpoints fictícios, não duplicar regras de negócio no frontend e não reestruturar funcionalidades fora do escopo.
