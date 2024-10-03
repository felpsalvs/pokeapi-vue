# Pokémon Vue App

Uma aplicação web moderna que permite explorar e gerenciar uma lista de Pokémons, construída com Vue 3, TypeScript e Pinia. A aplicação consome a PokeAPI para fornecer informações detalhadas sobre cada Pokémon.

## Funcionalidades

- 📋 Listagem paginada de Pokémons
- 🔍 Busca de Pokémons por nome
- 🏷️ Filtro por tipos de Pokémon
- ❤️ Sistema de favoritos com persistência local
- 📊 Visualização detalhada de estatísticas
- 🔄 Cadeia de evolução
- 📱 Interface totalmente responsiva
- 🎨 Temas de cores baseados nos tipos dos Pokémons


## Instalação


1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:5173` no seu navegador

## Estrutura do Projeto

```
src/
├── assets/               # Arquivos estáticos
├── components/          
│   ├── pokemon/         # Componentes específicos de Pokémon
│   └── ui/              # Componentes de UI reutilizáveis
├── composables/         # Composables Vue
├── services/            # Serviços de API
├── stores/              # Stores Pinia
├── types/               # Definições de tipos TypeScript
├── utils/               # Utilidades e helpers
└── views/               # Componentes de página
```

## Principais Componentes

### PokemonCard
- Exibe informações básicas de um Pokémon
- Permite adicionar/remover dos favoritos
- Mostra tipos com cores correspondentes

### PokemonDetails
- Modal com informações detalhadas
- Exibe estatísticas com barras de progresso
- Mostra cadeia de evolução
- Apresenta tipos e habilidades

### PokemonList
- Lista paginada de Pokémons
- Implementa busca e filtros
- Gerencia a exibição dos cards

## Gerenciamento de Estado

A aplicação utiliza Pinia para gerenciamento de estado, com as seguintes features:

- Lista de Pokémons com cache local
- Sistema de favoritos persistente
- Filtros e busca
- Paginação
- Estado de loading e tratamento de erros

## Serviços

### ApiService
- Singleton para gerenciamento de requisições
- Interceptors para tratamento de erros
- Timeout configurado

### PokemonService
- Métodos para busca de Pokémons
- Transformação de dados
- Cache de requisições
- Tratamento de erros específicos

## Estilização

- Utiliza Tailwind CSS para estilização
- Sistema de cores baseado nos tipos dos Pokémons
- Design responsivo
- Animações e transições

## Funcionalidades Implementadas

### 1. Listagem de Pokémons
- Exibição de Pokémons em cards com informações básicas
- Paginação dos resultados
- Loading state durante o carregamento dos dados

### 2. Sistema de Busca e Filtros
- Busca por nome de Pokémon
- Filtro por tipos de Pokémon
- Atualização em tempo real dos resultados

### 3. Detalhes do Pokémon
- Modal com informações detalhadas
- Exibição de estatísticas base
- Visualização da cadeia de evolução
- Tipos com cores correspondentes

### 4. Sistema de Favoritos
- Adicionar/remover Pokémons dos favoritos
- Persistência local dos favoritos
- Página dedicada para visualização dos favoritos

## Decisões Técnicas

### Otimizações
- Implementação de cache local para dados dos Pokémons
- Lazy loading de componentes pesados
- Paginação otimizada para grande volume de dados

### Tratamento de Dados
- Serviço dedicado para chamadas à PokeAPI
- Transformação de dados para formato adequado à aplicação
- Tratamento robusto de erros

### Interface
- Tailwind CSS para estilização consistente
- Design responsivo para diferentes tamanhos de tela
- Feedback visual para ações do usuário
- Sistema de cores baseado nos tipos dos Pokémons

### Funcionalidades Adicionais
Sistema de cache:
   - Armazenamento local dos dados para reduzir chamadas à API
   - Persistência de favoritos

Melhorias de UX:
   - Animações suaves nas transições
   - Loading states informativos
   - Tratamento de erros amigável

Filtros avançados:
   - Combinação de múltiplos tipos
   - Busca em tempo real
   - Reset de filtros

## Notas de Implementação

- O cache local é utilizado para melhorar a performance
- As imagens são carregadas sob demanda
- Implementação de lazy loading para componentes pesados
- Tratamento de erros robusto em todas as operações de API
