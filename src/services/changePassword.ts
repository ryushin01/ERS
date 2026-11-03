import { API_AUTH } from "@constants/api-path";
import { axiosBasicInstance } from "@services";

export const patchChangePassword = (form: {
  membNo: string;
  pwd: string;
  newPwd: string;
  reNewPwd: string;
}) => axiosBasicInstance.patch(`${API_AUTH}/password/change`, form);
