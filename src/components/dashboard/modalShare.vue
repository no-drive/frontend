<template>
    <modal>
        <div class="content">
            <h2>Compartir con:</h2>
            <lo class="list-group">
                <li v-for="(element) in listPeople" class=" list-group-item " :key="element.idusuario">
                    {{ element.usuarios_email }}
                <button @click="compartir(element.id_usuario )" class="btn btn-danger">Compartir</button>
                </li>
                <h1 class=" text-5xl">Compartir con grupos</h1>
                <li v-for="(group) in listGroup" class=" list-group-item " :key="group.id_group">
                    {{ group.nombre_grupo }}
                <button @click="compartirGrupo(group.id_group)" class="btn btn-danger">Compartir</button>
                </li>                

            </lo>
            <button @click="closeModal" class="btn btn-primary m-5">Cerrar</button>
        </div>
    </modal>
</template>

<script>
export default {
    name:"modalShare",
    /*
    Reelizar todo lo pertinente para compartir documentos de forma efectiva
    */
    data() {
        return {
            listPeople: [],
            listGroup:[],
            url: import.meta.env.VITE_BASE_URL
        }
    }, props: {
        file: {}
    }   , methods: {
        closeModal() {
            this.$emit('closeModal'); // Emitir un evento para indicar que el modal se ha cerrado
        },
        getpeople() {
            const jwt = localStorage.getItem('jwtToken');
            console.log(this.file);

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
                            console.log(response);
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
                        response.json().then((respuesta)=>{
                            console.log(respuesta);
                            this.closeModal();
                        })
                        
                    }
                    if (response.status == 401) {
                        console.log("denegado el acceso");
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
        },
        async compartirGrupo(id_group){
            const jwt = localStorage.getItem('jwtToken');
            console.log(id_group);
            if (jwt) {
                const data ={
                    "idFile":this.file.id_files,
                    "id_group":id_group,
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
                        response.json().then((respuesta)=>{
                            console.log(respuesta);
                            this.closeModal();
                        })
                        
                    }
                    if (response.status == 401) {
                        console.log("denegado el acceso");
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
        },
        async fetchGroups() {
            try {
                const jwt = localStorage.getItem('jwtToken');
                    fetch(this.url + '/groups/grupos', {
                        method: 'GET',
                        headers: {
                            "content-type": "application/json",
                            Authorization: jwt
                        },
                    }).then((response)=>{
                        response.json().then(response=>{
                        this.listGroup=response.Response;
                    })               
                        })
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
    }, mounted() {
        this.getpeople();
        this.fetchGroups();
    }

}




</script>
