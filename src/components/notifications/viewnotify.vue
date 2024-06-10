<template>
    {{ title }}
    <ul>
      <li class=" grid  grid-flow-col gap-6 m-3 justify-center align-middle" v-for="(notificacion, index) in notificaciones" :key="notificacion.id_notificaciones">
        {{ notificacion.descripcion }}
        <button @click="eliminarNotificacion(notificacion)" class=" bg-red-500 p-3">Eliminar Notificacion</button>
      </li>
    </ul>
</template>

<script>

    export default{
        data(){
            return {
                title:"Notificaciones",
                notificaciones:[],
                url: import.meta.env.VITE_BASE_URL,
            }
        },
        created(){
            this.fetchNotificaciones();
        },
        methods:{

            fetchNotificaciones(){
                try {
                const jwt = localStorage.getItem('jwtToken');
                    fetch(this.url + '/share/notify', {
                        method: 'GET',
                        headers: {
                            "content-type": "application/json",
                            Authorization: jwt
                        },
                    }).then((response)=>{
                        response.json().then(response=>{

                        this.notificaciones=response.Response;
                    })               
                        })
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }, eliminarNotificacion(notificacion){
                const data ={
                    idNotifiacion:notificacion.id_notificaciones
                }
                try {
                const jwt = localStorage.getItem('jwtToken');
                    fetch(this.url + '/share/notify', {
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                            Authorization: jwt
                        },
                        body:JSON.stringify(data)
                    }).then((response)=>{
                        response.json().then(response=>{
                            console.log(response);
                            this.fetchNotificaciones();
                    })               
                        })
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }

            
        }
    }
</script>
