import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ requireAdmin = true }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        // 1. Get current active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // 2. Optional: Verify admin role from user metadata or profile table
        if (requireAdmin) {
          // Checks custom user_metadata OR queries public profiles table
          const userRole = session.user.user_metadata?.role;
          
          if (userRole === "admin") {
            setIsAdminUser(true);
          } else {
            // Alternative: check profiles table if role is stored in DB
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();

            setIsAdminUser(profile?.role === "admin");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for auth state changes (login/logout events)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [requireAdmin]);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <p>Verifying admin permissions...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but not an admin -> Redirect to home/unauthorized page
  if (requireAdmin && !isAdminUser) {
    return <Navigate to="/" replace />;
  }

  // Authorized -> Render child routes
  return <Outlet />;
}

export default ProtectedRoute;