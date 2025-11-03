import { useState } from 'react';
import { Brain, CheckCircle2, XCircle, Lightbulb, ChevronRight, Sparkles, BookOpen, Target, Flame } from 'lucide-react';


function Quiz() {

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [aiHelpType, setAIHelpType] = useState<'concept' | 'error' | null>(null);

    // Dados simulados da questão
    const questao = {
        id: 1,
        vestibular: 'ENEM',
        ano: 2023,
        disciplina: 'Matemática',
        assunto: 'Geometria Espacial',
        dificuldade: 'Média',
        enunciado: 'Um reservatório de água tem formato de um cilindro circular reto. Sua base tem raio de 3 metros e sua altura é de 5 metros. Considerando π = 3,14, qual é a capacidade total desse reservatório em metros cúbicos?',
        alternativas: [
            { letra: 'A', texto: '47,1 m³' },
            { letra: 'B', texto: '94,2 m³' },
            { letra: 'C', texto: '141,3 m³' },
            { letra: 'D', texto: '188,4 m³' },
            { letra: 'E', texto: '235,5 m³' }
        ],
        gabarito: 'C',
        explicacao: 'Para calcular o volume de um cilindro, usamos a fórmula V = π × r² × h. Substituindo os valores: V = 3,14 × 3² × 5 = 3,14 × 9 × 5 = 141,3 m³.'
    };

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
    };

    const handleAIHelp = (type: 'concept' | 'error') => {
        setAIHelpType(type);
        setShowAIHelp(true);
    };

    const isCorrect = selectedOption === questao.gabarito;

    const getOptionStyle = (letra: string) => {
        if (!isAnswered) {
            return selectedOption === letra
                ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50';
        }

        if (letra === questao.gabarito) {
            return 'border-green-500 bg-green-50 shadow-lg';
        }

        if (selectedOption === letra && letra !== questao.gabarito) {
            return 'border-red-500 bg-red-50 shadow-lg';
        }

        return 'border-gray-200 bg-gray-50 opacity-60';
    };

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-2 items-center justify-between font-title">
                        <div className="grow">
                            <div className="max-w-6xl mx-auto py-3">
                                <div className="flex items-center gap-4">
                                    <span className=" font-medium text-gray-900">Questão 5 de 20</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-linear-to-r from-blue-600 to-blue-500 rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                    <span className="font-medium text-blue-600">25%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">1.240 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-2">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <span className="px-3 py-1.5 flex mb-4 bg-blue-100 text-blue-700 text-sm justify-center font-semibold rounded-full font-title">
                                {questao.vestibular}
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
                                {questao.alternativas.map((alt) => (
                                    <button
                                        key={alt.letra}
                                        onClick={() => handleSelectOption(alt.letra)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-300 ${getOptionStyle(alt.letra)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`shrink-0 w-10 h-10 font-title rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${isAnswered && alt.letra === questao.gabarito
                                                ? 'bg-green-500 text-white'
                                                : isAnswered && selectedOption === alt.letra && alt.letra !== questao.gabarito
                                                    ? 'bg-red-500 text-white'
                                                    : selectedOption === alt.letra
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {alt.letra}
                                            </div>
                                            <div className="flex-1 flex items-center justify-between ">
                                                <span className="text-gray-800 font-medium">{alt.texto}</span>
                                                {isAnswered && alt.letra === questao.gabarito && (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                                )}
                                                {isAnswered && selectedOption === alt.letra && alt.letra !== questao.gabarito && (
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
                                            {isCorrect ? '🎉 Parabéns! Resposta correta!' : '😔 Resposta incorreta'}
                                        </h3>
                                        <p className={`text-lg mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {isCorrect
                                                ? 'Você ganhou +50 pontos! Continue assim!'
                                                : `A resposta correta era a alternativa ${questao.gabarito}.`
                                            }
                                        </p>
                                        <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Lightbulb className="w-5 h-5 text-blue-600" />
                                                <span className="font-semibold text-gray-900">Explicação:</span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{questao.explicacao}</p>
                                        </div>
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
                                    Próxima Questão
                                    <ChevronRight className="w-5 h-5" />
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
                                        <div className="space-y-2 text-sm text-gray-700">
                                            {aiHelpType === 'concept' ? (
                                                <>
                                                    <p className="font-semibold text-gray-900">Conceito de Volume de Cilindro:</p>
                                                    <p>O volume de um cilindro é calculado multiplicando a área da base pela altura. A fórmula é V = π × r² × h, onde r é o raio e h é a altura.</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-semibold text-gray-900">Análise do seu erro:</p>
                                                    <p>Você pode ter esquecido de elevar o raio ao quadrado antes de multiplicar. Lembre-se: primeiro calcule r², depois multiplique por π e pela altura.</p>
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
                                    <span className="font-title text-xl">15</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Taxa de acerto</span>
                                    <span className="font-title text-xl">73%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                                    <span className="text-sm">Sequência atual</span>
                                    <span className="font-title text-xl flex gap-1.5 items-center">
                                        <Flame className='h-5 w-5' />
                                        5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Quiz