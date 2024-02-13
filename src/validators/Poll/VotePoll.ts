import * as yup from "yup";

export const VotePollBodySchema = yup.object().shape({
  pollOptionId: yup.string().required(),
});

export const VotePollParamsSchema = yup.object().shape({
  pollId: yup.string().required(),
});
