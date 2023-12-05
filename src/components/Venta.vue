<template>
  <div class="container-all">
    <div class="container-venta">
      <div class="btn-generar">
        <q-btn color="primary" label="Generar Ticket" @click="mostrarModal" />
      </div>
      <!-- Modal -->
      <div class="container-cuestionario">
        <div v-if="rutaBusFecha" class="container-rutaBusFecha">
          <div class="rutaBusFecha">
            <q-select v-model="ruta" :options="optionsRutas" label="Rutas"  style="width: 300px;"/>
            <q-select v-model="bus" :options="optionsBuses" label="Buses" style="width: 300px;" />
            <q-input v-model="fecha_departida" filled type="date" hint="Fecha para Partida" style="width: 300px" :min="getFechaActual()"/>
          </div>
          <div class="options">
            <q-btn label="Cerrar" color="primary" @click="cerrarModal" />
            <q-btn label="Buscar" color="primary" @click="generarTicketInfo()" />
          </div>
        </div>
      </div>
        
 
      <div class="busCliente">
        <div v-if="asientos.length" class="container-bus">
          <div v-for="i in asientos" :key="i" class="container-asientos">
            <button
              type="button"
              :value="i.numero"
              @click="!i.ocupado && (no_asiento = i.numero)"
              :style="{
                backgroundColor: no_asiento === i.numero ? 'red' : i.ocupado ? 'red' : 'initial',
                cursor: i.ocupado ? 'not-allowed' : 'pointer',
              }"
            >
              {{ i.numero }} 💺
            </button>
          </div>
        </div>
        <div v-if="showClienteDiv" class="cliente">
          
            <h2 v-if="no_asiento" class="asientoNumero" style="padding: 0;margin: 8px; font-family: 'Kanit', sans-serif;" >Asiento N°{{no_asiento}}</h2>

            <div class="btns">
              <q-btn class="bnt-bc" color="primary" label="Agregar Cliente ➕" @click="agregarCliente"/>
              <q-btn class="bnt-bc" color="primary" label="Buscar Cliente 🔎" @click="buscarCliente()" />
            </div>
              <q-input filled v-model="cedula" label="Cedula del Cliente" type="number" style="width: 300px"/>
              <q-input filled v-model="nombre" label="Nombre del Cliente" type="text" style="width: 300px"/>
              <q-input filled v-model="telefono" label="Telefono del Cliente" type="number" style="width: 300px"/>
              <q-btn class="btn-c" color="secondary" label="Generar Ticket 💾" @click="CrearTicket()" />
              <q-btn class="btn-c" color="primary" label="Nueva Venta ➕" @click="nuevaVenta()" />
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
const clienteStore = useClienteStore();
const ticketStore = useTicketStore();
const loginStore = useLoginStore();

let fixed = ref(false);

let ruta = ref("");
let bus = ref("");
let fecha_departida = ref("");
let no_asiento = ref(0);
let showClienteDiv = ref(false);
let rutaBusFecha = ref(false);
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
  rutaBusFecha.value = true;
};

// Cerrar Modal
function cerrarModal() {
  fixed.value = false;
  rutaBusFecha.value = false;
};

// Obtener Buses, Rutas y clientes 
async function obtenerInfo() {
  await busStore.obtenerInfoBuses();
  buses.value = busStore.buses;

  await rutaStore.obtenerInfoRutas();
  rutas.value = rutaStore.rutas;

  await clienteStore.obtenerInfoClientes();
  clientes.value = clienteStore.clientes;
};

// Obtener Opciones de Rutas 
async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    const rutasActivas = rutaStore.rutas.filter(ruta => ruta.estado === true);
    optionsRutas.value = rutasActivas.map((ruta) => ({
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
    const busesActivos = busStore.buses.filter(bus => bus.estado === true);
    optionsBuses.value = busesActivos.map((bus) => ({
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
        const isOcupado = puestos.value.includes(i);
        listaAsientos.push({ numero: i, ocupado: isOcupado });
      }
      asientos.value = listaAsientos;
    }
  }
}


let cliente_id = ref("");
let validacionCliente = ref(null)

// Buscar Clientes 
async function buscarCliente() {
  const clienteEncontrado = clientes.value.find((cliente) => cliente.cedula == cedula.value);

  if (clienteEncontrado) {
    if (clienteEncontrado.estado === true) {
      cedula.value = clienteEncontrado.cedula;
      nombre.value = clienteEncontrado.nombre;
      telefono.value = clienteEncontrado.telefono;
      cliente_id.value = clienteEncontrado._id;
      greatMessage.value = "Cliente Encontrado";
      showGreat();
      validacionCliente.value = true;
    }else{
      badMessage.value = "Cliente Inactivado";
      showBad();
    }
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
      generarListaAsientos() 
    } catch (error) {
      console.log(error);
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

//Nueva Venta
function nuevaVenta(){
  fixed.value = false;
  ruta.value = "";
  bus.value = "";
  fecha_departida.value = "";
  rutaBusFecha.value = false;
  asientos.value = [];
  showClienteDiv = false;
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
}

// Obtener Vendedor
async function obtenerVendedor() {
  vendedor.value = loginStore.vendedor;
};

// Agregar Cliente
async function agregarCliente() {
  try {
    showDefault();
    const response = await clienteStore.postCliente({
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
    });
  
    cancelShow();
    // limpiar();
    greatMessage.value = "Cliente Agregado";
    
    showGreat();
    await obtenerInfo();
    buscarCliente();
  } catch (error) {
    console.log(error);
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
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
      console.log(error);
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

//Limite de fecha
function getFechaActual() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// const styles = ref({
//   busCliente: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     alignItems: 'flex-end',
//   },
//   busClienteActive: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//   },
// });

// watch(showClienteDiv, () => {
//   clienteContainerClass.value = showClienteDiv ? "busClienteActive" : "busCliente";
// });

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,500;1,300;1,400&display=swap');

.container-all {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}


.container-venta {


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

.container-bus {
  height: 100%;
  width: 54%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  width: 46%;
  align-content: center;
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

.rutaBusFecha {
  background-color: #dbdbdb7a;
  display: flex;
  width: 90%;
  justify-content: space-around;
  padding: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin: 5px;
}


.options {
  display: flex;
  justify-content: space-around;
}
.options button{
  margin: 10px;
}

.btns {
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}


.container-cuestionario {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
}
.container-rutaBusFecha{
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.busCliente {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 80%;
  align-items: center;
}


@media (max-width: 793px){
  .container-bus{
    height: auto;
    width: 85%;
  }

  .busCliente {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 900px){
  .asientoNumero{
    font-size: 50px;
  }
}

@media (max-width: 792px){
  .cliente{
    width: 100%;
  }
}
@media (max-width: 605px){
  .asientoNumero{
    font-size: 40px;
  }
}
@media (max-width:502px){
  .cliente{
    width: 100%;
  }
}
</style>