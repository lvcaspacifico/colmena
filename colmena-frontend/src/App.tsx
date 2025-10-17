import { IndexRoutes } from "./routes/IndexRoutes";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";

function App() {

  return (
    <AuthenticationProvider>
      <IndexRoutes/>
    </AuthenticationProvider>
  )
}

export default App
