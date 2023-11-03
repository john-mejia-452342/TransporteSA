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
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="vendedor" :optionsVendedor="optionsVendedor" label="Vendedor"/> 
              </div>
            </div>
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="cliente" :optionsCliente="optionsCliente" label="Cliente"/> 
              </div>
            </div>
          </q-card-section>
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn flat label="Guardar 💾" color="primary" @click="editarTicket()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="container-table">
        <h1>Tickets</h1>
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
  import { useVendedorStore} from "../stores/Vendedor.js"
  import { useClienteStore } from "../stores/Cliente.js"
  
  const busStore = useBusStore();
  const ticketStore = useTicketStore()
  const vendedorStore = useVendedorStore()
  const clienteStore = useClienteStore()
  
  let tickets = ref([]);
  let rows = ref([]);
  let fixed = ref(false);
  let text = ref("");
  let ruta = ref("")
  let optionsVendedor = ref([])
  let optionsCliente = ref([])

  let vendedor = ref("");
  let cliente = ref("");
  let cantidad_asientos = ref("");
  let empresa_asignada = ref("");
  let cambio = ref(0);
  
  async function obtenerInfo() {
    try {
      await ticketStore.getTickets();
      tickets.value = ticketStore.ticket;
      rows.value = ticketStore.ticket;
    } catch (error) {
      console.log(error);
    }
  }
  
  // watch(ruta, (newValue, oldValue) => {
  //   console.log(ruta._rawValue.value);
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
    // { name: "createAT",label: "Fecha de Creación",field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd")},
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
  ];
  
  
  async function editarTicket() {
    let id = idTicket.value;
    if (id) {
      await busStore.putEditarBus(id, {
        placa: placa.value,
        numero_bus: numero_bus.value,
        cantidad_asientos: cantidad_asientos.value,
        empresa_asignada: empresa_asignada.value,
        ruta_id: ruta._rawValue.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
  
  function limpiar() {
    placa.value = "";
    numero_bus.value = "";
    cantidad_asientos.value = "";
    empresa_asignada.value = "";
    ruta.value= ""
  }
  
  let idTicket = ref("");
  async function EditarTicket(id) {
    obtenerVendedor()
    obtenerCliente()
    const ticketSelect = tickets.value.find((ticket) => ticket._id === id);
    if (ticketSelect) {
      idTicket.value = String(ticketSelect._id);
      fixed.value = true;
      text.value = "Editar Ticket";
      vendedor.value =`${ticketSelect.vendedor_id.nombre} - ${ticketSelect.vendedor_id.telefono}`;
      cliente.value = `${ticketSelect.cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`
      cantidad_asientos.value = ticketSelect.cantidad_asientos;
      empresa_asignada.value = ticketSelect.empresa_asignada;
    }
  }
  
  // async function InactivarBus(id) {
  //   await busStore.putInactivarBus(id);
  //   obtenerInfo();
  // }
  
  // async function ActivarBus(id) {
  //   await busStore.putActivarBus(id);
  //   obtenerInfo();
  // }
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