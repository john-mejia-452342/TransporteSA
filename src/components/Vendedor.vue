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

        <q-card-section style="max-height: 100vh" class="modal-body">
          <q-input type="number" v-model="cedula" label="Cedula" class="modal-input"/>
          <q-input type="text" v-model="nombre" label="Nombre" class="modal-input"/>
          <q-input type="text" v-model="cuenta" label="Usuario" class="modal-input"/>
          <q-input type="text" v-model="clave" label="Clave" class="modal-input" v-if="cambio == 0"/>
          <q-input type="number" v-model="telefono" label="Telefono" class="modal-input"/>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" @click="limpiar()"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarVendedor()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="min-height: 90vh; width: 80%">
      <h1>Vendedor</h1>
      <div class="b-b">
        <q-input class="bbuscar" v-model="searchCedula" label="Buscar por Cedula" style="width: 400px" @input="filtrarvendedores"/>
        <q-btn color="primary" label="Buscar" @click="filtrarvendedores" class="btnbuscar"/>
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarVendedor()"/>
      </div>
      <div class="q-pa-md">
        <q-table
          class="my-sticky-virtscroll-table"
          virtual-scroll
          flat bordered
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :virtual-scroll-sticky-size-start="48"
          row-key="index"
          :rows="rows"
          :columns="columns"
          style="height: 52vh;"
        >
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
let pagination = ref({rowsPerPage: 0});


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
    rows.value = VendedoresStore.vendedores.slice().sort((a,b)=>{
      const dateA = new Date(a.createAT);
      const dateB = new Date(b.createAT);
      return dateB - dateA;
    });
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
  const cedulaRegex = /^[0-9]+$/;
  const telefonoRegex = /^[0-9]+$/;
  
  if (!cedula.value) {
    badMessage.value = "Ingrese la Cedula";
    showBad();
  }else if(!cedulaRegex.test(cedula.value) || parseInt(cedula.value)<0){
    badMessage.value = "La cedula debe contener solo dígitos positivos";
  } else if (!nombre.value || !nombre.value.trim()) {
    badMessage.value = "Ingrese el Nombre";
    nombre.value = "";
    showBad();
  } else if (!cuenta.value || !cuenta.value.trim()) {
    badMessage.value = "Ingrese su Usuario";
    cuenta.value = "";
    showBad();
  } else if (!clave.value || !clave.value.trim()) {  
    badMessage.value = "Ingrese su clave";
    clave.value = "";
    showBad();
  } else if (!telefono.value) {  
    badMessage.value = "Ingrese el Telefono";
    showBad();
  } else if (!telefonoRegex.test(telefono.value) || telefono.value.length !== 10) {  
    badMessage.value = "El telefono debe tener 10 dígitos y ser positivo";
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
  max-width: 90%;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;  
  justify-content: flex-end;
  height: 35px;
}

.b-b {
  display: flex;
  flex-direction: row;
  justify-content: center;
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


@media (max-width: 917px){
  .btn-agregar{
    margin: 10px;
    height: 35px;
  }
}

@media (max-width: 500px){
  .container-table h1{
    font-size: 60px;
  }
}
</style>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #00b4ff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>