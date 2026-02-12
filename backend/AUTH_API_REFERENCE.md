# 🔐 PlaceIQ Authentication API Reference

Quick reference for all authentication methods available in `authService`.

---

## 📦 Import

```typescript
import { authService } from '../services/authService';
```

---

## 🔑 Registration Methods

### `registerStudent(email, password, fullName, department)`

Register a new student account.

**Parameters:**
- `email` (string) - Student's email address
- `password` (string) - Account password
- `fullName` (string) - Student's full name
- `department` (string, optional) - Default: `'AI & Data Science'`

**Returns:** Promise<AuthResponse>

**Example:**
```typescript
try {
  await authService.registerStudent(
    'student@college.edu',
    'securePassword123',
    'John Doe',
    'AI & Data Science'
  );
  // Redirect to dashboard
  navigate('/student/dashboard');
} catch (error) {
  console.error('Registration failed:', error);
}
```

**What happens:**
1. Creates user in `auth.users`
2. Trigger automatically creates entry in `user_roles` with role='student'
3. Trigger creates profile in `students` table
4. Security event logged in `user_security_logs`

---

### `registerMentor(email, password, fullName, expertise)`

Register a new mentor account.

**Parameters:**
- `email` (string) - Mentor's email address
- `password` (string) - Account password
- `fullName` (string) - Mentor's full name
- `expertise` (string) - Area of expertise

**Returns:** Promise<AuthResponse>

**Example:**
```typescript
try {
  await authService.registerMentor(
    'mentor@company.com',
    'securePassword123',
    'Dr. Jane Smith',
    'Machine Learning'
  );
  navigate('/mentor/dashboard');
} catch (error) {
  console.error('Registration failed:', error);
}
```

---

## 🔐 Login Methods

### `loginUser(email, password)`

Login with email and password.

**Parameters:**
- `email` (string) - User's email
- `password` (string) - User's password

**Returns:** Promise<{ user, session, role }>

**Example:**
```typescript
try {
  const { user, role } = await authService.loginUser(
    'user@example.com',
    'password123'
  );
  
  // Check role and redirect accordingly
  if (role === 'student') {
    navigate('/student/dashboard');
  } else if (role === 'mentor') {
    navigate('/mentor/dashboard');
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

**What happens:**
1. Authenticates user with Supabase
2. Fetches user role from `user_roles` table
3. Logs security event
4. Returns user data with role

---

### `signInWithGoogleStudent()`

Sign in with Google as a student.

**Parameters:** None

**Returns:** Promise<OAuthResponse>

**Example:**
```typescript
const handleGoogleSignIn = async () => {
  try {
    await authService.signInWithGoogleStudent();
    // User will be redirected to Google, then back to /student/dashboard
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
};
```

**Redirect:** Automatically redirects to `/student/dashboard` after authentication

---

### `signInWithGoogleMentor()`

Sign in with Google as a mentor.

**Parameters:** None

**Returns:** Promise<OAuthResponse>

**Example:**
```typescript
const handleGoogleSignIn = async () => {
  try {
    await authService.signInWithGoogleMentor();
    // User will be redirected to Google, then back to /mentor/dashboard
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
};
```

**Redirect:** Automatically redirects to `/mentor/dashboard` after authentication

---

## 🚪 Logout Method

### `logoutUser()`

Sign out the current user.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```typescript
const handleLogout = async () => {
  try {
    await authService.logoutUser();
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

**What happens:**
1. Logs security event (logout)
2. Clears Supabase session
3. User is signed out

---

## 🔄 Password Management

### `resetPassword(email)`

Send password reset email.

**Parameters:**
- `email` (string) - User's email address

**Returns:** Promise<void>

**Example:**
```typescript
const handlePasswordReset = async (email: string) => {
  try {
    await authService.resetPassword(email);
    alert('Password reset email sent! Check your inbox.');
  } catch (error) {
    console.error('Password reset failed:', error);
  }
};
```

**Redirect:** Email contains link to `/update-password`

---

### `updatePassword(newPassword)`

Update user's password (after reset).

**Parameters:**
- `newPassword` (string) - New password

**Returns:** Promise<void>

**Example:**
```typescript
const handleUpdatePassword = async (newPassword: string) => {
  try {
    await authService.updatePassword(newPassword);
    alert('Password updated successfully!');
    navigate('/login');
  } catch (error) {
    console.error('Password update failed:', error);
  }
};
```

---

### `resendVerification(email)`

Resend email verification.

**Parameters:**
- `email` (string) - User's email address

**Returns:** Promise<void>

**Example:**
```typescript
try {
  await authService.resendVerification('user@example.com');
  alert('Verification email sent!');
} catch (error) {
  console.error('Failed to resend verification:', error);
}
```

---

## 👤 User Information Methods

### `fetchCurrentUser()`

Get current authenticated user with profile.

**Parameters:** None

**Returns:** Promise<User & { role, profile } | null>

**Example:**
```typescript
const loadUserProfile = async () => {
  try {
    const user = await authService.fetchCurrentUser();
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('Role:', user.role);
      console.log('Profile:', user.profile);
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};
```

**Returns:**
```typescript
{
  id: string,
  email: string,
  role: 'student' | 'mentor' | 'admin',
  profile: {
    // Student profile or Mentor profile data
    full_name: string,
    // ... other fields
  }
}
```

---

### `fetchUserRole(userId)`

Get user's role by user ID.

**Parameters:**
- `userId` (string) - User's UUID

**Returns:** Promise<'student' | 'mentor' | 'admin' | null>

**Example:**
```typescript
const checkRole = async (userId: string) => {
  try {
    const role = await authService.fetchUserRole(userId);
    console.log('User role:', role);
  } catch (error) {
    console.error('Failed to fetch role:', error);
  }
};
```

---

### `trackSecurityEvent(userId, eventType)`

Manually log a security event.

**Parameters:**
- `userId` (string) - User's UUID
- `eventType` ('login' | 'logout' | 'reset' | 'fail' | 'register')

**Returns:** Promise<void>

**Example:**
```typescript
// Usually called automatically, but can be used manually
await authService.trackSecurityEvent(
  user.id,
  'login'
);
```

---

## 🛡️ Error Handling

All methods throw errors that should be caught:

```typescript
try {
  await authService.loginUser(email, password);
} catch (error) {
  if (error instanceof Error) {
    // Handle specific error messages
    if (error.message.includes('Invalid login credentials')) {
      setError('Wrong email or password');
    } else if (error.message.includes('Email not confirmed')) {
      setError('Please verify your email first');
    } else {
      setError(error.message);
    }
  }
}
```

---

## 🔄 Common Patterns

### Protected Route Check

```typescript
useEffect(() => {
  const checkAuth = async () => {
    const user = await authService.fetchCurrentUser();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'student') {
      navigate('/unauthorized');
    }
  };
  
  checkAuth();
}, []);
```

### Login with Role Validation

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const { user } = await authService.loginUser(email, password);
    
    if (user) {
      const role = await authService.fetchUserRole(user.id);
      
      // Ensure user is logging into correct portal
      if (role !== 'student') {
        await authService.logoutUser();
        throw new Error('Please use the Mentor login page.');
      }
      
      navigate('/student/dashboard');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### OAuth with Error Handling

```typescript
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    await authService.signInWithGoogleStudent();
    // Redirect happens automatically
  } catch (error) {
    console.error('Google sign-in error:', error);
    setError('Failed to sign in with Google. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Database Tables Affected

### Registration
- `auth.users` - User authentication
- `user_roles` - Role assignment
- `students` OR `mentors` - Profile data
- `user_security_logs` - Registration event

### Login
- `auth.users` - Session creation
- `user_security_logs` - Login event

### Logout
- `auth.users` - Session termination
- `user_security_logs` - Logout event

---

## 🎯 Best Practices

1. **Always handle errors** - Show user-friendly messages
2. **Validate role** - Check user role before allowing access
3. **Log security events** - Track important user actions
4. **Use loading states** - Show feedback during async operations
5. **Clear sensitive data** - Don't store passwords in state
6. **Redirect appropriately** - Send users to correct dashboard based on role

---

## 🔗 Related Files

- `src/services/authService.ts` - Service implementation
- `src/lib/supabase.ts` - Supabase client
- `src/types/database.types.ts` - TypeScript types
- `backend/schema.sql` - Database schema

---

**Need more help?** Check the [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
