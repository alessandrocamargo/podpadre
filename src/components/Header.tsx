import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const menuItems = [
  { label: "Início", to: "/" },
  { label: "Curiosidades", to: "/curiosidades" },
  { label: "História", to: "/historia" },
  { label: "Sobre", to: "/sobre" },
];

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="navbar-custom py-3 shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-3 brand-custom"
        >
          <img
            src={logo}
            alt="PodPadre Logo"
            width="64"
            height="64"
            className="brand-logo"
          />

          <div className="brand-copy">
            <div className="brand-title">PodPadre</div>
            <small className="brand-subtitle">Fé • História • Curiosidades</small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" className="navbar-toggle-custom" />

        <Navbar.Collapse id="main-navbar-nav" className="justify-content-end">
          <Nav className="align-items-lg-center gap-lg-2 nav-menu">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.label}
                as={Link}
                to={item.to}
                className="nav-item-custom"
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;