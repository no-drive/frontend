<script>
import { ref } from "vue";

export default {
  data() {
    return {
      inputClass: [
        "form-group ",
        "mb-4",
        "text-white",
        "d-flex ",
        "flex-column",
        "bg-black",
        "border",
        "border-dark",
        "rounded-2",
        "h5",
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
      if (this.validcorre && this.validPwd && this.validUsername)
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: this.user }),
      })
        .then(() => {
          this.alertMessage = "Se registro correctamente al usuario";
          this.alert = true;
        })
        .catch((error) => {
          console.log(error);
        });
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
  <div id="register" class="border border-black border-primary rounded-4">
    <div class="m-5 d-flex flex-column">
      <form
        id="formularioRegistro"
        @submit.prevent="register()"
        class="form-group d-flex flex-column"
      >
        <h1 class="mb-4">Registro De usuarios</h1>
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
          type="submit"
          class="btn btn-black border border-black align-self-center"
        >
          <p class="h6 m-0 p-1">Registrarse</p>
        </button>
      </form>
      <router-link
        class="mx-auto btn btn-white m-3 border border-black h6"
        to="/"
        id="btnLogin"
      >
        <p class="h6 m-0 p-1">Iniciar Sesion</p>
      </router-link>
    </div>
  </div>
  <div class="modal" v-if="alert">
    <modal>
      <div class="content">
        <h2>{{ alertMessage }}</h2>
        <button @click="alert = false" class="btn btn-primary m-5">
          Cerrar
        </button>
      </div>
    </modal>
  </div>
</template>

<style>
#register {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.content {
  background-color: white;
  position: absolute;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10em;
}

.modal {
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
