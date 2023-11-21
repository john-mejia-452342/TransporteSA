<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-btn icon="close" flat round dense v-close-popup class="close-button"/>
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="modal-body">
          <q-input type="text" v-model="placa" label="Placa" class="modal-input"/>
          <q-input type="number" v-model="numero_bus" label="Número de Bus" class="modal-input"/>
          <q-input type="text" v-model="cantidad_asientos" label="Cantidad de Asientos" class="modal-input"/>
          <q-input type="text" v-model="empresa_asignada" label="Empresa Asignada" class="modal-input"/>
          <div class="q-pa modal-input" >
            <div class="q-gutter">
              <q-select v-model="conductor" :options="options" label="Conductores" />
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()" class="action-button"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%">
      <h1>Buses</h1>
      <div class="b-b">
        <q-input class="bbuscar" v-model="buscarplaca" label="Buscar por Placa" style="width: 300px" @input="filtrarbuses"/>
        <q-btn color="primary" label="Buscar" @click="filtrarbuses" class="btnbuscar"/>
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarBus()" />
      </div>
      <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)"/>
            <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)" v-if="props.row.estado == 1"/>
            <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else/>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/Bus.js";
import { useConductorStore } from "../stores/Conductor.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
const busStore = useBusStore();
const conductorStore = useConductorStore();

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let conductor = ref("");
let options = ref([]);
let placa = ref("");
let numero_bus = ref();
let cantidad_asientos = ref("");
let empresa_asignada = ref("");
let buscarplaca = ref("");

// Filtro 
function filtrarbuses() {
  if (buscarplaca.value.trim() === "") {
    rows.value = buses.value; 
  } else {
    rows.value = buses.value.filter((buses) =>buses.placa.toString().includes(buscarplaca.value.toString()));
  };
};

let cambio = ref(0);

// Obtener Buses
async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;
    rows.value = busStore.buses;
  } catch (error) {
    console.log(error);
  };
};

// Obtener opciones de Conductores
async function obtenerConductores() {
  try {
    await conductorStore.obtenerInfoConductores();
    options.value = conductorStore.conductores.map((conductor) => ({
      label: `${conductor.nombre} - ${conductor.cedula} - ${conductor.telefono}`,
      value: String(conductor._id),
    }));
  } catch (error) {
    console.log(error);
  };
};
// Primera accion
onMounted(async () => {
  obtenerInfo();
});

// Datos Tabla
const columns = [
  { name: "placa", label: "Placa", field: "placa", sortable: true },
  { name: "numero_bus", label: "Número de Bus", field: "numero_bus", sortable: true,},
  { name: "cantidad_asientos", label: "Cantidad de Asientos", field: "cantidad_asientos",},
  { name: "empresa_asignada", label: "Empresa Asignada", field: "empresa_asignada",},
  { name: "nombre", label: "Nombre Conductor", field: (row) => row.conductor_id.nombre,},
  { name: "cedula", label: "Cedula Conductor", field: (row) => row.conductor_id.cedula,},
  { name: "telefono", label: "Telefono Conductor", field: (row) => row.conductor_id.telefono,},
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
];

// Agregar Buses
function agregarBus() {
  obtenerConductores();
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0;
};

// Funcionamiento Agregar y Editar Buses
async function editarAgregarBus() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await busStore.postBus({
          placa: placa.value,
          numero_bus: numero_bus.value,
          cantidad_asientos: cantidad_asientos.value,
          empresa_asignada: empresa_asignada.value,
          conductor_id: conductor._rawValue.value,
        });
        cancelShow();
        limpiar();
        greatMessage.value = "Bus agregado";
        showGreat();
        obtenerInfo();
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      };
    } else {
      let id = idBus.value;
      if (id) {
        try {
          showDefault();
          await busStore.putEditarBus(id, {
            placa: placa.value,
            numero_bus: numero_bus.value,
            cantidad_asientos: cantidad_asientos.value,
            empresa_asignada: empresa_asignada.value,
            conductor_id: conductor._rawValue.value,
          });
          cancelShow();
          limpiar();
          greatMessage.value = "Bus Actualizado";
          showGreat();
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          cancelShow();
          badMessage.value = error.response.data.error.errors[0].msg
          showBad();
        };
      };
    };
    validacion.value = false;
  };
};

// Limpiar Espacios
function limpiar() {
  placa.value = "";
  numero_bus.value = "";
  cantidad_asientos.value = "";
  empresa_asignada.value = "";
  conductor.value = "";
};

let idBus = ref("");

// Editar Bus
async function EditarBus(id) {
  obtenerConductores();
  cambio.value = 1;
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
    idBus.value = String(busSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Bus";
    placa.value = busSeleccionado.placa;
    numero_bus.value = busSeleccionado.numero_bus;
    cantidad_asientos.value = busSeleccionado.cantidad_asientos;
    empresa_asignada.value = busSeleccionado.empresa_asignada;
    conductor.value = {
      label: `${busSeleccionado.conductor_id} - ${busSeleccionado.conductor_id.telefono} - ${busSeleccionado.conductor_id.cedula}`,
      value: String(busSeleccionado.conductor_id._id),
    };
  };
};

// Inactivar Bus
async function InactivarBus(id) {
  try {
    showDefault();
    await busStore.putInactivarBus(id);
    cancelShow();
    greatMessage.value = "Bus Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg
    showBad();
  };
};

// Activar Bus
async function ActivarBus(id) {
  try {
    showDefault();
    await busStore.putActivarBus(id);
    cancelShow();
    greatMessage.value = "Bus Activado"
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg
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

let notification = ref(null);
let validacion = ref(false);

// Validar Campos 
function validar() {
  if ( !placa.value && !numero_bus.value && !cantidad_asientos.value && !empresa_asignada.value && !conductor.value) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!placa.value) {
    badMessage.value = "Ingrese la Placa";
    showBad();
  } else if (!numero_bus.value) {
    badMessage.value = "Ingrese el numero del bus";
    showBad();
  } else if (!cantidad_asientos.value) {
    badMessage.value = "Ingrese la cantidad de asientos";
    showBad();
  } else if (!empresa_asignada.value) {
    badMessage.value = "Ingrese el nombre de la empresa";
    showBad();
  } else if (!conductor.value) {
    badMessage.value = "Seleccione un Conductor";
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
