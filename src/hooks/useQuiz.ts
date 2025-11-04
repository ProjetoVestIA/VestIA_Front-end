import { getAIExplanation, type AIHelpType } from '@/api/openRouter.api';
import { AuthContext } from '@/context/AuthContext';
import type Questao from '@/models/questao';
import { buscar, atualizar } from '@/services/auth.service';
import { useState, useContext, useCallback } from 'react';

export interface Alternativa {
    letra: string;
    texto: string;
}

export interface QuizFilters {
    subject?: string;
    questionsCount?: number | 'unlimited';
    languages?: string[];
}

export interface QuizStats {
    questionsAnswered: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
}

export interface UseQuizReturn {
    questao: Questao | null;
    alternativas: Alternativa[];
    selectedOption: string | null;
    isAnswered: boolean;
    showAIHelp: boolean;
    aiHelpType: AIHelpType | null;
    aiExplanation: string;
    isLoadingAI: boolean;
    totalQuestoes: number;
    isLoading: boolean;
    currentQuestionIndex: number;
    stats: QuizStats;
    quizFinished: boolean;
    pontosGanhos: number;
    questionsLimit: number | 'unlimited';
    handleSelectOption: (letra: string) => void;
    handleSubmit: () => void;
    handleNext: () => void;
    handleAIHelp: (type: 'concept' | 'error') => void;
    carregarQuestoesComFiltros: (filters: QuizFilters) => void;
    resetQuiz: () => void;
}

export const useQuiz = (): UseQuizReturn => {
    const [questao, setQuestao] = useState<Questao | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [aiHelpType, setAiHelpType] = useState<AIHelpType | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [totalQuestoes, setTotalQuestoes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questoesCarregadas, setQuestoesCarregadas] = useState<Questao[]>([]);
    const [filtersLoaded, setFiltersLoaded] = useState<string>('');
    const [questionsLimit, setQuestionsLimit] = useState<number | 'unlimited'>(10);
    const [quizFinished, setQuizFinished] = useState(false);
    const [pontosGanhos, setPontosGanhos] = useState(0);

    const [stats, setStats] = useState<QuizStats>({
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        accuracy: 0
    });

    const { usuario: usuarioLogado, setUsuario } = useContext(AuthContext);

    const atualizarPontosUsuario = useCallback(async (pontosParaAdicionar: number) => {
        try {
            await atualizar(
                `/usuarios/${usuarioLogado.id}/adicionar-pontos`,
                pontosParaAdicionar,
                (data: any) => {
                    const novosPontos = data.pontos || (usuarioLogado.pontos + pontosParaAdicionar);

                    setUsuario(prev => ({
                        ...prev,
                        pontos: novosPontos
                    }));

                    const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
                    localStorage.setItem('usuario', JSON.stringify({
                        ...usuarioAtual,
                        pontos: novosPontos
                    }));
                },
                {
                    headers: {
                        Authorization: usuarioLogado.token,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            const novosPontos = usuarioLogado.pontos + pontosParaAdicionar;

            setUsuario(prev => ({
                ...prev,
                pontos: novosPontos
            }));

            const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
            localStorage.setItem('usuario', JSON.stringify({
                ...usuarioAtual,
                pontos: novosPontos
            }));
        }
    }, [usuarioLogado.id, usuarioLogado.token, usuarioLogado.pontos, setUsuario]);

    const atualizarEstatisticas = useCallback((acertou: boolean) => {
        setStats(prev => {
            const newQuestionsAnswered = prev.questionsAnswered + 1;
            const newCorrectAnswers = prev.correctAnswers + (acertou ? 1 : 0);
            const newCurrentStreak = acertou ? prev.currentStreak + 1 : 0;
            const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);
            const newAccuracy = newQuestionsAnswered > 0 ? (newCorrectAnswers / newQuestionsAnswered) * 100 : 0;

            return {
                questionsAnswered: newQuestionsAnswered,
                correctAnswers: newCorrectAnswers,
                currentStreak: newCurrentStreak,
                bestStreak: newBestStreak,
                accuracy: newAccuracy
            };
        });

        if (acertou) {
            setPontosGanhos(prev => prev + 5);
            atualizarPontosUsuario(5);
        }
    }, [atualizarPontosUsuario]);

    const embaralharArray = useCallback(<T>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    const carregarQuestoesComFiltros = useCallback(async (filters: QuizFilters) => {
        const filtersString = JSON.stringify(filters);

        if (filtersString === filtersLoaded) {
            return;
        }

        setIsLoading(true);
        setQuestionsLimit(filters.questionsCount || 10);

        setStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            accuracy: 0
        });

        try {
            let endpoint = '/questao/all';

            if (filters.subject && filters.subject !== 'all') {
                const subjectMap: { [key: string]: string } = {
                    'ling': 'LINGUAGENS, CÓDIGOS E SUAS TECNOLOGIAS',
                    'mat': 'MATEMÁTICA E SUAS TECNOLOGIAS',
                    'nat': 'CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS',
                    'human': 'CIÊNCIAS HUMANAS E SUAS TECNOLOGIAS'
                };

                const subjectName = subjectMap[filters.subject] || filters.subject;
                endpoint = `/questao/assunto/${encodeURIComponent(subjectName)}`;
            }

            await buscar(endpoint, (data: Questao[]) => {
                let filteredData = data;

                if (filters.languages && !filters.languages.includes('none') &&
                    (filters.subject === 'all' || filters.subject === 'ling')) {

                    filteredData = data.filter(questao => {
                        const hasLanguage = filters.languages!.some(lang => {
                            if (lang === 'ingles') {
                                return questao.assunto?.includes('INGLÊS');
                            }
                            if (lang === 'espanhol') {
                                return questao.assunto?.includes('ESPANHOL');
                            }
                            return false;
                        });
                        return hasLanguage;
                    });
                }

                const questoesEmbaralhadas = embaralharArray(filteredData);

                let questoesFinais = questoesEmbaralhadas;
                if (filters.questionsCount !== 'unlimited' && filters.questionsCount) {
                    questoesFinais = questoesEmbaralhadas.slice(0, filters.questionsCount);
                }

                setQuestoesCarregadas(questoesFinais);
                setTotalQuestoes(questoesFinais.length);
                setFiltersLoaded(filtersString);

                if (questoesFinais.length > 0) {
                    setQuestao(questoesFinais[0]);
                    setCurrentQuestionIndex(0);
                } else {
                    setQuestao(null);
                }
            }, {
                headers: { Authorization: usuarioLogado.token }
            });
        } catch (error) {
            setQuestoesCarregadas([]);
            setTotalQuestoes(0);
            setQuestao(null);
            setFiltersLoaded(filtersString);
        } finally {
            setIsLoading(false);
        }
    }, [filtersLoaded, usuarioLogado.token, embaralharArray]);

    const carregarProximaQuestao = useCallback(() => {
        if (questoesCarregadas.length === 0) return;

        if (questionsLimit !== 'unlimited' && currentQuestionIndex >= totalQuestoes - 1) {
            setCurrentQuestionIndex(0);
            setQuestao(questoesCarregadas[0]);
        } else {
            const nextIndex = (currentQuestionIndex + 1) % questoesCarregadas.length;
            setCurrentQuestionIndex(nextIndex);
            setQuestao(questoesCarregadas[nextIndex]);
        }
    }, [questoesCarregadas, currentQuestionIndex, totalQuestoes, questionsLimit]);

    const alternativas: Alternativa[] = questao
        ? [
            { letra: 'A', texto: questao.alternativaA },
            { letra: 'B', texto: questao.alternativaB },
            { letra: 'C', texto: questao.alternativaC },
            { letra: 'D', texto: questao.alternativaD },
            { letra: 'E', texto: questao.alternativaE },
        ]
        : [];

    const handleSelectOption = useCallback((letra: string) => {
        if (!isAnswered) {
            setSelectedOption(letra);
        }
    }, [isAnswered]);

    const handleSubmit = useCallback(() => {
        if (selectedOption && questao) {
            setIsAnswered(true);
            const acertou = selectedOption === questao.resposta;
            atualizarEstatisticas(acertou);
        }
    }, [selectedOption, questao, atualizarEstatisticas]);

    const handleNext = useCallback(() => {
        const isLastQuestion = questionsLimit !== 'unlimited'
            ? currentQuestionIndex >= questionsLimit - 1
            : currentQuestionIndex >= totalQuestoes - 1;

        if (isLastQuestion) {
            setQuizFinished(true);
            return;
        }

        setSelectedOption(null);
        setIsAnswered(false);
        setShowAIHelp(false);
        setAiHelpType(null);
        carregarProximaQuestao();
    }, [carregarProximaQuestao, currentQuestionIndex, questionsLimit, totalQuestoes]);

    const handleAIHelp = async (type: AIHelpType) => {
        if (!questao) {
            return;
        }

        setShowAIHelp(true);
        setAiHelpType(type);
        setIsLoadingAI(true);
        setAiExplanation('');

        try {
            const explanation = await getAIExplanation(questao, selectedOption, type);
            setAiExplanation(explanation);
        } catch (error) {
            setAiExplanation('Erro ao carregar a explicação. Tente novamente.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const resetQuiz = useCallback(() => {
        setQuestao(null);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowAIHelp(false);
        setAiHelpType(null);
        setCurrentQuestionIndex(0);
        setQuestoesCarregadas([]);
        setFiltersLoaded('');
        setQuestionsLimit(10);
        setQuizFinished(false);
        setPontosGanhos(0);
        setStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            accuracy: 0
        });
    }, []);

    return {
        questao,
        alternativas,
        selectedOption,
        isAnswered,
        showAIHelp,
        aiHelpType,
        aiExplanation,
        isLoadingAI,
        totalQuestoes,
        isLoading,
        currentQuestionIndex,
        stats,
        quizFinished,
        pontosGanhos,
        questionsLimit,
        handleSelectOption,
        handleSubmit,
        handleNext,
        handleAIHelp,
        carregarQuestoesComFiltros,
        resetQuiz,
    };
};