<template>
    <!-- Sidebar -->
<div class=" bg-indigo-600 h-full flex flex-col p-5" id="wrapper">
  <router-link to="/dashboard/files" class="text-center text-3xl p-2 font-bold text-white font-mono">Home</router-link>
  <div id="container_opcions" class="h-full gap-10 flex justify-around flex-col font-mono text-center p-2">

    <button @click="navigateChpassword" :class=btnclass>
      Cambiar clave <img src="../../assets/iconpadlock.png" class="h-5">
    </button>
    <button @click="rmall()" :class=btnclass>
      Eliminar todos los archivos 
    </button>
    <router-link to="/dashboard/users" v-if="privilegios=='administrador'" :class=btnclass >Gestión de usuarios <img src="../../assets/iconsuser.png" class="h-4"></router-link>
    <router-link to="/dashboard/groups" v-if="privilegios=='administrador'" :class=btnclass >Gestión de grupos <img src="../../assets/iconsgroup.png" class="h-4"></router-link>
    <router-link to="/dashboard/shared"  :class=btnclass >Compartidos <img src="../../assets/iconsshare.png" class="h-5"></router-link>
    <router-link to="/dashboard/notify"  :class=btnclass >Notifiaciones <img src="../../assets/iconsbell.png" class="h-5"></router-link>
    
    <button @click="closeSesion" :class=btnclass class="">
      Cerrar Sesión<img src="../../assets/iconslogout.png" class="h-5">
    </button>

  </div>
</div>

</template>
<script>
import { mapMutations } from 'vuex';
import '../styles/configUsuario.css';
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return {
            url: import.meta.env.VITE_BASE_URL,
            btnclass :['bg-violet-200 h-auto rounded-lg text-black hover:bg-indigo-900 transition duration-300 ease-in-out  p-3	hover:text-white flex gap-2'],
            privilegios:'usuario'
        }
    },
    created(){
        this.privilegiosUsuario();
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
        },
        privilegiosUsuario(){
            const jwt = localStorage.getItem('jwtToken');

            try {
              const  decodedToken = jwtDecode(jwt);
              this.privilegios= decodedToken.privilegios;
            } catch (error) {
                console.error('Token inválido:', error);
                this.decodedToken = null;
            }
        }
    },
    props: ['showModal'],
}



</script>
