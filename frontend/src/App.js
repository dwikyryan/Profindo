import { Fragment, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/layout/Header";
import Drugs from "./components/main/Drugs";
import Login from "./components/main/Login";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [admin, setAdmin] = useState();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn === "1") {
      setIsLogin(true);
    }
    setAdmin();
  }, []);

  const onLogin = (adminData) => {
    setAdmin(adminData);
    setIsLogin(true);
  };
  const onLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLogin(false);
  };
  return (
    <Fragment>
      <Header isLogin={isLogin} onLogout={onLogout} />
      {!isLogin && <Login onLogin={onLogin} />}
      {isLogin && <Drugs onAdmin={admin} />}
    </Fragment>
  );
}

export default App;
