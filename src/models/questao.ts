type Resposta = "A" | "B" | "C" | "D" | "E";

export default interface Questao {
    id: number;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    alternativaE: string;
    resposta: Resposta;
    assunto: string;
}