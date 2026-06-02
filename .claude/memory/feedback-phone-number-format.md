---
name: feedback-phone-number-format
description: Phone number format rule — server uses long 84xxxxxxxxx, client displays 0xxxxxxxxx, always convert before sending
metadata:
  type: feedback
---

Always handle phone numbers with this rule:

- **Server returns**: long integer `84989902069`
- **Client displays**: string `"0989902069"`
- **Client sends to server**: long integer `84989902069`

**Why:** Backend stores phone as a long (E.164-like with country code 84). UI convention in Vietnam is to show local format with leading 0.

**How to apply:**
- On API response: call `formatPhone(raw.phone_number)` to convert to display format — do this inside the service layer (`normalizeProfile` in userService, raw map in addressService), not in components
- On API request (update profile, create order, create/update address): call `parsePhoneToServer(phone_string)` to convert back to long before sending
- Both helpers live in `@/helpers/format.ts`
- `formatPhone` is idempotent — safe to call on already-formatted strings
- `parsePhoneToServer` returns a `number`, not a string — match the server's long type
