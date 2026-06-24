import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { AuthHelper, type UserProfile } from '@/shared/features/auth/helpers/AuthHelper';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: (u: UserProfile | null) => void;
  getUser: () => Promise<UserProfile | null>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  getUser: async () => null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().catch((err) => console.error('UserContext: getUser failed', err));
  }, []);

  const getUser = async (): Promise<UserProfile | null> => {
    try {
      const profile = AuthHelper.getUserProfile();
      setUser(profile ?? null);
      return profile;
    } catch (err) {
      console.error('UserContext: getUserProfile failed', err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
