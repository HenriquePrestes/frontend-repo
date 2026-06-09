import * as yup from "yup"

export const profileValidationSchema = yup.object().shape({
    nomeCompleto: yup.string().required('Digite o seu nome completo'),
    cpf: yup.string().required('Digite o seu CPF'),
    email: yup.string().email('Email inválido').required('Digite o seu email'),
    dataNascimento: yup.string().required('Digite sua data de nascimento'),
    profissao: yup.string().required('Digite a sua profissão'),
    celular: yup.string().required('Digite o seu celular'),
    cep: yup.string().required('Digite o seu CEP'),
    rua: yup.string().required('Digite a sua rua'),
    numero: yup.string().required('Digite o número'),
    complemento: yup.string().optional(),
    cidade: yup.string().required('Digite a sua cidade'),
    estado: yup.string().required('Digite o seu estado'),
    senha: yup.string()
        .nullable()
        .transform((value) => value === '' ? null : value)
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .optional(),
    notificacoes: yup.boolean()
})