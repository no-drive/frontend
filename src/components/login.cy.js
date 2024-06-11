import Login from './login.vue'
import { createRouter, createWebHistory } from 'vue-router'

import dashboard from './dashboard.vue'
import DashboardUsers from './dashboardUsers/dashboardUsers.vue';
import Mainview from './dashboard/mainview.vue';
import Viewgroup from './grupos/viewgroup.vue';
import Viewcompartir from './compartir/viewcompartir.vue';
import Viewnotify from './notifications/viewnotify.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
    children: [{
      path: 'users',
      component: DashboardUsers,
    },
    {
      path: 'files',
      component: Mainview
    }, {
      path: 'groups',
      component: Viewgroup
    },
    {
      path: 'shared',
      component: Viewcompartir
    },{
      path:'notify',
      component: Viewnotify
    }],
    meta: { requiresAuth: true }
  },
];

// Dentro de una prueba Cypress de componente
describe('MiComponente', () => {
  it('debería mostrar un botón de inicio de sesión', () => {
    // Montar el componente Vue.js
    cy.mount(Login);
  });
  it('Ingresar con usuario administrador',()=>{
    cy.mount(Login);

    cy.get('#inputCorreo').type('alejo3@alejo.com');
    cy.get('#inputPass').type('contraseñas');
    cy.get('#btnLogin').click();
  });
  it('Ingresar con nuevo usuario',()=>{
    cy.mount(dashboard);
    cy.mount(DashboardUsers);

    const router = createRouter({
      history: createWebHistory(import.meta.env.BASE_URL),
      routes
    })
    router.push('/dashboard/users');

/*
    cy.get('#inputCorreo').type('alejo3@alejo.com');
    cy.get('#inputPass').type('contraseñas');
    cy.get('#btnLogin').click();*/
  })
});
