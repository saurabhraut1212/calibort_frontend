// src/pages/users/UsersList.tsx
import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../features/auth/hooks";
import { fetchUsersThunk } from "../../features/users/usersSlice";
import Button from "../../components/ui/Button";
import { getPagination } from "../../utils/pagination";
import { errorToast, successToast } from "../../utils/toast";
import * as userApi from "../../services/userApi";
import UserForm from "./UserForm";
import Modal from "../../components/comman/Modal";
import ConfirmDialog from "../../components/comman/ConfirmDialog";


const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, loading } = useAppSelector((s) => s.users);
  const [page, setPage] = useState<number>(1);
  const [q, setQ] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<userApi.IUser | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const limit = 6;
  const pages = getPagination(total, limit);

  useEffect(() => {
    dispatch(fetchUsersThunk({ page, limit, q }));
  }, [dispatch, page, q]);

  const getErrorMessage = (err: unknown, fallback = "Operation failed"): string => {
    if (err instanceof Error) return err.message;
    if (isAxiosError(err)) {
      return err.response?.data?.message ?? err.message ?? fallback;
    }
    return fallback;
  };

  async function handleDelete(): Promise<void> {
    if (!deleteId) return;
    try {
      await userApi.deleteUser(deleteId);
      successToast("User deleted");
      dispatch(fetchUsersThunk({ page, limit, q }));
    } catch (err: unknown) {
      errorToast(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeleteId(null);
    }
  }

  async function handleImport(): Promise<void> {
    try {
      await userApi.importReqres(2);
      successToast("Imported ReqRes users");
      dispatch(fetchUsersThunk({ page, limit, q }));
    } catch (err: unknown) {
      errorToast(getErrorMessage(err, "Import failed"));
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name/email"
          className="border px-3 py-2 rounded-md"
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={() => setOpenForm(true)}>+ New</Button>
          <Button variant="outline" onClick={handleImport}>
            Import ReqRes
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 bg-white flex flex-col items-center text-center shadow-sm"
            >
              <img
                src={u.avatar_url ?? "https://via.placeholder.com/80"}
                alt={u.name}
                className="w-20 h-20 rounded-full mb-3 object-cover"
              />
              <h3 className="font-semibold">{u.name}</h3>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-xs mt-1 bg-gray-100 px-2 py-0.5 rounded">{u.role}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditUser(u);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="outline" onClick={() => setDeleteId(u.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${page === p ? "bg-brand-500 text-white" : "border"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <Modal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditUser(null);
        }}
        title={editUser ? "Edit User" : "Add User"}
      >
        <UserForm
          initialUser={editUser}
          onSuccess={() => {
            setOpenForm(false);
            setEditUser(null);
            dispatch(fetchUsersThunk({ page, limit, q }));
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to delete this user?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UsersList;
