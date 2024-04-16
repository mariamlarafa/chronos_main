import { useSelector } from "react-redux";

function useGetStateFromStore(slice,attribute) {
  // const [userInfo, setUserInfo] = useState(initialState)

  const data = useSelector((state) => state[slice][attribute]);
  return data;
}

export default useGetStateFromStore;
