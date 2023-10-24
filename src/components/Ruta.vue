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
            <q-input type="number" v-model="precio" label="Precio" style="width: 300px"/>
            <div class="q-pa" style="width: 300px;">
                  <div class="q-gutter">
                    <q-select v-model="horario" :options="options" label="Horario"/> 
                  </div>
              </div>
            <q-input type="text" v-model="origen" label="Origen" style="width: 300px" />
            <q-input type="text" v-model="destino" label="Destino" style="width: 300px" />
          </q-card-section>
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarRuta()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="container-table">
        <h1>Rutas</h1>
        <div class="btn-agregar">
          <q-btn color="secondary" label="Agregar ➕" @click="agregarRuta()" />
        </div>
        <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <q-btn color="white" text-color="black" label="🖋️" @click="EditarRuta(props.row._id)" />
              <q-btn color="white" text-color="black" label="❌" @click="InactivarRuta(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn color="white" text-color="black" label="✅" @click="ActivarRuta(props.row._id)" v-else />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, onMounted } from "vue";
  import { format } from "date-fns";
  import { useHorarioStore } from "../stores/Horario.js";
  import { useRutaStore } from "../stores/Ruta.js"
  
  const horarioStore = useHorarioStore();
  const rutaStore = useRutaStore()
  
  let rutas = ref([]);
  let rows = ref([]);
  let fixed = ref(false);
  let options = ref([])
  let text = ref("");
  let precio = ref();
  let horario = ref("")
  let origen = ref("");
  let destino = ref("");
  let cambio = ref(0);
  
  
  async function obtenerInfo() {
    try {
      await rutaStore.obtenerInfoRutas();
      rutas.value = rutaStore.rutas;
      rows.value = rutaStore.rutas;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  async function obtenerHorarios() {
      try {
          await horarioStore.obtenerInfoHorarios();
          options.value = horarioStore.horarios.map((horario) => (
            {
              label: `${horario.hora_partida} - ${horario.hora_llegada}`,
              value: String(horario._id)
          }));
      } catch (error) {
          console.log(error);
      }
  }
  
  
  onMounted(async () => {
    obtenerInfo();
  });
  
  const columns = [
    { name: "precio", label: "Precio", field: "precio", sortable: true },
    { name: "hora_partida", label: "Hora Partida", field: (row)=>row.horario_id.hora_partida},
    { name: "hora_llegada", label: "Hora LLegada", field: (row)=>row.horario_id.hora_llegada},
    { name: "origen", label: "Origen", field: "origen"},
    { name: "destino", label: "Destino", field: "destino"},
    { name: "estado", label: "Estado", field: "estado", sortable: true },
    { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
    { name: "opciones", label: "Opciones", sortable: false,},
  ];
  
  function agregarRuta() {
      obtenerHorarios()
      fixed.value = true;
      text.value = "Agregar Ruta";
      cambio.value = 0;
  }
  
  async function editarAgregarRuta() {
    if (cambio.value === 0) {
      await rutaStore.postRuta({
        precio: precio.value,
        horario_id: horario._rawValue.value,
        origen: origen.value,
        destino: destino.value,
      });
      limpiar();
      obtenerInfo();
    } else {
      let id = idRuta.value;
      if (id) {
        await rutaStore.putEditarRuta(id, {
            precio: precio.value,
            horario_id: horario._rawValue.value,
            origen: origen.value,
            destino: destino.value,
        });
        limpiar();
        obtenerInfo();
        fixed.value = false;
      }
    }
  }
  
  function limpiar() {
    precio.value = "";
    horario.value = "";
    origen.value = "";
    destino.value = "";
  }
  
  let idRuta = ref("");
  async function EditarRuta(id) {
    obtenerHorarios()
    cambio.value = 1;
    const rutaSelected = rutas.value.find((ruta) => ruta._id === id);
    if (rutaSelected) {
      idRuta.value = String(rutaSelected._id);
      fixed.value = true;
      text.value = "Editar Ruta";
      precio.value = rutaSelected.precio;
      horario.value = `${rutaSelected.horario_id.hora_partida} - ${rutaSelected.horario_id.hora_llegada}`
      origen.value = rutaSelected.origen;
      destino.value = rutaSelected.destino;
    }
  }
  
  async function InactivarRuta(id) {
    await rutaStore.putInactivarRuta(id);
    obtenerInfo();
  }
  
  async function ActivarRuta(id) {
    await rutaStore.putActivarRuta(id);
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