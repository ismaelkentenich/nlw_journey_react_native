import axios from "axios"

export const api = axios.create({
  //baseurl: endereço da máquina:porta do server
    baseURL: "http://192.168.3.6:3333"
})