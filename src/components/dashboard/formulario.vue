<template>
    <div class="border border-black rounded-2  p-3 m-2  ">
        <form @submit.prevent="subirArchivo(), cleanform()" id="formulario" class="form-group d-flex flex-column w-100">
            <span>name</span>
            <div id="inputName">
                <input type="text" name="nombre" v-model="nombre" class="form-control bg-black text-white ">
            </div>
            <span>file</span>

            <div id="inputFile">
                <input type="file" name="file" id="inputfile" class="form-control bg-black text-white ">

            </div><button type="submit" class="btn btn-white border border-black m-3 w-50 align-self-center">Subir
                archivo</button>
        </form>
        <Loader v-if="loading" :message="loading"></Loader>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Loader from '../Loader.vue';
export default {
    components: {
        Loader
    },
    data() {
        return {
            nombre: undefined,
            archivo: undefined,
            url: import.meta.env.VITE_BASE_URL,
            loading: undefined
        }
    },
    methods: {
        ...mapMutations(['increment']),


        /*
        Subir archivo al servidor
        - Valida el JWT.
        - Toma el id_usuario y sube el archivo a una ruta especifica.
        - Guarda esto en la base de datos
        */
        subirArchivo() {
            const formulario = new FormData(document.querySelector('#formulario'));
            const jwt = localStorage.getItem('jwtToken');
            this.nombre = formulario.get('nombre');
            this.archivo = formulario.get('file');


            if (jwt && this.nombre && this.archivo) {
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (evento) => {
                    if (evento.lengthComputable) {
                        const porcentaje = Math.round((evento.loaded / evento.total) * 100);
                        console.log(`Porcentaje de subida: ${porcentaje}%`);
                        this.loading = porcentaje;
                        if(porcentaje==100){
                            this.loading=undefined
                        }
                        // Aquí podrías actualizar la interfaz de usuario con el porcentaje de progreso
                    }
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const inputName = document.querySelector('#inputName');
                            inputName.classList.remove('warning');
                            const inputFile = document.querySelector('#inputFile');
                            inputFile.classList.remove('warning');
                            this.increment();
                        } else {
                            console.log('Error en la subida del archivo:', xhr.statusText);
                        }
                    }
                };

                xhr.open('POST', this.url + '/files/addFile', true);
                xhr.setRequestHeader('Authorization', jwt);
                xhr.send(formulario);
                this.loading = undefined;
            } else {
                const inputName = document.querySelector('#inputName');
                inputName.classList.add('warning');
                const inputFile = document.querySelector('#inputFile');
                inputFile.classList.add('warning');
                return;
            }
        },

        //Limpiar campos
        cleanform() {
            this.name = '';
            document.querySelector('#inputfile').value = '';
        }
    },
    props: {
        usuario: Object,
    }
}
</script>

<style>
form * {
    padding: 10px;
}

.warning {
    border: 3px solid red;
    border-radius: 10px;
    padding: 1px;
}
</style>