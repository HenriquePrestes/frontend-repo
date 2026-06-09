import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import EmailInput from "../../components/EmailInput/EmailInput";
import { forgotPasswordEmailSchema } from "../../utils/forgotPasswordValidation";
import { useAuth } from "../../hooks/auth/useAuth";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordEmailSchema),
  });

  // Estados para controlar loading, sucesso, mensagem e erro
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // Estado para o código

  const onSubmit = async (data) => {
    // Inicia o estado de carregamento e limpa estados anteriores
    setLoading(true);
    setError("");
    setMessage("");
    setSuccess(false);

    try {
      // Chama a função do contexto de autenticação para solicitar reset de senha
      const result = await requestPasswordReset(data.email);
      const msg = result?.message ||
        "Se um e-mail cadastrado for encontrado, um link para redefinição de senha será enviado.";
      setMessage(msg);
      setSuccess(true);
      // Caso seu fluxo não use código de verificação por e-mail, mantenha oculto
      setShowCodeInput(true);
    } catch (err) {
      const errorMessage = err?.response?.data?.message ||
        "Erro ao solicitar a redefinição de senha. Verifique o e-mail e tente novamente.";
      setError(errorMessage);
    } finally {
      // Finaliza o estado de carregamento, independentemente do resultado
      setLoading(false);
    }
  };

  // Função para lidar com o código de verificação
  const handleCodeSubmit = async () => {
    // Validação simples do código
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos.");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("O código deve conter apenas números.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulação de verificação do código
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Código verificado:", verificationCode);

      // Aqui você redirecionaria para a tela de redefinir senha
      navigate("/reset-password");
    } catch (error) {
      setError("Código inválido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para controlar apenas números no input do código
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setVerificationCode(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Esqueceu sua senha?
        </h2>

        <p className="mt-2 text-sm sm:text-base text-gray-600 text-center">
          Digite o e-mail cadastrado e enviaremos um código de 6 dígitos para
          redefinir sua senha.
        </p>

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message || "E-mail enviado com sucesso! Verifique sua caixa de entrada."}
          </div>
        )}

        {/* Campo para código de 6 dígitos - aparece após sucesso */}
        {showCodeInput && (
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              Código de verificação
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="Digite o código de 6 dígitos"
              maxLength="6"
              className="w-full p-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
            />
            <button
              onClick={handleCodeSubmit}
              disabled={loading || verificationCode.length !== 6}
              className="mt-4 w-full bg-primary text-white p-2 rounded-lg hover:bg-[#4f9e8a] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Enviar código"}
            </button>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:underline bg-transparent border-none cursor-pointer"
              >
                Voltar para o login
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulário - só aparece quando NÃO está mostrando campo de código */}
        {!showCodeInput && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <EmailInput
              label="E-mail"
              name="email"
              placeholder="seuemail@exemplo.com"
              register={register}
              errors={errors}
              containerClassName="flex flex-col mt-4"
              labelClassName="mb-1 font-medium text-gray-700"
              inputClassName="p-2 border border-primary border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
              errorClassName="text-red-500 text-sm mt-1"
            />

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 w-full bg-primary text-white p-2 rounded-lg hover:bg-[#4f9e8a] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Enviando..."
                : success
                ? "E-mail enviado!"
                : "Enviar código"}
            </button>
          </form>
        )}

        {/* Para os links do nav aparecerem só quando não obtiver sucesso */}
        {!success && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={() => navigate("/login")}
              className="block w-full hover:underline text-gray-600 bg-transparent border-none cursor-pointer mb-2"
            >
              Voltar para o login
            </button>
            <p className="mt-2">
              Ainda não tem conta?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
