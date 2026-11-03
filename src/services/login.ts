import { API_AUTH } from "@constants/api-path";
import { axiosBasicInstance } from "@services";

export const postLoginData = (form: {
  id: string;
  pwd: string;
  membGbCd: string;
}) => axiosBasicInstance.post(`${API_AUTH}/login`, form);

export const postLogout = () => axiosBasicInstance.post(`${API_AUTH}/logout`);
