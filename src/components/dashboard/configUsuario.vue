<template>
    <!-- Sidebar -->
<div class=" w-full h-lvh relative" id="wrapper">
  <router-link to="/dashboard/files" class=" mt-6 text-center p-6 text-3xl font-bold text-indigo-700">Configuración</router-link>
  <div id="container_opcions" class="grid h-auto gap-2 justify-center relative p-6 ">
    <button @click="navigateChpassword" :class=btnclass>
      Cambiar clave
    </button>
    <button @click="rmall()" :class=btnclass>
      Eliminar Todo
    </button>
    <router-link id="btnRegister" :class=btnclass to="/register">
      Registrarse
    </router-link>
    <router-link to="/dashboard/users" :class=btnclass >Gestión de usuarios</router-link>
    <router-link to="/dashboard/groups" :class=btnclass >Gestión de grupos</router-link>
    <router-link to="/dashboard/shared" :class=btnclass >Compartidos</router-link>

    <button @click="closeSesion" :class=btnclass>
      Cerrar Sesión
    </button>

  </div>
</div>

</template>
<script>
import { mapMutations } from 'vuex';
import '../styles/configUsuario.css';
export default {
    data() {
        return {
            url: import.meta.env.VITE_BASE_URL,
            classBtn: ['bg-white', 'rounded-2', 'p-2', 'text-center'],
            btnclass :['bg-gray-100 rounded-lg text-black hover:bg-indigo-900 transition duration-300 ease-in-out  p-6	hover:text-white']
        }
    },
    methods: {
        ...mapMutations(['increment']),
        closeModal() {
            this.$emit('close'); // Emitir evento para cerrar el modal en el componente padre
        },
        /*
        Remove all
        - Elimina todos los archivos de la base de dato de mongo
        */
        rmall() {
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                console.log(this.url);
                fetch(this.url + '/files/rmAllFiles', {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then(response => {
                    if (response.status == 200) {
                        console.log(response);
                        response.json()
                            .then(async data => {
                                console.log(data);
                                this.increment();
                            })
                    }
                    if (response.status == 401) {
                        console.log("negado");
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
        },
        //Cierra sesion eliminado en jwtToken
        closeSesion() {
            localStorage.removeItem('jwtToken');
            this.$router.push('/');
        },
        //Cambiar de ruta para cambiar la contraseña
        navigateChpassword() {
            this.$router.push("/changePassword")
        }
    },
    props: ['showModal'],
}



</script>
