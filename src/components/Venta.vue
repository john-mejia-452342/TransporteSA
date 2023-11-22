<template>
  <div class="container-all">
    <div class="container">
      <div class="btn-generar">
        <q-btn color="primary" label="Generar Ticket" @click="mostrarModal" />
      </div>
      <!-- Modal -->
      <div class="container-cuestionario">
        <div class="container-wrapper">
          <div v-if="showmodal" class="column modal">
            <q-select v-model="ruta" :options="optionsRutas" label="Rutas" />
            <q-select v-model="bus" :options="optionsBuses" label="Buses" />
            <q-input v-model="fecha_departida" filled type="date" hint="Fecha para Partida" style="width: 300px" />
            <div class="options">
              <q-btn flat label="Cerrar" color="primary" @click="cerrarModal" />
              <q-btn flat label="Guardar 💾" color="primary" @click="generarTicketInfo()" />
            </div>
          </div>
        </div>
        <div class="column container-info">
          <div v-if="asientos.length" class="container-bus">
            <div v-for="i in asientos" :key="i" class="container-asientos">
              <button type="button" :value="i" @click="no_asiento = i"
                :style="{ backgroundColor: no_asiento === i ? 'red' : puestos.includes(i) ? 'red' : 'initial', cursor: puestos.includes(i) ? 'not-allowed' : 'pointer', }">
                {{ i }} 💺</button>
            </div>
          </div>
          <div v-if="showClienteDiv" class="column cliente">
            <div class="btns">
              <router-link class="link" to="/cliente"><q-btn class="bnt-bc" color="primary"
                  label="Agregar Cliente ➕"></q-btn></router-link>
              <q-btn class="bnt-bc" color="primary" label="Buscar Cliente 🔎" @click="buscarCliente()" />
            </div>

            <q-input class="label" type="number" standout v-model="cedula" label="Cedula" placeholder="Cedula del cliente"
              style="width: 300px" />
            <q-input class="label" standout v-model="nombre" label="Nombre" placeholder="Nombre del cliente"
              style="width: 300px" />
            <q-input class="label" type="number" standout v-model="telefono" label="Telefono"
              placeholder="Telefono del cliente" style="width: 300px" />
            <q-btn class="btn-c" color="primary" label="Generar Ticket 💾" @click="CrearTicket()" />

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

    
<script setup>
import { ref, onMounted, watch } from "vue";
import { useBusStore } from "../stores/Bus.js";
import { useRutaStore } from "../stores/Ruta.js";
import { useClienteStore } from "../stores/Cliente.js";
import { useTicketStore } from "../stores/Ticket.js";
import { useLoginStore } from "../stores/Login.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStrore = useClienteStore();
const ticketStore = useTicketStore();
const loginStore = useLoginStore();

let fixed = ref(false);

let ruta = ref("");
let bus = ref("");
let fecha_departida = ref("");
let no_asiento = ref(0);
let showClienteDiv = ref(false);
let showmodal = ref(false);
let cedula = ref();
let nombre = ref("");
let telefono = ref();
let buses = ref([]);
let rutas = ref([]);
let clientes = ref([]);
let asientos = ref([]);
let vendedor = ref([]);

let optionsRutas = ref([]);
let optionsBuses = ref([]);

// Mostrar Form Rutas Buses y Fecha de partidad
function mostrarModal() {
  obtenerRutas();
  fixed.value = true;
  showmodal.value = true;
};

// Cerrar Modal
function cerrarModal() {
  fixed.value = false;
  showmodal.value = false;
};

// Obtener Buses, Rutas y clientes 
async function obtenerInfo() {
  await busStore.obtenerInfoBuses();
  buses.value = busStore.buses;

  await rutaStore.obtenerInfoRutas();
  rutas.value = rutaStore.rutas;

  await clienteStrore.obtenerInfoClientes();
  clientes.value = clienteStrore.clientes;
};

// Obtener Opciones de Rutas 
async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    optionsRutas.value = rutaStore.rutas.map((ruta) => ({
      label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
      value: String(ruta._id),
    }));
  } catch (error) {
    console.log(error);
  };
};

// Obtener Opciones de buses
async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    optionsBuses.value = busStore.buses.map((bus) => ({
      label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  };
};

// Generar listado de Asientos disponibles
async function generarListaAsientos() {
  await validarAsientos();
  if (validacion.value) {
    const busSeleccionado = buses.value.find((b) => b._id === bus._rawValue.value);
    if (busSeleccionado) {
      const numeroAsientos = busSeleccionado.cantidad_asientos;
      const listaAsientos = [];
      for (let i = 1; i <= numeroAsientos; i++) {
        listaAsientos.push(Number(i));
      };
      asientos.value = listaAsientos;
    };
  };
};


let cliente_id = ref("");
let validacionCliente = ref(null)

// Buscar Clientes 
async function buscarCliente() {
  const clienteEncontrado = clientes.value.find((cliente) => cliente.cedula == cedula.value || cliente.nombre == nombre.value || cliente.telefono == telefono.value);
  if (clienteEncontrado) {
    cedula.value = clienteEncontrado.cedula;
    nombre.value = clienteEncontrado.nombre;
    telefono.value = clienteEncontrado.telefono;
    cliente_id.value = clienteEncontrado._id;
    greatMessage.value = "Cliente Encontrado";
    showGreat();
    validacionCliente.value = true;
  } else {
    badMessage.value = "No se encontro ningun cliente";
    showBad();
    validacionCliente.value = false;
  }
}

// Generar lista Asientos 
async function generarTicketInfo() {
  fixed.value = false;
  generarListaAsientos();
};

// Crear Ticket
async function CrearTicket() {
  if (validacionCliente.value == true) {
    try {
      showDefault();
      await ticketStore.postTicket({
        vendedor_id: String(vendedor.value._id),
        cliente_id: cliente_id.value,
        ruta_id: ruta._rawValue.value,
        bus_id: bus._rawValue.value,
        no_asiento: no_asiento.value,
        fecha_departida: fecha_departida.value,
      });
      cancelShow();
      greatMessage.value = "Ticket Agregado";
      showGreat();
      fixed.value = false;
      showmodal.value = false;
      asientos.value = [];
      showClienteDiv = false;
    } catch (error) {
      cancelShow();
      badMessage.value = error.response.data.error.errors[0].msg;
      showBad();
    };
  } else {
    cancelShow();
    badMessage.value = "Agrega un Cliente"
    showBad();
  };
};

// Obtener Vendedor
async function obtenerVendedor() {
  vendedor.value = loginStore.vendedor;
};

let puestos = ref([]);
// Buscar Asientos Disponibles
async function validarAsientos() {
  validar();
  if (validacion.value == true) {
    try {
      const id_ruta = ruta._rawValue.value;
      const id_bus = bus._rawValue.value;
      const fecha = fecha_departida.value;
      showDefault();
      await ticketStore.buscarTickets(id_ruta, id_bus, fecha);
      puestos.value = ticketStore.puestos;
      cancelShow();
      greatMessage.value = "Listado Puestos";
      showGreat();
    } catch (error) {
      cancelShow();
      badMessage.value = error.response.data.error.errors[0].msg;
      showBad();
    };
  };
};

watch(ruta, () => {
  obtenerBuses();
});

watch(no_asiento, () => {
  showClienteDiv = true;
});

onMounted(async () => {
  obtenerInfo();
  obtenerVendedor();
});

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
const cancelShow = () => {
  if (notification) {
    notification();
  };
};

let notification = ref(null);

let validacion = ref(false);

async function validar() {
  if (!ruta.value && !bus.value && !fecha_departida.value) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!ruta.value) {
    badMessage.value = "Seleccione la ruta";
    showBad();
  } else if (!bus.value) {
    badMessage.value = "Seleccione el bus";
    showBad();
  } else if (!fecha_departida.value) {
    badMessage.value = "Seleccione la fecha de partida";
    showBad();
  } else {
    validacion.value = true;
  };
};
</script>
  
<style scoped>
.container-all {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.container-wrapper {
  display: flex;
  max-width: 1200px;
}

.column {
  flex: 1;
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .container-wrapper {
    flex-direction: column;
  }

  .column {
    width: 100%;
  }
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-generar {
  width: 100%;
  margin-top: 25px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
  height: 50px;
}

.container-info {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.container-bus {
  position: relative;
  left: 100px;
  height: auto;
  width: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
}

.container-asientos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.container-asientos button {
  width: 70px;
  height: 70px;
  margin: 5px;
  font-size: 6mm;
  border-radius: 5px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border: solid rgb(0, 67, 252);
}

.cliente {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
}

.cliente input {
  margin: 4px;
}

.bnt-bc {
  margin-bottom: 2px;
}

.btn-c {
  margin-top: 10px;
}

.label {
  background-color: rgba(231, 222, 222, 0.329);
  border-radius: 5px;
  border: solid gray 1px;
  margin: 1px;
}

.modal {
  border: solid rgb(0, 0, 0);
  background-color: white;
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-direction: column;
  height: 362px;
  position: relative;
  left: 50px;
}

.options {
  display: flex;
  justify-content: space-around;
}

.btns {
  width: 40%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.container-cuestionario {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}</style>