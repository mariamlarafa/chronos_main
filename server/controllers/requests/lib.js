import { REQUEST_STATE_TRANSLATION } from "../../constants/constants.js";

export function serializeRequest(request) {
  let obj = request.toJSON();

  obj.file = obj.file?JSON.parse(obj.file):[]
  obj.state = REQUEST_STATE_TRANSLATION.filter(
    (reqState) => reqState.value === obj.state
  )[0]?.label;
  return obj;
}
export function serializeRequestList(requests) {
  const serialized = [];
  requests.forEach((element) => {
    let obj = serializeRequest(element);
    serialized.push(obj);
  });

  return serialized;
}
