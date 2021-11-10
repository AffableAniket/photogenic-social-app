import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../../App"
function UserProfile(){
const {state,dispatch} = useContext(UserContext);
const [userProfile,setUserProfile] = useState();
const {userid} = useParams();
const [follow,setFollow] = useState(false);
const [resizeImg,setResizeImg] = useState(false);

useEffect(()=>{
setFollow(state?(state.following.includes(userid)):false)
},[state])
  useEffect(() => {
       loadData()
   }, [])

   const loadData = async () => {
       const response = await fetch(`/user/${userid}`,{
          method:'GET',
          headers: {
            "Authorization": "Bearer "+localStorage.getItem('jwt')
          }
         })

       const data = await response.json()
       setUserProfile(data)
       console.log(data)}

  const updateFollow = () => {
    fetch("/follow",{
      method:'PUT',
      headers: {
         "Content-Type" : "application/json",
        "Authorization": "Bearer "+localStorage.getItem('jwt')
      },
      body: JSON.stringify({followId:userid})
       }).then(res => res.json())
         .then((result) => { dispatch({type:"UPDATE",payload:{followers: result.followers ,following: result.following}});localStorage.setItem("user",JSON.stringify(result));
          setUserProfile((prevState) => {
          return { ...prevState,
              user: {...prevState.user,followers:[...prevState.user.followers,result._id]}}
          });console.log(result)})
         .catch(err => {console.log(err)})

 }
 const updateUnfollow = () => {
   fetch("/unfollow",{
     method:'PUT',
     headers: {
        "Content-Type" : "application/json",
       "Authorization": "Bearer "+localStorage.getItem('jwt')
     },
     body: JSON.stringify({unfollowId:userid})
      }).then(res => res.json())
        .then((result) => { dispatch({type:"UPDATE",payload:{followers: result.followers ,following: result.following}});localStorage.setItem("user",JSON.stringify(result));
         setUserProfile((prevState) => {
        const newFollowers = prevState.user.followers.filter((item) => item!== result._id)
         return { ...prevState,
             user: {...prevState.user,followers:newFollowers}}
         });console.log(result)})
        .catch(err => {console.log(err)})

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

  return (
<>
{userProfile ?   <div className="container-social">

      <div className="top-social">

          <div className="profile-info">
          <img alt="" src={userProfile.user?userProfile.user.pic:"Loading"} />
           <span className="user-name">{userProfile.user?userProfile.user.name:""}</span>
          </div>



              <div className="followers">
                 <ul>
                 <li>Posts</li>
                 <li>Followers</li>
                 <li>Following</li>
                 </ul>
                 <ul>
                 <li>{userProfile.posts.length}</li>
                 <li>{userProfile.user.followers.length}</li>
                 <li>{userProfile.user.following.length}</li>
                 </ul>
                 <ul className="follow-me">
                 <li><button className="btn-follow" onClick={() => {(follow===false)&&updateFollow();setFollow(true)}}>Follow</button></li>
                 <li><button className="btn-follow" onClick={() => {(follow===true)&&updateUnfollow();setFollow(false)}}>Unfollow</button></li>
                 <p>{userProfile.user?userProfile.user.email:""}</p>
                 </ul>

              </div>
  </div>

          <div className="bottom-social">

              <div className="profile-posts">
              {
                userProfile.posts.map((profile) => {
                     return <img onClick={handleImageClick} key = {profile._id} src={profile.photo}/>
                     })
              }
             </div>

          </div>
<hr id="division"/>

  </div> : <h2>Loading</h2>}

</>

  )
}
export default UserProfile
