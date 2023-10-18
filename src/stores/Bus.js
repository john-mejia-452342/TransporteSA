import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useBusStore = defineStore('bus', () => {
    const buses = ref([]);

    const obtenerInfoBuses = async () => {
        try {
            let responseBuses = await axios.get('bus/buses');
            buses.value = responseBuses.data.buses; 
        } catch (error) {
            throw error
        }
    };

    const postBus = async (data) =>{
        try {
            let res = await axios.post("bus/bus/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarBus = async (id, data) => {
        try {
            let res = await axios.put(`bus/bus/${id}`, data);
        } catch (error) {
            throw error;
        }
    };

    return {
        buses,
        obtenerInfoBuses, postBus, putEditarBus
    };
});