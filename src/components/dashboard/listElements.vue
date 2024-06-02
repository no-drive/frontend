<template>
    <div class="border border-black m-2 mt-0 rounded-2">
        <ul class="p-0" v-if="listaElementos && cambiar">
            <div class="border border-black m-2 p-2 elements" v-for="(element, indice) in listaElementos" :key="indice">
                <iframe v-if="element.tipo == 'application/pdf'" :src="element.fileUrl" class="imagenes"/>
                <img  v-if="element.tipo.startsWith('image/')" :src="element.fileUrl" class="imagenes">
                <div class="text-center ">
                    <h1>Titulo:{{ element.filename }}</h1>
                    <h3>Fecha:{{ element.fecha }}</h3>
                </div>
                <div class="container d-flex flex-column  justify-content">
                    <button class="m-3 btn btn-danger" @click="eliminar(element)">eliminar</button>
                    <button class="m-3 btn btn-success" @click="share(element)">compartir</button>
                    <button class="m-3 btn btn-warning " @click="descargar(element)">Descargar</button>
                </div>
            </div>
        </ul>

    </div>
</template>
<style>
.elements {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    height: 100%;
}
.imagenes {
        width: 100%;
        height: 100%;
    }

@media (max-width: 700px) {
    .elements {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .imagenes {
        width: 500px;
        height: 500px;
    }
}
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
                url: import.meta.env.VITE_BASE_URL
            }
        },
        computed: {
            ...mapState(['update']),
            cambiar() {
                if (!this.update) {
                    this.refreshFiles();
                    this.increment();
                }
                return this.update;
            }

        }, mounted() {
            this.refreshFiles();
        },

        methods: {
            ...mapMutations(['increment']),
             refreshFiles() {
                /*this.listaElementos.forEach((element)=>{
                    this.listaElementos.push(element);
                })*/
                const jwt = localStorage.getItem('jwtToken');

                fetch(this.url + '/files/get', {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(async data => {
                                this.listaElementos = [];
                                console.log(data);
                                 data.forEach(async(element) => {
                                    const fileId = element.id_files; // ID del archivo
                                    const url = `${this.url}/files/getfile/${fileId}`;
                                    const token = localStorage.getItem("jwtToken"); // Reemplaza con tu token de autenticación

                                    try {
                                        const response =await fetch(url, {
                                        method: "GET",
                                        headers: {
                                            "Authorization": `Bearer ${token}`
                                        }
                                        });
                                        if (response.ok) {
                                            const blob =  await response.blob();
                                            const fileUrl = URL.createObjectURL(blob);
                                            element.fileUrl =fileUrl;
                                        } else {
                                        console.error("Error al obtener el archivo:", response.statusText);
                                        }
                                    } catch (error) {
                                        console.error("Error al hacer la solicitud:", error);
                                    }   
                                    this.listaElementos.push(element);

                        });
                            })
                    }
                    if (response.status == 401) {
                        return;
                    }
                }).catch(() => {
                    console.log("error")
                })
            },

            //Metodo de descarga de un archivo
            descargar(element) {
                const a = document.createElement("a");
                a.href = element.archivo;
                a.download = element.nombre;
                a.click();
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
                this.$emit('modal-open', element.id); // Emitir un evento para indicar que el modal se ha cerrado
            }
        },

    }

</script>