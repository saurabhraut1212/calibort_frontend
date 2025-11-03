// src/pages/users/UserDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as userApi from "../../services/userApi";
import Button from "../../components/ui/Button";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<userApi.IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const data = await userApi.getUser(Number(id));
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-lg">
        Loading user details...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gray-600 text-lg mb-4">User not found.</p>
        <Button onClick={() => navigate("/users")}>Back to Users</Button>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-indigo-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-gray-100">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={user.avatar_url ?? "https://via.placeholder.com/120"}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
          />
        </div>

        {/* Name */}
        <h2 className="text-2xl font-semibold text-indigo-700">{user.name}</h2>

        {/* Email */}
        <p className="text-gray-600 mt-1 text-sm">{user.email}</p>

        {/* Role & Provider */}
        <div className="mt-4 space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-indigo-600">Role:</span> {user.role}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-indigo-600">Provider:</span>{" "}
            {user.provider ?? "N/A"}
          </p>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200" />

        {/* Back Button */}
        <Button
          className="w-full"
          onClick={() => navigate("/users")}
        >
          Back to Users
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;
