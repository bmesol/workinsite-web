import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper';
import type { UserProfile } from '@/shared/features/auth/helpers/AuthHelper';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: (u: UserProfile | null) => void;
  getUser: () => UserProfile | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  getUser: () => null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // AuthHelper reads synchronously from localStorage, so we can hydrate
  // state immediately without an async effect/loading phase.
  const [user, setUser] = useState<UserProfile | null>(() =>
    AuthHelper.getUserProfile(),
  );
  const [loading] = useState(false);

  const getUser = useCallback((): UserProfile | null => {
    const profile = AuthHelper.getUserProfile();
    setUser(profile ?? null);
    return profile;
  }, []);

  const value = useMemo(
    () => ({ user, loading, setUser, getUser }),
    [user, loading, getUser],
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);