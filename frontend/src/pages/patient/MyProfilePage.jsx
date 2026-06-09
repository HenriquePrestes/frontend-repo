import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileValidationSchema } from "../../utils/profileValidation";
import { useAuth } from "../../hooks/auth/useAuth";
import { patientService, handleApiError } from "../../services";
import fetchAddress from "../../components/FetchAddress/fetchAddress";
import ProfileSkeleton from "../../components/ProfileSkeleton/ProfileSkeleton";

export default function MyProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Estado para loading inicial
    const [message, setMessage] = useState({ type: '', text: '' });
    const [initialFormData, setInitialFormData] = useState({});

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(profileValidationSchema),
        defaultValues: {
            notificacoes: true
        }
    });

    const cepValue = watch("cep");

    // Auto-preenchimento de endereço via CEP
    useEffect(() => {
        const loadAddress = async () => {
            const cepOnlyNumbers = cepValue?.replace(/\D/g, "");
            if (cepOnlyNumbers?.length === 8) {
                const address = await fetchAddress(cepOnlyNumbers);
                if (address) {
                    setValue("rua", address.street);
                    setValue("cidade", address.city);
                    setValue("estado", address.state);
                }
            }
        };

        loadAddress();
    }, [cepValue, setValue]);

    // Carregar dados do perfil via GET ao montar o componente
    useEffect(() => {
        const loadProfileData = async () => {
            setIsLoadingProfile(true);
            try {
                // Fazer GET para buscar dados atualizados do backend
                const profileData = await patientService.getProfile();
                console.log("Dados do perfil carregados:", profileData);

                // Mapear os dados do backend para o formulário
                const userData = {
                    nomeCompleto: profileData.nomeCompleto || "",
                    cpf: profileData.cpf || "",
                    email: profileData.email || "",
                    dataNascimento: profileData.dataNascimento || "",
                    profissao: profileData.profissao || "",
                    celular: profileData.celular || "",
                    cep: profileData.cep || "",
                    rua: profileData.rua || "",
                    numero: profileData.numero || "",
                    complemento: profileData.complemento || "",
                    cidade: profileData.cidade || "",
                    estado: profileData.estado || "",
                    notificacoes: profileData.notificacoes ?? true
                };

                // Pré-preencher formulário com dados do backend
                Object.keys(userData).forEach(key => {
                    setValue(key, userData[key]);
                });

                // Salvar dados iniciais para restaurar no cancelamento
                setInitialFormData(userData);

            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
                
                // Se falhar, usar dados do JWT como fallback
                if (user) {
                    const fallbackData = {
                        nomeCompleto: user.nomeCompleto || user.nome || "",
                        cpf: user.cpf || "",
                        email: user.email || "",
                        dataNascimento: user.dataNascimento || "",
                        profissao: user.profissao || "",
                        celular: user.celular || "",
                        cep: user.cep || "",
                        rua: user.rua || "",
                        numero: user.numero || "",
                        complemento: user.complemento || "",
                        cidade: user.cidade || "",
                        estado: user.estado || "",
                        notificacoes: user.notificacoes ?? true
                    };

                    Object.keys(fallbackData).forEach(key => {
                        setValue(key, fallbackData[key]);
                    });

                    setInitialFormData(fallbackData);
                }

                // Mostrar erro para o usuário
                const errorMessage = handleApiError(error);
                setMessage({
                    type: 'error',
                    text: `Erro ao carregar perfil: ${errorMessage}`
                });
            } finally {
                setIsLoadingProfile(false);
            }
        };

        // Só carrega se o usuário estiver logado
        if (user) {
            loadProfileData();
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        console.log("onSubmit chamado com dados:", data);
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Preparar dados para envio (remover senha vazia)
            const updateData = { ...data };
            if (!updateData.senha || updateData.senha.trim() === '') {
                delete updateData.senha;
            }

            console.log("Dados preparados para envio:", updateData);

            // Usar o patientService para atualizar perfil
            const updatedProfile = await patientService.updateProfile(updateData);
            
            console.log("Resposta do servidor:", updatedProfile);

            setMessage({ 
                type: 'success', 
                text: 'Perfil atualizado com sucesso!' 
            });
            setIsEditing(false);

            // Atualizar dados iniciais com os novos dados salvos
            setInitialFormData(updateData);

            console.log('Perfil atualizado:', updatedProfile);

        } catch (error) {
            console.error("Erro completo ao atualizar perfil:", error);
            console.error("Stack trace:", error.stack);
            
            // Usar o helper centralizado para tratamento de erro
            const errorMessage = handleApiError(error);
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            console.log("Finalizando onSubmit, setIsLoading(false)");
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage({ type: '', text: '' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        
        // Restaurar valores iniciais em vez de fazer reset completo
        Object.keys(initialFormData).forEach(key => {
            setValue(key, initialFormData[key]);
        });
        
        setMessage({ type: '', text: '' });
    };

    // Mostrar loading enquanto carrega os dados do perfil
    if (isLoadingProfile) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-primary mb-8">Meu Perfil</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Seção de Dados Pessoais */}
                <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Dados Pessoais</h3>

                    {/* Nome completo */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("nomeCompleto")}
                        />
                        {errors.nomeCompleto && (
                            <p className="text-red-500 text-sm mt-1">{errors.nomeCompleto.message}</p>
                        )}
                    </div>

                    {/* CPF e Data de Nascimento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <input
                                type="text"
                                placeholder="CPF"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("cpf")}
                            />
                            {errors.cpf && (
                                <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="date"
                                placeholder="Data de Nascimento"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("dataNascimento")}
                            />
                            {errors.dataNascimento && (
                                <p className="text-red-500 text-sm mt-1">{errors.dataNascimento.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Profissão */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Profissão"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("profissao")}
                        />
                        {errors.profissao && (
                            <p className="text-red-500 text-sm mt-1">{errors.profissao.message}</p>
                        )}
                    </div>

                    {/* E-mail */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="E-mail"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Celular */}
                    <div className="mb-4">
                        <input
                            type="tel"
                            placeholder="Celular"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("celular")}
                        />
                        {errors.celular && (
                            <p className="text-red-500 text-sm mt-1">{errors.celular.message}</p>
                        )}
                    </div>

                    {/* Senha com link alterar */}
                    <div className="relative mb-4">
                        <input
                            type="password"
                            placeholder="Nova senha (deixe em branco para manter atual)"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("senha")}
                        />
                        {isEditing && (
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm">
                                ( Alterar senha )
                            </span>
                        )}
                        {errors.senha && (
                            <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
                        )}
                    </div>
                </div>

                {/* Seção de Endereço */}
                <div className="border-t pt-6 mt-8">
                    <h3 className="text-xl font-semibold text-primary mb-4">Endereço</h3>

                    {/* CEP */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="CEP"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("cep")}
                        />
                        {errors.cep && (
                            <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
                        )}
                    </div>

                    {/* Rua e Número */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Rua"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("rua")}
                            />
                            {errors.rua && (
                                <p className="text-red-500 text-sm mt-1">{errors.rua.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Número"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("numero")}
                            />
                            {errors.numero && (
                                <p className="text-red-500 text-sm mt-1">{errors.numero.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Complemento */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Complemento (opcional)"
                            className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                            disabled={!isEditing}
                            {...register("complemento")}
                        />
                        {errors.complemento && (
                            <p className="text-red-500 text-sm mt-1">{errors.complemento.message}</p>
                        )}
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Cidade"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("cidade")}
                            />
                            {errors.cidade && (
                                <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Estado"
                                className={`w-full p-4 border-2 rounded-lg text-lg ${isEditing ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}`}
                                disabled={!isEditing}
                                {...register("estado")}
                            />
                            {errors.estado && (
                                <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notificações */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
                        disabled
                    >
                        Notificações
                    </button>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="w-6 h-6 text-primary border-2 border-gray-300 rounded focus:ring-primary"
                            {...register("notificacoes")}
                            disabled={!isEditing}
                        />
                        <span className="text-lg">✓</span>
                    </div>
                </div>

                {/* Mensagens de feedback */}
                {message.text && (
                    <div className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Botões de ação */}
                <div className="flex justify-end gap-4">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
                        >
                            Editar
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
                                onClick={() => console.log("Botão Salvar clicado, isLoading:", isLoading)}
                            >
                                {isLoading ? "Salvando..." : "Salvar"}
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}