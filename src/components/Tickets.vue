<template>
  <div class="container">
    <!-- Modal -->
    <!-- <q-dialog v-model="fixed" class="modal-container">
      <q-card class="modal-content">
        <q-card-section class="modal-header">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 100vh" class="modal-body">
          <div class="q-pa modal-input" style="width:100%;">
            <div class="q-gutter">
              <q-select v-model="vendedor" :options="optionsVendedor" label="Vendedor"/> 
            </div>
          </div>
          <div class="q-pa modal-input" style="width:100%;">
            <div class="q-gutter">
              <q-select v-model="cliente" :options="optionsCliente" label="Cliente"/> 
            </div>
          </div>
          <div class="q-pa modal-input" style="width:100%;">
            <div class="q-gutter">
              <q-select v-model="bus" :options="optionsBus" label="Bus"/> 
            </div>
          </div>
          <q-input class="modal-input" type="number" v-model="no_asiento" label="Numero Asiento" style="width:100%" />
          <q-input class="modal-input" type="date" v-model="fecha_departida" label="Fecha Partida" style="width:100%" />
        </q-card-section>
        <q-separator />

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar 💾" color="primary" @click="editarTicket()"/>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <div class="container-table" style="min-height: 90vh; width: 80%">
      <h1>Tickets</h1>

      <!-- barra de busqueda -->
      <div class="b-b">
        <q-input class="bbuscar" v-model.lazy="searchtieckets" label="Buscar por número de cédula del cliente"
          style="width: 300px" />
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
              <!-- <q-btn color="white" text-color="black" label="🖋️" @click="EditarTicket(props.row._id)"/> -->
              <q-btn color="white" text-color="black" label="📄" @click="generarPDF(props.row)" />
              <q-btn color="white" text-color="black" label="❌" @click="InactivarTicket(props.row._id)"
                v-if="props.row.estado == 1" />
              <q-btn color="white" text-color="black" label="✅" @click="ActivarTicket(props.row._id)" v-else />
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
// import { useBusStore } from "../stores/Bus.js";
import { useTicketStore } from "../stores/Ticket.js";
// import { useVendedorStore } from "../stores/Vendedor.js";
// import { useClienteStore } from "../stores/Cliente.js";
// import { useRutaStore } from "../stores/Ruta.js";
import { useQuasar } from "quasar";
import { jsPDF } from "jspdf";
const $q = useQuasar();
// const busStore = useBusStore();
const ticketStore = useTicketStore();
// const vendedorStore = useVendedorStore();
// const clienteStore = useClienteStore();
// const rutaStore = useRutaStore();

let tickets = ref([]);
let rows = ref([]);
// let fixed = ref(false);
// let text = ref("");
// let optionsVendedor = ref([]);
// let optionsCliente = ref([]);
// let optionsBus = ref([]);
// let optionsRutas = ref([]);
// let ruta = ref("");
// let vendedor = ref("");
// let cliente = ref("");
// let bus = ref("");
// let no_asiento = ref(0);
// let fecha_departida = ref("");
let searchtieckets = ref("");
let pagination = ref({ rowsPerPage: 0 });


function filtrartickets() {
  if (searchtieckets.value.trim() === "") {
    rows.value = tickets.value;
  } else {
    const searchTerm = searchtieckets.value.trim().toLowerCase();
    rows.value = tickets.value.filter((ticket) =>
      ticket.cliente_id.cedula.toString().toLowerCase().includes(searchTerm)
    );
  }
}
// Watcher para cambios en searchtieckets
watch(() => searchtieckets.value, () => {
  filtrartickets();
});

// Watcher para cambios en tickets
watch(() => tickets.value, (newtickets) => {
  rows.value = newtickets;
});

// Obtener Tickets
async function obtenerInfo() {
  try {
    await ticketStore.getTickets();
    tickets.value = ticketStore.ticket;
    rows.value = ticketStore.ticket.reverse();
    console.log(tickets);
  } catch (error) {
    console.log(error);
  };
};


// // Obtener Opciones de los Vendedores
// async function obtenerVendedor() {
//   try {
//     await vendedorStore.obtenerInfoVendedor();
//     optionsVendedor.value = vendedorStore.vendedores.map((vendedor) => ({
//       label: `${vendedor.nombre} - ${vendedor.telefono}`,
//       value: String(vendedor._id),
//     }));
//   } catch (error) {
//     console.log(error);
//   };
// };

// Obtener Opciones de Clientes
// async function obtenerCliente() {
//   try {
//     await clienteStore.obtenerInfoClientes();
//     optionsCliente.value = clienteStore.clientes.map((cliente) => ({
//       label: `${cliente.nombre} - ${cliente.cedula} - ${cliente.telefono}`,
//       value: String(cliente._id),
//     }));
//   } catch (error) {
//     console.log(error);
//   };
// };

// Obtener Opciones Buses
// async function obtenerBuses() {
//   try {
//     await busStore.obtenerInfoBuses();
//     optionsBus.value = busStore.buses.map((bus) => ({
//       label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
//       value: String(bus._id),
//     }));
//   } catch (error) {
//     console.log(error);
//   };
// };

// Obtener Opciones Rutas
// async function obtenerRutas() {
//   try {
//     await rutaStore.obtenerInfoRutas();
//     optionsRutas.value = rutaStore.rutas.map((ruta) => ({
//       label: `${ruta.origen} - ${ruta.destino} - ${ruta.horario_id.hora_partida} - ${ruta.horario_id.hora_llegada}`,
//       value: String(ruta._id),
//     }));
//   } catch (error) {
//     console.log(error);
//   };
// };

// Primera Accion
onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cliente_id", label: "Info Cliente", field: (row) => `${row.cliente_id.nombre} - ${row.cliente_id.cedula}- ${row.cliente_id.telefono}`, align: "left" },
  { name: "bus_id", label: "Info Bus", field: (row) => `${row.bus_id.empresa_asignada} - ${row.bus_id.placa} - N°${row.bus_id.numero_bus} `, align: "left" },
  { name: "bus_id", label: "Info Conductor", field: (row) => `${row.bus_id.conductor_id.nombre} - ${row.bus_id.conductor_id.cedula} - N°${row.bus_id.conductor_id.telefono} `, align: "left" },
  { name: "vendedor_id", label: "Info Vendedor", field: (row) => `${row.vendedor_id.nombre} - ${row.vendedor_id.telefono}`, align: "left" },
  {
  name: "ruta_id",
  label: "Ruta Precio - Origen - Destino",
  field: (row) => {
    const precioNumber = parseFloat(row.ruta_id.precio);

    const precioFormateado = !isNaN(precioNumber)
      ? precioNumber.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        })
      : row.ruta_id.precio;

    return `${precioFormateado} - ${row.ruta_id.origen} - ${row.ruta_id.destino}`;
  },
  align: "left",
},
  { name: "ruta_id", label: "Horario Partida - Llegada", field: (row) => `${row.ruta_id.horario_id.hora_partida} - ${row.ruta_id.horario_id.hora_llegada}`, align: "left" },
  { name: "no_asiento", label: "N° Asiento", field: "no_asiento", sortable: true, align: "center" },
  {
    name: "fecha_departida",
    label: "Fecha de partida",
    field: "fecha_departida",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"), align: "left"
  }, ,
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left" },
  { name: "createAT", label: "Fecha de Creación", field: (row) => `${format(new Date(row.createAT), "yyyy-MM-dd")} - ${format(new Date(row.createAT), 'HH:mm:ss')}`, sortable: true, align: "center" },
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

// Editar Ticket Funcionamiento
// async function editarTicket() {
//   let id = idTicket.value;
//   if (id) {
//     validar();
//     if (validacion.value == true) {
//       try {
//         showDefault();
//         await ticketStore.putEditarTicket(id, {
//           vendedor_id: vendedor._rawValue.value,
//           cliente_id: cliente._rawValue.value,
//           ruta_id: ruta._rawValue.value,
//           bus_id: bus._rawValue.value,
//           no_asiento:no_asiento.value,
//           fecha_departida: fecha_departida.value,
//         });
//         cancelShow();
//         limpiar();
//         greatMessage.value = "Ticket Actualizado";
//         showGreat();
//         obtenerInfo();
//         fixed.value = false;
//       } catch (error) {
//         console.log(error);
//         cancelShow();
//         badMessage.value = error.response.data.error.errors[0].msg;
//         showBad();
//       };
//     };
//   };
// };

// // Limpiar Casillas
// function limpiar() {
//   vendedor.value = "";
//   cliente.value = "";
//   ruta.value = "";
//   bus.value = "";
//   no_asiento.value = "";
//   fecha_departida.value = "";
// }

// let idTicket = ref("");

// // Editar Ticket 
// async function EditarTicket(id) {
//   await obtenerCliente();
//   await obtenerVendedor();
//   await obtenerRutas();
//   await obtenerBuses();
//   const ticketSelect = tickets.value.find((ticket) => ticket._id === id);
//   if (ticketSelect) {
//     idTicket.value = String(ticketSelect._id);
//     fixed.value = true;
//     text.value = "Editar Ticket";
//     vendedor.value = {
//       label: `${ticketSelect.vendedor_id.nombre} - ${ticketSelect.vendedor_id.telefono}`,
//       value: String(ticketSelect.vendedor_id._id),
//     };
//     cliente.value = {
//       label: `${ticketSelect.cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`,
//       value: String(ticketSelect.cliente_id._id),
//     };
//     ruta.value = {
//       label: `${ticketSelect.ruta_id.origen} - ${ticketSelect.ruta_id.destino} - ${ticketSelect.ruta_id.horario_id.hora_partida} - ${ticketSelect.ruta_id.horario_id.hora_llegada}`,
//       value: String(ticketSelect.ruta_id._id),
//     };
//     bus.value = {
//       label: `${ticketSelect.bus_id.empresa_asignada} - ${ticketSelect.bus_id.placa} - N°${ticketSelect.bus_id.numero_bus}`,
//       value: String(ticketSelect.bus_id._id),
//     };
//     no_asiento.value = ticketSelect.no_asiento;

//     const date = new Date(ticketSelect.fecha_departida);
//     const formattedDate = date.toISOString().split("T")[0];
//     fecha_departida.value = formattedDate;
//   };
// };

// Inactivar Ticket 
async function InactivarTicket(id) {
  try {
    showDefault();
    await ticketStore.putInactivarTicket(id);
    cancelShow();
    greatMessage.value = "Ticket Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg
    showBad();
  };
};

async function ActivarTicket(id) {
  try {
    showDefault();
    await ticketStore.putActivarTicket(id);
    cancelShow();
    greatMessage.value = "Ticket Activado"
    showGreat();
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
const cancelShow = () => {
  if (notification) {
    notification();
  };
};

let notification = ref(null);

// let validacion = ref(false);

// function validar() {
//   if ( !vendedor.value && !cliente.value && !ruta.value && !bus.value && !no_asiento.value && !fecha_departida.value) {
//     badMessage.value = "Por favor rellene los campos";
//     showBad();
//   } else if (!vendedor.value) {
//     badMessage.value = "Seleccione el Vendedor";
//     showBad();
//   } else if (!cliente.value) {
//     badMessage.value = "Seleccione el Cliente";
//     showBad();
//   } else if (!ruta.value) {
//     badMessage.value = "Seleccione la ruta";
//     showBad();
//   } else if (!bus.value) {
//     badMessage.value = "Seleccione el bus";
//     showBad();
//   } else if (!no_asiento.value) {
//     badMessage.value = "Seleccione el asiento";
//     showBad();
//   } else if (!fecha_departida.value) {
//     badMessage.value = "Seleccione la fecha de partida";
//     showBad();
//   } else {
//     validacion.value = true;
//   };
// };

// Limpiar el modal cuando se cierre mal
// watch(fixed, () => {
//   if (fixed.value == false) {
//     limpiar();
//   };
// });

// Hacer PDF 
// Hacer PDF 
function generarPDF(ticket) {

  const doc = new jsPDF();
  const precioNumber = parseFloat(ticket.ruta_id.precio);

  const precioFormateado = !isNaN(precioNumber)
    ? precioNumber.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      })
    : ticket.ruta_id.precio;

  const logoDataUri = 'https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg';
  doc.addImage(logoDataUri, 'PNG', 120, 0, 80, 80);


  // Título
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(25);
  doc.setTextColor(0, 105, 217);
  doc.text(`TransporteSA`, 18, 19);


  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion del bus:`, 22, 30);

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Empresa encargada: ${ticket.bus_id.empresa_asignada}`, 20, 38);
  doc.text(`-Placa: ${ticket.bus_id.placa}`, 20, 46);
  doc.text(`-N° de bus: ${ticket.bus_id.numero_bus}`, 20, 54);
  doc.text(`-Costo: ${precioFormateado}`, 20, 62);
  doc.text(`-Origen: ${ticket.ruta_id.origen}`, 20, 70);
  doc.text(`-Destino: ${ticket.ruta_id.destino}`, 20, 78);
  doc.text(`-Horario salida: ${ticket.ruta_id.horario_id.hora_partida}`, 20, 86);
  doc.text(`-Hora de llegada: ${ticket.ruta_id.horario_id.hora_llegada}`, 20, 94);
  doc.text(`-Fecha de Partida: ${format(new Date(ticket.fecha_departida), "yyyy-MM-dd")}`, 20, 102);
  doc.text(`-Fecha-Hora Venta: ${format(new Date(ticket.fechahora_venta), "yyyy-MM-dd")} - ${format(new Date(ticket.fechahora_venta), 'HH:mm:ss')}`, 20, 110)

  // Títulos
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 30, 30);
  doc.text(`Información del Cliente:`, 20, 128);

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.cliente_id.nombre}`, 20, 136);
  doc.text(`-C.C: ${ticket.cliente_id.cedula}`, 20, 144);
  doc.text(`-Telefono: ${ticket.cliente_id.telefono}`, 20, 152);
  doc.text(`-N° Asiento: ${ticket.no_asiento}`, 20, 160);

  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion sobre el Vendedor:`, 22, 178)

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.vendedor_id.nombre}`, 20, 186);
  doc.text(`-Telefono: ${ticket.vendedor_id.telefono}`, 20, 194);

  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion del Conductor:`, 22, 212);

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.bus_id.conductor_id.nombre}`, 20, 220);
  doc.text(`-Telefono: ${ticket.bus_id.conductor_id.telefono}`, 20, 228);




  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(25);
  doc.setTextColor(0, 105, 217);
  doc.text(`¡Gracias por tu confianza!`, 20, 248);
  doc.save(`ticket_${ticket._id}.pdf`);
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