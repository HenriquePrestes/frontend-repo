import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { registerValidationSimpleSchema } from "../../utils/registerValidationSimple";
import Logo from "../../assets/icons/logo.svg";
import Google from "../../assets/icons/google-icon.svg";
import Facebook from "../../assets/icons/facebook-icon.svg";
import Instagram from "../../assets/icons/instagram-icon.svg";
import Apple from "../../assets/icons/apple-icon.svg";
import RegisterInput from "../../components/RegisterInput/RegisterInput";
import ImageComponent from "../../components/ImageComponent/ImageComponent";
import { Link } from "react-router-dom";


function RegisterScreen() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(registerValidationSimpleSchema)
    })

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError("");
        setSuccessMessage("");

        try {
            // Remove a confirmação de senha antes de enviar para a API
            const { confPassword, ...userData } = data;

            const response = await api.post("/auth/register", userData);

            setSuccessMessage("Usuário criado com sucesso! Redirecionando...");

            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Erro ao criar usuário:", error);

            if (error.response?.data?.message) {
                setApiError(error.response.data.message);
            } else if (error.response?.status === 400) {
                setApiError("Dados inválidos. Verifique as informações e tente novamente.");
            } else if (error.response?.status === 409) {
                setApiError("Email ou CPF já cadastrado. Tente fazer login.");
            } else {
                setApiError("Erro interno do servidor. Tente novamente mais tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="grid grid-cols-4 h-screen w-full">
            <div className="w-[600px] bg-primary col-span-1 flex flex-col items-center justify-start text-white pt-[300px] space-y-6">
                <h1 className="text-5xl font-bold">Bem vindo!</h1>
                <p className="text-2xl font-bold">Já possui uma conta?</p>
                <Link
                    to="/login"
                    className="w-[200px] h-[50px] bg-[#76BFAC] text-[#FFFFFF] font-semibold text-center text-xl px-10 py-2 rounded-lg hover:bg-[#264D40] hover:text-white shadow-md">
                    Entrar
                </Link>

                <div>
                    <div className="flex items-center border-t border-[#76BFAC] my-6 w-[90px] max-w-xs"></div>
                </div>

                <span className="items-center justify-center text-2xl font-bold">ou acesse com:</span>

                <div className="flex justify-center gap-4">
                    <ImageComponent src={Google} alt="ícone do Google" className="w-16 bg-white text-primary px-4 py-2 rounded-lg" />
                    <ImageComponent src={Facebook} alt="ícone do Facebook" className="w-16 bg-white text-primary px-6 py-2 rounded-lg" />
                    <ImageComponent src={Instagram} alt="ícone do Instagram" className="w-16 bg-white text-primary px-3 py-2 rounded-lg" />
                    <ImageComponent src={Apple} alt="ícone do Apple" className="w-16 bg-white text-primary px-3 py-2 rounded-lg" />
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="col-span-3 w-full h-full flex items-center justify-center p-10"
            >
                <div className="w-full max-w-2xl">
                    <div className="flex justify-center mb-6">
                        <ImageComponent src={Logo} alt="Logo" className="w-32" />
                    </div>

                    <h2 className="text-primary text-center text-5xl font-bold mb-8">
                        Crie sua conta
                    </h2>

                    <RegisterInput
                        placeholder="Nome Completo"
                        type="text"
                        name="nomeCompleto"
                        register={register}
                        errors={errors}
                    />

                    <RegisterInput
                        placeholder="CPF"
                        type="text"
                        name="cpf"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        mask="cpf"
                    />

                    <RegisterInput
                        placeholder="Email"
                        type="email"
                        name="email"
                        register={register}
                        errors={errors}
                    />

                    <RegisterInput
                        placeholder="Senha"
                        name="senha"
                        register={register}
                        errors={errors}
                        isPassword={true}
                    />

                    <RegisterInput
                        placeholder="Confirmar Senha"
                        name="confPassword"
                        register={register}
                        errors={errors}
                        isPassword={true}
                    />

                    <div className="flex items-center gap-2 mt-4 mb-6">
                        <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            className="form-checkbox w-5 h-5"
                            {...register("acceptTerms")}
                        />
                        <label>
                            Li e concordo com os termos de uso e política de privacidade
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
                    )}

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {apiError}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-[#4f9e8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Criando cadastro..." : "Criar Cadastro"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterScreen;