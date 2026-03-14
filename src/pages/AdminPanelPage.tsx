import { useState, useEffect, useRef } from "react";
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
  Home,
  Plus,
  X,
  Save,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, publicApi, User, AdminStats, ContactMessage, Casting, HomepageConfig, PublicModel } from "@/lib/api";
import { imgSrc } from "@/lib/utils";

const USERS_PAGE_SIZE = 20;

type TabId = "dashboard" | "users" | "castings" | "marketplace" | "bookings" | "homepage";

const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "castings", label: "Casting Management", icon: Briefcase },
  { id: "marketplace", label: "Marketplace Offers", icon: ShoppingBag },
  { id: "bookings", label: "Bookings & Applications", icon: CreditCard },
  { id: "homepage", label: "Homepage Curation", icon: Home },
];

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(0);
  const [userProfileFilter, setUserProfileFilter] = useState<"all" | "complete" | "incomplete">("all");
  const [userSearch, setUserSearch] = useState("");
  const userSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [authError, setAuthError] = useState("");

  const loadUsers = async (searchOverride?: string) => {
    setUsersLoading(true);
    try {
      const params: Record<string, string> = {};
      if (userProfileFilter !== "all") params.profile = userProfileFilter;
      const q = searchOverride !== undefined ? searchOverride : userSearch;
      if (q.trim()) params.search = q.trim();
      const data = await adminApi.users(Object.keys(params).length ? params : undefined);
      setUsers(data);
    } catch {
      setAuthError("Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  const paginatedUsers = users.slice(usersPage * USERS_PAGE_SIZE, (usersPage + 1) * USERS_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PAGE_SIZE));

  useEffect(() => {
    if (activeTab === "users" && totalPages > 0 && usersPage >= totalPages) {
      setUsersPage(Math.max(0, totalPages - 1));
    }
  }, [activeTab, totalPages, usersPage]);

  useEffect(() => {
    if (activeTab !== "users" || !user?.isAdmin) return;
    if (userSearchRef.current) clearTimeout(userSearchRef.current);
    userSearchRef.current = setTimeout(() => loadUsers(), 350);
    return () => { if (userSearchRef.current) clearTimeout(userSearchRef.current); };
  }, [activeTab, userProfileFilter, userSearch, user?.isAdmin]);

  const [castingList, setCastingList] = useState<Casting[]>([]);
  const [castingsLoading, setCastingsLoading] = useState(false);
  const [castingStatusFilter, setCastingStatusFilter] = useState<string>("all");
  const [castingActionLoading, setCastingActionLoading] = useState<string | null>(null);

  const loadCastings = async (status?: string) => {
    setCastingsLoading(true);
    try {
      const data = await adminApi.castings(status && status !== "all" ? { status } : undefined);
      setCastingList(data);
    } catch {
      setAuthError("Failed to load castings.");
    } finally {
      setCastingsLoading(false);
    }
  };

  const handleCastingAction = async (id: string, action: "approved" | "rejected") => {
    setCastingActionLoading(id);
    try {
      await adminApi.updateCasting(id, { approvalStatus: action });
      await loadCastings(castingStatusFilter);
      await loadStats();
    } catch {
      setAuthError("Failed to update casting.");
    } finally {
      setCastingActionLoading(null);
    }
  };

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactTypeFilter, setContactTypeFilter] = useState<"all" | "booking" | "application" | "partner">("all");

  const loadContacts = async (type?: "booking" | "application" | "partner" | "all") => {
    setContactsLoading(true);
    try {
      const data = await adminApi.contacts(type || "all");
      setContacts(data);
    } catch {
      setAuthError("Failed to load contacts.");
    } finally {
      setContactsLoading(false);
    }
  };

  const [actionModal, setActionModal] = useState<{ user: User; action: "reject" | "changes_requested" } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewUserLoading, setViewUserLoading] = useState(false);

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig | null>(null);
  const [homepageModels, setHomepageModels] = useState<PublicModel[]>([]);
  const [homepageLoading, setHomepageLoading] = useState(false);
  const [homepageSaving, setHomepageSaving] = useState(false);
  const [panelSelects, setPanelSelects] = useState({ newFaces: "", trending: "", latest: "" });

  // Quick-setup: resolve names → IDs
  const [quickSetup, setQuickSetup] = useState({
    newFaces: "OPHELIE,LADLI,EMMY DRH,ROSEDELEANNE,MEGHA,MILES",
    trending: "RITISA,MARY KETH,LAKSHANA,IVAN 09,SAMANTA,KIARA",
    latest: "",
  });
  const [quickSetupLoading, setQuickSetupLoading] = useState(false);
  const [quickSetupResults, setQuickSetupResults] = useState<{
    section: string;
    rows: { id: string | null; name: string; photo?: string }[];
  }[]>([]);
  const [quickSetupError, setQuickSetupError] = useState("");

  const runQuickSetup = async () => {
    setQuickSetupLoading(true);
    setQuickSetupError("");
    setQuickSetupResults([]);
    try {
      const sections = [
        { section: "New Faces", names: quickSetup.newFaces },
        { section: "Trending Models", names: quickSetup.trending },
        ...(quickSetup.latest.trim() ? [{ section: "Latest Models Slider", names: quickSetup.latest }] : []),
      ];
      const allResults: typeof quickSetupResults = [];
      for (const s of sections) {
        const names = s.names.split(",").map((n) => n.trim()).filter(Boolean);
        const { results } = await adminApi.resolveModels(names);
        allResults.push({ section: s.section, rows: results });
      }
      setQuickSetupResults(allResults);
    } catch (e) {
      setQuickSetupError((e as Error).message || "Failed to resolve models");
    } finally {
      setQuickSetupLoading(false);
    }
  };

  const applyQuickSetup = async () => {
    if (!homepageConfig || quickSetupResults.length === 0) return;
    setHomepageSaving(true);
    try {
      const section = (name: string) => quickSetupResults.find((r) => r.section === name);
      const validIds = (rows: { id: string | null }[] | undefined) =>
        (rows || []).map((r) => r.id).filter(Boolean) as string[];

      const newFacesSection = section("New Faces");
      const trendingSection = section("Trending Models");
      const latestSection = section("Latest Models Slider");

      const updated = await adminApi.updateHomepageConfig({
        newFacesIds: newFacesSection ? validIds(newFacesSection.rows) : homepageConfig.newFacesIds,
        trendingIds: trendingSection ? validIds(trendingSection.rows) : homepageConfig.trendingIds,
        latestIds: latestSection ? validIds(latestSection.rows) : homepageConfig.latestIds,
      });
      setHomepageConfig(updated);
      await loadHomepage();
      setQuickSetupResults([]);
    } catch (e) {
      setAuthError("Failed to apply quick setup: " + (e as Error).message);
    } finally {
      setHomepageSaving(false);
    }
  };

  // Category assignment state
  const CATEGORY_ASSIGNMENTS = [
    { category: "Bold", names: ["LEA"] },
    { category: "Bikini", names: ["GWEN SUN"] },
    { category: "Mature", names: ["GENEVIEVECHALAND"] },
    { category: "Glamour", names: ["MEGHA"] },
    { category: "Commercial", names: ["VICTORIA"] },
    { category: "Fitness", names: ["BYRJOHA"] },
  ] as const;
  const [catAssignLoading, setCatAssignLoading] = useState(false);
  const [catAssignResults, setCatAssignResults] = useState<string[]>([]);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const runSeed = async () => {
    setSeedLoading(true);
    setSeedMessage("");
    try {
      const res = await adminApi.seedHomepageAndCategories();
      setSeedMessage(
        `Done. Categories: ${res.categoryAssigned.length}. New Faces: ${res.newFacesIds.length}. Trending: ${res.trendingIds.length}.`
      );
      await loadHomepage();
    } catch (e) {
      setSeedMessage("Error: " + (e as Error).message);
    } finally {
      setSeedLoading(false);
    }
  };

  const runCategoryAssignments = async () => {
    setCatAssignLoading(true);
    setCatAssignResults([]);
    const log: string[] = [];
    try {
      for (const { category, names } of CATEGORY_ASSIGNMENTS) {
        const { results } = await adminApi.resolveModels([...names]);
        for (const r of results) {
          if (r.id) {
            await adminApi.assignCategory(r.id, category);
            log.push(`✓ ${r.name} → ${category}`);
          } else {
            log.push(`✗ "${r.name}" not found`);
          }
        }
      }
    } catch (e) {
      log.push("Error: " + (e as Error).message);
    } finally {
      setCatAssignLoading(false);
      setCatAssignResults(log);
    }
  };

  const loadHomepage = async () => {
    setHomepageLoading(true);
    try {
      const [config, models] = await Promise.all([adminApi.homepageConfig(), publicApi.models()]);
      setHomepageConfig(config);
      setHomepageModels(models);
    } catch {
      setAuthError("Failed to load homepage config.");
    } finally {
      setHomepageLoading(false);
    }
  };

  const saveHomepageConfig = async () => {
    if (!homepageConfig) return;
    setHomepageSaving(true);
    try {
      const updated = await adminApi.updateHomepageConfig({
        newFacesIds: homepageConfig.newFacesIds,
        trendingIds: homepageConfig.trendingIds,
        latestIds: homepageConfig.latestIds,
      });
      setHomepageConfig(updated);
    } catch {
      setAuthError("Failed to save homepage config.");
    } finally {
      setHomepageSaving(false);
    }
  };

  const addToNewFaces = (modelId: string) => {
    if (!homepageConfig || homepageConfig.newFacesIds.includes(modelId)) return;
    setHomepageConfig({ ...homepageConfig, newFacesIds: [...homepageConfig.newFacesIds, modelId] });
  };
  const removeFromNewFaces = (modelId: string) => {
    if (!homepageConfig) return;
    setHomepageConfig({ ...homepageConfig, newFacesIds: homepageConfig.newFacesIds.filter((id) => id !== modelId) });
  };
  const addToTrending = (modelId: string) => {
    if (!homepageConfig || homepageConfig.trendingIds.includes(modelId)) return;
    setHomepageConfig({ ...homepageConfig, trendingIds: [...homepageConfig.trendingIds, modelId] });
  };
  const removeFromTrending = (modelId: string) => {
    if (!homepageConfig) return;
    setHomepageConfig({ ...homepageConfig, trendingIds: homepageConfig.trendingIds.filter((id) => id !== modelId) });
  };
  const addToLatest = (modelId: string) => {
    if (!homepageConfig || homepageConfig.latestIds.includes(modelId)) return;
    setHomepageConfig({ ...homepageConfig, latestIds: [...homepageConfig.latestIds, modelId] });
  };
  const removeFromLatest = (modelId: string) => {
    if (!homepageConfig) return;
    setHomepageConfig({ ...homepageConfig, latestIds: homepageConfig.latestIds.filter((id) => id !== modelId) });
  };

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

  useEffect(() => {
    if (user?.isAdmin) {
      loadStats();
      if (activeTab === "castings") loadCastings(castingStatusFilter);
      if (activeTab === "homepage") loadHomepage();
      if (activeTab === "bookings") loadContacts(contactTypeFilter === "all" ? "all" : contactTypeFilter);
    }
  }, [user?.isAdmin, activeTab]);

  const handleRefresh = () => {
    loadStats();
    if (activeTab === "users") loadUsers();
    if (activeTab === "castings") loadCastings(castingStatusFilter);
    if (activeTab === "homepage") loadHomepage();
    if (activeTab === "bookings") loadContacts(contactTypeFilter === "all" ? "all" : contactTypeFilter);
  };

  const handleApprove = async (u: User) => {
    setActionLoading(true);
    try {
      await adminApi.updateUser(u._id, { status: "approved", rejectionReason: "" });
      loadUsers();
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
      loadUsers();
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
                <button onClick={() => { setActiveTab("bookings"); loadContacts("all"); }} className="px-4 py-2 bg-primary/10 text-primary text-sm font-body hover:bg-primary/20">
                  View Bookings &amp; Applications
                </button>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="font-display text-xl text-foreground">User Management</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-body text-muted-foreground self-center">Profile:</span>
                  {(["all", "complete", "incomplete"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setUserProfileFilter(p); setUsersPage(0); }}
                      className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border transition-colors ${
                        userProfileFilter === p ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {p === "all" ? "All" : p === "complete" ? "Complete" : "Incomplete"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUsersPage(0); }}
                  placeholder="Search by name, username or email…"
                  className="w-full border border-border bg-background pl-9 pr-9 py-2 text-sm font-body focus:outline-none focus:border-primary"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => { setUserSearch(""); setUsersPage(0); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
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
                      {paginatedUsers.map((u) => {
                        const avatarSrc = u.profilePhoto || u.portfolio?.[0];
                        return (
                        <tr key={u._id} className="border-t border-border">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {avatarSrc ? (
                                <img src={imgSrc(avatarSrc)} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                  {u.role === "model" ? <Camera className="w-4 h-4 text-muted-foreground" /> : <Building2 className="w-4 h-4 text-muted-foreground" />}
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-sm">{u.fullName || "—"}</span>
                                <span className="text-muted-foreground text-xs block">ID: {u._id.slice(-6)}</span>
                              </div>
                            </div>
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
                      );})}
                    </tbody>
                  </table>
                  {users.length === 0 && !usersLoading && (
                    <p className="p-6 text-center text-muted-foreground">No users found.</p>
                  )}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-3 border-t border-border">
                      <p className="text-muted-foreground text-xs font-body">
                        {users.length} total · page {usersPage + 1} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUsersPage((p) => Math.max(0, p - 1))}
                          disabled={usersPage === 0}
                          className="text-xs px-2 py-1 border border-border disabled:opacity-50 hover:border-primary text-primary"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setUsersPage((p) => Math.min(totalPages - 1, p + 1))}
                          disabled={usersPage >= totalPages - 1}
                          className="text-xs px-2 py-1 border border-border disabled:opacity-50 hover:border-primary text-primary"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "castings" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <h2 className="font-display text-xl text-foreground">Casting Management</h2>
                <div className="flex flex-wrap gap-2">
                  {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setCastingStatusFilter(s); loadCastings(s); }}
                      className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border transition-colors ${
                        castingStatusFilter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
              </div>
              {castingsLoading ? (
                <p className="text-muted-foreground font-body">Loading castings...</p>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-sm font-body min-w-[600px]">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium">Title</th>
                        <th className="text-left p-3 font-medium">Brand</th>
                        <th className="text-left p-3 font-medium">Creator</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {castingList.map((c) => (
                        <tr key={c._id} className="border-t border-border hover:bg-secondary/30">
                          <td className="p-3">
                            <span className="font-medium text-foreground">{c.title}</span>
                            <span className="text-muted-foreground text-xs block">{c.location || "—"}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">{c.brand || "—"}</td>
                          <td className="p-3">
                            {c.creatorId ? (
                              <div className="flex items-center gap-2">
                                {(c.creatorId as unknown as User).profilePhoto ? (
                                  <img
                                    src={imgSrc((c.creatorId as unknown as User).profilePhoto!)}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                                    <Building2 className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {(c.creatorId as unknown as User).fullName || (c.creatorId as unknown as User).email || "—"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{c.castingType || "—"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                              c.approvalStatus === "approved" ? "bg-green-100 text-green-700" :
                              c.approvalStatus === "rejected" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {c.approvalStatus || "pending"}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="p-3 flex gap-1.5 flex-wrap">
                            {c.approvalStatus !== "approved" && (
                              <button
                                onClick={() => handleCastingAction(c._id, "approved")}
                                disabled={castingActionLoading === c._id}
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                              >
                                {castingActionLoading === c._id ? "..." : "Approve"}
                              </button>
                            )}
                            {c.approvalStatus !== "rejected" && (
                              <button
                                onClick={() => handleCastingAction(c._id, "rejected")}
                                disabled={castingActionLoading === c._id}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                              >
                                {castingActionLoading === c._id ? "..." : "Reject"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {castingList.length === 0 && !castingsLoading && (
                    <p className="p-6 text-center text-muted-foreground text-sm">No castings found for this filter.</p>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "marketplace" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-4">Marketplace Offers</h2>
              <p className="text-muted-foreground font-body">Marketplace offers — approve/reject from this tab when connected.</p>
            </>
          )}

          {activeTab === "homepage" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-xl text-foreground">Homepage Curation</h2>
                <button
                  onClick={saveHomepageConfig}
                  disabled={homepageSaving || !homepageConfig}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-body hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {homepageSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
              <p className="text-muted-foreground font-body text-sm mb-6">
                Manually choose which models appear in each homepage section. Order in the list = display order. Leave a list empty to use the default (newest first).
              </p>

              {/* ── One-click seed ── */}
              <div className="border border-amber-500/40 bg-amber-500/10 p-4 mb-6">
                <h3 className="font-display text-lg text-foreground mb-1">Apply default models (seed)</h3>
                <p className="text-muted-foreground text-xs font-body mb-3">
                  One click: assign categories (Bold→LEA, Bikini→GWEN SUN, etc.) and set New Faces + Trending from the default name lists. Only models that exist in the DB will be applied.
                </p>
                <button
                  onClick={runSeed}
                  disabled={seedLoading}
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-body hover:bg-amber-700 disabled:opacity-50"
                >
                  {seedLoading ? "Applying…" : "Seed now"}
                </button>
                {seedMessage && <p className="text-sm font-body mt-2 text-foreground">{seedMessage}</p>}
              </div>

              {/* ── Quick Setup ── */}
              <div className="border border-primary/30 bg-primary/5 p-6 mb-6">
                <h3 className="font-display text-lg text-primary mb-1">Quick Setup — Assign by Name</h3>
                <p className="text-muted-foreground text-xs font-body mb-4">
                  Enter comma-separated model usernames or full names. Click <strong>Resolve Names</strong> to look them up, then <strong>Apply</strong> to update the homepage sections.
                </p>
                <div className="space-y-3 mb-4">
                  {([
                    { label: "New Faces (6 names)", key: "newFaces" as const, placeholder: "OPHELIE, LADLI, EMMY DRH, ROSEDELEANNE, MEGHA, MILES" },
                    { label: "Trending Models (6 names)", key: "trending" as const, placeholder: "RITISA, MARY KETH, LAKSHANA, IVAN 09, SAMANTA, KIARA" },
                    { label: "Latest Models Slider (optional)", key: "latest" as const, placeholder: "Leave empty to use 16 newest" },
                  ]).map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
                      <input
                        type="text"
                        value={quickSetup[key]}
                        onChange={(e) => setQuickSetup((s) => ({ ...s, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={runQuickSetup}
                    disabled={quickSetupLoading}
                    className="px-4 py-2 border border-primary text-primary text-sm font-body hover:bg-primary/10 disabled:opacity-50"
                  >
                    {quickSetupLoading ? "Resolving…" : "Resolve Names"}
                  </button>
                  {quickSetupResults.length > 0 && (
                    <button
                      onClick={applyQuickSetup}
                      disabled={homepageSaving}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm font-body hover:opacity-90 disabled:opacity-50"
                    >
                      {homepageSaving ? "Saving…" : "Apply to Homepage"}
                    </button>
                  )}
                </div>
                {quickSetupError && <p className="text-destructive text-xs font-body mt-3">{quickSetupError}</p>}
                {quickSetupResults.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {quickSetupResults.map((section) => (
                      <div key={section.section}>
                        <p className="text-xs font-body font-semibold text-foreground uppercase tracking-wider mb-1">{section.section}</p>
                        <ul className="space-y-0.5">
                          {section.rows.map((r, i) => (
                            <li key={i} className={`text-xs font-body flex items-center gap-2 ${r.id ? "text-foreground" : "text-destructive"}`}>
                              {r.id ? "✓" : "✗"} {r.name} {!r.id && <span className="text-muted-foreground">(not found — check username/fullName)</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Category Assignment ── */}
              <div className="border border-border bg-card p-6 mb-6">
                <h3 className="font-display text-lg text-primary mb-1">Category Assignment</h3>
                <p className="text-muted-foreground text-xs font-body mb-1">
                  Assign models to the correct category so they appear on the category sub-pages:
                </p>
                <ul className="text-xs font-body text-muted-foreground mb-4 space-y-0.5 pl-3">
                  <li>Bold → LEA</li>
                  <li>Bikini → GWEN SUN</li>
                  <li>Mature → GENEVIEVECHALAND</li>
                  <li>Glamour → MEGHA</li>
                  <li>Commercial → VICTORIA</li>
                  <li>Fitness → BYRJOHA</li>
                </ul>
                <button
                  onClick={runCategoryAssignments}
                  disabled={catAssignLoading}
                  className="px-4 py-2 border border-border text-sm font-body hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {catAssignLoading ? "Assigning…" : "Assign Categories"}
                </button>
                {catAssignResults.length > 0 && (
                  <ul className="mt-3 space-y-0.5">
                    {catAssignResults.map((line, i) => (
                      <li key={i} className={`text-xs font-body ${line.startsWith("✓") ? "text-foreground" : "text-destructive"}`}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
              {homepageLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : (
                <div className="space-y-6">
                  {/* helper: reusable curation panel */}
                  {(
                    [
                      {
                        title: "New Faces",
                        hint: "Shown in the New Faces section (first 6 on home page). Leave empty → newest first.",
                        ids: homepageConfig?.newFacesIds || [],
                        add: addToNewFaces,
                        remove: removeFromNewFaces,
                        emptyNote: "Empty — default order (newest first) will be used.",
                        selectKey: "newFaces" as const,
                      },
                      {
                        title: "Trending Models",
                        hint: "Shown in the Trending Models section (first 6). Leave empty → first 6 approved.",
                        ids: homepageConfig?.trendingIds || [],
                        add: addToTrending,
                        remove: removeFromTrending,
                        emptyNote: "Empty — first 6 approved models will be used.",
                        selectKey: "trending" as const,
                      },
                      {
                        title: "Latest Models Slider",
                        hint: "Shown in the Latest Models scrolling strip (up to 16). Leave empty → 16 newest.",
                        ids: homepageConfig?.latestIds || [],
                        add: addToLatest,
                        remove: removeFromLatest,
                        emptyNote: "Empty — 16 most recently added models will be used.",
                        selectKey: "latest" as const,
                      },
                    ] as { title: string; hint: string; ids: string[]; add: (id: string) => void; remove: (id: string) => void; emptyNote: string; selectKey: keyof typeof panelSelects }[]
                  ).map((panel) => (
                    <div key={panel.title} className="border border-border bg-card p-6">
                      <h3 className="font-display text-lg text-primary mb-1">{panel.title}</h3>
                      <p className="text-muted-foreground text-xs font-body mb-4">{panel.hint}</p>
                      <select
                        className="border border-border bg-background px-3 py-2 text-sm font-body w-full mb-4"
                        value={panelSelects[panel.selectKey]}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) {
                            panel.add(v);
                            setPanelSelects((s) => ({ ...s, [panel.selectKey]: "" }));
                          }
                        }}
                      >
                        <option value="">+ Add model...</option>
                        {homepageModels
                          .filter((m) => !panel.ids.includes(m._id))
                          .map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.username || m.fullName || m._id.slice(-6)}
                            </option>
                          ))}
                      </select>
                      <ul className="space-y-1 max-h-64 overflow-y-auto">
                        {panel.ids.map((id, idx) => {
                          const m = homepageModels.find((x) => x._id === id);
                          return (
                            <li key={id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border last:border-0">
                              <span className="text-xs text-muted-foreground w-5 shrink-0 text-right">{idx + 1}.</span>
                              <span className="text-sm font-body flex-1 truncate">{m ? (m.username || m.fullName || "—") : id.slice(-8)}</span>
                              <button type="button" onClick={() => panel.remove(id)} className="text-muted-foreground hover:text-destructive p-1 shrink-0" title="Remove">
                                <X className="w-4 h-4" />
                              </button>
                            </li>
                          );
                        })}
                        {panel.ids.length === 0 && (
                          <li className="text-muted-foreground text-sm font-body py-2">{panel.emptyNote}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "bookings" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-xl text-foreground">Bookings &amp; Applications</h2>
                <div className="flex flex-wrap gap-2">
                  {(["all", "booking", "application", "partner"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setContactTypeFilter(t);
                        loadContacts(t);
                      }}
                      className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border transition-colors ${
                        contactTypeFilter === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {t === "all" ? "All Messages" : t === "booking" ? "Booking Requests" : t === "application" ? "Casting Applications" : "Partner Applications"}
                    </button>
                  ))}
                </div>
              </div>
              {contactsLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : contacts.length === 0 ? (
                <div className="border border-border p-8 text-center">
                  <p className="text-muted-foreground font-body text-sm">No messages found for this filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => {
                    const isBooking = c.message.startsWith("[BOOKING REQUEST]");
                    const isApplication = c.message.startsWith("[CASTING APPLICATION]");
                    const isPartner = c.message.startsWith("[Partner Application]");
                    const tag = isBooking ? "Booking" : isApplication ? "Application" : isPartner ? "Partner" : "Message";
                    const tagColor = isBooking
                      ? "bg-blue-100 text-blue-700"
                      : isApplication
                      ? "bg-primary/10 text-primary"
                      : isPartner
                      ? "bg-amber-100 text-amber-700"
                      : "bg-secondary text-secondary-foreground";
                    return (
                      <div key={c._id} className="border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-body font-bold tracking-[0.2em] uppercase px-2 py-0.5 ${tagColor}`}>
                              {tag}
                            </span>
                            <span className="font-body text-sm font-medium text-foreground">{c.name}</span>
                            <span className="text-muted-foreground text-xs font-body">&lt;{c.email}&gt;</span>
                          </div>
                          <span className="text-muted-foreground text-xs font-body">
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                          </span>
                        </div>
                        <pre className="text-muted-foreground text-xs font-body whitespace-pre-wrap leading-relaxed bg-secondary/50 px-3 py-2 max-h-40 overflow-y-auto">
                          {c.message}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {actionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => !actionLoading && setActionModal(null)}>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => !viewUserLoading && setViewUser(null)}>
          <div
            className="bg-background border border-border w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-sm shadow-2xl"
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
                          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-[3/4] rounded overflow-hidden bg-secondary relative">
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.style.display = "none";
                                const fallback = img.nextElementSibling;
                                if (fallback) (fallback as HTMLElement).style.display = "flex";
                              }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center text-xs text-muted-foreground font-body" style={{ display: "none" }}>
                              Image unavailable
                            </div>
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
                            <a href={viewUser.idPhotoUrl} target="_blank" rel="noopener noreferrer" className="block w-32 aspect-[3/4] rounded overflow-hidden bg-secondary relative">
                              <img
                                src={viewUser.idPhotoUrl}
                                alt="ID"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.style.display = "none";
                                  const fallback = img.nextElementSibling;
                                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                                }}
                              />
                              <div className="absolute inset-0 hidden items-center justify-center text-xs text-muted-foreground font-body" style={{ display: "none" }}>
                                Unavailable
                              </div>
                            </a>
                          </div>
                        )}
                        {viewUser.selfieWithIdUrl && (
                          <div>
                            <p className="text-xs text-muted-foreground font-body mb-1">Selfie with ID</p>
                            <a href={viewUser.selfieWithIdUrl} target="_blank" rel="noopener noreferrer" className="block w-32 aspect-[3/4] rounded overflow-hidden bg-secondary relative">
                              <img
                                src={viewUser.selfieWithIdUrl}
                                alt="Selfie"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.style.display = "none";
                                  const fallback = img.nextElementSibling;
                                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                                }}
                              />
                              <div className="absolute inset-0 hidden items-center justify-center text-xs text-muted-foreground font-body" style={{ display: "none" }}>
                                Unavailable
                              </div>
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
