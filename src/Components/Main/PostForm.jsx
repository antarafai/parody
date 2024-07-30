import React, { useRef, useState, useContext, useEffect } from "react";
import { Button, Avatar } from "@material-tailwind/react";
import addImage from "../../assets/images/add-image.png";
import live from "../../assets/images/live.png";
import smile from "../../assets/images/smile.png";
import { AuthContext } from "../AppContext/AppContext";
import { db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import avatar from "../../assets/images/avatar.jpg";  // Ensure this path is correct

const PostForm = ({ onPostSubmit, setProgressBar, initialMediaUrl, metadataUrl }) => {
  const { user, userData } = useContext(AuthContext);
  const text = useRef("");
  const [media, setMedia] = useState(initialMediaUrl || null);
  const [file, setFile] = useState(null);
  const [progressBar, setLocalProgressBar] = useState(0); // Local state for progress bar
  const [alertVisible, setAlertVisible] = useState(false); // State for alert visibility

  useEffect(() => {
    if (initialMediaUrl) {
      setMedia(initialMediaUrl);
    }
  }, [initialMediaUrl]);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (text.current.value !== "") {
      try {
        const postRef = doc(collection(db, "posts"));
        await setDoc(postRef, {
          documentId: postRef.id,
          uid: user?.uid || userData?.uid,
          logo: user?.photoURL,
          name: user?.displayName || userData?.name,
          email: user?.email || userData?.email,
          text: text.current.value,
          media: media,
          timestamp: serverTimestamp(),
          mintStatus: false,
          txHash: "",
          metadataUrl: metadataUrl,
        });
        text.current.value = "";
        onPostSubmit();
        setAlertVisible(true); // Show success alert
        setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    } else {
      alert("Post cannot be empty");
    }
  };

  const storage = getStorage();
  const metadata = {
    contentType: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
    ],
  };

  const submitMedia = async () => {
    const fileType = metadata.contentType.includes(file["type"]);
    if (!file) return;
    if (fileType) {
      try {
        const storageRef = ref(storage, `media/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        await uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setLocalProgressBar(progress); // Update local progress bar state
            setProgressBar(progress); // Update parent component progress bar state
          },
          (error) => {
            alert(error);
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                setMedia(downloadURL);
              }
            );
            console.log("File uploaded in PostForm successfully, download URL: ", media);
          }
        );
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  return (
    <>
      {alertVisible && (
        <div className="alert-success">
          Post successful!
        </div>
      )}
      <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
        <Avatar
          size="sm"
          variant="circular"
          src={user?.photoURL || avatar}
          alt="avatar"
        ></Avatar>
        <form className="w-full" onSubmit={handleSubmitPost}>
          <div className="flex justify-between items-center">
            <div className="w-full ml-4 text-accent">
              <input
                type="text"
                name="text"
                placeholder={`Whats on your mind ${
                  user?.displayName?.split(" ")[0] ||
                  userData?.name?.charAt(0).toUpperCase() + userData?.name?.slice(1)
                }`}
                className="outline-none w-full bg-black text-accent rounded-md"
                ref={text}
              ></input>
            </div>
            <div className="mx-4">
              {media && (
                <>
                  {media.includes("image") ? (
                    <img
                      className="h-24 rounded-xl"
                      src={media}
                      alt="previewImage"
                    ></img>
                  ) : (
                    <video
                      className="h-24 rounded-xl"
                      src={media}
                      controls
                    ></video>
                  )}
                </>
              )}
            </div>
            <div className="mr-4">
              <Button variant="text" type="submit">
                Share
              </Button>
            </div>
          </div>
        </form>
      </div>
      <span
        style={{ width: `${progressBar}%` }}
        className="bg-accent py-1 rounded-md"
      ></span>
      <div className="flex justify-around items-center pt-4">
        <div className="flex items-center">
          <label
            htmlFor="addMedia"
            className="cursor-pointer flex items-center"
          >
            <img className="h-10 mr-4" src={addImage} alt="addMedia"></img>
            <input
              id="addMedia"
              type="file"
              style={{ display: "none" }}
              onChange={handleUpload}
            ></input>
          </label>
          {file && (
            <Button variant="text" onClick={submitMedia}>
              Upload
            </Button>
          )}
        </div>
        <div className="flex items-center">
          <img className="h-10 mr-4" src={live} alt="live"></img>
          <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
            Live
          </p>
        </div>
        <div className="flex items-center">
          <img className="h-10 mr-4" src={smile} alt="feeling"></img>
          <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
            Feeling
          </p>
        </div>
      </div>
    </>
  );
};

export default PostForm;