export const getUserId = () => {
  let userId = localStorage.getItem("tempUserId");
  if (!userId) {
    userId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "fallback-id";
    localStorage.setItem("tempUserId", userId);
  }
  return userId;
}


