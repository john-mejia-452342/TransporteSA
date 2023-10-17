import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useBusStore = defineStore('bus', () => {
    const obtenerInfoBuses = async () => {
        let buses = ref([])
        try {
            const responseBuses = await axios.get('bus/buses');
            buses.value = responseBuses
        } catch (error) {
            console.error('Error al obtener la información de los buses:', error);
        }
    }
    return{
        obtenerInfoBuses, 
    }
})

