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
            <q-input type="text" v-model="cedula" label="Cedula" style="width: 300px"/>
            <q-input type="text" v-model="nombre" label="Nombre" style="width: 300px" />
            <!-- <q-input type="text" v-model="id_bus" label="Bus" style="width: 300px" /> -->
            <q-input type="text" v-model="telefono" label="Telefono" style="width: 300px" />
          </q-card-section>
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarVendedor()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="container-table">
        <h1>Vendedor</h1>
        <div class="btn-agregar">
          <q-btn color="secondary" label="Agregar ➕" @click="agregarVendedor()" />
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
              <q-btn color="white" text-color="black" label="🖋️" @click="editarVendedor(props.row._id)" />
              <q-btn color="white" text-color="black" label="❌" @click="InactivarVendedor(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn color="white" text-color="black" label="✅" @click="ActivarVendedor(props.row._id)" v-else />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, onMounted } from "vue";
  import { format } from "date-fns";
  import { useVendedorStore } from "../stores/Vendedor.js";
  
  const VendedoresStore = useVendedorStore()
  
  let vendedores = ref([]);
  let rows = ref([]);
  let fixed = ref(false);
  let text = ref("");
  let cedula = ref("");
  let nombre = ref();
  let telefono = ref("");
  let cambio = ref(0);
  
  // const cantidad_asientos = ref("");
  // const empresa_asignada = ref("");
  
  async function obtenerInfo() {
    try {
      await VendedoresStore.obtenerInfoVendedor();
      vendedores.value = VendedoresStore.vendedores;
      rows.value = VendedoresStore.vendedores;
    } catch (error) {
      console.log(error);
    }
  }


  onMounted(async () => {
    obtenerInfo();
  });
  
  const columns = [
    { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
    { name: "nombre", label: "Nombre", field: "nombre", sortable: true},
    { name: "telefono", label: "Telefono", field: "telefono"},
    { name: "estado", label: "Estado", field: "estado", sortable: true },
    { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
    { name: "opciones", label: "Opciones", sortable: false,},
  ];
  
  function agregarVendedor() {
      fixed.value = true;
      text.value = "Agregar Vendedor";
      cambio.value = 0;
  }
  
  async function editarAgregarVendedor() {
    if (cambio.value === 0) {
      await VendedoresStore.postvendedor({
        cedula: cedula.value,
        nombre: nombre.value,
        telefono: telefono.value
      });
      limpiar();
      obtenerInfo();
    } else {
      let id = idVendedor.value;
      if (id) {
        await VendedoresStore.puteditarvendedor(id, {
          cedula: cedula.value,
          nombre: nombre.value,
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
    telefono.value = ""
  }
  
  let idVendedor = ref("");
  async function editarVendedor(id) {
    cambio.value = 1;
    const vendedorSeleccionado =vendedores.value.find((vendedor) => vendedor._id === id);
    if (vendedorSeleccionado) {
      idVendedor.value = String(vendedorSeleccionado._id);
      fixed.value = true;
      text.value = "Editar vendedor";
      cedula.value = vendedorSeleccionado.cedula;
      nombre.value = vendedorSeleccionado.nombre;
      telefono.value = vendedorSeleccionado.telefono;
    }
  }
  
//   async function InactivarVendedor(id) {
//     await conductorStore.putInactivarConductor(id);
//     obtenerInfo();
//   }
  
//   async function ActivarVendedor(id) {
//     await conductorStore.putActivarConductor(id);
//     obtenerInfo();
//   }
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