<template>
    <div class="d-flex">
        <div class="border  mx-auto border-black rounded-5 m-5">

            <form @submit.prevent="changePassword()" class=" abs-center form d-flex flex-column p-4">
                <label>Contraseña</label>
                <input :class=inputClass type="password">
                <label>Nueva contraseña</label>
                <input v-model="pass" :class=inputClass type="text">
                <label>Repetir nueva contraseña</label>
                <input v-model="pass" :class=inputClass type="text">
                <button class="btn btn-white border border-black m-2">Cambiar contraseña</button>
                <a class="btn btn-white border border-black m-2" @click="returnDashboard">Regresar</a>
            </form>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pass: "",
            inputClass: ["form-group ", "mb-4", "d-flex ", "text-white", "flex-column", "bg-black", "border", "border-dark", "rounded-2", "h5"],
            url: import.meta.env.VITE_BASE_URL
        }
    },
    methods: {

        /*
        Funcion cambiar contraseña:
            - Autentica con JWT.
            - Valida la contraseña.
            - Luego la cambia la contraseña.
        */
        changePassword() {
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                fetch(this.url + '/users/chpass', {
                    method: 'PATCH',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                    body: JSON.stringify({ pass: this.pass })
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(async data => {
                                /*
                                TO-DO 
                                - Mostrar al usuario El cambio exitoso de la contraseña
                                */
                                console.log(data);
                                this.$router.push("/dashboard");
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
        //Metodo re regresar al incio
        returnDashboard() {
            this.$router.push("/dashboard");
        }
    }
}

</script>