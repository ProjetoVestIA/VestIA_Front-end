import { Brain, CheckCircle2, XCircle, Lightbulb, ChevronRight, Sparkles, BookOpen, Target, Flame, Home, Trophy } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { AuthContext } from '@/context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const filters = location.state?.filters;
    const [hasInitialized, setHasInitialized] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);

    const {
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
    } = useQuiz();

    const { usuario: usuarioLogado } = useContext(AuthContext);

    useEffect(() => {
        if (filters && !hasInitialized && usuarioLogado.token) {
            carregarQuestoesComFiltros(filters);
            setHasInitialized(true);
        }

        if (!filters && !hasInitialized) {
            navigate('/quizform');
        }
    }, [filters, hasInitialized, carregarQuestoesComFiltros, navigate, usuarioLogado.token]);

    useEffect(() => {
        if (quizFinished) {
            setShowFinishModal(true);
        }
    }, [quizFinished]);

    const getTotalQuestoesDisplay = () => {
        if (!filters?.questionsCount || filters.questionsCount === 'unlimited') {
            return totalQuestoes;
        }
        return Math.min(filters.questionsCount, totalQuestoes);
    };

    const totalQuestoesDisplay = getTotalQuestoesDisplay();

    if (!filters) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Redirecionando...</p>
            </div>
        );
    }

    if (isLoading && !questao) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Carregando questões...</p>
            </div>
        );
    }

    if (!questao && !isLoading && hasInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhuma questão encontrada
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Não foram encontradas questões com os filtros selecionados. Tente alterar as configurações.
                    </p>
                    <button
                        onClick={() => navigate('/quizform')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Voltar ao Formulário
                    </button>
                </div>
            </div>
        );
    }

    if (!usuarioLogado.token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Você precisa estar logado para acessar o quiz.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    if (!questao) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Carregando questão...</p>
            </div>
        );
    }

    const isCorrect = selectedOption === questao.resposta;
    const currentQuestionNumber = currentQuestionIndex + 1;
    const progressPercentage = totalQuestoesDisplay > 0 ? (currentQuestionNumber / totalQuestoesDisplay) * 100 : 0;

    const isLastQuestion = questionsLimit !== 'unlimited'
        ? currentQuestionIndex >= questionsLimit - 1
        : currentQuestionIndex >= totalQuestoes - 1;
    const getOptionStyle = (letra: string) => {
        if (!isAnswered) {
            return selectedOption === letra
                ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50';
        }

        if (letra === questao.resposta) {
            return 'border-green-500 bg-green-50 shadow-lg';
        }

        if (selectedOption === letra && letra !== questao.resposta) {
            return 'border-red-500 bg-red-50 shadow-lg';
        }

        return 'border-gray-200 bg-gray-50 opacity-60';
    };

    return (
        <>
            <header className="sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-2 items-center justify-between font-title py-3">
                        <div className="grow">
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-900">
                                    Questão {currentQuestionNumber} de {totalQuestoes}
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="font-medium text-blue-600">
                                    {Math.round(progressPercentage)}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">{usuarioLogado.pontos} pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <span className="px-3 py-1.5 flex mb-4 bg-blue-100 text-blue-700 text-sm justify-center font-semibold rounded-full font-title">
                                {questao.assunto}
                            </span>

                            {/* Enunciado */}
                            <div className="prose max-w-none">
                                <p className="text-lg leading-relaxed text-gray-800">
                                    {questao.enunciado}
                                </p>
                            </div>
                        </div>

                        {/* Alternativas */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Escolha a alternativa correta:
                            </h3>
                            <div className="space-y-3">
                                {alternativas.map((alt) => (
                                    <button
                                        key={alt.letra}
                                        onClick={() => handleSelectOption(alt.letra)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-300 ${getOptionStyle(alt.letra)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`shrink-0 w-10 h-10 font-title rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${isAnswered && alt.letra === questao.resposta
                                                ? 'bg-green-500 text-white'
                                                : isAnswered && selectedOption === alt.letra && alt.letra !== questao.resposta
                                                    ? 'bg-red-500 text-white'
                                                    : selectedOption === alt.letra
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {alt.letra}
                                            </div>
                                            <div className="flex-1 flex items-center justify-between ">
                                                <span className="text-gray-800 font-medium">{alt.texto}</span>
                                                {isAnswered && alt.letra === questao.resposta && (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                                )}
                                                {isAnswered && selectedOption === alt.letra && alt.letra !== questao.resposta && (
                                                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Feedback após resposta */}
                        {isAnswered && (
                            <div className={`rounded-2xl shadow-lg p-6 ${isCorrect
                                ? 'bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                                : 'bg-linear-to-br from-red-50 to-rose-50 border-2 border-red-200'
                                }`}>
                                <div className="flex items-start gap-4">
                                    {isCorrect ? (
                                        <div className="p-3 bg-green-500 rounded-xl">
                                            <CheckCircle2 className="w-8 h-8 text-white" />
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-red-500 rounded-xl">
                                            <XCircle className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className={`text-2xl font-semibold font-title mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                            {isCorrect ? 'Parabéns! Resposta correta!' : 'Resposta incorreta'}
                                        </h3>
                                        <p className={`text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {isCorrect
                                                ? 'Você ganhou +5 pontos! Continue assim!'
                                                : `A resposta correta era a alternativa ${questao.resposta}.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {!isAnswered ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedOption}
                                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${selectedOption
                                        ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Confirmar Resposta
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex-1 py-4 bg-linear-to-r font-title from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLastQuestion ? (
                                        <>
                                            Finalizar Quiz
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    ) : (
                                        <>
                                            Próxima Questão
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Assistant Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 font-title">Assistente IA</h3>
                                    <p className="text-xs text-gray-500">Sempre pronto para ajudar</p>
                                </div>
                                <Sparkles className="w-5 h-5 text-blue-500 ml-auto" />
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleAIHelp('concept')}
                                    className="w-full p-4 bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-blue-900 font-title">Explicar Conceito</div>
                                            <div className="text-xs text-blue-700">Entenda o assunto</div>
                                        </div>
                                    </div>
                                </button>

                                {isAnswered && !isCorrect && (
                                    <button
                                        onClick={() => handleAIHelp('error')}
                                        className="w-full p-4 bg-linear-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all border-2 border-purple-200 hover:border-purple-300 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <Lightbulb className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-purple-900 font-title">Onde errei?</div>
                                                <div className="text-xs text-purple-700">Analise seu erro</div>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* AI Response */}
                            {showAIHelp && (
                                <div className="mt-4 p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                                        <div className="space-y-2 text-sm text-gray-700 flex-1">
                                            {isLoadingAI ? (
                                                <div className="flex items-center gap-2">
                                                    <span>Gerando explicação...</span>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="font-semibold text-gray-900">
                                                        {aiHelpType === 'concept' ? '📚 Explicação do Conceito:' : '💡 Análise do seu erro:'}
                                                    </p>
                                                    <div className="prose prose-sm max-w-none">
                                                        {/* Renderiza a explicação corretamente */}
                                                        {aiExplanation ? (
                                                            aiExplanation.split('\n').map((paragraph, index) => (
                                                                <p key={index} className="mb-2 last:mb-0">
                                                                    {paragraph}
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p>Nenhuma explicação disponível.</p>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="font-semibold font-title text-lg mb-4">SEU DESEMPENHO HOJE</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Questões respondidas</span>
                                    <span className="font-title text-xl">{stats.questionsAnswered}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Taxa de acerto</span>
                                    <span className="font-title text-xl">{Math.round(stats.accuracy)}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Sequência atual</span>
                                    <span className="font-title text-xl flex gap-1.5 items-center">
                                        <Flame className='h-5 w-5' />
                                        {stats.currentStreak}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Melhor sequência</span>
                                    <span className="font-title text-xl">{stats.bestStreak}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal de Quiz Finalizado */}
            {showFinishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <div className="text-center space-y-6">
                            {/* Icon and Title */}
                            <div className="flex justify-center">
                                <div className="p-4 bg-linear-to-br from-blue-600 to-blue-700 rounded-full">
                                    <Trophy className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 font-title mb-2">
                                    Quiz Finalizado!
                                </h2>
                                <p className="text-gray-600">
                                    Parabéns por completar todas as questões!
                                </p>
                            </div>

                            {/* Stats Summary */}
                            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Questões respondidas:</span>
                                    <span className="font-bold text-blue-900 text-xl">{stats.questionsAnswered}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Taxa de acerto:</span>
                                    <span className="font-bold text-blue-900 text-xl">{Math.round(stats.accuracy)}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Pontos ganhos:</span>
                                    <span className="font-bold text-blue-900 text-xl">{pontosGanhos} pts</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link to='/quizform'
                                    className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Praticar novamente!
                                </Link>

                                <Link to='/'
                                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Home className="w-5 h-5" />
                                    Voltar à Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Quiz