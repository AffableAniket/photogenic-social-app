import React,{useState,useEffect} from "react";
import M from "materialize-css";
import {url_cloud,api} from "./keys";
import {useHistory} from "react-router-dom";

function Createpost(){
  const [social,setSocial] = useState({
    title: "",
    body: ""
  });
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  const history = useHistory();
  useEffect(() => {
     if(url!==""){
        fetchData();
    }
},[url])
  const fetchData =  () => {

 if(url!==""){
      const main =  {
        title : social.title,
        body : social.body,
        pic :  url
      }
console.log(main);
     fetch("/post",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer "+localStorage.getItem("jwt")
        },
        body:  JSON.stringify(main)
      })
      .then(res => res.json())
      .then((data) => {
        if(data.error){
           M.toast({html: data.error, classes: 'rounded #ff1744 red accent-3'});
           setSocial({
             title: "",
             body: ""
           })
        }
        else{
           M.toast({html: data.msg, classes: 'rounded #64dd17 light-green accent-4'});
          history.push("/");
           setSocial({
             title: "",
             body: ""
           })
        }
      })
  }
else{
    return
}
}

   function apiCall(){
   const check = localStorage.getItem("jwt");
   console.log(check);
   const titleCheck = social.title;
   const captionCheck = social.body;
  if(!titleCheck || !captionCheck || !image){
     M.toast({html: "Empty Fields", classes: 'rounded #ff1744 red accent-3'});
     return
  };
   const isString = typeof(check);
      console.log(isString);
   if(isString!== "string"){
       M.toast({html: "User Logged Out", classes: 'rounded #ff1744 red accent-3'});
       return
   }

     const data = new FormData();
     data.append("file",image);
     data.append("upload_preset","social-app");
     data.append("cloud_name",url_cloud);
console.log(data);
  const responseApi = async () => {
        const result = await fetch(api,{
        method: "POST",
        body: data
      })
      const response = await result.json();
      const updateUrl = await setUrl(response.url);

}
responseApi();


  }

  function handlePost(e){
       const {name,value} = e.target;

       setSocial((prevVal) =>{
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
                 <input id="input_text" autoComplete="off" type="text" data-length="10" name="title" onChange={handlePost} value={social.title}/>
                 <label for="input_text">Title</label>
               </div>
       <div className="input-field col s12">
         <textarea id="textarea1" className="materialize-textarea" name="body" onChange={handlePost} value={social.body}></textarea>
         <label for="textarea1">Caption</label>
       </div>
     </div>
   </form>
 </div>
   <div className="file-field input-field">
     <div className="btn">
       <span>Upload Image</span>
       <input type="file" name="url" onChange={(e) => {setImage(e.target.files[0])}} />
     </div>
     <div className="file-path-wrapper">
       <input className="file-path validate" type="text" />
     </div>
<a type="submit" onClick={apiCall} id="post-sub" className="btn-large signup-btn">Submit</a>
</div>
    </div>


  </div>
</div>
  )
}
export default Createpost
