import * as yup from "yup"

export const registerValidationSimpleSchema = yup.object().shape({
    nomeCompleto: yup.string().required('Digite o seu nome completo'),
    cpf: yup.string().required('Digite o seu CPF'),
    email: yup.string().email('Email inválido').required('Digite o seu email'),
    senha: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Digite a sua senha'),
    confPassword: yup
        .string()
        .oneOf([yup.ref("senha"), null], "As senhas precisam ser iguais")
        .required('Confirme a sua senha'),
    acceptTerms: yup.bool().oneOf([true], "Você deve aceitar os termos"),
})