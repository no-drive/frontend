<template>
    <div class="rounded-lg bg-indigo-200 m-9 p-3 overflow-auto">
        <div id="containerList" class="overflow-auto h-full text-mono ">
            <ul class="w-full flex flex-col h-full p-2" v-if="listaElementos && cambiar">
                <div class="grid grid-cols-3 gap-4 p-2 " v-for="(element, indice) in listaElementos" :key="indice">
                    <div class="relative "> 
                    <iframe v-if="element.tipo == 'application/pdf'" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover"/>
                    <img  v-if="element.tipo.startsWith('image/')" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover">
                    <h1 v-else class="flex bg-slate-400 text-4xl text-white text items-center rounded-lg shadow-lg  justify-center text-center w-full h-full">{{separar_string(element.filename) }}</h1>
                </div>
                    <div class="text-center mt-2 overflow-hidden">
                        <h1 class="font-bold text-lg">{{ element.filename }}</h1>
                        <h3 class="text-gray-600">Fecha:{{ element.fecha }}</h3>
                        <h4 class="text-gray-600">{{ formatFileSize(element.tamaño_archivo) }}</h4>
                    </div>
                    <div class="grid grid-rows-3 gap-4 p-2 mt-2">
                        <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300" @click="eliminar(element)">Eliminar</button>
                        <button class="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-300" @click="share(element)">Compartir</button>
                        <button class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition duration-300" @click="descargar(element)">Descargar</button>
                    </div>
                    <hr class="col-span-3" />
                </div>
            </ul>
        </div>
        <div class="mt-4 flex justify-center">
            <a v-for="n in this.seccion" @click="seccionar(n)" class="inline-block p-2 w-fit bg-gray-200 rounded m-1 cursor-pointer content-center hover:bg-gray-300 transition duration-300" >{{n}}</a>
        </div>
    </div>
</template>
<style>

</style>

<script>

import { mapState, mapMutations } from 'vuex';
export default
    {
        name: "listEments",
        data() {
            return {
                listaElementos: [
                ],
                showModal: false,
                url: import.meta.env.VITE_BASE_URL,
                seccion:1,
                count:0
            }
        },
        props: ['message'],
        watch: {
    message(newMessage) {
        this.refreshFiles();

        console.log(newMessage);
    }
  },
        computed: {
            ...mapState(['update']),
             async cambiar() {
                if (!this.update) {
                    await this.refreshFiles(1);
                    this.increment();
                }
                return this.update;
            }

        }, mounted() {
            this.refreshFiles()
        },

        methods: {
            ...mapMutations(['increment']),
            separar_string(nombre_archivo){
                let partes = nombre_archivo.split('.');
                // Obtener la extensión, que es el último elemento del arreglo
                let extension = partes[partes.length - 1];
                return extension;
            },
            seccionar(seccion){
                this.refreshFiles(seccion)
            }, formatFileSize(bytes) {
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes === 0) return '0 Bytes';

                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                const value = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
                
                return `${value} ${sizes[i]}`;
                    },
             async refreshFiles(seccion) {
                const jwt = localStorage.getItem('jwtToken');
                const post={
                    "limit":5,
                    "off":(seccion!=1?(seccion-1)*5:0)
                }
                console.log(this.count);
                await fetch(this.url + '/files/get', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                    body:JSON.stringify(post)
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(async data => {
                                this.listaElementos = [];
                                this.count =data.count[0]["COUNT(*)"];
                                this.seccion =Math.ceil(this.count / 5); 
                                 data.files.forEach(async(element) => {
                                    const fecha=new Date(element.fecha);
                                    const diferenciaHorariaColombia = -5 * 60 * 60 * 1000;
                                    const fecha_colombia =new Date(fecha.getTime()+diferenciaHorariaColombia);
                                    element.fecha=fecha_colombia.toLocaleDateString()+"\n"+fecha_colombia.toLocaleTimeString();
                                    const fileId = element.id_files; // ID del archivo
                                    const url = `${this.url}/files/getfile/${fileId}`;
                                    if(element.tipo.startsWith('image/') || element.tipo=='application/pdf'){
                                        const token = localStorage.getItem("jwtToken"); // Reemplaza con tu token de autenticación
                                        try {
                                            const response =await fetch(url, {
                                            method: "POST",
                                            headers: {
                                                "Authorization": `Bearer ${token}`
                                            }
                                            });
                                            if (response.ok) {
                                                const blob =  await response.blob();
                                                const fileUrl = URL.createObjectURL(blob);
                                                element.fileUrl =fileUrl;
                                            } else {
                                            console.error("Error al obtener el archivo:", response);
                                            }
                                        } catch (error) {
                                            console.error("Error al hacer la solicitud:", error);
                                        }   
                                    }
                                    this.listaElementos.push(element);
                        });
                            })
                    }
                    if (response.status == 401) {
                        return;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },

            //Metodo de descarga de un archivo
            async descargar(element){
                console.log(element);
                const fileId = element.id_files; 
                const token = localStorage.getItem('jwtToken');
                const url = `${this.url}/files/getfile/${fileId}`;
                console.log(url);
                try {
                    const response =await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    });
                    if (response.ok) {
                        const blob =  await response.blob();
                        const fileUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href=fileUrl;
                        a.download = element.filename;
                        a.click();
                    } else {
                    console.error("Error al obtener el archivo:", response);
                    }
                } catch (error) {
                    console.error("Error al hacer la solicitud:", error);
                }   
  
            },

            /*
            Metodo para eliminar un archivo
            - Tomando el id del archivo y eliminandolo por medio de node js
            */
            eliminar(element) {
                const jwt = localStorage.getItem('jwtToken');
                const data = {
                    idFile: element.id_files,
                    path:element.path
                };
                fetch(this.url + '/files/rmfile', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json', // Indica el tipo de contenido del cuerpo (JSON en este caso)
                        Authorization: jwt,
                    },
                    body: JSON.stringify(data) // Convierte el objeto a JSON antes de enviarlo en el cuerpo
                }).then(response => {
                    if (
                        response.status === 200) {
                        this.refreshFiles();
                    }
                });
            },
            share(element) {
                this.$emit('modal-open', element); // Emitir un evento para indicar que el modal se ha cerrado
            }
        },

    }

</script>