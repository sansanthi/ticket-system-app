import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/Auth.context";
import { db } from "../firebase";
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import profileImage from "../images/user-profile.png";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserInfo = () => {
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      console.log("Current user data: ", doc.data());
      setUserInfo(doc.data());
      setUseImage(doc.data().profileURL);
      setLoading(false);
      return unsub;
    });
  };
  useEffect(() => {
    return getUserInfo();
  }, []);
  const [file, setFile] = useState(null);
  const [userImage, setUseImage] = useState(null);

  const onSelectImage = (e) => {
    setFile(e.target.files[0]);
    setUseImage(URL.createObjectURL(e.target.files[0]));
  };

  const onChangeInput = (e) => {
    setUserInfo((info) => ({ ...info, name: e.target.value }));
  };
  const uploadImageFile = () => {
    // Create a root reference
    const storage = getStorage();

    // Create a reference to 'images/mountains.jpg'
    
    const imageName = file.name;
    console.log('file in uploadImage:', imageName)
    const imageRef = ref(storage, `profile-images/${imageName}`);
    // const snapshot =  uploadBytes(imageRef, file);
    // const downlaodedURL =  getDownloadURL(snapshot.ref);

    const downlaodedURL = uploadBytes(imageRef, file).then((snapshot) =>
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("url:", url);
        return url;
      })
    );
    console.log("url in uploadImage:", downlaodedURL);
    return downlaodedURL;
  };

  const onSubmitUserProfile = (e) => {
    e.preventDefault();
    
    uploadImageFile().then((imageURL) => {
      console.log("image url in upload profile:", imageURL);

      const profileRef = doc(db, "users", currentUser.uid);
      updateDoc(profileRef, {
        ...userInfo,
        profileURL: imageURL,
      });
    });
  };

  return (
    <>
      {!loading && (
        <main className="profile-main">
          <header>
            <h1>Profile</h1>
            <p>Manage your profile</p>
          </header>
          <section className="profile-edit">
            <form onSubmit={onSubmitUserProfile}>
              <div className="input-field">
                <label htmlFor="picture" className="picture-label">
                  Profile picture
                </label>
                <div className="img-upload">
                  <input type="file" onChange={onSelectImage} />
                  <span className="profile-picture">
                    <img
                      src={userImage ? userImage : profileImage}
                      alt=""
                      className="profile-img"
                    />
                  </span>
                </div>
              </div>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={userInfo.email}
                  className="email-input"
                  readOnly
                />
              </div>
              <div className="input-field">
                <label htmlFor="fullname">Full name</label>
                <input
                  type="text"
                  id="fullname"
                  value={userInfo.name}
                  onChange={onChangeInput}
                />
              </div>
              <button className="btn-submit" type="submit">
                Update
              </button>
            </form>
          </section>
        </main>
      )}
    </>
  );
};
export default UserProfile;
