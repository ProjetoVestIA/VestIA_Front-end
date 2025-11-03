import { AuthContext } from "@/context/AuthContext";
import { Brain, CircleUserRound, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);

    function logout() {
        handleLogout();
        alert('O usuário foi desconectado com sucesso!');
        navigate('/');
    }

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 py-4 font-title">
                    <div className="flex items-center justify-between">
                        <Link to='/' className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-30"></div>
                                <div className="relative bg-linear-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl">
                                    <Brain className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-semibold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                VestIA
                            </span>
                        </Link>

                        <div className="flex items-center gap-6">

                            {usuario.token ? (
                                <>
                                    <Link
                                        to="/perfil"
                                        className="flex gap-2 px-5 py-2.5 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                                    >
                                        <CircleUserRound />
                                        Perfil
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex gap-2 px-5 py-2.5 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                        <LogOut />
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-5 py-2.5 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all"
                                    >
                                        Criar Conta
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
