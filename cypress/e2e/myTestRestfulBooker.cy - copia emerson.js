// ============================================================
// myTestRestfulBooker.cy.js
// Challenge Final - QA Grupo 16
// App: https://automationintesting.online
// Credenciales admin: admin / password
// ============================================================

// ── Fixtures con datos de prueba ──
const VALID_GUEST = {
  firstname: 'Juan',
  lastname:  'Perez',
  email:     'juan.perez@test.com',
  phone:     '01134567890',
}

const DATES = {
  // Fechas futuras para reservas válidas
  checkin:  '2026-07-10',
  checkout: '2026-07-12',
  // Fechas pasadas para test de bug
  pastCheckin:  '2024-01-10',
  pastCheckout: '2024-01-12',
}

// ── Custom Commands ──

// Completa el formulario de reserva en las páginas /reservation-X
Cypress.Commands.add('fillBookingForm', (data = {}) => {
  const guest = { ...VALID_GUEST, ...data }
  cy.get('input[placeholder="Firstname"]').clear().type(guest.firstname)
  cy.get('input[placeholder="Lastname"]').clear().type(guest.lastname)
  cy.get('input[placeholder="Email"]').clear().type(guest.email)
  cy.get('input[placeholder="Phone"]').clear().type(guest.phone)
})

// Selecciona fechas en el calendario inline de la página de reserva
Cypress.Commands.add('selectCalendarDates', (checkin, checkout) => {
  // El calendario está en el widget de la derecha; usamos el input directo
  cy.get('.rbc-calendar, [data-testid="date-picker"], input[type="date"]').first().then($el => {
    if ($el.is('input')) {
      cy.wrap($el).type(checkin)
    }
  })
})

// Login al panel de admin
Cypress.Commands.add('adminLogin', () => {
  cy.visit('/admin')
  cy.get('#username').clear().type('admin')
  cy.get('#password').clear().type('password')
  cy.get('button[type="submit"], .btn-primary').click()
  cy.url().should('include', '/admin')
})

// ============================================================
// 3.1 — RESERVA EXITOSA COMO USUARIO INVITADO
// ============================================================
describe('3.1 — Reserva exitosa como usuario invitado', () => {

  it('CP-01 | Verifica que se muestran habitaciones disponibles en la página principal', () => {
    cy.visit('/')
    // La sección Our Rooms debe mostrar al menos 1 tarjeta
    cy.contains('Our Rooms').should('be.visible')
    cy.get('.card, [class*="room"], [class*="Room"]').should('have.length.greaterThan', 0)
    // Verificar que se ven los 3 tipos de habitación
    cy.contains('Single').should('be.visible')
    cy.contains('Double').should('be.visible')
    cy.contains('Suite').should('be.visible')
  })

  it('CP-04 | Single Room — Reserva exitosa con todos los datos válidos', () => {
    cy.visit('/reservation-1')
    cy.contains('Single Room').should('be.visible')
    // Completa el formulario con datos válidos
    cy.fillBookingForm()
    // Hace clic en Reserve Now
    cy.contains('Reserve Now').click()
    // Valida mensaje de éxito
    cy.contains(/booking confirmed|reserva confirmada|confirmation|thank you/i, { timeout: 8000 })
      .should('be.visible')
  })

  it('CP-04b | Double Room — Reserva exitosa con todos los datos válidos', () => {
    cy.visit('/reservation-2')
    cy.contains('Double Room').should('be.visible')
    cy.fillBookingForm({ email: 'maria.garcia@test.com' })
    cy.contains('Reserve Now').click()
    cy.contains(/booking confirmed|reserva confirmada|confirmation|thank you/i, { timeout: 8000 })
      .should('be.visible')
  })

})

// ============================================================
// 3.2 — VALIDACIONES DEL FORMULARIO DE RESERVA
// ============================================================
describe('3.2 — Validaciones del formulario de reserva', () => {

  // ── BUG-01: Firstname/Lastname acepta números — Single Room ──
  it('BUG-01 | Single Room — Campo Firstname acepta números (no debería)', () => {
    cy.visit('/reservation-1')
    cy.fillBookingForm({ firstname: '12345', lastname: '67890' })
    cy.contains('Reserve Now').click()
    // El sistema NO debería procesar la reserva
    // Se espera un mensaje de validación de error
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|solo letras|only letters|firstname|lastname/i)
      // Documentamos el bug: si no hay error, el test falla indicando el defecto
      expect(hasError, 'BUG-01: Debería mostrar error de validación en Firstname/Lastname con números').to.exist
    })
  })

  // ── BUG-02: Phone acepta letras — Single Room ──
  it('BUG-02 | Single Room — Campo Phone acepta letras (no debería)', () => {
    cy.visit('/reservation-1')
    cy.fillBookingForm({ phone: 'abcdefghij' })
    cy.contains('Reserve Now').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|solo números|only numbers|phone/i)
      expect(hasError, 'BUG-02: Debería mostrar error de validación en Phone con letras').to.exist
    })
  })

  // ── BUG-05: Firstname/Lastname acepta números — Double Room ──
  it('BUG-05 | Double Room — Campo Firstname/Lastname acepta números (no debería)', () => {
    cy.visit('/reservation-2')
    cy.fillBookingForm({ firstname: '99999', lastname: '00000' })
    cy.contains('Reserve Now').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|solo letras|only letters/i)
      expect(hasError, 'BUG-05: Debería mostrar error de validación en Firstname/Lastname con números').to.exist
    })
  })

  // ── BUG-06: Phone acepta letras — Double Room ──
  it('BUG-06 | Double Room — Campo Phone acepta letras (no debería)', () => {
    cy.visit('/reservation-2')
    cy.fillBookingForm({ phone: 'noesnumero' })
    cy.contains('Reserve Now').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|phone/i)
      expect(hasError, 'BUG-06: Debería mostrar error de validación en Phone con letras').to.exist
    })
  })

  // ── BUG-07: Firstname/Lastname acepta números — Suite ──
  it('BUG-07 | Suite Room — Campo Firstname/Lastname acepta números (no debería)', () => {
    cy.visit('/reservation-3')
    cy.fillBookingForm({ firstname: '11111', lastname: '22222' })
    cy.contains('Reserve Now').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|solo letras|only letters/i)
      expect(hasError, 'BUG-07: Suite Room debería rechazar números en Firstname/Lastname').to.exist
    })
  })

  // ── BUG-08: Phone acepta letras — Suite ──
  it('BUG-08 | Suite Room — Campo Phone acepta letras (no debería)', () => {
    cy.visit('/reservation-3')
    cy.fillBookingForm({ phone: 'zzzzzzzzz' })
    cy.contains('Reserve Now').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/error|invalid|phone/i)
      expect(hasError, 'BUG-08: Suite Room debería rechazar letras en Phone').to.exist
    })
  })

  // ── CP-02: Formulario sin datos — Single Room ──
  it('CP-02 | Single Room — Envío de formulario vacío muestra errores de validación', () => {
    cy.visit('/reservation-1')
    cy.contains('Reserve Now').click()
    // Se esperan mensajes de error
    cy.get('body').should('contain.text', /required|obligatorio|error|field/i)
    // Verifica que NO se generó reserva (no debe haber confirmación)
    cy.contains(/booking confirmed|confirmada|thank you/i).should('not.exist')
  })

  // ── BUG-03: Fechas pasadas — Single Room ──
  it('BUG-03 | Single Room — Sistema permite reservar con fechas pasadas (no debería)', () => {
    cy.visit('/reservation-1')
    cy.fillBookingForm()
    // Intentamos seleccionar una fecha pasada desde el calendario
    // El calendario debería bloquear fechas < hoy
    const today = new Date()
    const pastDate = new Date(today)
    pastDate.setFullYear(2024)
    cy.log(`Intentando seleccionar fecha pasada: ${pastDate.toISOString().split('T')[0]}`)
    // Si el calendario permite clickear una fecha pasada, el test documenta el bug
    cy.get('.rbc-date-cell, td[class*="past"], button[class*="past"]').first().then($el => {
      if ($el.length) {
        cy.wrap($el).click({ force: true })
        cy.contains('Reserve Now').click()
        cy.get('body').then($body => {
          const hasError = $body.text().match(/fecha|date|past|invalid|pasada/i)
          expect(hasError, 'BUG-03: El sistema debería rechazar fechas pasadas').to.exist
        })
      } else {
        cy.log('El calendario no expone celdas de fechas pasadas — test de fecha directa')
      }
    })
  })

  // ── BUG-11: Check Availability con fechas pasadas ──
  it('BUG-11 | Check Availability — Permite buscar con fechas pasadas (no debería)', () => {
    cy.visit('/')
    // El widget de disponibilidad está en la sección principal
    cy.get('input[placeholder*="Check In"], input[name*="checkin"], input[type="date"]').first()
      .clear().type('2024-01-10')
    cy.get('input[placeholder*="Check Out"], input[name*="checkout"], input[type="date"]').last()
      .clear().type('2024-01-12')
    cy.contains('Check Availability').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/fecha|date|past|invalid|pasada|error/i)
      expect(hasError, 'BUG-11: El buscador debería rechazar fechas anteriores a hoy').to.exist
    })
  })

})

// ============================================================
// 3.3 — FORMULARIO DE CONTACTO
// ============================================================
describe('3.3 — Formulario de contacto', () => {

  // ── CP-07: Envío exitoso ──
  it('CP-07 | Envío del formulario de contacto con datos válidos', () => {
    cy.visit('/')
    cy.scrollTo('bottom')
    cy.get('input[placeholder="Name"], input[name="name"]').type('Pedro Gomez')
    cy.get('input[placeholder="Email"], input[name="email"]').type('pedro@test.com')
    cy.get('input[placeholder="Phone"], input[name="phone"]').type('01155667788')
    cy.get('input[placeholder="Subject"], input[name="subject"]').type('Consulta sobre disponibilidad')
    cy.get('textarea[placeholder="Message"], textarea[name="message"]')
      .type('Quisiera saber si tienen disponibilidad para la primera semana de agosto.')
    cy.contains('Submit').click()
    // Valida mensaje de confirmación
    cy.contains(/thank you|mensaje enviado|message sent|received/i, { timeout: 8000 })
      .should('be.visible')
  })

  // ── BUG-14: Phone acepta letras en Contacto ──
  it('BUG-14 | Formulario de contacto — Campo Phone acepta letras (no debería)', () => {
    cy.visit('/')
    cy.scrollTo('bottom')
    cy.get('input[placeholder="Name"], input[name="name"]').type('Test User')
    cy.get('input[placeholder="Email"], input[name="email"]').type('test@test.com')
    cy.get('input[placeholder="Phone"], input[name="phone"]').type('noesnumero')
    cy.get('input[placeholder="Subject"], input[name="subject"]').type('Test')
    cy.get('textarea[placeholder="Message"], textarea[name="message"]').type('Test message')
    cy.contains('Submit').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/phone|error|invalid|número/i)
      expect(hasError, 'BUG-14: Debería mostrar error de validación en Phone del formulario de contacto').to.exist
    })
  })

  // ── BUG-15: Formulario vacío ──
  it('BUG-15 | Formulario de contacto — Permite enviar con campos vacíos (no debería)', () => {
    cy.visit('/')
    cy.scrollTo('bottom')
    cy.contains('Submit').click()
    cy.get('body').then($body => {
      const hasError = $body.text().match(/required|obligatorio|error|field/i)
      expect(hasError, 'BUG-15: Debería mostrar errores de validación al enviar formulario vacío').to.exist
    })
  })

})

// ============================================================
// FLUJOS ADICIONALES — PANEL DE ADMINISTRACIÓN
// ============================================================
describe('Admin — Verificación del panel de administración', () => {

  // ── BUG-12: Amenities sin redirección ──
  it('BUG-12 | Click en Amenities no redirige (permanece estático)', () => {
    cy.visit('/')
    const urlBefore = cy.url()
    cy.contains('a', 'Amenities').click()
    // Debería navegar a /amenities o similar
    cy.url().then(url => {
      expect(url, 'BUG-12: Amenities debería redirigir a una sección').to.include('/amenities')
    })
  })

  // ── BUG-13: Admin > Rooms > Admin lleva al login ──
  it('BUG-13 | Admin > Rooms > Admin redirige al login en vez del panel', () => {
    cy.adminLogin()
    cy.contains('a', 'Rooms').click()
    cy.url().should('include', '/admin/rooms')
    // Volver al panel admin desde el navbar
    cy.contains('a', 'Front Page').should('be.visible')
    cy.get('nav a, .navbar a').contains(/admin|panel/i).click({ force: true })
    // Debería permanecer en /admin (sesión activa), NO ir al login
    cy.url().should('not.include', '/login')
    cy.url().should('include', '/admin')
  })

  // ── CP-09: Login admin con credenciales válidas ──
  it('CP-09 | Admin — Login exitoso con credenciales válidas', () => {
    cy.visit('/admin')
    cy.get('#username').clear().type('admin')
    cy.get('#password').clear().type('password')
    cy.get('button[type="submit"], .btn-primary').click()
    cy.url().should('include', '/admin')
    cy.contains(/rooms|report|branding|messages/i).should('be.visible')
  })

  // ── CP-10: Login admin con credenciales inválidas ──
  it('CP-10 | Admin — Login rechaza credenciales inválidas', () => {
    cy.visit('/admin')
    cy.get('#username').clear().type('usuario_falso')
    cy.get('#password').clear().type('clave_incorrecta')
    cy.get('button[type="submit"], .btn-primary').click()
    cy.url().should('include', '/admin')
    cy.contains(/invalid|incorrecto|error|wrong/i).should('be.visible')
  })

})
