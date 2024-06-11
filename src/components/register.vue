<script>
import { ref } from "vue";

export default {
  data() {
    return {
      inputClass: [
        "p-3",
        "text-black",
        "d-flex ",
        "flex-column",
        "border",
        "border-dark",
        "rounded-3",
      ],
      user: {
        email: undefined,
        pwd: undefined,
        username: undefined,
      },
      validcorreo: ref(true),
      validUsername: ref(true),
      invalidUser: undefined,
      pwd_repeat: undefined,
      invalidPwd: undefined,
      validPwd: ref(true),
      alert: ref(false),
      alertMessage: undefined,
    };
  },  
  methods: {
    /*
        Metodo para registar un usuario en la base de datos
    */
    async register() {
      const url = import.meta.env.VITE_BASE_URL + "/users/Register";
      console.log(this.validcorreo && this.username && this.pwd);
      if (this.validcorreo){
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: this.user }),
        }).then(() => {
            this.alertMessage = "Se registro correctamente al usuario";
            this.alert = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
  
    },
    /*
        Validación del campo email con regex functions
        */
    isValidEmail() {
      this.validcorreo = true;
      this.validcorreo = /^[^@]+@\w+(\.\w+)+\w$/.test(this.user.email);
      return this.validcorreo;
    },
    /**
     * Validacion del campo username
     */
    isValidUser() {
      this.invalidUser = "";
      this.validUsername = true;
      if (this.user.username == null) {
        this.invalidUser = "Campo no puede ser nulo";
        this.validUsername = false;
      }
      if (this.user.username.length > 8) {
        this.invalidUser = this.invalidUser + " Nombre usuario mayor a 8";
        this.validUsername = false;
      }
      if (this.user.username.includes(" ")) {
        this.invalidUser = this.invalidUser + " Nombre contiene vacios";
        this.validUsername = false;
      }
    },
    isValidPwd() {
      this.invalidPwd = "";
      this.validPwd = true;
      if (this.user.pwd == null) {
        this.invalidPwd = "Campo no puede ser nulo";
        this.validPwd = false;
      }
      if (this.user.pwd.length < 4) {
        this.invalidPwd = this.invalidPwd + " Nombre usuario menor a 4";
        this.validPwd = false;
      }
      if (this.user.pwd.includes(" ")) {
        this.invalidPwd = this.invalidPwd + " Nombre contiene vacios";
        this.validPwd = false;
      }
      if (this.user.pwd !== this.pwd_repeat) {
        this.invalidPwd = this.invalidPwd + " Contraseñas No coinciden";
        this.validPwd = false;
      }
      if (this.user.pwd.length > 16) {
        this.invalidPwd = this.invalidPwd + " Nombre usuario mayor a 16";
        this.validPwd = false;
      }
    },
  },
};
</script>

<template>
  <div id="register" class="">
    <div class="p-5 flex-col gap-3 h-full">
      <form
        id="formularioRegistro"
        @submit.prevent="register()"
        class="form-group justify-center relative flex text-mono text-sm gap-4 flex-col"
      >
        <h1 class="mb-4 text-2xl">Registro De usuarios</h1>
        <input
          placeholder="Usuario"
          id="inputUser"
          @input="isValidUser()"
          type="text"
          required
          :class="inputClass"
          v-model="user.username"
        />
        <p v-if="!validUsername" id="alertUser">{{ invalidUser }}</p>
        <input
          id="inputCorreo"
          placeholder="Corrreo Electronico"
          type="text"
          @input="isValidEmail()"
          required
          :class="inputClass"
          v-model="user.email"
        />
        <p v-if="!validcorreo">Correo invalido</p>
        <input
          id="inputPass"
          placeholder="password"
          type="password"
          required
          :class="inputClass"
          @input="isValidPwd()"
          v-model="user.pwd"
        />
        <input
          id="inputNewPass"
          placeholder="passsword repeat"
          required
          type="password"
          v-model="pwd_repeat"
          @input="isValidPwd()"
          :class="inputClass"
        />
        <p v-if="!validPwd" id="alertpwd">{{ invalidPwd }}</p>
        <button
          id="btnSubtmit"
          type="submit"
          class="btn btn-black border border-black align-self-center"
        >
          <p class="h6 m-0 p-1">Registrarse</p>
        </button>
      </form>
      <button @click=" this.$emit('close_register')" class="border border-black my-4 ">
        <p class="h6 m-0 p-1">Cerrar modal</p>
      </button>
    </div>
  </div>
  <div class="modal" v-if="alert">
    <modal>
      <div class="content">
        <h2>{{ alertMessage }}</h2>
        <button @click="alert = false" class="subtmit btn btn-primary m-5">
          Cerrar
        </button>
      </div>
    </modal>
  </div>
</template>
