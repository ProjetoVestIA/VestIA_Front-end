import React from 'react';
import { Mail, EyeOff, Eye, Lock } from "lucide-react";
import { useState, type ChangeEvent } from "react";

interface FormData {
    email: string;
    password: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function Login() {


    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData((prev) => ({
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

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            console.log('Dados do login:', {
                email: formData.email,
                password: formData.password,
            });
            alert('Login realizado com sucesso!');
            setFormData({ email: '', password: '' });
            setErrors({});
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
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

                    <div className="space-y-4">
                        {/* E-mail */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-900 mb-2 font-title"
                            >
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="joao@exemplo.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Senha */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-900 mb-2 font-title"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Esqueci minha senha */}
                        <div className="flex justify-end">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Esqueci minha senha
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Entrar
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <a href='/register' className="text-blue-600 font-bold hover:text-blue-700">
                                Criar conta
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login