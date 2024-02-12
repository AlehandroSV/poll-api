import * as yup from "yup";

export const CreatePollBodySchema = yup.object().shape({
  title: yup
    .string()
    .typeError('O campo "title" deve ser uma string.')
    .strict(true)
    .required('O campo "title" é obrigatório.')
    .min(5, 'O campo "title" deve ter pelo menos 5 caracteres.')
    .max(100, 'O campo "title" deve ter no máximo 100 caracteres.'),

  options: yup
    .array()
    .of(yup.string().required())
    .typeError('O campo "options" deve ser um `Array` de `Strings`')
    .required("O campo options é obrigatório."),
});
