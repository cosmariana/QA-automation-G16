describe('Challenge Shady Meadows - QA Automation', () => {

let userData;

// Carga los datos del fixture una sola vez antes de ejecutar los tests
before(() => {
  cy.fixture('userData').then((data) => {
    userData = data;
  });
});

// Configuración común para todos los casos de prueba
beforeEach(() => {
  // Ignora excepciones de React presentes en la aplicación
  Cypress.on('uncaught:exception', () => false);

  // Navega a la página principal antes de cada test
  cy.visit('https://automationintesting.online/');
});

it('TestCase 10-Verificar el flujo completo de una reserva exitosa para un usuario invitado', () => {

  // Accede directamente a una habitación con fechas válidas
  cy.visit('https://automationintesting.online/reservation/1?checkin=2026-07-10&checkout=2026-07-12');

  // Abre el formulario de reserva
  cy.get('#doReservation').click();

  // Completa los datos del huésped utilizando el fixture
  cy.get('input[placeholder="Firstname"]').type(userData.guestUser.firstName);
  cy.get('input[placeholder="Lastname"]').type(userData.guestUser.lastName);
  cy.get('input[placeholder="Email"]').type(userData.guestUser.email);
  cy.get('input[placeholder="Phone"]').type(userData.guestUser.phone);

  // Envía la solicitud de reserva
  cy.contains('Reserve Now').click();

});

it('TestCase 11-Verificar las validaciones del formulario de reserva al enviarlo vacío', () => {

  // Ingresa al proceso de reserva desde la página principal
  cy.contains('Book now').first().click();

  // Abre el formulario de reserva
  cy.get('#doReservation').should('be.visible').click();

  // Intenta reservar sin completar ningún dato obligatorio
  cy.get('form button.btn-primary')
    .contains('Reserve', { matchCase: false })
    .click();

  // Verifica los mensajes de validación esperados
  cy.contains('Firstname should not be blank').should('be.visible');
  cy.contains('Lastname should not be blank').should('be.visible');

  // Confirma que la reserva no fue creada
  cy.contains('Booking Successful', { matchCase: false })
    .should('not.exist');

});

it('TestCase 12-Enviar un mensaje de contacto utilizando datos completamente válidos', () => {

  // Completa el formulario de contacto con datos válidos
  cy.get('#name').type(userData.contactUser.name);
  cy.get('#email').type(userData.contactUser.email);
  cy.get('#phone').type(userData.contactUser.phone);
  cy.get('#subject').type(userData.contactUser.subject);
  cy.get('#description').type(userData.contactUser.description);

  // Envía el formulario
  cy.contains('button', 'Submit').click();

});

it('TestCase 13-Verificar que al cancelar la reserva se limpia el formulario y se cierra la pantalla', () => {
    // Accede directamente a una habitación con fechas válidas
    cy.visit('https://automationintesting.online/reservation/1?checkin=2026-07-10&checkout=2026-07-12');

    // Abre el formulario de reserva
    cy.get('#doReservation').click();

    // Completa los datos del huésped utilizando el fixture userData
    cy.get('input[placeholder="Firstname"]').type(userData.guestUser.firstName);
    cy.get('input[placeholder="Lastname"]').type(userData.guestUser.lastName);
    cy.get('input[placeholder="Email"]').type(userData.guestUser.email);
    cy.get('input[placeholder="Phone"]').type(userData.guestUser.phone);

    // El usuario cancela la operación
    cy.contains('button', 'Cancel').click();

    //Valida que el formulario se cerró porque volvió a aparecer el botón de abrir reserva
    cy.get('#doReservation').should('be.visible').and('contain.text', 'Reserve Now');
  });
  });
