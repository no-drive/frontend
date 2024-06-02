<template>
    <!-- Sidebar -->
    <div class="d-flex flex-column bg-blue p-2" id="wrapper">
        <button @click="closeModal" id="btnClose">
            <img src="../../assets/close.png">
        </button>
        <h1 class="text-white">Configuración</h1>
        <button @click="navigateChpassword" :class=classBtn>Cambiar clave</button>
        <button @click="rmUser" :class=classBtn>Eliminar Cuenta</button>
        <button @click="rmall" :class=classBtn>Eliminar Todo</button>
        <button @click="closeSesion" :class=classBtn>Cerrar Sesion</button>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            url: import.meta.env.VITE_BASE_URL
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
            console.log(jwt);
            if (jwt) {
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
                                //Actualiza los archivos 
                                this.increment();
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
    data() {
        return {
            classBtn: ['bg-white', 'rounded-2', 'p-2', 'text-center']
        }
    }


}



</script>
<style>
#wrapper {
    justify-content: center;
    height: 100vh;
    position: sticky;
    top: 0;
}

#wrapper * {
    margin-bottom: 30%;
}

#btnClose {
    position: relative;
    background: transparent;
    border: 0;
    width: 50%;
    align-self: flex-end;

}

#btnClose img {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;

}

@media (max-width: 500px) {
    #btnClose {
        width: 100%;
    }

}
</style>