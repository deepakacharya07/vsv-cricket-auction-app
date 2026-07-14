const STORAGE_KEY = "vsv-cricket-auction-state-v4";
const ADMIN_AUTH_KEY = "vsv-auction-admin-auth";
const DEFAULT_BID_INCREMENT = 50;
const DEFAULT_TEAM_PURSE = 5000;
const DEFAULT_BASE_PRICE = 50;
const RESET_DEMO_ENABLED = false;
const MAX_INLINE_IMAGE_SIZE = 1024 * 1024;
const DEFAULT_PLAYER_IMAGE_URL =
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80";
const DEMO_ADMIN = {
  email: "admin@vsvauction.local",
  password: "admin123",
};

const seedState = {
  bidIncrement: DEFAULT_BID_INCREMENT,
  defaultBasePrice: DEFAULT_BASE_PRICE,
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
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80",
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
const adminPlayerSearchTerms = {
  available: "",
  unsold: "",
  sold: "",
};
const adminPlayerRandomOrder = new Map();

document.addEventListener("DOMContentLoaded", () => {
  void bootstrapApp();
});

async function bootstrapApp() {
  const page = document.body.dataset.page;

  await refreshAuthState();

  if (page !== "login") {
    await initializeAuctionState();
  }

  if (page === "auction") {
    renderAuctionBoard();
    bindAuctionEvents();
  }

  if (page === "players") {
    renderPlayersPage();
  }

  if (page === "login") {
    renderLoginPage();
  }

  if (page === "admin") {
    await renderAdminPage();
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

async function loadRemoteState() {
  const [settingsResult, teamsResult, playersResult, bidsResult] =
    await Promise.all([
      supabaseClient.from("auction_settings").select("*").limit(1).maybeSingle(),
      supabaseClient.from("teams").select("*").order("created_at"),
      supabaseClient.from("players").select("*").order("created_at"),
      supabaseClient.from("bids").select("*").order("created_at", {
        ascending: false,
      }),
    ]);

  throwIfSupabaseError(settingsResult.error);
  throwIfSupabaseError(teamsResult.error);
  throwIfSupabaseError(playersResult.error);
  throwIfSupabaseError(bidsResult.error);

  const players = (playersResult.data ?? [])
    .map(dbPlayerToState)
    .sort((a, b) => Number(a.playerNumber ?? 0) - Number(b.playerNumber ?? 0));
  const inBidding = players.find((player) => player.status === "in_bidding");

  state = {
    bidIncrement: Number(settingsResult.data?.bid_increment ?? DEFAULT_BID_INCREMENT),
    defaultBasePrice: Number(
      settingsResult.data?.default_base_price ?? DEFAULT_BASE_PRICE
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
  window.clearTimeout(realtimeRefreshTimer);
  realtimeRefreshTimer = window.setTimeout(async () => {
    try {
      await loadRemoteState();
      renderCurrentPage();
    } catch (error) {
      console.error("Realtime refresh failed.", error);
    }
  }, 150);
}

async function refreshAuthState() {
  currentUser = null;
  currentUserIsAdmin = false;

  if (!supabaseClient) {
    currentUserIsAdmin = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
    return;
  }

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return;
  }

  currentUser = user;
  currentUserIsAdmin = await userHasAdminAccess(user.id);
}

async function userHasAdminAccess(userId) {
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

  return Boolean(data);
}

function renderCurrentPage() {
  const page = document.body.dataset.page;

  if (page === "auction") {
    renderAuctionBoard();
  }

  if (page === "admin") {
    void renderAdminPage();
  }

  if (page === "players") {
    renderPlayersPage();
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
      currentSummary.textContent = `${currentPlayer.role} | ${currentPlayer.battingStyle} | ${currentPlayer.bowlingStyle}`;
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
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80";
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
      const nextBid = getNextBidAmount(currentPlayer);
      const canBid = remaining >= nextBid && currentUserIsAdmin;
      const title = !currentUserIsAdmin
        ? "Admin login required before placing bids"
        : "";
      const bidLabel = currentPlayer.currentTeamId
        ? `+${formatMoney(state.bidIncrement)}`
        : `Bid ${formatMoney(nextBid)}`;

      return `
        <button class="team-bid-button" data-bid-team="${team.id}" title="${escapeAttr(title)}" ${canBid ? "" : "disabled"} type="button">
          ${teamLogo(team, "small")}
          <span class="team-bid-main">
            <strong>${escapeHtml(team.name)}</strong>
            <span>Remaining ${formatMoney(remaining)}</span>
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
          <img alt="${escapeAttr(player.name)}" src="${escapeAttr(player.imageUrl)}" />
          <div class="player-card-header">
            <div>
              <h3>${escapeHtml(player.name)}</h3>
              <p>${escapeHtml(player.role)} | Age ${player.age}</p>
            </div>
            ${statusBadge(player.status)}
          </div>
          <div class="info-grid">
            ${info("Base", formatMoney(player.basePrice))}
            ${info("Bid", formatMoney(player.currentBid))}
            ${info("Batting", player.battingStyle)}
            ${info("Bowling", player.bowlingStyle)}
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

  await refreshAuthState();
  if (!currentUserIsAdmin) {
    await supabaseClient.auth.signOut();
    throw new Error("This user is not listed in public.admin_users.");
  }

  window.location.href = "admin.html";
}

async function renderAdminPage() {
  await refreshAuthState();

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

  renderAdminCurrentLot();
  renderTeamBidButtons(getCurrentPlayer());
  renderAuctionSettings();
  renderAdminPlayerTable();
  renderAdminTeams();
  renderAdminTeamEditor();
  renderAdminResetActionState();
  bindAdminEvents();
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
  const addPlayerBasePriceInput = document.getElementById("new-base-price");

  if (!basePriceInput || !bidIncrementInput || !teamPurseInput) {
    return;
  }

  basePriceInput.value = String(state.defaultBasePrice ?? DEFAULT_BASE_PRICE);
  bidIncrementInput.value = String(state.bidIncrement ?? DEFAULT_BID_INCREMENT);
  teamPurseInput.value = String(getConfiguredTeamPurse());

  if (addPlayerBasePriceInput) {
    addPlayerBasePriceInput.value = String(state.defaultBasePrice ?? DEFAULT_BASE_PRICE);
  }
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
      <img alt="${escapeAttr(currentPlayer.name)}" src="${escapeAttr(currentPlayer.imageUrl)}" />
      <div class="active-lot-info">
        <span class="serial-badge inline">${escapeHtml(playerSerial(currentPlayer))}</span>
        <h2>${escapeHtml(currentPlayer.name)}</h2>
        <p>${escapeHtml(currentPlayer.role)} | ${escapeHtml(currentPlayer.battingStyle)}</p>
        <strong class="activity-amount">${formatMoney(currentPlayer.currentBid)}</strong>
        <p>Leading: ${escapeHtml(leadingTeam?.name ?? "No bid yet")}</p>
      </div>
      <div class="lot-actions">
        <button class="primary-button" id="sell-player" ${currentPlayer.currentTeamId ? "" : "disabled"} type="button">Sell player</button>
        <button class="secondary-button" id="make-player-available" type="button">Stop bidding</button>
        <button class="danger-button" id="mark-unsold" type="button">Mark unsold</button>
      </div>
    </div>
  `;
}

function renderAdminPlayerTable() {
  const root = document.getElementById("admin-player-table");
  if (!root) {
    return;
  }

  const playerGroups = [
    {
      key: "available",
      title: "Available / In bidding",
      description: "Players ready to start or currently open for bidding.",
      emptyMessage: "No available or in-bidding players.",
      order: "in_bidding_first",
      players: state.players.filter((player) =>
        ["available", "in_bidding"].includes(player.status)
      ),
    },
    {
      key: "unsold",
      title: "Marked unsold",
      description: "Players marked as unsold.",
      emptyMessage: "No players are marked unsold.",
      players: state.players.filter((player) => player.status === "unsold"),
    },
    {
      key: "sold",
      title: "Sold",
      description: "Players already sold to teams.",
      emptyMessage: "No players have been sold yet.",
      order: "id",
      players: state.players.filter((player) => player.status === "sold"),
    },
  ];

  root.innerHTML = playerGroups.map(renderAdminPlayerGroup).join("");
}

function renderAdminPlayerGroup(group) {
  const query = adminPlayerSearchTerms[group.key] ?? "";
  const filteredPlayers = filterAdminPlayers(group.players, query);
  const players = orderAdminPlayerGroup({ ...group, players: filteredPlayers });
  const visibleCount = filteredPlayers.length;
  const countLabel = query ? `${visibleCount}/${group.players.length}` : String(group.players.length);
  const emptyMessage = query ? "No players match your search." : group.emptyMessage;

  return `
    <section class="player-list-section">
      <div class="player-list-heading">
        <div>
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.description)}</p>
        </div>
        <div class="player-list-tools">
          <label class="player-search-field">
            <span>Search</span>
            <input
              aria-label="Search ${escapeAttr(group.title)}"
              data-admin-player-search="${escapeAttr(group.key)}"
              placeholder="Search players"
              type="search"
              value="${escapeAttr(query)}"
            />
          </label>
          <span>${escapeHtml(countLabel)}</span>
        </div>
      </div>
      ${renderAdminPlayerRows(players, emptyMessage)}
    </section>
  `;
}

function orderAdminPlayerGroup(group) {
  if (group.order === "id") {
    return sortPlayersById(group.players);
  }

  if (group.order === "in_bidding_first") {
    return [
      ...sortPlayersByAdminRandomOrder(
        group.players.filter((player) => player.status === "in_bidding")
      ),
      ...sortPlayersByAdminRandomOrder(
        group.players.filter((player) => player.status !== "in_bidding")
      ),
    ];
  }

  return sortPlayersByAdminRandomOrder(group.players);
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
          <span>Action</span>
        </div>
      ${players
        .map(
          (player) => `
            <div class="data-row player-data-row">
              <span class="serial-cell mobile-field" data-label="ID">${escapeHtml(playerSerialNumber(player))}</span>
              <span class="player-cell">
                <img alt="${escapeAttr(player.name)}" src="${escapeAttr(player.imageUrl)}" />
                <span>
                  <strong>${escapeHtml(player.name)}</strong>
                  <small>${escapeHtml(playerMeta(player))}</small>
                </span>
              </span>
              <span class="mobile-field" data-label="Role">${escapeHtml(player.role)}</span>
              <span class="mobile-field" data-label="Base">${formatMoney(player.basePrice)}</span>
              <span class="mobile-field" data-label="Bid">${formatMoney(player.currentBid)}</span>
              <span class="mobile-field" data-label="Status">${statusBadge(player.status)}</span>
              <span class="row-actions">
                <button class="secondary-button compact-button" data-player-edit="${escapeAttr(player.id)}" type="button">Edit</button>
                <button class="secondary-button compact-button" data-admin-start="${escapeAttr(player.id)}" ${player.status === "sold" ? "disabled" : ""} type="button">Start</button>
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
  setPlayerEditFormValue(form, "age", player.age);
  setPlayerEditFormValue(form, "battingStyle", player.battingStyle);
  setPlayerEditFormValue(form, "bowlingStyle", player.bowlingStyle);
  setPlayerEditFormValue(form, "contact", player.contact);
  setPlayerEditFormValue(form, "jerseyNumber", player.jerseyNumber);

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
    `${player.status.replace("_", " ")} | Current bid ${formatMoney(player.currentBid)}`
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

function setPlayerEditFormValue(form, name, value) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
    field.value = String(value ?? "");
  }
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
      "#logout-button, #admin-reset, #sell-player, #make-player-available, #mark-unsold, [data-admin-tab], [data-bid-team], [data-admin-start], [data-player-edit], [data-player-edit-close], [data-stop-bidding-close], [data-team-delete]"
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
    if (!(input instanceof HTMLInputElement) || !input.dataset.adminPlayerSearch) {
      return;
    }

    const searchKey = input.dataset.adminPlayerSearch;
    const cursorPosition = input.selectionStart ?? input.value.length;
    adminPlayerSearchTerms[searchKey] = input.value;
    renderAdminPlayerTable();

    const nextInput = [...document.querySelectorAll("[data-admin-player-search]")].find(
      (element) =>
        element instanceof HTMLInputElement && element.dataset.adminPlayerSearch === searchKey
    );
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
          basePrice: Number(valueOf("new-base-price")),
          battingStyle: valueOf("new-batting"),
          bowlingStyle: valueOf("new-bowling"),
          age: Number(valueOf("new-age")),
          contact: valueOf("new-contact"),
          jerseyNumber: valueOf("new-jersey-number"),
          imageUrl: await imageValue("new-image-file", DEFAULT_PLAYER_IMAGE_URL),
        });
        form.reset();
        document.getElementById("new-base-price").value = String(
          state.defaultBasePrice ?? DEFAULT_BASE_PRICE
        );
        document.getElementById("new-age").value = "24";
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
          basePrice: positiveNumberFromForm(form, "basePrice", "Base price"),
          age: positiveNumberFromForm(form, "age", "Age"),
          battingStyle: namedValue(form, "battingStyle"),
          bowlingStyle: namedValue(form, "bowlingStyle"),
          contact: namedValue(form, "contact"),
          jerseyNumber: namedValue(form, "jerseyNumber"),
          imageUrl: await imageValueFromForm(
            form,
            "imageFile",
            existingPlayer?.imageUrl ?? DEFAULT_PLAYER_IMAGE_URL
          ),
        });
        closePlayerEditDialog();
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
    await loadRemoteState();
    renderCurrentPage();
    return;
  }

  state = clone(seedState);
  saveLocalState();
  renderCurrentPage();
}

async function updateAuctionConfig({ defaultBasePrice, bidIncrement, teamPurse }) {
  const maxSpent = Math.max(0, ...state.teams.map((team) => team.spent));
  if (teamPurse < maxSpent) {
    throw new Error(`Team purse must be at least ${formatMoney(maxSpent)}.`);
  }

  if (supabaseClient) {
    await rpc("update_auction_config", {
      p_default_base_price: defaultBasePrice,
      p_bid_increment: bidIncrement,
      p_team_purse: teamPurse,
    });
    await loadRemoteState();
    renderCurrentPage();
    return;
  }

  state.defaultBasePrice = defaultBasePrice;
  state.bidIncrement = bidIncrement;
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
    await loadRemoteState();
    renderCurrentPage();
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
    await loadRemoteState();
    renderCurrentPage();
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
    await loadRemoteState();
    renderCurrentPage();
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
    await loadRemoteState();
    renderCurrentPage();
    return;
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
  renderCurrentPage();
}

async function placeBid(playerId, teamId) {
  if (supabaseClient) {
    if (!currentUserIsAdmin) {
      throw new Error("Admin login required before placing bids.");
    }
    await rpc("place_bid", { p_player_id: playerId, p_team_id: teamId });
    await loadRemoteState();
    renderCurrentPage();
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
  if (team.purse - team.spent < nextAmount) {
    return;
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
  renderCurrentPage();
}

async function sellPlayer(playerId) {
  if (supabaseClient) {
    await rpc("sell_player", { p_player_id: playerId });
    await loadRemoteState();
    renderCurrentPage();
    return;
  }

  const player = findPlayer(playerId);
  if (!player?.currentTeamId) {
    return;
  }

  const team = findTeam(player.currentTeamId);
  if (team) {
    team.spent += player.currentBid;
  }

  player.soldTeamId = player.currentTeamId;
  player.status = "sold";
  advanceToNextPlayer();
  saveLocalState();
  renderCurrentPage();
}

async function makePlayerAvailable(playerId) {
  if (!currentUserIsAdmin) {
    throw new Error("Admin login required to stop bidding.");
  }

  if (supabaseClient) {
    await rpc("make_player_available", { p_player_id: playerId });
    await loadRemoteState();
    renderCurrentPage();
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
  renderCurrentPage();
}

async function markUnsold(playerId) {
  if (supabaseClient) {
    await rpc("mark_unsold", { p_player_id: playerId });
    await loadRemoteState();
    renderCurrentPage();
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
  renderCurrentPage();
}

async function addPlayer(player) {
  if (supabaseClient) {
    await rpc("add_player", {
      p_name: player.name,
      p_role: player.role,
      p_batting_style: player.battingStyle,
      p_bowling_style: player.bowlingStyle,
      p_age: player.age,
      p_base_price: player.basePrice,
      p_image_url: player.imageUrl,
      p_contact: player.contact,
      p_jersey_number: player.jerseyNumber,
    });
    await loadRemoteState();
    renderCurrentPage();
    return;
  }

  state.players.push({
    ...player,
    id: makeId("player"),
    playerNumber: nextPlayerNumber(),
    currentBid: player.basePrice,
    status: "available",
  });
  saveLocalState();
  renderCurrentPage();
}

async function updatePlayer(playerId, player) {
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
    });
    await loadRemoteState();
    renderCurrentPage();
    return;
  }

  state.players = state.players.map((existingPlayer) => {
    if (existingPlayer.id !== playerId) {
      return existingPlayer;
    }

    const nextCurrentBid =
      existingPlayer.currentTeamId || existingPlayer.status === "sold"
        ? Math.max(existingPlayer.currentBid, player.basePrice)
        : player.basePrice;

    return {
      ...existingPlayer,
      ...player,
      currentBid: nextCurrentBid,
    };
  });
  saveLocalState();
  renderCurrentPage();
}

async function rpc(name, args = {}) {
  const { error } = await supabaseClient.rpc(name, args);
  throwIfSupabaseError(error);
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
  return `<span class="status-badge status-${escapeAttr(status)}">${escapeHtml(
    status.replace("_", " ")
  )}</span>`;
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
    `Age ${player.age}`,
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
  };
}

function dbPlayerToState(row) {
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
    imageUrl: row.image_url,
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
  return `INR ${Number(value || 0).toLocaleString("en-IN", {
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

async function imageValue(fileInputId, fallbackValue) {
  const input = document.getElementById(fileInputId);
  if (!(input instanceof HTMLInputElement)) {
    return fallbackValue;
  }

  return imageValueFromInput(input, fallbackValue);
}

async function imageValueFromForm(form, fileInputName, fallbackValue) {
  const input = form.elements.namedItem(fileInputName);
  if (!(input instanceof HTMLInputElement)) {
    return fallbackValue;
  }

  return imageValueFromInput(input, fallbackValue);
}

async function imageValueFromInput(input, fallbackValue) {
  const file = input.files?.[0];
  if (!file) {
    return fallbackValue;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > MAX_INLINE_IMAGE_SIZE) {
    throw new Error("Image file must be 1 MB or smaller.");
  }

  return readFileAsDataUrl(file);
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

function positiveNumberFromForm(form, name, label) {
  const value = Number(namedValue(form, name));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than 0.`);
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
