<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button" @click="limpiar()" />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="modal-body">
          <q-input type="text" v-model="cedula" label="Cedula" class="modal-input"/>
          <q-input type="text" v-model="nombre" label="Nombre" class="modal-input"/>
          <q-input type="text" v-model="cuenta" label="Cuenta" class="modal-input"/>
          <!-- <q-input type="text" v-model="clave" label="Clave" class="modal-input"/> -->
          <q-input type="text" v-model="telefono" label="Telefono" class="modal-input"/>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" @click="limpiar()"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarVendedor()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%">
      <h1>Vendedor</h1>
      <div class="b-b">
        <q-input class="bbuscar" v-model="searchCedula" label="Buscar por Cedula" style="width: 400px" @input="filtrarvendedores"/>
        <q-btn color="primary" label="Buscar" @click="filtrarvendedores" class="btnbuscar"/>
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarVendedor()"/>
      </div>
      <q-table title="Vendedores" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="editarVendedor(props.row._id)"/>
            <q-btn color="white" text-color="black" label="❌" @click="InactivarVendedor(props.row._id)" v-if="props.row.estado == 1"/>
            <q-btn color="white" text-color="black" label="✅" @click="ActivarVendedor(props.row._id)" v-else/>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useVendedorStore } from "../stores/Vendedor.js";
import { useQuasar } from "quasar";

const VendedoresStore = useVendedorStore();
const $q = useQuasar();

let vendedores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref("");
let cuenta = ref("");
let clave = ref();
let telefono = ref("");
let cambio = ref(0);
let searchCedula = ref("");

// Filtro Vendedores por Cedula
function filtrarvendedores() {
  if (searchCedula.value.trim() === "") {
    rows.value = vendedores.value; 
  } else {
    rows.value = vendedores.value.filter((vendedores) =>vendedores.cedula.toString().includes(searchCedula.value.toString()));
  };
};

// Obtener Vendedores
async function obtenerInfo() {
  try {
    await VendedoresStore.obtenerInfoVendedor();
    vendedores.value = VendedoresStore.vendedores;
    rows.value = VendedoresStore.vendedores;
  } catch (error) {
    console.log(error);
  };
};

// Primera Accion 
onMounted(async () => {
  obtenerInfo();
});

// Datos de la tabla
const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "cuenta", label: "Cuenta", field: "cuenta" },
  { name: "telefono", label: "Telefono", field: "telefono" },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", sortable: false },
];

// Agregar Vendedor
function agregarVendedor() {
  fixed.value = true;
  text.value = "Agregar Vendedor";
  cambio.value = 0;
};

// Funcionamiento Agregar y Editar Vendedor
async function editarAgregarVendedor() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await VendedoresStore.postvendedor({
          cedula: cedula.value,
          nombre: nombre.value,
          cuenta: cuenta.value,
          clave: clave.value,
          telefono: telefono.value,
        });
        cancelShow();
        limpiar();
        greatMessage.value = "Vendedor Agregado";
        showGreat();
        obtenerInfo();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
    } else {
      let id = idVendedor.value;
      if (id) {
        try {
          showDefault();
          await VendedoresStore.putVendedor(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            cuenta: cuenta.value,
            clave: clave.value,
            telefono: telefono.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Vendedor Actualizado";
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
  };
};

// Limpiar Casillas
function limpiar() {
  cedula.value = "";
  nombre.value = "";
  cuenta.value = "";
  clave.value = "";
  telefono.value = "";
};

let idVendedor = ref("");
// Editar Vendedor
async function editarVendedor(id) {
  cambio.value = 1;
  const vendedorSeleccionado = vendedores.value.find((vendedor) => vendedor._id === id);
  if (vendedorSeleccionado) {
    idVendedor.value = String(vendedorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar vendedor";
    cedula.value = vendedorSeleccionado.cedula;
    nombre.value = vendedorSeleccionado.nombre;
    cuenta.value = vendedorSeleccionado.cuenta;
    clave.value = vendedorSeleccionado.clave;
    telefono.value = vendedorSeleccionado.telefono;
  };
};

// Inactivar Vendedor
async function InactivarVendedor(id) {
  try {
    showDefault();
    await VendedoresStore.putInactivarVendedor(id);
    cancelShow();
    greatMessage.value = "Vendedor Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

// Activar Vendedor
async function ActivarVendedor(id) {
  try {
    showDefault();
    await VendedoresStore.putActivarVendedor(id);
    cancelShow();
    greatMessage.value = "Vendedor Activado";
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

// Validar los campos
async function validar() {
  if ( !cedula.value && !nombre.value && !cuenta.value && !clave.value && !telefono.value) {
    badMessage.value = "Por favor rellene los campos";
  } else if (!cedula.value) {
    badMessage.value = "Ingrese la Cedula";
    showBad();
  } else if (!nombre.value) {
    badMessage.value = "Ingrese el Nombre";
    showBad();
  } else if (!cuenta.value) {
    badMessage.value = "Ingrese su cuenta";
    showBad();
  } else if (!clave.value) {  
    badMessage.value = "Ingrese su clave";
    showBad();
  } else if (!telefono.value) {  
    badMessage.value = "Ingrese el Telefono";
    showBad();
  } else if (telefono.value.length !== 10) {  
    badMessage.value = "El telefono debe tener 10 Digitos";
    showBad();
  } else {
    validacion.value = true;
  }
}

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

.error {
  display: flex;
  width: 100%;
  justify-content: center;
  color: red;
  font-size: 18px;
  text-align: center;
}
.b-b {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  gap: 5px;
}

.btnbuscar{
  width:170px;
  height:53px;
  position: relative;
  top: 7px;
}
.bbuscar{
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
