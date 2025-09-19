# Sistema de Login com Cypress

Este projeto implementa um sistema de login robusto com as seguintes funcionalidades:

## Funcionalidades

### 🔐 Sistema de Autenticação
- **Login** com nome de usuário e senha
- **Credenciais de teste**: `admin` / `123456`
- **Validação** de campos obrigatórios
- **Feedback visual** para erros

### 🛡️ Sistema de Segurança
- **Bloqueio automático** após 3 tentativas incorretas
- **Tempo de bloqueio**: 15 minutos
- **Contador regressivo** durante o bloqueio
- **Persistência** do bloqueio ao recarregar a página
- **Reset** automático das tentativas após login bem-sucedido

### 🎯 Mensagens de Erro
- **Senha ausente**: "Senha incorreta"
- **Senha incorreta**: "Senha incorreta. X tentativa(s) restante(s)"
- **Conta bloqueada**: "Muitas tentativas de login. Tente novamente em 15 minutos"

### 🚀 Redirecionamento
- **Login bem-sucedido**: Redireciona para `/dashboard`
- **Dashboard**: Interface limpa com botão de logout
- **Logout**: Retorna para a página de login

## Testes Cypress

### Executar os testes
```bash
# Instalar Cypress (se não instalado)
npm install cypress --save-dev

# Abrir interface do Cypress
npx cypress open

# Executar testes em modo headless
npx cypress run
```

### Cenários testados

1. **✅ Exibição da página de login**
2. **✅ Login com credenciais válidas**
3. **✅ Erro com senha ausente**
4. **✅ Erro com senha incorreta**
5. **✅ Contagem de tentativas**
6. **✅ Bloqueio após 3 tentativas**
7. **✅ Contador de tempo durante bloqueio**
8. **✅ Persistência do bloqueio**
9. **✅ Logout e retorno ao login**
10. **✅ Reset de tentativas após login bem-sucedido**
11. **✅ Validação de campos obrigatórios**
12. **✅ Indicador de carregamento**

## Estrutura dos arquivos

```
cypress/
├── e2e/
│   └── login.cy.ts          # Testes principais do sistema
├── fixtures/
│   └── example.json         # Dados de teste
├── support/
│   ├── commands.ts          # Comandos customizados
│   └── e2e.ts              # Configurações globais
└── cypress.config.ts        # Configuração do Cypress
```

## Seletores de teste

Todos os elementos importantes possuem atributos `data-cy` para facilitar os testes:

- `data-cy="username-input"` - Campo de nome de usuário
- `data-cy="password-input"` - Campo de senha
- `data-cy="login-button"` - Botão de login
- `data-cy="logout-button"` - Botão de logout
- `data-cy="profile-button"` - Botão de perfil (dashboard)
- `data-cy="security-button"` - Botão de segurança (dashboard)

## Design System

O projeto utiliza um design system completo com:
- **Cores**: Gradientes roxo/azul profissional
- **Efeito Glass**: Backdrop blur e transparências
- **Animações**: Transições suaves
- **Responsividade**: Mobile-first
- **Acessibilidade**: Contraste adequado e labels semânticos

## Como usar

1. **Acesse** a aplicação
2. **Use as credenciais**: `admin` / `123456`
3. **Teste o bloqueio**: Erre a senha 3 vezes
4. **Aguarde** o desbloqueio automático ou espere 15 minutos

## Tecnologias

- **React** + **TypeScript**
- **Tailwind CSS** para estilização
- **Cypress** para testes E2E
- **React Router** para navegação
- **Lucide React** para ícones
- **LocalStorage** para persistência