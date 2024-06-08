import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import './App.css';
import Message from "./components/Message";

function App() {
  return (
    <div >
      <Header />
      <Message>This is a beta version of the main product. I'm stil working on it. End product will be deployed soon.</Message>{/*Will be remove the line once fully developed.*/}
      <main className="py-3">
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
