import { IndexRoutes } from "./routes/IndexRoutes";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {

  return (
    <AuthenticationProvider>
      <IndexRoutes/>
    </AuthenticationProvider>
  )
}

export default App
