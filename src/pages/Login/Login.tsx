import React, { useContext, useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Mail, EyeOff, Eye, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import type UsuarioLogin from '@/models/usuarioLogin';

interface FormErrors {
    usuario?: string;
    senha?: string;
}

function Login() {
    const navigate = useNavigate();
    const { usuario, handleLogin } = useContext(AuthContext);

    const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({} as UsuarioLogin);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (usuario.token) {
            navigate('/home');
        }
    }, [usuario.token, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuarioLogin((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validação do formulário
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!usuarioLogin.usuario?.trim()) {
            newErrors.usuario = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(usuarioLogin.usuario)) {
            newErrors.usuario = 'E-mail inválido';
        }

        if (!usuarioLogin.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (usuarioLogin.senha.length < 6) {
            newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            handleLogin(usuarioLogin);
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <>
            <div className="flex flex-col grow items-center pt-18 bg-linear-to-br from-blue-50 via-white to-blue-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2 font-title">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-gray-600">Entre com suas credenciais</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* E-mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="usuario"
                                    value={usuarioLogin.usuario || ''}
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2 font-title">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="senha"
                                    value={usuarioLogin.senha || ''}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.senha ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.senha && <p className="mt-1 text-sm text-red-500">{errors.senha}</p>}
                        </div>

                        {/* Esqueci minha senha */}
                        <div className="flex justify-end">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Esqueci minha senha
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Entrar
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <Link to='/register' className="text-blue-600 font-bold hover:text-blue-700">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login