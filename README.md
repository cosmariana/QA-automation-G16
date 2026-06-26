# QA Automation Challenge - Grupo 16

## Descripción

Proyecto de automatización de pruebas desarrollado con **Cypress 15.18** y **JavaScript** para validar funcionalidades de la aplicación **Shady Meadows / Restful Booker Platform**.

---

## Documentación

### Casos de Prueba

https://docs.google.com/spreadsheets/d/1gNCAGArCSkiOY110mvv_BQ4s-ErqEXPWD0gL_kFuKmc/edit?gid=1611920195#gid=1611920195

### Gestión del Proyecto

https://trello.com/b/iHKh20kG/qa-grupo16

---

## Tecnologías Utilizadas

* Cypress 15.18
* JavaScript
* Node.js
* Git
* GitHub

---

## Estructura del Proyecto

```text
QA-automation-G16/
│
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js
│   │   └── myTestRestfulBooker.cy.js
│   │
│   ├── fixtures/
│   │   └── userData.json
│   │
│   └── support/
│       ├── CommandLogin.json
│       └── e2e.js
│
├── node_modules/
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Casos Automatizados

### Login

* Inicio de sesión exitoso con credenciales válidas.
* Rechazo de acceso con contraseña incorrecta.

### Reservas

* Reserva exitosa como usuario invitado.
* Validaciones del formulario de reserva.

### Contacto

* Envío exitoso del formulario de contacto.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/cosmariana/QA-automation-G16.git
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución

Abrir Cypress:

```bash
npx cypress open
```

Ejecutar todos los tests:

```bash
npx cypress run
```

Ejecutar únicamente el archivo principal del challenge:

```bash
npx cypress run --spec "cypress/e2e/myTestRestfulBooker.cy.js"
```

Ejecutar únicamente los tests de login:

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

---

## Datos de Prueba

Los datos utilizados por los escenarios automatizados se encuentran en:

```text
cypress/fixtures/userData.json
```

---

## Autor

Grupo 16 - QA Automation Challenge

-Gomez Castro Joaquin Ignacio (gomezjoaquinof@gmail.com)
-Bravo Gonzalo Ezequiel (gonzalobravo222@gmail.com)
-Bustamante Callas Emerson Gilmar (bustamante.emerson@gmail.com)
-Dumpierres Cintia Mariana (cintiadumpierres@gmail.com)
-Cos Mariana Jesús (cosmarian@gmail.com)