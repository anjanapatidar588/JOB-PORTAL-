# 07 — AUTHORIZATION SYSTEM & ROLE-BASED ACCESS CONTROL (RBAC)

---

## 1. Authorization Overview

Authentication confirms **WHO** a user is. Authorization determines **WHAT** permissions a logged-in user possesses.

HireFlow implements a **Role-Based Access Control (RBAC)** model enforced on both the backend via `authorizeRoles.js` middleware and on the frontend via `ProtectedRoute.jsx`.

---

## 2. Implemented User Roles Matrix

The codebase defines 6 user roles in `user.model.js`:
- `candidate`: Regular job applicant.
- `student`: Alias candidate role.
- `employee`: Candidate/worker role.
- `recruiter`: Employer / Job recruiter.
- `coordinator`: Recruiter manager / Placement coordinator.
- `admin`: Super Administrator (unrestricted access).

### System Access Control Matrix

| Feature / Action | Candidate / Student | Recruiter / Coordinator | Admin |
| :--- | :---: | :---: | :---: |
| Browse & Search Public Jobs | Yes | Yes | Yes |
| Apply for Jobs | Yes | No | No |
| Saved Jobs / Bookmark | Yes | No | No |
| View Application Timeline | Yes | No | No |
| Register Company | No | Yes | Yes |
| Post New Job | No | Yes | Yes |
| Recruiter Dashboard & Analytics | No | Yes | Yes |
| Review Applicants for Job | No | Yes (Own / Company Jobs) | Yes (All Jobs) |
| Update Applicant Pipeline Status | No | Yes | Yes |

---

## 3. Role Normalization & Backend Authorization (`authorizeRoles.js`)

`authorizeRoles` is a higher-order middleware factory that accepts allowed role strings:

```javascript
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    let user = req.user;
    if (!user && req.id) {
      user = await User.findById(req.id).select("-password");
      req.user = user;
    }

    if (!user) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const userRole = (user.role || "").toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    // Admin override: Admin gets unrestricted access to all routes
    if (userRole === "admin") return next();

    // Check permissions + role aliases
    const isAllowed = normalizedAllowed.some(role => {
      if (role === userRole) return true;
      if ((role === "candidate" || role === "employee") && 
          (userRole === "candidate" || userRole === "employee" || userRole === "student")) return true;
      if (role === "student" && (userRole === "candidate" || userRole === "employee")) return true;
      return false;
    });

    if (!isAllowed) {
      return res.status(403).json({
        message: `Access denied. Role '${user.role}' is not authorized to perform this action.`,
        success: false,
      });
    }

    next();
  };
};
```

---

## 4. Frontend Route Guards (`ProtectedRoute.jsx`)

On the frontend, `<ProtectedRoute allowedRoles={[...]} />` wraps protected page components:

```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/login");
            return;
        }

        if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
            const userRole = (user.role || "").toLowerCase();
            if (userRole === "admin") return;

            const isAuthorized = allowedRoles.some(role => {
                const r = role.toLowerCase();
                if (r === userRole) return true;
                if (r === "candidate" && userRole === "student") return true;
                if (r === "student" && userRole === "candidate") return true;
                return false;
            });

            if (!isAuthorized) {
                navigate("/");
            }
        }
    }, [user, allowedRoles, navigate]);

    if (!user) return null;
    return <>{children}</>;
};
```
