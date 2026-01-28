import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Organization, User } from '../types';
import { mockOrganization, mockCurrentUser } from '../data/mockData';

interface AppContextType {
  organization: Organization;
  currentUser: User;
  isAdmin: boolean;
  setOrganization: (org: Organization) => void;
  setCurrentUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);

  const isAdmin = currentUser.role === 'org_admin';

  return (
    <AppContext.Provider value={{
      organization,
      currentUser,
      isAdmin,
      setOrganization,
      setCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
