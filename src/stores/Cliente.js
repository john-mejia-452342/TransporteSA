import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useClienteStore = defineStore('cliente', () => {
    const clientes = ref([]);

    const obtenerInfoClientes = async () => {
        try {
            let responseClientes = await axios.get('/cliente/cliente');
            clientes.value = responseClientes.data.cliente; 
        } catch (error) {
            throw error
        }
    };

    const postCliente = async (data) =>{
        try {
            let res = await axios.post('/cliente/cliente/agregar', data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarCliente = async (id, data) => {
        try {
            let res = await axios.put(`/cliente/cliente/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarCliente = async (id)=>{
        try {
            let r = await axios.put(`/cliente/inactivarCliente/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const putActivarCliente = async (id)=>{
        try {
            let r = await axios.put(`/cliente/activarCliente/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        clientes,
        obtenerInfoClientes, postCliente, putEditarCliente, putInactivarCliente, putActivarCliente
    };
});