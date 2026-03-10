import { useState, useEffect } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  Banknote,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Camera,
  Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, User, AdminStats } from "@/lib/api";

type TabId = "dashboard" | "users" | "castings" | "marketplace";

const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "castings", label: "Casting Management", icon: Briefcase },
  { id: "marketplace", label: "Marketplace Offers", icon: ShoppingBag },
];

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [actionModal, setActionModal] = useState<{ user: User; action: "reject" | "changes_requested" } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewUserLoading, setViewUserLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (!user.isAdmin) {
      setAuthError("You do not have permission to access the admin panel.");
      return;
    }
  }, [user, authLoading, navigate]);

  const loadStats = async () => {
    try {
      const data = await adminApi.stats();
      setStats(data);
    } catch {
      setAuthError("Failed to load stats.");
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await adminApi.users();
      setUsers(data);
    } catch {
      setAuthError("Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      loadStats();
      if (activeTab === "users") loadUsers();
    }
  }, [user?.isAdmin, activeTab]);

  const handleRefresh = () => {
    loadStats();
    if (activeTab === "users") loadUsers();
  };

  const handleApprove = async (u: User) => {
    setActionLoading(true);
    try {
      await adminApi.updateUser(u._id, { status: "approved", rejectionReason: "" });
      await loadUsers();
      loadStats();
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (u: User, action: "reject" | "changes_requested") => {
    setActionModal({ user: u, action });
    setRejectionReason("");
  };

  const openViewUser = async (u: User) => {
    setViewUserLoading(true);
    setViewUser(null);
    try {
      const full = await adminApi.user(u._id);
      setViewUser(full);
    } catch {
      setAuthError("Failed to load user details.");
    } finally {
      setViewUserLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!actionModal) return;
    const reason = rejectionReason.trim();
    if ((actionModal.action === "reject" || actionModal.action === "changes_requested") && !reason) {
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.updateUser(actionModal.user._id, {
        status: actionModal.action === "reject" ? "rejected" : "changes_requested",
        rejectionReason: reason,
      });
      await loadUsers();
      loadStats();
      setActionModal(null);
      setRejectionReason("");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl text-primary">Loading Admin Panel...</p>
          <p className="text-muted-foreground text-sm font-body mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  if (authError && !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary">!</div>
          <h1 className="font-display text-2xl text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground font-body mb-6">{authError}</p>
          <Link to="/" className="text-primary font-body text-sm hover:underline">Back to site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`border-r border-border bg-card flex flex-col transition-all ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          {!sidebarCollapsed && <span className="font-display text-lg text-primary">Admin Panel</span>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-muted-foreground hover:text-primary"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-body transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && tab.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-border space-y-1">
          {!sidebarCollapsed && (
            <Link
              to="/admin/premium-users"
              className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary"
            >
              <CreditCard className="w-4 h-4" />
              Premium Users
            </Link>
          )}
          {!sidebarCollapsed && (
            <Link
              to="/admin/bank-transfers"
              className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary"
            >
              <Banknote className="w-4 h-4" />
              Payment Verifications
            </Link>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary">
            <ExternalLink className="w-4 h-4" />
            {!sidebarCollapsed && "View Site"}
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary">
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-primary">Admin Panel</h1>
            <p className="text-muted-foreground text-sm font-body">Welcome, {user?.email || "admin"}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-body hover:border-primary hover:text-primary"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </header>

        {authError && activeTab !== "dashboard" && (
          <div className="mx-6 mt-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {authError}
          </div>
        )}

        <div className="p-6">
          {activeTab === "dashboard" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats && (
                  <>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Total Users</p>
                      <p className="font-display text-2xl text-primary">{stats.totalUsers}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Pending Approvals</p>
                      <p className="font-display text-2xl text-primary">{stats.pendingApprovals}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Total Models</p>
                      <p className="font-display text-2xl text-primary">{stats.totalModels}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Total Professionals</p>
                      <p className="font-display text-2xl text-primary">{stats.totalProfessionals}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Total Castings</p>
                      <p className="font-display text-2xl text-primary">{stats.totalCastings}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Pending Castings</p>
                      <p className="font-display text-2xl text-primary">{stats.pendingCastings}</p>
                    </div>
                    <div className="magazine-border p-4">
                      <p className="text-muted-foreground text-xs font-body uppercase">Contact Messages</p>
                      <p className="font-display text-2xl text-primary">{stats.totalContacts}</p>
                    </div>
                  </>
                )}
              </div>
              <h3 className="font-display text-lg mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveTab("users")} className="px-4 py-2 bg-primary/10 text-primary text-sm font-body hover:bg-primary/20">
                  Approve Users
                </button>
                <button onClick={() => setActiveTab("castings")} className="px-4 py-2 bg-primary/10 text-primary text-sm font-body hover:bg-primary/20">
                  Manage Castings
                </button>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-4">User Management</h2>
              {usersLoading ? (
                <p className="text-muted-foreground font-body">Loading users...</p>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium">User</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Joined</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-t border-border">
                          <td className="p-3">
                            <span className="font-medium">{u.fullName || "—"}</span>
                            <span className="text-muted-foreground text-xs block">ID: {u._id.slice(-6)}</span>
                          </td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs ${
                              u.role === "model" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                            }`}>
                              {u.role === "model" ? <Camera className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                              {u.role || "—"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 text-xs bg-secondary">{u.status || "pending"}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="p-3 flex flex-wrap gap-1">
                            {(u.status === "pending" || u.status === "updated") && (
                              <>
                                <button onClick={() => handleApprove(u)} disabled={actionLoading} className="text-xs px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30">Approve</button>
                                <button onClick={() => openRejectModal(u, "changes_requested")} disabled={actionLoading} className="text-xs px-2 py-1 border border-border hover:border-primary text-primary">Request changes</button>
                                <button onClick={() => openRejectModal(u, "reject")} disabled={actionLoading} className="text-xs px-2 py-1 border border-primary text-primary hover:bg-primary/10">Reject</button>
                              </>
                            )}
                            <button onClick={() => openViewUser(u)} className="text-primary text-xs hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && !usersLoading && (
                    <p className="p-6 text-center text-muted-foreground">No users found.</p>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "castings" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-4">Casting Management</h2>
              <p className="text-muted-foreground font-body">Casting list — connect to API when castings exist.</p>
            </>
          )}

          {activeTab === "marketplace" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-4">Marketplace Offers</h2>
              <p className="text-muted-foreground font-body">Marketplace offers — approve/reject from this tab when connected.</p>
            </>
          )}
        </div>
      </main>

      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !actionLoading && setActionModal(null)}>
          <div className="bg-background border border-border p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl mb-2">
              {actionModal.action === "reject" ? "Reject application" : "Request changes"}
            </h3>
            <p className="text-muted-foreground text-sm font-body mb-4">
              {actionModal.user.fullName || actionModal.user.email} — add a reason (user will see this):
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={actionModal.action === "reject" ? "Reason for rejection..." : "What should they change?"}
              className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary min-h-[100px]"
              required
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handleConfirmReject} disabled={actionLoading || !rejectionReason.trim()} className="flex-1 bg-primary text-primary-foreground py-2 font-body text-sm uppercase disabled:opacity-50">
                {actionLoading ? "Saving..." : "Confirm"}
              </button>
              <button onClick={() => setActionModal(null)} disabled={actionLoading} className="flex-1 border border-border py-2 font-body text-sm uppercase hover:border-primary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View user details modal */}
      {(viewUser !== null || viewUserLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !viewUserLoading && setViewUser(null)}>
          <div
            className="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-primary">User details</h3>
              <button onClick={() => setViewUser(null)} disabled={viewUserLoading} className="text-muted-foreground hover:text-foreground text-sm font-body">
                Close
              </button>
            </div>
            <div className="p-6 space-y-6">
              {viewUserLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : viewUser ? (
                <>
                  <div className="flex flex-wrap gap-4 items-start">
                    {viewUser.profilePhoto ? (
                      <img src={viewUser.profilePhoto} alt="" className="w-24 h-24 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">No photo</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-foreground">{viewUser.fullName || "—"}</p>
                      <p className="text-muted-foreground text-sm font-body">{viewUser.email}</p>
                      <p className="text-sm font-body">Role: {viewUser.role || "—"} · Status: {viewUser.status || "—"}</p>
                      <p className="text-muted-foreground text-xs font-body">Joined: {viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : "—"}</p>
                      {viewUser.phone && <p className="text-sm font-body">Phone: {viewUser.phone}</p>}
                      {viewUser.company && <p className="text-sm font-body">Company: {viewUser.company}</p>}
                      {viewUser.rejectionReason && (
                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded text-sm font-body text-destructive">
                          Rejection reason: {viewUser.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {(viewUser.bio || viewUser.country || viewUser.dateOfBirth || viewUser.gender) && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-display text-sm text-primary uppercase mb-2">Profile & application</h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-body">
                        {viewUser.dateOfBirth && <><dt className="text-muted-foreground">Date of birth</dt><dd>{viewUser.dateOfBirth}</dd></>}
                        {viewUser.gender && <><dt className="text-muted-foreground">Gender</dt><dd>{viewUser.gender}</dd></>}
                        {viewUser.country && <><dt className="text-muted-foreground">Country</dt><dd>{viewUser.country}</dd></>}
                        {viewUser.city && <><dt className="text-muted-foreground">City</dt><dd>{viewUser.city}</dd></>}
                        {viewUser.height && <><dt className="text-muted-foreground">Height</dt><dd>{viewUser.height} cm</dd></>}
                        {viewUser.weight && <><dt className="text-muted-foreground">Weight</dt><dd>{viewUser.weight} kg</dd></>}
                        {viewUser.eyeColor && <><dt className="text-muted-foreground">Eye color</dt><dd>{viewUser.eyeColor}</dd></>}
                        {viewUser.hairColor && <><dt className="text-muted-foreground">Hair color</dt><dd>{viewUser.hairColor}</dd></>}
                        {viewUser.instagram && <><dt className="text-muted-foreground">Instagram</dt><dd>{viewUser.instagram}</dd></>}
                        {viewUser.idNumber && <><dt className="text-muted-foreground">ID / Passport number</dt><dd>{viewUser.idNumber}</dd></>}
                      </dl>
                      {viewUser.categories && viewUser.categories.length > 0 && (
                        <p className="mt-2 text-sm font-body">Categories: {viewUser.categories.join(", ")}</p>
                      )}
                      {viewUser.bio && <p className="mt-2 text-sm font-body text-muted-foreground">{viewUser.bio}</p>}
                    </div>
                  )}

                  {(viewUser.portfolio?.length ?? 0) > 0 && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-display text-sm text-primary uppercase mb-2">Portfolio ({viewUser.portfolio!.length} images)</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {viewUser.portfolio!.map((url) => (
                          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-[3/4] rounded overflow-hidden bg-secondary">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {(viewUser.idPhotoUrl || viewUser.selfieWithIdUrl) && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-display text-sm text-primary uppercase mb-2">Verification</h4>
                      <div className="flex flex-wrap gap-4">
                        {viewUser.idPhotoUrl && (
                          <div>
                            <p className="text-xs text-muted-foreground font-body mb-1">ID / Passport photo</p>
                            <a href={viewUser.idPhotoUrl} target="_blank" rel="noopener noreferrer" className="block w-32 aspect-[3/4] rounded overflow-hidden bg-secondary">
                              <img src={viewUser.idPhotoUrl} alt="ID" className="w-full h-full object-cover" />
                            </a>
                          </div>
                        )}
                        {viewUser.selfieWithIdUrl && (
                          <div>
                            <p className="text-xs text-muted-foreground font-body mb-1">Selfie with ID</p>
                            <a href={viewUser.selfieWithIdUrl} target="_blank" rel="noopener noreferrer" className="block w-32 aspect-[3/4] rounded overflow-hidden bg-secondary">
                              <img src={viewUser.selfieWithIdUrl} alt="Selfie" className="w-full h-full object-cover" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
