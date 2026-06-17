import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="navbar-custom py-3 shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src={logo}
            alt="PodPadre Logo"
            width="70"
            height="70"
            style={{ objectFit: "contain" }}
          />

          <div>
            <h1
              className="m-0 fw-bold"
              style={{
                fontSize: "1.8rem",
                color: "var(--text-dark)",
                lineHeight: "1",
              }}
            >
              PodPadre
            </h1>

            <small
              style={{
                color: "#8a7b6a",
                letterSpacing: "1px",
              }}
            >
              Fé • História • Curiosidades
            </small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="nav-item-custom">
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;