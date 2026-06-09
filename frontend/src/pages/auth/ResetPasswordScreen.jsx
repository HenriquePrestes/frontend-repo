import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { resetPasswordSchema } from "../../utils/resetPasswordValidation";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  // Estados para controlar loading, sucesso e erro
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Para verificar se as senhas coincidem em tempo real
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Função para verificar os requisitos da senha em tempo real
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;

    return {
      hasMinLength: pwd.length >= 6,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    // Inicia o estado de carregamento e limpa estados anteriores
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Simulação de requisição (simula um atraso de 2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Senha redefinida com sucesso! (Simulado)", {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setSuccess(true);

      // Após 2 segundos, redireciona para login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setError("Ocorreu um erro. Tente novamente mais tarde.");
    } finally {
      // Finaliza o estado de carregamento
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Redefinir senha
        </h2>

        <p className="mt-2 text-sm sm:text-base text-gray-600 text-center">
          Digite sua nova senha. Certifique-se de que seja segura e fácil de
          lembrar.
        </p>

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Senha redefinida com sucesso! Redirecionando para login...
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulário */}
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <PasswordInput
              label="Nova senha"
              name="password"
              placeholder="Digite sua nova senha"
              register={register}
              errors={errors}
              containerClassName="flex flex-col mt-4"
              labelClassName="mb-1 font-medium text-gray-700"
              inputClassName="p-2 border border-primary border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
              errorClassName="text-red-500 text-sm mt-1"
            />

            {/* Indicadores de requisitos da senha */}
            {password && passwordStrength && (
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Requisitos da senha:
                </p>
                <ul className="text-xs space-y-1">
                  <li
                    className={
                      passwordStrength.hasMinLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasMinLength ? "✓" : "○"} Mínimo de 6
                    caracteres
                  </li>
                  <li
                    className={
                      passwordStrength.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasUpperCase ? "✓" : "○"} Pelo menos uma
                    letra maiúscula
                  </li>
                  <li
                    className={
                      passwordStrength.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasLowerCase ? "✓" : "○"} Pelo menos uma
                    letra minúscula
                  </li>
                  <li
                    className={
                      passwordStrength.hasSpecialChar
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasSpecialChar ? "✓" : "○"} Pelo menos um
                    caractere especial (!@#$%^&*...)
                  </li>
                </ul>
              </div>
            )}

            <PasswordInput
              label="Confirmar nova senha"
              name="confirmPassword"
              placeholder="Confirme sua nova senha"
              register={register}
              errors={errors}
              containerClassName="flex flex-col mt-4"
              labelClassName="mb-1 font-medium text-gray-700"
              inputClassName="p-2 border border-primary border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
              errorClassName="text-red-500 text-sm mt-1"
            />

            {/* Indicador visual se as senhas coincidem */}
            {password && confirmPassword && (
              <div className="mt-2">
                {password === confirmPassword ? (
                  <p className="text-green-600 text-sm">
                    ✓ As senhas coincidem
                  </p>
                ) : (
                  <p className="text-red-500 text-sm">
                    ✗ As senhas não coincidem
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-primary text-white p-2 rounded-lg hover:bg-[#4f9e8a] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>
        )}

        {/* Links de navegação - só aparecem quando não teve sucesso */}
        {!success && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={() => navigate("/login")}
              className="block w-full hover:underline text-gray-600 bg-transparent border-none cursor-pointer mb-2"
            >
              Voltar para o login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
