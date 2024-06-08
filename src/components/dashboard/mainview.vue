<template>
<modalShare class="modal" :file="file" v-if="showModalPeople" @closeModal="showModalPeople = false"></modalShare>
  <div class="bg-blue-100 w-2/3 h-screen relative">
            <h2>Busqueda</h2>
            <div class=" h-1/5">  
            </div>
            <h2>Documentos recientes</h2>
            <div id="divlistElements" class=" h-4/5 relative overflow-auto">
                <listElements :message="message"  @modal-open="openModal"></listElements>
            </div>
        </div>
        <div id="derecha" class="w-1/4">
            <div id="divForm">
                <formulario @messageFromChildOne="updateMessage" :usuario="usuario" />
            </div>
        </div>
</template>    

<script >
import { mapState } from 'vuex'; // Importa mapState desde Vuex
import formulario from './formulario.vue';
import listElements from './listElements.vue';
export default {
    name: 'MainViewComponent',
    data() {
        return {
            showModal: true,
            showModalPeople: false,
            file: '',
            message:true
        }
    },
    methods: {
        openModal(file) {
            this.file = file;
            this.showModalPeople = true
        },

    },
    components: {
        formulario,
        listElements
    }, computed: {
        ...mapState(['user'])
    }
};
</script>
