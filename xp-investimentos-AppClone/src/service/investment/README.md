# Investment Service - Exemplos de Uso

Este serviço conecta o frontend React Native com a API de investimentos do backend.

## Importação

```typescript
import { InvestmentService } from '../service/investment/investment-service';
```

## Exemplos de Uso

### 1. Listar Investimentos do Usuário

```typescript
const investmentService = new InvestmentService();

try {
  const investments = await investmentService.getInvestments();
  console.log('Investimentos:', investments);
} catch (error) {
  console.error('Erro:', error.message);
}
```

### 2. Buscar Investimento Específico

```typescript
const investmentService = new InvestmentService();

try {
  const investment = await investmentService.getInvestmentById(1);
  console.log('Investimento:', investment);
} catch (error) {
  console.error('Erro:', error.message);
}
```

### 3. Criar Novo Investimento (Comprar)

```typescript
const investmentService = new InvestmentService();

try {
  const newInvestment = await investmentService.createInvestment({
    logo: "https://example.com/logo.png",
    title: "Apple Inc.",
    description: "AAPL | Nasdaq",
    price: 190.45,
    growth: 1.82,
    growthValue: 3.42,
    acoes: 10,
    precoMedio: 180.0
  });

  console.log('Investimento criado:', newInvestment);
  Toast.success('Investimento criado com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao criar investimento');
}
```

### 4. Atualizar Investimento (Comprar Mais Ações)

```typescript
const investmentService = new InvestmentService();

try {
  const updated = await investmentService.updateInvestment(1, {
    acoes: 15, // Comprar mais 5 ações
    price: 195.0 // Preço atual
  });

  console.log('Investimento atualizado:', updated);
  Toast.success('Ações compradas com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao atualizar investimento');
}
```

### 5. Deletar Investimento (Vender Todas as Ações)

```typescript
const investmentService = new InvestmentService();

try {
  await investmentService.deleteInvestment(1);
  console.log('Investimento deletado');
  Toast.success('Investimento vendido com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao vender investimento');
}
```

## Exemplo Completo em um Componente

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { InvestmentService, InvestmentResponse } from '../service/investment/investment-service';
import { Toast } from 'toastify-react-native';

const InvestmentsList = () => {
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const investmentService = new InvestmentService();

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentService.getInvestments();
      setInvestments(data);
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const handleBuy = async () => {
    try {
      await investmentService.createInvestment({
        title: "Tesla Inc.",
        description: "TSLA | Nasdaq",
        price: 250.0,
        acoes: 5,
        precoMedio: 240.0
      });

      Toast.success('Investimento criado!');
      loadInvestments(); // Recarregar lista
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <Button title="Comprar Novo Investimento" onPress={handleBuy} />
      <FlatList
        data={investments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>Ações: {item.acoes}</Text>
            <Text>Valor Total: R$ {item.valorTotal.toFixed(2)}</Text>
            <Text>Resultado: {item.resultadoPercentual.toFixed(2)}%</Text>
          </View>
        )}
      />
    </View>
  );
};

export default InvestmentsList;
```

## Integração com Estado Local

Você pode integrar com o cache local existente:

```typescript
import { InvestmentService } from '../service/investment/investment-service';
import { cacheInvestments, getCachedInvestments } from '../service/cacheService';

const syncInvestments = async () => {
  const investmentService = new InvestmentService();

  try {
    // Buscar do backend
    const backendInvestments = await investmentService.getInvestments();

    // Salvar no cache local
    await cacheInvestments(backendInvestments);

    console.log('Investimentos sincronizados!');
  } catch (error) {
    console.error('Erro ao sincronizar:', error);

    // Em caso de erro, usar cache local
    const cachedInvestments = await getCachedInvestments();
    return cachedInvestments;
  }
};
```

## Notas Importantes

1. **Autenticação**: Todas as requisições requerem um token JWT válido. Certifique-se de fazer login antes de usar o serviço de investimentos.

2. **Tratamento de Erros**: Sempre use try/catch para tratar erros adequadamente.

3. **Cache**: Considere implementar cache local para melhorar a experiência offline.

4. **Sincronização**: Implemente lógica de sincronização entre cache local e backend quando necessário.
