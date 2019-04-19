import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

export const StateContext = createContext();

export const StateContextProvider = ({ reducer, initialState, children }) => {
  console.log("StateContextProvider updated")
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

StateContextProvider.propTypes = {
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

export const getStateContext = () => useContext(StateContext);
