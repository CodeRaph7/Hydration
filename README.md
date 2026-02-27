---

# 1️⃣ useState

## What it does
Allows you to add state (data that changes) inside a functional component.

## Syntax

```js
const [state, setState] = useState(initialValue);
```

## Example

```js
import { useState } from "react";
import { View, Text, Button } from "react-native";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increase" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

## Important Notes

- useState returns an array:
  - Current value
  - Function to update it
- Updating state causes a re-render
- State updates are asynchronous
- Never modify state directly

Wrong:
```js
count = count + 1;
```

Correct:
```js
setCount(count + 1);
```

---

# 2️⃣ useEffect

## What it does
Handles side effects:
- API calls
- Timers
- Subscriptions
- Event listeners
- Console logs

## Syntax

```js
useEffect(() => {
  // effect code

  return () => {
    // cleanup (optional)
  };
}, [dependencies]);
```

---

# 3️⃣ Most Important Patterns

## Run once (on mount)

```js
useEffect(() => {
  console.log("Mounted");
}, []);
```

## Run when a variable changes

```js
useEffect(() => {
  console.log("Count changed");
}, [count]);
```

## Cleanup on unmount

```js
useEffect(() => {
  const interval = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);
```

---

# 4️⃣ Component Lifecycle (Hooks Version)

| Class Component        | Hooks Version              |
|------------------------|---------------------------|
| componentDidMount      | useEffect(..., [])        |
| componentDidUpdate     | useEffect(..., [dep])     |
| componentWillUnmount   | return () => {}           |

---

# 5️⃣ Context API

Used to share global data without passing props manually.

Examples:
- Auth user
- Theme
- Language

---

## Step 1: Create Context

```js
import { createContext } from "react";

export const AuthContext = createContext();
```

## Step 2: Create Provider

```js
import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState("CheikhTi");

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Step 3: Wrap App

```js
<AuthProvider>
  <App />
</AuthProvider>
```

## Step 4: Use Context

```js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const { user } = useContext(AuthContext);
```

---

# 6️⃣ Rules of Hooks

Hooks must:

- Be called inside a function component
- Be called at the top level
- NOT inside loops
- NOT inside conditions
- NOT inside nested functions

Wrong:

```js
if (something) {
  useEffect(() => {});
}
```

Correct:

```js
useEffect(() => {
  if (something) {
    // logic
  }
}, [something]);
```

---

# 7️⃣ Props vs State vs Context

| Props | State | Context |
|-------|-------|---------|
| Passed from parent | Local to component | Global |
| Read-only | Can change | Shared |
| Immutable | Mutable via setter | Used with useContext |

---

# 8️⃣ Re-render Rules

Component re-renders when:
- State changes
- Props change
- Context value changes

Does NOT re-render when:
- Normal variables change

---

# 9️⃣ Quick Exam Answers

When does useEffect run?
→ After render.

Empty dependency array?
→ Runs once.

No dependency array?
→ Runs after every render.

Why cleanup?
→ Prevent memory leaks.

Why Context?
→ Avoid prop drilling.

---

# 🔟 Mental Model

useState → Memory  
useEffect → Side effects after render  
Context → Global shared state  
Re-render → React redraws UI#