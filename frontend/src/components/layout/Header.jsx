const Header = (props) => {
  return (
    <>
      <nav className="navbar navbar-light bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">
            Profindo Pharmacy <i className="fas fa-pills"></i>
          </a>
          <form className="d-flex">
            {props.isLogin && (
              <button className="btn btn-danger" onClick={props.onLogout}>
                Log Out
              </button>
            )}
          </form>
        </div>
      </nav>
    </>
  );
};

export default Header;
