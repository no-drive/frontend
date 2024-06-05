<script >
import { mapState } from 'vuex'; // Importa mapState desde Vuex

import formulario from './dashboard/formulario.vue';
import configUsuario from './dashboard/configUsuario.vue';
import listElements from './dashboard/listElements.vue';
import modalShare from './dashboard/modalShare.vue';
import './styles/dashboard.css';

export default {

    methods: {
        navigateLogin() {
            this.$router.push("/");
        },
        openModal(file) {
            this.file = file;
            this.showModalPeople = true
        },

    },
    data() {
        return {
            showModal: true,
            showModalPeople: false,
            file: '',
            message:true
        }
    },
    components: {
        formulario,
        configUsuario,
        listElements,
        modalShare
    }, computed: {
        ...mapState(['user'])

    }
};
</script>


<template >
    <modalShare class="modal" :file="file" v-if="showModalPeople" @closeModal="showModalPeople = false"></modalShare>
    <div id="dashboard">
        <div id="divConfigUser" class="bg-black">
            <configUsuario v-if="showModal" @close="showModal = false"></configUsuario>
        </div>
        <div id="divContent">
           
            <div id="divlistElements">
                <listElements :message="message"  @modal-open="openModal"></listElements>
            </div>
            <router-link to="/dashboard/users">holi</router-link>
            <router-view></router-view>
        </div>
        <div id="derecha">
            <div id="divForm">
                <formulario @messageFromChildOne="updateMessage" :usuario="usuario" />
            </div>
        </div>
    </div>
</template>

