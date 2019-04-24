import React, { createContext, useContext, useReducer } from "react";

// Todo: add comments. Component purpose!
export const SharedContext = createContext();

export const SharedContextProvider = ({ reducer, initialState, children }) => {
  return (
    <SharedContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => useContext(SharedContext);
