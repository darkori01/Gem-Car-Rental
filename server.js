const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4174);
const PUBLIC_DIR = __dirname;

const vehicles = [];
const bookings = [];
const customers = [];
const payments = [];



const users = [
  {
    id: "u-admin",
    role: "admin",
    name: "Gem Manager",
    email: "admin@gemcarrental.com",
    password: "GemAdmin2026!"
  }
];

function paymentsForBooking(bookingId) {
  return payments.filter((payment) => payment.bookingId === bookingId);
}

function bookingPaymentSummary(booking) {
  const bookingPayments = paymentsForBooking(booking.id);
  const received = bookingPayments
    .filter((payment) => payment.status === "Paid" || payment.status === "Held")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const held = bookingPayments
    .filter((payment) => payment.status === "Held")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const postedOutstanding = bookingPayments
    .filter((payment) => payment.status === "Outstanding" || payment.status === "Due")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const total = Number(booking.total || 0);
  const calculatedOutstanding = Math.max(0, total - received);
  const grossPaid = Math.max(0, received - held);

  return {
    paid: Math.min(total, grossPaid),
    held,
    received,
    outstanding: Math.max(calculatedOutstanding, postedOutstanding),
    change: Math.max(0, received - total),
    total
  };
}

function dashboard() {
  const activeRentals = bookings.filter((booking) => booking.status !== "Overdue").length;
  const revenueToday = bookings.reduce((sum, booking) => sum + bookingPaymentSummary(booking).paid, 0);
  return {
    availableCars: vehicles.length,
    activeRentals,
    overdueReturns: bookings.filter((booking) => booking.status === "Overdue").length,
    revenueToday,
    utilization: bookings.length ? Math.round((activeRentals / bookings.length) * 100) : 0
  };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function formatDate(dateString, time) {
  const date = new Date(`${dateString}T${time}`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function bookingTotal(pickupDate, returnDate, dailyRate) {
  const start = new Date(`${pickupDate}T09:00:00`);
  const end = new Date(`${returnDate}T17:00:00`);
  const days = Math.max(1, Math.ceil((end - start) / 86400000));
  return days * Number(dailyRate);
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "Gem Car Rental API" });
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const payload = await readJson(req);
    const user = users.find(
      (item) =>
        item.role === payload.role &&
        item.email.toLowerCase() === String(payload.email || "").toLowerCase() &&
        item.password === payload.password
    );

    if (!user) {
      return sendJson(res, 401, { message: "Invalid login details." });
    }

    return sendJson(res, 200, {
      token: `gem-session-${user.role}`,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
    const payload = await readJson(req);
    const user = users.find(
      (item) =>
        item.role === payload.role &&
        item.email.toLowerCase() === String(payload.email || "").toLowerCase()
    );

    if (!user) {
      return sendJson(res, 404, { message: "No account found for that role and email." });
    }

    return sendJson(res, 200, {
      message: "Password recovery instructions have been sent to the registered email address."
    });
  }

  if (req.method === "GET" && pathname === "/api/bootstrap") {
    return sendJson(res, 200, {
      dashboard: dashboard(),
      vehicles,
      bookings,
      customers,
      payments
    });
  }

  if (req.method === "GET" && pathname === "/api/vehicles") {
    return sendJson(res, 200, vehicles);
  }

  if (req.method === "POST" && pathname === "/api/vehicles") {
    const payload = await readJson(req);
    if (!payload.model || !payload.plate || !payload.className) {
      return sendJson(res, 400, { message: "Vehicle name, plate number, and type are required." });
    }

    const created = {
      id: `v${Date.now()}`,
      model: payload.model,
      plate: payload.plate,
      className: payload.className,
      status: payload.status || "available",
      mileage: payload.mileage || "0 mi",
      branch: payload.branch || "Main branch",
      dailyRate: Number(payload.dailyRate || 0),
      color: "#f97316",
      image: payload.image || ""
    };

    vehicles.unshift(created);
    return sendJson(res, 201, created);
  }

  if (req.method === "GET" && pathname === "/api/bookings") {
    return sendJson(res, 200, bookings);
  }

  if (req.method === "POST" && pathname === "/api/bookings") {
    const payload = await readJson(req);
    if (!payload.customer || !payload.pickupDate || !payload.returnDate) {
      return sendJson(res, 400, { message: "Customer, pickup date, and return date are required." });
    }

    const total = bookingTotal(payload.pickupDate, payload.returnDate, payload.dailyRate);
    const deposit = Number(payload.deposit || 0);
    const isPaid = deposit >= total;
    const changeAmount = Math.max(0, deposit - total);
    const arrearsAmount = Math.max(0, total - deposit);

    const created = {
      id: `BK-${String(bookings.length + 1).padStart(4, "0")}`,
      customer: payload.customer,
      vehicle: payload.vehicleModel || `${payload.vehicleClass} assignment`,
      vehicleClass: payload.vehicleClass,
      pickup: formatDate(payload.pickupDate, "09:00:00"),
      returnDate: formatDate(payload.returnDate, "17:00:00"),
      status: isPaid ? "Paid" : "Pending payment",
      total: total,
      deposit,
      changeAmount,
      arrearsAmount,
      notes: payload.notes || ""
    };

    bookings.unshift(created);

    if (created.deposit > 0) {
      payments.unshift({
        bookingId: created.id,
        customer: created.customer,
        method: payload.paymentMethod || "Mobile money",
        amount: created.deposit,
        status: isPaid ? "Paid" : "Held"
      });
    }

    return sendJson(res, 201, created);
  }

  const bookingDeleteMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/);
  if (req.method === "DELETE" && bookingDeleteMatch) {
    const bookingId = decodeURIComponent(bookingDeleteMatch[1]);
    const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);
    if (bookingIndex === -1) {
      return sendJson(res, 404, { message: "Booking not found." });
    }

    const [removed] = bookings.splice(bookingIndex, 1);
    for (let index = payments.length - 1; index >= 0; index -= 1) {
      if (payments[index].bookingId === bookingId) {
        payments.splice(index, 1);
      }
    }
    return sendJson(res, 200, removed);
  }



  if (req.method === "GET" && pathname === "/api/customers") {
    return sendJson(res, 200, customers);
  }

  if (req.method === "POST" && pathname === "/api/customers") {
    const payload = await readJson(req);
    if (!payload.name || !payload.email || !payload.password) {
      return sendJson(res, 400, { message: "Customer name, email, and password are required." });
    }

    if (users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
      return sendJson(res, 409, { message: "A customer with that email already exists." });
    }

    const created = {
      id: `c${Date.now()}`,
      name: payload.name,
      phone: payload.phone || "",
      email: payload.email,
      license: payload.license || "",
      rentals: 0,
      spend: 0,
      status: payload.status || "New",
      riskNotes: payload.notes || "Created by admin",
      photo: payload.photo || ""
    };

    customers.unshift(created);
    return sendJson(res, 201, created);
  }

  if (req.method === "GET" && pathname === "/api/payments") {
    return sendJson(res, 200, payments);
  }



  if (req.method === "POST" && pathname === "/api/export") {
    return sendJson(res, 200, {
      fileName: `gem-car-rental-export-${new Date().toISOString().slice(0, 10)}.csv`,
      rows: vehicles.length + bookings.length + customers.length
    });
  }

  return sendJson(res, 404, { message: "API route not found." });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream"
  );
}

function serveStatic(res, pathname) {
  const requested = pathname === "/" ? "index.html" : path.normalize(pathname).replace(/^[/\\]+/, "");
  const filePath = path.resolve(PUBLIC_DIR, requested);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }

    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(contents);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }

    serveStatic(res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { message: "Server error", detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Gem Car Rental running at http://localhost:${PORT}`);
});
