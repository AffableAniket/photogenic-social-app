import React,{useState,useContext} from "react";
import {useHistory} from "react-router-dom";
import M from "materialize-css";
import {email} from "./keys";
import {UserContext} from "../../App";
function Login(){
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  const [login,setLogin] = useState({
    email: "",
    password: ""
  });
  const fetchApi = () => {
      const format = login.email.match(email);
      if(format){
        fetch("/signin",{
         method: "POST",
         headers: {
           "Content-Type" : "application/json"
         },
         body: JSON.stringify(login)
       }).then((res) => {
           return res.json();
       }).then((data) => {
         if(data.error){
            M.toast({html: data.error, classes: 'rounded #ff1744 red accent-3'});
            setLogin({
              email: "",
              password: ""
            })
         }
         else{
            M.toast({html: data.msg, classes: 'rounded #64dd17 light-green accent-4'});
            localStorage.setItem("jwt",data.token);
            localStorage.setItem("user",JSON.stringify(data.user));
            dispatch({type: "USER", payload: data.user})
            setLogin({
              email: "",
              password: ""
            })
            history.push("/");

         }
       }).catch((err) => {
         console.log(err);
       } )
     }
      else{
        M.toast({html: "Invalid Email or Empty fields", classes: 'rounded #ff1744 red accent-3'});
        setLogin({
          email: "",
          password: ""
        })
      }
  }

     function handleUser(e){
          const {name,value} = e.target;
          setLogin((prevVal) =>{
       return {
            ...prevVal,
            [name] : value
          }
          })
         return
     }
  return (
    <div className="row sign-up">
  <div className="row s12 m5">
    <div className="card-panel input-signup">

    <div className="row">
      <form className="col s12">
      <div className="row">

        <div className="input-field col s12">
          <input placeholder="Email" autoComplete="off" type="email" name="email" value={login.email} onChange={handleUser} />
          <label></label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <input placeholder="Password"  id="password" type="password" name="password" value={login.password} onChange={handleUser} />
          <label></label>
        </div>
      </div>


      </form>
    </div>
<a className="btn-large signup-btn" onClick={fetchApi}>Login</a>
    </div>
  </div>
<a className="forgot" href="/reset">Forgot Password ?</a>
</div>
  )
}
export default Login
