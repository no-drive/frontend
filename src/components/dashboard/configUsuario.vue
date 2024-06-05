<template>
    <!-- Sidebar -->
    <div class="d-flex flex-column bg-blue p-2" id="wrapper">
        <h1 class="text-center mt-10">Configuración</h1>
        <button @click="navigateChpassword" :class=classBtn>Cambiar clave</button>
        <button @click="rmUser" :class=classBtn>Eliminar Cuenta</button>
        <button @click="rmall()" :class=classBtn>Eliminar Todo</button>
        <button @click="closeSesion" :class=classBtn>Cerrar Sesion</button>
        <router-link id="btnRegister" :class=classBtn to="/register"
        >Registrarse</router-link
      >
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import '../styles/configUsuario.css';
export default {
    data() {
        return {
            url: import.meta.env.VITE_BASE_URL,
            classBtn: ['bg-white', 'rounded-2', 'p-2', 'text-center']

        }
    },
    methods: {
        ...mapMutations(['increment']),
        closeModal() {
            this.$emit('close'); // Emitir evento para cerrar el modal en el componente padre
        },
        rmUser() {

            /*
                Eliminacion del Usuario:
                - ELiminar usuario de la base de datos.
                - Eliminar todos los documentos de este id_usuario.
            */
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                fetch(this.url + '/users/DeleteUser', {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(async data => {
                                console.log(data);
                                /*
                                TO-DO
                                - Mostrar que se elimino de forma correcta al usuario
                                */
                                localStorage.removeItem('jwtToken');
                                this.$router.push("/");
                            })
                    }
                    if (response.status == 401) {
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
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
