describe('Challenge Shady Meadows - QA Automation', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://automationintesting.online/');
  });

  // ========================================================
  //  BLOQUE 1: CINTIA
  // ========================================================

  it('XXXXXXXXXXXXXXXXXXXXX', () => {
    
  });


  // ========================================================
  // BLOQUE 2: EMERSON
  // ========================================================

  it('XXXXXXXXXXXXXXXXXXXXX', () => {
    
  });


  // ========================================================
  // BLOQUE 3: MARIAN (Login Admin Panel & Contacto)
  // ========================================================

  it('Caso 1: Login de Administrador Exitoso', () => {
    cy.get('a[href="/admin"]').contains('Admin').click();
    cy.get('#username').type('admin');
    cy.get('#password').type('password');
    cy.get('#doLogin').click();
    cy.contains('Logout').should('be.visible');
    
  });

  it('Caso 2: Login de Administrador Fallido', () => {
    Cypress.on('uncaught:exception', () => false);
    cy.get('a[href="/admin"]').contains('Admin').click();
    cy.get('#username').type('marian_tester');
    cy.get('#password').type('clave1234');
    cy.get('#doLogin').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('Caso 3: Se verifica creación de nuevas habitaciones', () => {
    Cypress.on('uncaught:exception', () => false);
    cy.get('a[href="/admin"]').contains('Admin').click();
    cy.get('#username').type('admin');
    cy.get('#password').type('password');
    cy.get('#doLogin').click();
    cy.get('#roomName').type('104');
    cy.get('#type').select('Family');
    cy.get('#accessible').select('true');
    cy.get('#roomPrice').type('200');
    cy.get('#wifiCheckbox').check();
    cy.get('#tvCheckbox').check();
    cy.get('#radioCheckbox').check();
    cy.get('#createRoom').click();
    cy.contains('104').should('be.visible');
    cy.contains('Front Page').click();
   cy.contains('Family').should('be.visible');

    
  });

  it('Caso 4: Formato del campo Phone en formulario de contacto', () => {
    Cypress.on('uncaught:exception', () => false);
    cy.get('a[href="/#contact"]').contains('Contact');
    cy.get('#name').type('3');
    cy.get('#email').type('a@gmail.com');
    cy.get('#phone').type('abcdefghijk');
    cy.get('#subject').type('cualquiera');
    cy.get('#description').type('Esto es una prueba del caso 4 que redacté en Excel de Reporte de BUGS');
    cy.get('button').contains('Submit').click();
    cy.contains('Phone must be a number').should('be.visible');
    
  });

}); 