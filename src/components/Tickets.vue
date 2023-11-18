<template>
    <div class="container">
      <!-- Modal -->
      <q-dialog v-model="fixed" class="modal-container">
        <q-card class="modal-content">
          <q-card-section class="modal-header">
            <div class="text-h6">{{ text }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup class="close-button"/>
          </q-card-section>
          <q-separator />
  
          <q-card-section style="max-height: 50vh" class="modal-body">
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="vendedor" :options="optionsVendedor" label="Vendedor"/> 
              </div>
            </div>
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="cliente" :options="optionsCliente" label="Cliente"/> 
              </div>
            </div>
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="bus" :options="optionsBus" label="Bus"/> 
              </div>
            </div>
            <q-input type="number" v-model="no_asiento" label="Numero Asiento" class="modal-input"/>
            <q-input type="date" v-model="fecha_departida" label="Fecha Partida" class="modal-input"/>
          </q-card-section>
          <q-separator />
  
          <q-card-actions align="right"  class="modal-footer">
            <q-btn flat label="Cerrar" color="primary" v-close-popup class="action-button" />
            <q-btn flat label="Guardar 💾" color="primary" @click="editarTicket()" class="action-button"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="container-table" style="height: 90vh; overflow-y: auto; width: 80%">
        <h1>Tickets</h1>

        <div class="b-b">
        <q-input class="bbuscar" v-model="searchtieckets" label="Buscar por Cedula" style="width: 300px" @input="filtrarticket" />
        <q-btn color="primary" label="Buscar" @click="filtrarticket" class="btnbuscar" />
      </div>

        <q-table title="Tickets" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <q-btn color="white" text-color="black" label="🖋️" @click="EditarTicket(props.row._id)"/>
              <q-btn color="white" text-color="black" label="📃" @click="imprimirTicket(props.row._id)"/>
              <q-btn color="white" text-color="black" label="❌" @click="InactivarTicket(props.row._id)" v-if="props.row.estado == 1"/>
              <q-btn color="white" text-color="black" label="✅" @click="ActivarTicket(props.row._id)" v-else />
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
  import { useVendedorStore} from "../stores/Vendedor.js";
  import { useClienteStore } from "../stores/Cliente.js";
  import { useRutaStore } from "../stores/Ruta.js";
  
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
  let buses = ref([])
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
    rows.value = tickets.value.filter((tickets) =>
      tickets.cliente.toString().includes(searchtieckets.value.toString())
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
  
  async function obtenerVendedor(){
    try {
      await vendedorStore.obtenerInfoVendedor()
      optionsVendedor.value = vendedorStore.vendedores.map((vendedor)=>({
        label: `${vendedor.nombre} - ${vendedor.telefono}`,
        value: String(vendedor._id)
      }))
    } catch (error) {
      console.log(error);
    }
  }
  async function obtenerCliente(){
    try {
      await clienteStore.obtenerInfoClientes()
      optionsCliente.value = clienteStore.clientes.map((cliente)=>({
        label: `${cliente.nombre} - ${cliente.cedula} - ${cliente.telefono}`,
        value: String(cliente._id)
      }))
    } catch (error) {
      console.log(error);
    }
  }
 

  async function obtenerBuses() {
    try {
      await rutaStore.obtenerInfoRutas();
      const ruta_ids = rutaStore.rutas.map((ruta) => String(ruta._id));
      await busStore.obtenerInfoBuses();
      const busesFiltrados = busStore.buses.filter((bus) =>
        ruta_ids.includes(String(bus.ruta_id._id))
      );
      optionsBus.value = busesFiltrados.map((bus) => ({
        label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
        value: String(bus._id),
      }));
    } catch (error) {
      console.log(error);
    }
  }
  onMounted(async () => {
    obtenerInfo();
  });
  
  const columns = [
    { name: "cliente_id", label: "Info Cliente", field: (row)=>`${row.cliente_id.nombre} - ${row.cliente_id.cedula}- ${row.cliente_id.telefono}`},
    { name: "bus_id",label: "Info Bus",field: (row)=>`${row.bus_id.empresa_asignada} - ${row.bus_id.placa} - N°${row.bus_id.numero_bus} `},
    { name: "vendedor_id",label: "Info Vendedor",field: (row)=>`${row.vendedor_id.nombre} - ${row.vendedor_id.telefono}`},
    { name: "bus_id", label: "Ruta Origen - Destino", field: (row)=>`${row.bus_id.ruta_id.origen} - ${row.bus_id.ruta_id.destino}`},
    { name: "bus_id", label: "Horario Partida - Llegada", field: (row)=>`${row.bus_id.ruta_id.horario_id.hora_partida} - ${row.bus_id.ruta_id.horario_id.hora_llegada}` },
    { name: "no_asiento",label: "N° Asiento",field:"no_asiento", sortable:true},
    { name: "fecha_departida",label: "Fecha de partida",field:"fecha_departida", sortable:true, 
    format: (val) => format(new Date(val), "yyyy-MM-dd"),},
    { name: "estado", label: "Estado", field: "estado", sortable: true },
    { name: "createAT",label: "Fecha de Creación",field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd")},
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
  ];
  
  
  async function editarTicket() {
    let id = idTicket.value;
    if (id) {
      await ticketStore.putEditarTicket(id, {
        vendedor_id: vendedor._rawValue.value,
        cliente_id: cliente._rawValue.value,
        bus_id: bus._rawValue.value,
        no_asiento: no_asiento.value,
        fecha_departida: fecha_departida.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
  
  function limpiar() {
    vendedor.value = "";
    cliente.value = "";
    bus.value = "";
    no_asiento.value = "";
    fecha_departida.value= ""
  }
  
  let idTicket = ref("");
  async function EditarTicket(id) {
    await obtenerCliente();
    await obtenerVendedor();
    await obtenerBuses()
    const ticketSelect = tickets.value.find((ticket) => ticket._id === id);
    if (ticketSelect) {
      idTicket.value = String(ticketSelect._id);
      fixed.value = true;
      text.value = "Editar Ticket";
      vendedor.value = {
                        label: `${ticketSelect.vendedor_id.nombre} - ${ticketSelect.vendedor_id.telefono}`,
                        value: String(ticketSelect.vendedor_id._id)
                      }
      
      cliente.value = {
                        label: `${ticketSelect.cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`,
                        value: String(ticketSelect.cliente_id._id)
                      }

      bus.value =  {
                      label:`${ticketSelect.bus_id.empresa_asignada} - ${ticketSelect.bus_id.placa} - N°${ticketSelect.bus_id.numero_bus}`,
                      value: String(ticketSelect.bus_id._id)
                    }
      no_asiento.value = ticketSelect.no_asiento;

      const date = new Date(ticketSelect.fecha_departida);
      const formattedDate = date.toISOString().split('T')[0]; 

      fecha_departida.value = formattedDate;
    }
  }
  
  async function InactivarTicket(id) {
    await ticketStore.putInactivarTicket(id);
    obtenerInfo();
  }
  
  async function ActivarTicket(id) {
    await ticketStore.putActivarTicket(id);
    obtenerInfo();
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
  </style>