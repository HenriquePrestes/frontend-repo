import { useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import ImageComponent from "../../components/ImageComponent/ImageComponent";
import Logo from "../../assets/icons/logo.svg";
import HomeDoctors from "../../assets/img/home-doctors.svg";
import { loginValidationSchema } from "../../utils/loginValidation";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";

export default function LoginScreen() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(loginValidationSchema)
    })

    const [errorMsg, setErrorMsg] = useState('')
    const [showMfaField, setShowMfaField] = useState(false)

    const { login } = useAuth()

    const onLogin = async (data) => {
        try {
            setErrorMsg('');
            await login(data)
        } catch (error) {
            console.log(error)
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data || "Credenciais inválidas";
                if (typeof errorMessage === 'string' && errorMessage.includes('MFA')) {
                    setErrorMsg("Código MFA inválido ou ausente");
                    setShowMfaField(true);
                } else {
                    setErrorMsg("Usuário não encontrado ou credenciais inválidas");
                }
            } else {
                setErrorMsg(error.response?.data?.message || error.message)
            }
        }
    };

    return (
        <div className="grid grid-cols-4 h-screen">
            <div className="bg-primary col-span-1 h-full">
                <div className="grid grid-cols-1 h-full">
                    <div className="flex justify-center items-center">
                        <ImageComponent src={Logo} alt={"Logo"} className={"w-30"} />
                    </div>

                    <div className="flex justify-center items-center">
                        <h2 className="text-white text-5xl font-semibold">Agende. Gerencie. Cuide.</h2>
                    </div>

                    <div className="flex justify-center items-end">
                        <ImageComponent src={HomeDoctors} alt={"Ilustração de doutores"} className={"w-100 -mb-20"} />
                    </div>

                </div>
            </div>

            <form
                onSubmit={handleSubmit(onLogin)}
                className="col-span-3 flex items-center justify-center"
            >
                <div className="flex flex-col w-xl h-80 justify-between">
                    <h2 className="text-primary text-center text-5xl font-bold">Acesse ou crie uma conta</h2>

                    <EmailInput
                        placeholder={"email@exemplo.com"}
                        name={'email'}
                        inputClassName={"w-full h-15 border border-primary border-3 rounded-lg px-5 text-lg outline-none"}
                        register={register}
                        errors={errors}
                        errorClassName={"text-red-400"}
                    />

                    <PasswordInput
                        placeholder={"Senha"}
                        name={'password'}
                        inputClassName={"w-full h-15 border border-primary border-3 rounded-lg px-5 text-lg outline-none"}
                        register={register}
                        errors={errors}
                        errorClassName={"text-red-400"}
                    />

                    {/* Campo MFA - aparece quando necessário ou quando solicitado */}
                    {showMfaField && (
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Código de Autenticação (6 dígitos)"
                                className="w-full h-15 border-3 border-primary rounded-lg px-5 text-lg outline-none"
                                {...register("mfaCode")}
                                maxLength={6}
                            />
                            {errors.mfaCode && (
                                <span className="text-red-400 text-sm mt-1">
                                    {errors.mfaCode.message}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Botão para mostrar campo MFA se o usuário tiver habilitado */}
                    {!showMfaField && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setShowMfaField(true)}
                                className="text-primary text-sm underline hover:text-[#4f9e8a]"
                            >
                                Tenho código de autenticação
                            </button>
                        </div>
                    )}

                    <div className="flex justify-around items-center">
                        <button
                            className="border border-primary w-50 bg-primary text-white text-lg font-semibold h-10 rounded-lg cursor-pointer hover:bg-[#4f9e8a] transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>

                        <Link
                            to="/register"
                            className="border border-primary text-lg px-4 rounded-lg">
                            Criar conta
                        </Link>
                    </div>
                    {errorMsg && 
                        <div className="text-red-400 text-center">
                            {errorMsg}
                        </div> 
                    }
                    <div className="flex justify-center items-center">
                        <Link to="/forgot-password" className="text-lg px-4 hover:underline">Esqueci minha senha</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
