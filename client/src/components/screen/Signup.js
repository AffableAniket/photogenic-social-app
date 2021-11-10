import React,{useState,useEffect} from "react";
import M from "materialize-css";
import {url_cloud,email,api} from "./keys";
import {useHistory} from "react-router-dom";
function Signup(){
  const history = useHistory();
   const [user,setUser] = useState({
     name: "",
     email: "",
     password: ""
   });
   const [image,setImage] = useState("");
   const [url,setUrl] = useState("");
   const [main,setMain] = useState({name: "",email: "",password: "",pic: ""});
   const format = user.email.match(email);

   useEffect(() => {
     if(url!==""){
  const response = async () =>  {const setState = await setMain((prevVal) => { return {...prevVal,name:user.name,email:user.email,password:user.password,pic:url}});}
response();

}
  },[url])
  useEffect(() => {
    if(main.pic!==""){
       handleApi();
    }
 },[main])
const fetchApi = () => {

    if(image){

      const data = new FormData();
      data.append("file",image);
      data.append("upload_preset","social-app");
      data.append("cloud_name",url_cloud);
     console.log(data);
        fetch(api,{
        method: "POST",
        body: data
      })
      .then(res => res.json())
      .then( async (data) =>  { const loadData = await setUrl(data.url); console.log(data); })


}
  else{  handleApi();
  }
}
   const handleApi = () => {
     if(format){
       fetch("/signup",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: image?JSON.stringify(main):JSON.stringify(user)
      }).then((res) => {
          return res.json();
      }).then((data) => {
        if(data.error){
           M.toast({html: data.error, classes: 'rounded #ff1744 red accent-3'});
           setUser({
             name: "",
             email: "",
             password: ""
           })
        }
        else{
           M.toast({html: data.msg, classes: 'rounded #64dd17 light-green accent-4'});
           history.push("/signin");
           setUser({
             name: "",
             email: "",
             password: ""
           });
        setImage("");
        }
      })}
     else{
       M.toast({html: "Invalid Email or Empty fields", classes: 'rounded #ff1744 red accent-3'});
       setUser({
         name: "",
         email: "",
         password: ""
       })
     }

   }
   function handleUser(e){
        const {name,value} = e.target;
        setUser((prevVal) =>{
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


      <div className="row ">
        <form className="col s12" >

        <div className="row">
          <div className="input-field col s12">
            <input placeholder="Name" autoComplete="new-password" name="name" value={user.name} onChange={handleUser} type="text"  />
            <label></label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input placeholder="Email" autoComplete="off" name="email" value={user.email} onChange={handleUser} type="email" />
            <label></label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input placeholder="Password" id="password" name="password" value={user.password} onChange={handleUser} type="password" />
            <label></label>
          </div>

        </div>

        <div className="file-field input-field">
          <div className="btn">
            <span>Profile Pic</span>
            <input type="file" name="url" onChange={(e) => {setImage(e.target.files[0])}} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
</div>
        </form>
      </div>

     <a type="submit" href="#" onClick={fetchApi} className="btn-large signup-btn">Sign Up</a>


    </div>
  </div>
</div>
  )
}
export default Signup
