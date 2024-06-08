<template>
  <div class="group-manager p-6 w-full h-full border-b-indigo-900 rounded-xl shadow-md space-y-4">
    <h2 class="text-2xl font-bold">Gestión de Grupos</h2>
<table class="w-full table-auto">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Nombre de Usuario</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Nombre del Grupo</th>
          <th class="px-4 py-2">Descripción</th>
          <th class="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, index) in groups" :key="group.id_group" class="bg-gray-100 border-b">
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">{{ group.name_usuario }}</td>
          <td class="px-4 py-2">{{ group.usuarios_email }}</td>
          <td class="px-4 py-2">{{ group.nombre_grupo }}</td>
          <td class="px-4 py-2">{{ group.description }}</td>
          <td class="px-4 py-2 space-x-2">
            <button 
              @click="editGroup(group)" 
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Editar
            </button>
            <button 
              @click="deleteGroup(group.id_group)" 
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="openModal" class="bg-blue-600 p-7 rounded-xl text-white">Agregar grupo</button>
<!-- Modal -->
<div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">Nuevo Grupo</h3>
        <form @submit.prevent="saveGroup">
          <div class="mb-4">
            <label for="user" class="block text-sm font-medium text-gray-700">Usuario</label>
            <select v-model="newGroup.id_usuario" id="user" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option v-for="user in users" :key="user.id_usuario" :value="user.id_usuario">{{ user.usuarios_email }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre del Grupo</label>
            <input type="text" v-model="newGroup.name" id="name" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea v-model="newGroup.descripcion" id="description" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" required></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancelar</button>
            <button @click="CreateUser(newGroup)" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    </div>
</template>
<script>

export default{
    name:'viewgroups-',
    data(){
        return {
            groups:[],
            url: import.meta.env.VITE_BASE_URL,
            showModal: false,
            users: [],
            newGroup:{}
        }
    },
    created() {
        this.fetchUsers(),
        this.fetchGroups()
    },
    methods:{
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
                        this.groups=response.Response;
                        console.log(this.groups);
                    })               
                        })
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
            , openModal() {
            this.showModal = true;
            },
            closeModal() {
            this.showModal = false;
            },
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
                    console.log(this.users);
                })               
                     })
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
            async CreateUser(group){
                const data= {
                    id_usuario_admin:group.id_usuario,
                    nombre:group.name,
                    descripcion: group.descripcion
                }
                console.log(data);
                try {
                const jwt = localStorage.getItem('jwtToken');
                fetch(this.url + '/groups/addgroup', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                    body: JSON.stringify(data)
                }).then(
                    ()=>{
                        this.closeModal()
                        this.fetchGroups();
                    }
                );               
            } catch (error) {
                console.error('Error fetching users:', error);
            }

            }
}
}
</script>