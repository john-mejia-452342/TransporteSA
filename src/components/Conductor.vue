<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section class="row items-center q-pb-none" style="color: black">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input type="text" v-model="cedula" label="cedula" style="width: 300px"/>
          <q-input type="text" v-model="nombre" label="Nombre" style="width: 300px" />
          <!-- <q-input type="text" v-model="id_bus" label="Bus" style="width: 300px" /> -->
          
            <div class="q-pa" style="width: 300px">
                <div class="q-gutter-md">
                    <q-select v-model="bus" :options="options" label="Bus" /> 
                </div>
            </div>

          <q-input type="text" v-model="experiencia" label="Experienca" style="width: 300px" />
          <q-input type="text" v-model="telefono" label="Telefono" style="width: 300px" />
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarConductor()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="container-table">
      <h1>Conductores</h1>
      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar ➕" @click="agregarConductor()" />
      </div>
      <q-table title="Conductores" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green"
              >Activo</label
            >
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarConductor(props.row._id)" />
            <q-btn color="white" text-color="black" label="❌" @click="InactivarConductor(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn color="white" text-color="black" label="✅" @click="ActivarConductor(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/Bus.js";
import { useConductorStore } from "../stores/Conductor.js"

const busStore = useBusStore();
const conductorStore = useConductorStore()

let conductores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let options = ref([])
let text = ref("");
let cedula = ref("");
let nombre = ref();
let bus = ref("")
let experiencia = ref("");
let telefono = ref("");
let cambio = ref(0);

// const cantidad_asientos = ref("");
// const empresa_asignada = ref("");

async function obtenerInfo() {
  try {
    await conductorStore.obtenerInfoConductores();
    conductores.value = conductorStore.conductores;
    rows.value = conductorStore.conductores;
  } catch (error) {
    console.log(error);
  }
}
async function obtenerBuses() {
    try {
        await busStore.obtenerInfoBuses();
        options.value = busStore.buses.map((bus) => ({
            label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
            value: String(bus._id)
        }));
    } catch (error) {
        console.log(error);
    }
}



onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true,},
  { name: "id_bus", label: "Bus", field: "id_bus",},
  { name: "experiencia", label: "Experiencia", field: "experiencia",},
  { name: "telefono", label: "Telefono", field: "telefono",},
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
];

function agregarConductor() {
    obtenerBuses()
    fixed.value = true;
    text.value = "Agregar Conductor";
    cambio.value = 0;
}

async function editarAgregarConductor() {
  if (cambio.value === 0) {
    await busStore.postBus({
      placa: placa.value,
      nombre: nombre.value,
      bus: bus.value,
      experiencia: experiencia.value,
      telefono: telefono.value
    });
    limpiar();
    obtenerInfo();
  } else {
    let id = idConductor.value;
    if (id) {
      await conductorStore.putEditarBus(id, {
        cedula: cedula.value,
        nombre: nombre.value,
        bus: bus.value,
        experiencia: experiencia.value,
        telefono: telefono.value
      });

      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

function limpiar() {
  cedula.value = "";
  nombre.value = "";
  bus.value = "";
  experiencia.value = "";
  telefono.value = ""
}

let idConductor = ref("");
async function EditarConductor(id) {
    obtenerBuses()
  cambio.value = 1;
  const conductorSeleccionado = conductores.value.find((conductor) => conductor._id === id);
  if (conductorSeleccionado) {
    idConductor.value = String(conductorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Conductor";
    cedula.value = conductorSeleccionado.cedula;
    nombre.value = conductorSeleccionado.nombre;
    bus.value = conductorSeleccionado.id_bus;
    experiencia.value = conductorSeleccionado.experiencia;
    telefono.value = conductorSeleccionado.telefono;
  }
}

async function InactivarBus(id) {
  await busStore.putInactivarBus(id);
  obtenerInfo();
}

async function ActivarBus(id) {
  await busStore.putActivarBus(id);
  obtenerInfo();
}
</script>
  
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Gabarito&display=swap");
.container {
  display: flex;
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
</style>