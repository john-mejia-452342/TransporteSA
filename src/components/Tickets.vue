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
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select
                v-model="vendedor"
                :options="optionsVendedor"
                label="Vendedor"
              />
            </div>
          </div>
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select
                v-model="cliente"
                :options="optionsCliente"
                label="Cliente"
              />
            </div>
          </div>
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select v-model="ruta" :options="optionsRutas" label="Ruta" />
            </div>
          </div>
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select v-model="bus" :options="optionsBus" label="Bus" />
            </div>
          </div>
          <q-input
            type="number"
            v-model="no_asiento"
            label="Numero Asiento"
            style="width: 300px"
          />
          <q-input
            type="date"
            v-model="fecha_departida"
            label="Fecha Partida"
            style="width: 300px"
          />
        </q-card-section>
        <q-separator />
        <div class="error">{{errorMessage}}</div>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar 💾"
            color="primary"
            @click="editarTicket()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div
      class="container-table"
      style="height: 90vh; overflow-y: auto; width: 80%"
    >
      <h1>Tickets</h1>

      <div class="b-b">
        <q-input
          class="bbuscar"
          v-model="searchtieckets"
          label="Buscar por número de cédula del cliente"
          style="width: 300px"
          @input="filtrarticket"
        />
        <q-btn
          color="primary"
          label="Buscar"
          @click="filtrarticket"
          class="btnbuscar"
        />
      </div>

      <q-table title="Tickets" :rows="rows" :columns="columns" row-key="name">
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
            <q-btn
              color="white"
              text-color="black"
              label="🖋️"
              @click="EditarTicket(props.row._id)"
            />
            <q-btn
              color="white"
              text-color="black"
              label="📃"
              @click="imprimirTicket(props.row._id)"
            />
            <q-btn
              color="white"
              text-color="black"
              label="❌"
              @click="InactivarTicket(props.row._id)"
              v-if="props.row.estado == 1"
            />
            <q-btn
              color="white"
              text-color="black"
              label="✅"
              @click="ActivarTicket(props.row._id)"
              v-else
            />
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
import { useTicketStore } from "../stores/Ticket.js";
import { useVendedorStore } from "../stores/Vendedor.js";
import { useClienteStore } from "../stores/Cliente.js";
import { useRutaStore } from "../stores/Ruta.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
const busStore = useBusStore();
const ticketStore = useTicketStore();
const vendedorStore = useVendedorStore();
const clienteStore = useClienteStore();
const rutaStore = useRutaStore();

let tickets = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let optionsVendedor = ref([]);
let optionsCliente = ref([]);
let optionsBus = ref([]);
let optionsRutas = ref([]);
let ruta = ref("");
let vendedor = ref("");
let cliente = ref("");
let bus = ref("");
let no_asiento = ref(0);
let fecha_departida = ref("");
let searchtieckets = ref("");

function filtrarticket() {
  if (searchtieckets.value.trim() === "") {
    rows.value = tickets.value;
  } else {
    rows.value = tickets.value.filter((ticket) =>
      ticket.cliente_id.cedula
        .toString()
        .includes(searchtieckets.value.toString())
    );
  }
}
async function obtenerInfo() {
  try {
    await ticketStore.getTickets();
    tickets.value = ticketStore.ticket;
    rows.value = ticketStore.ticket;
  } catch (error) {
    console.log(error);
  }
}

// watch(vendedor, (newValue, oldValue) => {
//   console.log(vendedor._rawValue.value);
// });

async function obtenerVendedor() {
  try {
    await vendedorStore.obtenerInfoVendedor();
    optionsVendedor.value = vendedorStore.vendedores.map((vendedor) => ({
      label: `${vendedor.nombre} - ${vendedor.telefono}`,
      value: String(vendedor._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
async function obtenerCliente() {
  try {
    await clienteStore.obtenerInfoClientes();
    optionsCliente.value = clienteStore.clientes.map((cliente) => ({
      label: `${cliente.nombre} - ${cliente.cedula} - ${cliente.telefono}`,
      value: String(cliente._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    optionsBus.value = busStore.buses.map((bus) => ({
      label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    optionsRutas.value = rutaStore.rutas.map((ruta) => ({
      label: `${ruta.origen} - ${ruta.destino} - ${ruta.horario_id.hora_partida} - ${ruta.horario_id.hora_llegada}`,
      value: String(ruta._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
onMounted(async () => {
  obtenerInfo();
});

const columns = [
  {
    name: "cliente_id",
    label: "Info Cliente",
    field: (row) =>
      `${row.cliente_id.nombre} - ${row.cliente_id.cedula}- ${row.cliente_id.telefono}`,
  },
  {
    name: "bus_id",
    label: "Info Bus",
    field: (row) =>
      `${row.bus_id.empresa_asignada} - ${row.bus_id.placa} - N°${row.bus_id.numero_bus} `,
  },
  {
    name: "vendedor_id",
    label: "Info Vendedor",
    field: (row) => `${row.vendedor_id.nombre} - ${row.vendedor_id.telefono}`,
  },
  {
    name: "ruta_id",
    label: "Ruta Origen - Destino",
    field: (row) => `${row.ruta_id.origen} - ${row.ruta_id.destino}`,
  },
  {
    name: "ruta_id",
    label: "Horario Partida - Llegada",
    field: (row) =>
      `${row.ruta_id.horario_id.hora_partida} - ${row.ruta_id.horario_id.hora_llegada}`,
  },
  {
    name: "no_asiento",
    label: "N° Asiento",
    field: "no_asiento",
    sortable: true,
  },
  {
    name: "fecha_departida",
    label: "Fecha de partida",
    field: "fecha_departida",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
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

async function editarTicket() {
  let id = idTicket.value;
  if (id) {
    validar();
    if (validacion.value == true) {
      try {
      showDefault();
      await ticketStore.putEditarTicket(id, {
        vendedor_id: vendedor._rawValue.value,
        cliente_id: cliente._rawValue.value,
        ruta_id: ruta._rawValue.value,
        bus_id: bus._rawValue.value,
        no_asiento: no_asiento.value,
        fecha_departida: fecha_departida.value,
      });
      if (notification) {
        notification();
      }
      limpiar();
      $q.notify({
        spinner: false,
        message: "Ticket Actualizado",
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
}

function limpiar() {
  vendedor.value = "";
  cliente.value = "";
  ruta.value = "";
  bus.value = "";
  no_asiento.value = "";
  fecha_departida.value = "";
}

let idTicket = ref("");
async function EditarTicket(id) {
  await obtenerCliente();
  await obtenerVendedor();
  await obtenerRutas();
  await obtenerBuses();
  const ticketSelect = tickets.value.find((ticket) => ticket._id === id);
  if (ticketSelect) {
    idTicket.value = String(ticketSelect._id);
    fixed.value = true;
    text.value = "Editar Ticket";
    vendedor.value = {
      label: `${ticketSelect.vendedor_id.nombre} - ${ticketSelect.vendedor_id.telefono}`,
      value: String(ticketSelect.vendedor_id._id),
    };

    cliente.value = {
      label: `${ticketSelect.cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`,
      value: String(ticketSelect.cliente_id._id),
    };
    ruta.value = {
      label: `${ticketSelect.ruta_id.origen} - ${ticketSelect.ruta_id.destino} - ${ticketSelect.ruta_id.horario_id.hora_partida} - ${ticketSelect.ruta_id.horario_id.hora_llegada}`,
      value: String(ticketSelect.ruta_id._id),
    };

    bus.value = {
      label: `${ticketSelect.bus_id.empresa_asignada} - ${ticketSelect.bus_id.placa} - N°${ticketSelect.bus_id.numero_bus}`,
      value: String(ticketSelect.bus_id._id),
    };
    no_asiento.value = ticketSelect.no_asiento;

    const date = new Date(ticketSelect.fecha_departida);
    const formattedDate = date.toISOString().split("T")[0];

    fecha_departida.value = formattedDate;
  }
}

async function InactivarTicket(id) {
  try {
    showDefault();
    await ticketStore.putInactivarTicket(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ticket Inactivado",
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

async function ActivarTicket(id) {
  try {
    showDefault();
    await ticketStore.putActivarTicket(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ticket Activado",
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
  if (!vendedor.value && !cliente.value &&!ruta.value && !bus.value && !no_asiento.value && !fecha_departida.value) {
    errorMessage.value = "Por favor rellene los campos";
  }else if(!vendedor.value){
    errorMessage.value = "Seleccione el Vendedor"
  }else if(!cliente.value){
    errorMessage.value = "Seleccione el Cliente"
  }else if (!ruta.value) {
    errorMessage.value = "Seleccione la ruta";
  } else if (!bus.value) {
    errorMessage.value = "Seleccione el bus";
  } else if(!no_asiento.value){
    errorMessage.value = "Seleccione el asiento"
  } else if (!fecha_departida.value) {
    errorMessage.value = "Seleccione la fecha de partida";
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

.b-b {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  gap: 5px;
  margin-bottom: 30px;
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

.error {
  display: flex;
  width: 100%;
  justify-content: center;
  color: red;
  font-size: 18px;
  text-align: center;
}
</style>