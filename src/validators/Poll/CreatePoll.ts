import * as yup from "yup";

export interface CreatePoll {
  title: string;
}

export const CreatePollSchema = yup.object().shape({
  title: yup
    .string()
    .typeError('O campo "title" deve ser uma string.')
    .strict(true)
    .required('O campo "title" é obrigatório.')
    .min(5, 'O campo "title" deve ter pelo menos 5 caracteres.')
    .max(100, 'O campo "title" deve ter no máximo 100 caracteres.'),
});
