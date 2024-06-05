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
        <div>
            <a v-for="n in this.seccion" @click="seccionar(n)">{{n}}</a>
        </div>
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
            seccionar(seccion){
                this.refreshFiles(seccion)
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
                                this.seccion =Math.ceil(this.count / 5); ;
                                console.log(this.seccion);
                                 data.files.forEach(async(element) => {
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
                                        console.error("Error al obtener el archivo:", response);
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
                }).catch((err) => {
                    console.log(err)
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
                this.$emit('modal-open', element); // Emitir un evento para indicar que el modal se ha cerrado
            }
        },

    }

</script>