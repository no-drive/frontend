<template>
    <div class="border border-black m-2 mt-0 rounded-2">
        <ul class="p-0" v-if="listaElementos && cambiar">
            <div class="border border-black m-2 p-2 elements" v-for="(element, indice) in listaElementos" :key="indice">
                <img v-if="element.mimetype == 'image/jpeg' || 'image/png'" :src="element.archivo" class="imagenes" />
                <div class="text-center ">
                    <h1>Titulo:{{ element.nombre }}</h1>
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
                                data.forEach((item) => {
                                    /*
                                    Decodificar los archivos que vienen en base 64
                                    */
                                    const archivoBase64 = item.archivo;
                                    const byteCharacters = atob(archivoBase64);
                                    const byteArrays = [];
                                    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                                        const slice = byteCharacters.slice(offset, offset + 1024);
                                        const byteNumbers = new Array(slice.length);
                                        for (let i = 0; i < slice.length; i++) {
                                            byteNumbers[i] = slice.charCodeAt(i);
                                        }
                                        const byteArray = new Uint8Array(byteNumbers);
                                        byteArrays.push(byteArray);
                                    }
                                    /**
                                     *Insertarlo en un Blob
                                     */
                                    const blob = new Blob(byteArrays, { type: item.mimetype });

                                    // Crear una URL para el blob y establecerlo como src de la imagen
                                    const dataURL = URL.createObjectURL(blob);

                                    item.archivo = dataURL;
                                    console.log(item);
                                    this.listaElementos.push(item);
                                })
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
                    idFile: element.id
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