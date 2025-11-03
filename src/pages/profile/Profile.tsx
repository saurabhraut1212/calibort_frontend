// src/pages/profile/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../features/auth/hooks";
import { successToast, errorToast } from "../../utils/toast";
import * as userApi from "../../services/userApi";
import { uploadToCloudinary } from "../../services/cloudinary";
import ImageUploader from "../../components/ui/ImageUploader";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";

const Profile: React.FC = () => {
  const email = useAppSelector((s) => s.auth.userEmail ?? null);
  const [user, setUser] = useState<userApi.IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  // ✅ fetch self profile with proper type
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await userApi.fetchUsers(1, 10, email ?? "");
        // Explicitly type `u`
        const match = res.users.find((u: userApi.IUser) => u.email === email) ?? null;
        setUser(match);
      } catch (err: unknown) {
        if (err instanceof Error) errorToast(err.message);
        else errorToast("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (email) fetchProfile();
    else setLoading(false);
  }, [email]);

  async function handleSave(): Promise<void> {
    if (!user) return;
    setUpdating(true);
    try {
      let avatarUrl = user.avatar_url ?? null;
      if (file) {
        avatarUrl = await uploadToCloudinary(file);
      }

      await userApi.updateUser(user.id, { name: user.name, avatar_url: avatarUrl });
      successToast("Profile updated");
    } catch (err: unknown) {
      if (err instanceof Error) errorToast(err.message);
      else errorToast("Update failed");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4">User not found</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
        <ImageUploader onFileSelected={(f) => setFile(f)} valueUrl={user.avatar_url ?? null} />

        <div className="mt-4 w-full">
          <FormField
            name="name"
            label="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <FormField name="email" label="Email" value={user.email} readOnly />
        </div>

        <Button className="mt-4 w-full" onClick={handleSave} disabled={updating}>
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
