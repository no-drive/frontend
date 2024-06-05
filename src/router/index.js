import { createRouter, createWebHistory } from 'vue-router'
import login from "../components/login.vue";
import dashboard from "../components/dashboard.vue";
import register from "../components/register.vue";
import chpassword from "../components/chpassword.vue";
import dashboardUsers from "../components/dashboardUsers/dashboardUsers.vue";
const url = import.meta.env.VITE_BASE_URL;
const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
    children:[{
      path:'users',
      component:dashboardUsers
    }],
    meta: { requiresAuth: true }
  }, {
    path: "/register",
    name: "register",
    component: register
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: chpassword,
    meta: { requiresAuth: true }
  },
];


/*
Funcion Encargada de autenticar con node js 
la validez del JWT
*/
async function isAuthenticated() {

  const jwt = localStorage.getItem('jwtToken');
  if (!jwt) {
    return false;
  }
  return await fetch(url + '/users/validate', {
    method: 'post',
    headers: {
      "content-type": "application/json",
      Authorization: jwt
    },
  }).then(response => {
    let state = false
    console.log(response)
    switch (response.status) {
      case 200:
        state = true;
        break;
      default:
        state = false;
        break;

    }
    console.log(state);
    return state;

  });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/*
Funcion encargada  de vigilar la autenticidad de los JWT 
en las rutas protegidas
*/
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const state = await isAuthenticated();
    if (!state) {
      console.log(state);
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});



export default router
