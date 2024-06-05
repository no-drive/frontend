<style >
.content {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
    height: 50%;
    width: 50%;
    padding: 2%;
    position: fixed;
}
</style>
<template>
    <modal>
        <div class="content">
            <h2>Compartir con:</h2>
            <lo class="list-group">
                <li v-if="listPeople" v-for="(element) in listPeople" class=" list-group-item " :key="element.idusuario">
                    {{ element.usuarios_email }}
                <button @click="compartir(element.id_usuario )" class="btn btn-danger">Compartir</button>
                </li>

            </lo>
            <button @click="closeModal" class="btn btn-primary m-5">Cerrar</button>
        </div>
    </modal>
</template>

<script>
export default {

    /*
    Reelizar todo lo pertinente para compartir documentos de forma efectiva
    */
    data() {

        return {
            listPeople: [],
            url: import.meta.env.VITE_BASE_URL
        }
    }, props: {
        file: Object
    }, methods: {
        closeModal() {
            this.$emit('closeModal'); // Emitir un evento para indicar que el modal se ha cerrado
        },
        getpeople() {
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                fetch(this.url + '/users/people', {
                    method: 'get',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(data => {
                            console.log(this.file);
                                data.response.forEach(element => {
                                    this.listPeople.push(element);
                                });
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
         compartir(userId){
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                const data ={
                    "idFile":this.file.id_files,
                    "userIdShare":userId,
                }
                fetch(this.url + '/share/shareAcept', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt,
                    },
                    body:JSON.stringify(data)
                }).then(response => {
                    if (response.status == 200) {
                        console.log(response);
                        this.closeModal();

                    }
                    if (response.status == 401) {
                        console.log("denegado el acceso");
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
        }
    }, mounted() {
        this.getpeople();
    }

}




</script>
