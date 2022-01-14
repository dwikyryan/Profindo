import React, { useState } from "react";
import Axios from "axios";
import { http } from "../../http/http";

const Login = (props) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    Axios.get(`${http}/admin/get-admin`, {
      params: {
        id: id,
        password: password,
      },
    })
      .then((result) => {
        if (result.data.length !== 0) {
          localStorage.setItem("isLoggedIn", "1");
          props.onLogin(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const validation = id.trim().length !== 0 && password.trim().length > 5;

  return (
    <form>
      <div className="container mt-3">
        <div className="row">
          <div className="col-12 text-center ">
            <h1>Profindo Pharmacy Admin Dashboard</h1>
            <p className="lead">Dummy App for Profindo Assignment Test</p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-4 offset-4">
            <div className="card mb-5">
              <div className="card-body">
                <h5 className="font-weight-bold mb-3">Masuk</h5>
                <input
                  placeholder="ID Apoteker"
                  type="text"
                  className="form-control my-2"
                  onChange={(e) => setId(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="form-control my-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="d-flex flex-row justify-content-between align-items-center">
                  {validation ? (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={loginHandler}
                    >
                      Masuk
                    </button>
                  ) : (
                    <button className="btn btn-primary mt-2" disabled>
                      Masuk
                    </button>
                  )}
                </div>
                <div className="my-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
