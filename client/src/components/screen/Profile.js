import {useEffect,useState,useRef} from "react";
import {useContext} from "react";
import {url_cloud,api,email} from "./keys";
import {UserContext} from "../../App"
import M from "materialize-css";

function Profile(){
const {state,dispatch} = useContext(UserContext);
const [profiles,setProfiles] = useState([]);
const [image,setImage] = useState("");
const [resizeImg,setResizeImg] = useState(false);
 const [render,setRender] = useState(true);
 const [newUser,setNewUser] = useState({name:"",pmail:""});
const display = useRef();
const defaultUrl = "https://cdn-icons-png.flaticon.com/512/456/456212.png";

  useEffect(() => {
    fetch("/mypost",{
     method : "GET",
     headers : {
     "Authorization" : "Bearer "+localStorage.getItem("jwt")
    }
    })
    .then(res => res.json())
    .then(data => {setProfiles(data.post);console.log(data);
} )
  },[])

  const updateUserApi = () => {
    fetch("/update-profile",{
       method : "PUT",
       headers: {
         "Content-Type" : "application/json",
         "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
       body: JSON.stringify({email:newUser.pmail,name:newUser.name})
    }).then((res) => res.json()).then((result) => {if(result.error){
              M.toast({html: result.error, classes: 'rounded #ff1744 red accent-3'});
      }else{console.log(result);dispatch({type:"UPDATEPROFILE",payload:result});
            localStorage.setItem("user",JSON.stringify(result));
                 M.toast({html: "Profile Updated", classes: 'rounded #64dd17 light-green accent-4'});
            setNewUser((prevVal) => {
               return {
                 name:"",
                 email:""
                   }
              })
       }
       })
handleEdit();
  }

  const handleRemovePic = () => {
    fetch("/updatepic",{
    method : "PUT",
    headers : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer "+localStorage.getItem("jwt")
    },
    body: JSON.stringify({pic:defaultUrl})
    })
    .then(res => res.json())
    .then((data) => {
      localStorage.setItem("user",JSON.stringify({...state,pic:defaultUrl}));
      dispatch({type:"UPDATEPIC",payload:defaultUrl});
     console.log(data);
   display.current=0;
   }).catch((err) => {console.log(err);})
  }

if(state){  if(state.pic !== defaultUrl){
      display.current=1;
 }
else{
      display.current=0;
}
}

  useEffect(() => {
if(image){

  const data = new FormData();
  data.append("file",image);
  data.append("upload_preset","social-app");
  data.append("cloud_name",url_cloud);
  fetch(api,{
  method: "POST",
  body: data
}).then((res) => res.json()).then((data) =>
{
fetch("/updatepic",{
method : "PUT",
headers : {
"Content-Type" : "application/json",
"Authorization" : "Bearer "+localStorage.getItem("jwt")
},
body: JSON.stringify({pic:data.url})
})
.then(res => res.json())
.then((result) => {

 localStorage.setItem("user",JSON.stringify({...state,pic:data.url}));
 dispatch({type:"UPDATEPIC",payload:data.url});

console.log(result);} )

}).catch((err) => {console.log(err);})

}
  },[image])

 const handleUserApi = () => {
   if(newUser.name!=="" || newUser.email !== ""){
      if(newUser.email !== ""){
          const format = newUser.pmail.match(email);
            if(format){
                    updateUserApi();
                  }
           else {
           M.toast({html: "Incorrect Email", classes: 'rounded #ff1744 red accent-3'});
            }
      }
     else {
          updateUserApi();
      }
   }
     return
}

 const handleImageClick = (e) => {
    const {target:{style}} = e;
    if(!resizeImg){
       style.width = "100%";
       setResizeImg(!resizeImg);
       }
    else{
      style.width = "";
      setResizeImg(!resizeImg);
     }
 }

 const handleEdit = () => {
     setRender(!render);
 }

 const handleUserUpdate = (e) => {
        const {name,value} = e.target;
       setNewUser((prevVal) => {
        return {
         ...prevVal,
            [name] : value
       }
       })
 }

  return (

    <div className="container-social">

        <div className="top-social">

            <div className={(display.current>0)?"profile-new":"profile-info"} id="propic">
            <img src={state?state.pic:"Loading"} />

            <div className="file-field input-field" id="btn-profile">
              <div className="btn">
                <span>Upload</span>
                <input type="file" name="url" onChange={(e) => {setImage(e.target.files[0])}} />
              </div>
              <div className="btn" onClick={handleRemovePic}>
                <span>Remove</span>
              </div>
                <input className="file-path validate" type="text" />
              </div>


            </div>

                <div className="followers">
                   <ul>
                   <li>Posts</li>
                   <li>Followers</li>
                   <li>Following</li>
                   </ul>
                   <ul className={(render!==true)?"follow-gap":null}>
                   <li>{profiles.length}</li>
                   <li>{state?state.followers.length:"Loading"}</li>
                   <li>{state?state.following.length:"Loading"}</li>
                   </ul>
                   <ul className="follow-me">
                   <li><button className="btn-follow">Follow</button></li>
                   <li><button className="btn-follow">Unfollow</button></li>
                   {(render===true)?<span className="user-name">{state?state.name:""}
                   <i onClick={() => handleEdit()} className="tiny material-icons">create</i></span>:
                  <>
                  <form className="col s6 user-input-name">
                  <div className="row">
                  <i onClick={() => handleEdit()} className="tiny material-icons">create</i>
                  {(render!==true)?<i onClick={handleUserApi} className="material-icons">control_point</i>:null}
                  <div className="input-field col s6">
                  <input placeholder={state&&state.name} name="name" value={newUser.name}
                  onChange={handleUserUpdate} />
                  </div>
                  </div>
                  </form>
                  </>
                   }
                   </ul>
                   {(render===true)?<span className="user-email">{state?state.email:""}
                   </span>:
                   <>
                   <form className="col s6 user-input-email">
                   <div className="row">
                   <div className="input-field col s6">
                   <input placeholder={state&&state.email} name="pmail" value={newUser.pmail}
                   onChange={handleUserUpdate} />
                   </div>
                   </div>
                   </form>
                   </>}
                </div>


        </div>

            <div className="bottom-social">

                <div className="profile-posts">
              {
               profiles.map((profile) =>{
                    return <img onClick={handleImageClick} key = {profile._id} src={profile.photo}/>
                    })
                      }

               </div>

            </div>
<hr id="division"/>

    </div>


  )
}
export default Profile
