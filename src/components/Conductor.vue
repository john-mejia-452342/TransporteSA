<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button"  />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 100vh" class="modal-body">
          <q-input type="number" v-model="cedula" label="Cedula" class="modal-input"/>
          <q-input type="text" v-model="nombre" label="Nombre" class="modal-input"/>
          <q-input type="number" v-model="experiencia" label="Experiencia" class="modal-input" />
          <q-input type="number" v-model="telefono" label="Telefono" class="modal-input"/>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarConductor()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="min-height: 90vh; width: 80%">
      <h1>Conductores</h1>

        <!-- barra de busqueda -->
        <div class="b-b">
        <q-input class="bbuscar" v-model.lazy="searchCedula" label="Buscar por Cedula" style="width: 300px" />
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarConductor()" />
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
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarConductor(props.row._id)" />
            <q-btn color="white" text-color="black" label="❌" @click="InactivarConductor(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="white" text-color="black" label="✅" @click="ActivarConductor(props.row._id)" v-else />
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
import { useConductorStore } from "../stores/Conductor.js";
import { useQuasar } from "quasar";

const conductorStore = useConductorStore();
const $q = useQuasar();

let conductores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let bus = ref("");
let experiencia = ref("");
let telefono = ref("");
let cambio = ref(0);
let searchCedula = ref("");
let pagination = ref({rowsPerPage: 0});

function filtrarconductores() {
  if (searchCedula.value.trim() === "") {
    rows.value = conductores.value;
  } else {
    const searchTerm = searchCedula.value.trim().toLowerCase();
    rows.value = conductores.value.filter((conductor) =>
      conductor.cedula.toString().toLowerCase().includes(searchTerm)
    );
  }
}

// Watcher para cambios en searchCedula
watch(() => searchCedula.value, () => {
  filtrarconductores();
});

// Watcher para cambios en conductores
watch(() => conductores.value, (newconductores) => {
  rows.value = newconductores;
});

// Llamar a obtenerInfo al montar el componente
onMounted(() => {
  obtenerInfo();
});
// Obtener Conductores
async function obtenerInfo() {
  try {
    await conductorStore.obtenerInfoConductores();
    conductores.value = conductorStore.conductores;
    rows.value = conductorStore.conductores.slice().sort((a,b)=>{
      const dateA = new Date(a.createAT);
      const dateB = new Date(b.createAT);
      return dateB - dateA;
    })
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
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align: "left"},
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true ,align: "left"},
  { name: "experiencia", label: "Experiencia", field: "experiencia",align: "left" },
  { name: "telefono", label: "Telefono", field: "telefono",align: "left" },
  { name: "estado", label: "Estado", field: "estado", sortable: true,align: "left"},
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),align: "center"},
    { name: "opciones", label: "Opciones", sortable: false,align: "center" },
];

// Agregar Conductor
function agregarConductor() {
  fixed.value = true;
  text.value = "Agregar Conductor";
  cambio.value = 0;
};

// Funcionamiento Agregar y Editar
async function editarAgregarConductor() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await conductorStore.postConductor({
          cedula: cedula.value,
          nombre: nombre.value,
          experiencia: experiencia.value,
          telefono: telefono.value,
        });
        cancelShow();
        limpiar();
        greatMessage.value = "Conductor Agregado";
        showGreat();
        obtenerInfo();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
    } else {
      let id = idConductor.value;
      if (id) {
        try {
          showDefault();
          await conductorStore.putEditarConductor(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            experiencia: experiencia.value,
            telefono: telefono.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Conductor Actualizado";
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
  experiencia.value = "";
  telefono.value = "";
};

let idConductor = ref("");

// Editar Conductor 
async function EditarConductor(id) {
  cambio.value = 1;
  const conductorSeleccionado = conductores.value.find((conductor) => conductor._id === id);
  if (conductorSeleccionado) {
    idConductor.value = String(conductorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Conductor";
    cedula.value = conductorSeleccionado.cedula;
    nombre.value = conductorSeleccionado.nombre;
    experiencia.value = conductorSeleccionado.experiencia;
    telefono.value = conductorSeleccionado.telefono;
  };
};

// Inactivar Conductor
async function InactivarConductor(id) {
  try {
    showDefault();
    await conductorStore.putInactivarConductor(id);
    cancelShow();
    greatMessage.value = "Conductor Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

// Activar Conductor
async function ActivarConductor(id) {
  try {
    showDefault();
    await conductorStore.putActivarConductor(id);
    cancelShow();
    greatMessage.value = "Conductor Activado";
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

// Validacion de campos
function validar() {
  const cedulaRegex = /^[0-9]+$/;
  const telefonoRegex = /^[0-9]+$/;

  if (!cedula.value) {
    badMessage.value = "Ingrese la Cedula";
    showBad();
  }else if(!cedulaRegex.test(cedula.value) || parseInt(cedula.value)<0){
    badMessage.value = "La cedula debe contener solo dígitos positivos";
  }else if (!nombre.value || !nombre.value.trim()) {
    badMessage.value = "Ingrese el Nombre";
    nombre.value = ""
    showBad();
  } else if(!experiencia.value || experiencia.value < 0) {
    badMessage.value = "Ingrese un número positivo mayor que cero";
    experiencia.value = "";
    showBad();
} else if (!telefono.value) {
    badMessage.value = "Ingrese el Telefono";
    showBad();
  } else if (!telefonoRegex.test(telefono.value) || telefono.value.length !== 10) {
    badMessage.value = "El telefono debe tener 10 dígitos y ser positivo";
    showBad();
  } else {
    validacion.value = true;
  };
};

// Limpiar el modal cuando se cierre mal
watch(fixed, () => {
  if (fixed.value == false) {
    if (cambio.value === 1) {
      limpiar();
    };
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
  @media (max-width: 917px){
    .btn-agregar{
      margin: 10px;
      height: 35px;
    }
  }
  
  @media (max-width: 625px){
    .container-table h1{
      font-size: 60px;
    }
  }
  @media (max-width: 430px){
    .container-table h1{
      font-size: 40px;
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