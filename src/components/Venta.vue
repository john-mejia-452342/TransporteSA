<template>
    <div class="container">
        <q-btn color="primary" label="Generar Ticket" />
        <div class="container-asientos">
            <div>
                <h3></h3>
                <button type="">💺</button>
            </div>
        </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/Bus.js";
import { useConductorStore } from "../stores/Conductor.js"

</script>

<style scoped>

</style>