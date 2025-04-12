import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * WithPrivateRoute component
 * @param {object} children - Children
 * @returns {JSX.Element} - WithPrivateRoute component
 * @description Private route component
 */
const WithPrivateRoute = ({ children }) => {
  const { currentUser,  } = useAuth();

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};


/**
 * CreateTaskPrivateRoute component
 * @param {object} children - Children
 * @returns {JSX.Element} - CreateTaskPrivateRoute component
 * @description Private route component for creating task
 */
const CreateTaskPrivateRoute = ({ children }) => {
  const { createdTask, currentUser} = useAuth();

  if (createdTask) {
    return children;
  }

  return <Navigate to={`/profile/${currentUser.uid}/tasks`} />;
}

export { WithPrivateRoute, CreateTaskPrivateRoute };
