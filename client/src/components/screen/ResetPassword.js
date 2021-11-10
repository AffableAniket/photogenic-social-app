import {useState} from "react";

import M from "materialize-css";
import {email} from "./keys";

function ResetPassword(){

  const [mail,setMail] = useState("")
  const fetchApi = () => {
      const format = mail.match(email);
      if(format){
        fetch("/reset",{
         method: "POST",
         headers: {
           "Content-Type" : "application/json"
         },
         body: JSON.stringify({email:mail})
       }).then((res) => {
           return res.json();
       }).then((data) => {
         if(data.error){
            M.toast({html: data.error, classes: 'rounded #ff1744 red accent-3'});
         }
         else{
            M.toast({html: data.msg, classes: 'rounded #64dd17 light-green accent-4'});
            setMail("");
         }
       }).catch((err) => {
         console.log(err);
       } )
     }
      else{
        M.toast({html: "Invalid Email or Empty fields", classes: 'rounded #ff1744 red accent-3'});
      }
  }

     function handleUser(e){
          const {value} = e.target;
          setMail(value);
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
          <input placeholder="Email" autoComplete="off" type="email" name="email" value={mail} onChange={handleUser} />
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
export default ResetPassword
