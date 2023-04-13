import EventBus from "./EventBus";

export function notUserModalHandler() {
  let user = JSON.parse(localStorage.getItem("user") as string);
  if (!user) {
    EventBus.emit("openNotUserModal");
    return false;
  }
  return true;
}
