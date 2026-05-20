const statusClass = {
  Confirmed: "confirmed",
  Inspect: "inspection",
  "Pending payment": "pending",
  Overdue: "overdue",
  Paid: "confirmed",
  Held: "inspection",
  Outstanding: "pending",
  Due: "overdue"
};

const pageTitles = {
  dashboard: "Dashboard",
  fleet: "Vehicles",
  "add-vehicle": "Add vehicle",
  bookings: "Bookings",
  tracking: "Tracking",
  payments: "Payments"
};

const vehicleGrid = document.querySelector("#vehicle-grid");
const bookingTable = document.querySelector("#booking-table");
const trackingSearch = document.querySelector("#tracking-search");
const trackingResults = document.querySelector("#tracking-results");
const trackingDetail = document.querySelector("#tracking-detail");
const paymentList = document.querySelector("#payment-list");
const dashboardAlertList = document.querySelector("#dashboard-alert-list");
const vehiclePreview = document.querySelector("#vehicle-preview");
const vehicleDetailModal = document.querySelector("#vehicle-detail-modal");
const vehicleDetailContent = document.querySelector("#vehicle-detail-content");
const vehicleDetailDeleteButton = document.querySelector("#vehicle-detail-delete");
const bookingDetailModal = document.querySelector("#booking-detail-modal");
const bookingDetailContent = document.querySelector("#booking-detail-content");
const bookingDetailDeleteButton = document.querySelector("#booking-detail-delete");
const modal = document.querySelector("#booking-modal");
const toast = document.querySelector("#toast");
const authScreen = document.querySelector("#auth-screen");
const appShell = document.querySelector("#app-shell");
const authMessage = document.querySelector("#auth-message");

let state = {
  vehicles: [],
  bookings: [],
  customers: [],
  payments: [],
  dashboard: null,
  currentCustomer: null
};

let activeFleetFilter = "all";
let selectedTrackingVehicleId = null;
let currentRole = "admin";
let loginRole = "admin";
let sessionUser = null;

const isStandaloneMode = window.location.protocol === "file:";

const localUsers = [
  {
    id: "u-admin",
    role: "admin",
    name: "Gem Manager",
    email: "admin@gemcarrental.com",
    password: "GemAdmin2026!"
  }
];

const adminUser = {
  id: "u-admin",
  role: "admin",
  name: "Gem Manager",
  email: "admin@gemcarrental.com"
};

const localData = {
  vehicles: [
    {
      id: "v1",
      model: "Toyota Camry 2024",
      plate: "GT-1842",
      className: "Sedan",
      status: "available",
      mileage: "12,420 mi",
      branch: "Downtown",
      dailyRate: 68,
      color: "#7d8d9b",
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "v2",
      model: "BMW X3 2023",
      plate: "CR-9208",
      className: "Premium SUV",
      status: "rented",
      mileage: "22,105 mi",
      branch: "Airport",
      dailyRate: 145,
      color: "#2f3d47",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "v3",
      model: "Hyundai Tucson 2024",
      plate: "AS-7732",
      className: "SUV",
      status: "available",
      mileage: "8,902 mi",
      branch: "East Side",
      dailyRate: 92,
      color: "#c6b784",
      image:
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "v4",
      model: "Nissan Rogue 2022",
      plate: "GT-5091",
      className: "SUV",
      status: "maintenance",
      mileage: "61,200 mi",
      branch: "Workshop",
      dailyRate: 85,
      color: "#8a9790",
      image:
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "v5",
      model: "Honda Accord 2023",
      plate: "GT-4421",
      className: "Sedan",
      status: "available",
      mileage: "19,780 mi",
      branch: "Downtown",
      dailyRate: 74,
      color: "#324f63",
      image:
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "v6",
      model: "Ford Explorer 2022",
      plate: "CR-6615",
      className: "Premium SUV",
      status: "rented",
      mileage: "34,910 mi",
      branch: "Airport",
      dailyRate: 125,
      color: "#b7c0c9",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80"
    }
  ],
  bookings: [
    {
      id: "BK-1048",
      customer: "Sarah Mills",
      vehicle: "Toyota Camry",
      vehicleClass: "Sedan",
      pickup: "15 May, 09:00",
      returnDate: "18 May, 17:00",
      status: "Confirmed",
      total: 356
    },
    {
      id: "BK-1047",
      customer: "Daniel Cole",
      vehicle: "BMW X3",
      vehicleClass: "Premium SUV",
      pickup: "12 May, 10:30",
      returnDate: "15 May, 11:30",
      status: "Inspect",
      total: 721
    },
    {
      id: "BK-1046",
      customer: "Nova Build Ltd.",
      vehicle: "Hyundai Tucson",
      vehicleClass: "SUV",
      pickup: "15 May, 15:00",
      returnDate: "20 May, 12:00",
      status: "Pending payment",
      total: 610
    },
    {
      id: "BK-1045",
      customer: "Anthony Reed",
      vehicle: "Ford Explorer",
      vehicleClass: "Premium SUV",
      pickup: "14 May, 08:00",
      returnDate: "17 May, 08:00",
      status: "Confirmed",
      total: 510
    },
    {
      id: "BK-1044",
      customer: "Maya Johnson",
      vehicle: "Honda Accord",
      vehicleClass: "Sedan",
      pickup: "13 May, 13:00",
      returnDate: "15 May, 13:00",
      status: "Overdue",
      total: 238
    }
  ],
  customers: [
    {
      id: "c1",
      name: "Sarah Mills",
      phone: "+1 555 0193",
      email: "sarah.mills@example.com",
      license: "D-4928372",
      rentals: 9,
      spend: 4280,
      status: "Verified",
      riskNotes: "No active restrictions",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "c2",
      name: "Daniel Cole",
      phone: "+1 555 0148",
      email: "daniel.cole@example.com",
      license: "D-7701835",
      rentals: 4,
      spend: 2145,
      status: "Inspection pending",
      riskNotes: "Return inspection open",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "c3",
      name: "Maya Johnson",
      phone: "+1 555 0188",
      email: "maya.johnson@example.com",
      license: "D-6391200",
      rentals: 12,
      spend: 6910,
      status: "VIP",
      riskNotes: "No active restrictions",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "c4",
      name: "Nova Build Ltd.",
      phone: "+1 555 0164",
      email: "fleet@novabuild.example",
      license: "Corporate",
      rentals: 21,
      spend: 18660,
      status: "Corporate",
      riskNotes: "Approved monthly billing",
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
    }
  ],
  payments: [
    { bookingId: "BK-1048", customer: "Sarah Mills", method: "Card", amount: 356, status: "Paid" },
    { bookingId: "BK-1047", customer: "Daniel Cole", method: "Deposit hold", amount: 500, status: "Held" },
    { bookingId: "BK-1046", customer: "Nova Build Ltd.", method: "Bank transfer", amount: 610, status: "Outstanding" },
    { bookingId: "BK-1044", customer: "Maya Johnson", method: "Late fee", amount: 64, status: "Due" }
  ]
};

function getLocalDashboard() {
  const activeRentals = localData.bookings.filter((booking) => booking.status !== "Overdue").length;
  const revenueToday = localData.payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  return {
    availableCars: localData.vehicles.length,
    activeRentals,
    overdueReturns: localData.bookings.filter((booking) => booking.status === "Overdue").length,
    revenueToday,
    utilization: localData.bookings.length ? Math.round((activeRentals / localData.bookings.length) * 100) : 0
  };
}

function parsePayload(options) {
  if (!options.body) return {};
  try {
    return JSON.parse(options.body);
  } catch {
    return {};
  }
}

async function mockApi(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const payload = parsePayload(options);

  if (path === "/api/health") {
    return { ok: true, service: "Gem Car Rental API" };
  }

  if (path === "/api/bootstrap" && method === "GET") {
    return {
      dashboard: getLocalDashboard(),
      vehicles: [...localData.vehicles],
      bookings: [...localData.bookings],
      customers: [...localData.customers],
      payments: [...localData.payments]
    };
  }

  if (path === "/api/auth/login" && method === "POST") {
    const user = localUsers.find(
      (item) =>
        item.role === payload.role &&
        item.email.toLowerCase() === String(payload.email || "").toLowerCase() &&
        item.password === payload.password
    );

    if (!user) {
      const error = new Error("Invalid login details.");
      error.status = 401;
      throw error;
    }

    return {
      token: `gem-session-${user.role}`,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    };
  }

  if (path === "/api/auth/forgot-password" && method === "POST") {
    const user = localUsers.find(
      (item) =>
        item.role === payload.role &&
        item.email.toLowerCase() === String(payload.email || "").toLowerCase()
    );

    if (!user) {
      const error = new Error("No account found for that role and email.");
      error.status = 404;
      throw error;
    }

    return {
      message: "Password recovery instructions have been sent to the registered email address."
    };
  }

  if (path === "/api/vehicles" && method === "POST") {
    if (!payload.model || !payload.plate || !payload.className) {
      const error = new Error("Vehicle name, plate number, and type are required.");
      error.status = 400;
      throw error;
    }

    const created = {
      id: `v${localData.vehicles.length + 1}`,
      model: payload.model,
      plate: payload.plate,
      className: payload.className,
      status: payload.status || "available",
      mileage: payload.mileage || "0 mi",
      branch: payload.branch || "Main branch",
      dailyRate: Number(payload.dailyRate || 0),
      color: "#f97316",
      image:
        payload.image ||
        "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80"
    };

    localData.vehicles.unshift(created);
    return created;
  }

  if (path === "/api/bookings" && method === "POST") {
    if (!payload.customer || !payload.pickupDate || !payload.returnDate) {
      const error = new Error("Customer, pickup date, and return date are required.");
      error.status = 400;
      throw error;
    }

    const start = new Date(`${payload.pickupDate}T09:00:00`);
    const end = new Date(`${payload.returnDate}T17:00:00`);
    const diffDays = Math.max(1, Math.ceil((end - start) / 86400000));
    const total = diffDays * Number(payload.dailyRate || 0);
    const deposit = Number(payload.deposit || 0);
    const isPaid = deposit >= total;
    const changeAmount = Math.max(0, deposit - total);
    const arrearsAmount = Math.max(0, total - deposit);

    const created = {
      id: `BK-${1049 + localData.bookings.length}`,
      customer: payload.customer,
      vehicle: payload.vehicleModel || `${payload.vehicleClass} assignment`,
      vehicleClass: payload.vehicleClass,
      pickup: payload.pickupDate,
      returnDate: payload.returnDate,
      status: isPaid ? "Paid" : "Pending payment",
      total: total,
      deposit,
      changeAmount,
      arrearsAmount,
      notes: payload.notes || ""
    };

    localData.bookings.unshift(created);
    
    if (created.deposit > 0) {
      localData.payments.unshift({
        bookingId: created.id,
        customer: created.customer,
        method: payload.paymentMethod || "Mobile money",
        amount: created.deposit,
        status: isPaid ? "Paid" : "Held"
      });
    }

    return created;
  }

  const bookingDeleteMatch = path.match(/^\/api\/bookings\/([^/]+)$/);
  if (bookingDeleteMatch && method === "DELETE") {
    const bookingId = decodeURIComponent(bookingDeleteMatch[1]);
    const bookingIndex = localData.bookings.findIndex((booking) => booking.id === bookingId);
    if (bookingIndex === -1) {
      const error = new Error("Booking not found.");
      error.status = 404;
      throw error;
    }

    const [removed] = localData.bookings.splice(bookingIndex, 1);
    localData.payments = localData.payments.filter((payment) => payment.bookingId !== bookingId);
    return removed;
  }



  if (path === "/api/customers" && method === "POST") {
    if (!payload.name || !payload.email || !payload.password) {
      const error = new Error("Customer name, email, and password are required.");
      error.status = 400;
      throw error;
    }

    if (localUsers.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
      const error = new Error("A customer with that email already exists.");
      error.status = 409;
      throw error;
    }

    const created = {
      id: `c${localData.customers.length + 1}`,
      name: payload.name,
      phone: payload.phone || "",
      email: payload.email,
      license: payload.license || "",
      rentals: 0,
      spend: 0,
      status: payload.status || "New",
      riskNotes: payload.notes || "Created by admin",
      photo:
        payload.photo ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80"
    };

    localData.customers.unshift(created);
    return created;
  }

  if (path === "/api/export" && method === "POST") {
    return {
      fileName: `gem-car-rental-export-${new Date().toISOString().slice(0, 10)}.csv`,
      rows: localData.vehicles.length + localData.bookings.length + localData.customers.length
    };
  }

  const error = new Error("API route not found.");
  error.status = 404;
  throw error;
}

async function api(path, options = {}) {
  if (isStandaloneMode) {
    return mockApi(path, options);
  }

  try {
    const response = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    return mockApi(path, options);
  }
}

function money(value) {
  return `₵${Number(value).toLocaleString()}`;
}

function paymentsForBooking(bookingId) {
  return state.payments.filter((payment) => payment.bookingId === bookingId);
}

function bookingPaymentSummary(booking) {
  const payments = paymentsForBooking(booking.id);
  const received = payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Held")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const held = payments
    .filter((payment) => payment.status === "Held")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const postedOutstanding = payments
    .filter((payment) => payment.status === "Outstanding" || payment.status === "Due")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const total = Number(booking.total || 0);
  const calculatedOutstanding = Math.max(0, total - received);
  const outstanding = Math.max(calculatedOutstanding, postedOutstanding);
  const grossPaid = Math.max(0, received - held);

  return {
    paid: Math.min(total, grossPaid),
    held,
    received,
    outstanding,
    change: Math.max(0, received - total),
    total
  };
}

function paymentTotals() {
  return state.bookings.reduce(
    (totals, booking) => {
      const summary = bookingPaymentSummary(booking);
      totals.paid += summary.paid;
      totals.held += summary.held;
      totals.received += summary.received;
      totals.outstanding += summary.outstanding;
      totals.invoiced += summary.total;
      totals.change += summary.change;
      return totals;
    },
    { paid: 0, held: 0, received: 0, outstanding: 0, invoiced: 0, change: 0 }
  );
}

function recalculateDashboard() {
  const activeRentals = state.bookings.filter((booking) => booking.status !== "Overdue").length;
  const totals = paymentTotals();
  state.dashboard = {
    ...(state.dashboard || {}),
    availableCars: state.vehicles.length,
    activeRentals,
    overdueReturns: state.bookings.filter((booking) => booking.status === "Overdue").length,
    revenueToday: totals.paid,
    utilization: state.bookings.length ? Math.round((activeRentals / state.bookings.length) * 100) : 0
  };
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  const activeNavView = viewId === "add-vehicle" ? "fleet" : viewId;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === activeNavView);
  });

  document.querySelector("#page-title").textContent = pageTitles[viewId];
}

function showAuth() {
  sessionUser = null;
  authScreen.classList.remove("hidden");
  appShell.classList.add("locked");
  authMessage.textContent = "";
}

function showAppForUser(user) {
  sessionUser = user;

  authScreen.classList.add("hidden");
  appShell.classList.remove("locked");
  document.querySelector("#profile-name").textContent = user.name;
  document.querySelector("#profile-role").textContent = user.role;
  document.querySelector("#user-avatar").textContent = user.name.charAt(0);
  document.querySelector("#export-button").style.display = "";
  document.querySelector("#new-booking-button").style.display = "";

  document.querySelector("#role-caption").textContent = "Gem operations management";
  document.querySelector("#side-summary-title").textContent = "12 pickups";
  document.querySelector("#side-summary-copy").textContent = "6 returns due before 6 PM";

  switchView("dashboard");
}

function showForgotForm(show) {
  document.querySelector("#login-form").classList.toggle("active", !show);
  document.querySelector("#forgot-form").classList.toggle("active", show);
  document.querySelector("#auth-title").textContent = show ? "Recover access" : "Welcome back";
  authMessage.textContent = "";
}


function updateDashboard() {
  if (!state.dashboard) return;
  recalculateDashboard();

  const metricCards = document.querySelectorAll("#dashboard .metric-card");
  const metrics = [
    ["Available cars", state.dashboard.availableCars, "Registered vehicles"],
    ["Active rentals", state.dashboard.activeRentals, "Bookings not overdue"],
    ["Overdue returns", state.dashboard.overdueReturns, "Requires follow-up"],
    ["Revenue today", money(state.dashboard.revenueToday), "Confirmed paid revenue"]
  ];

  metricCards.forEach((card, index) => {
    if (!metrics[index]) return;
    const [label, value, helper] = metrics[index];
    card.querySelector("p").textContent = label;
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = helper;
  });
}

function parseBookingReturnDate(returnDate) {
  const parsed = new Date(`${returnDate} ${new Date().getFullYear()}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isCloseToReturnDate(booking) {
  if (booking.status === "Pending payment") return true;

  const returnDate = parseBookingReturnDate(booking.returnDate);
  if (!returnDate) return false;

  const now = new Date();
  const daysUntilReturn = (returnDate - now) / 86400000;
  return daysUntilReturn >= 0 && daysUntilReturn <= 2;
}

function renderDashboardAlerts() {
  if (!dashboardAlertList) return;

  const overdueStatuses = new Set(["Due", "Overdue", "Outstanding"]);
  const overduePaymentAlerts = state.payments
    .filter((payment) => overdueStatuses.has(payment.status))
    .map((payment) => ({
      type: "Overdue payment",
      customer: payment.customer,
      bookingId: payment.bookingId,
      detail: `${payment.bookingId} - ${money(payment.amount)} ${payment.status.toLowerCase()}`,
      danger: true
    }));

  const closeReturnAlerts = state.bookings
    .filter(isCloseToReturnDate)
    .filter((booking) => {
      const payment = state.payments.find((item) => item.bookingId === booking.id);
      return !payment || payment.status !== "Paid";
    })
    .map((booking) => ({
      type: "Close to return date payment",
      customer: booking.customer,
      bookingId: booking.id,
      detail: `${booking.id} - ${booking.vehicle} returns ${booking.returnDate}`,
      danger: false
    }));

  const alerts = [...overduePaymentAlerts, ...closeReturnAlerts];

  dashboardAlertList.innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
            <button class="alert-item ${alert.danger ? "danger" : ""}" data-alert-booking="${alert.bookingId}">
              <strong>${alert.type}: ${alert.customer}</strong>
              <span>${alert.detail}</span>
            </button>
          `
        )
        .join("")
    : `<div class="alert-item"><strong>No payment alerts</strong><span>No overdue or close-to-return payment items.</span></div>`;
}

function renderVehicles(filteredVehicles) {
  const vehiclesToRender =
    filteredVehicles ||
    (activeFleetFilter === "all"
      ? state.vehicles
      : state.vehicles.filter((vehicle) => vehicle.status === activeFleetFilter));

  vehicleGrid.innerHTML = vehiclesToRender
    .map(
      (vehicle) => `
        <article class="vehicle-card">
          <div class="vehicle-image ${vehicle.image ? "has-photo" : ""}" style="--vehicle-color: ${vehicle.color}; ${vehicle.image ? `background-image: url('${vehicle.image}');` : ""}">
            <span class="plate">${vehicle.plate}</span>
          </div>
          <div class="vehicle-body">
            <h4>${vehicle.model}</h4>
            <span>${vehicle.className} - ${vehicle.branch}</span>
            <div class="vehicle-meta">
              <b>${vehicle.status}</b>
              <b>${vehicle.mileage}</b>
              <b>₵${vehicle.dailyRate}/day</b>
            </div>
            <div class="vehicle-actions">
              <button class="secondary-button" data-view-vehicle="${vehicle.id}">👁 View</button>
              <button class="secondary-button danger-button" data-delete-vehicle="${vehicle.id}">🗑 Delete</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (!vehiclesToRender.length) {
    vehicleGrid.innerHTML = `<div class="search-empty">No matching vehicles found.</div>`;
  }
}

function showVehicleDetails(vehicle) {
  if (!vehicleDetailModal || !vehicleDetailContent) return;

  vehicleDetailModal.querySelector("#vehicle-detail-title").textContent = vehicle.model;
  if (vehicleDetailDeleteButton) {
    vehicleDetailDeleteButton.dataset.vehicleId = vehicle.id;
  }

  // Generate a random stable-ish coord based on vehicle ID hash
  const hash = (vehicle.id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lat = (5.6037 + (hash % 100) * 0.0001).toFixed(4);
  const lon = (-0.1870 - (hash % 80) * 0.0001).toFixed(4);

  vehicleDetailContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-tile">
        <strong>Plate</strong>
        <span>${vehicle.plate}</span>
      </div>
      <div class="detail-tile">
        <strong>Type</strong>
        <span>${vehicle.className}</span>
      </div>
      <div class="detail-tile">
        <strong>Status</strong>
        <span>${vehicle.status}</span>
      </div>
      <div class="detail-tile">
        <strong>Branch</strong>
        <span>${vehicle.branch}</span>
      </div>
      <div class="detail-tile">
        <strong>Mileage</strong>
        <span>${vehicle.mileage}</span>
      </div>
      <div class="detail-tile">
        <strong>Rate</strong>
        <span>₵${vehicle.dailyRate}/day</span>
      </div>
      <div class="detail-tile full-width vehicle-gps-tracker">
        <strong>Real-time GPS Tracking</strong>
        <div class="mock-gps-map">
          <div class="map-lines"></div>
          <div class="gps-radar"></div>
          <div class="gps-pin">📍</div>
          <div class="gps-label">${vehicle.model} - GPS Active (${vehicle.branch})</div>
          <div class="gps-coords">Lat: ${lat}° N, Lon: ${lon}° W (Accra Grid)</div>
        </div>
      </div>
      <div class="detail-tile full-width">
        <strong>Photo</strong>
        <div class="vehicle-detail-image ${vehicle.image ? "has-photo" : ""}" style="--vehicle-color: ${vehicle.color || "#f97316"}; ${vehicle.image ? `background-image: url('${vehicle.image}');` : ""}"></div>
      </div>
    </div>
  `;

  vehicleDetailModal.showModal();
}

async function deleteVehicle(vehicleId) {
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    showToast("Vehicle not found.");
    return;
  }

  if (!window.confirm(`Delete ${vehicle.model}? This removes it permanently.`)) {
    return;
  }

  try {
    await api(`/api/vehicles/${vehicleId}`, { method: "DELETE" });
  } catch (error) {
    // If API delete is not available, still remove from local state.
  }

  state.vehicles = state.vehicles.filter((item) => item.id !== vehicleId);
  if (vehicleDetailModal && vehicleDetailModal.open) {
    vehicleDetailModal.close();
  }
  if (state.dashboard) {
    recalculateDashboard();
    updateDashboard();
  }
  renderVehicles();
  renderTracking(trackingSearch?.value || "");
  showToast(`${vehicle.model} removed from vehicles.`);
}



function renderBookings(filteredBookings) {
  const bookingsToRender = filteredBookings || state.bookings;

  bookingTable.innerHTML = bookingsToRender
    .map(
      (booking) => `
        <tr>
          <td><strong>${booking.id}</strong></td>
          <td>${booking.customer}</td>
          <td>${booking.vehicle}</td>
          <td>${booking.pickup}</td>
          <td>${booking.returnDate}</td>
          <td><b class="status ${statusClass[booking.status]}">${booking.status}</b></td>
          <td><strong>${money(booking.total)}</strong></td>
          <td>
            <div class="table-actions">
              <button class="icon-button small-icon" type="button" data-view-booking="${booking.id}" aria-label="View ${booking.customer} booking details">&#128065;</button>
              <button class="icon-button small-icon danger-icon" type="button" data-delete-booking="${booking.id}" aria-label="Delete ${booking.customer} booking details">&#128465;</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  if (!bookingsToRender.length) {
    bookingTable.innerHTML = `<tr><td colspan="8" class="search-empty">No matching bookings found.</td></tr>`;
  }
}

function findCustomerForBooking(booking) {
  return state.customers.find((customer) => customer.name === booking.customer);
}

function showBookingDetails(booking) {
  if (!bookingDetailModal || !bookingDetailContent) return;

  const customer = findCustomerForBooking(booking);
  const paymentSummary = bookingPaymentSummary(booking);
  bookingDetailModal.querySelector("#booking-detail-title").textContent = `${booking.id} - ${booking.customer}`;
  if (bookingDetailDeleteButton) {
    bookingDetailDeleteButton.dataset.bookingId = booking.id;
  }

  bookingDetailContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-tile">
        <strong>Customer</strong>
        <span>${booking.customer}</span>
      </div>
      <div class="detail-tile">
        <strong>Phone</strong>
        <span>${customer?.phone || "Not recorded"}</span>
      </div>
      <div class="detail-tile">
        <strong>Email</strong>
        <span>${customer?.email || "Not recorded"}</span>
      </div>
      <div class="detail-tile">
        <strong>Driver license</strong>
        <span>${customer?.license || "Not recorded"}</span>
      </div>
      <div class="detail-tile">
        <strong>Vehicle</strong>
        <span>${booking.vehicle}</span>
      </div>
      <div class="detail-tile">
        <strong>Status</strong>
        <span>${booking.status}</span>
      </div>
      <div class="detail-tile">
        <strong>Pickup</strong>
        <span>${booking.pickup}</span>
      </div>
      <div class="detail-tile">
        <strong>Return</strong>
        <span>${booking.returnDate}</span>
      </div>
      <div class="detail-tile">
        <strong>Total</strong>
        <span>${money(booking.total)}</span>
      </div>
      <div class="detail-tile">
        <strong>Amount received</strong>
        <span>${money(paymentSummary.received)}</span>
      </div>
      <div class="detail-tile">
        <strong>Outstanding</strong>
        <span>${money(paymentSummary.outstanding)}</span>
      </div>
      <div class="detail-tile">
        <strong>Change</strong>
        <span>${money(paymentSummary.change)}</span>
      </div>
      <div class="detail-tile full-width">
        <strong>Notes</strong>
        <span>${booking.notes || customer?.riskNotes || "No notes recorded"}</span>
      </div>
    </div>
  `;

  bookingDetailModal.showModal();
}

async function deleteBooking(bookingId) {
  const booking = state.bookings.find((item) => item.id === bookingId);
  if (!booking) {
    showToast("Booking not found.");
    return;
  }

  if (!window.confirm(`Delete booking ${booking.id} for ${booking.customer}?`)) {
    return;
  }

  try {
    await api(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "DELETE" });
  } catch (error) {
    // If the local server is unavailable, still keep the screen in sync.
  }

  state.bookings = state.bookings.filter((item) => item.id !== bookingId);
  state.payments = state.payments.filter((payment) => payment.bookingId !== bookingId);
  if (bookingDetailModal && bookingDetailModal.open) {
    bookingDetailModal.close();
  }
  recalculateDashboard();
  renderBookings();
  renderPayments();
  updateDashboard();
  renderDashboardAlerts();
  showToast(`${booking.id} deleted.`);
}



function renderCustomers(filteredCustomers) {
  return filteredCustomers;
/*
  if (!customersToRender.length) {
    customerList.innerHTML = `<div class="search-empty">No matching customers found.</div>`;
    customerDetail.innerHTML = "";
    return;
  }

  const customer = customersToRender.find((item) => item.id === selectedCustomerId);
  if (!customer) {
    customerDetail.innerHTML = "";
    return;
  }

  customerDetail.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="eyebrow">Profile</p>
        <h3>${customer.name}</h3>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="secondary-button" id="copy-customer-details-button" data-customer-id="${customer.id}" style="padding: 6px 10px; font-size: 11px;">📋 Copy</button>
        <b class="status confirmed">${customer.status}</b>
      </div>
    </div>
    <span>${customer.email}</span>
    <span>${customer.phone}</span>
    <div class="detail-grid">
      <div class="detail-tile">
        <strong>Driver license</strong>
        <span>${customer.license}</span>
      </div>
      <div class="detail-tile">
        <strong>Total rentals</strong>
        <span>${customer.rentals}</span>
      </div>
      <div class="detail-tile">
        <strong>Lifetime spend</strong>
        <span>${money(customer.spend)}</span>
      </div>
      <div class="detail-tile">
        <strong>Risk notes</strong>
        <span>${customer.riskNotes}</span>
      </div>
    </div>
  `;
}



*/
}
function trackingPosition(vehicle) {
  const hash = (vehicle.id || vehicle.plate || vehicle.model || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lat = (5.6037 + (hash % 100) * 0.0001).toFixed(4);
  const lon = (-0.1870 - (hash % 80) * 0.0001).toFixed(4);
  const zones = ["Ringway", "Airport City", "Osu", "East Legon", "Cantonments", "North Ridge"];

  return {
    lat,
    lon,
    zone: zones[hash % zones.length],
    accuracy: 8 + (hash % 18)
  };
}

function showTrackingDetail(vehicle) {
  if (!trackingDetail) return;

  const position = trackingPosition(vehicle);
  selectedTrackingVehicleId = vehicle.id;

  trackingDetail.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="eyebrow">Live vehicle location</p>
        <h3>${vehicle.model}</h3>
      </div>
      <b class="status ${vehicle.status === "maintenance" ? "inspection" : vehicle.status === "rented" ? "pending" : "confirmed"}">${vehicle.status}</b>
    </div>
    <div class="mock-gps-map tracking-map">
      <div class="map-lines"></div>
      <div class="gps-radar"></div>
      <div class="gps-pin">&#128205;</div>
      <div class="gps-label">${vehicle.model} - ${position.zone}</div>
      <div class="gps-coords">Lat: ${position.lat} N, Lon: ${position.lon} W</div>
    </div>
    <div class="detail-grid">
      <div class="detail-tile">
        <strong>Plate number</strong>
        <span>${vehicle.plate}</span>
      </div>
      <div class="detail-tile">
        <strong>Branch</strong>
        <span>${vehicle.branch}</span>
      </div>
      <div class="detail-tile">
        <strong>Vehicle class</strong>
        <span>${vehicle.className}</span>
      </div>
      <div class="detail-tile">
        <strong>GPS accuracy</strong>
        <span>${position.accuracy} meters</span>
      </div>
      <div class="detail-tile full-width">
        <strong>Last known area</strong>
        <span>${position.zone}, Accra operating grid</span>
      </div>
    </div>
  `;
}

function renderTracking(term = "") {
  if (!trackingResults || !trackingDetail) return;

  const normalizedTerm = term.trim().toLowerCase();
  const vehiclesToRender = normalizedTerm
    ? state.vehicles.filter((vehicle) =>
        `${vehicle.model} ${vehicle.plate}`.toLowerCase().includes(normalizedTerm)
      )
    : state.vehicles;

  if (!vehiclesToRender.length) {
    trackingResults.innerHTML = `<div class="search-empty">No vehicle found for "${term.trim()}".</div>`;
    trackingDetail.innerHTML = `<div class="search-empty">Search by vehicle brand, model, or plate number.</div>`;
    return;
  }

  if (!selectedTrackingVehicleId || !vehiclesToRender.some((vehicle) => vehicle.id === selectedTrackingVehicleId)) {
    selectedTrackingVehicleId = vehiclesToRender[0].id;
  }

  trackingResults.innerHTML = vehiclesToRender
    .map((vehicle) => {
      const position = trackingPosition(vehicle);
      return `
        <button class="tracking-row ${vehicle.id === selectedTrackingVehicleId ? "active" : ""}" data-track-vehicle="${vehicle.id}">
          <span class="avatar">${vehicle.model.charAt(0)}</span>
          <span>
            <strong>${vehicle.model}</strong>
            <span>${vehicle.plate} - ${position.zone}</span>
          </span>
        </button>
      `;
    })
    .join("");

  const selectedVehicle = state.vehicles.find((vehicle) => vehicle.id === selectedTrackingVehicleId);
  if (selectedVehicle) {
    showTrackingDetail(selectedVehicle);
  }
}

function vehiclePayloadFromForm() {
  return {
    className: document.querySelector("#vehicle-type").value,
    model: document.querySelector("#vehicle-name").value.trim(),
    plate: document.querySelector("#vehicle-plate").value.trim().toUpperCase(),
    branch: document.querySelector("#vehicle-branch").value.trim(),
    mileage: document.querySelector("#vehicle-mileage").value.trim(),
    dailyRate: Number(document.querySelector("#vehicle-rate").value),
    status: document.querySelector("#vehicle-status").value,
    image: document.querySelector("#vehicle-image").value.trim()
  };
}

function vehicleCardMarkup(vehicle) {
  return `
    <article class="vehicle-card">
      <div class="vehicle-image ${vehicle.image ? "has-photo" : ""}" style="--vehicle-color: ${vehicle.color || "#f97316"}; ${vehicle.image ? `background-image: url('${vehicle.image}');` : ""}">
        <span class="plate">${vehicle.plate || "PLATE"}</span>
      </div>
      <div class="vehicle-body">
        <h4>${vehicle.model || "Vehicle name"}</h4>
        <span>${vehicle.className || "Vehicle type"} - ${vehicle.branch || "Branch"}</span>
        <div class="vehicle-meta">
          <b>${vehicle.status || "available"}</b>
          <b>${vehicle.mileage || "Mileage"}</b>
          <b>₵${vehicle.dailyRate || 0}/day</b>
        </div>
      </div>
    </article>
  `;
}

function renderVehiclePreview() {
  const vehicle = {
    className: document.querySelector("#vehicle-type").value,
    model: document.querySelector("#vehicle-name").value,
    plate: document.querySelector("#vehicle-plate").value,
    branch: document.querySelector("#vehicle-branch").value,
    mileage: document.querySelector("#vehicle-mileage").value,
    dailyRate: Number(document.querySelector("#vehicle-rate").value),
    status: document.querySelector("#vehicle-status").value,
    image: document.querySelector("#vehicle-image").value
  };

  vehiclePreview.innerHTML = vehicleCardMarkup(vehicle);
}

function renderPayments() {
  const totals = paymentTotals();
  const paymentMetricCards = document.querySelectorAll("#payments .metric-card");
  const metrics = [
    ["Paid invoices", money(totals.paid), "Confirmed payments"],
    ["Outstanding", money(totals.outstanding), `${state.bookings.filter((booking) => bookingPaymentSummary(booking).outstanding > 0).length} open balances`],
    ["Deposits held", money(totals.held), "Refundable deposits"]
  ];

  paymentMetricCards.forEach((card, index) => {
    if (!metrics[index]) return;
    const [label, value, helper] = metrics[index];
    card.querySelector("p").textContent = label;
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = helper;
  });

  paymentList.innerHTML = state.bookings
    .map(
      (booking) => {
        const summary = bookingPaymentSummary(booking);
        const status = summary.outstanding > 0 ? "Outstanding" : summary.held > 0 ? "Held" : "Paid";
        const method = paymentsForBooking(booking.id).map((payment) => payment.method).filter(Boolean).join(", ") || "No payment recorded";
        return `
        <div class="payment-row">
          <div>
            <strong>${booking.id} - ${booking.customer}</strong>
            <span>Total ${money(summary.total)} - Paid ${money(summary.paid)} - Held ${money(summary.held)} - Due ${money(summary.outstanding)} - Change ${money(summary.change)} (${method})</span>
          </div>
          <strong class="payment-amount">${money(summary.received)}</strong>
          <b class="status ${statusClass[status]}">${status}</b>
        </div>
      `;
      }
    )
    .join("");
}

function renderAll() {
  updateDashboard();
  renderDashboardAlerts();
  renderVehicles();
  renderBookings();
  renderTracking();
  renderPayments();
}

async function loadData() {
  try {
    const data = await api("/api/bootstrap");
    state = data;
    renderAll();
    showToast("System ready");
  } catch (error) {
    showToast("Service unavailable");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function resetCustomerModal() {
  document.querySelector("#customer-name").value = "";
  document.querySelector("#customer-email").value = "";
  document.querySelector("#customer-phone").value = "";
  document.querySelector("#customer-license").value = "";
  document.querySelector("#customer-password").value = "";
  document.querySelector("#customer-status").value = "Verified";
  document.querySelector("#customer-notes").value = "";
  document.querySelector("#customer-photo-input").value = "";
  customerPhotoDataUrl = "";
}

function resetBookingModal() {
  document.querySelector("#booking-customer").value = "";
  
  const vehicleSelect = document.querySelector("#booking-vehicle");
  if (vehicleSelect) {
    vehicleSelect.innerHTML = `<option value="" selected disabled>Select vehicle</option>` +
      state.vehicles.map((v) => `<option value="${v.id}">${v.model} (${v.plate})</option>`).join("");
  }

  document.querySelector("#booking-pickup").value = "";
  document.querySelector("#booking-return").value = "";
  document.querySelector("#booking-rate").value = "";
  document.querySelector("#booking-deposit").value = "";
  document.querySelector("#booking-notes").value = "";
  
  const defaultRadio = document.querySelector("input[name='booking-payment-method'][value='Mobile money']");
  if (defaultRadio) {
    defaultRadio.checked = true;
  }

  updateBookingEstimate();
}

function bookingPayloadFromModal() {
  const customer = document.querySelector("#booking-customer").value.trim();
  const vehicleId = document.querySelector("#booking-vehicle").value;
  const pickupDate = document.querySelector("#booking-pickup").value;
  const returnDate = document.querySelector("#booking-return").value;
  const dailyRate = Number(document.querySelector("#booking-rate").value);
  const deposit = Number(document.querySelector("#booking-deposit").value);
  const notes = document.querySelector("#booking-notes").value.trim();

  const paymentMethodEl = document.querySelector("input[name='booking-payment-method']:checked");
  const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "Mobile money";

  const vehicle = state.vehicles.find((v) => v.id === vehicleId);
  const vehicleModel = vehicle ? vehicle.model : "Unknown Vehicle";
  const vehicleClass = vehicle ? vehicle.className : "";
  const start = new Date(`${pickupDate}T09:00:00`);
  const end = new Date(`${returnDate}T17:00:00`);
  const diffDays = Math.max(1, Math.ceil((end - start) / 86400000));
  const total = diffDays * dailyRate;
  const changeAmount = Math.max(0, deposit - total);
  const arrearsAmount = Math.max(0, total - deposit);

  return {
    customer,
    vehicleId,
    vehicleModel,
    vehicleClass,
    pickupDate,
    returnDate,
    dailyRate,
    deposit,
    changeAmount,
    arrearsAmount,
    notes,
    paymentMethod
  };
}



function customerPayloadFromModal() {
  return {
    name: document.querySelector("#customer-name").value.trim(),
    email: document.querySelector("#customer-email").value.trim(),
    phone: document.querySelector("#customer-phone").value.trim(),
    license: document.querySelector("#customer-license").value.trim(),
    password: document.querySelector("#customer-password").value,
    status: document.querySelector("#customer-status").value,
    notes: document.querySelector("#customer-notes").value.trim(),
    photo: customerPhotoDataUrl || undefined
  };
}

function resetCustomerModal() {
  document.querySelector("#customer-name").value = "";
  document.querySelector("#customer-email").value = "";
  document.querySelector("#customer-phone").value = "";
  document.querySelector("#customer-license").value = "";
  document.querySelector("#customer-password").value = "";
  document.querySelector("#customer-status").value = "Verified";
  document.querySelector("#customer-notes").value = "";
}

document.querySelectorAll(".nav-item, [data-view-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetView = button.dataset.view || button.dataset.viewJump;
    switchView(targetView);
    if (targetView === "bookings") {
      renderBookings();
    }
    if (targetView === "fleet") {
      renderVehicles();
    }
    if (targetView === "tracking") {
      renderTracking(trackingSearch?.value || "");
    }
  });
});

document.querySelectorAll("[data-dashboard-card]").forEach((card) => {
  const openTarget = () => {
    if (card.dataset.dashboardCard === "fleet") {
      activeFleetFilter = "all";
      document.querySelectorAll("[data-fleet-filter]").forEach((segment) => {
        segment.classList.toggle("active", segment.dataset.fleetFilter === "all");
      });
      switchView("fleet");
      renderVehicles();
      return;
    }

    switchView("bookings");
    if (card.dataset.dashboardCard === "bookings-overdue") {
      renderBookings(state.bookings.filter((booking) => booking.status === "Overdue"));
      return;
    }
    renderBookings(state.bookings.filter((booking) => booking.status !== "Overdue"));
  };

  card.addEventListener("click", openTarget);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTarget();
    }
  });
});



document.querySelector("#forgot-password-button").addEventListener("click", () => showForgotForm(true));
document.querySelector("#back-to-login-button").addEventListener("click", () => showForgotForm(false));

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "Checking account...";

  try {
    const result = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        role: loginRole,
        email: document.querySelector("#login-email").value.trim(),
        password: document.querySelector("#login-password").value
      })
    });

    if (result.user.role === "admin") {
      window.localStorage.setItem("gem-car-rental-session", JSON.stringify(result.user));
      showAppForUser(result.user);
      return;
    }

    authMessage.textContent = "Only admin dashboard access is enabled.";
  } catch (error) {
    authMessage.textContent = "Invalid login details for that role.";
  }
});

document.querySelector("#forgot-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "Sending recovery code...";

  try {
    const result = await api("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        role: loginRole,
        email: document.querySelector("#forgot-email").value.trim()
      })
    });

    authMessage.textContent = result.message;
  } catch (error) {
    authMessage.textContent = "No account found for that role and email.";
  }
});

document.querySelector("#logout-button").addEventListener("click", () => {
  window.localStorage.removeItem("gem-car-rental-session");
  showAuth();
});



document.querySelectorAll("#add-vehicle-form input, #add-vehicle-form select").forEach((field) => {
  field.addEventListener("input", renderVehiclePreview);
  field.addEventListener("change", renderVehiclePreview);
});

document.querySelector("#add-vehicle-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const created = await api("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(vehiclePayloadFromForm())
    });

    state.vehicles.unshift(created);
    if (state.dashboard) {
      recalculateDashboard();
    }
    renderVehicles();
    renderTracking(trackingSearch?.value || "");
    updateDashboard();
    event.target.reset();
    renderVehiclePreview();
    switchView("fleet");
    showToast("Vehicle added");
  } catch (error) {
    showToast("Could not save vehicle");
  }
});

document.querySelectorAll("[data-open-booking], #new-booking-button").forEach((button) => {
  button.addEventListener("click", () => {
    resetBookingModal();
    modal.showModal();
  });
});

document.querySelector("#vehicle-detail-delete").addEventListener("click", async () => {
  if (!vehicleDetailDeleteButton) return;
  const vehicleId = vehicleDetailDeleteButton.dataset.vehicleId;
  await deleteVehicle(vehicleId);
});

document.querySelector("#booking-detail-delete").addEventListener("click", async () => {
  if (!bookingDetailDeleteButton) return;
  const bookingId = bookingDetailDeleteButton.dataset.bookingId;
  await deleteBooking(bookingId);
});

document.querySelector("#export-button").addEventListener("click", async () => {
  const result = await api("/api/export", { method: "POST" });
  showToast(`Export ready: ${result.fileName}`);
});

document.querySelectorAll("[data-fleet-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFleetFilter = button.dataset.fleetFilter;
    document.querySelectorAll("[data-fleet-filter]").forEach((segment) => {
      segment.classList.toggle("active", segment === button);
    });
    renderVehicles();
  });
});



vehicleGrid.addEventListener("click", async (event) => {
  const viewButton = event.target.closest("[data-view-vehicle]");
  if (viewButton) {
    const vehicleId = viewButton.dataset.viewVehicle;
    const vehicle = state.vehicles.find((item) => item.id === vehicleId);
    if (vehicle) {
      showVehicleDetails(vehicle);
    }
    return;
  }

  const deleteButton = event.target.closest("[data-delete-vehicle]");
  if (deleteButton) {
    const vehicleId = deleteButton.dataset.deleteVehicle;
    await deleteVehicle(vehicleId);
  }
});

trackingResults.addEventListener("click", (event) => {
  const row = event.target.closest("[data-track-vehicle]");
  if (!row) return;
  const vehicle = state.vehicles.find((item) => item.id === row.dataset.trackVehicle);
  if (!vehicle) return;
  showTrackingDetail(vehicle);
  renderTracking(trackingSearch?.value || "");
});

trackingSearch.addEventListener("input", (event) => {
  renderTracking(event.target.value);
});

dashboardAlertList.addEventListener("click", (event) => {
  const alertRow = event.target.closest("[data-alert-booking]");
  if (!alertRow) return;
  const booking = state.bookings.find((item) => item.id === alertRow.dataset.alertBooking);
  if (!booking) {
    showToast("Booking details not found.");
    return;
  }
  switchView("bookings");
  renderBookings([booking]);
  showBookingDetails(booking);
});

bookingTable.addEventListener("click", async (event) => {
  const viewButton = event.target.closest("[data-view-booking]");
  if (viewButton) {
    const booking = state.bookings.find((item) => item.id === viewButton.dataset.viewBooking);
    if (booking) {
      showBookingDetails(booking);
    }
    return;
  }

  const deleteButton = event.target.closest("[data-delete-booking]");
  if (deleteButton) {
    await deleteBooking(deleteButton.dataset.deleteBooking);
  }
});

document.querySelector("#global-search").addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();

  if (term.length < 2) {
    renderAll();
    return;
  }

  const vehicleMatches = state.vehicles.filter((vehicle) =>
    `${vehicle.model} ${vehicle.plate} ${vehicle.branch} ${vehicle.className} ${vehicle.status}`
      .toLowerCase()
      .includes(term)
  );

  if (vehicleMatches.length) {
    switchView("tracking");
    if (trackingSearch) {
      trackingSearch.value = event.target.value.trim();
    }
    renderTracking(event.target.value.trim());
    return;
  }

  const bookingMatches = state.bookings.filter((booking) =>
    `${booking.id} ${booking.customer} ${booking.vehicle} ${booking.vehicleClass} ${booking.status}`
      .toLowerCase()
      .includes(term)
  );

  if (bookingMatches.length) {
    switchView("bookings");
    renderBookings(bookingMatches);
    return;
  }

  switchView("fleet");
  vehicleGrid.innerHTML = `<div class="search-empty">No results found for "${event.target.value.trim()}".</div>`;
});

modal.addEventListener("close", async () => {
  if (modal.returnValue !== "default") return;

  try {
    const payload = bookingPayloadFromModal();
    const created = await api("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.bookings.unshift(created);

    // Add payment entry if deposit is provided
    if (created.deposit > 0) {
      const isPaid = created.status === "Paid";
      const newPayment = {
        bookingId: created.id,
        customer: created.customer,
        method: payload.paymentMethod,
        amount: created.deposit,
        status: isPaid ? "Paid" : "Held"
      };
      state.payments.unshift(newPayment);
      renderPayments();
    }

    recalculateDashboard();
    renderBookings();
    updateDashboard();
    renderDashboardAlerts();
    showToast("Booking saved");
  } catch (error) {
    showToast("Could not save booking");
  }
});

function updateBookingEstimate() {
  const pickup = document.querySelector("#booking-pickup").value;
  const returnDate = document.querySelector("#booking-return").value;
  const rate = Number(document.querySelector("#booking-rate").value);
  const deposit = Number(document.querySelector("#booking-deposit").value || 0);
  const panel = document.querySelector("#booking-estimate-panel");
  const daysEl = document.querySelector("#booking-est-days");
  const totalEl = document.querySelector("#booking-est-total");
  const balanceLabelEl = document.querySelector("#booking-balance-label");
  const balanceAmountEl = document.querySelector("#booking-balance-amount");

  if (!panel || !daysEl || !totalEl || !balanceLabelEl || !balanceAmountEl) return;

  if (!pickup || !returnDate || isNaN(rate) || rate <= 0) {
    panel.style.display = "none";
    return;
  }

  const start = new Date(`${pickup}T09:00:00`);
  const end = new Date(`${returnDate}T17:00:00`);
  const diffDays = Math.max(1, Math.ceil((end - start) / 86400000));

  if (diffDays >= 0) {
    const total = diffDays * rate;
    const isChange = deposit > total;
    const balanceAmount = isChange ? deposit - total : total - deposit;
    daysEl.textContent = `${diffDays} day${diffDays === 1 ? "" : "s"}`;
    totalEl.textContent = `₵${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    balanceLabelEl.textContent = isChange ? "Change:" : "Arrears:";
    balanceAmountEl.textContent = money(balanceAmount);
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

document.querySelector("#booking-pickup").addEventListener("input", updateBookingEstimate);
document.querySelector("#booking-return").addEventListener("input", updateBookingEstimate);
document.querySelector("#booking-rate").addEventListener("input", updateBookingEstimate);
document.querySelector("#booking-deposit").addEventListener("input", updateBookingEstimate);
document.querySelector("#booking-vehicle").addEventListener("change", (e) => {
  const selectedVehicleId = e.target.value;
  const vehicle = state.vehicles.find((v) => v.id === selectedVehicleId);
  if (vehicle) {
    document.querySelector("#booking-rate").value = vehicle.dailyRate;
    updateBookingEstimate();
  }
});

document.querySelector("#customer-detail")?.addEventListener("click", (event) => {
  const button = event.target.closest("#copy-customer-details-button");
  if (!button) return;
  const customerId = button.dataset.customerId;
  const customer = state.customers.find((c) => c.id === customerId);
  if (!customer) return;

  const text = `Customer Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone || "N/A"}
Driver License: ${customer.license || "N/A"}
Status: ${customer.status}
Total Rentals: ${customer.rentals || 0}
Lifetime Spend: ₵${(customer.spend || 0).toLocaleString()}
Notes: ${customer.riskNotes || "None"}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Customer details copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy details");
  });
});

loadData().then(() => {
  renderVehiclePreview();
  const storedSession = window.localStorage.getItem("gem-car-rental-session");

  if (storedSession) {
    const user = JSON.parse(storedSession);
    if (user.role === "admin") {
      showAppForUser(user);
      return;
    }
  }
});
