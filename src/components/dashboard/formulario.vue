<template>
    <div class=" h-screen bg-red-600 text-white text-mono">
    <div class="w-96 h-screen p-3 gap-7 bg-indigo-800 rounded-lg shadow-lg flex flex-col items-center justify-center">
      <img src="../../assets/upload_icon.png" class="">
      <div class="text-2xl mb-6">Arrastra y suelta tu archivo aquí</div>
      <div
        class="w-full h-48 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center"
        @dragover.prevent="highlight"
        @dragenter.prevent="highlight"
        @dragleave.prevent="unhighlight"
        @drop.prevent="handleDrop"
      >
        <div v-if="!archivo">
          <span class="text-1xl">Suelta el archivo aquí</span>
        </div>
        <div v-else>
          <span class="text-sm text-2xl">{{ archivo.name }}</span>
        </div>
      </div>
      <span></span>
      <input @change="handleFileChange" type="file" class=" w-3/4 bg-white text-black  ">

      <button type="submit" @click="subirArchivo()" :class=btnclass>Subirarchivo</button>

    </div>
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
            archivo: undefined,
            file:undefined,
            url: import.meta.env.VITE_BASE_URL,
            loading: undefined,
            btnclass :['bg-violet-200 h-auto rounded-lg text-black hover:bg-violet-600 transition duration-300 ease-in-out  p-3	hover:text-white'],
        }
    },
    methods: {
        ...mapMutations(['increment']),
    
        subirArchivo() {
            const jwt = localStorage.getItem('jwtToken');
            const formData = new FormData();
            formData.append('file', this.archivo);

            if (jwt && this.archivo) {
                const xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', (evento) => {
                    if (evento.lengthComputable) {
                        const porcentaje = Math.round((evento.loaded / evento.total) * 100);
                        this.loading = porcentaje;
                        if(porcentaje==100){
                            this.archivo=undefined;
                            this.loading=undefined;
                        }
                    }
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            this.increment();
                        } else {
                            console.log('Error en la subida del archivo:', xhr.statusText);
                        }
                    }
                };

                xhr.open('POST', this.url + '/files/addFile', true);
                xhr.setRequestHeader('Authorization', jwt);
                console.log(formData);
                xhr.send(formData);
                this.loading = undefined;
                this.increment();
            } else {
                return;
            }
        },
        handleFileChange(event) {
      // Captura el archivo seleccionado
      const file = event.target.files[0];
      // Asigna el archivo seleccionado a la propiedad 'archivo'
      this.archivo = file;
    },

        //Limpiar campos
        cleanform() {
            this.name = '';
            document.querySelector('#inputfile').value = '';
        },

        highlight(event) {
      event.target.classList.add('border-indigo-500');
    },
    unhighlight(event) {
      event.target.classList.remove('border-indigo-500');
    },
    handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      this.archivo = files[0];
      console.log(this.archivo);
    }
    },

}
</script>
