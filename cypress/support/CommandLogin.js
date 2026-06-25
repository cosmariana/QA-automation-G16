Cypress.Commands.add('login',(user,pass)=>{
  cy.get('a[href="/admin"]').contains('Admin').click();
  cy.url().should('include', 'https://automationintesting.online/admin');
  cy.get('[id="username"]').type('admin');
  cy.get('[id="password"]').type('password');
  cy.get('[id="doLogin"]').click();
  cy.url().should('include', 'https://automationintesting.online/admin/rooms');
})