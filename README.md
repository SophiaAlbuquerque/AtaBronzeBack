# Atabrinze API

Backend API para o sistema Atabrinze com integração a Bling, Correios e Asaas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset do JavaScript
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Winston** - Sistema de logs
- **Jest** - Framework de testes
- **ESLint & Prettier** - Qualidade de código

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd atabrinze-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/atabrinze_db?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # APIs Externas (configurar conforme necessário)
   BLING_API_KEY=your-bling-api-key
   ASAAS_API_KEY=your-asaas-api-key
   ASAAS_SANDBOX=true
   ```

4. **Configure o banco de dados**
   ```bash
   # Gerar o cliente Prisma
   npm run db:generate
   
   # Executar migrações
   npm run db:migrate
   ```

## 🏃‍♂️ Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

### Banco de Dados
```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Reset do banco (CUIDADO!)
npm run db:reset

# Abrir Prisma Studio
npm run db:studio
```

### Qualidade de Código
```bash
# Verificar ESLint
npm run lint

# Corrigir problemas do ESLint
npm run lint:fix

# Formatar código com Prettier
npm run format
```

## 📚 Documentação da API

A API estará disponível em `http://localhost:3000` após iniciar o servidor.

### Endpoints Principais

#### Autenticação
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil do usuário (requer autenticação)

#### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Obter produto por ID
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/:id` - Obter pedido por ID
- `PATCH /api/orders/:id/confirm` - Confirmar pedido
- `PATCH /api/orders/:id/cancel` - Cancelar pedido

#### Pagamentos (Asaas)
- `POST /api/payments/create` - Criar cobrança
- `GET /api/payments/:id` - Consultar cobrança
- `DELETE /api/payments/:id` - Cancelar cobrança

#### Frete (Correios)
- `POST /api/shipping/calculate` - Calcular frete
- `GET /api/shipping/track/:code` - Rastrear encomenda
- `GET /api/shipping/cep/:cep` - Consultar CEP

### Health Check
- `GET /api/health` - Status da API

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── config/          # Configurações (DB, logger, etc.)
├── controllers/     # Controladores das rotas
├── services/        # Lógica de negócio
├── repositories/    # Acesso a dados
├── middlewares/     # Middlewares personalizados
├── routes/          # Definição de rotas
├── types/           # Tipos TypeScript
├── utils/           # Utilitários
└── __tests__/       # Testes
```

## 🔌 Integrações Externas

### Bling API
- Sincronização de produtos
- Gestão de estoque

### Asaas API
- Criação de cobranças
- Consulta de status de pagamentos
- Suporte a PIX, boleto, cartão

### Correios API
- Cálculo de frete
- Rastreamento de encomendas
- Validação de CEP

## 🧪 Testes

O projeto utiliza Jest para testes. Os testes estão organizados em:

- **Testes unitários**: Para funções utilitárias
- **Testes de integração**: Para endpoints da API
- **Mocks**: Para serviços externos

## 📦 Deploy

### Usando Docker (Recomendado)

1. **Criar Dockerfile**
2. **Build da imagem**
3. **Deploy com docker-compose**

### Deploy Manual

1. **Build do projeto**
   ```bash
   npm run build
   ```

2. **Configurar variáveis de produção**
3. **Executar migrações**
4. **Iniciar aplicação**
   ```bash
   npm start
   ```

## 🔒 Segurança

- JWT para autenticação
- Helmet para headers de segurança
- CORS configurado
- Validação de entrada com Joi
- Rate limiting (implementar conforme necessário)

## 📝 Logs

Os logs são gerenciados pelo Winston e salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para suporte@atabrinze.com ou abra uma issue no repositório.

## 🗃️ Banco de Dados

### Modelos Principais

#### Users
- `id` (string, PK)
- `name` (string)
- `email` (string, unique)
- `password_hash` (string)
- `created_at` (datetime)
- `updated_at` (datetime)

#### Products
- `id` (string, PK)
- `name` (string)
- `description` (text, nullable)
- `price` (decimal)
- `stock` (integer)
- `bling_id` (string, unique, nullable)
- `created_at` (datetime)
- `updated_at` (datetime)

#### Orders
- `id` (string, PK)
- `user_id` (string, FK)
- `status` (enum)
- `total` (decimal)
- `created_at` (datetime)
- `updated_at` (datetime)

#### Payments
- `id` (string, PK)
- `order_id` (string, FK)
- `status` (enum)
- `method` (enum)
- `external_id` (string, nullable)
- `amount` (decimal)
- `created_at` (datetime)
- `updated_at` (datetime)

## 🔄 Status do Projeto

- ✅ Estrutura básica
- ✅ Autenticação JWT
- ✅ CRUD de usuários
- ✅ CRUD de produtos
- ✅ Gestão de pedidos
- ✅ Integração Asaas (mock)
- ✅ Integração Correios (mock)
- ✅ Integração Bling (mock)
- 🔄 Testes completos
- 🔄 Documentação Swagger
- 🔄 Docker
- 🔄 CI/CD
