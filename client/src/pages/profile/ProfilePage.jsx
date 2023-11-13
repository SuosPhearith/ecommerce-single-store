import React, { useEffect, useState } from "react";
import request from "../../services/request";
import { Spin } from "antd";
import errroHandler from "../../utils/errorHandler";

const ProfilePage = () => {
  const [isLoading, setIsloading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      setIsloading(true);
      try {
        const response = await request("get", "auth/loginStatus");
        setProfile(response.data.user);
        setIsloading(false);
      } catch (error) {
        errroHandler(error);
      }
    };

    getProfile();
  }, []);
  if (isLoading) {
    // Loading state, you can replace this with a loading spinner or message
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin />
      </div>
    );
  }
  return (
    <>
      {profile && (
        <div>
          <p>Name: {profile.fullname}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          <p>Created Date: {profile.createdDate}</p>
          <p>Last Login: {profile.lastLogin}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
