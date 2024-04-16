import { useLocation, matchPath } from "react-router-dom";
import { combinedUrls } from "../app/routes/urls";

function useIsPathValid() {
  const location = useLocation();

  // Check if location.pathname matches any valid path

  return combinedUrls
    .filter((path) => path !== "*" && path !== "/")
    .some((path) => {
      return matchPath({ path: path, exact: true }, location.pathname) !== null;
    });
}

export default useIsPathValid;
