<template>
   <div>
    <h1>soy vendedor</h1>
   </div>
</template>
  
<script>
import { ref } from 'vue'
import {useVendedorStore} from '../stores/Vendedor'

let leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}



</script>