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
            <q-input type="text" v-model="vendedor_id" label="Placa" style="width: 300px"/>
            <q-input type="number" v-model="cliente_id" label="Número de Bus" style="width: 300px"/>
            <q-input type="text" v-model="bus_id" label="Cantidad de Asientos" style="width: 300px"/>
            <q-input type="text" v-model="no_asiento" label="Empresa Asignada" style="width: 300px"/>
            <q-input type="text" v-model="fecha_departida" label="Empresa Asignada" style="width: 300px"/>
            <div class="q-pa" style="width: 300px;">
              <div class="q-gutter">
                <q-select v-model="ruta" :options="options" label="Rutas"/> 
              </div>
            </div>
          </q-card-section>
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarTicket()"/>
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
  import { useRutaStore } from "../stores/Ruta.js";
  import { useTicketStore } from "../stores/Ticket.js"
  
  const busStore = useBusStore();
  const rutaStore = useRutaStore()
  const ticketStore = useTicketStore()
  
  let tickets = ref([]);
  let rows = ref([]);
  let fixed = ref(false);
  let text = ref("");
  let ruta = ref("")
  let options = ref([])
  let placa = ref("");
  let numero_bus = ref();
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
  
  watch(ruta, (newValue, oldValue) => {
    console.log(ruta._rawValue.value);
  });
  
  async function obtenerRutas() {
        try {
            await rutaStore.obtenerInfoRutas();
            options.value = rutaStore.rutas.map((ruta) => (
              {
                label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
                value: String(ruta._id)
            }));
        } catch (error) {
            console.log(error);
        }
    }
  
  onMounted(async () => {
    obtenerInfo();
  });
  
  const columns = [
    { name: "cliente_id", label: "Cliente Nombre", field: (row)=>row.cliente_id.nombre},
    { name: "cliente_id",label: "Cedula Cliente", field: (row)=>row.cliente_id.cedula},
    { name: "cliente_id",label: "Telefono Cliente",field: (row)=>row.cliente_id.telefono},
    { name: "bus_id",label: "Numero Bus",field: (row)=>row.bus_id.numero_bus},
    { name: "bus_id",label: "Empresa Asignada",field: (row)=>row.bus_id.empresa_asignada},
    { name: "bus_id",label: "Placa",field: (row)=>row.bus_id.placa},
    { name: "vendedor_id",label: "Nombre Vendedor",field: (row)=>row.vendedor_id.nombre},
    { name: "vendedor_id",label: "Telefono Vendedor",field: (row)=>row.vendedor_id.telefono},
    { name: "no_asiento",label: "N° Asiento",field:"no_asiento", sortable:true},
    { name: "fecha_departida",label: "Fecha de partida",field:"fecha_departida", sortable:true, 
    format: (val) => format(new Date(val), "yyyy-MM-dd"),},

    { name: "estado", label: "Estado", field: "estado", sortable: true },
    { name: "createAT",label: "Fecha de Creación",field: "createAT",sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),},
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},
  ];
  
  function agregarBus() {
    obtenerRutas()
    fixed.value = true;
    text.value = "Agregar Bus";
    cambio.value = 0;
  }
  
  async function editarAgregarBus() {
    if (cambio.value === 0) {
      await busStore.postBus({
        placa: placa.value,
        numero_bus: numero_bus.value,
        cantidad_asientos: cantidad_asientos.value,
        empresa_asignada: empresa_asignada.value,
        ruta_id: ruta._rawValue.value,
      });
      limpiar();
      obtenerInfo();
    } else {
      let id = idBus.value;
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
  }
  
  function limpiar() {
    placa.value = "";
    numero_bus.value = "";
    cantidad_asientos.value = "";
    empresa_asignada.value = "";
    ruta.value= ""
  }
  
  let idBus = ref("");
  async function EditarBus(id) {
    obtenerRutas()
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