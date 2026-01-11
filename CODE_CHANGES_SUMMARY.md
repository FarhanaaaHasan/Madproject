# Code Changes Summary

This document summarizes all the changes made during the Firebase to Supabase migration.

## Files Modified

### 1. Configuration Files

#### Backend Configuration

- **File**: `backend/src/config/supabase.ts` (NEW)
  - Initializes Supabase client with service role key
  - Used for backend API operations

#### Frontend Configuration

- **File**: `lib/supabase-config.ts` (NEW)

  - Initializes Supabase client for React Native/Expo
  - Uses public anon key for client-side operations

- **File**: `config/supabase.ts` (NEW)
  - Web version of Supabase configuration
  - Used for web deployment

### 2. Backend Services Updated

All services in `backend/src/services/` have been migrated from Firestore to PostgreSQL via Supabase:

#### `medicationService.ts`

**Changes:**

- `import { db } from '../config/firebase'` → `import { supabase } from '../config/supabase'`
- Firestore collection queries → Supabase table queries
- `db.collection('medications').add()` → `supabase.from('medications').insert()`
- `db.collection('medications').where()` → `supabase.from('medications').select().eq()`
- Firestore timestamps `.toDate()` → JavaScript `new Date()` conversion
- Table names changed: `medications` (same), `healthLogs` → `health_logs`, `userProfiles` → `user_profiles`, `appointments` (same)

#### `healthLogService.ts`

**Changes:**

- Similar to medication service
- Table name: `healthLogs` → `health_logs`
- Query filters work with `.eq()` and `.select().eq()`

#### `profileService.ts`

**Changes:**

- Profile lookup: `where('userId')` → `.eq('user_id')`
- Table name: `userProfiles` → `user_profiles`
- Document ID → `user_id` field for lookup

#### `appointmentService.ts`

**Changes:**

- Similar migration to other services
- Table remains `appointments`
- All Firestore operations → Supabase equivalents

### 3. Frontend Authentication

#### `hooks/use-auth.tsx`

**Major Changes:**

```typescript
// OLD - Firebase
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";

// NEW - Supabase
import { supabase } from "@/config/supabase";

// User object changed:
// OLD: { uid, email, displayName }
// NEW: { id, email, user_metadata.name }

// Session management changed:
// OLD: onAuthStateChanged subscription
// NEW: getSession() + onAuthStateChange subscription

// Sign up changed:
// OLD: createUserWithEmailAndPassword + updateProfile
// NEW: signUp with metadata options

// Sign out changed:
// OLD: firebaseSignOut(auth)
// NEW: supabase.auth.signOut()
```

### 4. Configuration Files

#### `app.config.js`

**Changes:**

```javascript
// OLD
extra: {
  FIREBASE_API_KEY: ...,
  FIREBASE_AUTH_DOMAIN: ...,
  FIREBASE_PROJECT_ID: ...,
  // ... more Firebase keys
}

// NEW
extra: {
  EXPO_PUBLIC_SUPABASE_URL: ...,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: ...,
}
```

#### `app.json`

- No changes needed

### 5. Package Dependencies

#### Backend `package.json`

```json
// REMOVED
"firebase-admin": "^12.0.0"

// ADDED
"@supabase/supabase-js": "^2.38.4"
```

#### Frontend `package.json`

```json
// KEPT (still needed for other features)
"firebase": "^12.7.0"

// ADDED
"@supabase/supabase-js": "^2.38.4"
```

### 6. Environment Variables

#### `.env.example`

**Changes:**

```bash
# OLD - Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# NEW - Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

### 7. Deleted Files

These Firebase configuration files were deleted:

- `backend/src/config/firebase.ts`
- `lib/firebase-config.ts`
- `config/firebase.ts`

## Key API Changes

### Authentication

**Before (Firebase):**

```typescript
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
console.log(user.uid, user.email, user.displayName);
```

**After (Supabase):**

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
const user = data.user;
console.log(user.id, user.email, user.user_metadata?.name);
```

### Database Operations

**Before (Firestore):**

```typescript
const snapshot = await db
  .collection("medications")
  .where("userId", "==", userId)
  .orderBy("createdAt", "desc")
  .get();

const medications = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
  createdAt: doc.data().createdAt.toDate(),
}));
```

**After (Supabase/PostgreSQL):**

```typescript
const { data, error } = await supabase
  .from("medications")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

const medications = (data || []).map((doc) => ({
  id: doc.id,
  ...doc,
  createdAt: new Date(doc.created_at),
}));
```

## Database Schema Mapping

### Table Names

| Firestore Collection | PostgreSQL Table |
| -------------------- | ---------------- |
| `medications`        | `medications`    |
| `healthLogs`         | `health_logs`    |
| `userProfiles`       | `user_profiles`  |
| `appointments`       | `appointments`   |

### Field Names

| Firestore   | PostgreSQL   |
| ----------- | ------------ |
| `userId`    | `user_id`    |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |
| Document ID | `id` (UUID)  |

### User Reference

| Firestore               | Supabase                          |
| ----------------------- | --------------------------------- |
| `userId` (stored field) | `user_id` (references auth.users) |
| Manual user matching    | Foreign key constraint            |

## Testing the Migration

### Test Authentication

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test Data Operations

```bash
# Create medication
curl -X POST http://localhost:3000/api/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "Daily"
  }'
```

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS policies

   - Users can only access their own data
   - Enforced at the database level

2. **Key Management**:

   - Frontend: Uses public `anon` key (limited permissions)
   - Backend: Uses `service_role` key (full permissions)
   - Never expose service_role key in frontend

3. **API Validation**:
   - Backend validates all requests
   - User ID extracted from JWT token
   - Permissions checked before database operations

## Performance Notes

- Supabase/PostgreSQL indexes created for better query performance
- All queries include proper `select()` specifications to limit data transfer
- Pagination can be added with `.range()` method if needed

## Migration Status

✅ Backend services updated
✅ Frontend authentication updated
✅ Environment variables configured
✅ Database configuration files created
✅ Old Firebase files deleted
✅ Documentation created

📝 Next: Create database tables in Supabase dashboard and test the application
