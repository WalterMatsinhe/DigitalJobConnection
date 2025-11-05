# Toast Notification System Documentation

## Overview
A modern, beautiful toast notification system integrated throughout the DigitalJobConnection application. Supports success, error, info, and warning messages with smooth animations.

## Features
- ✨ **4 Toast Types**: Success, Error, Info, Warning
- 🎨 **Beautiful UI**: Matches the project's modern design system
- ⏱️ **Auto-dismiss**: Customizable duration (default 4 seconds)
- 🎭 **Smooth Animations**: Fade and scale transitions
- ♿ **Icons**: Lucide React icons for visual clarity
- 🚫 **Manual Dismiss**: Close button on each toast
- 📱 **Responsive**: Works perfectly on all screen sizes

## Installation

### 1. Make sure lucide-react is installed:
```bash
npm install lucide-react
```

### 2. Files Created:
- `src/context/ToastContext.tsx` - Toast state management
- `src/components/ui/Toast.tsx` - Toast component
- `src/components/layout/ToastContainer.tsx` - Toast container

### 3. Updated Files:
- `src/App.tsx` - Added ToastProvider wrapper and ToastContainer

## Usage

### Basic Usage
```tsx
import { useToast } from '../context/ToastContext'

export default function MyComponent() {
  const { addToast } = useToast()

  const handleClick = () => {
    addToast('This is a success message!', 'success')
  }

  return <button onClick={handleClick}>Show Toast</button>
}
```

### API

#### useToast() Hook
Returns an object with the following methods:

```tsx
const { addToast, removeToast, clearAll, toasts } = useToast()
```

**Methods:**
- `addToast(message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number): string`
  - Adds a new toast and returns its ID
  - Default duration: 4000ms
  - Pass 0 for infinite duration (manual dismiss only)

- `removeToast(id: string): void`
  - Removes a toast by ID

- `clearAll(): void`
  - Clears all toasts

- `toasts: ToastMessage[]`
  - Array of all current toasts

### Toast Types

#### Success
```tsx
addToast('Registration successful!', 'success')
```
- Green background (#dcfce7)
- CheckCircle icon
- Default duration: 4 seconds

#### Error
```tsx
addToast('Something went wrong!', 'error')
```
- Red background (#fee2e2)
- AlertCircle icon
- Default duration: 4 seconds

#### Warning
```tsx
addToast('Please be careful!', 'warning')
```
- Yellow background (#fef3c7)
- AlertTriangle icon
- Default duration: 4 seconds

#### Info
```tsx
addToast('Here is some information', 'info')
```
- Blue background (#dbeafe)
- Info icon
- Default duration: 4 seconds

### Custom Duration

```tsx
// Show for 2 seconds
addToast('Quick message', 'info', 2000)

// Show indefinitely (user must click close)
addToast('Important notice', 'warning', 0)
```

## Examples

### Registration Form
```tsx
const submit = async (e: React.FormEvent) => {
  try {
    const res = await client.post('/register', payload)
    if (res.data?.success) {
      addToast('Registration successful!', 'success', 1500)
      setTimeout(() => navigate('/login'), 1500)
    }
  } catch (err: any) {
    addToast(err?.response?.data?.message || 'Server error', 'error')
  }
}
```

### Login Form
```tsx
const submit = async (e: React.FormEvent) => {
  try {
    const res = await client.post('/login', { email, password })
    if (res.data?.success) {
      addToast('Login successful!', 'success', 1200)
      login(res.data.user)
      setTimeout(() => navigate('/dashboard'), 1200)
    }
  } catch (err: any) {
    addToast('Invalid credentials', 'error')
  }
}
```

## Styling

The toast system uses Tailwind CSS classes for styling. Colors are optimized to match the project's design system:

- **Success**: Green accent (#10b981)
- **Error**: Red accent (#ef4444)
- **Warning**: Yellow accent (#f59e0b)
- **Info**: Blue accent (#3b82f6)

All toasts have:
- Rounded corners (0.5rem)
- Box shadow for depth
- Backdrop blur effect
- Smooth transitions

## Accessibility

- All toasts have proper color contrast
- Icons provide visual cues
- Close button easily accessible
- Messages clear and concise
- Auto-dismiss respects user preferences (can be disabled)

## Best Practices

1. **Keep messages concise**: Users read toasts quickly
2. **Use appropriate type**: Match the message severity
3. **Set appropriate duration**: 
   - Errors: 5-6 seconds
   - Success: 2-3 seconds
   - Warnings: 4-5 seconds
   - Info: 3-4 seconds
4. **Avoid too many toasts**: Stack limit recommended at 3-4
5. **Use loading states**: For long operations, show spinner instead

## Integration Points

Currently integrated with:
- ✅ `Register.tsx` - Registration success/error
- ✅ `Login.tsx` - Login success/error
- Ready for more integrations in other pages

## Future Enhancements

- [ ] Toast history/log
- [ ] Position customization (top, bottom, left, right)
- [ ] Progress bar for duration
- [ ] Sound notifications (optional)
- [ ] Undo action toasts
- [ ] Toast grouping (collapse duplicates)
