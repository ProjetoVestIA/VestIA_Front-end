import OpenAI from 'openai';

export type AIHelpType = 'concept' | 'error';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        "X-Title": "VestIA",
        "HTTP-Referer": window.location.origin,
    },
});

export async function getAIExplanation(
    question: any,
    selectedOption: string | null,
    helpType: AIHelpType
): Promise<string> {
    try {
        if (!question) {
            return 'Questão não disponível para análise.';
        }

        const assunto = question.assunto || 'Não especificado';
        const enunciado = question.enunciado || 'Enunciado não disponível';
        const respostaCorreta = question.resposta || 'Não especificada';

        let prompt = '';

        if (helpType === 'concept') {
            prompt = `Explique o conceito fundamental para esta questão do ENEM:

ASSUNTO: ${assunto}
ENUNCIADO: ${enunciado}

Seja direto e claro. Explique em português em 3-4 frases completas.`;
        } else {
            prompt = `Analise o erro cometido nesta questão do ENEM:

ASSUNTO: ${assunto}
ENUNCIADO: ${enunciado}
RESPOSTA DO ESTUDANTE: ${selectedOption || 'Não selecionada'}
RESPOSTA CORRETA: ${respostaCorreta}

Seja direto e construtivo. Explique o erro em 3-4 frases completas.`;
        }

        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [
                {
                    role: "system",
                    content: "Você é um tutor objetivo. Responda de forma completa, com frases inteiras e bem estruturadas. Não corte palavras no final."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 600, 
            temperature: 0.3,
        });

        const choice = completion.choices[0];
        if (!choice) {
            return 'Não foi possível gerar uma resposta.';
        }

        let response = choice.message?.content || '';

        if (isResponseCutOff(response)) {
            return await getCompleteExplanation(question, selectedOption, helpType);
        }

        return response;

    } catch (error) {
        return 'Erro ao carregar a explicação. Tente novamente.';
    }
}

function isResponseCutOff(response: string): boolean {
    if (!response) return false;

    const endsWithCutOff = /[^.!?]\s*$/.test(response.trim());

    const lastWord = response.trim().split(/\s+/).pop() || '';
    const hasCutWord = lastWord.length > 0 && lastWord.length < 3;

    const isTooShort = response.length < 100;

    return endsWithCutOff || hasCutWord || isTooShort;
}

async function getCompleteExplanation(
    question: any,
    selectedOption: string | null,
    helpType: AIHelpType
): Promise<string> {
    try {
        const prompt = helpType === 'concept'
            ? `Conclua esta explicação de forma completa e coerente. Forneça uma resposta final bem estruturada sobre o conceito de ${question.assunto}.`
            : `Conclua esta análise de erro de forma completa e coerente. Forneça uma resposta final bem estruturada sobre o erro cometido.`;

        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400,
            temperature: 0.3,
        });

        return completion.choices[0]?.message?.content || 'Não foi possível completar a explicação.';
    } catch (error) {
        return 'Erro ao completar a explicação.';
    }
}