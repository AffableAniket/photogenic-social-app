import Navbar from "./components/Navbar";
import Explore from "./components/screen/Explore";
import Login from "./components/screen/Login";
import Signup from "./components/screen/Signup";
import Createpost from "./components/screen/Createpost";
import Profile from "./components/screen/Profile";
import UserProfile from "./components/screen/UserProfile";
import ResetPassword from "./components/screen/ResetPassword";
import NewPassword from "./components/screen/NewPassword";
import Home from "./components/screen/Home";
import {BrowserRouter as Router,Switch,Route,useHistory } from "react-router-dom";
import {reducer,initialState} from "./reducers/userReducer";
import {useEffect,createContext,useReducer,useContext} from "react";

export const UserContext = createContext();

const Routing = () => {

  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
   useEffect(() =>{
      const user = JSON.parse(localStorage.getItem("user"));
      if(user){
        dispatch({type: "USER",payload: user})

      }
      else{
          if(!history.location.pathname.startsWith("/reset")){
            history.push("/signin")
      }
      }
   },[])
   return (
     <Switch>
     <Route exact path="/" component={Explore} />
     <Route path="/signin" component={Login} />
     <Route path="/signup" component={Signup} />
     <Route path="/post" component={Createpost} />
     <Route exact path="/mypost" component={Profile} />
     <Route path="/mypost/:userid" component={UserProfile} />
     <Route exact path="/reset" component={ResetPassword} />
     <Route path="/reset/:token" component={NewPassword} />
     <Route  path="/home" component={Home} />
     </Switch>
   )
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
    <Router>
    <Navbar />
      <Routing />
    </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
