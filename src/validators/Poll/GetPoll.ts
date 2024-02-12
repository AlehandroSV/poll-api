import * as yup from "yup";

export const GetPollParamsSchema = yup.object().shape({
  pollId: yup.string().required(),
});
