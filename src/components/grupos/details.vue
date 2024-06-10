<template>
    <div>
      <h1>Detalles del grupo {{ grupo.nombre_grupo }}</h1>

      <tbody>
    <tr v-for="(user, index) in integrantes" :key="user" class="bg-gray-100 border-b">
      <td class="px-4 py-2">{{ index + 1 }}</td>
      <td class="px-4 py-2">
        <div v-if="user">
          <span class="font-semibold">{{ user.name_usuario }}</span>
        </div>
        <div v-else>
          <input 
            placeholder="Nombre" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </td>
      <td class="px-4 py-2">
        <div v-if="user">
          <span>{{ user.usuarios_email }}</span>
        </div>
      </td>
      <td>
        <button @click="eliminarusuariogrupo(user)" class=" rounded-md bg-red-600 p-3 m-3 text-rose-100">Eliminar usuario </button>

      </td>
    </tr>
  </tbody>
      <button @click="closeModal" class="p-6 bg-blue-700 m-4">Cerrrar</button>
      <select v-model="newUsuario">
        <option v-for="(persona) in listPeople" :key="persona" :value="persona">{{ persona.usuarios_email }}</option>
      </select>
      <button @click="AgregarIntegrantes(newUsuario)">Agregar usuario</button>
    </div>
  </template>
  
  <script>
  export default {
    data(){
        return{
            integrantes:[],
            listPeople:[],
            newUsuario:{},
            url: import.meta.env.VITE_BASE_URL,
        }
    },
    async created(){
        await this.integrantesGrupo();
        this.getpeople();
    },
    name: 'DetailsGroup',
    props: ['grupo'],
    methods:{
        closeModal(){
            this.$emit('closeModal');
        },
        integrantesGrupo(){
            try {
                this.integrantes=[];
                const jwt = localStorage.getItem('jwtToken');
                    fetch(this.url + '/groups/grupos', {
                        method: 'POST',
                        headers: {
                            "content-type": "application/json",
                            Authorization: jwt
                        },
                        body:JSON.stringify({id_grupo:this.grupo.id_group})
                    }).then((response)=>{
                        response.json().then(response=>{
                        this.integrantes=response.Response;
                        console.log(this.integrantes);
                    })               
                        })
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
        },
        AgregarIntegrantes(usuario){
            const jwt = localStorage.getItem('jwtToken');
            const data={
                id_usuario_group:usuario.id_usuario,
                id_privilegios:2,
                id_grupo:this.grupo.id_group
            }
            if (jwt) {
                fetch(this.url + '/groups/adduser', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                    body:JSON.stringify(data)
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(data => {
                                this.integrantesGrupo();
                                this.getpeople();

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
        eliminarusuariogrupo(usuario){
            const jwt = localStorage.getItem('jwtToken');
            const data={
                id_usuario_group:usuario.id_usuario,
                id_grupo:this.grupo.id_group
            }
            if (jwt) {
                fetch(this.url + '/groups/deleteuser', {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                    body:JSON.stringify(data)
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(data => {
                                this.integrantesGrupo();
                                this.getpeople();
                            })
                    }
                    if (response.status == 401) {
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })

            }
        }
        ,getpeople() {
            const jwt = localStorage.getItem('jwtToken');
            console.log(this.file);
            this.listPeople=[];
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
                                data.response.forEach(element => {
                                    if(!this.integrantes.find(x=>x.id_usuario==element.id_usuario)){
                                        this.listPeople.push(element);
                                    }
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

    }
  }
  </script>
  