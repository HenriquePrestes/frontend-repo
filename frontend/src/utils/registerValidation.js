import * as yup from "yup"

export const registerValidationSchema = yup.object().shape({
    
    name: yup.string().required('Digite o seu nome'),
    lastname: yup.string().required('Digite o seu sobrenome'),
    cpf: yup.string().required('Digite o seu CPF'),
    birth: yup.string().required('Digite sua data de nascimento'),
    occupation: yup.string().required('Digite a sua profissão'),
    phone: yup.string().required('Digite o seu telefone'),
    state: yup.string().required('Digite o seu Estado'),
    city: yup.string().required('Digite a sua Cidade'),
    zipcode: yup.string().required('Digite o seu CEP'),
    street: yup.string().required('Digite a sua Rua'),
    housenumber: yup.string().required('Digite o número da casa'),
    email: yup.string().required('Digite o seu email'),
    password: yup.string().required('Digite a sua senha'),
    confPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "As senhas precisam ser iguais")
        .required('Confirme a sua senha'),
    acceptTerms: yup.bool().oneOf([true], "Você deve aceitar os termos"),
})