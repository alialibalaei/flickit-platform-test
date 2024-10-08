import React, { useReducer, FC, useContext, useMemo } from "react";
import { createService, TService } from "@service";
import { authActions, useAuthContext } from "../AuthProvider";
import serviceReducer from "./reducer";

interface IServiceProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IServiceContext {
  service: TService;
}

export const ServiceContext = React.createContext<IServiceContext>({
  service: {} as any,
});

export const ServiceProvider: FC<IServiceProviderProps> = ({ children }) => {
  const { dispatch: authDispatch, accessToken } = useAuthContext();
  const signOut = () => authDispatch(authActions.signOut());
  const setAccessToken = (token: string) =>
    authDispatch(authActions.setAccessToken(token));

  // we create the service once
  const service = useMemo(
    () => createService(signOut, accessToken, setAccessToken),
    [],
  );

  const [state] = useReducer(serviceReducer, { service });

  return (
    <ServiceContext.Provider value={state}>{children}</ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
