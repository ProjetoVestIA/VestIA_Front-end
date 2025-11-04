import type Usuario from "@/models/usuario";
import { User, Award, Mail, Save, X, Edit2, LockKeyhole } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { atualizar } from "@/services/auth.service";

function Perfil() {
    const { usuario: usuarioLogado, setUsuario } = useContext(AuthContext);
    const [usuarioLocal, setUsuarioLocal] = useState<Usuario | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ nome: '', usuario: '', senha: '' });

    useEffect(() => {
        if (usuarioLogado.id !== 0) {
            setUsuarioLocal(usuarioLogado);
            setEditedData({
                nome: usuarioLogado.nome,
                usuario: usuarioLogado.usuario,
                senha: ''
            });
        }
    }, [usuarioLogado]);

    const handleEditClick = () => {
        if (!usuarioLocal) return;
        setEditedData({
            nome: usuarioLocal.nome,
            usuario: usuarioLocal.usuario,
            senha: ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!usuarioLocal) return;

        try {
            const dadosParaEnviar = {
                id: usuarioLocal.id,
                nome: editedData.nome,
                usuario: editedData.usuario,
                senha: editedData.senha.trim() !== '' ? editedData.senha : usuarioLogado.senha
            };

            const header = {
                headers: {
                    Authorization: usuarioLogado.token
                },
            };

            await atualizar(`/usuarios/atualizar`, dadosParaEnviar, (data: any) => {
                setUsuarioLocal(prev => prev ? {
                    ...prev,
                    nome: data.nome || editedData.nome,
                    usuario: data.usuario || editedData.usuario,
                    senha: dadosParaEnviar.senha,
                    pontos: prev.pontos
                } : null);

                setUsuario(prev => ({
                    ...prev,
                    nome: data.nome || editedData.nome,
                    usuario: data.usuario || editedData.usuario,
                    senha: dadosParaEnviar.senha,
                }));
            }, header);

            setIsEditing(false);
            setEditedData(prev => ({ ...prev, senha: '' }));
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil!');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (usuarioLocal) {
            setEditedData({
                nome: usuarioLocal.nome,
                usuario: usuarioLocal.usuario,
                senha: ''
            });
        }
    };

    return (
        <div className="bg-linear-to-br flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-3 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-600 font-title">Meu Perfil</h1>
                    <p className="text-gray-600 mt-2">Gerencie suas informações</p>
                </div>

                {/* Pontos Badge */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Total de Pontos</p>
                            <p className="text-4xl font-semibold font-title">{usuarioLogado.pontos}</p>
                        </div>
                        <div className="bg-gray-50/50 rounded-full p-4 flex items-center justify-center">
                            <Award className="w-8 h-8 text-gray-50" />
                        </div>
                    </div>
                </div>

                {/* Informações do Usuário */}
                <div className="space-y-4">
                    {/* Nome */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-title">
                            Nome Completo
                        </label>
                        {isEditing ? (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={editedData.nome}
                                    onChange={(e) => setEditedData({ ...editedData, nome: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center text-gray-900">
                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-lg">{usuarioLocal?.nome}</span>
                            </div>
                        )}
                    </div>

                    {/* E-mail/Usuário */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-title">
                            E-mail
                        </label>
                        {isEditing ? (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={editedData.usuario}
                                    onChange={(e) => setEditedData({ ...editedData, usuario: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center text-gray-900">
                                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-lg">{usuarioLocal?.usuario}</span>
                            </div>
                        )}
                    </div>

                    {/* Senha do Usuário */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-title">
                            Senha
                        </label>
                        {isEditing ? (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockKeyhole className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Deixe em branco para manter a atual"
                                    value={editedData.senha}
                                    onChange={(e) => setEditedData({ ...editedData, senha: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center text-gray-900">
                                <LockKeyhole className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-lg text-gray-400 italic">••••••••••••</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-8 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Salvar Alterações
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-gray-200 text-gray-700 font-title py-3 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className="w-full bg-blue-600 text-white font-title py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-5 h-5" />
                            Editar Perfil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perfil;