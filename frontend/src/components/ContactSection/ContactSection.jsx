import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 1. Defina o Schema de Validação
const contactSchema = yup.object({
    nome: yup.string().required("O nome é obrigatório"),
    email: yup.string().email("Digite um email válido").required("O email é obrigatório"),
    mensagem: yup.string().min(10, "A mensagem precisa ter pelo menos 10 caracteres").required("A mensagem é obrigatória"),
}).required();

const ContactSection = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }, // isSubmitting gerencia o estado de envio
        reset
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            nome: "",
            email: "",
            mensagem: ""
        }
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    // 2. Função de Submissão com Simulação
    const onSubmit = async (data) => {
        // Zera os estados de feedback
        setIsSuccess(false);
        setIsError(false);

        console.log("Dados Validados prontos para envio (simulado):", data);

        // **SIMULAÇÃO DE CHAMADA DE API ASYNC**
        // O código 'await new Promise' simula o tempo que levaria para enviar os dados
        // e receber uma resposta do servidor (cerca de 2 segundos).
        await new Promise(resolve => setTimeout(resolve, 2000));

        // **SIMULAÇÃO DE RESPOSTA (SUCESSO)**
        const success = true; // Altere para 'false' para simular um erro

        if (success) {
            console.log("Simulação: E-mail enviado com sucesso!");
            setIsSuccess(true);
            reset(); // Limpa o formulário
        } else {
            console.error("Simulação: Erro ao enviar a mensagem.");
            setIsError(true);
        }
    };


    return (
        <div className="flex flex-col justify-center items-center text-primary">

            <img
                src="/form-doctors.png"
                alt="Time médico"
                className="w-100 h-40 object-contain mb-6"
            />

            <h2 className="text-2xl font-semibold text-center mb-2">
                Entre em contato conosco
            </h2>
            <p className="text-center text-gray-600 mb-6">
                Ficou com alguma dúvida? Nosso time está à disposição para ajudar!
            </p>

            <form
                className="w-full max-w-md flex flex-col mb-10 gap-4"
                onSubmit={handleSubmit(onSubmit)} // Usa o handleSubmit
            >
                {/* Campo Nome */}
                <input
                    type="text"
                    placeholder="Nome"
                    {...register("nome")}
                    className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.nome ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
                        }`}
                />
                {errors.nome && <p className="text-red-500 text-sm -mt-2">{errors.nome.message}</p>}

                {/* Campo Email */}
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
                        }`}
                />
                {errors.email && <p className="text-red-500 text-sm -mt-2">{errors.email.message}</p>}

                {/* Campo Mensagem */}
                <textarea
                    rows="4"
                    placeholder="Mensagem"
                    {...register("mensagem")}
                    className={`border rounded-md p-3 focus:outline-none focus:ring-2 resize-none ${errors.mensagem ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
                        }`}
                ></textarea>
                {errors.mensagem && <p className="text-red-500 text-sm -mt-2">{errors.mensagem.message}</p>}

                {/* Botão de Envio */}
                <button
                    type="submit"
                    className="bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting} // Desabilita o botão enquanto simula o envio
                >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                </button>

                {/* Mensagens de Feedback */}
                {isSuccess && <p className="text-green-600 text-center">Mensagem enviada com sucesso!</p>}
                {isError && <p className="text-red-500 text-center">Erro ao enviar a mensagem!</p>}
            </form>
        </div>
    );
};

export default ContactSection;