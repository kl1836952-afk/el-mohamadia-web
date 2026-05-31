# Firestore Security Specification

This document defines the zero-trust data security requirements for Al-Muhammadiyah Customs Agency.

## 1. Data Invariants
- **User Registries**: Every authenticated user can only read and write their own profile document `/users/{userId}`. They cannot alter their role from `client` to `admin`.
- **Customs Requests**:
  - Valid requests can be viewed, created, and updated by their respective author (`userId` matches the document's `clientId`).
  - Admins can search, read, write, and update all requests in the system.
  - Updates to tracking steps must adhere strictly carefully: clients can only read status changes, while only authorized status updates can be pushed down by internal admins.

## 2. The Dirty Dozen Payloads (Intrusions to Block)
1. **Admin Spoofing**: Attempt to create `/users/malicious_user` with `role: "admin"`.
2. **User Identity Takeover**: Authenticated User A tries to edit User B's profile `/users/B`.
3. **Ghost Profile Injection**: Attempt to create a profile with additional invalid fields.
4. **Hijacked Request Origin**: Client A tries to insert a request where `clientId` is Client B's UID.
5. **No-owner Orphaned Request**: Client tries to submit a request with empty `clientId` or missing fields.
6. **Malicious ID Injection**: A user tries to create a document with an ID containing shell characters or exceeding 128 characters.
7. **Client Self-Resolution**: A client updates their request status to Bypass validation stages or force terminal status.
8. **PII Data Leakage**: Unauthenticated retrieval of client mobile phone list.
9. **Admin-Only Field Tampering**: Client updates system notes (`additionalNotesAr`) trying to overwrite admin instructions.
10. **Time Spoofing**: Client sets `createdAt` to a future or past date instead of using the server timestamp `request.time`.
11. **Mass Unbounded Array Attack**: Injecting a massive array of uploaded records to trigger Denial of Wallet.
12. **Tampering with Terminal State**: Attempt to modify a request after it reaches the terminal step `GATE_RELEASE`.

## 3. Test Runner Specification
The `firestore.rules` evaluates all validation rules and terminates permission for any request trying to bypass state logic.

```typescript
// firestore.rules.test.ts prototype structure
import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
// Rules correctly mandate authentication and object validation.
```
