# 🚄 Railway Deployment Guide - AtaBronze API

## 🔗 **Deploy em 5 minutos no Railway**

### **Passo 1: Preparar o repositório**
```bash
# Commit todas as mudanças
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### **Passo 2: Deploy no Railway**

1. **Acesse**: https://railway.app
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione** este repositório (`AtaBronzeBack`)

### **Passo 3: Adicionar PostgreSQL**

1. **No dashboard do projeto** → **Add Service**
2. **Database** → **PostgreSQL**
3. **Railway conecta automaticamente** via `DATABASE_URL`

### **Passo 4: Configurar Variáveis de Ambiente**

No painel do Railway, adicione estas variáveis:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
BLING_API_KEY=your-bling-api-key
ASAAS_API_KEY=your-asaas-api-key
ASAAS_SANDBOX=true
```

> ⚠️ **Importante**: `DATABASE_URL` é configurada automaticamente pelo Railway

### **Passo 5: Deploy automático**

Railway detecta automaticamente:
- ✅ `package.json` (Node.js)
- ✅ `prisma/schema.prisma` (roda migrações automaticamente)
- ✅ Build com `npm run build`
- ✅ Start com `npm start`

## 🎯 **Comandos Railway CLI (opcional)**

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Link projeto
railway link

# Deploy manual
railway up

# Ver logs
railway logs

# Abrir no browser
railway open
```

## 🔧 **Scripts automáticos no Railway**

O Railway roda automaticamente:

1. **Build**: `npm run build`
2. **Migrations**: `npx prisma migrate deploy`
3. **Generate**: `npx prisma generate`
4. **Start**: `npm start`

## 🌐 **URLs após deploy**

- **API**: `https://seu-projeto.railway.app`
- **Health**: `https://seu-projeto.railway.app/api/health`
- **Docs**: `https://seu-projeto.railway.app/api/docs` (se configurado)

## 🔒 **Checklist de Produção**

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET forte e único
- [ ] APIs externas configuradas
- [ ] Database migrada
- [ ] Health check funcionando
- [ ] Logs configurados

## 🚨 **Troubleshooting**

### **Build falha**
```bash
# Verificar logs no Railway dashboard
# Geralmente é dependência ou TypeScript
```

### **Database connection falha**
```bash
# Verificar se PostgreSQL service está ativo
# DATABASE_URL deve estar disponível automaticamente
```

### **Migrations falham**
```bash
# No Railway CLI:
railway shell
npx prisma migrate reset --force
npx prisma migrate deploy
```

## 💰 **Custos Railway**

- **Starter Plan**: $5/mês
- **PostgreSQL**: Incluído no plano
- **Redis**: $5/mês adicional (opcional)
- **Bandwidth**: 100GB incluído

## 🔄 **CI/CD Automático**

Railway configura CI/CD automaticamente:
- ✅ Push para `main` → Deploy automático
- ✅ Pull requests → Deploy de preview
- ✅ Rollback com 1 clique
- ✅ Logs em tempo real

## 🎉 **Próximos passos após deploy**

1. **Testar todos os endpoints**
2. **Configurar domínio customizado** (opcional)
3. **Configurar Redis** (para cache/sessions)
4. **Monitoramento** (Railway Metrics incluído)
5. **Backup database** (automático no Railway)

---

### **Link rápido para deploy**: 
👉 **[Deploy no Railway](https://railway.app/new/template/NvCE3W)**

Tempo estimado de deploy: **3-5 minutos** ⚡
