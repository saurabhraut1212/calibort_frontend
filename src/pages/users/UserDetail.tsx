// src/pages/users/UserDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as userApi from "../../services/userApi";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<userApi.IUser | null>(null);

  useEffect(() => {
    if (!id) return;
    userApi.getUser(Number(id)).then(setUser);
  }, [id]);

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <img src={user.avatar_url ?? "https://via.placeholder.com/100"} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p>{user.email}</p>
      <p className="text-sm text-gray-500 mt-2">Role: {user.role}</p>
      <p className="text-sm text-gray-500">Provider: {user.provider}</p>
    </div>
  );
};

export default UserDetail;
