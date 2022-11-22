import { useSelector } from "react-redux";
import { authStateSelector } from "../redux/auth/auth.selectors";
import { UserInterface } from "../redux/auth/types";

interface UseAuthHookInterface {
  user?: UserInterface;
  accessToken?: string;
  isLoading?: boolean;
  errors?: string;
}

const useAuth = (): UseAuthHookInterface => {
  const { user, isLoading, errors } = useSelector(authStateSelector);

  return {
    user,
    accessToken: user?.accessToken,
    isLoading,
    errors,
  };
};

export default useAuth;
