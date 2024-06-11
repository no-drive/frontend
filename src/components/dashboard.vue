<script >
import { mapState } from 'vuex'; // Importa mapState desde Vuex
import configUsuario from './dashboard/configUsuario.vue';
import './styles/dashboard.css';
export default {
    name:'DashboardComponent',
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
        configUsuario,
    }, computed: {
        ...mapState(['user'])

    }
};
</script>


<template>
    <div id="dashboard" class=" shadow-md rounded-lg overflow-hidden flex h-full  w-full">
        <div id="divConfigUser" class="w-1/6 h-screen relative">
            <configUsuario v-if="showModal" @close="showModal = false" class="h-full"></configUsuario>
        </div>
    <router-view></router-view>
    </div>
</template>


