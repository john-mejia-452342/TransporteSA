<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button"/>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="modal-body">
          <q-input type="number" v-model="cedula" label="Cedula" class="modal-input" />
          <q-input v-model="nombre" label="Nombre" class="modal-input" />
          <q-input type="number" v-model="telefono" label="Telefono" class="modal-input" />
        </q-card-section>
        <q-separator />

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" />
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarCliente()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%" >
      <h1>Clientes</h1>

      <div class="b-b">
        <q-input class="bbuscar" v-model="searchCedula" label="Buscar por Cedula" style="width: 300px" @input="filtrarClientes"/>
        <q-btn class="btnbuscar" color="primary" label="Buscar" @click="filtrarClientes"/>
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarCliente()" />
      </div>
      <q-table title="Clientes" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="editarCliente(props.row._id)"/>
            <q-btn color="white" text-color="black" label="❌" @click="inactivarCliente(props.row._id)" v-if="props.row.estado == 1"/>
            <q-btn color="white" text-color="black" label="✅" @click="activarCliente(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useClienteStore } from "../stores/Cliente.js";
import { useQuasar } from "quasar";

const clienteStore = useClienteStore();
const $q = useQuasar();

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref();
let nombre = ref();
let telefono = ref("");
let cambio = ref(0);
let searchCedula = ref("");

// Filtrar Clientes
function filtrarClientes() {
  if (searchCedula.value.trim() === "") {
    rows.value = clientes.value; 
  } else {
    rows.value = clientes.value.filter((cliente) =>cliente.cedula.toString().includes(searchCedula.value.toString()));
  };
};

// Obtener Clientes 
async function obtenerInfo() {
  try {
    await clienteStore.obtenerInfoClientes();
    clientes.value = clienteStore.clientes;
    rows.value = clienteStore.clientes;
  } catch (error) {
    console.log(error);
  };
};

// Primera Accion 
onMounted(async () => {
  obtenerInfo();
});

// Datos Tabla
const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "telefono", label: "Telefono", field: "telefono" },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
];

// Agregar Cliente
function agregarCliente() {
  fixed.value = true;
  text.value = "Agregar Cliente";
  cambio.value = 0;
};

// Funcionamiento Agregar y Editar Clientes
async function editarAgregarCliente() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await clienteStore.postCliente({
          cedula: cedula.value,
          nombre: nombre.value,
          telefono: telefono.value,
        });
        cancelShow();
        limpiar();
        greatMessage.value = "Cliente Agregado";
        showGreat();
        obtenerInfo();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
    } else {
      let id = idCliente.value;
      if (id) {
        try {
          showDefault();
          await clienteStore.putEditarCliente(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            telefono: telefono.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Cliente Actualizado";
          showGreat();
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          cancelShow();
          badMessage.value = error.response.data.error.errors[0].msg;
          showBad();
        };
      };
    };
    validacion.value = false;
  };
};

// Limpiar Casillas
function limpiar() {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
};

let idCliente = ref("");

// Editar Clientes
async function editarCliente(id) {
  cambio.value = 1;
  const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
  if (clienteSeleccionado) {
    idCliente.value = String(clienteSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Cliente";
    cedula.value = clienteSeleccionado.cedula;
    nombre.value = clienteSeleccionado.nombre;
    telefono.value = clienteSeleccionado.telefono;
  };
};

// Inactivar Clientes
async function inactivarCliente(id) {
  try {
    showDefault();
    await clienteStore.putInactivarCliente(id);
    cancelShow();
    greatMessage.value = "Cliente Inactivado";
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

// Activar Clientes
async function activarCliente(id) {
  try {
    showDefault();
    await clienteStore.putActivarCliente(id);
    cancelShow();
    greatMessage.value = "Cliente Activado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

let greatMessage = ref("");
let badMessage = ref("");

// Notificacion Buena
const showGreat = () => {
  notification = $q.notify({
    spinner: false,
    message: greatMessage,
    timeout: 2000,
    type: "positive",
  });
};

// Notificacion Mala 
const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};

// Notificacion de Carga
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};
// Cancelar Notificacion
const cancelShow = ()=>{
  if (notification) {
    notification();
  };
};

let validacion = ref(false);
let notification = ref(null);

// Validar Campos
function validar() {
  if (!cedula.value && !nombre.value && !telefono.value) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!cedula.value) {
    badMessage.value = "Ingrese la Cedula";
    showBad();
  } else if (!nombre.value) {
    badMessage.value = "Ingrese el Nombre";
    showBad();
  } else if (!telefono.value) {
    badMessage.value = "Ingrese el Telefono";
    showBad();
  } else if (String(telefono.value).length !== 10) {
    badMessage.value = "El telefono debe tener 10 Dígitos";
    showBad();
  } else {
    validacion.value = true;
  };
};

// Limpiar el modal cuando se cierre mal
watch(fixed, () => {
  if (fixed.value == false) {
    limpiar();
  };
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Gabarito&display=swap");

.container {
  display: flex;
  justify-content: center;
}
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-table {
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}

.container-table h1 {
  font-family: "Gabarito", sans-serif;
  padding: 0;
  margin: 0;
}

.modal-content {
  width: 400px;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end;
}

.b-b {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  gap: 5px;
}

.btnbuscar {
  width: 170px;
  height: 53px;
  position: relative;
  top: 7px;
}
.bbuscar {
  width: 170px;
  font-size: 18px;
  background-color: rgba(5, 177, 245, 0.204);
  border-radius: 5px;
  position: relative;
  top: 6px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
}

.close-button {
  color: #fff;
}

.modal-body {
  padding: 20px;
}

.modal-input {
  width: 100%;
  margin-bottom: 10px;
}

.modal-footer {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  margin-left: 10px;
}
</style>
