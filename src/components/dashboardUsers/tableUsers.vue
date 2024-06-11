<template>
        <div v-if="this.open==true" class="fixed inset-0 bg-gray-800 bg-opacity-75 h-screen flex items-center justify-center z-50">
        <div  class="bg-white rounded-lg p-6 w-full max-w-lg ">
      <register v-if="this.open==true" @close_register="this.open=false"></register>
        </div>
        </div>
    <div class="user-manager p-6 w-full h-full border-b-indigo-900 rounded-xl shadow-md space-y-4">
      <h2 class="text-2xl font-bold">Gestión de Usuarios</h2>

      </div>
      <table class="w-full table-auto">
  <thead class="bg-gray-100">
    <tr>
      <th class="px-4 py-2">#</th>
      <th class="px-4 py-2">Nombre</th>
      <th class="px-4 py-2">Email</th>
      <th class="px-4 py-2">Estado</th>
      <th class="px-4 py-2">Privilegio</th>
      <th class="px-4 py-2">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user, index) in users" :key="user" class="bg-gray-100 border-b">
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
        <div v-else>
          <input 
            placeholder="Email" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </td>
      <td class="px-4 py-2">
        <p>{{user.estado}}</p>
      </td>
      <td class="px-4 py-2">
        <select v-if="user" v-model="user.id_privilegios" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option v-for="privilegio in privilegios" :key="privilegio.id_privilegios" :value="privilegio.id_privilegios">{{ privilegio.nombre_Privilegio }}</option>
        </select>
      </td>
      <td class="px-4 py-2 space-x-2">
        <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" @click="modificarPrivilegios(user)">
          {{ "Editar" }}
        </button>
        <button 
          @click="deleteUser(user.id_usuario)" 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </td>
    </tr>
  </tbody>
</table>
      <button @click="this.open=!this.open"  class=" bg-blue-600 p-7 rounded-xl text-white"> Agregar usuario</button>
  </template>

<script>
import register from '../register.vue';
export default {
    data() {
        return {
            users: [],
            url: import.meta.env.VITE_BASE_URL,
            estados:[],
            privilegios:[],
            open:false
        }
    },    components:{register}
    ,
    created() {
        this.fetchUsers();
        this.getEstados();
        this.getprivilegios();
    },
    methods: {

        async fetchUsers() {
            try {
                const jwt = localStorage.getItem('jwtToken');
                fetch(this.url + '/users/people', {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then((response)=>{response.json().then(response=>{
                    this.users=response.response;
                })               
                     })
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },async getEstados() {
            try {
                const jwt = localStorage.getItem('jwtToken');
                fetch(this.url + '/users/estados', {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then((response)=>{response.json().then(response=>{
                    console.log(response);  
                  this.estados=response.estados;
                })               
                     })
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },async getprivilegios() {
            try {
                const jwt = localStorage.getItem('jwtToken');
                fetch(this.url + '/users/privilegios', {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then((response)=>{response.json().then(response=>{
                    console.log(response);  
                  this.privilegios=response.privilegios;
                })               
                     })
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        
        async deleteUser(id) {

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
        body: JSON.stringify({user_id_delete:id})
    }).then(response => {
        if (response.status == 200) {
            response.json()
                .then(async data => {
                    console.log(data);
                    this.users=[];
                 this.fetchUsers();
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
  modificarPrivilegios(user){
    const jwt = localStorage.getItem('jwtToken');
    if (jwt) {
        fetch(this.url + '/users/privilegios', {
            method: 'PATCH',
            headers: {
                "content-type": "application/json",
                Authorization: jwt
            },
            body: JSON.stringify({id_privilegio:user.id_privilegios,id_usuario_revoke:user.id_usuario})
        }).then(response => {
            if (response.status == 200) {
                response.json()
                    .then(async data => {
                    this.fetchUsers();
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
  

    },
};
</script>