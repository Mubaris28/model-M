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
  Plus,
  X,
  Search,
  LayoutGrid,
  Tag,
  ImageIcon,
  Mail,
  Menu,
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  adminApi,
  applicationApi,
  publicApi,
  User,
  AdminStats,
  ContactMessage,
  Casting,
  type Application,
  type PublicModel,
  type PublicCasting,
  type AdminEmailCapabilities,
  type AdminEmailCampaign,
} from "@/lib/api";
import { imgSrc } from "@/lib/utils";

const USERS_PAGE_SIZE = 20;

type TabId = "dashboard" | "users" | "castings" | "marketplace" | "bookings" | "email" | "homepage" | "categories" | "latest";

const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "castings", label: "Casting Management", icon: Briefcase },
  { id: "marketplace", label: "Marketplace Offers", icon: ShoppingBag },
  { id: "bookings", label: "Bookings & Applications", icon: CreditCard },
  { id: "email", label: "Email Campaigns", icon: Mail },
  { id: "homepage", label: "New Faces & Trending", icon: LayoutGrid },
  { id: "categories", label: "Category Pages", icon: Tag },
  { id: "latest", label: "Latest Models", icon: ImageIcon },
];

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
  const [selectedCasting, setSelectedCasting] = useState<Casting | null>(null);

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

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [useFilterTargeting, setUseFilterTargeting] = useState(true);
  const [useSpecificTargeting, setUseSpecificTargeting] = useState(false);
  const [emailRoleFilters, setEmailRoleFilters] = useState<Array<"model" | "professional">>([]);
  const [emailStatusFilters, setEmailStatusFilters] = useState<Array<"approved" | "rejected" | "pending">>([]);
  const [emailProfileCompleteOnly, setEmailProfileCompleteOnly] = useState(false);
  const [emailGenderFilters, setEmailGenderFilters] = useState<Array<"male" | "female">>([]);
  const [specificEmailsText, setSpecificEmailsText] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResultMessage, setEmailResultMessage] = useState<string | null>(null);
  const [emailCapabilities, setEmailCapabilities] = useState<AdminEmailCapabilities | null>(null);
  const [emailCapabilitiesLoading, setEmailCapabilitiesLoading] = useState(false);
  const [emailHistory, setEmailHistory] = useState<AdminEmailCampaign[]>([]);
  const [emailHistoryLoading, setEmailHistoryLoading] = useState(false);
  const [showEmailHistory, setShowEmailHistory] = useState(false);

  const toggleFilterValue = <T extends string,>(value: T, list: T[], setList: (next: T[]) => void) => {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const parseSpecificEmails = (text: string) =>
    Array.from(
      new Set(
        text
          .split(/[\n,;]+/)
          .map((x) => x.trim().toLowerCase())
          .filter((x) => x.includes("@"))
      )
    );

  const loadEmailCapabilities = async () => {
    setEmailCapabilitiesLoading(true);
    try {
      const data = await adminApi.emailCapabilities();
      setEmailCapabilities(data);
    } catch {
      setAuthError("Failed to check email provider capabilities.");
    } finally {
      setEmailCapabilitiesLoading(false);
    }
  };

  const loadEmailHistory = async () => {
    setEmailHistoryLoading(true);
    try {
      const data = await adminApi.emailHistory(40);
      setEmailHistory(data);
    } catch {
      setAuthError("Failed to load email history.");
    } finally {
      setEmailHistoryLoading(false);
    }
  };

  const sendEmailCampaign = async () => {
    const subject = emailSubject.trim();
    const message = emailMessage.trim();
    const specificEmails = parseSpecificEmails(specificEmailsText);

    if (!subject || !message) {
      setEmailResultMessage("Subject and message are required.");
      return;
    }
    if (!useFilterTargeting && !useSpecificTargeting) {
      setEmailResultMessage("Enable at least one target mode: filters or specific users.");
      return;
    }
    if (useSpecificTargeting && specificEmails.length === 0) {
      setEmailResultMessage("Add at least one specific user email.");
      return;
    }

    setEmailSending(true);
    setEmailResultMessage(null);
    try {
      const result = await adminApi.sendEmailCampaign({
        subject,
        message,
        useFilters: useFilterTargeting,
        useSpecific: useSpecificTargeting,
        specificEmails,
        filters: {
          roles: emailRoleFilters,
          statuses: emailStatusFilters,
          profileCompleteOnly: emailProfileCompleteOnly,
          genders: emailGenderFilters,
        },
      });
      setEmailResultMessage(
        `Sent to ${result.successCount}/${result.recipientCount} recipients (${result.failedCount} failed). ${result.usedBulkApi ? "Resend bulk API used." : "Single-send mode used."}`
      );
      setShowEmailHistory(true);
      loadEmailHistory();
    } catch (err) {
      setEmailResultMessage((err as Error).message || "Failed to send emails.");
    } finally {
      setEmailSending(false);
    }
  };

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

  const [castingApps, setCastingApps] = useState<Application[]>([]);
  const [castingAppsLoading, setCastingAppsLoading] = useState(false);
  const [castingAppsFor, setCastingAppsFor] = useState<Casting | null>(null);
  const [castingAppActionLoading, setCastingAppActionLoading] = useState<string | null>(null);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [batchSuggestLoading, setBatchSuggestLoading] = useState(false);
  const [adminSuggestionFor, setAdminSuggestionFor] = useState<Casting | null>(null);
  const [adminSuggestModels, setAdminSuggestModels] = useState<PublicModel[]>([]);
  const [adminSuggestLoading, setAdminSuggestLoading] = useState(false);
  const [adminSuggestSending, setAdminSuggestSending] = useState(false);
  const [adminSuggestSearch, setAdminSuggestSearch] = useState("");
  const [selectedSuggestModelIds, setSelectedSuggestModelIds] = useState<Set<string>>(new Set());
  const [adminSuggestMessage, setAdminSuggestMessage] = useState<string | null>(null);

  const loadCastingApplications = async (castingId: string) => {
    setCastingAppsLoading(true);
    try {
      const data = await applicationApi.adminCastingApplications(castingId);
      setCastingApps(data);
    } catch {
      setAuthError("Failed to load applications.");
    } finally {
      setCastingAppsLoading(false);
    }
  };

  const handleSuggest = async (id: string) => {
    setCastingAppActionLoading(id);
    try {
      await applicationApi.adminSuggest(id);
      setCastingApps((prev) => prev.map((a) => a._id === id ? { ...a, status: "suggested" as const } : a));
    } catch {
      setAuthError("Failed to suggest model.");
    } finally {
      setCastingAppActionLoading(null);
    }
  };

  const handleRejectApp = async (id: string) => {
    setCastingAppActionLoading(id);
    try {
      await applicationApi.adminReject(id);
      setCastingApps((prev) => prev.map((a) => a._id === id ? { ...a, status: "rejected" as const } : a));
      setSelectedAppIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } catch {
      setAuthError("Failed to reject application.");
    } finally {
      setCastingAppActionLoading(null);
    }
  };

  const handleBatchSuggest = async () => {
    if (selectedAppIds.size === 0) return;
    setBatchSuggestLoading(true);
    try {
      await Promise.all([...selectedAppIds].map((id) => applicationApi.adminSuggest(id)));
      setCastingApps((prev) =>
        prev.map((a) => selectedAppIds.has(a._id) ? { ...a, status: "suggested" as const } : a)
      );
      setSelectedAppIds(new Set());
    } catch {
      setAuthError("Failed to suggest selected models.");
    } finally {
      setBatchSuggestLoading(false);
    }
  };

  const openAdminSuggestions = async (casting: Casting) => {
    setAdminSuggestionFor(casting);
    setAdminSuggestSearch("");
    setSelectedSuggestModelIds(new Set());
    setAdminSuggestMessage(null);
    if (adminSuggestModels.length > 0) return;

    setAdminSuggestLoading(true);
    try {
      const models = await publicApi.models();
      setAdminSuggestModels(models);
    } catch {
      setAuthError("Failed to load models for suggestions.");
    } finally {
      setAdminSuggestLoading(false);
    }
  };

  const handleAdminSuggestToCasting = async () => {
    if (!adminSuggestionFor || selectedSuggestModelIds.size === 0) return;
    setAdminSuggestSending(true);
    setAdminSuggestMessage(null);
    try {
      const result = await applicationApi.adminSuggestToCasting({
        castingId: adminSuggestionFor._id,
        modelIds: [...selectedSuggestModelIds],
      });
      setAdminSuggestMessage(`Suggestions sent: ${result.total} (${result.created} new, ${result.updated} updated).`);
      setSelectedSuggestModelIds(new Set());
      if (castingAppsFor?._id === adminSuggestionFor._id) {
        await loadCastingApplications(adminSuggestionFor._id);
      }
    } catch {
      setAdminSuggestMessage("Failed to send admin suggestions.");
    } finally {
      setAdminSuggestSending(false);
    }
  };

  const [actionModal, setActionModal] = useState<{ user: User; action: "reject" | "changes_requested" } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewUserLoading, setViewUserLoading] = useState(false);

  const [homepageSectionsLoading, setHomepageSectionsLoading] = useState(false);
  const [homepageSectionsSaving, setHomepageSectionsSaving] = useState(false);
  const [homepageData, setHomepageData] = useState<{
    config: { newFacesIds: string[]; trendingIds: string[]; trendingCastingIds: string[] };
    newFaces: PublicModel[];
    trending: PublicModel[];
    approvedModels: PublicModel[];
    trendingCastings: PublicCasting[];
    approvedCastings: PublicCasting[];
  } | null>(null);
  const [newFacesIdsLocal, setNewFacesIdsLocal] = useState<string[]>([]);
  const [trendingIdsLocal, setTrendingIdsLocal] = useState<string[]>([]);
  const [trendingCastingIdsLocal, setTrendingCastingIdsLocal] = useState<string[]>([]);
  const [addModelModal, setAddModelModal] = useState<"newFaces" | "trending" | null>(null);
  const [addModelSearch, setAddModelSearch] = useState("");
  const [addCastingModal, setAddCastingModal] = useState(false);
  const [addCastingSearch, setAddCastingSearch] = useState("");

  // Categories section state
  const [categoriesData, setCategoriesData] = useState<{
    mainCategories: { slug: string; name: string; description: string }[];
    categorySlots: Record<string, { ids: string[]; models: PublicModel[] }>;
    approvedModels: PublicModel[];
  } | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesSaving, setCategoriesSaving] = useState<string | null>(null);
  const [mainCategoriesSaving, setMainCategoriesSaving] = useState(false);
  const [mainCategoriesLocal, setMainCategoriesLocal] = useState<{ slug: string; name: string; description: string }[]>([]);
  const [categoryIdsLocal, setCategoryIdsLocal] = useState<Record<string, string[]>>({});
  const [addCategoryModal, setAddCategoryModal] = useState<string | null>(null);
  const [addCategorySearch, setAddCategorySearch] = useState("");
  const [addMainCategoryOpen, setAddMainCategoryOpen] = useState(false);
  const [newMainCategory, setNewMainCategory] = useState({ name: "", slug: "", description: "" });

  // Latest Models section state
  const [latestData, setLatestData] = useState<{
    ids: string[]; count: number; latestModels: PublicModel[]; approvedModels: PublicModel[];
  } | null>(null);
  const [latestLoading, setLatestLoading] = useState(false);
  const [latestSaving, setLatestSaving] = useState(false);
  const [latestIdsLocal, setLatestIdsLocal] = useState<string[]>([]);
  const [latestCountLocal, setLatestCountLocal] = useState(16);
  const [addLatestModal, setAddLatestModal] = useState(false);
  const [addLatestSearch, setAddLatestSearch] = useState("");
  const [latestMode, setLatestMode] = useState<"auto" | "manual">("auto");

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

  const loadHomepageSections = async () => {
    setHomepageSectionsLoading(true);
    try {
      const data = await adminApi.homepageSections();
      setHomepageData(data);
      setNewFacesIdsLocal(data.config.newFacesIds);
      setTrendingIdsLocal(data.config.trendingIds);
      setTrendingCastingIdsLocal(data.config.trendingCastingIds || []);
    } catch {
      setAuthError("Failed to load homepage sections.");
    } finally {
      setHomepageSectionsLoading(false);
    }
  };

  const loadCategoriesData = async () => {
    setCategoriesLoading(true);
    try {
      const data = await adminApi.homepageCategories();
      setCategoriesData(data);
      setMainCategoriesLocal(data.mainCategories?.length ? data.mainCategories : []);
      const localMap: Record<string, string[]> = {};
      for (const slug of Object.keys(data.categorySlots || {})) {
        localMap[slug] = data.categorySlots[slug].ids;
      }
      setCategoryIdsLocal(localMap);
    } catch { setAuthError("Failed to load categories."); }
    finally { setCategoriesLoading(false); }
  };

  const saveMainCategories = async () => {
    setMainCategoriesSaving(true);
    try {
      await adminApi.updateHomepageCategoriesMain(mainCategoriesLocal);
      await loadCategoriesData();
    } catch { setAuthError("Failed to save main categories."); }
    finally { setMainCategoriesSaving(false); }
  };

  const addMainCategory = () => {
    const slug = newMainCategory.slug.trim() || String(newMainCategory.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "category";
    const name = newMainCategory.name.trim() || slug;
    if (!slug) return;
    if (mainCategoriesLocal.some((c) => c.slug === slug)) {
      setAuthError("A category with this slug already exists.");
      return;
    }
    setMainCategoriesLocal((prev) => [...prev, { slug, name, description: newMainCategory.description.trim() }]);
    setCategoryIdsLocal((prev) => ({ ...prev, [slug]: prev[slug] ?? [] }));
    setNewMainCategory({ name: "", slug: "", description: "" });
    setAddMainCategoryOpen(false);
  };

  const removeMainCategory = (slug: string) => {
    setMainCategoriesLocal((prev) => prev.filter((c) => c.slug !== slug));
  };

  const moveMainCategory = (index: number, dir: 1 | -1) => {
    const j = index + dir;
    if (j < 0 || j >= mainCategoriesLocal.length) return;
    setMainCategoriesLocal((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const updateMainCategoryAt = (index: number, field: "name" | "slug" | "description", value: string) => {
    setMainCategoriesLocal((prev) => {
      const next = [...prev];
      const cur = next[index];
      next[index] = { ...cur, [field]: value };
      return next;
    });
  };

  const saveCategorySection = async (slug: string) => {
    setCategoriesSaving(slug);
    try {
      await adminApi.updateHomepageCategory(slug, categoryIdsLocal[slug] || []);
      await loadCategoriesData();
    } catch { setAuthError("Failed to save category."); }
    finally { setCategoriesSaving(null); }
  };

  const loadLatestData = async () => {
    setLatestLoading(true);
    try {
      const data = await adminApi.homepageLatest();
      setLatestData(data);
      setLatestIdsLocal(data.ids);
      setLatestCountLocal(data.count);
      setLatestMode(data.ids.length > 0 ? "manual" : "auto");
    } catch { setAuthError("Failed to load latest models."); }
    finally { setLatestLoading(false); }
  };

  const saveLatestSection = async () => {
    setLatestSaving(true);
    try {
      await adminApi.updateHomepageLatest({
        ids: latestMode === "manual" ? latestIdsLocal : [],
        count: latestCountLocal,
      });
      await loadLatestData();
    } catch { setAuthError("Failed to save latest models."); }
    finally { setLatestSaving(false); }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      loadStats();
      if (activeTab === "castings") loadCastings(castingStatusFilter);
      if (activeTab === "bookings") loadContacts(contactTypeFilter === "all" ? "all" : contactTypeFilter);
      if (activeTab === "email") loadEmailCapabilities();
      if (activeTab === "homepage") loadHomepageSections();
      if (activeTab === "categories") loadCategoriesData();
      if (activeTab === "latest") loadLatestData();
    }
  }, [user?.isAdmin, activeTab]);

  const handleRefresh = () => {
    loadStats();
    if (activeTab === "users") loadUsers();
    if (activeTab === "castings") loadCastings(castingStatusFilter);
    if (activeTab === "bookings") loadContacts(contactTypeFilter === "all" ? "all" : contactTypeFilter);
    if (activeTab === "email") {
      loadEmailCapabilities();
      if (showEmailHistory) loadEmailHistory();
    }
    if (activeTab === "homepage") loadHomepageSections();
    if (activeTab === "categories") loadCategoriesData();
    if (activeTab === "latest") loadLatestData();
  };

  const saveHomepageSections = async () => {
    setHomepageSectionsSaving(true);
    try {
      await adminApi.updateHomepageSections({ newFacesIds: newFacesIdsLocal, trendingIds: trendingIdsLocal, trendingCastingIds: trendingCastingIdsLocal });
      await loadHomepageSections();
    } catch {
      setAuthError("Failed to save homepage sections.");
    } finally {
      setHomepageSectionsSaving(false);
    }
  };

  const addModelToSection = (section: "newFaces" | "trending", modelId: string) => {
    if (section === "newFaces" && !newFacesIdsLocal.includes(modelId)) setNewFacesIdsLocal((prev) => [...prev, modelId]);
    if (section === "trending" && !trendingIdsLocal.includes(modelId)) setTrendingIdsLocal((prev) => [...prev, modelId]);
  };

  const removeModelFromSection = (section: "newFaces" | "trending", modelId: string) => {
    if (section === "newFaces") setNewFacesIdsLocal((prev) => prev.filter((id) => id !== modelId));
    if (section === "trending") setTrendingIdsLocal((prev) => prev.filter((id) => id !== modelId));
  };

  const addCastingToTrending = (castingId: string) => {
    if (!trendingCastingIdsLocal.includes(castingId)) setTrendingCastingIdsLocal((prev) => [...prev, castingId]);
  };
  const removeCastingFromTrending = (castingId: string) => {
    setTrendingCastingIdsLocal((prev) => prev.filter((id) => id !== castingId));
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

  const sidebarContent = (isMobile = false) => (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <span className="font-display text-lg text-primary">{isMobile || !sidebarCollapsed ? "Admin Panel" : ""}</span>
        {isMobile ? (
          <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-muted-foreground hover:text-primary" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-muted-foreground hover:text-primary"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); if (isMobile) setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-body transition-colors ${
              activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            {(isMobile || !sidebarCollapsed) && tab.label}
          </button>
        ))}
      </nav>
      <div className="p-2 border-t border-border space-y-1">
        {(isMobile || !sidebarCollapsed) && (
          <Link
            to="/admin/premium-users"
            className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary"
            onClick={() => isMobile && setMobileSidebarOpen(false)}
          >
            <CreditCard className="w-4 h-4" />
            Premium Users
          </Link>
        )}
        {(isMobile || !sidebarCollapsed) && (
          <Link
            to="/admin/bank-transfers"
            className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary"
            onClick={() => isMobile && setMobileSidebarOpen(false)}
          >
            <Banknote className="w-4 h-4" />
            Payment Verifications
          </Link>
        )}
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary">
          <ExternalLink className="w-4 h-4" />
          {(isMobile || !sidebarCollapsed) && "View Site"}
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary">
          <LogOut className="w-4 h-4" />
          {(isMobile || !sidebarCollapsed) && "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card transition-all ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col md:hidden shadow-xl"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-border bg-card px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary rounded-md border border-border"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl md:text-2xl text-primary">Admin Panel</h1>
              <p className="text-muted-foreground text-xs md:text-sm font-body truncate max-w-[180px] md:max-w-none">Welcome, {user?.email || "admin"}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 md:px-4 py-2 border border-border text-xs md:text-sm font-body hover:border-primary hover:text-primary"
          >
            <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Refresh Data</span><span className="sm:hidden">Refresh</span>
          </button>
        </header>

        {authError && activeTab !== "dashboard" && (
          <div className="mx-4 md:mx-6 mt-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {authError}
          </div>
        )}

        <div className="p-3 md:p-6">
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
                                <span className="font-medium text-sm">{u.fullName || ""}</span>
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
                              {u.role || ""}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 text-xs bg-secondary">{u.status || "pending"}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
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
                            <span className="text-muted-foreground text-xs block">{c.location || ""}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">{c.brand || ""}</td>
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
                                  {(c.creatorId as unknown as User).fullName || (c.creatorId as unknown as User).email || ""}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs"></span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{c.castingType || ""}</td>
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
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                          </td>
                          <td className="p-3 flex gap-1.5 flex-wrap">
                            <button
                              onClick={() => setSelectedCasting(c)}
                              className="text-xs px-2 py-1 bg-secondary text-foreground hover:bg-secondary/70"
                            >
                              View
                            </button>
                            <button
                              onClick={() => { setCastingAppsFor(c); loadCastingApplications(c._id); setSelectedAppIds(new Set()); }}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              Applications
                            </button>
                            <button
                              onClick={() => openAdminSuggestions(c)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              Admin Suggestions
                            </button>
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
              <p className="text-muted-foreground font-body">Marketplace offers: approve/reject from this tab when connected.</p>
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
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
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

          {activeTab === "email" && (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-display text-xl text-foreground">Email Campaigns</h2>
                  <p className="text-muted-foreground text-sm font-body mt-1">
                    Send campaign emails by filters, specific users, or both.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !showEmailHistory;
                    setShowEmailHistory(next);
                    if (next) loadEmailHistory();
                  }}
                  className="px-3 py-2 border border-border text-xs font-body uppercase tracking-wider hover:border-primary text-primary"
                >
                  {showEmailHistory ? "Hide message history" : "Read message history"}
                </button>
              </div>

              <div className="border border-border bg-card p-4 mb-5">
                <h3 className="font-display text-base text-primary mb-2">Resend bulk capability</h3>
                {emailCapabilitiesLoading ? (
                  <p className="text-muted-foreground text-sm font-body">Checking provider settings...</p>
                ) : emailCapabilities ? (
                  <div className="space-y-1 text-sm font-body">
                    <p className="text-foreground">Provider: {emailCapabilities.provider}</p>
                    <p className={emailCapabilities.configured ? "text-green-700" : "text-red-700"}>
                      {emailCapabilities.configured ? "Configured" : "Not configured"}
                    </p>
                    <p className={emailCapabilities.supportsBulkApi ? "text-green-700" : "text-amber-700"}>
                      {emailCapabilities.supportsBulkApi
                        ? `Bulk API supported (max batch ${emailCapabilities.maxBatchSize}).`
                        : "Bulk API not available; server will send one by one."}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm font-body">No provider details available.</p>
                )}
              </div>

              <div className="border border-border bg-card p-5 mb-5 space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Campaign subject"
                    className="w-full border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider">Message</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Write email message"
                    className="w-full border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:border-primary min-h-[180px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="email-use-filters"
                        type="checkbox"
                        checked={useFilterTargeting}
                        onChange={(e) => setUseFilterTargeting(e.target.checked)}
                      />
                      <label htmlFor="email-use-filters" className="text-sm font-body text-foreground">Use filter targeting</label>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-body uppercase tracking-wider text-muted-foreground">Role</p>
                      <div className="flex flex-wrap gap-2">
                        {(["model", "professional"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => toggleFilterValue(role, emailRoleFilters, setEmailRoleFilters)}
                            className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border ${
                              emailRoleFilters.includes(role)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {role === "model" ? "Models only" : "Professionals only"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-body uppercase tracking-wider text-muted-foreground">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {(["approved", "rejected", "pending"] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => toggleFilterValue(status, emailStatusFilters, setEmailStatusFilters)}
                            className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border ${
                              emailStatusFilters.includes(status)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-body uppercase tracking-wider text-muted-foreground">Gender</p>
                      <div className="flex flex-wrap gap-2">
                        {(["male", "female"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleFilterValue(g, emailGenderFilters, setEmailGenderFilters)}
                            className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider border ${
                              emailGenderFilters.includes(g)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="email-profile-complete"
                        type="checkbox"
                        checked={emailProfileCompleteOnly}
                        onChange={(e) => setEmailProfileCompleteOnly(e.target.checked)}
                      />
                      <label htmlFor="email-profile-complete" className="text-sm font-body text-foreground">Profile completed only</label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="email-use-specific"
                        type="checkbox"
                        checked={useSpecificTargeting}
                        onChange={(e) => setUseSpecificTargeting(e.target.checked)}
                      />
                      <label htmlFor="email-use-specific" className="text-sm font-body text-foreground">Use specific users only/also</label>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider">
                        Specific user emails (comma or newline separated)
                      </label>
                      <textarea
                        value={specificEmailsText}
                        onChange={(e) => setSpecificEmailsText(e.target.value)}
                        placeholder="user1@example.com\nuser2@example.com"
                        className="w-full border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:border-primary min-h-[180px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-body">
                      Tip: disable &quot;Use filter targeting&quot; and enable this block to send to specific users only.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={sendEmailCampaign}
                    disabled={emailSending}
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-body uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                  >
                    {emailSending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send email"}
                  </button>
                  {emailResultMessage && (
                    <p className="text-sm font-body text-muted-foreground">{emailResultMessage}</p>
                  )}
                </div>
              </div>

              {showEmailHistory && (
                <div className="border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="font-display text-base text-primary">Message history</h3>
                    <button
                      type="button"
                      onClick={loadEmailHistory}
                      className="text-xs font-body uppercase tracking-wider text-primary hover:underline"
                    >
                      Refresh history
                    </button>
                  </div>

                  {emailHistoryLoading ? (
                    <p className="text-muted-foreground text-sm font-body">Loading history...</p>
                  ) : emailHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm font-body">No campaign messages yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {emailHistory.map((item) => (
                        <div key={item._id} className="border border-border bg-background p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm font-body font-medium text-foreground">{item.subject}</p>
                              <p className="text-xs text-muted-foreground font-body">
                                {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                                {item.createdBy?.email ? ` · by ${item.createdBy.fullName || item.createdBy.email}` : ""}
                              </p>
                            </div>
                            <div className="text-right text-xs font-body text-muted-foreground">
                              <p>Recipients: {item.recipientCount ?? 0}</p>
                              <p>Success: {item.successCount ?? 0} · Failed: {item.failedCount ?? 0}</p>
                              <p>{item.usedBulkApi ? "Bulk API used" : "Single-send mode"}</p>
                            </div>
                          </div>
                          <pre className="text-xs font-body text-muted-foreground whitespace-pre-wrap bg-secondary/40 px-2 py-2 max-h-36 overflow-y-auto">
                            {item.message}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "homepage" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-2">Homepage Sections</h2>
              <p className="text-muted-foreground text-sm font-body mb-6">
                Choose which models appear in <strong>New Faces</strong> and <strong>Trending</strong> on the homepage. Add or remove cards below, then click Save.
              </p>
              {homepageSectionsLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : homepageData ? (
                <>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="border border-border bg-card p-5">
                      <h3 className="font-display text-lg text-primary mb-3 flex items-center justify-between">
                        New Faces
                        <button
                          type="button"
                          onClick={() => { setAddModelModal("newFaces"); setAddModelSearch(""); }}
                          className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add model
                        </button>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {newFacesIdsLocal.map((id) => {
                          const m = homepageData.approvedModels.find((x) => x._id === id);
                          if (!m) return null;
                          const photo = m.profilePhoto || m.portfolio?.[0];
                          return (
                            <div key={m._id} className="flex items-center gap-2 border border-border p-2 bg-background w-[180px]">
                              {photo ? (
                                <img src={imgSrc(photo)} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                  <Camera className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-body truncate text-foreground">{m.fullName || m.username || "Model"}</p>
                                <button
                                  type="button"
                                  onClick={() => removeModelFromSection("newFaces", m._id)}
                                  className="text-xs text-destructive hover:underline font-body"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {newFacesIdsLocal.length === 0 && (
                          <p className="text-muted-foreground text-sm font-body">No models added. Click &quot;Add model&quot; to choose.</p>
                        )}
                      </div>
                    </div>
                    <div className="border border-border bg-card p-5">
                      <h3 className="font-display text-lg text-primary mb-3 flex items-center justify-between">
                        Trending
                        <button
                          type="button"
                          onClick={() => { setAddModelModal("trending"); setAddModelSearch(""); }}
                          className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add model
                        </button>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {trendingIdsLocal.map((id) => {
                          const m = homepageData.approvedModels.find((x) => x._id === id);
                          if (!m) return null;
                          const photo = m.profilePhoto || m.portfolio?.[0];
                          return (
                            <div key={m._id} className="flex items-center gap-2 border border-border p-2 bg-background w-[180px]">
                              {photo ? (
                                <img src={imgSrc(photo)} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                  <Camera className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-body truncate text-foreground">{m.fullName || m.username || "Model"}</p>
                                <button
                                  type="button"
                                  onClick={() => removeModelFromSection("trending", m._id)}
                                  className="text-xs text-destructive hover:underline font-body"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {trendingIdsLocal.length === 0 && (
                          <p className="text-muted-foreground text-sm font-body">No models added. Click &quot;Add model&quot; to choose.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-border bg-card p-5 mb-8">
                    <h3 className="font-display text-lg text-primary mb-3 flex items-center justify-between">
                      Trending Castings
                      <button
                        type="button"
                        onClick={() => { setAddCastingModal(true); setAddCastingSearch(""); }}
                        className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add casting
                      </button>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {trendingCastingIdsLocal.map((cid) => {
                        const c = homepageData.approvedCastings?.find((x) => x._id === cid);
                        if (!c) return null;
                        return (
                          <div key={c._id} className="flex items-center gap-2 border border-border p-2 bg-background w-[220px]">
                            {c.imageUrls?.[0] ? (
                              <img src={imgSrc(c.imageUrls[0])} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-body truncate text-foreground">{c.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.brand || ""}</p>
                              <button
                                type="button"
                                onClick={() => removeCastingFromTrending(c._id)}
                                className="text-xs text-destructive hover:underline font-body"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {trendingCastingIdsLocal.length === 0 && (
                        <p className="text-muted-foreground text-sm font-body">No castings added. Click &quot;Add casting&quot; or leave empty to show latest approved castings.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={saveHomepageSections}
                      disabled={homepageSectionsSaving}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider disabled:opacity-50"
                    >
                      {homepageSectionsSaving ? "Saving..." : "Save changes"}
                    </button>
                    <p className="text-muted-foreground text-xs font-body">
                      Changes will appear on the homepage after you save.
                    </p>
                  </div>
                </>
              ) : null}
            </>
          )}

          {/* ── CATEGORIES TAB ── */}
          {activeTab === "categories" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-2">Categories section</h2>
              <p className="text-muted-foreground text-sm font-body mb-6">
                <strong>Main cards</strong> are the category cards on the homepage. Add, remove, or reorder them below and edit name/description. <strong>Sub cards</strong> are the models shown on each category page: assign models per category; the first model&apos;s photo is the category card image.
              </p>
              {categoriesLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : categoriesData ? (
                <div className="space-y-8">
                  {/* Main cards: add / remove / reorder / edit */}
                  <div className="border border-border bg-card p-5">
                    <h3 className="font-display text-lg text-primary mb-3 flex items-center justify-between">
                      Main cards (homepage)
                      <button
                        type="button"
                        onClick={() => { setAddMainCategoryOpen(true); setNewMainCategory({ name: "", slug: "", description: "" }); }}
                        className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add category
                      </button>
                    </h3>
                    <p className="text-muted-foreground text-sm font-body mb-4">These cards appear in the Categories section. Order and labels are used on the site.</p>
                    <div className="space-y-3 mb-4">
                      {mainCategoriesLocal.map((cat, index) => (
                        <div key={cat.slug} className="flex flex-wrap items-center gap-3 border border-border p-3 bg-background">
                          <div className="flex flex-col gap-0.5">
                            <button type="button" onClick={() => moveMainCategory(index, -1)} disabled={index === 0} className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30" title="Move up"><ChevronUp className="w-4 h-4" /></button>
                            <button type="button" onClick={() => moveMainCategory(index, 1)} disabled={index === mainCategoriesLocal.length - 1} className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30" title="Move down"><ChevronDown className="w-4 h-4" /></button>
                          </div>
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => updateMainCategoryAt(index, "name", e.target.value)}
                            placeholder="Name"
                            className="w-32 border border-border bg-background px-2 py-1.5 text-sm font-body"
                          />
                          <input
                            type="text"
                            value={cat.slug}
                            onChange={(e) => updateMainCategoryAt(index, "slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                            placeholder="slug"
                            className="w-28 border border-border bg-background px-2 py-1.5 text-sm font-body text-muted-foreground"
                          />
                          <input
                            type="text"
                            value={cat.description}
                            onChange={(e) => updateMainCategoryAt(index, "description", e.target.value)}
                            placeholder="Short description"
                            className="flex-1 min-w-[160px] border border-border bg-background px-2 py-1.5 text-sm font-body"
                          />
                          <button type="button" onClick={() => removeMainCategory(cat.slug)} className="text-xs text-destructive hover:underline font-body">Remove</button>
                        </div>
                      ))}
                      {mainCategoriesLocal.length === 0 && <p className="text-muted-foreground text-sm font-body">No main categories. Click &quot;Add category&quot; to create one.</p>}
                    </div>
                    <button
                      type="button"
                      onClick={saveMainCategories}
                      disabled={mainCategoriesSaving}
                      className="px-4 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {mainCategoriesSaving ? "Saving…" : "Save main cards"}
                    </button>
                  </div>

                  {addMainCategoryOpen && (
                    <div className="border border-border bg-card p-5">
                      <h4 className="font-display text-base text-primary mb-3">New main category</h4>
                      <div className="flex flex-wrap items-end gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Name</label>
                          <input
                            type="text"
                            value={newMainCategory.name}
                            onChange={(e) => setNewMainCategory((prev) => ({ ...prev, name: e.target.value, slug: prev.slug || e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
                            placeholder="e.g. Artistic"
                            className="w-48 border border-border bg-background px-2 py-1.5 text-sm font-body"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Slug (URL)</label>
                          <input
                            type="text"
                            value={newMainCategory.slug}
                            onChange={(e) => setNewMainCategory((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
                            placeholder="e.g. artistic"
                            className="w-40 border border-border bg-background px-2 py-1.5 text-sm font-body"
                          />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Description</label>
                          <input
                            type="text"
                            value={newMainCategory.description}
                            onChange={(e) => setNewMainCategory((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Short description for the card"
                            className="w-full border border-border bg-background px-2 py-1.5 text-sm font-body"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={addMainCategory} className="px-3 py-1.5 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wider">Add</button>
                        <button type="button" onClick={() => { setAddMainCategoryOpen(false); setNewMainCategory({ name: "", slug: "", description: "" }); }} className="px-3 py-1.5 border border-border font-body text-xs uppercase tracking-wider">Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Sub cards: models per category; first model = category card image on homepage */}
                  <h3 className="font-display text-lg text-primary">Sub cards (models per category)</h3>
                  <p className="text-muted-foreground text-sm font-body mb-4">The <strong>first model</strong> in each list is used as that category&apos;s card image on the homepage. Use the arrows to reorder, then Save.</p>
                  {mainCategoriesLocal.map((cat) => {
                    const slug = cat.slug;
                    const ids = categoryIdsLocal[slug] ?? [];
                    const label = cat.name || slug.charAt(0).toUpperCase() + slug.slice(1);
                    const moveModel = (index: number, dir: 1 | -1) => {
                      const next = [...ids];
                      const j = index + dir;
                      if (j < 0 || j >= next.length) return;
                      [next[index], next[j]] = [next[j], next[index]];
                      setCategoryIdsLocal((prev) => ({ ...prev, [slug]: next }));
                    };
                    return (
                      <div key={slug} className="border border-border bg-card p-5">
                        <h4 className="font-display text-base text-primary mb-3 flex items-center justify-between">
                          {label}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => { setAddCategoryModal(slug); setAddCategorySearch(""); }}
                              className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add model
                            </button>
                            <button
                              type="button"
                              onClick={() => saveCategorySection(slug)}
                              disabled={categoriesSaving === slug}
                              className="px-3 py-1.5 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wider disabled:opacity-50"
                            >
                              {categoriesSaving === slug ? "Saving…" : "Save"}
                            </button>
                          </div>
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {ids.map((id, index) => {
                            const m = categoriesData.approvedModels.find((x) => x._id === id);
                            if (!m) return null;
                            const photo = m.profilePhoto || m.portfolio?.[0];
                            return (
                              <div key={m._id} className="flex items-center gap-2 border border-border p-2 bg-background w-[200px]">
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => moveModel(index, -1)}
                                    disabled={index === 0}
                                    className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30"
                                    title="Move up (first = card image)"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveModel(index, 1)}
                                    disabled={index === ids.length - 1}
                                    className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30"
                                    title="Move down"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                </div>
                                {photo ? (
                                  <img src={imgSrc(photo)} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                    <Camera className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-body truncate text-foreground">{m.fullName || m.username || "Model"}</p>
                                  {index === 0 && <p className="text-[10px] text-primary font-body uppercase tracking-wider">Card image</p>}
                                  <button
                                    type="button"
                                    onClick={() => setCategoryIdsLocal((prev) => ({ ...prev, [slug]: prev[slug].filter((x) => x !== m._id) }))}
                                    className="text-xs text-destructive hover:underline font-body"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          {ids.length === 0 && <p className="text-muted-foreground text-sm font-body">No models. Click &quot;Add model&quot; to choose.</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </>
          )}

          {/* ── LATEST MODELS TAB ── */}
          {activeTab === "latest" && (
            <>
              <h2 className="font-display text-xl text-foreground mb-2">Latest Models</h2>
              <p className="text-muted-foreground text-sm font-body mb-6">
                Control the scrolling &quot;Latest Models&quot; strip on the homepage. Auto mode shows the newest N models; manual lets you pick exact models.
              </p>
              {latestLoading ? (
                <p className="text-muted-foreground font-body">Loading...</p>
              ) : latestData ? (
                <>
                  <div className="flex gap-4 mb-6">
                    {(["auto", "manual"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLatestMode(m)}
                        className={`px-4 py-2 text-xs font-body uppercase tracking-wider border transition-colors ${
                          latestMode === m ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {m === "auto" ? "Auto (newest N)" : "Manual (pick models)"}
                      </button>
                    ))}
                  </div>

                  {latestMode === "auto" && (
                    <div className="border border-border bg-card p-5 mb-6 max-w-xs">
                      <label className="block text-xs font-body text-muted-foreground uppercase tracking-wider mb-2">Number of models to show</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={latestCountLocal}
                        onChange={(e) => setLatestCountLocal(Math.max(1, Math.min(50, parseInt(e.target.value) || 16)))}
                        className="w-full border border-border bg-background px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {latestMode === "manual" && (
                    <div className="border border-border bg-card p-5 mb-6">
                      <h3 className="font-display text-base text-primary mb-3 flex items-center justify-between">
                        Selected models ({latestIdsLocal.length})
                        <button
                          type="button"
                          onClick={() => { setAddLatestModal(true); setAddLatestSearch(""); }}
                          className="flex items-center gap-1.5 text-xs font-body uppercase tracking-wider text-primary hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add model
                        </button>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {latestIdsLocal.map((id) => {
                          const m = latestData.approvedModels.find((x) => x._id === id);
                          if (!m) return null;
                          const photo = m.profilePhoto || m.portfolio?.[0];
                          return (
                            <div key={m._id} className="flex items-center gap-2 border border-border p-2 bg-background w-[180px]">
                              {photo ? (
                                <img src={imgSrc(photo)} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                  <Camera className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-body truncate text-foreground">{m.fullName || m.username || "Model"}</p>
                                <button
                                  type="button"
                                  onClick={() => setLatestIdsLocal((prev) => prev.filter((x) => x !== m._id))}
                                  className="text-xs text-destructive hover:underline font-body"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {latestIdsLocal.length === 0 && <p className="text-muted-foreground text-sm font-body">No models added yet.</p>}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={saveLatestSection}
                      disabled={latestSaving}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider disabled:opacity-50"
                    >
                      {latestSaving ? "Saving..." : "Save changes"}
                    </button>
                    <p className="text-muted-foreground text-xs font-body">Changes take effect on the homepage immediately after saving.</p>
                  </div>
                </>
              ) : null}
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
              {actionModal.user.fullName || actionModal.user.email}: add a reason (user will see this):
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

      {/* Add model to Category modal */}
      {addCategoryModal && categoriesData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAddCategoryModal(null)}>
          <div className="bg-background border border-border w-full max-w-md flex flex-col rounded-sm shadow-xl h-[85vh] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <h3 className="font-display text-lg text-primary">Add model to {addCategoryModal.charAt(0).toUpperCase() + addCategoryModal.slice(1)}</h3>
              <button type="button" onClick={() => setAddCategoryModal(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input type="text" value={addCategorySearch} onChange={(e) => setAddCategorySearch(e.target.value)} placeholder="Search by name…" className="w-full border border-border bg-background pl-9 py-2 text-sm font-body focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
              <ul className="space-y-1">
                {categoriesData.approvedModels.filter((m) => {
                  if ((categoryIdsLocal[addCategoryModal] || []).includes(m._id)) return false;
                  const q = addCategorySearch.trim().toLowerCase();
                  return !q || (m.fullName || m.username || "").toLowerCase().includes(q);
                }).map((m) => {
                  const photo = m.profilePhoto || m.portfolio?.[0];
                  return (
                    <li key={m._id}>
                      <button type="button" onClick={() => { setCategoryIdsLocal((prev) => ({ ...prev, [addCategoryModal!]: [...(prev[addCategoryModal!] || []), m._id] })); setAddCategoryModal(null); }} className="w-full flex items-center gap-3 p-2 border border-border hover:border-primary hover:bg-primary/5 text-left">
                        {photo ? <img src={imgSrc(photo)} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0"><Camera className="w-4 h-4 text-muted-foreground" /></div>}
                        <span className="text-sm font-body text-foreground">{m.fullName || m.username || "Model"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add model to Latest section modal */}
      {addLatestModal && latestData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAddLatestModal(false)}>
          <div className="bg-background border border-border w-full max-w-md flex flex-col rounded-sm shadow-xl h-[85vh] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <h3 className="font-display text-lg text-primary">Add model to Latest</h3>
              <button type="button" onClick={() => setAddLatestModal(false)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input type="text" value={addLatestSearch} onChange={(e) => setAddLatestSearch(e.target.value)} placeholder="Search by name…" className="w-full border border-border bg-background pl-9 py-2 text-sm font-body focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
              <ul className="space-y-1">
                {latestData.approvedModels.filter((m) => {
                  if (latestIdsLocal.includes(m._id)) return false;
                  const q = addLatestSearch.trim().toLowerCase();
                  return !q || (m.fullName || m.username || "").toLowerCase().includes(q);
                }).map((m) => {
                  const photo = m.profilePhoto || m.portfolio?.[0];
                  return (
                    <li key={m._id}>
                      <button type="button" onClick={() => { setLatestIdsLocal((prev) => [...prev, m._id]); setAddLatestModal(false); }} className="w-full flex items-center gap-3 p-2 border border-border hover:border-primary hover:bg-primary/5 text-left">
                        {photo ? <img src={imgSrc(photo)} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0"><Camera className="w-4 h-4 text-muted-foreground" /></div>}
                        <span className="text-sm font-body text-foreground">{m.fullName || m.username || "Model"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Casting detail modal */}
      {selectedCasting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCasting(null)}>
          <div className="bg-background border border-border w-full max-w-lg rounded-sm shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-lg text-primary truncate pr-4">{selectedCasting.title}</h3>
              <button type="button" onClick={() => setSelectedCasting(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedCasting.imageUrls && selectedCasting.imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedCasting.imageUrls.map((url, i) => (
                    <img key={i} src={imgSrc(url)} alt="" className="w-full aspect-square object-cover rounded-sm border border-border" />
                  ))}
                </div>
              )}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-body">
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Brand</dt>
                  <dd className="text-foreground">{selectedCasting.brand || ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Type</dt>
                  <dd className="text-foreground">{selectedCasting.castingType || ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />Location</dt>
                  <dd className="text-foreground">{selectedCasting.location || ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" />Casting Date</dt>
                  <dd className="text-foreground">{selectedCasting.date ? new Date(selectedCasting.date).toLocaleDateString() : ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 flex items-center gap-1"><Banknote className="w-3 h-3" />Price</dt>
                  <dd className="text-foreground">{selectedCasting.price || ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />Application Deadline</dt>
                  <dd className="text-foreground">{selectedCasting.applicationDeadline ? new Date(selectedCasting.applicationDeadline).toLocaleDateString() : ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Positions</dt>
                  <dd className="text-foreground">{selectedCasting.slots ?? ""}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Status</dt>
                  <dd>
                    <span className={`px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                      selectedCasting.approvalStatus === "approved" ? "bg-green-100 text-green-700" :
                      selectedCasting.approvalStatus === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {selectedCasting.approvalStatus || "pending"}
                    </span>
                  </dd>
                </div>
              </dl>
              {selectedCasting.description && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Description</p>
                  <p className="text-sm font-body text-foreground whitespace-pre-wrap">{selectedCasting.description}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-border">
                {selectedCasting.approvalStatus !== "approved" && (
                  <button
                    onClick={() => { handleCastingAction(selectedCasting._id, "approved"); setSelectedCasting(null); }}
                    disabled={castingActionLoading === selectedCasting._id}
                    className="text-xs px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {selectedCasting.approvalStatus !== "rejected" && (
                  <button
                    onClick={() => { handleCastingAction(selectedCasting._id, "rejected"); setSelectedCasting(null); }}
                    disabled={castingActionLoading === selectedCasting._id}
                    className="text-xs px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Casting Applications modal */}
      {castingAppsFor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCastingAppsFor(null)}>
          <div className="bg-background border border-border w-full max-w-xl rounded-sm shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Applications received for</p>
                <h3 className="font-display text-lg text-primary">{castingAppsFor.title}</h3>
              </div>
              <button type="button" onClick={() => setCastingAppsFor(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Batch action bar */}
            {!castingAppsLoading && castingApps.some((a) => a.status === "pending") && (
              <div className="px-4 py-3 border-b border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-body text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        castingApps.filter((a) => a.status === "pending").length > 0 &&
                        castingApps.filter((a) => a.status === "pending").every((a) => selectedAppIds.has(a._id))
                      }
                      onChange={(e) => {
                        const pendingIds = castingApps.filter((a) => a.status === "pending").map((a) => a._id);
                        if (e.target.checked) {
                          setSelectedAppIds(new Set(pendingIds));
                        } else {
                          setSelectedAppIds(new Set());
                        }
                      }}
                    />
                    Select all pending
                  </label>
                  {selectedAppIds.size > 0 && (
                    <span className="text-xs font-body text-primary">{selectedAppIds.size} selected</span>
                  )}
                </div>
                {selectedAppIds.size > 0 && (
                  <button
                    onClick={handleBatchSuggest}
                    disabled={batchSuggestLoading}
                    className="px-4 py-1.5 bg-green-600 text-white text-xs font-body uppercase tracking-wider hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {batchSuggestLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Suggesting...</> : `Send ${selectedAppIds.size} to Professional`}
                  </button>
                )}
              </div>
            )}

            {/* Application list */}
            <div className="p-4 overflow-y-auto flex-1">
              {castingAppsLoading ? (
                <p className="text-muted-foreground font-body text-sm py-6 text-center">Loading applications...</p>
              ) : castingApps.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm py-6 text-center">No applications yet for this casting.</p>
              ) : (
                <div className="space-y-3">
                  {castingApps.map((app) => {
                    const model = typeof app.modelId === "object" ? app.modelId : null;
                    const isPending = app.status === "pending";
                    const isSuggested = app.status === "suggested";
                    const isBooked = app.status === "booked";
                    const isRejected = app.status === "rejected";
                    const isChecked = selectedAppIds.has(app._id);
                    return (
                      <div
                        key={app._id}
                        className={`border bg-card p-4 transition-colors ${isChecked ? "border-green-400 bg-green-50/30" : "border-border"}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox for pending only */}
                          {isPending && (
                            <input
                              type="checkbox"
                              className="w-4 h-4 mt-1 shrink-0 accent-green-600"
                              checked={isChecked}
                              onChange={(e) => {
                                setSelectedAppIds((prev) => {
                                  const n = new Set(prev);
                                  if (e.target.checked) {
                                    n.add(app._id);
                                  } else {
                                    n.delete(app._id);
                                  }
                                  return n;
                                });
                              }}
                            />
                          )}
                          {model?.profilePhoto ? (
                            <img src={imgSrc(model.profilePhoto)} alt="" className="w-12 h-12 object-cover border border-border shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-secondary flex items-center justify-center shrink-0 border border-border">
                              <Camera className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <p className="font-body font-medium text-foreground text-sm">{model?.fullName || model?.username || "Model"}</p>
                                {(model as { email?: string })?.email && (
                                  <p className="text-muted-foreground text-xs font-body">{(model as { email?: string }).email}</p>
                                )}
                                {model?.city && model?.country && (
                                  <p className="text-muted-foreground text-xs font-body">{model.city}, {model.country}</p>
                                )}
                                {model?.height && (
                                  <p className="text-muted-foreground text-xs font-body">
                                    Height: {model.height}{model?.dressSize ? ` · Dress: ${model.dressSize}` : ""}
                                  </p>
                                )}
                              </div>
                              <span className={`text-[10px] font-body font-bold tracking-[0.15em] uppercase px-2 py-0.5 shrink-0 ${
                                isSuggested ? "bg-green-100 text-green-700" :
                                isBooked ? "bg-primary/10 text-primary" :
                                isRejected ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            {app.message && (
                              <p className="text-muted-foreground text-xs font-body mt-1 italic">"{app.message}"</p>
                            )}
                            {isPending && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleSuggest(app._id)}
                                  disabled={castingAppActionLoading === app._id || batchSuggestLoading}
                                  className="px-3 py-1 bg-green-600 text-white text-xs font-body uppercase tracking-wider hover:bg-green-700 disabled:opacity-50"
                                >
                                  {castingAppActionLoading === app._id ? "..." : "Send to Professional"}
                                </button>
                                <button
                                  onClick={() => handleRejectApp(app._id)}
                                  disabled={castingAppActionLoading === app._id || batchSuggestLoading}
                                  className="px-3 py-1 bg-red-100 text-red-700 text-xs font-body uppercase tracking-wider hover:bg-red-200 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Suggestions modal */}
      {adminSuggestionFor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAdminSuggestionFor(null)}>
          <div className="bg-background border border-border w-full max-w-2xl rounded-sm shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Admin suggestions for</p>
                <h3 className="font-display text-lg text-primary">{adminSuggestionFor.title}</h3>
              </div>
              <button type="button" onClick={() => setAdminSuggestionFor(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={adminSuggestSearch}
                  onChange={(e) => setAdminSuggestSearch(e.target.value)}
                  placeholder="Search approved models..."
                  className="w-full pl-9 pr-3 py-2 border border-border bg-background text-sm font-body outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground font-body">{selectedSuggestModelIds.size} selected</span>
                <button
                  type="button"
                  onClick={handleAdminSuggestToCasting}
                  disabled={adminSuggestSending || selectedSuggestModelIds.size === 0}
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-body uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50"
                >
                  {adminSuggestSending ? "Sending..." : `Send ${selectedSuggestModelIds.size || ""} Suggestions`}
                </button>
              </div>
              {adminSuggestMessage && (
                <p className="text-xs font-body text-primary">{adminSuggestMessage}</p>
              )}
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {adminSuggestLoading ? (
                <p className="text-muted-foreground text-sm font-body text-center py-6">Loading approved models...</p>
              ) : (
                <div className="space-y-2">
                  {adminSuggestModels
                    .filter((m) => {
                      const q = adminSuggestSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (m.fullName || "").toLowerCase().includes(q) ||
                        (m.username || "").toLowerCase().includes(q) ||
                        (m.city || "").toLowerCase().includes(q) ||
                        (m.country || "").toLowerCase().includes(q)
                      );
                    })
                    .map((m) => {
                      const checked = selectedSuggestModelIds.has(m._id);
                      return (
                        <label key={m._id} className={`flex items-center gap-3 p-3 border cursor-pointer ${checked ? "border-blue-400 bg-blue-50/40" : "border-border hover:border-primary/40"}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setSelectedSuggestModelIds((prev) => {
                                const next = new Set(prev);
                                if (e.target.checked) next.add(m._id);
                                else next.delete(m._id);
                                return next;
                              });
                            }}
                          />
                          {m.profilePhoto ? (
                            <img src={imgSrc(m.profilePhoto)} alt="" className="w-10 h-10 object-cover border border-border" />
                          ) : (
                            <div className="w-10 h-10 bg-secondary border border-border" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-body text-foreground truncate">{m.fullName || m.username || "Model"}</p>
                            {(m.city || m.country) && (
                              <p className="text-xs text-muted-foreground">{[m.city, m.country].filter(Boolean).join(", ")}</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add casting to Trending Castings modal */}
      {addCastingModal && homepageData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAddCastingModal(false)}>
          <div className="bg-background border border-border w-full max-w-md flex flex-col rounded-sm shadow-xl h-[85vh] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <h3 className="font-display text-lg text-primary">Add casting to Trending Castings</h3>
              <button type="button" onClick={() => setAddCastingModal(false)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={addCastingSearch}
                  onChange={(e) => setAddCastingSearch(e.target.value)}
                  placeholder="Search by title or brand…"
                  className="w-full border border-border bg-background pl-9 py-2 text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
              <ul className="space-y-1">
                {(homepageData.approvedCastings || [])
                  .filter((c) => {
                    if (trendingCastingIdsLocal.includes(c._id)) return false;
                    const q = addCastingSearch.trim().toLowerCase();
                    return !q || (c.title || "").toLowerCase().includes(q) || (c.brand || "").toLowerCase().includes(q);
                  })
                  .map((c) => (
                    <li key={c._id}>
                      <button
                        type="button"
                        onClick={() => { addCastingToTrending(c._id); setAddCastingModal(false); }}
                        className="w-full flex items-center gap-3 p-2 border border-border hover:border-primary hover:bg-primary/5 text-left"
                      >
                        {c.imageUrls?.[0] ? (
                          <img src={imgSrc(c.imageUrls[0])} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-body text-foreground block truncate">{c.title}</span>
                          <span className="text-xs text-muted-foreground block truncate">{c.brand || ""}</span>
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
              {(homepageData.approvedCastings || []).filter((c) => !trendingCastingIdsLocal.includes(c._id)).length === 0 && (
                <p className="text-muted-foreground text-sm font-body py-4">No castings to add, or all are already in the list.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add model to New Faces / Trending modal */}
      {addModelModal && homepageData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAddModelModal(null)}>
          <div className="bg-background border border-border w-full max-w-md flex flex-col rounded-sm shadow-xl h-[85vh] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <h3 className="font-display text-lg text-primary">
                Add model to {addModelModal === "newFaces" ? "New Faces" : "Trending"}
              </h3>
              <button type="button" onClick={() => setAddModelModal(null)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={addModelSearch}
                  onChange={(e) => setAddModelSearch(e.target.value)}
                  placeholder="Search by name or username..."
                  className="w-full border border-border bg-background pl-9 py-2 text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
              {(() => {
                const currentIds = addModelModal === "newFaces" ? newFacesIdsLocal : trendingIdsLocal;
                const q = addModelSearch.trim().toLowerCase();
                const filtered = homepageData.approvedModels.filter((m) => {
                  if (currentIds.includes(m._id)) return false;
                  const name = (m.fullName || m.username || "").toLowerCase();
                  return !q || name.includes(q);
                });
                return (
                  <ul className="space-y-1">
                    {filtered.map((m) => {
                      const photo = m.profilePhoto || m.portfolio?.[0];
                      return (
                        <li key={m._id}>
                          <button
                            type="button"
                            onClick={() => { addModelToSection(addModelModal, m._id); setAddModelModal(null); }}
                            className="w-full flex items-center gap-3 p-2 border border-border hover:border-primary hover:bg-primary/5 text-left"
                          >
                            {photo ? (
                              <img src={imgSrc(photo)} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                <Camera className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm font-body text-foreground">{m.fullName || m.username || "Model"}</span>
                          </button>
                        </li>
                      );
                    })}
                    {filtered.length === 0 && (
                      <p className="text-muted-foreground text-sm font-body py-4">
                        {currentIds.length >= homepageData.approvedModels.length
                          ? "All approved models are already in this section."
                          : "No matching models."}
                      </p>
                    )}
                  </ul>
                );
              })()}
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
                    {(viewUser.profilePhoto || (viewUser.portfolio?.length && viewUser.portfolio[0])) ? (
                      <img
                        src={viewUser.profilePhoto || viewUser.portfolio![0]}
                        alt=""
                        className="w-24 h-24 rounded-full object-cover border border-border"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const fallback = el.nextElementSibling;
                          if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs border border-border"
                      style={viewUser.profilePhoto || (viewUser.portfolio?.length && viewUser.portfolio[0]) ? { display: "none" } : undefined}
                    >
                      No photo
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-foreground">{viewUser.fullName || ""}</p>
                      <p className="text-muted-foreground text-sm font-body">{viewUser.email}</p>
                      <p className="text-sm font-body">Role: {viewUser.role || ""} · Status: {viewUser.status || ""}</p>
                      <p className="text-muted-foreground text-xs font-body">Joined: {viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : ""}</p>
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
