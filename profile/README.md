# Profile Page Feature

## Overview

The profile page allows logged-in users to view and edit their personal information, as well as update their password.

## Features

### 1. View Profile

- Display user's first name, last name, email, and location
- Clean, modern interface with user avatar
- Protected route - redirects to homepage if not logged in

### 2. Edit Profile

- Update first name, last name, email, and location
- Form validation to ensure all fields are filled
- Email uniqueness check to prevent duplicates
- Changes are saved to localStorage and reflected immediately

### 3. Change Password

- Verify current password before allowing change
- New password must be at least 6 characters
- Confirmation field to prevent typos
- New password must be different from current password

### 4. Navigation

- Consistent navigation bar across all pages
- Active state shows current page
- Responsive mobile menu with smooth animations
- Links to Home, Marketplace, Orders, and Contact

## Technical Details

### Files Created

- `/profile/profile.html` - Profile page structure
- `/profile/profile.css` - Profile page styling
- `/profile/profile.js` - Profile functionality

### Files Modified

- `/index.html` - Added Profile link to desktop and mobile navigation
- `/marketplace/market.html` - Added Profile link to navbar
- `/marketplace/cereals.html` - Added Profile link to navbar
- `/marketplace/legumes.html` - Added Profile link to navbar
- `/marketplace/tubers.html` - Added Profile link to navbar
- `/orders/orders.html` - Added Profile link to desktop and mobile navigation

### Data Structure

User data is stored in localStorage with the following structure:

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  location: "South-East",
  password: "hashedPassword"
}
```

### Security Features

- Authentication check on page load
- Password verification before updates
- Email uniqueness validation
- Minimum password length requirement

### Responsive Design

- Desktop: Horizontal navigation with hover effects
- Tablet (< 768px): Mobile menu toggle appears
- Mobile (< 500px): Optimized layout with stacked forms

## Usage

### Accessing the Profile Page

1. User must be logged in
2. Click "Profile" in the navigation bar
3. Or navigate directly to `/profile/profile.html`

### Editing Profile Information

1. Click the "Edit Profile" button
2. Update the desired fields
3. Click "Save Changes" to persist updates
4. Click "Cancel" to discard changes

### Changing Password

1. Enter in edit mode
2. Scroll to "Change Password" section
3. Enter current password
4. Enter and confirm new password
5. Click "Update Password"

## Future Enhancements

- Profile picture upload
- Email verification
- Two-factor authentication
- Account deletion option
- Order history summary on profile page
- Password strength indicator
