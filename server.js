const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4174);
const PUBLIC_DIR = __dirname;

const vehicles = [
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
];

const bookings = [
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
];

const customers = [
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
];

const payments = [
  { bookingId: "BK-1048", customer: "Sarah Mills", method: "Card", amount: 356, status: "Paid" },
  { bookingId: "BK-1047", customer: "Daniel Cole", method: "Deposit hold", amount: 500, status: "Held" },
  {
    bookingId: "BK-1046",
    customer: "Nova Build Ltd.",
    method: "Bank transfer",
    amount: 610,
    status: "Outstanding"
  },
  { bookingId: "BK-1044", customer: "Maya Johnson", method: "Late fee", amount: 64, status: "Due" }
];



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
      id: `v${vehicles.length + 1}`,
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
      id: `BK-${1049 + bookings.length}`,
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
      id: `c${customers.length + 1}`,
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
