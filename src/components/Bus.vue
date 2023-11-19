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

        <q-card-section style="max-height: 50vh" class="modal-body">
          <q-input type="text" v-model="placa" label="Placa" class="modal-input" />
          <q-input type="number" v-model="numero_bus" label="Número de Bus" class="modal-input" />
          <q-input type="text" v-model="cantidad_asientos" label="Cantidad de Asientos" class="modal-input" />
          <q-input type="text" v-model="empresa_asignada" label="Empresa Asignada" class="modal-input" />
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select v-model="conductor" :options="options" label="Conductores"  />
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <div class="error">{{ errorMessage }}</div>
        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button"/>
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()" class="action-button" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%">
      <h1>Buses</h1>


      <div class="b-b">
        <q-input class="bbuscar" v-model="buscarplaca" label="Buscar por Placa" style="width: 300px"
          @input="filtrarbuses" />
        <q-btn color="primary" label="Buscar" @click="filtrarbuses" class="btnbuscar" />
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
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
            <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else />
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

function filtrarbuses() {
  if (buscarplaca.value.trim() === "") {
    rows.value = buses.value; // Mostrar todos los buses si la búsqueda está vacía
  } else {
    rows.value = buses.value.filter((buses) =>
      buses.placa.toString().includes(buscarplaca.value.toString())
    );
  }
}
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    console.log(busStore.buses);
    buses.value = busStore.buses;
    rows.value = busStore.buses;
  } catch (error) {
    console.log(error);
  }
}

// watch(ruta, (newValue, oldValue) => {
//   console.log(ruta._rawValue.value);
// });

async function obtenerConductores() {
  try {
    await conductorStore.obtenerInfoConductores();
    console.log(conductorStore.conductores);
    options.value = conductorStore.conductores.map((conductor) => ({
      label: `${conductor.nombre} - ${conductor.cedula} - ${conductor.telefono}`,
      value: String(conductor._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "placa", label: "Placa", field: "placa", sortable: true },
  {
    name: "numero_bus",
    label: "Número de Bus",
    field: "numero_bus",
    sortable: true,
  },
  {
    name: "cantidad_asientos",
    label: "Cantidad de Asientos",
    field: "cantidad_asientos",
  },
  {
    name: "empresa_asignada",
    label: "Empresa Asignada",
    field: "empresa_asignada",
  },
  {
    name: "nombre",
    label: "Nombre Conductor",
    field: (row) => row.conductor_id.nombre,
  },
  {
    name: "cedula",
    label: "Cedula Conductor",
    field: (row) => row.conductor_id.cedula,
  },
  {
    name: "telefono",
    label: "Telefono Conductor",
    field: (row) => row.conductor_id.telefono,
  },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
  },
];

function agregarBus() {
  obtenerConductores();
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0;
}

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
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Bus Agregado",
          timeout: 2000,
          type: "positive",
        });
        obtenerInfo();
      } catch (error) {
        if (notification) {
          notification();
        }
        $q.notify({
          spinner: false,
          message: `${error.response.data.error.errors[0].msg}`,
          timeout: 2000,
          type: "negative",
        });
      }
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
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Bus Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          if (notification) {
            notification();
          }
          $q.notify({
            spinner: false,
            message: `${error.response.data.error.errors[0].msg}`,
            timeout: 2000,
            type: "negative",
          });
        }
      }
    }
    validacion.value = false;
  }
}

function limpiar() {
  placa.value = "";
  numero_bus.value = "";
  cantidad_asientos.value = "";
  empresa_asignada.value = "";
  conductor.value = "";
}

let idBus = ref("");
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
  }
}

async function InactivarBus(id) {
  try {
    showDefault();
    await busStore.putInactivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Inactivado",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: "negative",
    });
  }
}

async function ActivarBus(id) {
  try {
    showDefault();
    await busStore.putActivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Activado",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: "negative",
    });
  }
}

let errorMessage = ref("");

const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};
let notification = ref(null);

let validacion = ref(false);

async function validar() {
  if (
    !placa.value &&
    !numero_bus.value &&
    !cantidad_asientos.value &&
    !empresa_asignada.value &&
    !conductor.value
  ) {
    errorMessage.value = "Por favor rellene los campos";
  } else if (!placa.value) {
    errorMessage.value = "Ingrese la Placa";
  } else if (!numero_bus.value) {
    errorMessage.value = "Ingrese el numero del bus";
  } else if (!cantidad_asientos.value) {
    errorMessage.value = "Ingrese la cantidad de asientos";
  } else if (!empresa_asignada.value) {
    errorMessage.value = "Ingrese el nombre de la empresa";
  } else if (!conductor.value) {
    errorMessage.value = "Seleccione un Conductor";
  } else {
    errorMessage.value = "";
    validacion.value = true;
  }
}
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
