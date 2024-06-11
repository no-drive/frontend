<template>
<div class="flex justify-center items-center h-screen">
  <div class=" border-black rounded-5 p-5 flex-col ">
      <form
        @submit.prevent="changePassword()"
         class="border-4 border-black rounded-5 p-5 w-auto relative flex text-mono text-sm gap-4 flex-col"
      >
        <label>Contraseña</label>
        <div class="d-flex align-items-center">
          <input
            id="inputPass"
            v-model="pass"
            :class="inputClass"
            required
            @input="isValidPwd(pass, 'alertpwd', '1')"
            :type="passwordFieldTypePASS"
          />
          <button
            type="button"
            class="mb-4 btn btn-white"
            @click="togglePasswordVisibility('1')"
            id="btnView"
          >
            <img src="../assets/view.svg" class="p-0 h-5" />
          </button>
        </div>
        <p v-show="validPwdPASS" id="alertpwd"></p>
        <label>Nueva contraseña</label>
        <div class="d-flex align-items-center">
          <input
            v-model="newpass"
            :class="inputClass"
            required
            id="inputNewPass"
            :type="passwordFieldTypeNEWPASS"
            @input="isValidPwd(newpass, 'alertpwdNEW', '2')"
          />
          <button
            type="button"
            class="mb-4 btn btn-white"
            @click="togglePasswordVisibility('2')"
            id="btnView"
          >
            <img src="../assets/view.svg" class="p-0 h-5" />
          </button>
        </div>
        <p v-show="validPwdNEWPASS" id="alertpwdNEW"></p>

        <label>Repetir nueva contraseña</label>
        <div class="d-flex align-items-center">
          <input
            id="inputRepeatPass"
            required
            :type="passwordFieldTypeREPEATPASS"
            v-model="repeatpass"
            :class="inputClass"
            @input="isValidPwd(repeatpass, 'alertpwdREPEAT', '3')"
          />
          <button
            type="button"
            class="mb-4 btn btn-white"
            @click="togglePasswordVisibility('3')"
            id="btnView"
          >
            <img src="../assets/view.svg" class="p-0 h-5" />
          </button>
        </div>
        <p v-if="validPwdREPEATPASS" id="alertpwdREPEAT"></p>

        <button class="border border-black m-2" type="submit">
          Cambiar contraseña
        </button>
        <a
          class="border border-black m-2"
          @click="returnDashboard"
          >Regresar</a
        >
      </form>
      <Loader v-if="Loader"></Loader>
    </div>
  </div>
</template>
<script>
import Loader from "./Loader.vue";
export default {
  components: {
    Loader,
  },
  data() {
    return {
      newpass: undefined,
      pass: undefined,
      repeatpass: undefined,
      inputClass: [
      "p-3 gap-2",
        "text-black",
        "d-flex ",
        "flex-column",
        "border",
        "border-dark",
        "rounded-3",
      ],
      url: import.meta.env.VITE_BASE_URL,
      Loader: false,
      passwordFieldTypePASS: "password",
      passwordFieldTypeNEWPASS: "password",
      passwordFieldTypeREPEATPASS: "password",
      validPwdPASS: false,
      validPwdNEWPASS: false,
      validPwdREPEATPASS: false,
      invalidPwd: "",
      valid: false,
    };
  },
  methods: {
    /*
        Funcion cambiar contraseña:
            - Autentica con JWT.
            - Valida la contraseña.
            - Luego la cambia la contraseña.
        */
    changePassword() {
      const jwt = localStorage.getItem("jwtToken");
      if (
        jwt &&
        !this.validPwdNEWPASS &&
        !this.validPwdPASS &&
        !this.validPwdREPEATPASS
      ) {
        this.Loader = true;
        fetch(this.url + "/users/chpass", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: jwt,
          },
          body: JSON.stringify({ pass: this.newpass }),
        })
          .then((response) => {
            if (response.status == 200) {
              response.json().then(() => {
                /*
                                TO-DO 
                                - Mostrar al usuario El cambio exitoso de la contraseña
                                */
                this.Loader = false;

                this.$router.push("/dashboard");
              });
            }
            if (response.status == 401) {
              console.log("hola");
              return;
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
    },
    isValidPwd(pwd, element, _input) {
      this.invalidPwd = "";
      let _element = document.getElementById(`${element}`);
      this.valid = false;
      if (pwd == null) {
        this.invalidPwd = "Campo no puede ser nulo";
        this.valid = true;
      }
      if (pwd.length < 4) {
        this.invalidPwd = this.invalidPwd + "contraseña  menor a 4";
        this.valid = true;
      }
      if (pwd.includes(" ")) {
        this.invalidPwd = this.invalidPwd + "contraseña contiene vacios";
        this.valid = true;
      }

      if (pwd.length > 16) {
        this.invalidPwd = this.invalidPwd + "contraseña  mayor a 16";
        this.valid = true;
      }
      switch (_input) {
        case "1":
          this.validPwdPASS = this.valid;
          break;
        case "2":
          if (this.newpass != this.repeatpass) {
            this.invalidPwd = this.invalidPwd + " Contraseñas No coinciden";
            this.valid = true;
          }
          this.validPwdNEWPASS = this.valid;
          break;
        case "3":
          if (this.newpass != this.repeatpass) {
            this.invalidPwd = this.invalidPwd + " Contraseñas No coinciden";
            this.valid = true;
          }
          this.validPwdREPEATPASS = this.valid;
          break;
        default:
          break;
      }
      if(!_element){
        return;
      }
      if (this.invalidPwd) {
        _element.textContent = this.invalidPwd;
      }
    },
    //Metodo de regresar al incio
    returnDashboard() {
      this.$router.push("/dashboard/files");
    },
    togglePasswordVisibility(_input) {
      switch (_input) {
        case "1":
          this.passwordFieldTypePASS =
            this.passwordFieldTypePASS === "password" ? "text" : "password";
          break;
        case "2":
          this.passwordFieldTypeNEWPASS =
            this.passwordFieldTypeNEWPASS === "password" ? "text" : "password";
          break;
        case "3":
          this.passwordFieldTypeREPEATPASS =
            this.passwordFieldTypeREPEATPASS === "password"
              ? "text"
              : "password";
          break;
        default:
          break;
      }
    },
  },
};
</script>
