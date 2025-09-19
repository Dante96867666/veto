describe('Sistema de Login', () => {
  beforeEach(() => {
    // Limpar dados do localStorage antes de cada teste
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/');
  });

  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = '123456';
  const INVALID_PASSWORD = 'senha_errada';

  it('deve exibir a página de login corretamente', () => {
    cy.get('[data-cy="username-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('deve fazer login com credenciais válidas e redirecionar para o dashboard', () => {
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(VALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    // Verificar redirecionamento para dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
    cy.get('[data-cy="logout-button"]').should('be.visible');
  });

  it('deve mostrar erro quando senha estiver ausente', () => {
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    // Não preencher a senha
    cy.get('[data-cy="login-button"]').click();
    
    cy.contains('Senha incorreta').should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });

  it('deve mostrar erro quando senha estiver incorreta', () => {
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(INVALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    cy.contains('Senha incorreta').should('be.visible');
    cy.contains('2 tentativa(s) restante(s)').should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });

  it('deve contar tentativas de login e bloquear após 3 tentativas', () => {
    // Primeira tentativa
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(INVALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    cy.contains('2 tentativa(s) restante(s)').should('be.visible');

    // Segunda tentativa
    cy.get('[data-cy="password-input"]').clear().type(INVALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    cy.contains('1 tentativa(s) restante(s)').should('be.visible');

    // Terceira tentativa - deve bloquear
    cy.get('[data-cy="password-input"]').clear().type(INVALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    cy.contains('Muitas tentativas de login. Tente novamente em 15 minutos').should('be.visible');
    cy.contains('Conta bloqueada').should('be.visible');
    cy.get('[data-cy="username-input"]').should('be.disabled');
    cy.get('[data-cy="password-input"]').should('be.disabled');
    cy.get('[data-cy="login-button"]').should('be.disabled');
  });

  it('deve mostrar contador de tempo quando conta estiver bloqueada', () => {
    // Fazer 3 tentativas incorretas para bloquear
    for (let i = 0; i < 3; i++) {
      cy.get('[data-cy="username-input"]').clear().type(VALID_USERNAME);
      cy.get('[data-cy="password-input"]').clear().type(INVALID_PASSWORD);
      cy.get('[data-cy="login-button"]').click();
      cy.wait(1000); // Aguardar o processamento
    }
    
    // Verificar se o contador de tempo está sendo exibido
    cy.contains(/Tempo restante: \d{1,2}:\d{2}/).should('be.visible');
  });

  it('deve persistir o bloqueio após recarregar a página', () => {
    // Fazer 3 tentativas incorretas para bloquear
    for (let i = 0; i < 3; i++) {
      cy.get('[data-cy="username-input"]').clear().type(VALID_USERNAME);
      cy.get('[data-cy="password-input"]').clear().type(INVALID_PASSWORD);
      cy.get('[data-cy="login-button"]').click();
      cy.wait(1000);
    }
    
    // Recarregar a página
    cy.reload();
    
    // Verificar se ainda está bloqueado
    cy.contains('Conta bloqueada').should('be.visible');
    cy.get('[data-cy="username-input"]').should('be.disabled');
    cy.get('[data-cy="password-input"]').should('be.disabled');
    cy.get('[data-cy="login-button"]').should('be.disabled');
  });

  it('deve fazer logout do dashboard e retornar ao login', () => {
    // Fazer login primeiro
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(VALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    // Verificar se está no dashboard
    cy.url().should('include', '/dashboard');
    
    // Fazer logout
    cy.get('[data-cy="logout-button"]').click();
    
    // Verificar se voltou para o login
    cy.url().should('not.include', '/dashboard');
    cy.get('[data-cy="username-input"]').should('be.visible');
  });

  it('deve limpar tentativas após login bem-sucedido', () => {
    // Fazer 2 tentativas incorretas
    for (let i = 0; i < 2; i++) {
      cy.get('[data-cy="username-input"]').clear().type(VALID_USERNAME);
      cy.get('[data-cy="password-input"]').clear().type(INVALID_PASSWORD);
      cy.get('[data-cy="login-button"]').click();
      cy.wait(1000);
    }
    
    // Fazer login correto
    cy.get('[data-cy="username-input"]').clear().type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').clear().type(VALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    // Verificar se foi para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Fazer logout e verificar se tentativas foram resetadas
    cy.get('[data-cy="logout-button"]').click();
    
    // Tentar login incorreto novamente - deve mostrar "2 tentativas restantes"
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(INVALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    cy.contains('2 tentativa(s) restante(s)').should('be.visible');
  });

  it('deve validar campos obrigatórios', () => {
    // Tentar submeter sem preencher nada
    cy.get('[data-cy="login-button"]').click();
    
    // Verificar validação HTML5
    cy.get('[data-cy="username-input"]').should('have.attr', 'required');
    cy.get('[data-cy="password-input"]').should('have.attr', 'required');
  });

  it('deve mostrar indicador de carregamento durante o login', () => {
    cy.get('[data-cy="username-input"]').type(VALID_USERNAME);
    cy.get('[data-cy="password-input"]').type(VALID_PASSWORD);
    cy.get('[data-cy="login-button"]').click();
    
    // Verificar se o botão mostra "Entrando..." brevemente
    cy.get('[data-cy="login-button"]').should('contain', 'Entrando...');
  });
});