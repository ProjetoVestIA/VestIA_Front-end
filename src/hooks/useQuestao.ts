import { AuthContext } from '@/context/AuthContext';
import type Questao from '@/models/questao';
import { buscar } from '@/services/auth.service';
import { useState, useEffect, useContext } from 'react';

export interface Alternativa {
    letra: string;
    texto: string;
}

export interface UseQuestaoReturn {
    questao: Questao | null;
    alternativas: Alternativa[];
    selectedOption: string | null;
    isAnswered: boolean;
    showAIHelp: boolean;
    aiHelpType: 'concept' | 'error' | null;
    totalQuestoes: number;
    isLoading: boolean;
    handleSelectOption: (letra: string) => void;
    handleSubmit: () => void;
    handleNext: () => void;
    handleAIHelp: (type: 'concept' | 'error') => void;
    carregarQuestaoAleatoria: () => void;
}

export const useQuestao = (): UseQuestaoReturn => {
    const [questao, setQuestao] = useState<Questao | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [aiHelpType, setAIHelpType] = useState<'concept' | 'error' | null>(null);
    const [totalQuestoes, setTotalQuestoes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const { usuario: usuarioLogado } = useContext(AuthContext);

    // Busca o total de questões disponíveis
    useEffect(() => {
        const carregarTotalQuestoes = async () => {
            try {
                const response = await buscar('/questao/all', (data: Questao[]) => {
                    setTotalQuestoes(data.length);
                }, {
                    headers: { Authorization: usuarioLogado.token }
                });
            } catch (error) {
                console.error('Erro ao carregar total de questões:', error);
                setTotalQuestoes(10); // Valor padrão caso falhe
            }
        };

        carregarTotalQuestoes();
    }, [usuarioLogado.token]);

    // Gera ID aleatório baseado no total de questões
    const gerarIdAleatorio = () => {
        if (totalQuestoes > 0) {
            return Math.floor(Math.random() * totalQuestoes) + 1;
        }
        return Math.floor(Math.random() * 10) + 1; // Fallback
    };

    // Carrega questão aleatória
    const carregarQuestaoAleatoria = async () => {
        setIsLoading(true);
        const id = gerarIdAleatorio();
        
        try {
            await buscar(`/questao/${id}`, setQuestao, {
                headers: { Authorization: usuarioLogado.token }
            });
        } catch (error) {
            console.error('Erro ao carregar questão:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Carrega a primeira questão
    useEffect(() => {
        if (totalQuestoes > 0) {
            carregarQuestaoAleatoria();
        }
    }, [totalQuestoes]);

    // Formata alternativas
    const alternativas: Alternativa[] = questao
        ? [
            { letra: 'A', texto: questao.alternativaA },
            { letra: 'B', texto: questao.alternativaB },
            { letra: 'C', texto: questao.alternativaC },
            { letra: 'D', texto: questao.alternativaD },
            { letra: 'E', texto: questao.alternativaE },
        ]
        : [];

    const handleSelectOption = (letra: string) => {
        if (!isAnswered) {
            setSelectedOption(letra);
        }
    };

    const handleSubmit = () => {
        if (selectedOption) {
            setIsAnswered(true);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setShowAIHelp(false);
        setAIHelpType(null);
        carregarQuestaoAleatoria();
    };

    const handleAIHelp = (type: 'concept' | 'error') => {
        setAIHelpType(type);
        setShowAIHelp(true);
    };

    return {
        questao,
        alternativas,
        selectedOption,
        isAnswered,
        showAIHelp,
        aiHelpType,
        totalQuestoes,
        isLoading,
        handleSelectOption,
        handleSubmit,
        handleNext,
        handleAIHelp,
        carregarQuestaoAleatoria,
    };
};