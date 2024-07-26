import React, { useState, useRef, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { PostsReducer, postActions, postsStates } from "../AppContext/PostReducer";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { Alert } from "@material-tailwind/react";

const Main = () => {
  const { user, userData } = useContext(AuthContext);
  const scrollRef = useRef("");
  const collectionRef = collection(db, "posts");
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { SUBMIT_POST, HANDLE_ERROR } = postActions;
  const [progressBar, setProgressBar] = useState(0);

  const handlePostSubmit = () => {
    try {
      const q = query(collectionRef, orderBy("timestamp", "desc")); // Change 'asc' to 'desc' to get newest posts first
      onSnapshot(q, (snapshot) => {
        dispatch({
          type: SUBMIT_POST,
          posts: snapshot?.docs?.map((doc) => doc?.data()),
        });
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (err) {
      dispatch({ type: HANDLE_ERROR });
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    handlePostSubmit();
  }, [SUBMIT_POST]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
        <PostForm onPostSubmit={handlePostSubmit} setProgressBar={setProgressBar} />
      </div>
      <div className="flex flex-col py-4 w-full">
        {state?.error ? (
          <div className="flex justify-center items-center">
            <Alert color="red">
              Something went wrong, refresh and try again...
            </Alert>
          </div>
        ) : (
          <div>
            {state?.posts?.length > 0 &&
              state?.posts?.map((post, index) => (
                <PostCard
                  key={index}
                  logo={post?.logo}
                  id={post?.documentId}
                  uid={post?.uid}
                  name={post?.name}
                  email={post?.email}
                  media={post?.media}
                  mediaType={post?.media?.includes("mp4") || post?.media?.includes("m3u8") ? "video" : "image"}
                  timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
                />
              ))}
          </div>
        )}
      </div>
      <div ref={scrollRef}>{/* reference for later */}</div>
    </div>
  );
};

export default Main;