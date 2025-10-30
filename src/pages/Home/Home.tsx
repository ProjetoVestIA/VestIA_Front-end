import { useEffect, useState } from 'react';
import { Brain, Trophy, Zap, ChevronRight, Sparkles, FileQuestionMark } from 'lucide-react';
import CurvedLoop from '@/components/common/CurvedLoop';

function Home() {

    const [activeFeature, setActiveFeature] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Brain,
            title: 'IA Personalizada',
            description: 'Assistente inteligente que explica conceitos e analisa seus erros em tempo real'
        },
        {
            icon: FileQuestionMark,
            title: 'Questões Reais',
            description: 'Banco completo com questões de ENEM, Fuvest e principais vestibulares do Brasil'
        },
        {
            icon: Trophy,
            title: 'Gamificação',
            description: 'Sistema de pontos, ranking e conquistas para manter você motivado'
        }
    ];

    return (
        <div className="">
            
            {/* Hero Section */}
            <section className="min-h-screen px-6 pt-24 flex items-center justify-center">
                <div className="w-full flex flex-col">
                    <div className="max-w-7xl  mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium font-title">
                                <Sparkles className="w-4 h-4" />
                                <span>Powered by DeepSeek</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-[650] leading-tight font-title">
                                <span className="text-gray-900">Prepare-se para o </span>
                                <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    vestibular
                                </span>
                                <span className="text-gray-900"> de forma mais inteligente!</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Estude com questões reais de vestibulares, receba feedback personalizado de nossa IA e acompanhe seu progresso.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 font-title text-md">
                                <button className="group px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-200 transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    Criar Conta ou Fazer Log-In
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-blue-200 transform hover:scale-105">
                                    <Zap className="w-5 h-5" />
                                    Começar a praticar
                                </button>
                            </div>

                        </div>

                        {/* Hero Board/Animation */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 font-title">Questão do Dia</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full font-title">ASSUNTO</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                                    <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {['A', 'B', 'C', 'D'].map((opt) => (
                                        <button
                                            key={opt}
                                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                        >
                                            <span className="font-semibold font-title text-gray-700">{opt}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Brain className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">IA disponível para ajudar</div>
                                        <div className="text-sm font-medium text-gray-700 font-title">Precisa de uma explicação?</div>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider/Animation */}
                    <CurvedLoop
                        marqueeText="Aprenda ✧ com ✧ Vest.IA ✧"
                        speed={1.5}
                        curveAmount={-40}
                        direction="left"
                        interactive={true}
                        className="custom-text-style font-title blue-500" />
                </div>

            </section>

            {/* Features Section */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl font-semibold text-gray-900 font-title">
                            Por que escolher o <span className="text-blue-600">VestIA</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Uma plataforma completa que une tecnologia e educação para turbinar seus estudos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            const isActive = activeFeature === idx;

                            return (
                                <div
                                    key={idx}
                                    className={`relative p-8 rounded-2xl transition-all duration-500 cursor-pointer ${isActive
                                        ? 'bg-linear-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/50 scale-105'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    onMouseEnter={() => setActiveFeature(idx)}
                                >
                                    <div className={`p-3 rounded-xl inline-block mb-6 ${isActive ? 'bg-white/20' : 'bg-blue-100'
                                        }`}>
                                        <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                    </div>

                                    <h3 className={`text-2xl font-semibold font-title mb-3 ${isActive ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {feature.title}
                                    </h3>

                                    <p className={`text-lg leading-relaxed ${isActive ? 'text-blue-50' : 'text-gray-600'
                                        }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pt-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden bg-linear-to-br from-blue-400 to-blue-800 rounded-3xl p-12 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30"></div>

                        <div className="relative text-center space-y-6">
                            <h2 className="text-4xl font-title font-semibold text-white">
                                Pronto para começar sua jornada?
                            </h2>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                Junte-se a outros estudantes que já estão aproveitando o poder da Inteligência Artificial para estudar melhor!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 text-lg font-title">
                                <button className="px-8 py-4 bg-white text-blue-600 font-[650] rounded-xl hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all">
                                    CRIAR CONTA
                                </button>
                                <button className="px-8 py-4 bg-blue-500 text-white font-[650] rounded-xl hover:bg-blue-400 hover:shadow-2xl transform hover:scale-105 transition-all">
                                    JÁ TENHO CONTA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    );
};

export default Home;