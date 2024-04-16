import { useSelector } from "react-redux";

function useGetUserInfo() {
  // const [userInfo, setUserInfo] = useState(initialState)
  const user = useSelector((state) => state.userInfo);
  return user;
}

export default useGetUserInfo;
