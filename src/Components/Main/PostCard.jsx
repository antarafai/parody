import React, { useState, useContext, useEffect, useReducer, useRef } from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { FaHeart, FaRegComment, FaTrash} from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { GiMonkey } from "react-icons/gi";
import { AuthContext } from "../AppContext/AppContext";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
import {
  doc,
  setDoc,
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import CommentSection from "./CommentSection";
import HlsPlayer from "../VideoPlayer/HlsPlayer"; // Import the HLS player component
import  MintNFT  from '../Pages/mint-nft';
import thetaNFTbadge2 from "../../assets/images/thetaNFTbadge2.png";

const PostCard = ({ uid, id, logo, name, email, text, media, mediaType, timestamp, metadataUrl, mintStatus}) => {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const likesRef = doc(collection(db, "posts", id, "likes"));
  const likesCollection = collection(db, "posts", id, "likes");
  const singlePostDocument = doc(db, "posts", id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const postRef = useRef(null);
  const [minted, setMinted] = useState(mintStatus);

  const handleOpen = (e) => { 
    e.preventDefault();
    setOpen(true);
  };

  const addUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].ref;
      await updateDoc(data, {
        friends: arrayUnion({
          id: uid,
          image: logo,
          name: name,
        }),
      });
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const q = query(likesCollection, where("id", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const likesDocId = await querySnapshot?.docs[0]?.id;
    try {
      if (likesDocId !== undefined) {
        const deleteId = doc(db, "posts", id, "likes", likesDocId);
        await deleteDoc(deleteId);
      } else {
        await setDoc(likesRef, {
          id: user?.uid,
        });
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You can't delete other users' posts!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      try {
        const q = collection(db, "posts", id, "likes");
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_LIKE,
            likes: doc.docs.map((item) => item.data()),
          });
        });
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    };
    return () => getLikes();
  }, [id, ADD_LIKE, HANDLE_ERROR]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, []);

  const handleMinted = async (hash, e) => {
    // remove the mint button
    setMinted(true);
    // update the post with the new mintStatus set to true
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      mintStatus: true,
      txHash: hash,
    });

    console.log('Minted NFT with transaction hash:', hash);
  };

  useEffect(() => {
    if (isInView && mediaType === "video") {
      const videoElement = postRef.current.querySelector("video");
      if (videoElement && videoElement.paused) {
        videoElement.play();
      }
    }
  }, [isInView, mediaType]);

  return (
    <div className="mb-0 bg-accent relative" ref={postRef}>
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-1 bg-opacity-50 bg-black z-10">
        
          <div className="flex items-center z-5">
            <Avatar
              size="sm"
              variant="circular"
              src={logo || avatar}
              alt="avatar"
            />
            {user?.uid !== uid && (
            <div
              onClick={addUser}
              className="cursor-pointer z-10"
              style={{ marginTop: "-30px", marginLeft: "-15px" }}
            >
              <IoAddCircle
                className="w-5 h-5 glow rounded-full"
                alt="addFriend"
              />
            </div>
          )}
            <div className="ml-2">
              <p className="text-xs text-white">{email}</p>
              <p className="text-xs text-gray-300">Published: {timestamp}</p>
            </div>
          </div>
         
          
          {minted && 
          
          <div className="text-xs font-orbitron-small" style={{marginRight:'-30px'}}>
          <img src={thetaNFTbadge2} alt="" className="" style={{ 
              width: '90px', 
              height: 'auto', 
              marginTop: '-30px',
              marginRight: '-20px', 
              marginLeft: '-16px',
              marginBottom: '-7px' 
            }}  
          />
          
           NFT
          </div>}
          
          {user?.uid === uid && (
            <div className="tooltip font-orbitron" data-tip="NFT your Parody">
              {minted? 
              <div>
                
              </div> 
              : 
              <div className="dropdown dropdown-left">
                <div tabIndex={0} role="button" className="btn bg-accent text-black glass m-1 font-thin p-1">
                  <GiMonkey className="w-6 h-6 text-black" style={{marginRight:'-5px'}} alt="monkey" />
                  <div className="" style={{marginRight:'5px'}}>
                  Mint
                  </div>
                </div>
                  <div
                    tabIndex={0}
                    className=" flex flex-col dropdown-content card items-center card-compact bg-black bg-opacity-80  text-primary-content z-[1] w-64 h-44 p-0 shadow-2xl">
                    <div className="card-body">
                      <MintNFT metadataUrl={metadataUrl} onMinted={handleMinted}  />
                    </div>
                  </div>
              </div>
              }
            </div>
          )}
        </div>
        <div className="relative">
          {mediaType === "image" && (
            <img className="w-full object-cover" src={media} alt="postImage" />
          )}
          {mediaType === "video" && (
            <HlsPlayer
              videoUrl={media}
              play={isInView}
              className="w-full"
            />
          )}
        </div>
        <div className="p-0">
          <p className="text-sm text-gray-300">{text}</p>
        </div>
        <div className="flex justify-around items-center p-1 bg-black">
          <button
            className="flex items-center cursor-pointer text-white"
            onClick={handleLike}
          >
            <FaHeart className="w-6 h-6 mr-1" alt="like" />
            {state.likes?.length > 0 && state?.likes?.length}
          </button>
          <div
            className="flex items-center cursor-pointer text-white"
            onClick={handleOpen}
          >
            <FaRegComment className="w-6 h-6 mr-1" alt="comment" />
          </div>
          <div
            className="flex items-center cursor-pointer text-white"
            onClick={deletePost}
          >
            <FaTrash className="w-6 h-6 mr-1" alt="delete" />
          </div>
        </div>
      {open && <CommentSection postId={id} />}
    </div>
  );
};

export default PostCard;