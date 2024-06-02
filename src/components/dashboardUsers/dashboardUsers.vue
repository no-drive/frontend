<template>
    <div>
      <h1>Dashboard de Usuarios</h1>
      <tableUsersVue/>
    </div>
  </template>
  
  <script>
import tableUsersVue from './tableUsers.vue';

  export default {
    components:{tableUsersVue}
  };
  </script>
  