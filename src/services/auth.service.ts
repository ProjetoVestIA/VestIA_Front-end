import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000 // Adiciona timeout global de 10 segundos
})

export const postUsuario = async (url: string, dados: Object, setDados: Function) => {
    const response = await api.post(url, dados)
    setDados(response.data)
}

export const login = async (url: string, dados: Object, setDados: Function) => {
    const response = await api.post(url, dados)
    const usuarioData = response.data
    setDados(usuarioData)
}

export const buscar = async (url: string, setDados: Function, header: Object) => {
    const resposta = await api.get(url, header)
    setDados(resposta.data)
}

export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}

export const atualizar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.put(url, dados, header)
    setDados(resposta.data)
}