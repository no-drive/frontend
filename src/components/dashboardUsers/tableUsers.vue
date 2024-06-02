<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>privilegio</th>
                    <th>email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id_usuario }}</td>
                    <td>{{ user.name_usuario }}</td>
                    <td>{{ user.nombre_privilegio}}</td>
                    <td>{{ user.usuarios_email }}</td>

                    <td>
                        <button @click="deleteUser(user.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import api from '@/services/api.js';

export default {
    data() {
        return {
            users: [],
            url: import.meta.env.VITE_BASE_URL,
        }
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            console.log("hola");
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
        async deleteUser(id) {
            try {
                await api.deleteUser(id);
                this.fetchUsers(); // Refrescar la lista de usuarios
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        },
    },
};
</script>