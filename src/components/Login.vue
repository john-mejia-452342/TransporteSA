<template>
  <div class="container">
    <div class="login-card">
      <div class="card-header">
        <img
          id="fotol"
          src="https://png.pngtree.com/png-vector/20220912/ourmid/pngtree-high-detailed-bus-vector-png-image_6172563.png"
          alt=""
        />
        <h1 id="Titulo">Login</h1>
      </div>
      <div class="card-body">
        <!-- <div class="q-pa-md">
                    <div class="row q-gutter-sm">
                      <q-btn color="purple" @click="showDefault" label="Default spinner" />
                    </div>
                  </div> -->
        <form @submit.prevent="validar">
          <div class="input-container">
            <input
              placeholder="Usuario"
              class="input-field"
              type="text"
              v-model="username"
              name="username"
            />
            <label for="input-field" class="input-label">Usuario</label>
            <span class="input-highlight"></span>
          </div>
          <div class="input-container">
            <input
              placeholder="Password"
              class="input-field"
              v-model="password"
              name="password"
              type="password"
            />
            <label for="input-field" class="input-label">Password</label>
            <span class="input-highlight"></span>
          </div>
          <div class="error">{{ errorMessage }}</div>
          <div class="form-group">
            <button type="submit" class="login-button">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLoginStore } from "../stores/Login.js";
import { useQuasar } from "quasar";
const loginStore = useLoginStore();

const username = ref("");
const password = ref("");
const $q = useQuasar();
let errorMessage = ref("");

const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

let validacion = ref(false);
let notification = ref(null);
async function validar() {
  if (!username.value && !password.value) {
    errorMessage.value = "Ingrese el usuario y la contraseña";
  } else if (!username.value) {
    errorMessage.value = "Ingrese el usuario";
  } else if (!password.value) {
    errorMessage.value = "Ingrese la contraseña";
  } else {
    errorMessage.value = "";
    validacion.value = true;
  }
  if (validacion.value == true) {
    try {
      showDefault();
      await loginStore.Login({
        cuenta: username.value,
        clave: password.value,
      });
      if (notification) {
        notification();
      }
      $q.notify({
        spinner: false,
        message: "Ingresado al programa",
        timeout: 2000,
        type: "positive",
      });
    } catch (error) {
      if (notification) {
        notification();
      }
      $q.notify({
        spinner: false,
        message: `${error.response.data.msg}`,
        timeout: 2000,
        type: "negative",
      });
    }
  }

  validacion.value = false;
}
</script>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

#fotol {
  width: 300px;
  height: 300px;
}

#Titulo {
  font-size: 3em;
  position: relative;
  top: -30px;
  margin: 0;
}

.login-card {
  background-color: #f8f8f8;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px;
  max-width: 700px;
  width: 500px;
  height: 750px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}
.card-header {
  text-align: center;
}
.card-header h1 {
  font-size: 2em;
  color: #333;
  text-shadow: 1px 1px #ddd;
}
.card-body {
  display: flex;
  align-content: stretch;
  justify-content: space-evenly;
  position: relative;
  top: -40px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #f0f0f0;
  font-size: 1.2em;
  color: #555;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.3);
  outline: none;
}

input[type="submit"] {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px;
  transition: background-color 0.3s ease;
}

input[type="submit"]:hover {
  background-color: #0069d9;
}

.login-button {
  position: absolute;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px;
  width: 58%;
  margin-top: 30px;
  transition: background-color 0.3s ease;
  transition: 0.25s;
  top: 90%;
}

.login-button:hover {
  background-color: #0069d9e7;
  -webkit-box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
  -moz-box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
  box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
}

/* Input container */
.input-container {
  position: relative;
  margin: 20px;
}

/* Input field */
.input-field {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  background-color: transparent;
}

/* Input label */
.input-label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 16px;
  color: rgba(204, 204, 204, 0);
  pointer-events: none;
  transition: all 0.3s ease;
}

/* Input highlight */
.input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #007bff;
  transition: all 0.3s ease;
}

/* Input field:focus styles */
.input-field:focus + .input-label {
  top: -20px;
  font-size: 12px;
  color: #007bff;
}

.input-field:focus + .input-label + .input-highlight {
  width: 100%;
}
.error {
  display: flex;
  width: 100%;
  justify-content: center;
  color: red;
  font-size: 18px;
}
</style>
