import  {useEffect,useState,useRef} from "react";
import {useContext} from "react";
import {UserContext} from "../.././App";
import {Link} from 'react-router-dom';
import {url_cloud,api} from "./keys";
import M from "materialize-css";
import {useHistory} from "react-router-dom";

export const Card = (props)  => {
  const [newPost,setNewPost] = useState({
    title: "",
    body: ""
  });
  const history = useHistory();
 const [newPic,setNewPic] = useState("");
 const [newUrl,setNewUrl] = useState("");
 const renderColor = useRef();
 const [input,setInput] = useState("");
 const [render,setRender] = useState(true);

  const {state} = useContext(UserContext);

    props.likes.map((like) => {
        if(like===state._id){
console.log(renderColor.current);
      return renderColor.current = "#d81b60";
       }
  return
       }
    )

    useEffect(() => {
       if(newUrl!==""){
          fetchApiToUpdate(props.id);
      }
  },[newUrl])

const handleInput = (e) => {
       setInput(e.target.value);
 }

const handleUpdate = (e) => {
       const {name,value} = e.target;
      setNewPost((prevVal) => {
       return {
        ...prevVal,
           [name] : value
      }
      })
}

const fetchApiToUpdate = (id) => {
      const updatePost = {
         title: newPost.title,
         body: newPost.body,
         photo: newUrl
      }
   console.log(JSON.stringify(updatePost));
   console.log(id);
    fetch("/update-post",{
      method : "PUT",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + localStorage.getItem("jwt")
       },
      body: JSON.stringify({updatePost,id})
    }).then((res) => res.json()).then((result) => {console.log(result);
       const newData = props.state.map((item) => {if(item._id===result._id) return result; else return item });
console.log(newData);
 props.renderState(true);
 props.setState(newData);
});
   M.toast({html:"successfully updated", classes: 'rounded #64dd17 light-green accent-4'});
  handleEdit();


}

const updateUnlike = (id) => {
   if(state){

   fetch("/unlike",{
    method : "PUT",
    headers : {
   "Content-Type" : "application/json",
   "Authorization" : "Bearer " + localStorage.getItem("jwt")
    },
    body : JSON.stringify({postId: id})
  }).then((res) => res.json()).then((result) =>{ const newData = props.state.map((item) => {if(item._id===result._id) return result; else return item; console.log(result);}
       )
  props.setState(newData);
})
renderColor.current="white";
}

  }

const updateLike = (id) => {

      if(state){

      fetch("/like",{
       method : "PUT",
       headers : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + localStorage.getItem("jwt")
       },
       body : JSON.stringify({postId: id})
     }).then((res) => res.json()).then((result) =>{ const newData = props.state.map((item) => {if(item._id===result._id) return result; else return item; console.log(result);}
          )
     props.setState(newData);

   })

}
}

const updateComment = (text,postId) => {
    if(state){
    fetch("/comment",{
      method: "PUT",
      headers: {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({postId,text})
    }).then((res) => res.json()).then((result) => {console.log(result); const newData = props.state.map((item) => {if(item._id===result._id) return result; else return item; console.log(result);})

 props.setState(newData);
})

}
}

const deleteComment = (postId,commentId) => {
    if(state){
    fetch("/delete-comment",{
      method: "PUT",
      headers: {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({postId,commentId})
    }).then((res) => res.json()).then((result) => {console.log(result); const newData = props.state.map((item) => {if(item._id===result._id) return result; else return item; props.setState(newData); })
 props.setState(newData);
})

}
}

const handleEdit = () => {
      setRender(!render);
}

const postDelete = (postId) => {
       if(state){
         fetch(`/delete/${postId}`,{
           method: "DELETE",
           headers: {
           "Authorization" : "Bearer " + localStorage.getItem("jwt")
           }
        }).then((res) => res.json()).then((result) => { const newData = props.state.filter((item) => { return item._id !== result._id })
   props.setState(newData)});
}
}

const handleApiUpdate = (id) => {
    if(newPic!==""){
      const data = new FormData();
      data.append("file",newPic);
      data.append("upload_preset","social-app");
      data.append("cloud_name",url_cloud);
 console.log(data);
   const responseApi = async () => {
         const result = await fetch(api,{
         method: "POST",
         body: data
       })
       const response = await result.json();
       const updateUrl = await setNewUrl(response.url);

 }
 responseApi();
    }
  if(newPost.title!=="" || newPost.body !== ""){
              fetchApiToUpdate(id);
       }
}

 return(
   <div className="card">
     <div className="card-content">
{(state._id===props.post_Id)?<>{console.log(state._id + " "+props.post_Id)}<i onClick={() => handleEdit()} className="material-icons">create</i>
      {(render!==true)?<i onClick={() => handleApiUpdate(props.id)} className="material-icons">control_point</i>:null} </>:null}

{  (render===true)?<><h4>{props.title} <span id="name-title">Posted By -
        <span><Link to={(state._id!==props.post_Id)? `/mypost/${props.post_Id}`:`/mypost`}> {props.name} </Link> </span> </span>
       {(props.post_Id === state._id) && <i id="icon" onClick={() => {postDelete(props.id)}} className="medium material-icons ">delete</i>}</h4>
       <div className="card-image waves-effect waves-block waves-light">
         <img className="activator" src={props.img} / >
       </div>
    <p>{props.caption}</p>
       </>
        :   <div className="row">
          <form className="col s12">
          <div className="row">
          <div className="input-field col s12">
          <input placeholder={props.title} name="title" value={newPost.title} onChange={handleUpdate}/>
          </div>
          </div>
          <div className="row">
          <div className="input-field col s12">
          <input placeholder={props.caption} name="body" value={newPost.body} onChange={handleUpdate}/>
          </div>
          </div>

          <div className="file-field input-field">
            <div className="btn btn-update">
              <span>Upload Image</span>
              <input type="file" name="url" onChange={(e) => {setNewPic(e.target.files[0]);}} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
             </div>
          </form>
          </div>}

     </div>
    <div className="card-social">

<div><i  onClick={() => { (renderColor.current==="#d81b60")? updateUnlike(props.id) : updateLike(props.id) } } style= {{color : renderColor.current}} id="icon" className="medium material-icons ">favorite</i></div>

    <p>{props.likes.length}</p>
        <div className="row comment">
          <div className="input-field col s12">
              <form onSubmit={(e) => {e.preventDefault(); updateComment(e.target[0].value,props.id);setInput("");}}>
              <input id="comment-input" onChange={handleInput} value={input} placeholder="Comment" autoComplete="off" name="name" type="text"  />
             <label></label>
              </form>
         </div>

      </div>

    </div>
    {props.comments.map((comment) => { return (<p id="comments"><span>{<Link to={(comment.postedBy._id!==state._id)?`/mypost/${comment.postedBy._id}`:`/mypost`}> {comment.postedBy.name} </Link>}</span><span> </span>{comment.text} {(comment.postedBy._id===state._id)&&<i onClick={() => deleteComment(props.id,comment._id)} className="small material-icons">delete</i>}</p>)})}
   </div>
)

}
