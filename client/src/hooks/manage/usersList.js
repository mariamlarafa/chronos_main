import { useSelector } from "react-redux";

function useGetUsersList() {
  // const [userInfo, setUserInfo] = useState(initialState)

  const users = useSelector((state) => state.manage.userList);
  return users;
}

export default useGetUsersList;
