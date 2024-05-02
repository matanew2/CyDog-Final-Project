import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const WithPrivateRoute = ({ children }) => {
  const { currentUser,  } = useAuth();

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};

const CreateTaskPrivateRoute = ({ children }) => {
  const { createdTask, currentUser} = useAuth();

  if (createdTask) {
    return children;
  }

  return <Navigate to={`/profile/${currentUser.uid}/tasks`} />;
}

export { WithPrivateRoute, CreateTaskPrivateRoute };
