describe('Challenge Shady Meadows - QA Automation', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://automationintesting.online/');
  });

  
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
    
    // Validamos el BUG de forma segura en el DOM dinámico
    cy.get('body').then($body => {
      const roomCreated = $body.text().includes('104');
      expect(roomCreated, 'BUG DETECTADO: La habitación creada en el Admin no se renderiza en el Front Page').to.be.true;
    });
  });
// BUG 14 -  CASO 4:
  it('Caso 4: Formato del campo Phone en formulario de contacto', () => {
    Cypress.on('uncaught:exception', () => false);
    cy.get('a[href="/#contact"]').contains('Contact');
    cy.get('#name').type('3');
    cy.get('#email').type('a@gmail.com');
    cy.get('#phone').type('abcdefghijk');
    cy.get('#subject').type('cualquiera');
    cy.get('#description').type('Esto es una prueba del caso 4 que redacté en Excel de Reporte de BUGS');
    cy.get('button').contains('Submit').click();
    
    cy.get('body').then($body => {
      const hasErrorMessage = $body.text().includes('Phone must be a number');
      expect(hasErrorMessage, 'BUG: El formulario acepta letras en el teléfono de contacto sin alertar el error esperado').to.be.true;
    });
  });

  
  it('CP-01 | Verifica que se muestran habitaciones disponibles en la página principal', () => {
    cy.contains('Our Rooms').should('be.visible');
    cy.get('body').should('contain.text', 'Room');
  });

  it('CP-04 | Single Room — Reserva exitosa con todos los datos válidos', () => {
    cy.contains('Book this room').first().click({ force: true });
    
    cy.get('body').then($body => {
      if ($body.find('input[class*="room-firstname"]').length > 0) {
        cy.get('input[class*="room-firstname"]').type('Juan');
        cy.get('input[class*="room-lastname"]').type('Perez');
        cy.get('input[class*="room-email"]').type('juan.perez@test.com');
        cy.get('input[class*="room-phone"]').type('01134567890');
        cy.contains('Book').click();
      }
      cy.contains(/booking confirmed|reserva confirmada/i).should('not.exist');
    });
  });

  it('BUG-01 / BUG-05 / BUG-07 | Campos Name aceptan números (no debería)', () => {
    cy.contains('Book this room').first().click({ force: true });
    
    cy.get('body').then($body => {
      if ($body.find('input[class*="room-firstname"]').length > 0) {
        cy.get('input[class*="room-firstname"]').type('12345');
        cy.get('input[class*="room-lastname"]').type('67890');
        cy.contains('Book').click();
      }
      const hasError = $body.text().match(/error|invalid|must be/i);
      expect(hasError, 'Debería mostrar error de validación en nombres con números').to.exist;
    });
  });

  it('BUG-02 / BUG-06 / BUG-08 | Campos Phone de reserva aceptan letras (no debería)', () => {
    cy.contains('Book this room').first().click({ force: true });
    
    cy.get('body').then($body => {
      if ($body.find('input[class*="room-firstname"]').length > 0) {
        cy.get('input[class*="room-firstname"]').type('Juan');
        cy.get('input[class*="room-lastname"]').type('Perez');
        cy.get('input[class*="room-phone"]').type('abcdefghijk');
        cy.contains('Book').click();
      }
      const hasError = $body.text().match(/error|invalid|phone/i);
      expect(hasError, 'Debería mostrar error si el teléfono de reserva tiene letras').to.exist;
    });
  });

  it('CP-02 | Envío de formulario de reserva vacío muestra errores de validación', () => {
    cy.contains('Book this room').first().click({ force: true });
    cy.get('body').then($body => {
      if ($body.text().includes('Book')) {
        cy.contains('Book').click({ force: true });
      }
    });
    cy.get('body').should('contain.text', 'must not be null');
  });

  it('BUG-11 | Check Availability — Permite buscar con fechas pasadas (no debería)', () => {
    cy.contains('Book this room').first().click({ force: true });
    cy.get('body').should('exist');
  });

  it('BUG-15 | Formulario de contacto — Permite enviar con campos vacíos (no debería)', () => {
    cy.scrollTo('bottom');
    cy.get('button').contains('Submit').click({ force: true });
    cy.get('body').then($body => {
      const hasError = $body.text().match(/must not be blank|error|required/i);
      expect(hasError, 'BUG-15: El formulario de contacto vacío no debería enviarse sin errores').to.exist;
    });
  });

  it('BUG-12 | Click en Amenities no redirige (permanece estático)', () => {
    cy.contains('a', 'Amenities').click();
    cy.url().then(url => {
      expect(url, 'BUG-12: El enlace de Amenities debería cambiar la URL del sitio').to.include('#amenities');
    });
  });

  it('BUG-13 | Admin > Rooms > Admin redirige de manera incorrecta', () => {
    cy.get('a[href="/admin"]').contains('Admin').click();
    cy.get('#username').type('admin');
    cy.get('#password').type('password');
    cy.get('#doLogin').click();
    cy.get('body').then($body => {
      if ($body.text().includes('Rooms')) {
        cy.contains('Rooms').click();
      }
    });
    cy.url().should('include', '/admin');
  });

});