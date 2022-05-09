import { signOut } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";
import Nav from "../../components/Nav/Nav";
import Plans from "../../components/Plans/Plans";
import { selectUser } from "../../features/userSlice";
import { auth } from "../../firebase";
import "./ProfileScreen.css";

const ProfileScreen = () => {
  const user = useSelector(selectUser);

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen__body">
        <h1>Edit Profile</h1>
        <div className="profileScreen__info">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt=""
          />
          <div className="profileScreen__details">
            <h2>{user.email}</h2>
            <div className="profileScreen__plans">
              <h3>Plans</h3>
              <Plans />
              <button onClick={logout} className="profileScreen__signOut">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
