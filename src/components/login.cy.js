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
});
