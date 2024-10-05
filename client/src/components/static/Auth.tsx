import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Auth({
  children,
}: {
  children: string | JSX.Element | JSX.Element[];
}) {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to={"/login"} />;
  } else  {
    return <>{children}</>;
  }
}

export default Auth;