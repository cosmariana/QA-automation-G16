describe('Login- Challenge Shady Meadows - QA Automation', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://automationintesting.online/');
  });

  it('Verificar el inicio de sesión exitoso en el panel de administración con credenciales válidas', () => {
    cy.login('admin', 'password');
  })
  it('Login de Administrador Fallido', () => {
  Cypress.on('uncaught:exception', () => false);
  cy.get('a[href="/admin"]').contains('Admin').click();
  cy.get('#username').type('marian_tester');
  cy.get('#password').type('clave1234');
  cy.get('#doLogin').click();
  cy.contains('Invalid credentials').should('be.visible');
  });
})