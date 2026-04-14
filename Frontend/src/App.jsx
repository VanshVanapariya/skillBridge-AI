import { RouterProvider } from "react-router-dom";
import { router } from "./app.routs";
import { AuthProvider } from "./features/auth/auth.context";

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
