import { useEffect } from "react";
import { useParams } from "react-router";
import { useVerifyResetPasswordTokenMutation } from "../../store/api/auth/authentification";

const useVerifyPasswordToken = (handleError) => {
  const { token } = useParams();
  const [verifyResetPasswordToken, { isLoading }] =
    useVerifyResetPasswordTokenMutation();

  useEffect(() => {
    async function verifyToken() {
      try {
        await verifyResetPasswordToken(token).unwrap();
      } catch (error) {
        console.log(error)
        handleError({ error: true, message: error?.data?.message });
      }
    }

    verifyToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return isLoading;
};

export default useVerifyPasswordToken;
