import * as yup from "yup";

// Schema para o primeiro passo (email)
export const forgotPasswordEmailSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email é obrigatório")
    .email("Digite um email válido"),
});

// Schema para o segundo passo (código)
export const forgotPasswordCodeSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .required("Código é obrigatório")
    .matches(/^\d{6}$/, "O código deve ter exatamente 6 dígitos")
    .length(6, "O código deve ter 6 dígitos"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email é obrigatório")
    .email("Digite um email válido"),
  verificationCode: yup.string().when("showCodeInput", {
    is: true,
    then: (schema) =>
      schema
        .required("Código é obrigatório")
        .matches(/^\d{6}$/, "O código deve ter exatamente 6 dígitos"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
