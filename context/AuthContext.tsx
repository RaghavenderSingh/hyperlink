"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  publicKey: string;
  privateKey: string | any;
}

type AuthAction =
  | {
      type: "LOGIN";
      payload: { user: any; publicKey: string; privateKey: string | any };
    }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  publicKey: "",
  privateKey: "",
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload.user,
        publicKey: action.payload.publicKey,
        privateKey: action.payload.privateKey,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing auth state in localStorage on initial load
    const storedAuth = localStorage.getItem("authState");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      dispatch({
        type: "LOGIN",
        payload: {
          user: authData.user,
          publicKey: authData.publicKey,
          privateKey: authData.privateKey,
        },
      });
    }
  }, []);

  useEffect(() => {
    // Update localStorage when auth state changes
    if (state.isAuthenticated) {
      localStorage.setItem(
        "authState",
        JSON.stringify({
          user: state.user,
          publicKey: state.publicKey,
          privateKey: state.privateKey,
        })
      );
    } else {
      localStorage.removeItem("authState");
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
