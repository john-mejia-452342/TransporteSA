import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useTicketStore = defineStore('ticket', () => {
    const ticket = ref([])
    const postTicket = async (data) => {
        try {
          // console.log(token); 
      
          // const config = {
          //   headers: {
          //     Authorization: `Bearer ${token}`
          //   }
          // };
          // console.log(config);
      
          let res = await axios.post("/ticket/agregar", data);
          return res;
        } catch (error) {
          throw error;
        }
      };

      const getTickets = async ()=>{
        try {
          let res = await axios.get("/ticket/ticket");
          ticket.value = res.data.ticket
          console.log(res.data);
          return res;
        } catch (error) {
          throw error;
        };
      };

    return {
      ticket,
      postTicket, getTickets
    };
});