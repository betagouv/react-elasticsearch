import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

export const SharedContext = createContext();

export const SharedContextProvider = ({ reducer, initialState, children }) => {
  return (
    <SharedContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </SharedContext.Provider>
  );
};

SharedContextProvider.propTypes = {
  /**
   * @return {React.Node}
   */
  children: PropTypes.node.isRequired,

  /**
   * Object containing initial state value.
   */
  initialState: PropTypes.shape({}).isRequired,

  /**
   *
   * @param {object} state
   * @param {object} action
   */
  reducer: PropTypes.func.isRequired
};

export const useSharedContext = () => useContext(SharedContext);
