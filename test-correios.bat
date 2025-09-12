@echo off
REM Script de teste para integração dos Correios (Windows)

echo 🚀 Testando integração real dos Correios...

set API_BASE=http://localhost:3001/api

echo.
echo 📦 1. Testando cálculo de frete (integração real)...
curl -X POST "%API_BASE%/shipping/calculate" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"originCep\":\"01310-100\",\"destinationCep\":\"20040-020\",\"weight\":1000,\"length\":20,\"width\":15,\"height\":10,\"value\":100}"

echo.
echo 📍 2. Testando consulta de CEP (integração real)...
curl -X GET "%API_BASE%/shipping/cep/01310-100" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo.
echo ✅ 3. Testando validação de CEP (integração real)...
curl -X GET "%API_BASE%/shipping/validate-cep/01310-100" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo.
echo 📦 4. Testando rastreamento (integração real)...
curl -X GET "%API_BASE%/shipping/track/PX123456789BR" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo.
echo 🎉 Testes concluídos!
echo.
echo ⚠️  IMPORTANTE:
echo    - Os Correios podem ter instabilidade ocasional
echo    - Em caso de falha, a API retorna dados mock automaticamente
echo    - Para testes reais, você precisa de um token de autenticação válido
