import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f8f9fa",
      color: "#333",
    }}
  >
    <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
    <h2 style={{ margin: "16px 0" }}>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link
      to="/"
      style={{
        marginTop: 24,
        padding: "10px 24px",
        background: "#990a78",
        color: "#fff",
        borderRadius: 4,
        textDecoration: "none",
      }}
    >
      Go to Home
    </Link>
  </div>
);
