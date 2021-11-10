import {useEffect,useState} from "react";
import {Card} from "./Card";
function Home(){
  const [posts,setPosts] = useState([]);

  const renderCard = (post,index) => {
   return  <Card key={index} state={posts} setState={setPosts} likes={post.likes} comments={post.comments} id={post._id} title={post.title} caption={post.body} img={post.photo} name={post.postedBy.name} post_Id={post.postedBy._id} />
  }

useEffect(() => {

  fetch("/following",{
   method : "GET",
   headers : {
   "Authorization" : "Bearer "+localStorage.getItem("jwt")
  }
  })
  .then(res => res.json())
  .then(data => setPosts(data.post))
},[])

console.log("Arrays is here");
 console.log(posts);

  return (
  <div class="card-container">
{   posts.map(renderCard) }
  </div>
  )
}
export default Home
