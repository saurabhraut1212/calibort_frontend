// src/pages/users/UsersList.tsx
import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../features/auth/hooks";
import { fetchUsersThunk } from "../../features/users/usersSlice";
import Button from "../../components/ui/Button";
import { errorToast, successToast } from "../../utils/toast";
import * as userApi from "../../services/userApi";
import UserForm from "./UserForm";
import Modal from "../../components/comman/Modal";
import ConfirmDialog from "../../components/comman/ConfirmDialog";
import { FaUserCircle } from "react-icons/fa"; 

interface AuthState {
  userEmail: string | null;
  userRole?: string;
}

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // typed selector
  const { items, total, loading } = useAppSelector((s) => s.users) as {
    items: userApi.IUser[];
    total: number;
    loading: boolean;
  };

  const auth = useAppSelector((s) => s.auth as AuthState);
  const currentEmail = auth.userEmail;
  const authRole = auth.userRole;

  const [localRole, setLocalRole] = useState<string | undefined>(authRole);
  const isAdmin = (localRole ?? "user") === "admin";

  // pagination / UI state
  const [page, setPage] = useState<number>(1);
  const [q, setQ] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<userApi.IUser | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const limit = 6;
//   const fetchLimit = limit + 1;

  // whether current logged-in user exists in DB (used to adjust pagination)
  const [hasCurrentInDb, setHasCurrentInDb] = useState<boolean>(false);

  // fetch users for current page (use fetchLimit to allow client-side trimming)
  useEffect(() => {
    dispatch(fetchUsersThunk({ page, limit, q }));
  }, [dispatch, page, q]);

  // find role if not present in auth slice
  useEffect(() => {
    let mounted = true;
    const fetchRole = async () => {
      if (authRole) {
        setLocalRole(authRole);
        return;
      }
      if (!currentEmail) return;

      try {
        const resp = await userApi.fetchUsers(1, 100, currentEmail);
        const found = resp.users.find((u: userApi.IUser) => u.email === currentEmail);
        if (mounted) setLocalRole(found?.role ?? "user");
      } catch {
        // ignore
      }
    };
    fetchRole();
    return () => {
      mounted = false;
    };
  }, [authRole, currentEmail]);

  // determine whether current logged-in user exists in DB (run when email or total changes)
  // IMPORTANT: we now request across all users using `total` as limit so we don't miss the user
  useEffect(() => {
    let mounted = true;
    const checkCurrent = async () => {
      if (!currentEmail) {
        if (mounted) setHasCurrentInDb(false);
        return;
      }

      try {
        // use total as the limit so we search across the whole user set
        const resp = await userApi.fetchUsers(1, Math.max(1, total), currentEmail);
        const exists = resp.users.some((u: userApi.IUser) => u.email === currentEmail);
        if (mounted) setHasCurrentInDb(exists);
      } catch {
        if (mounted) setHasCurrentInDb(false);
      }
    };

    checkCurrent();
    return () => {
      mounted = false;
    };
  }, [currentEmail, total]); // re-check when total changes (import/delete)

  // safe error helper
  const getErrorMessage = (err: unknown, fallback = "Operation failed"): string => {
    if (err instanceof Error) return err.message;
    if (isAxiosError(err)) {
      return err.response?.data?.message ?? err.message ?? fallback;
    }
    return fallback;
  };

  // delete user
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

  // import reqres
  async function handleImport(): Promise<void> {
    try {
      await userApi.importReqres(2);
      successToast("Imported ReqRes users");
      dispatch(fetchUsersThunk({ page, limit, q }));
    } catch (err: unknown) {
      errorToast(getErrorMessage(err, "Import failed"));
    }
  }

  // filter out current logged-in user from display and trim to `limit`
  const filtered = items.filter((u: userApi.IUser) => u.email !== currentEmail);
  const visibleItemsToShow = filtered.slice(0, limit);

  // --- pagination calculation using adjusted total (exclude current user if present) ---
  const adjustedTotal = hasCurrentInDb ? Math.max(0, total - 1) : total;
  const pagesCount = Math.max(1, Math.ceil(adjustedTotal / limit));

  // if current page became out of range due to total change, clamp it
  useEffect(() => {
    if (page > pagesCount) setPage(pagesCount);
  }, [page, pagesCount]);

  const pagesArray = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div className="p-4">
      {/* Search and Add Buttons */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full md:w-1/2 border border-gray-200 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />

        {isAdmin && (
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button onClick={() => setOpenForm(true)}>+ New</Button>
            <Button variant="outline" onClick={handleImport}>
              Import ReqRes
            </Button>
          </div>
        )}
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : visibleItemsToShow.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleItemsToShow.map((u: userApi.IUser) => {
            const isOwn = currentEmail !== null && u.email === currentEmail;
            const canEdit = isAdmin || isOwn;
            const canDelete = isAdmin || isOwn;

            return (
              <article
                key={u.id}
                onClick={() => navigate(`/users/${u.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/users/${u.id}`);
                }}
                className="relative bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center shadow-sm cursor-pointer
                           transform transition-transform duration-200 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label={`View details for ${u.name}`}
              >
               <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-indigo-50 shadow flex items-center justify-center bg-gray-50">
                {u.avatar_url ? (
                    <img
                    src={u.avatar_url}
                    alt={u.name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <FaUserCircle className="text-gray-400 w-16 h-16" />
                )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{u.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{u.email}</p>

                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {u.role ?? "user"}
                  </span>
                </div>

                {/* actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setEditUser(u);
                      setOpenForm(true);
                    }}
                    disabled={!canEdit}
                    title={!canEdit ? "You cannot edit this user" : "Edit user"}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setDeleteId(u.id);
                    }}
                    disabled={!canDelete}
                    title={!canDelete ? "You cannot delete this user" : "Delete user"}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagesCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {pagesArray.map((p: number) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${page === p ? "bg-indigo-600 text-white" : "border border-gray-200 bg-white"}`}
              aria-current={page === p ? "page" : undefined}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
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

      {/* Confirm Delete */}
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
