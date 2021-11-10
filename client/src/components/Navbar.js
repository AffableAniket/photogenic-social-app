import {Link,useHistory} from 'react-router-dom';
import {useContext,useState,useEffect,useRef} from "react";
import {UserContext} from ".././App"
import M from "materialize-css";


function Navbar(){
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [windowResize,setWindowResize] = useState(window.innerWidth);
    const [searchResults,setSearchResults] = useState([]);
    const [closeSearch,setCloseSearch] = useState(false);

    const showSearch = useRef(null);
   M.AutoInit();
  const [search,setSearch] = useState("");
    const handleResize = () => {
       setWindowResize(window.innerWidth);
    }

    const handleSearch = (value) => {
       setSearch(value);
      fetch("/search-user",{
          method: "POST",
          headers: {
          "Content-Type" : "application/json"
         },
         body: JSON.stringify({query:value})
        }).then(res => res.json()).then((data) => {setSearchResults(data.user)})

  }
     const setSearchModal = () => {
        if(closeSearch){
          M.Modal.getInstance(showSearch.current).close();
          setCloseSearch(false);
          return
          }
        else{
             M.Modal.init(showSearch.current);
             setCloseSearch(true);
            return
             }
     }
     useEffect(() => {
             if(windowResize<996){
                      setWindowResize(window.innerWidth);
                  }
       },[windowResize])
    useEffect(() => {
       window.addEventListener("resize",handleResize);
    },[])
  const renderList = () => {

     if(state){
       return [
             <li><i data-target="modal1" onClick={() => {setSearchModal();}} className="btn modal-trigger small material-icons">search</i></li>,
             <li><Link to="/">Explore  </Link></li>,
             <li><Link to="/home">Home  </Link></li>,
             <li><Link to="/mypost">Profile </Link></li>,
             <li><Link to="/post">Post  </Link></li>,
            <li className={(windowResize<996)?"log-nav":"log-out"}  onClick={() => {dispatch({type:"CLEAR"}); localStorage.clear();history.push("/signin");}}>
             Logout
               </li>
         ]

     }
     else{
       return [
         <li ><Link to="/signup">Signup</Link></li>,
         <li><Link to="/signin">Login </Link></li>
       ]

     }
  }
    const handleNav = () => {
        if(windowResize<=996){

            return (
              <ul className="sidenav" id="mobile-demo">
              {renderList()}
               </ul>
             )
          }
         return null
   }
  return (
<>
{(handleNav()===null)?null:handleNav()}
    <nav>
    <div className="nav-wrapper nav-container">
      <a className="brand-logo">  <i className="large material-icons logo">camera</i> <span className="logo-name">Photogenic</span></a>
  <a data-target="mobile-demo" class="sidenav-trigger"><i id="menu-nav" class="material-icons">menu</i></a>
 <ul className="right hide-on-med-and-down">
{(handleNav()===null)?renderList():null}
   </ul>
    </div>
    <div id="modal1" className="modal no-autoinit" ref={showSearch} >
        <div className="modal-content">
  <input placeholder="Enter Email" autoComplete="off" type="email" name="search" value={search} onChange={(e) => handleSearch(e.target.value)} />
        <ul className="collection">
           {searchResults.map((item,i) => {
            return <Link to={state?(state._id!==item._id)? `/mypost/${item._id}`:`/mypost`:null}
             onClick={() => {setSearch("");setSearchModal();}}><li key={i} className="collection-item">{item.email}</li>
                       </Link>
             })}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat"  onClick={() => {setSearch("");}}>Clear</button>
        </div>
      </div>
  </nav>
<footer id="footer-sticky">
<p><span className="creator">Created By </span><a className="creator-link" href="https://github.com/AffableAniket">@AniketUniyal</a></p>
</footer>

</>
)
}
export default Navbar
