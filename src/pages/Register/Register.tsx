import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function Register() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            console.log('Dados do cadastro:', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            alert('Conta criada com sucesso!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setErrors({});
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
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

                    <div className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-900 mb-2 font-title"
                            >
                                Nome Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="João Silva"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

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

                        {/* Confirmar Senha */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-900 mb-2 font-title"
                            >
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Criar Conta
                        </button>
                    </div>

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
