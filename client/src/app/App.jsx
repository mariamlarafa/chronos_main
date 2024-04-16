import { Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import { anonymousUrls, getRolesBasedUrls, publicUrls } from "./routes/urls";

import { ToastContainer } from "react-toastify";
import useRenderLocation from "../hooks/location";
import useFetchAuthenticatedUser from "../services/fetchers/authenticatedUser.fetch.service";
import Loading from "./Components/loading/Loading";
import Sidebar from "./Components/sidebar/Sidebar";
import Anonymous from "./routes/Anonymous";

function App() {

  const shouldRenderSidebar = useRenderLocation();
  const userObject = useFetchAuthenticatedUser()

  const renderRoutes = (urls) => {
    return urls.map(({ path, Component, nested }, key) => (
      <Route key={key} path={path} element={Component}>
        {nested &&
          nested.map((nestedRoute, idx) => (
            <Route
              key={idx}
              path={nestedRoute.path}
              element={nestedRoute.Component}
            />
          ))}
      </Route>
    ));
  };

  if (userObject.loading) return <Loading />;

  return (
    <div className={`App`}>
      {shouldRenderSidebar && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}
      <div className="main-content">
        <Routes>
          {/* Anonymous routes */}
          <Route element={<Anonymous user={userObject} />}>
            {renderRoutes(anonymousUrls)}
          </Route>

          {/* Public routes */}
          {renderRoutes(publicUrls)}

          {/* Protected routes for ALL_ROLES */}
          <Route element={<ProtectedRoute user={userObject} />}>
            {renderRoutes(getRolesBasedUrls(null))}
          </Route>

          {/* Protected routes based on user role */}
          {userObject?.user?.role && (
            <Route element={<ProtectedRoute user={userObject} />}>
              {renderRoutes(getRolesBasedUrls(userObject?.user))}
            </Route>
          )}
        </Routes>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
}

export default App;
