<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white shadow-md rounded-lg overflow-hidden flex max-w-4xl w-full">
    <img id="imgRefrencia" class="w-1/2" src="https://img.freepik.com/vector-premium/conjunto-iconos-almacenamiento-informacion-conjunto-dibujos-animados-iconos-vector-almacenamiento-informacion-conjunto-aislado_96318-2460.jpg ">
    <div class=" w-2 bg-indigo-600 "></div>
  <div id="login" class="w-1/2 p-8 justify-center" >
    <div class="caja justify-center @">
      <form id= "formulario" class="mb-4 justify-center h-100" @submit.prevent="login">
        <h1 class="text-violet-950 text-3xl font-bold mb-6 " id="titulo">Bienvenidos</h1>
        <label class="subtitulo">Correo</label>
        <br>
        <input
          type="email"
          v-model="correo"
          id="inputCorreo"
          required
          :class="inputClass"
          @input="isValidEmail()"
        />
        <p v-if="!validcorreo" id="alertUser">Correo invalido</p>
        <br>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <div id="passDiv" class="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4 ">
          <input
            required
            id="inputPass"
            :type="passwordFieldType"
            v-model="password"
            :class="inputClass"
            @input="isValidPwd()"
          />  

          <button
            type="button"
            class="px-3 py-2 focus:outline-none"
            @click="togglePasswordVisibility"
            id="btnView"
          >
            <img src="../assets/view.svg" id="eyeboton" class="h-6 w-6" />
          </button>
        </div>
        <p v-if="!validPwd" id="alertpwd">{{ invalidPwd }}</p>

        <h2 v-if="messageServer">{{ messageServer }}</h2>
        <button type="submit" id="btnLogin" class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          Iniciar Sesion
        </button>
      </form>
    </div>
  </div>
</div>
</div>

  <Loader v-if="this.loading"></Loader>
</template>
<script>
import Loader from "./Loader.vue";
import { ref } from "vue";
import api from "@/services/apiUsers.js"
import './styles/login.css'
export default {
  components: {
    Loader,
  },
  data() {
    return {
      correo: null,
      password: null,
      passwordFieldType: "password",
      messageServer: null,
      validcorreo: ref(true),
      inputClass:"mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex-grow px-3 py-2 focus:outline-none",
      validPwd: ref(true),
      url: import.meta.env.VITE_BASE_URL,
      loading: ref(false),
    };
  },
  mounted() {
    this.validateToken();
  },
  methods: {
    returnLogin() {
      this.$router.push("/register");
    },
    async login() {
    //  this.loading = true;
      const data = {
        user: {
          email: this.correo,
          pwd: this.password,
        },
      };
      const datos =await api._login(data);
      if (datos.response.error) {
                  console.log(datos.response.error);
                  this.messageServer = datos.response.error;
                  this.loading = false;
                  return;
                }
      await this.$store.dispatch("login", datos.response.userData);
                localStorage.setItem("jwtToken", datos.response.token);
                this.loading = false;
                this.$router.push("/dashboard/files");
      
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    validateToken() {
      const jwt = localStorage.getItem("jwtToken");
      if (jwt) {
        fetch(this.url + "/users/validate", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: jwt,
          },
        })
          .then((response) => {
            if (response.status == 200) {
              response.json().then(async (data) => {
                await this.$store.dispatch("login", data.response.userData);
                this.$router.push("/dashboard");
              });
            }
            if (response.status == 401) {
              return;
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
    },
    isValidPwd() {
      this.invalidPwd = "";
      this.validPwd = true;
      if (this.password == null) {
        this.invalidPwd = "Campo no puede ser nulo";
        this.validPwd = false;
      }
      if (this.password.length < 4) {
        this.invalidPwd = this.invalidPwd + " Contraseña menor a 4";
        this.validPwd = false;
      }
      if (this.password.includes(" ")) {
        this.invalidPwd = this.invalidPwd + " Contraseña contiene vacios";
        this.validPwd = false;
      }
      if (this.password.length > 16) {
        this.invalidPwd = this.invalidPwd + " Contraseña mayor a 16";
        this.validPwd = false;
      }
    },
    isValidEmail() {
      this.validcorreo = true;
      this.validcorreo = /^[^@]+@\w+(\.\w+)+\w$/.test(this.correo);
      return this.validcorreo;
    },
  },
};
</script>
