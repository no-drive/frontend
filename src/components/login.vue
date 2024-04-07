<script>
import Loader from "./Loader.vue";
import { ref } from "vue";

export default {
  components: {
    Loader,
  },
  data() {
    return {
      inputClass: [
        "form-group ",
        "mb-4",
        "d-flex ",
        "text-white",
        "flex-column",
        "bg-black",
        "border",
        "border-dark",
        "rounded-2",
        "h5",
      ],
      correo: null,
      password: null,
      passwordFieldType: "password",
      messageServer: null,
      validcorreo: ref(true),
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
      this.loading = true;
      const data = {
        user: {
          email: this.correo,
          pwd: this.password,
        },
      };
      try {
        fetch(this.url + "/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((result) => {
          if (result.status == 200) {
            result
              .json()
              .then(async (data) => {
                if (data.response.error) {
                  console.log(data.response.error);
                  this.messageServer = data.response.error;
                  this.loading = false;
                  return;
                }
                await this.$store.dispatch("login", data.response.userData);
                localStorage.setItem("jwtToken", data.response.token);
                this.loading = false;
                this.$router.push("/dashboard");
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
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

<template>
  <div id="login" class="border border-black rounded-5 mx-auto my-auto">
    <div class="d-flex flex-column m-5">
      <form class="form d-flex flex-column" @submit.prevent="login">
        <h1 class="align-self-center">Login</h1>
        <label>Correo</label>
        <input
          type="text"
          v-model="correo"
          id="inputCorreo"
          required
          :class="inputClass"
          @input="isValidEmail()"
        />
        <p v-if="!validcorreo" id="alertUser">Correo invalido</p>

        <label>Contraseña</label>
        <div class="d-flex align-items-center">
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
            class="mb-4 btn btn-white"
            @click="togglePasswordVisibility"
            id="btnView"
          >
            <img src="../assets/view.svg" class="p-0" />
          </button>
        </div>
        <p v-if="!validPwd" id="alertpwd">{{ invalidPwd }}</p>

        <h2 v-if="messageServer">{{ messageServer }}</h2>
        <button type="submit" class="btn btn-white border border-black m-2">
          Iniciar Sesion
        </button>
      </form>
      <router-link id="btnRegister" class="btn btn-white border border-black m-2" to="/register"
        >Registrarse</router-link
      >
    </div>
  </div>
  <Loader v-if="this.loading"></Loader>
</template>
<style>
#login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#btnView {
  position: relative;
  align-self: flex-end;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  gap: 2px;
}

#inputPass {
  position: relative;
  display: flex;
  flex-direction: row;
}

img {
  position: relative;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
}
</style>
