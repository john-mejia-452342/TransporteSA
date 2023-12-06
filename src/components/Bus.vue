<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-btn icon="close" flat round dense v-close-popup class="close-button" />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 100vh" class="modal-body">
          <q-input type="text" v-model="placa" label="Placa" class="modal-input" />
          <q-input type="number" v-model="numero_bus" label="Número de Bus" class="modal-input" />
          <q-input type="number" v-model="cantidad_asientos" label="Cantidad de Asientos" class="modal-input" />
          <q-input type="text" v-model="empresa_asignada" label="Empresa Asignada" class="modal-input" />
          <div class="q-pa modal-input">
            <div class="q-gutter">
              <q-select v-model="conductor" :options="options" label="Conductores" />
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" />
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()" class="action-button" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Tabla -->
    <div class="container-table" style="min-height: 90vh; width: 80%">
      <h1>Buses</h1>

      <!-- barra de busqueda -->
      <div class="b-b">
        <q-input class="bbuscar" v-model.lazy="buscarplaca" label="Buscar por Placa" style="width: 300px" />
      </div>

      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarBus()" />
      </div>
      <div class="q-pa-md">
        <q-table class="my-sticky-virtscroll-table" virtual-scroll flat bordered v-model:pagination="pagination"
          :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48" row-key="index" :rows="rows"
          :columns="columns" style="height: 52vh;">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
              <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)"
                v-if="props.row.estado == 1" />
              <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else />
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
let pagination = ref({ rowsPerPage: 0 });




function filtrarbuses() {
  if (buscarplaca.value.trim() === "") {
    rows.value = buses.value;
  } else {
    const searchTerm = buscarplaca.value.trim().toLowerCase();
    rows.value = buses.value.filter((bus) =>
      bus.placa.toString().toLowerCase().includes(searchTerm)
    );
  }
}

// Watcher para cambios en buscarplaca
watch(() => buscarplaca.value, () => {
  filtrarbuses();
});

// Watcher para cambios en buses
watch(() => buses.value, (newbuses) => {
  rows.value = newbuses;
});

// Llamar a obtenerInfo al montar el componente
onMounted(() => {
  obtenerInfo();
});




let cambio = ref(0);

// Obtener Buses
async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;
    rows.value = busStore.buses.slice().sort((a, b) => {
      const dateA = new Date(a.createAT);
      const dateB = new Date(b.createAT);
      return dateB - dateA;
    });
  } catch (error) {
    console.log(error);
  }
}

// Obtener opciones de Conductores
async function obtenerConductores() {
  try {
    await conductorStore.obtenerInfoConductores();
    const conductoresActivos = conductorStore.conductores.filter(conductor => conductor.estado === true);

    options.value = conductoresActivos.map((conductor) => ({
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
  { name: "placa", label: "Placa", field: "placa", sortable: true, align: "left" },
  { name: "numero_bus", label: "Número de Bus", field: "numero_bus", sortable: true, align: "left"},
  { name: "cantidad_asientos", label: "Cantidad de Asientos", field: "cantidad_asientos", align: "left" },
  { name: "empresa_asignada", label: "Empresa Asignada", field: "empresa_asignada", align: "left"},
  { name: "nombre", label: "Nombre Conductor", field: (row) => row.conductor_id.nombre, align: "left"},
  { name: "cedula", label: "Cedula Conductor", field: (row) => row.conductor_id.cedula, align: "left" },
  { name: "telefono", label: "Telefono Conductor", field: (row) => row.conductor_id.telefono, align: "left"},
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left"},
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),align: "center" },
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
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
        console.log(error);
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
          console.log(error);
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
      label: `${busSeleccionado.conductor_id.nombre} - ${busSeleccionado.conductor_id.telefono} - ${busSeleccionado.conductor_id.cedula}`,
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
    timeout: 3000,
    type: "positive",
  });
};

// Notificacion Mala
const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 3000,
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
const cancelShow = () => {
  if (notification) {
    notification();
  };
};

let notification = ref(null);
let validacion = ref(false);

// Validar Campos 
function validar() {
  placa.value = placa.value.trim().toUpperCase();
  empresa_asignada.value = empresa_asignada.value.trim();

  const placaRegex = /^[A-Z]{3}\d{3}$/;

  if (!placa.value) {
    badMessage.value = "Ingrese la Placa";
    showBad();
  } else if (!placaRegex.test(placa.value)) {
    badMessage.value = "La Placa debe contener tres letras en mayúscula seguidas de tres dígitos.";
    showBad();
  } else if (!numero_bus.value) {
    badMessage.value = "Ingrese el número del bus";
    showBad();
  } else if (numero_bus.value < 0) {
    badMessage.value = "El número del bus no puede ser negativo";
    showBad();
  } else if (!cantidad_asientos.value) {
    badMessage.value = "Ingrese la cantidad de asientos";
    showBad();
  } else if (cantidad_asientos.value < 0) {
    badMessage.value = "La cantidad de asientos no puede ser negativa";
    showBad();
  } else if (!empresa_asignada.value) {
    badMessage.value = "Ingrese el nombre de la empresa";
    showBad();
  } else if (!conductor.value) {
    badMessage.value = "Seleccione un Conductor";
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


@media (max-width: 917px) {
  .btn-agregar {
    margin: 10px;
    height: 35px;
  }
}

@media (max-width: 500px) {
  .container-table h1 {
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