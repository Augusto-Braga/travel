import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextProps {
  id: string | null;
  name: string | null;
  email: string | null;
}

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextValue extends UserContextProps {
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  id: null,
  name: null,
  email: null,
  fetchUser: async () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContextProps>({
    id: null,
    name: null,
    email: null,
  });

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch("http://localhost:4000/api/loggedUser", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.id, name: data.name, email: data.email });
      }
    }
  };

  return (
    <UserContext.Provider value={{ ...user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
