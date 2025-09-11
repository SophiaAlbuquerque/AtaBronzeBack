# 🔗 Bling API Integration - OAuth 2.0 Setup

## 📋 **Atualização Importante**
O Bling agora utiliza **OAuth 2.0** para autenticação, não mais API Keys simples.

## 🔐 **Configuração OAuth**

### **1. Credenciais Já Configuradas**
As credenciais OAuth já estão configuradas no `.env`:

```env
# Bling OAuth 2.0
BLING_CLIENT_ID=b5e11bc0a1698e38f25124e221901054d68adceb
BLING_CLIENT_SECRET=0c70f9cf3115f1572a9e2b9eb83364ecebdacf5f9b11fb0290e39703d12b
BLING_REDIRECT_URI=https://www.atabronze.com/
BLING_API_URL=https://api.bling.com.br/Api/v3
```

### **2. Fluxo de Autorização**

#### **Iniciar Autorização**
```bash
GET /api/bling/auth
```
Retorna URL para autorizar a aplicação.

#### **Processar Callback**
```bash
GET /api/bling/callback?code=AUTH_CODE
```
Processa o código de autorização.

#### **Verificar Status**
```bash
GET /api/bling/status
```
Verifica se está autenticado.

## 🔄 **Endpoints de Sincronização**

### **Sincronizar Produtos**
```bash
POST /api/products/sync-bling
```

### **Listar Produtos**
```bash
GET /api/products
```

## ⚡ **Sistema de Fallback**

Se não há token OAuth válido, o sistema usa dados mock:
- 2 produtos de exemplo
- Logs indicam uso de dados mock
- Permite desenvolvimento sem configuração completa

## 🛠️ **Estrutura Técnica**

### **BlingService (OAuth)**
```typescript
// Métodos OAuth
getAuthorizationUrl()     // URL de autorização
getAccessToken(code)      // Trocar código por token
refreshAccessToken()      // Renovar token
isAuthenticated()         // Verificar autenticação
```

### **Tratamento Automático**
- ✅ Renovação automática de tokens
- ✅ Fallback para dados mock
- ✅ Logs detalhados
- ✅ Retry em caso de erro

## 🚀 **Deploy Railway**

No Railway, as variáveis já estão configuradas. Para produção:

```env
BLING_REDIRECT_URI=https://atabronzeback-production.up.railway.app/api/bling/callback
```

## 🧪 **Testar Integração**

1. **Status da Auth**
   ```bash
   curl https://atabronzeback-production.up.railway.app/api/bling/status
   ```

2. **Iniciar OAuth**
   ```bash
   curl https://atabronzeback-production.up.railway.app/api/bling/auth
   ```

3. **Listar Produtos**
   ```bash
   curl https://atabronzeback-production.up.railway.app/api/products
   ```

## � **Formato dos Dados**

```typescript
interface BlingProduct {
  id: string;           // ID do produto no Bling
  name: string;         // Nome do produto
  description?: string; // Descrição
  price: number;        // Preço
  stock: number;        // Estoque atual
}
```

## ⚠️ **Solução de Problemas**

### **Token Expirado**
- Sistema renova automaticamente
- Se falhar, refazer autorização

### **Sem Produtos**
- Verificar se há produtos no Bling
- Logs mostram detalhes do erro

### **Erro de Callback**
- Verificar URL de redirecionamento
- Confirmar credenciais OAuth

## ✅ **Status Atual**
- ✅ OAuth 2.0 implementado
- ✅ Fallback para dados mock ativo
- ✅ Deploy Railway funcionando
- ✅ Endpoints de teste disponíveis
```bash
# Com autenticação JWT
curl -X POST https://atabronzeback-production.up.railway.app/api/products/sync-bling \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### **2. Response esperado:**
```json
{
  "message": "Sincronização com Bling concluída",
  "synced": 15,
  "errors": 0,
  "total": 15
}
```

## 🔧 **Configuração Railway**

### **Variáveis de Ambiente no Railway:**
1. Acesse seu projeto no Railway
2. Vá em **Variables**
3. Adicione:

```env
BLING_API_KEY=sua-api-key-real-aqui
```

## 📊 **Status da Integração**

### **✅ Implementado:**
- [x] Buscar produtos do Bling
- [x] Sincronização automática  
- [x] Fallback para dados mock
- [x] Logs detalhados
- [x] Error handling
- [x] API endpoint `/api/products/sync-bling`

### **🔄 Funcionalidades:**
- **Auto-sync**: Cria novos produtos do Bling
- **Update**: Atualiza produtos existentes
- **Mock fallback**: Funciona sem API key
- **Logs**: Monitora sincronização

## 🐛 **Troubleshooting**

### **API Key não funciona:**
```bash
# Verificar se está configurada
curl https://atabronzeback-production.up.railway.app/api/health
# Logs mostrarão: "Bling API key not configured, using mock data"
```

### **Erro de autenticação Bling:**
```json
{
  "error": "Unauthorized",
  "status": 401
}
```
**Solução**: Verificar se API key está válida no Bling

### **Produtos não sincronizam:**
```json
{
  "synced": 0,
  "errors": 5,
  "total": 5
}
```
**Solução**: Verificar logs no Railway para detalhes dos erros

## 📝 **Logs Úteis**

### **Sincronização bem-sucedida:**
```
info: Starting Bling products sync
info: Successfully fetched 15 products from Bling
info: Bling products sync completed {"total":15,"synced":15,"errors":0}
```

### **Usando mock (sem API key):**
```
warn: Bling API key not configured, using mock data
info: Falling back to mock products due to API error
```

## 🎯 **Próximos Passos**

1. **Configure BLING_API_KEY** no Railway
2. **Teste sincronização** via endpoint
3. **Configure cron job** para sync automático
4. **Monitore logs** no Railway dashboard

---

**API Key do Bling configurada = Produtos reais**  
**Sem API Key = Produtos mock (para desenvolvimento)**
