import * as yup from "yup";

export const GetPollSchema = yup.object().shape({
  pollId: yup.string().required(),
});
