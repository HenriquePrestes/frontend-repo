import * as yup from "yup"

export const loginValidationSchema = yup.object().shape({
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatório'),
    mfaCode: yup.string()
        .nullable()
        .transform((value) => value === '' ? null : value)
        .matches(/^\d{6}$/, 'Código MFA deve ter exatamente 6 dígitos')
        .optional()
})