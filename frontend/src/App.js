import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div >
      <Header />
      <main className="py-6">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
