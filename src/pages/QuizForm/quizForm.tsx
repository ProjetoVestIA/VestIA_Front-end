/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { Target, BookOpen, Zap, ChevronRight, Sparkles, Clock, X, Library, Calculator, Languages, Beaker, Landmark, Infinity, Flame, Dumbbell } from 'lucide-react';

function quizForm() {

    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [questionsCount, setQuestionsCount] = useState<number | 'unlimited'>(10);
    const [languages, setLanguages] = useState<string[]>(['none']);

    const subjects = [
        { id: 'all', name: 'Todas as Matérias', IconComponent: Library, color: 'blue' },
        { id: 'ling', name: 'Linguagens, Códigos e suas Tecnologias', IconComponent: BookOpen, color: 'red' },
        { id: 'mat', name: 'Matemática e suas Tecnologias', IconComponent: Calculator, color: 'purple' },
        { id: 'nat', name: 'Ciências da Natureza e suas Tecnologias', IconComponent: Beaker, color: 'green' },
        { id: 'human', name: 'Ciências Humanas e suas Tecnologias', IconComponent: Landmark, color: 'orange' },
    ];

    const questionOptions: Array<{ value: number | 'unlimited'; label: string; time: string; IconComponent: any; recommended?: boolean }> = [
        { value: 5, label: '5 questões', time: '~10 min', IconComponent: Zap },
        { value: 10, label: '10 questões', time: '~20 min', IconComponent: Target, recommended: true },
        { value: 20, label: '20 questões', time: '~40 min', IconComponent: Flame },
        { value: 50, label: '50 questões', time: '~100 min', IconComponent: Dumbbell },
        { value: 'unlimited' as const, label: 'Ilimitado', time: 'Sem limite', IconComponent: Infinity }
    ];

    const languageOptions = [
        { value: 'none', label: 'Nenhuma' },
        { value: 'ingles', label: 'Inglês' },
        { value: 'espanhol', label: 'Espanhol' },
    ];

    const handleStart = () => {
        console.log('Iniciando com:', {
            subject: selectedSubject,
            count: questionsCount,
            languages
        });
    };

    const toggleLanguage = (value: string) => {
        if (value === 'none') {
            setLanguages(['none']);
        } else {
            const filtered = languages.filter(v => v !== 'none');
            if (filtered.includes(value)) {
                const newLanguages = filtered.filter(v => v !== value);
                setLanguages(newLanguages.length > 0 ? newLanguages : ['none']);
            } else {
                setLanguages([...filtered, value]);
            }
        }
    };

    const getColorClasses = (color: string, selected: boolean = false) => {
        const colors: any = {
            blue: selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
            purple: selected ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
            red: selected ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
            green: selected ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
            orange: selected ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
        };
        return colors[color] || colors.blue;
    };


    return (
        <>

            <div className="max-w-5xl mx-auto px-6">
                {/* Título */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-title font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Configure sua sessão de estudos</span>
                    </div>
                    <h1 className="font-title text-5xl font-bold text-gray-900">
                        Vamos começar!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Personalize sua experiência de estudos escolhendo as opções abaixo
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Quantidade de Questões */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 font-title">Quantas questões?</h2>
                                <p className="text-sm text-gray-600">Escolha a quantidade ideal para sua sessão</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {questionOptions.map((option) => {
                                const Icon = option.IconComponent;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setQuestionsCount(option.value)}
                                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${questionsCount === option.value
                                            ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                                            : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        {option.recommended && (
                                            <div className="absolute -top-3 -right-3 bg-linear-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                Recomendado
                                            </div>
                                        )}
                                        <div className="flex justify-center mb-3">
                                            <Icon className={`w-10 h-10 ${questionsCount === option.value ? 'text-blue-600' : 'text-gray-600'}`} />
                                        </div>
                                        <div className={`font-bold mb-1 ${questionsCount === option.value ? 'text-blue-900' : 'text-gray-900'
                                            }`}>
                                            {option.label}
                                        </div>
                                        <div className={`text-sm flex items-center justify-center gap-1 ${questionsCount === option.value ? 'text-blue-700' : 'text-gray-500'
                                            }`}>
                                            <Clock className="w-3 h-3" />
                                            {option.time}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Matéria */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Qual matéria?</h2>
                                <p className="text-sm text-gray-600">Foque em um assunto específico ou pratique tudo</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {subjects.map((subject) => {
                                const Icon = subject.IconComponent;
                                return (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubject(subject.id)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${getColorClasses(subject.color, selectedSubject === subject.id)
                                            } ${selectedSubject === subject.id ? 'scale-105 shadow-lg' : ''}`}
                                    >
                                        <div className="flex justify-center mb-2">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="font-semibold text-sm">{subject.name}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Linguagens */}
                    {(selectedSubject === 'all' || selectedSubject === 'ling') && (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Languages className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Língua Estrangeira</h2>
                                    <p className="text-sm text-gray-600">Selecione uma opção de língua estrangeira</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {languageOptions.map((language) => {
                                    const isSelected = languages.includes(language.value);
                                    return (
                                        <button
                                            key={language.value}
                                            onClick={() => toggleLanguage(language.value)}
                                            className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${isSelected
                                                ? 'bg-green-600 text-white border-green-600 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                                                }`}
                                        >
                                            {language.label}
                                            {isSelected && language.value !== 'none' && (
                                                <X className="w-4 h-4 inline-block ml-2" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Resumo e Botão Iniciar */}
                    <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-4">Sua sessão de estudos</h3>
                                <div className="space-y-2 text-blue-100">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        <span>
                                            {questionsCount === 'unlimited' ? 'Modo ilimitado' : `${questionsCount} questões`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        <span>
                                            {subjects.find(s => s.id === selectedSubject)?.name || 'Todas as matérias'}
                                        </span>
                                    </div>

                                    {(selectedSubject === 'all' || selectedSubject === 'ling') && (
                                        <div className="flex items-center gap-2">
                                            <Languages className="w-5 h-5" />
                                            <span>
                                                {languages.includes('none')
                                                    ? 'Nenhuma Língua Estrangeira'
                                                    : languages
                                                        .map(v => languageOptions.find(vo => vo.value === v)?.label)
                                                        .join(', ')
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="group px-10 py-5 bg-white text-blue-600 font-bold text-xl rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Zap className="w-7 h-7" />
                                Começar Agora
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default quizForm