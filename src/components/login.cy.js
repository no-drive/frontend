import Login from './login.vue'
import Register from './register.vue'
// Dentro de una prueba Cypress de componente
describe('MiComponente', () => {
  it('debería mostrar un botón de inicio de sesión', () => {
    // Montar el componente Vue.js
    cy.mount(Login);

    // Verificar que el botón de inicio de sesión esté presente
    cy.get('#btnRegister').should('exist');
  });

  it('debería redirigir a la página de inicio de sesión al hacer clic en el botón de inicio de sesión', () => {
    // Montar el componente Vue.js
    cy.mount(Register);

    // Hacer clic en el botón de inicio de sesión
    cy.get('#btnLogin').click();

  });
  it('Ingresar un nuevo usuario', () => {
    cy.mount(Register);

    // Llenar el formulario de registro
    cy.get('#inputUser').type('usuario')
    cy.get('#inputCorreo').type('nuevo_usuario@example.com')
    cy.get('#inputPass').type('password')
    cy.get('#inputNewPass').type('password')

    // Enviar el formulario
    cy.get('#btnSubtmit').click()
    cy.get('#btnLogin').click()

    // Verificar que el usuario se haya registrado exitosamente
  });
  it('Ingresar con nuevo usuario',()=>{
    cy.mount(Login);

    cy.get('#inputCorreo').type('nuevo_usuario@example.com');
    cy.get('#inputPass').type('password');
    cy.get('#btnLogin').click();
  })
});
