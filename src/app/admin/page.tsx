"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Film,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  Search,
  RotateCw,
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  invitesCreated: number;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalInvites: number;
  verifiedUsers: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalInvites: 0, verifiedUsers: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    isVerified: "yes", // Explicit "yes" or "no"
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/admin");
    } else if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/dashboard");
      } else {
        fetchAdminData();
      }
    }
  }, [status, session, router]);

  const fetchAdminData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${email}" and all their invitations?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        const deletedUser = users.find((u) => u._id === userId);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          verifiedUsers: deletedUser?.isVerified ? prev.verifiedUsers - 1 : prev.verifiedUsers,
          totalInvites: prev.totalInvites - (deletedUser?.invitesCreated || 0),
        }));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.message || "Failed to create user");
        setCreateLoading(false);
        return;
      }

      setUsers([data.user, ...users]);
      setStats((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers + 1,
        verifiedUsers: data.user.isVerified ? prev.verifiedUsers + 1 : prev.verifiedUsers,
      }));
      setCreateForm({ name: "", email: "", password: "", role: "user", isVerified: "yes" });
      setShowCreateModal(false);
    } catch {
      setCreateError("An unexpected network error occurred");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Refresh & Create Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/30">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8B1E41]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-[family-name:var(--font-cinzel)] font-bold">
                Master Administration
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-[#8B1E41] mt-1">
              Platform Overview & Users
            </h1>
            <p className="text-gray-700 text-sm mt-1 font-medium">
              Monitor platform metrics, manage registered user credentials, and control access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-[#D4AF37]/50 text-[#8B1E41] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#8B1E41]/5 transition-all disabled:opacity-50"
              title="Fetch latest database stats"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#8B1E41]" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Refresh Data"}</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Create User
            </button>
          </div>
        </div>

        {/* Real-time Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-[#D4AF37]/40 flex items-center justify-center text-[#8B1E41]">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                Total Invites Created
              </p>
              <h3 className="text-3xl font-bold text-black mt-0.5">{stats.totalInvites}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B1E41]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#8B1E41]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                Total Registered Users
              </p>
              <h3 className="text-3xl font-bold text-black mt-0.5">{stats.totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                Verified Accounts
              </p>
              <h3 className="text-3xl font-bold text-black mt-0.5">{stats.verifiedUsers}</h3>
            </div>
          </div>
        </div>

        {/* User Directory Table */}
        <div className="bg-white rounded-3xl border border-[#D4AF37]/40 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#8B1E41] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Registered Users Directory
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage accounts, review invitation counts, and remove users directly.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-900 font-bold uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Verified Status</th>
                  <th className="py-3.5 px-6">Invites Created</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-[family-name:var(--font-cormorant)] italic text-lg">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1E41] to-[#4A1023] text-[#D4AF37] font-bold text-xs flex items-center justify-center border border-[#D4AF37]/30 flex-shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-black text-sm">{u.name}</p>
                            <p className="text-gray-500 text-[11px] font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-[#8B1E41]/10 text-[#8B1E41] border border-[#D4AF37]/40"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            u.isVerified
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified (Yes)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-500" />
                              <span>Unverified (No)</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-black bg-amber-50 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 text-xs">
                          {u.invitesCreated} Invites
                        </span>
                      </td>

                      <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          disabled={(session?.user as any)?.id === u._id}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal: Create New User with Explicit Verified Yes/No Switch */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#8B1E41]" />
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-lg text-[#8B1E41]">
                  Create New Account
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                    Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as "admin" | "user" })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                    Verified Status
                  </label>
                  <select
                    value={createForm.isVerified}
                    onChange={(e) => setCreateForm({ ...createForm, isVerified: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-[#8B1E41]"
                  >
                    <option value="yes">Yes (Verified)</option>
                    <option value="no">No (Unverified)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-3 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-xs disabled:opacity-50 mt-2"
              >
                {createLoading ? "Creating User..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}