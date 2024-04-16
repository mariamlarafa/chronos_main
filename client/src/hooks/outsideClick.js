import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useOutsideAlerter(ref, callback) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof callback === "function") {
      function handleClickOutside(event) {

        if (ref.current && !ref.current.contains(event.target)) {
          setTimeout(() => {
            callback(); // Call the provided callback function
          }, 100);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [ref, callback, dispatch]);
}

export default useOutsideAlerter;
