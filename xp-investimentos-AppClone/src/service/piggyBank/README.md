# PiggyBank Service - Exemplos de Uso

Este serviço conecta o frontend React Native com a API de cofrinhos (piggy banks) do backend.

## Importação

```typescript
import { PiggyBankService } from '../service/piggyBank/piggyBank-service';
```

## Exemplos de Uso

### 1. Listar Cofrinhos do Usuário

```typescript
const piggyBankService = new PiggyBankService();

try {
  const piggyBanks = await piggyBankService.getPiggyBanks();
  console.log('Cofrinhos:', piggyBanks);
} catch (error) {
  console.error('Erro:', error.message);
}
```

### 2. Buscar Cofrinho Específico

```typescript
const piggyBankService = new PiggyBankService();

try {
  const piggyBank = await piggyBankService.getPiggyBankById(1);
  console.log('Cofrinho:', piggyBank);
} catch (error) {
  console.error('Erro:', error.message);
}
```

### 3. Criar Novo Cofrinho

```typescript
const piggyBankService = new PiggyBankService();

try {
  const newPiggyBank = await piggyBankService.createPiggyBank({
    nome: "Viagem para Europa",
    meta: 15000,
    imagem: "https://example.com/europa.jpg",
    tipo: "100"
  });

  console.log('Cofrinho criado:', newPiggyBank);
  Toast.success('Cofrinho criado com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao criar cofrinho');
}
```

### 4. Adicionar Dinheiro ao Cofrinho

```typescript
const piggyBankService = new PiggyBankService();

try {
  const updated = await piggyBankService.addMoney(1, 500.00);
  console.log('Cofrinho atualizado:', updated);
  Toast.success('Dinheiro adicionado com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao adicionar dinheiro');
}
```

### 5. Retirar Dinheiro do Cofrinho

```typescript
const piggyBankService = new PiggyBankService();

try {
  const updated = await piggyBankService.withdrawMoney(1, 100.00);
  console.log('Cofrinho atualizado:', updated);
  Toast.success('Dinheiro retirado com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao retirar dinheiro');
}
```

### 6. Deletar Cofrinho

```typescript
const piggyBankService = new PiggyBankService();

try {
  await piggyBankService.deletePiggyBank(1);
  console.log('Cofrinho deletado');
  Toast.success('Cofrinho deletado com sucesso!');
} catch (error) {
  console.error('Erro:', error.message);
  Toast.error('Erro ao deletar cofrinho');
}
```

## Exemplo Completo em um Componente

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';
import { PiggyBankService, PiggyBankResponse } from '../service/piggyBank/piggyBank-service';
import { Toast } from 'toastify-react-native';

const PiggyBanksList = () => {
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const piggyBankService = new PiggyBankService();

  const loadPiggyBanks = async () => {
    try {
      setLoading(true);
      const data = await piggyBankService.getPiggyBanks();
      setPiggyBanks(data);
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPiggyBanks();
  }, []);

  const handleAddMoney = async (id: number, valor: number) => {
    try {
      await piggyBankService.addMoney(id, valor);
      Toast.success('Dinheiro adicionado!');
      loadPiggyBanks(); // Recarregar lista
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  const handleWithdrawMoney = async (id: number, valor: number) => {
    try {
      await piggyBankService.withdrawMoney(id, valor);
      Toast.success('Dinheiro retirado!');
      loadPiggyBanks(); // Recarregar lista
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  const handleCreatePiggyBank = async () => {
    try {
      await piggyBankService.createPiggyBank({
        nome: "Nova Meta",
        meta: 5000,
        imagem: "https://example.com/image.jpg",
        tipo: "100"
      });

      Toast.success('Cofrinho criado!');
      loadPiggyBanks(); // Recarregar lista
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <Button title="Criar Novo Cofrinho" onPress={handleCreatePiggyBank} />

      <FlatList
        data={piggyBanks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>Meta: R$ {item.meta.toFixed(2)}</Text>
            <Text>Valor Atual: R$ {item.valor.toFixed(2)}</Text>
            <Text>Progresso: {(item.progresso * 100).toFixed(1)}%</Text>
            <Text style={{ fontStyle: 'italic' }}>{item.descricaoMeta}</Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Button
                title="Adicionar R$ 100"
                onPress={() => handleAddMoney(item.id, 100)}
              />
              <Button
                title="Retirar R$ 50"
                onPress={() => handleWithdrawMoney(item.id, 50)}
                color="red"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PiggyBanksList;
```

## Integração com Validações

### Validação de Criação

```typescript
const handleCreate = async () => {
  // Validações
  if (!nome.trim()) {
    Toast.error('Nome do cofrinho é obrigatório');
    return;
  }

  if (!meta || meta <= 0) {
    Toast.error('Meta deve ser maior que zero');
    return;
  }

  if (!imagem) {
    Toast.error('Selecione uma imagem para o cofrinho');
    return;
  }

  try {
    setLoading(true);
    await piggyBankService.createPiggyBank({
      nome,
      meta,
      imagem,
      tipo
    });
    Toast.success('Cofrinho criado com sucesso!');
    navigation.goBack();
  } catch (error: any) {
    Toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Validação de Adição/Retirada

```typescript
const handleTransaction = async (type: 'adicionar' | 'retirar') => {
  const valor = parseFloat(amount);

  if (isNaN(valor) || valor <= 0) {
    Toast.error('Digite um valor válido');
    return;
  }

  if (type === 'retirar' && valor > piggyBank.valor) {
    Toast.error('Saldo insuficiente no cofrinho');
    return;
  }

  try {
    setLoading(true);
    if (type === 'adicionar') {
      await piggyBankService.addMoney(piggyBankId, valor);
      Toast.success(`R$ ${valor.toFixed(2)} adicionado!`);
    } else {
      await piggyBankService.withdrawMoney(piggyBankId, valor);
      Toast.success(`R$ ${valor.toFixed(2)} retirado!`);
    }
    loadPiggyBankDetails(); // Recarregar detalhes
    setAmount(''); // Limpar input
  } catch (error: any) {
    Toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

## Notas Importantes

1. **Autenticação**: Todas as requisições requerem um token JWT válido. Certifique-se de fazer login antes de usar o serviço de cofrinhos.

2. **Tratamento de Erros**: Sempre use try/catch para tratar erros adequadamente e fornecer feedback ao usuário.

3. **Validações**: O backend valida os dados, mas é boa prática fazer validações também no frontend para melhor UX.

4. **Feedback Visual**: Use Toast, Alert ou mensagens visuais para informar o usuário sobre sucessos e erros.

5. **Atualização de Estado**: Após criar, atualizar ou deletar um cofrinho, recarregue a lista para mostrar os dados atualizados.

## Tipos de Cofrinhos

- `"100"`: Rendimento 100% (sem trava)
- `"101_6"`: Rendimento 101% (trava de 6 meses)
- `"102_12"`: Rendimento 102% (trava de 12 meses)
