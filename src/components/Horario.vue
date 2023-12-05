<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button" />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 100vh" class="modal-body">
          <q-input type="text" v-model="hora_partida" label="Hora de partida" class="modal-input"  />
          <q-input type="text" v-model="hora_llegada" label="Hora de llegada" class="modal-input"  />
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarHorario()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="min-height: 90vh; width: 80%">
      <h1>Horarios</h1>

      <!-- <div class="b-b">
        <q-input class="bbuscar" v-model="searchhorario" label="Buscar por hora" style="width: 300px" @input="filtrarhora" />

        <q-btn color="primary" label="Buscar" @click="filtrarhora" class="btnbuscar" />
      </div> -->


      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarHorario()" />
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
            <q-btn color="white" text-color="black" label="🖋️" @click="editarHorario(props.row._id)" />
            <q-btn color="white" text-color="black" label="❌" @click="InactivarHorario(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="white" text-color="black" label="✅" @click="ActivarHorario(props.row._id)" v-else />
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
import { useHorarioStore } from "../stores/Horario.js";
import { useQuasar } from "quasar";

const horarioStore = useHorarioStore();
const $q = useQuasar();

let horarios = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let hora_partida = ref();
let hora_llegada = ref();
let cambio = ref(0);
let pagination = ref({rowsPerPage: 0});

// let searchhorario = ref("");

// function filtrarhora() {
//   const searchTerm = searchhorario.value.trim().toLowerCase();
//   if (!searchTerm) {
//     rows.value = horarios.value;
//   } else {
//     rows.value = horarios.value.filter((horarios) =>
//       horarios.hora_partida.toString().toLowerCase().includes(searchTerm)
//     );
//   }
// }

// Obtener Horarios
async function obtenerInfo() {
  try {
    await horarioStore.obtenerInfoHorarios();
    horarios.value = horarioStore.horarios;
    rows.value = horarioStore.horarios.slice().sort((a,b)=>{
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

// Datos tabla
const columns = [
  { name: "hora_partida", label: "Hora Partida", field: "hora_partida", sortable: true,},
  { name: "hora_llegada", label: "Hora Llegada", field: "hora_llegada", sortable: true,},
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
];

// Agregar Horario
function agregarHorario() {
  limpiar();
  fixed.value = true;
  text.value = "Agregar Horario";
  cambio.value = 0;
};

// Funcionamiento Agregar y Editar Horario
async function editarAgregarHorario() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await horarioStore.postHorario({
          hora_partida: hora_partida.value,
          hora_llegada: hora_llegada.value,
        });
  
        limpiar();
        greatMessage.value = "Horario Agregado";
        showGreat();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
      obtenerInfo();
    } else {
      let id = idHorario.value;
      if (id) {
        try {
          showDefault();
          await horarioStore.putEditarHorario(id, {
            hora_partida: hora_partida.value,
            hora_llegada: hora_llegada.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Horario Actualizado";
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
  hora_partida.value = "";
  hora_llegada.value = "";
};

let idHorario = ref("");

// Editar Horario
async function editarHorario(id) {
  cambio.value = 1;
  const horarioSelected = horarios.value.find((horario) => horario._id === id);
  if (horarioSelected) {
    idHorario.value = String(horarioSelected._id);
    fixed.value = true;
    text.value = "Editar Horario";
    hora_partida.value = horarioSelected.hora_partida;
    hora_llegada.value = horarioSelected.hora_llegada;
  };
};

// Inactivar Horario
async function InactivarHorario(id) {
  try {
    showDefault();
    await horarioStore.putInactivarHorario(id);
    cancelShow();
    greatMessage.value = "Horario Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};

// Activar Horarios
async function ActivarHorario(id) {
  try {
    showDefault();
    await horarioStore.putActivarHorario(id);
    cancelShow();
    greatMessage.value = "Horario Activado";
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

// Validacion de Campos
function validar() {
  const timeFormat = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!hora_partida.value || !hora_partida.value.trim()) {
    badMessage.value = "Ingrese la hora de Partida";
    hora_partida.value="";
    showBad();
  } else if (!hora_llegada.value || !hora_llegada.value.trim()) {
    badMessage.value = "Ingrese la hora de Llegada";
    hora_llegada.value = "";
    showBad();
  } else if ( !timeFormat.test(hora_partida.value) || !timeFormat.test(hora_llegada.value)) {
    badMessage.value ="Ingrese las horas en el formato correcto, por ejemplo, 12:00:00 o 09:00:00";
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
    font-size: 80px;
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