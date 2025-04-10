import { createContext, useContext, useReducer } from 'react';
import { fetchApplications } from '../services/api';

const ApplicationContext = createContext();

const applicationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    // Add other cases
    default:
      return state;
  }
};

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, {
    applications: [],
    loading: false,
    filters: {}
  });

  const getApplications = async (filters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await fetchApplications(filters);
      dispatch({ type: 'SET_APPLICATIONS', payload: data });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ApplicationContext.Provider value={{ ...state, getApplications }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationContext);