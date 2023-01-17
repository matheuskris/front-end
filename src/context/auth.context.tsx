import React, { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export type DecodedUser = {
  email: string;
  exp: number;
  iat: number;
  id: string;
  username: string;
};

export type UserData = {
  createdAt?: string;
  email: string;
  id: string;
  token?: string;
  username: string;
  exp?: number;
  lat?: number;
};

type AuthContextType = {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => null,
});

const AuthProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const token = localStorage.getItem("hiSocialJwtToken");

    if (currentUser?.token) {
      localStorage.setItem("hiSocialJwtToken", currentUser.token);
    } else if (token) {
      const decodeToken = jwtDecode<DecodedUser>(token);

      if (currentUser?.username !== decodeToken.username) {
        setCurrentUser(decodeToken);
      }
    }
  }, [currentUser]);

  return <AuthContext.Provider value={value} {...props} />;
};

export default AuthProvider;
