const STORAGE_KEY = "vsv-cricket-auction-state-v4";
const ADMIN_AUTH_KEY = "vsv-auction-admin-auth";
const DEFAULT_BID_INCREMENT = 50;
const DEFAULT_TEAM_PURSE = 5000;
const DEFAULT_BASE_PRICE = 50;
const DEFAULT_TOTAL_PLAYERS_PER_TEAM = 11;
const ACTIVE_LOT_BID_AMOUNT_CAP = 600;
const RECENT_BID_LIMIT = 25;
const REALTIME_REFRESH_SUPPRESS_MS = 1200;
const SOLD_DIALOG_AUTO_CLOSE_MS = 5000;
const RESET_DEMO_ENABLED = false;
const MAX_INLINE_IMAGE_SIZE = 1024 * 1024;
const MAX_STORAGE_IMAGE_SIZE = 5 * 1024 * 1024;
const PLAYER_PHOTO_BUCKET = "player-photos";
const DEFAULT_PLAYER_IMAGE_URL =
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80";
const PLAYER_SELECT_BASE =
  "id, player_id, name, role, batting_style, bowling_style, age, contact, jersey_number, base_price, current_bid, current_team_id, sold_team_id, status, created_at";
const PLAYER_SELECT_WITH_IMAGE = `${PLAYER_SELECT_BASE}, image_url`;
const PLAYER_STATUSES = ["available", "in_bidding", "sold", "unsold", "not_playing"];
const PLAYER_STATUS_EDITABLE_OPTIONS = ["available", "not_playing"];
const PLAYER_STATUS_FORM_MUTABLE_STATUSES = ["available", "unsold", "not_playing"];
const DEMO_ADMIN = {
  email: "admin@vsvauction.local",
  password: "admin123",
};

const womensCricketTeams = [
  {
    name: "Warrior Queens",
    shortName: "WQ",
    color: "#9a4815",
    logoUrl: "public/womens-warrior-queens.png",
    players: [
      { name: "Annapoorna", leadership: "C" },
      { name: "Manjula Sunil", leadership: "VC" },
      { name: "Sahana", leadership: "" },
      { name: "Rithiksha", leadership: "" },
      { name: "Nisha Naveen", leadership: "" },
      { name: "Vamshika", leadership: "" },
      { name: "Rashmi Sadashiva", leadership: "" },
      { name: "Keerthi Vaishak", leadership: "" },
      { name: "Vrusha Prasanna", leadership: "" },
      { name: "Rajalakshmi", leadership: "" },
    ],
  },
  {
    name: "Royal Queens",
    shortName: "RQ",
    color: "#3867a6",
    logoUrl: "public/womens-royal-queens.png",
    players: [
      { name: "Lavanya Gowrish", leadership: "C" },
      { name: "Shreenidhi", leadership: "VC" },
      { name: "Keerthana Ramesh", leadership: "" },
      { name: "Nisha Varun", leadership: "" },
      { name: "Seema Santhosh", leadership: "" },
      { name: "Daksha", leadership: "" },
      { name: "Poorvi", leadership: "" },
      { name: "Shilpa Shivaprasad", leadership: "" },
      { name: "Rashmi Charan", leadership: "" },
      { name: "Yogitha Trivikram", leadership: "" },
    ],
  },
  {
    name: "Thunder Queens",
    shortName: "TQ",
    color: "#3158a8",
    logoUrl: "public/womens-thunder-queens.png",
    players: [
      { name: "Monica Naveen", leadership: "C" },
      { name: "Deepika Nithin", leadership: "VC" },
      { name: "Hansika S", leadership: "" },
      { name: "Keerthi Umesh", leadership: "" },
      { name: "Vyshali", leadership: "" },
      { name: "Jahnavi Ganesh", leadership: "" },
      { name: "Vandana Mohan", leadership: "" },
      { name: "Soumya Karthik", leadership: "" },
      { name: "Shilpa Avinash", leadership: "" },
      { name: "Vijayakala", leadership: "" },
    ],
  },
  {
    name: "Phoenix Queens",
    shortName: "PQ",
    color: "#b7791f",
    logoUrl: "public/womens-phoenix-queens.png",
    players: [
      { name: "Pavana Omprakash", leadership: "C" },
      { name: "Pallavi", leadership: "VC" },
      { name: "Sowmya Lakshmesha", leadership: "" },
      { name: "Varshini", leadership: "" },
      { name: "Joshika", leadership: "" },
      { name: "Gayathri Ganesh", leadership: "" },
      { name: "Dhanya", leadership: "" },
      { name: "Shravya", leadership: "" },
      { name: "Deeksha", leadership: "" },
      { name: "Kanchana Ananth", leadership: "" },
    ],
  },
];

const seedState = {
  bidIncrement: DEFAULT_BID_INCREMENT,
  defaultBasePrice: DEFAULT_BASE_PRICE,
  totalPlayersPerTeam: DEFAULT_TOTAL_PLAYERS_PER_TEAM,
  currentPlayerId: "player-aryan",
  teams: [
    {
      id: "team-kings",
      name: "VSV Kings",
      owner: "Arjun Mehta",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#176b48",
      logoUrl: "",
    },
    {
      id: "team-strikers",
      name: "Coastal Strikers",
      owner: "Nisha Rao",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#c7511f",
      logoUrl: "",
    },
    {
      id: "team-titans",
      name: "Metro Titans",
      owner: "Vikram Shah",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#3867a6",
      logoUrl: "",
    },
    {
      id: "team-rangers",
      name: "Hill Rangers",
      owner: "Kabir Khan",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#8a3ffc",
      logoUrl: "",
    },
    {
      id: "team-falcons",
      name: "Desert Falcons",
      owner: "Meera Joshi",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#b7791f",
      logoUrl: "",
    },
    {
      id: "team-challengers",
      name: "City Challengers",
      owner: "Ravi Nair",
      purse: DEFAULT_TEAM_PURSE,
      spent: 0,
      color: "#0f766e",
      logoUrl: "",
    },
  ],
  players: [
    {
      id: "player-aryan",
      name: "Aryan Menon",
      role: "Batter",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm off break",
      age: 25,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE + DEFAULT_BID_INCREMENT * 2,
      currentTeamId: "team-kings",
      status: "in_bidding",
      imageUrl:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-rohan",
      name: "Rohan Iyer",
      role: "All-rounder",
      battingStyle: "Left hand bat",
      bowlingStyle: "Left arm orthodox",
      age: 27,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "public/vishwaparva-season-2-logo.jpeg",
    },
    {
      id: "player-samar",
      name: "Samar Gill",
      role: "Bowler",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm fast",
      age: 22,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-kunal",
      name: "Kunal Desai",
      role: "Wicket keeper",
      battingStyle: "Right hand bat",
      bowlingStyle: "Wicket keeper",
      age: 24,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-dev",
      name: "Dev Sharma",
      role: "All-rounder",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm leg break",
      age: 29,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-nikhil",
      name: "Nikhil Verma",
      role: "Bowler",
      battingStyle: "Left hand bat",
      bowlingStyle: "Left arm fast",
      age: 21,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-manav",
      name: "Manav Rao",
      role: "Batter",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm medium",
      age: 23,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-ishaan",
      name: "Ishaan Patel",
      role: "Bowler",
      battingStyle: "Left hand bat",
      bowlingStyle: "Left arm fast",
      age: 26,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-aditya",
      name: "Aditya Nair",
      role: "Wicket keeper",
      battingStyle: "Right hand bat",
      bowlingStyle: "Wicket keeper",
      age: 28,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-varun",
      name: "Varun Shetty",
      role: "All-rounder",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm fast medium",
      age: 30,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "player-pranav",
      name: "Pranav Kumar",
      role: "Batter",
      battingStyle: "Left hand bat",
      bowlingStyle: "Right arm off break",
      age: 24,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "public/vishwaparva-season-2-logo.jpeg",
    },
    {
      id: "player-harsh",
      name: "Harsh Vyas",
      role: "Bowler",
      battingStyle: "Right hand bat",
      bowlingStyle: "Right arm leg break",
      age: 22,
      basePrice: DEFAULT_BASE_PRICE,
      currentBid: DEFAULT_BASE_PRICE,
      status: "available",
      imageUrl:
        "https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80",
    },
  ],
  bids: [
    {
      id: "bid-seed-2",
      playerId: "player-aryan",
      teamId: "team-kings",
      amount: DEFAULT_BASE_PRICE + DEFAULT_BID_INCREMENT * 2,
      createdAt: "Just now",
    },
    {
      id: "bid-seed-1",
      playerId: "player-aryan",
      teamId: "team-strikers",
      amount: DEFAULT_BASE_PRICE + DEFAULT_BID_INCREMENT,
      createdAt: "1 min ago",
    },
  ],
};

const supabaseClient = createSupabaseClient();
let state = clone(seedState);
let currentUser = null;
let currentUserIsAdmin = false;
let adminEventsBound = false;
let auctionEventsBound = false;
let realtimeRefreshTimer = null;
let realtimeRefreshSuppressedUntil = 0;
let soldDialogTimer = null;
let soldDialogEventsBound = false;
let authStateLoaded = false;
const adminAccessCache = new Map();
let adminPlayerSearchTerm = "";
const adminPlayerRandomOrder = new Map();

document.addEventListener("DOMContentLoaded", () => {
  void bootstrapApp();
});

async function bootstrapApp() {
  const page = document.body.dataset.page;
  const auctionStatePages = ["auction", "players", "teams", "admin"];

  await refreshAuthState();

  if (auctionStatePages.includes(page)) {
    await initializeAuctionState();
  }

  if (page === "auction") {
    renderAuctionBoard();
    bindAuctionEvents();
    bindSoldPlayerDialogEvents();
  }

  if (page === "players") {
    renderPlayersPage();
  }

  if (page === "teams") {
    renderTeamsPage();
  }

  if (page === "womens-team") {
    renderWomensTeamPage();
  }

  if (page === "login") {
    renderLoginPage();
  }

  if (page === "admin") {
    renderAdminPage();
  }
}

async function initializeAuctionState() {
  if (!supabaseClient) {
    state = loadLocalState();
    return;
  }

  try {
    await loadRemoteState();
    subscribeToRealtime();
  } catch (error) {
    console.error("Supabase load failed. Falling back to local demo mode.", error);
    state = loadLocalState();
    window.alert(
      "Supabase is configured but the database could not be loaded. Check that supabase/schema.sql has been run."
    );
  }
}

function createSupabaseClient() {
  const config = window.VSV_SUPABASE_CONFIG;

  if (!config?.url || !config?.anonKey) {
    return null;
  }

  if (!window.supabase?.createClient) {
    console.warn("Supabase config found, but the Supabase browser client did not load.");
    return null;
  }

  return window.supabase.createClient(config.url, config.anonKey);
}

function loadLocalState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return clone(seedState);
  }

  try {
    return normalizeAuctionState(JSON.parse(stored));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return clone(seedState);
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function loadRemoteState({ includePlayerImages = true } = {}) {
  const existingPlayerImages = new Map(
    state.players
      .filter((player) => player.imageUrl)
      .map((player) => [player.id, player.imageUrl])
  );
  const playerSelect = includePlayerImages ? PLAYER_SELECT_WITH_IMAGE : PLAYER_SELECT_BASE;

  const [settingsResult, teamsResult, playersResult, bidsResult] =
    await Promise.all([
      supabaseClient.from("auction_settings").select("*").limit(1).maybeSingle(),
      supabaseClient.from("teams").select("*").order("created_at"),
      supabaseClient.from("players").select(playerSelect).order("created_at"),
      supabaseClient.from("bids").select("*").order("created_at", {
        ascending: false,
      }).limit(RECENT_BID_LIMIT),
    ]);

  throwIfSupabaseError(settingsResult.error);
  throwIfSupabaseError(teamsResult.error);
  throwIfSupabaseError(playersResult.error);
  throwIfSupabaseError(bidsResult.error);

  const players = (playersResult.data ?? [])
    .map((row) => dbPlayerToState(row, existingPlayerImages))
    .sort((a, b) => Number(a.playerNumber ?? 0) - Number(b.playerNumber ?? 0));
  const inBidding = players.find((player) => player.status === "in_bidding");

  state = {
    bidIncrement: Number(settingsResult.data?.bid_increment ?? DEFAULT_BID_INCREMENT),
    defaultBasePrice: Number(
      settingsResult.data?.default_base_price ?? DEFAULT_BASE_PRICE
    ),
    totalPlayersPerTeam: Number(
      settingsResult.data?.total_players_per_team ?? DEFAULT_TOTAL_PLAYERS_PER_TEAM
    ),
    currentPlayerId: inBidding?.id,
    teams: (teamsResult.data ?? []).map(dbTeamToState),
    players,
    bids: (bidsResult.data ?? []).map(dbBidToState),
  };
}

function subscribeToRealtime() {
  if (!supabaseClient) {
    return;
  }

  const channel = supabaseClient.channel("vsv-auction-db");
  for (const table of ["auction_settings", "teams", "players", "bids"]) {
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      scheduleRemoteRefresh
    );
  }
  channel.subscribe();
}

function scheduleRemoteRefresh() {
  const now = Date.now();
  const delay =
    now < realtimeRefreshSuppressedUntil
      ? realtimeRefreshSuppressedUntil - now + 75
      : 150;

  window.clearTimeout(realtimeRefreshTimer);
  realtimeRefreshTimer = window.setTimeout(async () => {
    if (Date.now() < realtimeRefreshSuppressedUntil) {
      scheduleRemoteRefresh();
      return;
    }

    try {
      const previousPlayers = state.players;
      await loadRemoteState({ includePlayerImages: false });
      const soldAnnouncement = soldPlayerAnnouncementFromStateChange(previousPlayers);
      renderCurrentPage();
      if (document.body.dataset.page === "auction" && soldAnnouncement) {
        showSoldPlayerDialog(soldAnnouncement.player, soldAnnouncement.team);
      }
    } catch (error) {
      console.error("Realtime refresh failed.", error);
    }
  }, delay);
}

function suppressRealtimeRefresh() {
  realtimeRefreshSuppressedUntil = Math.max(
    realtimeRefreshSuppressedUntil,
    Date.now() + REALTIME_REFRESH_SUPPRESS_MS
  );
  window.clearTimeout(realtimeRefreshTimer);
  realtimeRefreshTimer = null;
}

async function refreshRemoteStateAfterMutation(
  render = renderCurrentPage,
  { includePlayerImages = true } = {}
) {
  await loadRemoteState({ includePlayerImages });
  suppressRealtimeRefresh();
  if (typeof render === "function") {
    render();
  }
}

async function refreshAuthState({ force = false } = {}) {
  if (authStateLoaded && !force) {
    return;
  }

  currentUser = null;
  currentUserIsAdmin = false;

  if (!supabaseClient) {
    currentUserIsAdmin = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
    authStateLoaded = true;
    return;
  }

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    authStateLoaded = true;
    return;
  }

  currentUser = user;
  currentUserIsAdmin = await userHasAdminAccess(user.id);
  authStateLoaded = true;
}

async function userHasAdminAccess(userId) {
  if (adminAccessCache.has(userId)) {
    return adminAccessCache.get(userId);
  }

  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Admin check failed.", error);
    return false;
  }

  const hasAccess = Boolean(data);
  adminAccessCache.set(userId, hasAccess);
  return hasAccess;
}

function renderCurrentPage() {
  const page = document.body.dataset.page;

  if (page === "auction") {
    renderAuctionBoard();
  }

  if (page === "admin") {
    renderAdminLiveState();
  }

  if (page === "players") {
    renderPlayersPage();
  }

  if (page === "teams") {
    renderTeamsPage();
  }

  if (page === "womens-team") {
    renderWomensTeamPage();
  }
}

function renderAuctionBoard() {
  const currentPlayer = getCurrentPlayer();
  const leadingTeam = currentPlayer?.currentTeamId
    ? findTeam(currentPlayer.currentTeamId)
    : undefined;
  const soldCount = state.players.filter((player) => player.status === "sold").length;
  const totalPurse = state.teams.reduce((sum, team) => sum + team.purse, 0);
  const totalSpent = state.teams.reduce((sum, team) => sum + team.spent, 0);

  setText("metric-sold", String(soldCount));
  setText("metric-purse", formatMoney(totalPurse));
  setText("metric-spent", formatMoney(totalSpent));
  setText("current-player-name", currentPlayer?.name ?? "No active player");

  const currentSummary = document.getElementById("current-player-summary");
  if (currentSummary) {
    if (currentPlayer) {
      currentSummary.textContent = currentPlayer.role;
    } else {
      currentSummary.textContent = currentUserIsAdmin
        ? "Start the next player from the admin page or choose one below."
        : "Waiting for an admin to start the next player.";
    }
  }

  const currentPlayerIdBadge = document.getElementById("current-player-id-badge");
  if (currentPlayerIdBadge) {
    currentPlayerIdBadge.textContent = currentPlayer ? playerSerial(currentPlayer) : "";
    currentPlayerIdBadge.hidden = !currentPlayer;
  }

  setText("current-base", formatMoney(currentPlayer?.basePrice ?? 0));
  setText("current-bid", formatMoney(currentPlayer?.currentBid ?? 0));
  setText("current-leading", leadingTeam?.name ?? "Open");

  const currentImage = document.getElementById("current-player-image");
  if (currentImage) {
    currentImage.src =
      currentPlayer?.imageUrl ??
      "public/vishwaparva-season-2-logo.jpeg";
  }

  renderAuctionActionState();
  renderTeamBidButtons(currentPlayer);
  renderTeams();
  renderRecentBids();
  renderNextPlayers();
}

function renderPlayersPage() {
  renderPlayerGrid();
}

function renderTeamsPage() {
  renderTeamRosterGrid();
}

function renderWomensTeamPage() {
  const root = document.getElementById("womens-team-grid");

  if (!root) {
    return;
  }

  root.innerHTML = womensCricketTeams.map(womensTeamRosterCard).join("");
}

function womensTeamRosterCard(team) {
  return `
    <article class="team-roster-card womens-team-card">
      <div class="team-roster-header">
        <div class="team-roster-title">
          <span class="team-logo womens-team-logo" style="--team-color: ${escapeAttr(team.color)}" aria-hidden="true">
            ${
              team.logoUrl
                ? `<img alt="" src="${escapeAttr(team.logoUrl)}" />`
                : `<span>${escapeHtml(team.shortName)}</span>`
            }
          </span>
          <div>
            <h2>${escapeHtml(team.name)}</h2>
            <p>Players and leadership</p>
          </div>
        </div>
        <span class="team-roster-count">${team.players.length}</span>
      </div>

      <div class="womens-player-table-wrap">
        <table class="womens-player-table">
          <thead>
            <tr>
              <th scope="col">Player Name</th>
              <th scope="col">Captain / Vice Captain</th>
            </tr>
          </thead>
          <tbody>
            ${team.players.map(womensTeamPlayerRow).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function womensTeamPlayerRow(player) {
  return `
    <tr>
      <td>${escapeHtml(player.name)}</td>
      <td>
        ${
          player.leadership
            ? `<span class="leadership-badge womens-leadership-badge">${escapeHtml(player.leadership)}</span>`
            : `<span class="muted-value">-</span>`
        }
      </td>
    </tr>
  `;
}

function renderTeamRosterGrid() {
  const root = document.getElementById("team-roster-grid");
  if (!root) {
    return;
  }

  root.innerHTML = state.teams.map(teamRosterCard).join("");
}

function teamRosterCard(team) {
  const rosterPlayers = teamRosterPlayers(team);

  return `
    <article class="team-roster-card">
      <div class="team-roster-header">
        <div class="team-roster-title">
          ${teamLogo(team)}
          <div>
            <h2>${escapeHtml(team.name)}</h2>
            <p>${escapeHtml(team.owner)}</p>
          </div>
        </div>
        <span class="team-roster-count">${rosterPlayers.length}</span>
      </div>
      <div class="team-player-list">
        ${
          rosterPlayers.length
            ? rosterPlayers.map(teamRosterPlayerRow).join("")
            : `<p class="empty-state">No players assigned to this team yet.</p>`
        }
      </div>
    </article>
  `;
}
function teamRosterPlayers(team) {
  return sortPlayersById(
    state.players.filter((player) => playerRosterTeamId(player) === team.id)
  );
}

function playerRosterTeamId(player) {
  return player.soldTeamId ?? player.currentTeamId ?? getPlayerLeadership(player.id).teamId;
}

function teamRosterPlayerRow(player) {
  return `
    <div class="team-player-row">
      <img class="team-player-photo" alt="${escapeAttr(player.name)}" decoding="async" loading="lazy" src="${escapeAttr(player.imageUrl)}" />
      <div class="team-player-main">
        <strong>${escapeHtml(player.name)}</strong>
        <small>${escapeHtml(player.role)} | Jersey ${escapeHtml(player.jerseyNumber || "-")}</small>
      </div>
      <div class="team-player-meta">
        ${playerLeadershipBadge(player.id)}
      </div>
    </div>
  `;
}

function renderAuctionActionState() {
  const resetButton = document.getElementById("reset-demo");
  if (!resetButton) {
    return;
  }

  resetButton.disabled = !RESET_DEMO_ENABLED || !currentUserIsAdmin;
  resetButton.title = !RESET_DEMO_ENABLED
    ? "Reset demo is disabled for now"
    : currentUserIsAdmin
      ? ""
      : "Admin login required to reset demo data";
}

function renderTeamBidButtons(currentPlayer) {
  const roots = ["team-bid-buttons", "admin-team-bid-buttons"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!roots.length) {
    return;
  }

  if (!currentPlayer) {
    roots.forEach((root) => {
      root.innerHTML = `<p class="empty-state">No player is currently open for bidding.</p>`;
    });
    return;
  }

  const markup = state.teams
    .map((team) => {
      const remaining = team.purse - team.spent;
      const memberCount = soldTeamMemberCount(team.id);
      const totalPlayers = getConfiguredTotalPlayersPerTeam();
      const nextBid = getNextBidAmount(currentPlayer);
      const maxBid = maxTeamBidForPlayer(team, currentPlayer);
      const captainName = teamCaptainName(team);
      const isAtMaxBid = nextBid > maxBid;
      const isNearMaxBid =
        !isAtMaxBid && maxBid - nextBid <= Number(state.bidIncrement ?? DEFAULT_BID_INCREMENT);
      const bidLimitClass = isAtMaxBid
        ? " bid-limit-reached"
        : isNearMaxBid
          ? " bid-limit-near"
          : "";
      const canBid = currentUserIsAdmin && !isAtMaxBid;
      const title = !currentUserIsAdmin
        ? "Admin login required before placing bids"
        : canBid
          ? ""
          : `Maximum bid for this team is ${formatMoney(maxBid)}.`;
      const bidLabel = currentPlayer.currentTeamId
        ? `+${formatMoney(state.bidIncrement)}`
        : `Bid ${formatMoney(nextBid)}`;

      return `
        <button class="team-bid-button${bidLimitClass}" data-bid-team="${team.id}" title="${escapeAttr(title)}" ${canBid ? "" : "disabled"} type="button">
          ${teamLogo(team, "small")}
          <span class="team-bid-main">
            <strong class="team-bid-title">
              <span class="team-bid-team-name">${escapeHtml(team.name)}</span>
              ${captainName ? `<span class="team-bid-captain">C: ${escapeHtml(captainName)}</span>` : ""}
            </strong>
            <span class="team-bid-meta">Members ${memberCount}/${totalPlayers} | Remaining ${formatMoney(remaining)} | Max ${formatMoney(maxBid)}</span>
          </span>
          <span class="team-bid-amount">${bidLabel}</span>
        </button>
      `;
    })
    .join("");

  roots.forEach((root) => {
    root.innerHTML = markup;
  });
}

function renderPlayerGrid() {
  const root = document.getElementById("player-grid");
  if (!root) {
    return;
  }

  root.innerHTML = state.players
    .map(
      (player) => `
        <article class="player-card">
          <span class="serial-badge">${escapeHtml(playerSerial(player))}</span>
          <img class="player-card-photo" alt="${escapeAttr(player.name)}" decoding="async" loading="lazy" src="${escapeAttr(player.imageUrl)}" />
          ${playerCardTeamLogo(player)}
          <div class="player-card-header">
            <div>
              <h3>${escapeHtml(player.name)}</h3>
              <p>${escapeHtml(player.role)} | Jersey ${escapeHtml(player.jerseyNumber || "-")}</p>
            </div>
            <div class="player-card-badges">
              ${playerLeadershipBadge(player.id)}
              ${statusBadge(player.status)}
            </div>
          </div>
          <div class="info-grid">
            ${info("Base", formatMoney(player.basePrice))}
            ${info("Bid", formatMoney(player.currentBid))}
            ${info("Role", player.role)}
            ${info("Team", playerTeamName(player))}
          </div>
        </article>
      `
    )
    .join("");
}

function renderTeams() {
  const root = document.getElementById("team-list");
  if (!root) {
    return;
  }

  root.innerHTML = state.teams.map(teamCard).join("");
}

function renderRecentBids() {
  const root = document.getElementById("recent-bids");
  if (!root) {
    return;
  }

  const recent = state.bids.slice(0, 6);
  if (!recent.length) {
    root.innerHTML = `<p class="empty-state">Bids will appear here when teams start bidding.</p>`;
    return;
  }

  root.innerHTML = recent
    .map((bid) => {
      const player = findPlayer(bid.playerId);
      const team = findTeam(bid.teamId);
      return `
        <div class="activity-item">
          <div class="activity-row">
            <strong>${escapeHtml(team?.name ?? "Team")}</strong>
            <span class="activity-amount">${formatMoney(bid.amount)}</span>
          </div>
          <p>${escapeHtml(player?.name ?? "Player")} | ${escapeHtml(bid.createdAt)}</p>
        </div>
      `;
    })
    .join("");
}

function renderNextPlayers() {
  const root = document.getElementById("next-players");
  if (!root) {
    return;
  }

  const available = state.players.filter((player) => player.status === "available");

  if (!available.length) {
    root.innerHTML = `<p class="empty-state">No available players remain.</p>`;
    return;
  }

  root.innerHTML = available
    .map(
      (player) => `
        <span class="available-player-name">${escapeHtml(player.name)}</span>
      `
    )
    .join("");
}

function bindAuctionEvents() {
  if (auctionEventsBound) {
    return;
  }

  auctionEventsBound = true;

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-bid-team], #reset-demo");
    if (!target) {
      return;
    }

    if (target.id === "reset-demo") {
      if (!currentUserIsAdmin) {
        void runAction(() => {
          throw new Error("Admin login required to reset demo data.");
        });
        return;
      }
      void runAction(() => resetAuction());
      return;
    }

    if (target.dataset.bidTeam) {
      const currentPlayer = getCurrentPlayer();
      if (currentPlayer) {
        void runAction(() => placeBid(currentPlayer.id, target.dataset.bidTeam));
      }
      return;
    }

  });
}

function renderLoginPage() {
  if (currentUserIsAdmin) {
    window.location.href = "admin.html";
    return;
  }

  const credentialBox = document.querySelector(".credential-box");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const intro = document.querySelector(".auth-form-panel > p");

  if (supabaseClient) {
    if (credentialBox) {
      credentialBox.innerHTML = `
        <strong>Supabase Auth</strong>
        <span>Use an Auth user that is listed in public.admin_users.</span>
      `;
    }
    if (intro) {
      intro.textContent =
        "This login uses Supabase Auth. Only users added to the admin_users table can access admin controls.";
    }
    if (emailInput) {
      emailInput.value = "";
      emailInput.placeholder = "admin@example.com";
    }
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.placeholder = "Password";
    }
  }

  const form = document.getElementById("login-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    void runAction(() => handleLoginSubmit());
  });
}

async function handleLoginSubmit() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("login-error");

  if (error) {
    error.textContent = "";
  }

  if (!supabaseClient) {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      window.location.href = "admin.html";
      return;
    }

    if (error) {
      error.textContent = "Use the demo admin credentials shown on this page.";
    }
    return;
  }

  const { error: signInError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    throw signInError;
  }

  await refreshAuthState({ force: true });
  if (!currentUserIsAdmin) {
    await supabaseClient.auth.signOut();
    throw new Error("This user is not listed in public.admin_users.");
  }

  window.location.href = "admin.html";
}

function renderAdminPage() {
  if (!currentUserIsAdmin) {
    document.getElementById("admin-root").innerHTML = `
      <section class="guard">
        <h1>Login required</h1>
        <p>${supabaseClient ? "Sign in with a Supabase admin user to manage the auction." : "The admin page is protected in local development by demo login credentials."}</p>
        <a class="primary-button full" href="login.html">Go to login</a>
      </section>
    `;
    return;
  }

  renderAdminAuctionState({ includeTeamPurse: true });
  renderAuctionSettings();
  renderAddPlayerLeadershipOptions();
  renderAdminTeamEditor();
  bindAdminEvents();
}

function renderAdminAuctionState({
  includePlayerTable = true,
  includeTeamPurse = false,
} = {}) {
  renderAdminCurrentLot();
  renderAdminLotMetrics();
  renderTeamBidButtons(getCurrentPlayer());
  if (includePlayerTable) {
    renderAdminPlayerTable();
  }
  if (includeTeamPurse) {
    renderAdminTeams();
  }
  renderAdminResetActionState();
}

function renderAdminLiveState() {
  if (!currentUserIsAdmin || !document.getElementById("admin-current-lot")) {
    renderAdminPage();
    return;
  }

  renderAdminAuctionState({ includeTeamPurse: true });

  const setupPanel = document.getElementById("admin-panel-setup");
  if (setupPanel && !setupPanel.hidden) {
    renderAuctionSettings();
    renderAddPlayerLeadershipOptions();
    renderAdminTeamEditor();
  }
}

function renderAfterAuctionAction({
  includePlayerTable = true,
  includeTeamPurse = false,
} = {}) {
  if (document.body.dataset.page === "admin") {
    renderAdminAuctionState({ includePlayerTable, includeTeamPurse });
    return;
  }

  renderCurrentPage();
}

function renderAdminResetActionState() {
  const resetButton = document.getElementById("admin-reset");
  if (!resetButton) {
    return;
  }

  resetButton.disabled = !RESET_DEMO_ENABLED;
  resetButton.title = RESET_DEMO_ENABLED ? "" : "Reset demo is disabled for now";
}

function renderAuctionSettings() {
  const basePriceInput = document.getElementById("settings-base-price");
  const bidIncrementInput = document.getElementById("settings-bid-increment");
  const teamPurseInput = document.getElementById("settings-team-purse");
  const totalPlayersInput = document.getElementById("settings-total-players");
  const addPlayerBasePriceInput = document.getElementById("new-base-price");

  if (!basePriceInput || !bidIncrementInput || !teamPurseInput || !totalPlayersInput) {
    return;
  }

  basePriceInput.value = String(state.defaultBasePrice ?? DEFAULT_BASE_PRICE);
  bidIncrementInput.value = String(state.bidIncrement ?? DEFAULT_BID_INCREMENT);
  teamPurseInput.value = String(getConfiguredTeamPurse());
  totalPlayersInput.value = String(getConfiguredTotalPlayersPerTeam());

  if (addPlayerBasePriceInput) {
    addPlayerBasePriceInput.value = String(state.defaultBasePrice ?? DEFAULT_BASE_PRICE);
  }
}

function renderAddPlayerLeadershipOptions() {
  const teamSelect = document.getElementById("new-leadership-team");
  if (teamSelect instanceof HTMLSelectElement) {
    populateLeadershipTeamSelect(teamSelect);
  }
}

function populateLeadershipTeamSelect(select, selectedTeamId = "") {
  select.innerHTML = [
    `<option value="">Select team</option>`,
    ...state.teams.map(
      (team) =>
        `<option value="${escapeAttr(team.id)}" ${
          team.id === selectedTeamId ? "selected" : ""
        }>${escapeHtml(team.name)}</option>`
    ),
  ].join("");
}

function getPlayerLeadership(playerId) {
  const captainTeam = state.teams.find((team) => team.captainPlayerId === playerId);
  if (captainTeam) {
    return {
      team: captainTeam,
      teamId: captainTeam.id,
      teamName: captainTeam.name,
      role: "captain",
    };
  }

  const viceCaptainTeam = state.teams.find((team) => team.viceCaptainPlayerId === playerId);
  if (viceCaptainTeam) {
    return {
      team: viceCaptainTeam,
      teamId: viceCaptainTeam.id,
      teamName: viceCaptainTeam.name,
      role: "vice_captain",
    };
  }

  return { team: undefined, teamId: "", teamName: "", role: "" };
}

function playerLeadershipLabel(playerId) {
  const leadership = getPlayerLeadership(playerId);

  if (leadership.role === "captain") {
    return `Captain - ${leadership.teamName}`;
  }

  if (leadership.role === "vice_captain") {
    return `Vice captain - ${leadership.teamName}`;
  }

  return "";
}

function playerLeadershipBadge(playerId) {
  const leadership = getPlayerLeadership(playerId);
  if (!leadership.role || !leadership.team) {
    return "";
  }

  const label = playerLeadershipLabel(playerId);
  const shortLabel = leadership.role === "captain" ? "C" : "VC";

  return `
    <span class="leadership-badge player-leadership-badge" aria-label="${escapeAttr(label)}" title="${escapeAttr(label)}">
      <span class="leadership-short-code">${escapeHtml(shortLabel)}</span>
    </span>
  `;
}

function playerCardTeamLogo(player) {
  const soldTeam = findTeam(player.soldTeamId);
  if (soldTeam) {
    return teamLogo(soldTeam, "player-card-team-logo");
  }

  const leadership = getPlayerLeadership(player.id);
  if (leadership.team) {
    return teamLogo(leadership.team, "player-card-team-logo");
  }

  return "";
}

function playerLeadershipCell(playerId) {
  const label = playerLeadershipLabel(playerId);
  if (!label) {
    return `<span class="muted-value">-</span>`;
  }

  return `<span class="leadership-cell-text">${escapeHtml(label)}</span>`;
}

function playerTeamName(player) {
  const assignedTeam = findTeam(player.soldTeamId) ?? findTeam(player.currentTeamId);
  if (assignedTeam) {
    return assignedTeam.name;
  }

  return getPlayerLeadership(player.id).teamName || "-";
}

function renderAdminCurrentLot() {
  const root = document.getElementById("admin-current-lot");
  const currentPlayer = getCurrentPlayer();
  const leadingTeam = currentPlayer?.currentTeamId
    ? findTeam(currentPlayer.currentTeamId)
    : undefined;

  if (!root) {
    return;
  }

  if (!currentPlayer) {
    root.innerHTML = `<p class="empty-state">No active lot. Start a player from the list.</p>`;
    return;
  }

  root.innerHTML = `
    <div class="active-lot">
      <div class="active-lot-image">
        <img class="active-lot-photo" alt="${escapeAttr(currentPlayer.name)}" decoding="async" src="${escapeAttr(currentPlayer.imageUrl)}" />
        <span class="serial-badge active-lot-id-badge">${escapeHtml(playerSerial(currentPlayer))}</span>
      </div>
      <div class="active-lot-info">
        <div class="active-lot-title-row">
          <h2>${escapeHtml(currentPlayer.name)}</h2>
          <strong class="activity-amount">${formatMoney(currentPlayer.currentBid)}</strong>
        </div>
        <p>${escapeHtml(currentPlayer.role)}</p>
        <p>Leading: ${escapeHtml(leadingTeam?.name ?? "No bid yet")}</p>
      </div>
      <div class="lot-actions">
        <button class="primary-button" id="sell-player" ${currentPlayer.currentTeamId ? "" : "disabled"} type="button">Sell player</button>
        <button class="secondary-button" id="make-player-available" type="button">Stop bidding</button>
        <button class="danger-button" id="mark-unsold" type="button">Mark unsold</button>
      </div>
      ${activeLotBidForm(currentPlayer)}
    </div>
  `;
}

function activeLotBidForm(currentPlayer) {
  const selectedTeamId = currentPlayer.currentTeamId ?? state.teams[0]?.id ?? "";
  const selectedTeam = findTeam(selectedTeamId);
  const amounts = activeLotBidAmounts(currentPlayer, selectedTeam);
  const selectedAmount = selectedActiveLotBidAmount(currentPlayer, selectedTeam, amounts);
  const canSubmit = currentUserIsAdmin && selectedTeam && amounts.length;

  return `
    <form id="active-lot-bid-form" class="active-lot-bid-form">
      <div class="form-grid">
        <label>
          Team
          <select name="teamId" data-active-lot-bid-team ${state.teams.length ? "" : "disabled"}>
            ${state.teams
              .map(
                (team) => `
                  <option value="${escapeAttr(team.id)}" ${team.id === selectedTeamId ? "selected" : ""}>
                    ${escapeHtml(team.name)}
                  </option>
                `
              )
              .join("")}
          </select>
        </label>
        <label>
          Amount
          <select name="amount" data-active-lot-bid-amount ${amounts.length ? "" : "disabled"}>
            ${activeLotBidAmountOptions(amounts, selectedAmount)}
          </select>
        </label>
      </div>
      <p class="form-hint" id="active-lot-bid-helper">
        ${escapeHtml(activeLotBidHelperText(currentPlayer, selectedTeam, amounts))}
      </p>
      <button class="secondary-button full" ${canSubmit ? "" : "disabled"} type="submit">
        Set bid
      </button>
    </form>
  `;
}

function activeLotBidAmounts(player, team) {
  if (!player || !team) {
    return [];
  }

  const increment = bidIncrementValue();
  const maxBid = maxActiveLotBidForTeam(team, player);
  const minimumBid = roundUpToIncrement(player.basePrice, increment);
  const amounts = [];

  for (let amount = minimumBid; amount <= maxBid; amount += increment) {
    amounts.push(amount);
  }

  return amounts;
}

function activeLotBidAmountOptions(amounts, selectedAmount) {
  if (!amounts.length) {
    return `<option value="">No valid amount</option>`;
  }

  return amounts
    .map(
      (amount) => `
        <option value="${escapeAttr(amount)}" ${amount === selectedAmount ? "selected" : ""}>
          ${escapeHtml(formatMoney(amount))}
        </option>
      `
    )
    .join("");
}

function selectedActiveLotBidAmount(player, team, amounts) {
  if (!amounts.length) {
    return "";
  }

  const increment = bidIncrementValue();
  const currentBid = Number(player.currentBid || 0);
  const preferredAmount =
    player.currentTeamId === team?.id
      ? currentBid
      : currentBid + increment;

  if (amounts.includes(preferredAmount)) {
    return preferredAmount;
  }

  return amounts.find((amount) => amount >= preferredAmount) ?? amounts[amounts.length - 1];
}

function activeLotBidHelperText(player, team, amounts) {
  const increment = bidIncrementValue();
  if (!team) {
    return "Choose a team before setting the bid.";
  }

  const maxBid = maxTeamBidForPlayer(team, player);
  const cappedMaxBid = maxActiveLotBidForTeam(team, player);
  if (!amounts.length) {
    return `No valid bid amount is available for ${team.name}. Max allowed is ${formatMoney(cappedMaxBid)}.`;
  }

  return `Amount must be a multiple of ${formatMoney(increment)}. Max for ${team.name}: ${formatMoney(cappedMaxBid)}. Team max ${formatMoney(maxBid)}.`;
}

function updateActiveLotBidAmountOptions() {
  const form = document.getElementById("active-lot-bid-form");
  const player = getCurrentPlayer();
  if (!(form instanceof HTMLFormElement) || !player) {
    return;
  }

  const team = findTeam(namedValue(form, "teamId"));
  const amountSelect = form.elements.namedItem("amount");
  const submitButton = form.querySelector("button[type='submit']");

  if (!(amountSelect instanceof HTMLSelectElement)) {
    return;
  }

  const amounts = activeLotBidAmounts(player, team);
  const selectedAmount = selectedActiveLotBidAmount(player, team, amounts);
  amountSelect.innerHTML = activeLotBidAmountOptions(amounts, selectedAmount);
  amountSelect.disabled = !amounts.length;
  setText("active-lot-bid-helper", activeLotBidHelperText(player, team, amounts));

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = !currentUserIsAdmin || !team || !amounts.length;
  }
}

function renderAdminLotMetrics() {
  const currentPlayer = getCurrentPlayer();
  const leadingTeam = currentPlayer?.currentTeamId
    ? findTeam(currentPlayer.currentTeamId)
    : undefined;

  setText("admin-current-base", formatMoney(currentPlayer?.basePrice ?? 0));
  setText("admin-current-bid", formatMoney(currentPlayer?.currentBid ?? 0));
  setText("admin-current-leading", leadingTeam?.name ?? "Open");
}

function renderAdminPlayerTable() {
  const root = document.getElementById("admin-player-table");
  if (!root) {
    return;
  }

  const query = adminPlayerSearchTerm;
  const filteredPlayers = filterAdminPlayers(state.players, query);
  const players = orderAdminAuctionPlayers(filteredPlayers);
  const visibleCount = filteredPlayers.length;
  const countLabel = query ? `${visibleCount}/${state.players.length}` : String(state.players.length);
  const emptyMessage = query ? "No players match your search." : "No players found.";

  setText("admin-player-count", countLabel);
  root.innerHTML = renderAdminPlayerRows(players, emptyMessage);
}

function orderAdminAuctionPlayers(players) {
  const inBidding = sortPlayersById(
    players.filter((player) => player.status === "in_bidding")
  );
  const available = sortPlayersByAdminRandomOrder(
    players.filter((player) => player.status === "available")
  );
  const sold = sortPlayersById(players.filter((player) => player.status === "sold"));
  const unsold = sortPlayersByAdminRandomOrder(
    players.filter((player) => player.status === "unsold")
  );
  const notPlaying = sortPlayersById(
    players.filter((player) => player.status === "not_playing")
  );
  const otherStatuses = sortPlayersByAdminRandomOrder(
    players.filter(
      (player) =>
        !["in_bidding", "available", "sold", "unsold", "not_playing"].includes(player.status)
    )
  );

  return [...inBidding, ...available, ...sold, ...unsold, ...notPlaying, ...otherStatuses];
}

function filterAdminPlayers(players, query) {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (!terms.length) {
    return players;
  }

  return players.filter((player) => {
    const searchText = adminPlayerSearchText(player);
    return terms.every((term) => searchText.includes(term));
  });
}

function adminPlayerSearchText(player) {
  const team = findTeam(player.currentTeamId) ?? findTeam(player.soldTeamId);

  return [
    playerSerialNumber(player),
    player.id,
    player.name,
    player.role,
    player.battingStyle,
    player.bowlingStyle,
    player.age,
    player.basePrice,
    player.currentBid,
    player.status,
    player.status.replace("_", " "),
    player.contact,
    player.jerseyNumber,
    playerLeadershipLabel(player.id),
    team?.name,
    team?.owner,
  ]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .join(" ")
    .toLowerCase();
}

function sortPlayersByAdminRandomOrder(players) {
  return [...players].sort(
    (first, second) => adminPlayerRandomRank(first) - adminPlayerRandomRank(second)
  );
}

function adminPlayerRandomRank(player) {
  if (!adminPlayerRandomOrder.has(player.id)) {
    adminPlayerRandomOrder.set(player.id, Math.random());
  }

  return adminPlayerRandomOrder.get(player.id);
}

function renderAdminPlayerRows(players, emptyMessage) {
  if (!players.length) {
    return `
      <div class="data-table player-table player-table-empty">
        <p class="empty-state">${escapeHtml(emptyMessage)}</p>
      </div>
    `;
  }

  return `
    <div class="data-table player-table">
      <div class="data-table-inner">
        <div class="data-row player-data-row header">
          <span>ID</span>
          <span>Player</span>
          <span>Role</span>
          <span>Base</span>
          <span>Bid</span>
          <span>Status</span>
          <span>Captain</span>
          <span>Action</span>
        </div>
      ${players
        .map(
          (player) => `
            <div class="data-row player-data-row">
              <span class="serial-cell mobile-field" data-label="ID">${escapeHtml(playerSerialNumber(player))}</span>
              <span class="player-cell">
                <img alt="${escapeAttr(player.name)}" decoding="async" loading="lazy" src="${escapeAttr(player.imageUrl)}" />
                <span>
                  <strong>${escapeHtml(player.name)}</strong>
                  <small>${escapeHtml(playerMeta(player))}</small>
                </span>
              </span>
              <span class="mobile-field" data-label="Role">${escapeHtml(player.role)}</span>
              <span class="mobile-field" data-label="Base">${formatMoney(player.basePrice)}</span>
              <span class="mobile-field" data-label="Bid">${formatMoney(player.currentBid)}</span>
              <span class="mobile-field" data-label="Status">${statusBadge(player.status)}</span>
              <span class="mobile-field leadership-cell" data-label="Captain">${playerLeadershipCell(player.id)}</span>
              <span class="row-actions">
                <button class="secondary-button compact-button" data-player-edit="${escapeAttr(player.id)}" type="button">Edit</button>
                <button class="secondary-button compact-button" data-admin-start="${escapeAttr(player.id)}" ${player.status === "available" ? "" : "disabled"} type="button">Start</button>
              </span>
            </div>
          `
        )
        .join("")}
      </div>
    </div>
  `;
}

function showPlayerEditDialog(playerId) {
  const player = findPlayer(playerId);
  const dialog = document.getElementById("player-edit-dialog");
  const form = document.getElementById("player-edit-form");

  if (!player || !(form instanceof HTMLFormElement)) {
    window.alert("Player not found.");
    return;
  }

  form.dataset.playerId = player.id;
  setPlayerEditFormValue(form, "name", player.name);
  setPlayerEditFormValue(form, "role", player.role);
  setPlayerEditFormValue(form, "basePrice", player.basePrice);
  populatePlayerStatusSelect(form, player.status);
  setPlayerEditFormValue(form, "age", player.age);
  setPlayerEditFormValue(form, "battingStyle", player.battingStyle);
  setPlayerEditFormValue(form, "bowlingStyle", player.bowlingStyle);
  setPlayerEditFormValue(form, "contact", player.contact);
  setPlayerEditFormValue(form, "jerseyNumber", player.jerseyNumber);
  const leadership = getPlayerLeadership(player.id);
  const leadershipTeamSelect = form.elements.namedItem("leadershipTeamId");
  if (leadershipTeamSelect instanceof HTMLSelectElement) {
    populateLeadershipTeamSelect(leadershipTeamSelect, leadership.teamId);
  }
  setPlayerEditFormValue(form, "leadershipRole", leadership.role);

  const imageInput = form.elements.namedItem("imageFile");
  if (imageInput instanceof HTMLInputElement) {
    imageInput.value = "";
  }

  const previewImage = document.getElementById("player-edit-image-preview");
  if (previewImage instanceof HTMLImageElement) {
    previewImage.src = player.imageUrl || DEFAULT_PLAYER_IMAGE_URL;
    previewImage.alt = player.name;
  }

  setText("player-edit-preview-name", player.name);
  setText(
    "player-edit-status",
    `${playerStatusLabel(player.status)} | Current bid ${formatMoney(player.currentBid)}`
  );

  const canShowModal =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.showModal === "function";

  if (canShowModal) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog?.setAttribute("open", "");
  }

  window.setTimeout(() => {
    const nameInput = form.elements.namedItem("name");
    if (nameInput instanceof HTMLInputElement) {
      nameInput.focus();
      nameInput.select();
    }
  }, 0);
}

function closePlayerEditDialog() {
  const dialog = document.getElementById("player-edit-dialog");
  const form = document.getElementById("player-edit-form");
  const canCloseDialog =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.close === "function";

  if (canCloseDialog && dialog.open) {
    dialog.close();
  } else {
    dialog?.removeAttribute("open");
  }

  if (form instanceof HTMLFormElement) {
    form.reset();
    delete form.dataset.playerId;
  }
}

function showStopBiddingDialog(playerId) {
  const player = findPlayer(playerId);
  const team = player?.currentTeamId ? findTeam(player.currentTeamId) : undefined;
  const dialog = document.getElementById("stop-bidding-dialog");
  const form = document.getElementById("stop-bidding-form");

  if (!player || !(form instanceof HTMLFormElement)) {
    return;
  }

  form.dataset.playerId = player.id;
  setText("stop-bidding-player-name", player.name);
  setText(
    "stop-bidding-player-status",
    `Current bid ${formatMoney(player.currentBid)} | Leading ${team?.name ?? "No bid yet"}`
  );

  const canShowModal =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.showModal === "function";

  if (canShowModal) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog?.setAttribute("open", "");
  }

  window.setTimeout(() => {
    const confirmButton = form.querySelector("button[type='submit']");
    if (confirmButton instanceof HTMLButtonElement) {
      confirmButton.focus();
    }
  }, 0);
}

function closeStopBiddingDialog() {
  const dialog = document.getElementById("stop-bidding-dialog");
  const form = document.getElementById("stop-bidding-form");
  const canCloseDialog =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.close === "function";

  if (canCloseDialog && dialog.open) {
    dialog.close();
  } else {
    dialog?.removeAttribute("open");
  }

  if (form instanceof HTMLFormElement) {
    form.reset();
    delete form.dataset.playerId;
  }
}

function showResetAuctionDialog({ keepViceCaptains = false } = {}) {
  const dialog = document.getElementById("reset-auction-dialog");
  const form = document.getElementById("reset-auction-confirm-form");
  const retainedLabel = keepViceCaptains ? "captains and vice captains" : "captains";

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.dataset.keepViceCaptains = String(keepViceCaptains);
  setText(
    "reset-auction-confirm-copy",
    `This will keep ${retainedLabel} and reset every other player.`
  );
  setText(
    "reset-auction-confirm-detail",
    "All bids for reset players will be deleted and team spent amounts will be recalculated."
  );

  const canShowModal =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.showModal === "function";

  if (canShowModal) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog?.setAttribute("open", "");
  }

  window.setTimeout(() => {
    const confirmButton = form.querySelector("button[type='submit']");
    if (confirmButton instanceof HTMLButtonElement) {
      confirmButton.focus();
    }
  }, 0);
}

function closeResetAuctionDialog() {
  const dialog = document.getElementById("reset-auction-dialog");
  const form = document.getElementById("reset-auction-confirm-form");
  const canCloseDialog =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.close === "function";

  if (canCloseDialog && dialog.open) {
    dialog.close();
  } else {
    dialog?.removeAttribute("open");
  }

  if (form instanceof HTMLFormElement) {
    form.reset();
    delete form.dataset.keepViceCaptains;
  }
}

function showSoldPlayerDialog(player, team) {
  const dialog = document.getElementById("sold-player-dialog");
  const summary = document.getElementById("sold-player-summary");

  if (!player || !team || !summary) {
    return;
  }

  const soldAmount = formatMoney(player.currentBid);
  const playerImageUrl = player.imageUrl || DEFAULT_PLAYER_IMAGE_URL;
  const jerseyNumber = player.jerseyNumber || "-";

  setText("sold-player-title", `${player.name} sold`);
  setText("sold-player-subtitle", `${team.name} | ${soldAmount}`);

  summary.innerHTML = `
    <div class="sold-player-photo-wrap">
      <span class="serial-badge">${escapeHtml(playerSerial(player))}</span>
      <img alt="${escapeAttr(player.name)}" decoding="async" src="${escapeAttr(playerImageUrl)}" />
    </div>
    <div class="sold-player-details">
      <div class="sold-player-team">
        ${teamLogo(team, "sold-dialog-team-logo")}
        <div>
          <span>Team</span>
          <strong>${escapeHtml(team.name)}</strong>
          <small>${escapeHtml(team.owner || "")}</small>
        </div>
      </div>
      <div class="sold-player-facts">
        <div class="sold-player-fact">
          <span>Amount</span>
          <strong>${soldAmount}</strong>
        </div>
        <div class="sold-player-fact">
          <span>Role</span>
          <strong>${escapeHtml(player.role)}</strong>
        </div>
        <div class="sold-player-fact">
          <span>Jersey</span>
          <strong>${escapeHtml(jerseyNumber)}</strong>
        </div>
        <div class="sold-player-fact">
          <span>Status</span>
          <strong>Sold</strong>
        </div>
      </div>
    </div>
  `;

  const canShowModal =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.showModal === "function";

  if (canShowModal) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog?.setAttribute("open", "");
  }

  clearSoldPlayerDialogTimer();
  soldDialogTimer = window.setTimeout(closeSoldPlayerDialog, SOLD_DIALOG_AUTO_CLOSE_MS);
}

function closeSoldPlayerDialog() {
  const dialog = document.getElementById("sold-player-dialog");
  const canCloseDialog =
    typeof HTMLDialogElement !== "undefined" &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.close === "function";

  clearSoldPlayerDialogTimer();

  if (canCloseDialog && dialog.open) {
    dialog.close();
  } else {
    dialog?.removeAttribute("open");
  }
}

function clearSoldPlayerDialogTimer() {
  if (!soldDialogTimer) {
    return;
  }

  window.clearTimeout(soldDialogTimer);
  soldDialogTimer = null;
}

function bindSoldPlayerDialogEvents() {
  if (soldDialogEventsBound) {
    return;
  }

  soldDialogEventsBound = true;

  const soldDialog = document.getElementById("sold-player-dialog");
  if (
    typeof HTMLDialogElement !== "undefined" &&
    soldDialog instanceof HTMLDialogElement
  ) {
    soldDialog.addEventListener("close", clearSoldPlayerDialogTimer);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-sold-dialog-close]");
    if (!target) {
      return;
    }

    closeSoldPlayerDialog();
  });
}

function soldPlayerAnnouncementFromStateChange(previousPlayers) {
  const previousStatusById = new Map(
    previousPlayers.map((player) => [player.id, player.status])
  );
  const newlySoldPlayers = state.players.filter((player) => {
    const previousStatus = previousStatusById.get(player.id);
    return previousStatus && previousStatus !== "sold" && player.status === "sold";
  });

  if (!newlySoldPlayers.length) {
    return null;
  }

  const newlySoldPlayerIds = new Set(newlySoldPlayers.map((player) => player.id));
  const latestSoldBid = state.bids.find((bid) => newlySoldPlayerIds.has(bid.playerId));
  const soldPlayer =
    newlySoldPlayers.find((player) => player.id === latestSoldBid?.playerId) ??
    newlySoldPlayers[0];
  const team = soldPlayer.soldTeamId ? findTeam(soldPlayer.soldTeamId) : undefined;

  if (!team) {
    return null;
  }

  return {
    player: soldPlayer,
    team,
  };
}

function setPlayerEditFormValue(form, name, value) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
    field.value = String(value ?? "");
  }
}

function populatePlayerStatusSelect(form, status) {
  const field = form.elements.namedItem("status");
  if (!(field instanceof HTMLSelectElement)) {
    return;
  }

  const normalizedStatus = normalizePlayerStatus(status);
  const canChangeStatus = PLAYER_STATUS_FORM_MUTABLE_STATUSES.includes(normalizedStatus);
  const options = canChangeStatus
    ? [...new Set([normalizedStatus, ...PLAYER_STATUS_EDITABLE_OPTIONS])]
    : [normalizedStatus];

  field.innerHTML = options
    .map(
      (option) => `
        <option value="${escapeAttr(option)}">${escapeHtml(playerStatusLabel(option))}</option>
      `
    )
    .join("");
  field.value = normalizedStatus;
  field.disabled = !canChangeStatus;
  field.title = canChangeStatus
    ? ""
    : "Use auction controls to change this player's current auction status.";
}

function updatePlayerEditImagePreview(input) {
  const file = input.files?.[0];
  const previewImage = document.getElementById("player-edit-image-preview");
  if (!file || !(previewImage instanceof HTMLImageElement)) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  previewImage.addEventListener("load", () => URL.revokeObjectURL(previewUrl), {
    once: true,
  });
}

function renderAdminTeams() {
  const root = document.getElementById("admin-team-grid");
  if (!root) {
    return;
  }

  root.innerHTML = state.teams.map(teamCard).join("");
}

function renderAdminTeamEditor() {
  const root = document.getElementById("admin-team-editor");
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="data-table team-editor-table">
      <div class="data-table-inner">
        <div class="data-row team-data-row header">
          <span>Team</span>
          <span>Owner</span>
          <span>Color</span>
          <span>Logo</span>
          <span>Spent</span>
          <span>Action</span>
        </div>
        ${state.teams
          .map(
            (team) => `
              <form class="data-row team-data-row" data-team-edit-form data-team-id="${escapeAttr(team.id)}">
                <input class="inline-input" name="name" required value="${escapeAttr(team.name)}" />
                <input class="inline-input" name="owner" required value="${escapeAttr(team.owner)}" />
                <input class="inline-input color-input" name="color" type="color" value="${escapeAttr(team.color)}" />
                <input class="inline-input file-input" accept="image/*" name="logoFile" type="file" />
                <span>${formatMoney(team.spent)}</span>
                <span class="row-actions">
                  <button class="secondary-button compact-button" type="submit">Save</button>
                  <button class="danger-button compact-button" data-team-delete="${escapeAttr(team.id)}" type="button">Remove</button>
                </span>
              </form>
            `
          )
          .join("")}
      </div>
    </div>
    <form id="add-team-form" class="form-stack add-team-form">
      <div class="form-grid team-add-grid">
        <label>
          Team name
          <input name="name" required />
        </label>
        <label>
          Owner
          <input name="owner" required />
        </label>
        <label>
          Color
          <input name="color" type="color" value="${escapeAttr(nextTeamColor())}" />
        </label>
        <label>
          Upload logo
          <input accept="image/*" name="logoFile" type="file" />
        </label>
      </div>
      <button class="secondary-button full" type="submit">Add team</button>
    </form>
  `;
}

function bindAdminEvents() {
  if (adminEventsBound) {
    return;
  }

  adminEventsBound = true;

  document.addEventListener("click", (event) => {
    const target = event.target.closest(
      "#logout-button, #admin-reset, #reset-except-captains, #sell-player, #make-player-available, #mark-unsold, [data-admin-tab], [data-bid-team], [data-admin-start], [data-player-edit], [data-player-edit-close], [data-stop-bidding-close], [data-reset-auction-close], [data-team-delete]"
    );

    if (!target) {
      return;
    }

    if (target.dataset.adminTab) {
      setAdminTab(target.dataset.adminTab);
      return;
    }

    if (target.id === "logout-button") {
      void runAction(() => logout());
      return;
    }

    if (target.id === "admin-reset") {
      void runAction(() => resetAuction());
      return;
    }

    if (target.id === "reset-except-captains") {
      const keepViceCaptainsInput = document.getElementById(
        "reset-keep-vice-captains"
      );
      const keepViceCaptains =
        keepViceCaptainsInput instanceof HTMLInputElement &&
        keepViceCaptainsInput.checked;
      showResetAuctionDialog({ keepViceCaptains });
      return;
    }

    if (target.id === "sell-player") {
      const currentPlayer = getCurrentPlayer();
      if (currentPlayer) {
        void runAction(() => sellPlayer(currentPlayer.id));
      }
      return;
    }

    if (target.id === "mark-unsold") {
      const currentPlayer = getCurrentPlayer();
      if (currentPlayer) {
        void runAction(() => markUnsold(currentPlayer.id));
      }
      return;
    }

    if (target.id === "make-player-available") {
      const currentPlayer = getCurrentPlayer();
      if (currentPlayer) {
        showStopBiddingDialog(currentPlayer.id);
      }
      return;
    }

    if (target.dataset.stopBiddingClose !== undefined) {
      closeStopBiddingDialog();
      return;
    }

    if (target.dataset.resetAuctionClose !== undefined) {
      closeResetAuctionDialog();
      return;
    }

    if (target.dataset.bidTeam) {
      const currentPlayer = getCurrentPlayer();
      if (currentPlayer) {
        void runAction(() => placeBid(currentPlayer.id, target.dataset.bidTeam));
      }
      return;
    }

    if (target.dataset.adminStart) {
      void runAction(() => startPlayer(target.dataset.adminStart));
      return;
    }

    if (target.dataset.playerEdit) {
      showPlayerEditDialog(target.dataset.playerEdit);
      return;
    }

    if (target.dataset.playerEditClose !== undefined) {
      closePlayerEditDialog();
      return;
    }

    if (target.dataset.teamDelete) {
      void runAction(() => deleteTeam(target.dataset.teamDelete));
    }
  });

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (
      input instanceof HTMLSelectElement &&
      input.dataset.activeLotBidTeam !== undefined
    ) {
      updateActiveLotBidAmountOptions();
      return;
    }

    if (
      !(input instanceof HTMLInputElement) ||
      input.name !== "imageFile" ||
      input.form?.id !== "player-edit-form"
    ) {
      return;
    }

    updatePlayerEditImagePreview(input);
  });

  document.addEventListener("input", (event) => {
    const input = event.target;
    if (
      !(input instanceof HTMLInputElement) ||
      input.dataset.adminPlayerSearch !== "all"
    ) {
      return;
    }

    const cursorPosition = input.selectionStart ?? input.value.length;
    adminPlayerSearchTerm = input.value;
    renderAdminPlayerTable();

    const nextInput = document.querySelector("[data-admin-player-search='all']");
    if (nextInput instanceof HTMLInputElement) {
      nextInput.focus();
      nextInput.setSelectionRange(cursorPosition, cursorPosition);
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (form.id === "auction-settings-form") {
      event.preventDefault();
      void runAction(async () => {
        await updateAuctionConfig({
          defaultBasePrice: positiveNumberOf("settings-base-price", "Default base price"),
          bidIncrement: positiveNumberOf("settings-bid-increment", "Bid increment"),
          teamPurse: positiveNumberOf("settings-team-purse", "Team purse"),
          totalPlayersPerTeam: positiveIntegerOf(
            "settings-total-players",
            "Total players per team"
          ),
        });
      });
      return;
    }

    if (form.id === "add-player-form") {
      event.preventDefault();
      void runAction(async () => {
        await addPlayer({
          name: valueOf("new-name"),
          role: valueOf("new-role"),
          status: valueOf("new-status"),
          basePrice: Number(valueOf("new-base-price")),
          battingStyle: valueOf("new-batting"),
          bowlingStyle: valueOf("new-bowling"),
          age: Number(valueOf("new-age")),
          contact: valueOf("new-contact"),
          jerseyNumber: valueOf("new-jersey-number"),
          imageUrl: await imageValue("new-image-file", DEFAULT_PLAYER_IMAGE_URL, {
            folder: "players",
            nameHint: valueOf("new-name"),
            storageBucket: PLAYER_PHOTO_BUCKET,
          }),
        }, {
          teamId: valueOf("new-leadership-team"),
          role: valueOf("new-leadership-role"),
        });
        form.reset();
        document.getElementById("new-base-price").value = String(
          state.defaultBasePrice ?? DEFAULT_BASE_PRICE
        );
        document.getElementById("new-age").value = "24";
        document.getElementById("new-status").value = "available";
      });
      return;
    }

    if (form.id === "add-team-form") {
      event.preventDefault();
      void runAction(async () => {
        await addTeam({
          name: namedValue(form, "name"),
          owner: namedValue(form, "owner"),
          color: namedValue(form, "color"),
          logoUrl: await imageValueFromForm(form, "logoFile", ""),
        });
      });
      return;
    }

    if (form.id === "player-edit-form") {
      event.preventDefault();
      void runAction(async () => {
        const existingPlayer = findPlayer(form.dataset.playerId);
        await updatePlayer(form.dataset.playerId, {
          name: namedValue(form, "name"),
          role: namedValue(form, "role"),
          status: namedValue(form, "status"),
          basePrice: positiveNumberFromForm(form, "basePrice", "Base price"),
          age: positiveNumberFromForm(form, "age", "Age"),
          battingStyle: namedValue(form, "battingStyle"),
          bowlingStyle: namedValue(form, "bowlingStyle"),
          contact: namedValue(form, "contact"),
          jerseyNumber: namedValue(form, "jerseyNumber"),
          imageUrl: await imageValueFromForm(
            form,
            "imageFile",
            existingPlayer?.imageUrl ?? DEFAULT_PLAYER_IMAGE_URL,
            {
              folder: "players",
              nameHint: namedValue(form, "name"),
              recordId: form.dataset.playerId,
              storageBucket: PLAYER_PHOTO_BUCKET,
            }
          ),
        }, {
          teamId: namedValue(form, "leadershipTeamId"),
          role: namedValue(form, "leadershipRole"),
        }, {
          render: false,
        });
        closePlayerEditDialog();
        renderCurrentPage();
      });
      return;
    }

    if (form.id === "stop-bidding-form") {
      event.preventDefault();
      void runAction(async () => {
        const playerId = form.dataset.playerId;
        if (!playerId) {
          throw new Error("No active player selected for stop bidding.");
        }
        await makePlayerAvailable(playerId);
        closeStopBiddingDialog();
      });
      return;
    }

    if (form.id === "active-lot-bid-form") {
      event.preventDefault();
      void runAction(async () => {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) {
          throw new Error("No active lot selected.");
        }
        await setActiveLotBid(
          currentPlayer.id,
          namedValue(form, "teamId"),
          nonNegativeNumberFromForm(form, "amount", "Bidding amount")
        );
      });
      return;
    }

    if (form.id === "reset-auction-confirm-form") {
      event.preventDefault();
      void runAction(async () => {
        await resetAuctionExceptCaptains({
          keepViceCaptains: form.dataset.keepViceCaptains === "true",
        });
        closeResetAuctionDialog();
      });
      return;
    }

    if (form.dataset.teamEditForm !== undefined) {
      event.preventDefault();
      void runAction(async () => {
        await updateTeam(form.dataset.teamId, {
          name: namedValue(form, "name"),
          owner: namedValue(form, "owner"),
          color: namedValue(form, "color"),
          logoUrl: await imageValueFromForm(
            form,
            "logoFile",
            findTeam(form.dataset.teamId)?.logoUrl ?? ""
          ),
        });
      });
    }
  });

}

async function logout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
  authStateLoaded = false;
  currentUser = null;
  currentUserIsAdmin = false;
  window.location.href = "login.html";
}

async function resetAuction() {
  if (!RESET_DEMO_ENABLED) {
    throw new Error("Reset demo is disabled for now.");
  }

  if (!currentUserIsAdmin) {
    throw new Error("Admin login required to reset demo data.");
  }

  if (supabaseClient) {
    if (!window.confirm("Reset all Supabase auction data to the demo seed data?")) {
      return;
    }
    await rpc("reset_demo_data");
    await refreshRemoteStateAfterMutation();
    return;
  }

  state = clone(seedState);
  saveLocalState();
  renderCurrentPage();
}

async function resetAuctionExceptCaptains({ keepViceCaptains = false } = {}) {
  if (!currentUserIsAdmin) {
    throw new Error("Admin login required to reset auction data.");
  }

  if (supabaseClient) {
    await rpc("reset_auction_except_captains", {
      p_keep_vice_captains: keepViceCaptains,
    });
    await refreshRemoteStateAfterMutation(() =>
      renderAfterAuctionAction({ includeTeamPurse: true })
    );
    return;
  }

  const retainedPlayerIds = retainedResetPlayerIds(keepViceCaptains);

  state.bids = state.bids.filter((bid) => retainedPlayerIds.has(bid.playerId));
  state.players = state.players.map((player) => {
    if (retainedPlayerIds.has(player.id)) {
      return player;
    }

    if (player.status === "not_playing") {
      return {
        ...player,
        currentTeamId: undefined,
        soldTeamId: undefined,
        currentBid: player.basePrice,
      };
    }

    return {
      ...player,
      currentBid: player.basePrice,
      currentTeamId: undefined,
      soldTeamId: undefined,
      status: "available",
    };
  });
  state.teams = state.teams.map((team) => ({
    ...team,
    spent: retainedTeamSpend(team.id, retainedPlayerIds),
  }));
  state.currentPlayerId = state.players.find(
    (player) => player.status === "in_bidding"
  )?.id;

  saveLocalState();
  renderAfterAuctionAction({ includeTeamPurse: true });
}

async function updateAuctionConfig({
  defaultBasePrice,
  bidIncrement,
  teamPurse,
  totalPlayersPerTeam,
}) {
  const maxSpent = Math.max(0, ...state.teams.map((team) => team.spent));
  if (teamPurse < maxSpent) {
    throw new Error(`Team purse must be at least ${formatMoney(maxSpent)}.`);
  }

  const maxRosterCount = Math.max(
    0,
    ...state.teams.map((team) => teamRosterPlayerIds(team.id).size)
  );
  if (totalPlayersPerTeam < maxRosterCount) {
    throw new Error(
      `Total players per team must be at least ${maxRosterCount} based on current rosters.`
    );
  }

  if (supabaseClient) {
    await rpc("update_auction_config", {
      p_default_base_price: defaultBasePrice,
      p_bid_increment: bidIncrement,
      p_team_purse: teamPurse,
      p_total_players_per_team: totalPlayersPerTeam,
    });
    await refreshRemoteStateAfterMutation();
    return;
  }

  state.defaultBasePrice = defaultBasePrice;
  state.bidIncrement = bidIncrement;
  state.totalPlayersPerTeam = totalPlayersPerTeam;
  state.teams = state.teams.map((team) => ({
    ...team,
    purse: teamPurse,
  }));
  saveLocalState();
  renderCurrentPage();
}

async function addTeam(team) {
  if (supabaseClient) {
    await rpc("add_team", {
      p_name: team.name,
      p_owner: team.owner,
      p_color: team.color,
      p_logo_url: team.logoUrl,
    });
    await refreshRemoteStateAfterMutation();
    return;
  }

  state.teams.push({
    ...team,
    id: makeId("team"),
    purse: getConfiguredTeamPurse(),
    spent: 0,
  });
  saveLocalState();
  renderCurrentPage();
}

async function updateTeam(teamId, team) {
  if (supabaseClient) {
    await rpc("update_team", {
      p_team_id: teamId,
      p_name: team.name,
      p_owner: team.owner,
      p_color: team.color,
      p_logo_url: team.logoUrl,
    });
    await refreshRemoteStateAfterMutation();
    return;
  }

  state.teams = state.teams.map((existingTeam) =>
    existingTeam.id === teamId ? { ...existingTeam, ...team } : existingTeam
  );
  saveLocalState();
  renderCurrentPage();
}

async function deleteTeam(teamId) {
  if (!window.confirm("Remove this team? This is only allowed before the team has bids, spending, or assigned players.")) {
    return;
  }

  if (supabaseClient) {
    await rpc("delete_team", { p_team_id: teamId });
    await refreshRemoteStateAfterMutation();
    return;
  }

  assertTeamCanBeDeleted(teamId);
  state.teams = state.teams.filter((team) => team.id !== teamId);
  saveLocalState();
  renderCurrentPage();
}

async function startPlayer(playerId) {
  if (!currentUserIsAdmin) {
    throw new Error("Admin login required to start lots.");
  }

  if (supabaseClient) {
    await rpc("start_player", { p_player_id: playerId });
    await refreshRemoteStateAfterMutation(() => renderAfterAuctionAction(), {
      includePlayerImages: false,
    });
    return;
  }

  const playerToStart = findPlayer(playerId);
  if (!playerToStart || playerToStart.status !== "available") {
    throw new Error("Only available players can be started.");
  }

  state.players = state.players.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        currentBid: Math.max(player.currentBid, player.basePrice),
        currentTeamId: undefined,
        status: "in_bidding",
      };
    }

    if (player.status === "in_bidding") {
      return { ...player, status: "available", currentTeamId: undefined };
    }

    return player;
  });
  state.currentPlayerId = playerId;
  saveLocalState();
  renderAfterAuctionAction();
}

async function placeBid(playerId, teamId) {
  if (supabaseClient) {
    if (!currentUserIsAdmin) {
      throw new Error("Admin login required before placing bids.");
    }
    await rpc("place_bid", { p_player_id: playerId, p_team_id: teamId });
    await refreshRemoteStateAfterMutation(
      () => renderAfterAuctionAction({ includePlayerTable: false }),
      { includePlayerImages: false }
    );
    return;
  }

  const player = findPlayer(playerId);
  const team = findTeam(teamId);

  if (!currentUserIsAdmin) {
    throw new Error("Admin login required before placing bids.");
  }

  if (!player || !team || player.status === "sold") {
    return;
  }

  const nextAmount = getNextBidAmount(player);
  const maxBid = maxTeamBidForPlayer(team, player);
  if (nextAmount > maxBid) {
    throw new Error(`Maximum bid for ${team.name} is ${formatMoney(maxBid)}.`);
  }

  player.currentBid = nextAmount;
  player.currentTeamId = teamId;
  player.status = "in_bidding";
  state.currentPlayerId = playerId;
  state.bids.unshift({
    id: makeId("bid"),
    playerId,
    teamId,
    amount: nextAmount,
    createdAt: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  saveLocalState();
  renderAfterAuctionAction({ includePlayerTable: false });
}

async function setActiveLotBid(playerId, teamId, amount) {
  if (!currentUserIsAdmin) {
    throw new Error("Admin login required before setting bids.");
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Bidding amount must be 0 or greater.");
  }

  const player = findPlayer(playerId);
  const team = findTeam(teamId);

  if (!player || player.status !== "in_bidding") {
    throw new Error("Bid can be set only for the active lot.");
  }

  if (!team) {
    throw new Error("Choose a bidding team.");
  }

  validateActiveLotBid(player, team, amount);

  if (supabaseClient) {
    await rpc("set_active_lot_bid", {
      p_player_id: playerId,
      p_team_id: teamId,
      p_amount: amount,
    });
    await refreshRemoteStateAfterMutation(
      () => renderAfterAuctionAction({ includePlayerTable: false }),
      { includePlayerImages: false }
    );
    return;
  }

  player.currentBid = amount;
  player.currentTeamId = teamId;
  player.status = "in_bidding";
  state.currentPlayerId = playerId;

  state.bids.unshift({
    id: makeId("bid"),
    playerId,
    teamId,
    amount,
    createdAt: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  saveLocalState();
  renderAfterAuctionAction({ includePlayerTable: false });
}

async function sellPlayer(playerId) {
  const player = findPlayer(playerId);
  const team = player?.currentTeamId ? findTeam(player.currentTeamId) : undefined;

  if (supabaseClient) {
    await rpc("sell_player", { p_player_id: playerId });
    await refreshRemoteStateAfterMutation(
      () => renderAfterAuctionAction({ includeTeamPurse: true }),
      { includePlayerImages: false }
    );
    return;
  }

  if (!player?.currentTeamId || !team) {
    return;
  }

  team.spent += player.currentBid;
  player.soldTeamId = player.currentTeamId;
  player.status = "sold";
  advanceToNextPlayer();
  saveLocalState();
  renderAfterAuctionAction({ includeTeamPurse: true });
}

async function makePlayerAvailable(playerId) {
  if (!currentUserIsAdmin) {
    throw new Error("Admin login required to stop bidding.");
  }

  if (supabaseClient) {
    await rpc("make_player_available", { p_player_id: playerId });
    await refreshRemoteStateAfterMutation(() => renderAfterAuctionAction(), {
      includePlayerImages: false,
    });
    return;
  }

  const player = findPlayer(playerId);
  if (!player || player.status !== "in_bidding") {
    throw new Error("Player is not currently open for bidding.");
  }

  player.currentBid = player.basePrice;
  player.currentTeamId = undefined;
  player.status = "available";
  state.bids = state.bids.filter((bid) => bid.playerId !== playerId);

  if (state.currentPlayerId === playerId) {
    state.currentPlayerId = undefined;
  }

  saveLocalState();
  renderAfterAuctionAction();
}

async function markUnsold(playerId) {
  if (supabaseClient) {
    await rpc("mark_unsold", { p_player_id: playerId });
    await refreshRemoteStateAfterMutation(() => renderAfterAuctionAction(), {
      includePlayerImages: false,
    });
    return;
  }

  const player = findPlayer(playerId);
  if (!player) {
    return;
  }

  player.currentBid = player.basePrice;
  player.currentTeamId = undefined;
  player.status = "unsold";
  advanceToNextPlayer();
  saveLocalState();
  renderAfterAuctionAction();
}

async function addPlayer(player, leadership = {}) {
  if (supabaseClient) {
    const playerId = await rpc("add_player", {
      p_name: player.name,
      p_role: player.role,
      p_batting_style: player.battingStyle,
      p_bowling_style: player.bowlingStyle,
      p_age: player.age,
      p_base_price: player.basePrice,
      p_image_url: player.imageUrl,
      p_contact: player.contact,
      p_jersey_number: player.jerseyNumber,
      p_status: normalizeEditablePlayerStatus(player.status),
    });
    await updatePlayerLeadership(playerId, leadership);
    await refreshRemoteStateAfterMutation();
    return;
  }

  const newPlayer = {
    ...player,
    id: makeId("player"),
    playerNumber: nextPlayerNumber(),
    currentBid: player.basePrice,
    status: normalizeEditablePlayerStatus(player.status),
  };

  state.players.push(newPlayer);
  applyPlayerLeadershipToState(newPlayer.id, leadership);
  saveLocalState();
  renderCurrentPage();
}

async function updatePlayer(playerId, player, leadership = {}, options = {}) {
  if (supabaseClient) {
    await rpc("update_player", {
      p_player_id: playerId,
      p_name: player.name,
      p_role: player.role,
      p_batting_style: player.battingStyle,
      p_bowling_style: player.bowlingStyle,
      p_age: player.age,
      p_base_price: player.basePrice,
      p_image_url: player.imageUrl,
      p_contact: player.contact,
      p_jersey_number: player.jerseyNumber,
      p_status: normalizePlayerStatus(player.status),
    });
    await updatePlayerLeadership(playerId, leadership);
    await refreshRemoteStateAfterMutation(
      options.render === false ? null : renderCurrentPage
    );
    return;
  }

  state.players = state.players.map((existingPlayer) => {
    if (existingPlayer.id !== playerId) {
      return existingPlayer;
    }

    const nextStatus = nextEditablePlayerStatus(existingPlayer, player.status);
    const clearsAuctionState = ["available", "not_playing"].includes(nextStatus);
    const nextCurrentBid = clearsAuctionState
      ? player.basePrice
      : existingPlayer.currentTeamId || existingPlayer.status === "sold"
        ? Math.max(existingPlayer.currentBid, player.basePrice)
        : player.basePrice;

    return {
      ...existingPlayer,
      ...player,
      status: nextStatus,
      currentTeamId: clearsAuctionState ? undefined : existingPlayer.currentTeamId,
      soldTeamId: clearsAuctionState ? undefined : existingPlayer.soldTeamId,
      currentBid: nextCurrentBid,
    };
  });
  applyPlayerLeadershipToState(playerId, leadership);
  saveLocalState();
  if (options.render !== false) {
    renderCurrentPage();
  }
}

async function updatePlayerLeadership(playerId, leadership) {
  const normalizedLeadership = normalizeLeadershipSelection(leadership);

  if (supabaseClient) {
    const updates = buildPlayerLeadershipUpdates(playerId, normalizedLeadership);
    for (const update of updates) {
      await rpc("set_team_captains", {
        p_team_id: update.teamId,
        p_captain_player_id: update.captainPlayerId,
        p_vice_captain_player_id: update.viceCaptainPlayerId,
      });
    }
    return;
  }

  applyPlayerLeadershipToState(playerId, normalizedLeadership);
}

function applyPlayerLeadershipToState(playerId, leadership) {
  const normalizedLeadership = normalizeLeadershipSelection(leadership);
  const updates = buildPlayerLeadershipUpdates(playerId, normalizedLeadership);

  if (!updates.length) {
    return;
  }

  state.teams = state.teams.map((team) => {
    const update = updates.find((nextUpdate) => nextUpdate.teamId === team.id);
    if (!update) {
      return team;
    }

    return {
      ...team,
      captainPlayerId: update.captainPlayerId ?? undefined,
      viceCaptainPlayerId: update.viceCaptainPlayerId ?? undefined,
    };
  });
}

function buildPlayerLeadershipUpdates(playerId, leadership) {
  return state.teams
    .map((team) => {
      let captainPlayerId = team.captainPlayerId ?? null;
      let viceCaptainPlayerId = team.viceCaptainPlayerId ?? null;

      if (captainPlayerId === playerId) {
        captainPlayerId = null;
      }

      if (viceCaptainPlayerId === playerId) {
        viceCaptainPlayerId = null;
      }

      if (team.id === leadership.teamId) {
        if (leadership.role === "captain") {
          captainPlayerId = playerId;
        }

        if (leadership.role === "vice_captain") {
          viceCaptainPlayerId = playerId;
        }
      }

      if (
        captainPlayerId === (team.captainPlayerId ?? null) &&
        viceCaptainPlayerId === (team.viceCaptainPlayerId ?? null)
      ) {
        return null;
      }

      return {
        teamId: team.id,
        captainPlayerId,
        viceCaptainPlayerId,
      };
    })
    .filter(Boolean);
}

function normalizeLeadershipSelection(leadership) {
  const role = leadership?.role ?? "";
  const teamId = leadership?.teamId ?? "";

  if (!["", "captain", "vice_captain"].includes(role)) {
    throw new Error("Choose a valid captain or vice captain option.");
  }

  if (!role) {
    return { teamId: "", role: "" };
  }

  if (!teamId) {
    throw new Error("Choose a team for the captain or vice captain.");
  }

  if (!state.teams.some((team) => team.id === teamId)) {
    throw new Error("Selected team was not found.");
  }

  return { teamId, role };
}

async function rpc(name, args = {}) {
  suppressRealtimeRefresh();
  const { data, error } = await supabaseClient.rpc(name, args);
  suppressRealtimeRefresh();
  throwIfSupabaseError(error);
  return data;
}

async function runAction(action) {
  try {
    await action();
  } catch (error) {
    console.error(error);
    window.alert(error.message ?? "Action failed.");
  }
}

function advanceToNextPlayer() {
  const next = state.players.find((player) => player.status === "available");
  state.currentPlayerId = next?.id;
  if (next) {
    next.status = "in_bidding";
    next.currentTeamId = undefined;
    next.currentBid = Math.max(next.currentBid, next.basePrice);
  }
}

function teamCard(team) {
  const remaining = team.purse - team.spent;
  const spentPct = Math.min(100, Math.round((team.spent / team.purse) * 100));

  return `
    <article class="team-card">
      <div class="activity-row">
        ${teamLogo(team)}
        <div class="team-bid-main">
          <h3>${escapeHtml(team.name)}</h3>
          <p>${escapeHtml(team.owner)}</p>
        </div>
      </div>
      <div class="team-card-progress">
        <span style="width:${spentPct}%"></span>
      </div>
      <div class="team-card-footer">
        <span>Spent ${formatMoney(team.spent)}</span>
        <strong>Left ${formatMoney(remaining)}</strong>
      </div>
    </article>
  `;
}

function teamLogo(team, size = "") {
  const sizeClass = size ? ` ${size}` : "";
  const logoUrl = team.logoUrl?.trim();

  return `
    <span class="team-logo${sizeClass}" style="--team-color:${escapeAttr(team.color)}">
      ${
        logoUrl
          ? `<img alt="${escapeAttr(`${team.name} logo`)}" src="${escapeAttr(logoUrl)}" />`
          : `<span>${escapeHtml(teamInitials(team.name))}</span>`
      }
    </span>
  `;
}

function teamCaptainName(team) {
  const captain = team.captainPlayerId ? findPlayer(team.captainPlayerId) : undefined;
  return captain?.name ?? "";
}

function teamInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "T"
  );
}

function info(label, value) {
  return `
    <div class="info">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `;
}

function statusBadge(status) {
  const normalizedStatus = normalizePlayerStatus(status);
  return `<span class="status-badge status-${escapeAttr(normalizedStatus)}">${escapeHtml(
    playerStatusLabel(normalizedStatus)
  )}</span>`;
}

function playerStatusLabel(status) {
  const labels = {
    available: "Available",
    in_bidding: "In bidding",
    sold: "Sold",
    unsold: "Unsold",
    not_playing: "Not playing",
  };

  return labels[status] ?? String(status || "").replace("_", " ");
}

function normalizePlayerStatus(status) {
  return PLAYER_STATUSES.includes(status) ? status : "available";
}

function normalizeEditablePlayerStatus(status) {
  const normalizedStatus = normalizePlayerStatus(status);
  return PLAYER_STATUS_EDITABLE_OPTIONS.includes(normalizedStatus)
    ? normalizedStatus
    : "available";
}

function nextEditablePlayerStatus(existingPlayer, requestedStatus) {
  const normalizedStatus = normalizePlayerStatus(requestedStatus);
  const existingStatus = normalizePlayerStatus(existingPlayer.status);
  if (PLAYER_STATUS_FORM_MUTABLE_STATUSES.includes(existingStatus)) {
    if (normalizedStatus === existingStatus) {
      return existingStatus;
    }

    return normalizeEditablePlayerStatus(normalizedStatus);
  }

  return existingStatus;
}

function getCurrentPlayer() {
  return state.players.find((player) => player.id === state.currentPlayerId);
}

function findPlayer(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function playerSerial(player) {
  return playerSerialNumber(player);
}

function playerSerialNumber(player) {
  const index = state.players.findIndex((existingPlayer) => existingPlayer.id === player.id);
  const serial = Number(player.playerNumber ?? (index >= 0 ? index + 1 : 0));
  return String(serial).padStart(2, "0");
}

function playerMeta(player) {
  return [
    player.jerseyNumber ? `Jersey ${player.jerseyNumber}` : "",
    player.contact ? `Contact ${player.contact}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

function sortPlayersById(players) {
  return [...players].sort((first, second) => playerSortId(first) - playerSortId(second));
}

function playerSortId(player) {
  const index = state.players.findIndex((existingPlayer) => existingPlayer.id === player.id);
  return Number(player.playerNumber ?? (index >= 0 ? index + 1 : 0));
}

function nextPlayerNumber() {
  return state.players.reduce((max, player, index) => {
    const serial = Number(player.playerNumber ?? index + 1);
    return Number.isFinite(serial) ? Math.max(max, serial) : max;
  }, 0) + 1;
}

function findTeam(teamId) {
  return state.teams.find((team) => team.id === teamId);
}

function getConfiguredTeamPurse() {
  return state.teams[0]?.purse ?? DEFAULT_TEAM_PURSE;
}

function getConfiguredTotalPlayersPerTeam() {
  const totalPlayers = Number(
    state.totalPlayersPerTeam ?? DEFAULT_TOTAL_PLAYERS_PER_TEAM
  );
  return Number.isFinite(totalPlayers) && totalPlayers > 0
    ? totalPlayers
    : DEFAULT_TOTAL_PLAYERS_PER_TEAM;
}

function retainedResetPlayerIds(keepViceCaptains) {
  const ids = new Set();

  state.teams.forEach((team) => {
    if (team.captainPlayerId) {
      ids.add(team.captainPlayerId);
    }
    if (keepViceCaptains && team.viceCaptainPlayerId) {
      ids.add(team.viceCaptainPlayerId);
    }
  });

  return ids;
}

function retainedTeamSpend(teamId, retainedPlayerIds) {
  return state.players
    .filter(
      (player) =>
        retainedPlayerIds.has(player.id) &&
        player.status === "sold" &&
        player.soldTeamId === teamId
    )
    .reduce((sum, player) => sum + Number(player.currentBid || 0), 0);
}

function soldTeamMemberCount(teamId) {
  return state.players.filter(
    (player) => player.status === "sold" && player.soldTeamId === teamId
  ).length;
}

function teamRosterPlayerIds(teamId, options = {}) {
  const ids = new Set();

  state.players.forEach((player) => {
    const assignedTeamId =
      options.bidPlayerId === player.id
        ? options.bidTeamId
        : playerRosterTeamId(player);

    if (assignedTeamId === teamId) {
      ids.add(player.id);
    }
  });

  return ids;
}

function teamRosterCountAfterBid(team, player) {
  return teamRosterPlayerIds(team.id, {
    bidPlayerId: player.id,
    bidTeamId: team.id,
  }).size;
}

function maxTeamBidForPlayer(team, player) {
  const totalPlayers = getConfiguredTotalPlayersPerTeam();
  const rosterCountAfterBid = teamRosterCountAfterBid(team, player);

  if (rosterCountAfterBid > totalPlayers) {
    return 0;
  }

  const requiredPlayersAfterBid = totalPlayers - rosterCountAfterBid;
  const reserveAmount =
    requiredPlayersAfterBid * Number(state.defaultBasePrice ?? DEFAULT_BASE_PRICE);

  return Math.max(0, team.purse - team.spent - reserveAmount);
}

function maxActiveLotBidForTeam(team, player) {
  return Math.min(maxTeamBidForPlayer(team, player), ACTIVE_LOT_BID_AMOUNT_CAP);
}

function validateActiveLotBid(player, team, amount) {
  const increment = bidIncrementValue();
  const minimumBid = roundUpToIncrement(player.basePrice, increment);
  const maxBid = maxActiveLotBidForTeam(team, player);

  if (!isMultipleOfIncrement(amount, increment)) {
    throw new Error(`Bidding amount must be a multiple of ${formatMoney(increment)}.`);
  }

  if (amount < minimumBid) {
    throw new Error(`Bidding amount must be at least ${formatMoney(minimumBid)}.`);
  }

  if (amount > maxBid) {
    throw new Error(`Maximum bid for ${team.name} is ${formatMoney(maxBid)}.`);
  }
}

function bidIncrementValue() {
  const increment = Number(state.bidIncrement ?? DEFAULT_BID_INCREMENT);
  return Number.isFinite(increment) && increment > 0
    ? increment
    : DEFAULT_BID_INCREMENT;
}

function roundUpToIncrement(value, increment) {
  return Math.ceil(Number(value || 0) / increment) * increment;
}

function isMultipleOfIncrement(value, increment) {
  const ratio = Number(value) / increment;
  return Number.isFinite(ratio) && Math.abs(ratio - Math.round(ratio)) < 0.000001;
}

function assertTeamCanBeDeleted(teamId) {
  if (state.teams.length <= 1) {
    throw new Error("At least one team is required.");
  }

  const team = findTeam(teamId);
  if (!team) {
    throw new Error("Team not found.");
  }

  if (team.spent > 0) {
    throw new Error("Teams with spending cannot be removed.");
  }

  if (state.bids.some((bid) => bid.teamId === teamId)) {
    throw new Error("Teams with bids cannot be removed.");
  }

  if (
    state.players.some(
      (player) => player.currentTeamId === teamId || player.soldTeamId === teamId
    )
  ) {
    throw new Error("Teams assigned to players cannot be removed.");
  }
}

function nextTeamColor() {
  const colors = [
    "#176b48",
    "#c7511f",
    "#3867a6",
    "#8a3ffc",
    "#b7791f",
    "#0f766e",
    "#be123c",
    "#4338ca",
  ];
  return colors[state.teams.length % colors.length];
}

function getNextBidAmount(player) {
  if (!player.currentTeamId) {
    return Math.max(player.currentBid, player.basePrice);
  }

  return Math.max(player.currentBid + state.bidIncrement, player.basePrice);
}

function dbTeamToState(row) {
  return {
    id: row.id,
    name: row.name,
    owner: row.owner,
    purse: Number(row.purse),
    spent: Number(row.spent),
    color: row.color,
    logoUrl: row.logo_url ?? "",
    captainPlayerId: row.captain_player_id ?? undefined,
    viceCaptainPlayerId: row.vice_captain_player_id ?? undefined,
  };
}

function dbPlayerToState(row, existingPlayerImages = new Map()) {
  const displayPlayerId = row.player_id ?? row.player_number;

  return {
    id: row.id,
    playerNumber: displayPlayerId == null ? undefined : Number(displayPlayerId),
    name: row.name,
    role: row.role,
    battingStyle: row.batting_style,
    bowlingStyle: row.bowling_style,
    age: Number(row.age),
    basePrice: Number(row.base_price),
    currentBid: Number(row.current_bid),
    contact: row.contact ?? "",
    jerseyNumber: row.jersey_number ?? "",
    currentTeamId: row.current_team_id ?? undefined,
    soldTeamId: row.sold_team_id ?? undefined,
    status: row.status,
    imageUrl: row.image_url ?? existingPlayerImages.get(row.id) ?? DEFAULT_PLAYER_IMAGE_URL,
  };
}

function dbBidToState(row) {
  return {
    id: row.id,
    playerId: row.player_id,
    teamId: row.team_id,
    amount: Number(row.amount),
    createdAt: formatTime(row.created_at),
  };
}

function formatMoney(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setAdminTab(tabName) {
  const tabs = document.querySelectorAll("[data-admin-tab]");
  const panels = document.querySelectorAll("[data-admin-panel]");

  tabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === tabName;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.adminPanel !== tabName;
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function valueOf(id) {
  return document.getElementById(id).value.trim();
}

function namedValue(form, name) {
  const field = form.elements.namedItem(name);
  return field?.value.trim() ?? "";
}

async function imageValue(fileInputId, fallbackValue, options = {}) {
  const input = document.getElementById(fileInputId);
  if (!(input instanceof HTMLInputElement)) {
    return fallbackValue;
  }

  return imageValueFromInput(input, fallbackValue, options);
}

async function imageValueFromForm(form, fileInputName, fallbackValue, options = {}) {
  const input = form.elements.namedItem(fileInputName);
  if (!(input instanceof HTMLInputElement)) {
    return fallbackValue;
  }

  return imageValueFromInput(input, fallbackValue, options);
}

async function imageValueFromInput(input, fallbackValue, options = {}) {
  const file = input.files?.[0];
  if (!file) {
    return fallbackValue;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (options.storageBucket && supabaseClient) {
    return uploadImageToStorage(file, options);
  }

  if (file.size > MAX_INLINE_IMAGE_SIZE) {
    throw new Error("Image file must be 1 MB or smaller.");
  }

  return readFileAsDataUrl(file);
}

async function uploadImageToStorage(file, options) {
  if (file.size > MAX_STORAGE_IMAGE_SIZE) {
    throw new Error("Image file must be 5 MB or smaller.");
  }

  if (!supabaseClient?.storage) {
    throw new Error("Supabase Storage is not available.");
  }

  const bucket = options.storageBucket;
  const path = storageObjectPath(file, options);
  const { error } = await supabaseClient.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    throw new Error(
      `${error.message} Run supabase/setup-player-photo-storage.sql in Supabase SQL Editor, then retry the upload.`
    );
  }

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Could not create public URL for uploaded image.");
  }

  return data.publicUrl;
}

function storageObjectPath(file, options) {
  const folder = slugifyPathSegment(options.folder || "uploads");
  const nameSource = options.recordId || options.nameHint || file.name || "player";
  const name = slugifyPathSegment(nameSource);
  const extension = imageFileExtension(file);
  const uniquePart =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${folder}/${name}-${uniquePart}.${extension}`;
}

function slugifyPathSegment(value) {
  return String(value || "image")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}

function imageFileExtension(file) {
  const mimeExtensions = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  if (mimeExtensions[file.type]) {
    return mimeExtensions[file.type];
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{2,5}$/.test(fileExtension) ? fileExtension : "jpg";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function positiveNumberOf(id, label) {
  const value = Number(valueOf(id));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than 0.`);
  }
  return value;
}

function positiveIntegerOf(id, label) {
  const value = Number(valueOf(id));
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a whole number greater than 0.`);
  }
  return value;
}

function positiveNumberFromForm(form, name, label) {
  const value = Number(namedValue(form, name));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than 0.`);
  }
  return value;
}

function nonNegativeNumberFromForm(form, name, label) {
  const value = Number(namedValue(form, name));
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be 0 or greater.`);
  }
  return value;
}

function normalizeAuctionState(next) {
  if (!next || typeof next !== "object") {
    return clone(seedState);
  }

  return {
    ...next,
    bidIncrement: Number(next.bidIncrement ?? DEFAULT_BID_INCREMENT),
    defaultBasePrice: Number(next.defaultBasePrice ?? DEFAULT_BASE_PRICE),
    totalPlayersPerTeam: Number(
      next.totalPlayersPerTeam ?? DEFAULT_TOTAL_PLAYERS_PER_TEAM
    ),
    teams: Array.isArray(next.teams) ? next.teams : clone(seedState.teams),
    players: Array.isArray(next.players)
      ? next.players.map(normalizePlayer)
      : clone(seedState.players).map(normalizePlayer),
    bids: Array.isArray(next.bids) ? next.bids : clone(seedState.bids),
  };
}

function normalizePlayer(player) {
  return {
    ...player,
    contact: player.contact ?? "",
    jerseyNumber: player.jerseyNumber ?? "",
    status: normalizePlayerStatus(player.status),
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function throwIfSupabaseError(error) {
  if (error) {
    if (String(error.message ?? "").includes("schema cache")) {
      throw new Error(
        `${error.message} Run the latest supabase/schema.sql in Supabase SQL Editor, then retry.`
      );
    }

    throw error;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
