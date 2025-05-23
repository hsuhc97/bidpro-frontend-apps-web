import { getUser } from "@bidpro-frontend/shared";

export const useUser = () => {
  const refresh = async () => {
    const user = await getUser();
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  };

  return {
    refresh,
  };
};
