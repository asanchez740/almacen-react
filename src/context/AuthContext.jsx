import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [permissions, setPermissions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => subscription.unsubscribe();

  }, []);

  const getSession = async () => {

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {

      setUser(null);
      setProfile(null);
      setPermissions([]);

      setLoading(false);

      return;
    }

    const user = session.user;

    setUser(user);

    // PROFILE + ROLE
    const { data: profileData } = await supabase
      .from("profiles")
      .select(`
        *,
        roles (
          id,
          nombre
        )
      `)
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // PERMISSIONS
    const { data: permissionsData } = await supabase
      .from("role_permissions")
      .select(`
        permissions (
          clave
        )
      `)
      .eq("role_id", profileData.role_id);

    const permissionsArray =
      permissionsData?.map(
        (p) => p.permissions.clave
      ) || [];

    setPermissions(permissionsArray);

    setLoading(false);
  };

  const login = async (email, password) => {

    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const logout = async () => {

    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissions,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);