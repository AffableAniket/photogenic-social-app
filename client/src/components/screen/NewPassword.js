import {useState} from "react";
import M from "materialize-css";
import {email} from "./keys";
import {useParams} from "react-router-dom";
function NewPassword(){
const {token} = useParams();
  const [password,setPassword] = useState("")
  const fetchApi = () => {
      fetch(`/reset/${token}`,{
         method: "POST",
         headers: {
           "Content-Type" : "application/json"
         },
         body: JSON.stringify({token,password})
       }).then((res) => {
           return res.json();
       }).then((data) => {
         if(data.error){
            M.toast({html: data.msg, classes: 'rounded #ff1744 red accent-3'});
         }
         else{
            if(data.err==="User doesnt exist"){
                  M.toast({html: data.err, classes: 'rounded #ff1744 red accent-3'});
              }
            M.toast({html: data.msg, classes: 'rounded #64dd17 light-green accent-4'});
            setPassword("");
         }
       }).catch((err) => {
         console.log(err);
       } )
     }


     function handleUser(e){
          const {value} = e.target;
          setPassword(value);
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
          <input placeholder="Password"  id="password" type="password" name="password" value={password} onChange={handleUser} />
          <label></label>
        </div>
      </div>

      </form>
    </div>
<a className="btn-large signup-btn" onClick={fetchApi}>Reset</a>
    </div>
  </div>
</div>
  )
}
export default NewPassword
