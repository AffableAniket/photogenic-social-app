import {useEffect,useState} from "react";
import {Card} from "./Card";
function Explore(){
  const [posts,setPosts] = useState([]);
  const [renderPost,setRenderPost] = useState(true);
  const renderCard = (post,index) => {
   return  <Card key={index} renderState={setRenderPost} state={posts} setState={setPosts} likes={post.likes} comments={post.comments} id={post._id} title={post.title} caption={post.body} img={post.photo} name={post.postedBy.name} post_Id={post.postedBy._id} />
  }

const fetchPost = () => {
    if(renderPost){
    fetch("/get",{
     method : "GET",
     headers : {
     "Authorization" : "Bearer "+localStorage.getItem("jwt")
    }
    })
    .then(res => res.json())
    .then(data => setPosts(data.post))
   setRenderPost(!renderPost);
 }
}

useEffect(() => {
 fetchPost();
},[posts])

console.log("Arrays is here");
 console.log(posts);

  return (
  <div className="card-container">
{   posts.map(renderCard) }
  </div>
  )
}
export default Explore
