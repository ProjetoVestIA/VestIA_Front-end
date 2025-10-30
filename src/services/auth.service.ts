import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080'
})

export const postUsuario = async (url: string, dados: Object, setDados: Function) => {
    const response = await api.post(url, dados)
    setDados(response.data)
}

export const login = async (url: string, dados: Object, setDados: Function) => {
    const response = await api.post(url, dados)
    setDados(response.data)
}