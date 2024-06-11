<template>
    <div v-if="showModalPeople" class="fixed inset-0 bg-gray-800 bg-opacity-75 h-screen flex items-center justify-center z-50">
        <div  class="bg-white rounded-lg p-6 w-full max-w-lg">
<modalShare class="modal" :file="file" v-if="showModalPeople" @closeModal="showModalPeople = false"></modalShare>
        </div>
    </div>
        <div class="bg-white-500 w-2/3 h-screen relative">
            <h2 class="text-mono text-3xl p-3 text-black">Documentos recientes</h2>
            <div id="divlistElements" class=" h-full relative overflow-auto">
                <listElements :message="message"  @modal-open="openModal"></listElements>
            </div>
        </div>
        <div id="derecha" class="w-1/4 h-screen">
                <formulario />
        </div>
</template>    

<script >
import { mapState } from 'vuex'; // Importa mapState desde Vuex
import formulario from './formulario.vue';
import listElements from './listElements.vue';
import ModalShare from './modalShare.vue';
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
        updateMessage(){}

    },
    components: {
        formulario,
        listElements,
        ModalShare
    }, computed: {
        ...mapState(['user'])
    }
};
</script>
