import { useEffect, useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type Usuario from '@/models/usuario';
import { postUsuario } from '@/services/auth.service';

type FormErrors = Partial<Record<keyof Usuario | 'confirmSenha', string>>;

function Register() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        pontos: 0,
    });

    const [showSenha, setShowSenha] = useState(false);
    const [confirmSenha, setConfirmSenha] = useState('');
    const [showConfirmSenha, setShowConfirmSenha] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (usuario.id !== 0) {
            navigate('/');
        }
    }, [usuario.id, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmSenha') {
            setConfirmSenha(value);
        } else {
            setUsuario((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!usuario.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!usuario.usuario.trim()) {
            newErrors.usuario = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(usuario.usuario)) {
            newErrors.usuario = 'E-mail inválido';
        }

        if (!usuario.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (usuario.senha.length < 8) {
            newErrors.senha = 'Senha deve ter no mínimo 8 caracteres';
        }

        if (!confirmSenha) {
            newErrors.confirmSenha = 'Confirmação de senha é obrigatória';
        } else if (usuario.senha !== confirmSenha) {
            newErrors.confirmSenha = 'As senhas não coincidem';
        }

        return newErrors;
    };


    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                await postUsuario('/usuarios/cadastrar', usuario, setUsuario);
                alert('Usuário cadastrado com sucesso!');
            } catch {
                alert('Erro ao cadastrar o usuário!');
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <>
            <div className="flex flex-col grow pt-18 bg-linear-to-br from-blue-50 via-white to-blue-50 items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2 font-title">
                            Criar Conta
                        </h1>
                        <p className="text-gray-600">Preencha os dados para se cadastrar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={usuario.nome}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.nome ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="Nome"
                                />
                            </div>
                            {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                        </div>

                        {/* E-mail */}
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="usuario"
                                    name="usuario"
                                    value={usuario.usuario}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.usuario ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                            {errors.usuario && <p className="mt-1 text-sm text-red-500">{errors.usuario}</p>}
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showSenha ? 'text' : 'password'}
                                    id="senha"
                                    name="senha"
                                    value={usuario.senha}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.senha ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenha((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showSenha ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.senha && <p className="mt-1 text-sm text-red-500">{errors.senha}</p>}
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmSenha ? 'text' : 'password'}
                                    id="confirmSenha"
                                    name="confirmSenha"
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmSenha ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmSenha((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmSenha ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmSenha && <p className="mt-1 text-sm text-red-500">{errors.confirmSenha}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Criar Conta
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Já tem uma conta?{' '}
                            <a href='/login' className="text-blue-600 font-bold hover:text-blue-700">
                                Fazer login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
