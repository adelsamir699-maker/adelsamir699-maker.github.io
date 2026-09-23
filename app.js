/* ================================================================
   برنامج ميزان - نسخة الويب | صفحة دليل العملاء
   By Adel Samir - واتس: 01002655282
   نسخة تجريبية: البيانات محفوظة في متصفحك (localStorage)
   ================================================================ */

(function () {
  "use strict";

  /* ================== التخزين ================== */
  const LS_CUSTOMERS = "mizan_customers_v1";
  const LS_TXS = "mizan_txs_v1";
  const LS_PRODUCTS = "mizan_products_v1";
  const LS_ACTIVITY = "mizan_activity_v1";
  const LS_SALES = "mizan_sales_v1";
  const LS_TREASURY = "mizan_treasury_v1";
  const LS_SUPPLIERS = "mizan_suppliers_v1";
  const LS_SUP_TXS = "mizan_sup_txs_v1";
  const LS_PURCHASES = "mizan_purchases_v1";
  const LS_ACCOUNTS = "mizan_accounts_v1";
  const LS_JOURNAL = "mizan_journal_v1";
  const LS_USERS = "mizan_users_v1";
  const LS_VOUCHERS = "mizan_vouchers_v1";
  const LS_SETTINGS = "mizan_settings_v1";

  const TAX = { enabled: true, rate: 0.14 };

  /* ================== البيانات التجريبية ================== */
  const seedCustomers = [
    {
      id: 1, code: "CASH", nameAr: "العميل النقدي (كاش)",
      phone: "", secondaryPhone: "", walletPhone: "", address: "", notes: "عميل نقدي محمي بالنظام",
      openingBalance: 0, currentBalance: 0, protected: true
    },
    {
      id: 2, code: "CUST-0001", nameAr: "أحمد محمد السيد",
      phone: "01000112233", secondaryPhone: "", walletPhone: "01009998877",
      address: "جسر السويس - القاهرة", notes: "",
      openingBalance: 2500, currentBalance: 2000, protected: false
    },
    {
      id: 3, code: "CUST-0002", nameAr: "شركة النور للتجارة",
      phone: "01123456789", secondaryPhone: "01011111111", walletPhone: "",
      address: "العباسية - القاهرة", notes: "حساب الشركة",
      openingBalance: 0, currentBalance: 0, protected: false
    },
    {
      id: 4, code: "CUST-0003", nameAr: "مصطفى عبد الله",
      phone: "01234567890", secondaryPhone: "", walletPhone: "",
      address: "مدينة نصر - القاهرة", notes: "",
      openingBalance: 1250.75, currentBalance: 1250.75, protected: false
    }
  ];

  const seedTxs = [
    { id: 1, customerId: 2, date: "2026-08-01", desc: "رصيد افتتاحي (أول المدة)", debit: 2500, credit: 0 },
    { id: 2, customerId: 2, date: "2026-08-25", desc: "تحصيل دفعة نقداً من حساب العميل", debit: 0, credit: 500 },
    { id: 3, customerId: 4, date: "2026-08-01", desc: "رصيد افتتاحي (أول المدة)", debit: 1250.75, credit: 0 }
  ];

  const seedProducts = [
    { id: 1, code: "PRD-001", barcode: "6252025001231", nameAr: "لبن جهينة 1 لتر", nameEn: "Juhayna Milk 1L", category: "ألبان", unit: "عبوة", defaultWarehouse: "المخزن الرئيسي", purchasePrice: 32, weightedAvgCost: 32, salePrice: 37, discountPercent: 0, discountStart: "", discountEnd: "", qty: 120, reorder: 50, isActive: true },
    { id: 2, code: "PRD-002", barcode: "6223002001534", nameAr: "عيش فينو", nameEn: "Fino Bread", category: "مخبوزات", unit: "حبة", defaultWarehouse: "المخزن الرئيسي", purchasePrice: 1.5, weightedAvgCost: 1.5, salePrice: 2, discountPercent: 0, discountStart: "", discountEnd: "", qty: 15, reorder: 40, isActive: true },
    { id: 3, code: "PRD-003", barcode: "6221039717754", nameAr: "زيت عباد الشمس 1.5 لتر", nameEn: "Sunflower Oil 1.5L", category: "زيوت", unit: "عبوة", defaultWarehouse: "المخزن الرئيسي", purchasePrice: 90, weightedAvgCost: 90, salePrice: 100, discountPercent: 5, discountStart: "2026-09-01", discountEnd: "2026-09-30", qty: 8, reorder: 20, isActive: true },
    { id: 4, code: "PRD-004", barcode: "6224001940157", nameAr: "سكر 1 كجم", nameEn: "Sugar 1Kg", category: "سكريات", unit: "كيس", defaultWarehouse: "المخزن الرئيسي", purchasePrice: 42, weightedAvgCost: 42, salePrice: 48, discountPercent: 0, discountStart: "", discountEnd: "", qty: 300, reorder: 60, isActive: true },
    { id: 5, code: "PRD-005", barcode: "6222012000232", nameAr: "شاي العروسة", nameEn: "El Arosa Tea", category: "مشروبات", unit: "علبة", defaultWarehouse: "المخزن الرئيسي", purchasePrice: 85, weightedAvgCost: 85, salePrice: 95, discountPercent: 3, discountStart: "2026-09-10", discountEnd: "2026-09-20", qty: 12, reorder: 25, isActive: true }
  ];

  const CATEGORIES = ["عام", "ألبان", "مخبوزات", "زيوت", "سكريات", "مشروبات", "معلبات", "عصائر", "منظفات"];
  const UNITS = ["حبة", "عبوة", "كيس", "علبة", "كارتون", "طبق", "كيلو", "لتر", "زجاجة"];
  const WAREHOUSES = ["المخزن الرئيسي", "مخزن المنصورة", "مخزن الزقازيق"];

  const seedActivity = [
    { ts: "09:12:44", user: "admin", action: "تسجيل دخول", desc: "دخول مدير النظام" },
    { ts: "09:30:10", user: "admin", action: "فاتورة مبيعات", desc: "فاتورة POS #INV-1001" },
    { ts: "10:05:22", user: "admin", action: "تحصيل مديونية", desc: "دفعة من أحمد محمد السيد 500 ج.م" },
    { ts: "11:40:05", user: "admin", action: "إضافة صنف", desc: "إضافة صنف جديد" },
    { ts: "12:15:48", user: "admin", action: "فاتورة مشتريات", desc: "فاتورة مشتريات #PINV-2001" }
  ];

  const seedTreasury = [
    { id: 1, name: "الصندوق الرئيسي (نقدي)", type: "cash", balance: 25000 },
    { id: 2, name: "البنك الأهلي المصري (1234567890)", type: "bank", balance: 50000 },
    { id: 3, name: "محفظة فودافون كاش (01002655282)", type: "wallet", balance: 10000 }
  ];

  const seedSuppliers = [
    {
      id: 1, code: "SUPP-001", nameAr: "المورد النقدي (كاش)", phone: "", walletPhone: "",
      address: "", notes: "مورد نقدي محمي بالنظام", openingBalance: 0, currentBalance: 0, protected: true
    },
    {
      id: 2, code: "SUPP-0001", nameAr: "شركة جهينة للصناعات الغذائية", phone: "0227654000", walletPhone: "",
      address: "6 أكتوبر - الجيزة", notes: "توريد ألبان ومنتجات ألبان", openingBalance: 0, currentBalance: 0, protected: false
    },
    {
      id: 3, code: "SUPP-0002", nameAr: "مؤسسة الخير للبقالة", phone: "0403311222", walletPhone: "01008887766",
      address: "المنصورة - الدقهلية", notes: "توريد بقالة ومواد غذائية", openingBalance: 0, currentBalance: 0, protected: false
    }
  ];

  const seedSupplierTxs = [];

  const seedPurchases = [];

  const seedAccounts = [
    { id: 1, code: "1", nameAr: "الأصول", type: "asset", parentId: 0, openingBalance: 0, isActive: true },
    { id: 2, code: "1.1", nameAr: "الأصول المتداولة", type: "asset", parentId: 1, openingBalance: 0, isActive: true },
    { id: 3, code: "1.1.1", nameAr: "الصناديق النقدية", type: "asset", parentId: 2, openingBalance: 25000, isActive: true },
    { id: 4, code: "1.1.2", nameAr: "البنوك والحسابات البنكية", type: "asset", parentId: 2, openingBalance: 50000, isActive: true },
    { id: 5, code: "1.1.3", nameAr: "المحافظ الإلكترونية", type: "asset", parentId: 2, openingBalance: 10000, isActive: true },
    { id: 6, code: "1.1.4", nameAr: "المخزون (بضاعة)", type: "asset", parentId: 2, openingBalance: 0, isActive: true },
    { id: 7, code: "1.1.5", nameAr: "مديونيات العملاء", type: "asset", parentId: 2, openingBalance: 0, isActive: true },
    { id: 8, code: "1.3", nameAr: "الأصول الثابتة", type: "asset", parentId: 1, openingBalance: 0, isActive: true },
    { id: 9, code: "1.3.1", nameAr: "المباني والمعدات", type: "asset", parentId: 8, openingBalance: 0, isActive: true },
    { id: 10, code: "2", nameAr: "الالتزامات", type: "liability", parentId: 0, openingBalance: 0, isActive: true },
    { id: 11, code: "2.1", nameAr: "الالتزامات المتداولة", type: "liability", parentId: 10, openingBalance: 0, isActive: true },
    { id: 12, code: "2.1.1", nameAr: "مستحقات الموردين", type: "liability", parentId: 11, openingBalance: 0, isActive: true },
    { id: 13, code: "2.1.2", nameAr: "ضريبة المبيعات المستحقة", type: "liability", parentId: 11, openingBalance: 0, isActive: true },
    { id: 14, code: "3", nameAr: "حقوق الملكية", type: "equity", parentId: 0, openingBalance: 0, isActive: true },
    { id: 15, code: "3.1", nameAr: "رأس المال", type: "equity", parentId: 14, openingBalance: 100000, isActive: true },
    { id: 16, code: "3.2", nameAr: "الأرباح المحتجزة", type: "equity", parentId: 14, openingBalance: 0, isActive: true },
    { id: 17, code: "4", nameAr: "الإيرادات", type: "revenue", parentId: 0, openingBalance: 0, isActive: true },
    { id: 18, code: "4.1", nameAr: "إيرادات المبيعات", type: "revenue", parentId: 17, openingBalance: 0, isActive: true },
    { id: 19, code: "5", nameAr: "المصروفات", type: "expense", parentId: 0, openingBalance: 0, isActive: true },
    { id: 20, code: "5.1", nameAr: "مصروفات عمومية وإدارية", type: "expense", parentId: 19, openingBalance: 0, isActive: true },
    { id: 21, code: "5.2", nameAr: "إيجارات وما شابه", type: "expense", parentId: 19, openingBalance: 0, isActive: true }
  ];

  const seedJournal = [];

  const seedUsers = [
    { id: 1, username: "admin", fullName: "مدير النظام", password: "123456", role: "مدير النظام", branch: "الفرع الرئيسي", isActive: true, lastSeen: "" }
  ];

  const seedVouchers = [];

  const defaultSettings = {
    orgName: "مؤسستي التجارية",
    orgPhone: "",
    orgAddress: "",
    orgVat: "",
    orgNote: "شكراً لتعاملكم معنا - جميع الأسعار شاملة الضريبة",
    taxEnabled: TAX.enabled,
    taxRate: TAX.rate,
    plan: "فردي (مستخدم واحد)",
    planEnd: "",
    planStatus: "تجربة 🧪",
    publishUrl: "https://adelsamir699-maker.github.io/"
  };

  /* ================== الحالة ================== */
  let customers = [];
  let txs = [];
  let products = [];
  let activity = [];
  let sales = [];
  let treasury = [];
  let suppliers = [];
  let supplierTxs = [];
  let purchases = [];
  let accounts = [];
  let journalEntries = [];
  let users = [];
  let vouchers = [];
  let settings = {};
  let editingId = null;

  /* ================== أدوات ================== */
  const $ = (sel) => document.querySelector(sel);

  function normalizeProduct(p) {
    return Object.assign({
      barcode: "",
      nameEn: "",
      category: "عام",
      unit: "حبة",
      defaultWarehouse: "المخزن الرئيسي",
      purchasePrice: 0,
      weightedAvgCost: 0,
      salePrice: 0,
      discountPercent: 0,
      discountStart: "",
      discountEnd: "",
      qty: 0,
      reorder: 50,
      isActive: true
    }, p);
  }

  function loadData() {
    try {
      customers = JSON.parse(localStorage.getItem(LS_CUSTOMERS)) || seedCustomers;
      txs = JSON.parse(localStorage.getItem(LS_TXS)) || seedTxs;
      products = (JSON.parse(localStorage.getItem(LS_PRODUCTS)) || []).map(normalizeProduct);
      activity = JSON.parse(localStorage.getItem(LS_ACTIVITY)) || seedActivity;
      sales = JSON.parse(localStorage.getItem(LS_SALES)) || [];
      treasury = JSON.parse(localStorage.getItem(LS_TREASURY)) || seedTreasury;
      suppliers = JSON.parse(localStorage.getItem(LS_SUPPLIERS)) || seedSuppliers;
      supplierTxs = JSON.parse(localStorage.getItem(LS_SUP_TXS)) || seedSupplierTxs;
      purchases = JSON.parse(localStorage.getItem(LS_PURCHASES)) || seedPurchases;
      accounts = JSON.parse(localStorage.getItem(LS_ACCOUNTS)) || seedAccounts;
      journalEntries = JSON.parse(localStorage.getItem(LS_JOURNAL)) || seedJournal;
      users = JSON.parse(localStorage.getItem(LS_USERS)) || seedUsers;
      vouchers = JSON.parse(localStorage.getItem(LS_VOUCHERS)) || seedVouchers;
      settings = Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(LS_SETTINGS)) || {});
      TAX.enabled = settings.taxEnabled == null ? TAX.enabled : settings.taxEnabled;
      TAX.rate = settings.taxRate == null ? TAX.rate : settings.taxRate;
    } catch (e) {
      customers = seedCustomers;
      txs = seedTxs;
      products = seedProducts.map(normalizeProduct);
      activity = seedActivity;
      sales = [];
      treasury = seedTreasury;
      suppliers = seedSuppliers;
      supplierTxs = seedSupplierTxs;
      purchases = seedPurchases;
      accounts = seedAccounts;
      journalEntries = seedJournal;
      users = seedUsers;
      vouchers = seedVouchers;
      settings = Object.assign({}, defaultSettings);
    }
    if (!localStorage.getItem(LS_CUSTOMERS)) saveCustomers();
    if (!localStorage.getItem(LS_TXS)) saveTxs();
    if (!localStorage.getItem(LS_PRODUCTS)) saveProducts();
    if (!localStorage.getItem(LS_ACTIVITY)) saveActivity();
    if (!localStorage.getItem(LS_SALES)) saveSales();
    if (!localStorage.getItem(LS_TREASURY)) saveTreasury();
    if (!localStorage.getItem(LS_SUPPLIERS)) saveSuppliers();
    if (!localStorage.getItem(LS_SUP_TXS)) saveSupplierTxs();
    if (!localStorage.getItem(LS_PURCHASES)) savePurchases();
    if (!localStorage.getItem(LS_ACCOUNTS)) saveAccounts();
    if (!localStorage.getItem(LS_JOURNAL)) persistJournal();
    if (!localStorage.getItem(LS_USERS)) saveUsers();
    if (!localStorage.getItem(LS_VOUCHERS)) saveVouchers();
    if (!localStorage.getItem(LS_SETTINGS)) saveSettings();
  }

  function saveProducts() {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  }

  function saveSales() {
    localStorage.setItem(LS_SALES, JSON.stringify(sales));
  }

  function saveTreasury() {
    localStorage.setItem(LS_TREASURY, JSON.stringify(treasury));
  }

  function saveSuppliers() {
    localStorage.setItem(LS_SUPPLIERS, JSON.stringify(suppliers));
  }

  function saveSupplierTxs() {
    localStorage.setItem(LS_SUP_TXS, JSON.stringify(supplierTxs));
  }

  function savePurchases() {
    localStorage.setItem(LS_PURCHASES, JSON.stringify(purchases));
  }

  function saveAccounts() {
    localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
  }

  function persistJournal() {
    localStorage.setItem(LS_JOURNAL, JSON.stringify(journalEntries));
  }

  function saveUsers() {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }

  function saveVouchers() {
    localStorage.setItem(LS_VOUCHERS, JSON.stringify(vouchers));
  }

  function saveSettings() {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }

  function saveActivity() {
    localStorage.setItem(LS_ACTIVITY, JSON.stringify(activity));
  }

  function addActivity(action, desc) {
    const d = new Date();
    const p = (x) => String(x).padStart(2, "0");
    activity.unshift({
      ts: p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()),
      user: "admin",
      action: action,
      desc: desc
    });
    if (activity.length > 200) activity.length = 200;
    saveActivity();
  }

  function saveCustomers() {
    localStorage.setItem(LS_CUSTOMERS, JSON.stringify(customers));
  }

  function saveTxs() {
    localStorage.setItem(LS_TXS, JSON.stringify(txs));
  }

  function fmt(n) {
    return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function normalizeAr(s) {
    return (s || "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .trim()
      .toLowerCase();
  }

  function nextCustomerId() {
    return customers.reduce((m, c) => Math.max(m, c.id), 0) + 1;
  }

  function nextTxId() {
    return txs.reduce((m, t) => Math.max(m, t.id), 0) + 1;
  }

  function nextCustomerCode() {
    let max = 0;
    customers.forEach((c) => {
      const m = /^CUST-(\d+)$/.exec(c.code || "");
      if (m) max = Math.max(max, +m[1]);
    });
    return "CUST-" + String(max + 1).padStart(4, "0");
  }

  function nextSupplierId() {
    return suppliers.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  }

  function nextSupplierCode() {
    let max = 0;
    suppliers.forEach((s) => {
      const m = /^SUPP-(\d+)$/.exec(s.code || "");
      if (m) max = Math.max(max, +m[1]);
    });
    return "SUPP-" + String(max + 1).padStart(4, "0");
  }

  /* ================== التنبيهات ================== */
  let toastTimer = null;
  function toast(msg, type) {
    const el = $("#toast");
    el.className = "toast " + (type || "info");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3500);
  }

  /* ================== النوافذ ================== */
  function showModal(id) {
    $("#" + id).hidden = false;
  }

  function hideModal(id) {
    $("#" + id).hidden = true;
  }

  function printSection(el) {
    document.querySelectorAll(".print-only").forEach((s) => s.classList.remove("print-target"));
    el.classList.add("print-target");
    document.body.classList.add("printing");
    const cleanup = () => {
      el.classList.remove("print-target");
      document.body.classList.remove("printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  }

  /* ================== الروترة بين الشاشات ================== */
  const BUILT_VIEWS = ["dashboard", "customers", "products", "sales", "purchases", "suppliers", "returns", "treasury", "accounts", "journal", "balance", "treasuryStatements", "reports", "users", "audit", "settings"];

  function showView(name) {
    document.querySelectorAll(".view[data-id]").forEach((v) => {
      v.hidden = v.dataset.id !== name;
    });
    document.querySelectorAll(".nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === name);
    });
    if (name === "dashboard") renderDashboard();
    if (name === "customers") renderTable();
    if (name === "products") renderProducts();
    if (name === "sales") {
      if (!posInitialized) {
        posInitialized = true;
        posNewInvoice();
      }
      renderSalesLookups();
    }
    if (name === "purchases") {
      if (!ppInitialized) {
        ppInitialized = true;
        ppNewInvoice();
      }
      renderPurchasesLookups();
    }
    if (name === "suppliers") renderSuppliers();
    if (name === "returns") renderInvoiceQuery();
    if (name === "treasury") { renderTreasury(); renderTreMoves(); }
    if (name === "accounts") renderAccounts();
    if (name === "journal") renderJournal();
    if (name === "balance") renderBalance();
    if (name === "treasuryStatements") renderTreStmt();
    if (name === "reports") renderReports();
    if (name === "users") renderUsers();
    if (name === "audit") renderAudit();
    if (name === "settings") loadSettingsForm();
  }

  /* ================== لوحة التحكم ================== */
  function renderDashboard() {
    const today = todayISO();
    const isToday = (d) => (d || "").slice(0, 10) === today;
    const salesToday = sales.filter((s) => isToday(s.invoiceDate)).reduce((m, s) => m + (s.grandTotal || 0), 0);
    const purToday = purchases.filter((p) => isToday(p.invoiceDate)).reduce((m, p) => m + (p.grandTotal || 0), 0);
    const expToday = vouchers.filter((v) => v.type === "out" && isToday(v.date)).reduce((m, v) => m + (v.amount || 0), 0);
    const revToday = vouchers.filter((v) => v.type === "in" && isToday(v.date)).reduce((m, v) => m + (v.amount || 0), 0);
    const treTotal = treasury.reduce((m, t) => m + (t.balance || 0), 0);

    $("#kSales").textContent = fmt(salesToday) + " ج.م";
    $("#kPurchases").textContent = fmt(purToday) + " ج.م";
    $("#kExpenses").textContent = fmt(expToday) + " ج.م";
    $("#kProfit").textContent = fmt(Math.round((salesToday + revToday - purToday - expToday) * 100) / 100) + " ج.م";
    $("#kTreasury").textContent = fmt(treTotal) + " ج.م";

    const low = products.filter((pr) => pr.qty <= pr.reorder);
    $("#kLowStock").textContent = low.length.toString();

    const tLow = $("#dgvLowStock tbody");
    tLow.innerHTML = "";
    low.forEach((pr) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(pr.code) + '</td>' +
        '<td>' + esc(pr.nameAr) + '</td>' +
        '<td>' + esc(pr.category) + '</td>' +
        '<td>' + esc(Number(pr.qty).toLocaleString("en-US")) + '</td>' +
        '<td>' + esc(Number(pr.reorder).toLocaleString("en-US")) + '</td>';
      tLow.appendChild(tr);
    });

    const tAct = $("#dgvActivity tbody");
    tAct.innerHTML = "";
    activity.slice(0, 12).forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(a.ts) + '</td>' +
        '<td>' + esc(a.user) + '</td>' +
        '<td>' + esc(a.action) + '</td>' +
        '<td style="text-align:right">' + esc(a.desc) + '</td>';
      tAct.appendChild(tr);
    });
  }

  /* ================== الجدول ================== */
  function renderTable() {
    const tbody = $("#dgvCustomers tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtCustomerSearch").value);

    customers
      .filter((c) => {
        if (!q) return true;
        return (
          normalizeAr(c.code).includes(q) ||
          normalizeAr(c.nameAr).includes(q) ||
          normalizeAr(c.phone).includes(q) ||
          normalizeAr(c.secondaryPhone).includes(q) ||
          normalizeAr(c.address).includes(q) ||
          normalizeAr(c.notes).includes(q) ||
          fmt(c.currentBalance).includes(q)
        );
      })
      .forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(c.code) + '</td>' +
          '<td>' + esc(c.nameAr) + '</td>' +
          '<td>' + esc(c.phone || "-") + '</td>' +
          '<td>' + esc(c.secondaryPhone || "-") + '</td>' +
          '<td title="' + esc(c.address || "") + '">' + esc(c.address || "-") + '</td>' +
          '<td title="' + esc(c.notes || "") + '">' + esc(c.notes || "-") + '</td>' +
          '<td class="' + (c.currentBalance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(c.currentBalance) + ' ج.م</td>';
        tr.dataset.id = c.id;
        tr.addEventListener("dblclick", () => openActions(c));
        tr.addEventListener("click", () => {
          tbody.querySelectorAll("tr.selected").forEach((r) => r.classList.remove("selected"));
          tr.classList.add("selected");
        });
        tbody.appendChild(tr);
      });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ================== نافذة: إضافة / تعديل ================== */
  function openAddEdit(customer) {
    editingId = customer ? customer.id : null;
    if (customer) {
      $("#addEditTitle").textContent = "تعديل بيانات العميل";
      $("#btnSaveCustomer").textContent = "💾 حفظ التعديلات";
      $("#fCode").value = customer.code;
      $("#fCode").disabled = true;
      $("#fName").value = customer.nameAr;
      $("#fPhone").value = customer.phone || "";
      $("#fSecPhone").value = customer.secondaryPhone || "";
      $("#fWallet").value = customer.walletPhone || "";
      $("#fAddress").value = customer.address || "";
      $("#fNotes").value = customer.notes || "";
      $("#fBalance").value = fmt(customer.openingBalance);
      $("#fBalance").disabled = true;
    } else {
      $("#addEditTitle").textContent = "إضافة عميل جديد";
      $("#btnSaveCustomer").textContent = "💾 إضافة العميل";
      $("#fCode").value = nextCustomerCode();
      $("#fCode").disabled = false;
      $("#fName").value = "";
      $("#fPhone").value = "";
      $("#fSecPhone").value = "";
      $("#fWallet").value = "";
      $("#fAddress").value = "";
      $("#fNotes").value = "";
      $("#fBalance").value = "0.00";
      $("#fBalance").disabled = false;
    }
    showModal("mAddEdit");
    $("#fName").focus();
  }

  function saveCustomer() {
    const name = $("#fName").value.trim();
    if (!name) {
      toast("يرجى كتابة اسم العميل.", "warning");
      return;
    }

    const bal = parseFloat($("#fBalance").value) || 0;

    if (editingId == null) {
      const cust = {
        id: nextCustomerId(),
        code: $("#fCode").value.trim(),
        nameAr: name,
        phone: $("#fPhone").value.trim(),
        secondaryPhone: $("#fSecPhone").value.trim(),
        walletPhone: $("#fWallet").value.trim(),
        address: $("#fAddress").value.trim(),
        notes: $("#fNotes").value.trim(),
        openingBalance: bal,
        currentBalance: bal,
        protected: false
      };
      customers.push(cust);
      if (bal > 0) {
        txs.push({ id: nextTxId(), customerId: cust.id, date: todayISO(), desc: "رصيد افتتاحي (أول المدة)", debit: bal, credit: 0 });
      }
      saveCustomers();
      saveTxs();
      toast("تمت إضافة العميل بنجاح.", "success");
    } else {
      const cust = customers.find((c) => c.id === editingId);
      cust.nameAr = name;
      cust.phone = $("#fPhone").value.trim();
      cust.secondaryPhone = $("#fSecPhone").value.trim();
      cust.walletPhone = $("#fWallet").value.trim();
      cust.address = $("#fAddress").value.trim();
      cust.notes = $("#fNotes").value.trim();
      saveCustomers();
      toast("تم حفظ التعديلات بنجاح.", "success");
    }
    hideModal("mAddEdit");
    renderTable();
  }

  /* ================== نافذة: تحصيل مديونية ================== */
  let payPreselected = null;

  function openPayDebt(customer) {
    payPreselected = customer || null;
    const sel = $("#pCust");
    sel.innerHTML = "";
    customers.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nameAr + " (المديونية: " + fmt(c.currentBalance) + " ج.م)";
      sel.appendChild(opt);
    });
    if (payPreselected) {
      sel.value = String(payPreselected.id);
    }
    $("#pMethod").value = "نقداً 💵";
    $("#pAmount").value = "";
    $("#pNotes").value = "تحصيل دفعة نقداً من حساب العميل";
    applyTreasuryFilter();
    updateWalletFields();
    showModal("mPayDebt");
  }

  function applyTreasuryFilter() {
    const method = $("#pMethod").value;
    const type = method.includes("بنكي") ? "bank" : method.includes("محفظة") ? "wallet" : "cash";
    const sel = $("#pTreasury");
    sel.innerHTML = "";
    treasury.filter((t) => t.type === type).forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
  }

  function updateWalletFields() {
    const isWallet = $("#pMethod").value.includes("محفظة");
    $("#lblWalletFrom").hidden = !isWallet;
    $("#pWalletFrom").hidden = !isWallet;
    $("#lblWalletTo").hidden = !isWallet;
    $("#pWalletTo").hidden = !isWallet;
    if (isWallet) {
      $("#pWalletFrom").value = "01002655282";
      const cid = parseInt($("#pCust").value, 10);
      const c = customers.find((x) => x.id === cid);
      $("#pWalletTo").value = (c && c.walletPhone) ? c.walletPhone : "";
    }
  }

  function savePay() {
    const cid = parseInt($("#pCust").value, 10);
    if (!cid) {
      toast("يرجى اختيار العميل.", "warning");
      return;
    }
    const amount = parseFloat($("#pAmount").value);
    if (!(amount > 0)) {
      toast("يرجى كتابة مبلغ صحيح أكبر من الصفر.", "warning");
      return;
    }
    if ($("#pMethod").value.includes("محفظة")) {
      if (!$("#pWalletFrom").value.trim() || !$("#pWalletTo").value.trim()) {
        toast("يرجى تعبئة رقم المحفظة المرسِل منها والمرسَل إليها.", "warning");
        return;
      }
    }

    let notes = $("#pNotes").value.trim();
    if ($("#pMethod").value.includes("محفظة")) {
      notes += " | محفظة: من " + $("#pWalletFrom").value.trim() + " إلى " + $("#pWalletTo").value.trim();
    }

    const cust = customers.find((c) => c.id === cid);
    cust.currentBalance = Math.round((cust.currentBalance - amount) * 100) / 100;
    const trId = parseInt($("#pTreasury").value, 10);
    const tr = treasury.find((x) => x.id === trId);
    if (tr) {
      tr.balance = Math.round((tr.balance + amount) * 100) / 100;
      saveTreasury();
    }
    txs.push({
      id: nextTxId(),
      customerId: cid,
      date: todayISO(),
      desc: notes,
      debit: 0,
      credit: amount
    });
    saveCustomers();
    saveTxs();
    hideModal("mPayDebt");
    toast("تم تسجيل السداد بنجاح.", "success");
    renderTable();
  }

  function todayISO() {
    const d = new Date();
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /* ================== نافذة: خيارات العميل ================== */
  let actionsCust = null;
  let statementCtx = null;

  function openActions(cust) {
    actionsCust = cust;
    $("#actTitle").textContent = "👤 إدارة العميل: " + cust.nameAr + " (" + cust.code + ") - By Adel Samir - واتس: 01002655282";
    $("#actName").textContent = "👤 العميل: " + cust.nameAr;
    $("#actDetails1").textContent = "الكود: " + cust.code + " | الهاتف: " + (cust.phone || "-") + " | هاتف آخر: " + (cust.secondaryPhone || "-");
    $("#actDetails2").textContent = "العنوان: " + (cust.address || "-") + " | ملاحظات: " + (cust.notes || "-");
    const bal = $("#actBalance");
    bal.textContent = "الرصيد الحالي (المديونية): " + fmt(cust.currentBalance) + " ج.م";
    bal.className = "act-bal " + (cust.currentBalance > 0 ? "balance-debit" : "balance-credit");
    showModal("mActions");
  }

  /* ================== كشف الحساب ================== */
  function getStatement(cust) {
    const rows = txs
      .filter((t) => t.customerId === cust.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    let run = 0;
    return rows.map((t) => {
      run = Math.round((run + t.debit - t.credit) * 100) / 100;
      return {
        date: t.date,
        desc: t.desc,
        debit: t.debit,
        credit: t.credit,
        balance: run
      };
    });
  }

  function fillStatementTable(tbodyEl, cust) {
    tbodyEl.innerHTML = "";
    const rows = getStatement(cust);
    if (rows.length === 0) {
      tbodyEl.innerHTML = '<tr><td colspan="5">لا توجد حركات على حساب هذا العميل.</td></tr>';
      return;
    }
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(r.date) + '</td>' +
        '<td style="text-align:right">' + esc(r.desc) + '</td>' +
        '<td>' + (r.debit ? fmt(r.debit) : "-") + '</td>' +
        '<td>' + (r.credit ? fmt(r.credit) : "-") + '</td>' +
        '<td class="' + (r.balance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(r.balance) + '</td>';
      tbodyEl.appendChild(tr);
    });
  }

  function dateRange() {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const p = (x) => String(x).padStart(2, "0");
    return (
      p(from.getDate()) + "/" + p(from.getMonth() + 1) + "/" + from.getFullYear() +
      " - " +
      p(new Date().getDate()) + "/" + p(new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    );
  }

  function openStatement(cust) {
    statementCtx = { type: "customer", obj: cust };
    $("#stmTitle").textContent = "📋 كشف حساب تفصيلي: " + cust.nameAr;
    $("#stmHeadMini").innerHTML =
      "الكود: <b>" + esc(cust.code) + "</b> | الفترة: <b>" + dateRange() + "</b> | " +
      "الرصيد الحالي: <b class=\"" + (cust.currentBalance > 0 ? "balance-debit" : "balance-credit") + "\">" + fmt(cust.currentBalance) + " ج.م</b>";
    fillStatementTable($("#stmBodyMini"), cust);
    showModal("mStatement");
  }

  function printStatement(cust) {
    $("#stmName").textContent = cust.nameAr;
    $("#stmCode").textContent = cust.code;
    $("#stmRange").textContent = dateRange();
    const bal = $("#stmBal");
    bal.textContent = fmt(cust.currentBalance);
    bal.className = cust.currentBalance > 0 ? "balance-debit" : "balance-credit";
    fillStatementTable($("#stmBody"), cust);
    printSection($("#statementPage"));
  }

  /* ================== شاشة الأصناف والمخزون ================== */
  let editingProductId = null;

  function nextProductId() {
    return products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  }

  function nextProductCode() {
    let max = 0;
    products.forEach((p) => {
      const m = /^PRD-(\d+)$/.exec(p.code || "");
      if (m) max = Math.max(max, +m[1]);
    });
    return "PRD-" + String(max + 1).padStart(4, "0");
  }

  function productCategories() {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    CATEGORIES.concat([...set]).forEach((c) => set.add(c));
    return [...set];
  }

  function fillSelect(sel, items, selected) {
    const el = $(sel);
    el.innerHTML = "";
    items.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      el.appendChild(opt);
    });
    if (selected != null) el.value = selected;
  }

  function discountStatusText(p) {
    const pct = Number(p.discountPercent) || 0;
    if (pct <= 0) return "بدون خصم";
    if (p.discountStart && p.discountEnd) {
      const now = new Date();
      const s = new Date(p.discountStart + "T00:00:00");
      const e = new Date(p.discountEnd + "T00:00:00");
      if (now >= s && now <= e) return pct + " % (نشط)";
      return pct + " %";
    }
    return pct + " %";
  }

  function renderProducts() {
    fillSelect("#cmbProductCategory", ["الكل"].concat(productCategories()), $("#cmbProductCategory").value || "الكل");

    const q = normalizeAr($("#txtProductSearch").value);
    const cat = $("#cmbProductCategory").value;
    const tbody = $("#dgvProducts tbody");
    tbody.innerHTML = "";

    const filtered = products.filter((p) => {
      if (cat !== "الكل" && p.category !== cat) return false;
      if (!q) return true;
      return (
        normalizeAr(p.code).includes(q) ||
        normalizeAr(p.barcode || "").includes(q) ||
        normalizeAr(p.nameAr).includes(q) ||
        normalizeAr(p.nameEn || "").includes(q) ||
        normalizeAr(p.category).includes(q) ||
        normalizeAr(p.unit).includes(q) ||
        normalizeAr(p.defaultWarehouse).includes(q) ||
        Number(p.purchasePrice || 0).toString().includes(q) ||
        Number(p.weightedAvgCost || 0).toString().includes(q) ||
        Number(p.salePrice || 0).toString().includes(q) ||
        (p.isActive ? "نشط" : "معطل").includes(q)
      );
    });

    filtered.forEach((p) => {
      const tr = document.createElement("tr");
      const disc = discountStatusText(p);
      const discBadge = p.discountPercent > 0
        ? '<span class="badge badge-discount">' + esc(disc) + '</span>'
        : '<span class="badge badge-none">' + esc(disc) + '</span>';
      const stBadge = p.isActive
        ? '<span class="badge badge-active">نشط 🟢</span>'
        : '<span class="badge badge-inactive">معطل 🔴</span>';
      tr.innerHTML =
        '<td>' + esc(p.code) + '</td>' +
        '<td>' + esc(p.barcode || "-") + '</td>' +
        '<td>' + esc(p.nameAr) + '</td>' +
        '<td>' + esc(p.category) + '</td>' +
        '<td>' + esc(p.unit) + '</td>' +
        '<td>' + esc(Number(p.qty).toLocaleString("en-US")) + '</td>' +
        '<td>' + fmt(p.purchasePrice) + '</td>' +
        '<td>' + fmt(p.weightedAvgCost) + '</td>' +
        '<td>' + fmt(p.salePrice) + '</td>' +
        '<td>' + discBadge + '</td>' +
        '<td>' + stBadge + '</td>' +
        '<td class="cell-actions"><button class="btn small blue" type="button" data-action="edit">✏️ تعديل</button></td>';
      tr.dataset.id = p.id;
      tr.querySelector('[data-action="edit"]').addEventListener("click", () => openProductDialog(p));
      tr.addEventListener("dblclick", () => openProductDialog(p));
      tbody.appendChild(tr);
    });
  }

  /* ---- نافذة إضافة / تعديل صنف ---- */
  function openProductDialog(product) {
    editingProductId = product ? product.id : null;
    fillSelect("#fPCategory", productCategories(), product ? product.category : CATEGORIES[0]);
    fillSelect("#fPUnit", UNITS, product ? product.unit : UNITS[0]);
    fillSelect("#fPWarehouse", WAREHOUSES, product ? product.defaultWarehouse : WAREHOUSES[0]);

    if (product) {
      $("#productModalTitle").textContent = "✏️ تعديل صنف (" + product.nameAr + ")";
      $("#btnSaveProduct").textContent = "💾 حفظ التعديلات";
      $("#fPCode").value = product.code;
      $("#fPCode").disabled = true;
      $("#fPBarcode").value = product.barcode || "";
      $("#fPNameAr").value = product.nameAr;
      $("#fPNameEn").value = product.nameEn || "";
      $("#fPPurchase").value = fmt(product.purchasePrice);
      $("#fPSale").value = fmt(product.salePrice);
      $("#fPStock").value = Number(product.qty).toLocaleString("en-US");
      $("#fPStock").disabled = true;
      $("#fPDiscount").value = Number(product.discountPercent || 0).toLocaleString("en-US");
      $("#fPDiscStart").value = product.discountStart || "";
      $("#fPDiscEnd").value = product.discountEnd || "";
      $("#fPStatus").value = product.isActive ? "1" : "0";
    } else {
      $("#productModalTitle").textContent = "➕ إضافة صنف جديد للمخزن";
      $("#btnSaveProduct").textContent = "💾 حفظ الصنف";
      $("#fPCode").value = nextProductCode();
      $("#fPCode").disabled = false;
      $("#fPBarcode").value = "";
      $("#fPNameAr").value = "";
      $("#fPNameEn").value = "";
      $("#fPPurchase").value = "0.00";
      $("#fPSale").value = "0.00";
      $("#fPStock").value = "0";
      $("#fPStock").disabled = false;
      $("#fPDiscount").value = "0";
      $("#fPDiscStart").value = "";
      $("#fPDiscEnd").value = "";
      $("#fPStatus").value = "1";
    }
    showModal("mProduct");
    $("#fPNameAr").focus();
  }

  function saveProduct() {
    const nameAr = $("#fPNameAr").value.trim();
    if (!nameAr) {
      toast("يرجى كتابة اسم الصنف بالعربية.", "warning");
      return;
    }
    const category = $("#fPCategory").value;
    const unit = $("#fPUnit").value;
    if (!category) {
      toast("يرجى اختيار تصنيف الصنف (التصنيف إجباري).", "warning");
      return;
    }
    if (!unit) {
      toast("يرجى اختيار وحدة قياس للصنف (إجبارية).", "warning");
      return;
    }

    const dStart = $("#fPDiscStart").value;
    const dEnd = $("#fPDiscEnd").value;
    if (dStart && dEnd && dStart > dEnd) {
      toast("تاريخ نهاية فترة الخصم لا يمكن أن يكون سابقاً لتاريخ البداية.", "warning");
      return;
    }

    const purchase = parseFloat($("#fPPurchase").value) || 0;
    const sale = parseFloat($("#fPSale").value) || 0;
    const opening = parseFloat(String($("#fPStock").value).replace(/,/g, "")) || 0;
    const discount = parseFloat($("#fPDiscount").value) || 0;
    const status = $("#fPStatus").value === "1";

    if (editingProductId == null) {
      const pr = {
        id: nextProductId(),
        code: $("#fPCode").value.trim(),
        barcode: $("#fPBarcode").value.trim() || "",
        nameAr: nameAr,
        nameEn: $("#fPNameEn").value.trim(),
        category: category,
        unit: unit,
        defaultWarehouse: $("#fPWarehouse").value || WAREHOUSES[0],
        purchasePrice: purchase,
        weightedAvgCost: purchase,
        salePrice: sale,
        discountPercent: discount,
        discountStart: dStart,
        discountEnd: dEnd,
        qty: opening,
        reorder: 50,
        isActive: status
      };
      products.push(pr);
      saveProducts();
      addActivity("إضافة صنف", "إضافة صنف جديد: " + pr.nameAr + " (" + pr.code + ")");
      toast("تمت إضافة الصنف بنجاح.", "success");
    } else {
      const pr = products.find((p) => p.id === editingProductId);
      pr.barcode = $("#fPBarcode").value.trim() || "";
      pr.nameAr = nameAr;
      pr.nameEn = $("#fPNameEn").value.trim();
      pr.category = category;
      pr.unit = unit;
      pr.defaultWarehouse = $("#fPWarehouse").value || pr.defaultWarehouse;
      pr.purchasePrice = purchase;
      pr.salePrice = sale;
      pr.discountPercent = discount;
      pr.discountStart = dStart;
      pr.discountEnd = dEnd;
      pr.isActive = status;
      saveProducts();
      addActivity("تعديل صنف", "تعديل بيانات الصنف: " + pr.nameAr + " (" + pr.code + ")");
      toast("تم حفظ تعديلات الصنف بنجاح.", "success");
    }
    hideModal("mProduct");
    renderProducts();
  }

  /* ---- جرد المخزون لكل مستودع ---- */
  function openStockTake() {
    fillSelect("#stkWarehouse", WAREHOUSES, WAREHOUSES[0]);
    renderStockTake();
    showModal("mStockTake");
  }

  function renderStockTake() {
    const wh = $("#stkWarehouse").value;
    const tbody = $("#dgvStockTake tbody");
    tbody.innerHTML = "";
    const lines = products.filter((p) => p.defaultWarehouse === wh || p.defaultWarehouse === WAREHOUSES[0]);
    lines.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(p.code) + '</td>' +
        '<td>' + esc(p.nameAr) + '</td>' +
        '<td>' + esc(Number(p.qty).toLocaleString("en-US")) + '</td>' +
        '<td><input class="stk-qty-input" type="text" data-id="' + p.id + '" autocomplete="off" /></td>' +
        '<td class="stk-diff diff-zero">-</td>';
      tbody.appendChild(tr);
    });
    $("#stkSummary").textContent = "إجمالي عدد الأصناف: " + lines.length.toLocaleString("en-US");
  }

  function computeStockDiff(inputEl) {
    const tr = inputEl.closest("tr");
    const sysCell = tr.cells[2];
    const diffCell = tr.cells[4];
    const sys = parseFloat(String(sysCell.textContent).replace(/,/g, "")) || 0;
    const act = parseFloat(inputEl.value.replace(/,/g, ""));
    if (isNaN(act)) {
      diffCell.textContent = "-";
      diffCell.className = "stk-diff diff-zero";
      return;
    }
    const diff = Math.round((act - sys) * 100) / 100;
    diffCell.textContent = Number(diff).toLocaleString("en-US");
    diffCell.className = "stk-diff " + (diff > 0 ? "diff-pos" : diff < 0 ? "diff-neg" : "diff-zero");
  }

  function saveStockTake() {
    const wh = $("#stkWarehouse").value;
    const rows = $("#dgvStockTake tbody").querySelectorAll("tr");
    const items = [];
    rows.forEach((tr) => {
      const inp = tr.querySelector(".stk-qty-input");
      const pid = parseInt(inp.dataset.id, 10);
      const sys = parseFloat(String(tr.cells[2].textContent).replace(/,/g, "")) || 0;
      const act = parseFloat(inp.value.replace(/,/g, ""));
      if (isNaN(act)) return;
      if (Math.abs(act - sys) >= 0.0001) items.push({ id: pid, qty: act });
    });

    if (items.length === 0) {
      toast("لم يُدخَل أي «عدد معدود» مختلف عن رصيد النظام بعد، وعليه لم تتم أي تسوية.", "warning");
      return;
    }

    if (!confirm("سيتم اعتماد جرد مخزن (" + wh + ") وتسوية فروق عدد (" + items.length + ") صنف.\n\nهل أنت متأكد من المتابعة؟")) return;

    items.forEach((it) => {
      const pr = products.find((p) => p.id === it.id);
      if (pr) {
        pr.qty = it.qty;
        pr.weightedAvgCost = pr.weightedAvgCost || pr.purchasePrice;
      }
    });
    saveProducts();
    addActivity("اعتماد جرد", "جرد مخزن (" + wh + ") وتسوية " + items.length + " صنف");
    hideModal("mStockTake");
    toast("تم اعتماد الجرد وتسوية الفروق بنجاح.", "success");
    renderProducts();
  }

  function exportStockTakeCSV() {
    const rows = $("#dgvStockTake tbody").querySelectorAll("tr");
    if (rows.length === 0) {
      toast("لا توجد أصناف للتصدير.", "warning");
      return;
    }
    const lines = [];
    lines.push("كود الصنف,اسم الصنف,العدد الفعلي على البرنامج,العدد المعدود,الفرق");
    rows.forEach((tr) => {
      const q = (s) => '"' + String(s || "").replace(/"/g, '""') + '"';
      lines.push([q(tr.cells[0].textContent), q(tr.cells[1].textContent), tr.cells[2].textContent, q(tr.querySelector(".stk-qty-input").value || ""), tr.cells[4].textContent].join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "جرد_مخزون_" + Date.now() + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("تم تصدير جدول الجرد إلى CSV (يفتح في Excel).", "success");
  }

  function printStockTake() {
    const rows = $("#dgvStockTake tbody").querySelectorAll("tr");
    const wh = $("#stkWarehouse").value;
    $("#skWh").textContent = wh;
    const p = (x) => String(x).padStart(2, "0");
    const d = new Date();
    $("#skDate").textContent = d.getFullYear() + "/" + p(d.getMonth() + 1) + "/" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
    $("#skCount").textContent = rows.length.toLocaleString("en-US");
    const tb = $("#skBody");
    tb.innerHTML = "";
    rows.forEach((tr) => {
      const tr2 = document.createElement("tr");
      tr2.innerHTML =
        '<td>' + esc(tr.cells[0].textContent) + '</td>' +
        '<td>' + esc(tr.cells[1].textContent) + '</td>' +
        '<td>' + esc(tr.cells[2].textContent) + '</td>' +
        '<td>' + esc(tr.querySelector(".stk-qty-input").value || "") + '</td>' +
        '<td>' + esc(tr.cells[4].textContent) + '</td>';
      tb.appendChild(tr2);
    });
    printSection($("#stockPage"));
  }

  /* ================== شاشة فواتير المبيعات (POS) ================== */
  let posItems = [];
  let posInitialized = false;
  let ppItems = [];
  let ppInitialized = false;

  function nextInvoiceNumber() {
    const d = new Date();
    const p = (x) => String(x).padStart(2, "0");
    return "INV-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + String(sales.length + 1).padStart(4, "0");
  }

  function activeDiscountPct(p) {
    const pct = Number(p.discountPercent) || 0;
    if (pct <= 0) return 0;
    if (p.discountStart && p.discountEnd) {
      const now = new Date();
      const s = new Date(p.discountStart + "T00:00:00");
      const e = new Date(p.discountEnd + "T23:59:59");
      return now >= s && now <= e ? pct : 0;
    }
    return pct;
  }

  function findProductFlexible(q) {
    const n = normalizeAr(q);
    if (!n) return null;
    return products.find((p) => normalizeAr(p.code) === n || (p.barcode && normalizeAr(p.barcode) === n))
      || products.find((p) => normalizeAr(p.code).includes(n) || normalizeAr(p.nameAr).includes(n) || (p.barcode && normalizeAr(p.barcode).includes(n)))
      || null;
  }

  function renderSalesLookups() {
    const custSel = $("#cmbPosCustomer");
    const prevCust = custSel.value;
    custSel.innerHTML = "";
    customers.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nameAr;
      custSel.appendChild(opt);
    });
    if (prevCust) custSel.value = prevCust;

    const whSel = $("#cmbPosWarehouse");
    const prevWh = whSel.value;
    whSel.innerHTML = "";
    WAREHOUSES.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w;
      opt.textContent = w;
      whSel.appendChild(opt);
    });
    if (prevWh) whSel.value = prevWh;

    fillPosPicker();
    fillPosDatalist();
  }

  function fillPosPicker() {
    const sel = $("#cmbPosPicker");
    const prev = sel.value;
    sel.innerHTML = "";
    const opt0 = document.createElement("option");
    opt0.value = "0";
    opt0.textContent = "-- اختر صنفاً من المخزن للإضافة --";
    sel.appendChild(opt0);
    products.filter((p) => p.isActive).forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = "[" + p.code + "] " + p.nameAr + " (المخزن: " + Number(p.qty).toLocaleString("en-US") + " " + p.unit + " | " + fmt(p.salePrice) + " ج.م)";
      sel.appendChild(opt);
    });
    sel.value = prev && sel.querySelector('option[value="' + prev + '"]') ? prev : "0";
  }

  function fillPosDatalist() {
    const dl = $("#posProductsList");
    dl.innerHTML = "";
    products.filter((p) => p.isActive).forEach((p) => {
      [p.nameAr, p.code, p.barcode].forEach((v) => {
        if (!v) return;
        const o = document.createElement("option");
        o.value = v;
        dl.appendChild(o);
      });
    });
  }

  function posSelectDefaultCustomer() {
    const sel = $("#cmbPosCustomer");
    const def = customers.find((c) => c.code === "CASH") || customers.find((c) => (c.nameAr || "").includes("نقدي")) || customers[0];
    if (def) sel.value = String(def.id);
  }

  function posUpdateBadge(p) {
    if (!p) {
      $("#sbName").textContent = "—";
      $("#sbQty").textContent = "الرصيد: -";
      $("#sbPrice").textContent = "السعر البيعي المرجعي: -";
      return;
    }
    $("#sbName").textContent = p.nameAr;
    $("#sbQty").textContent = "الرصيد: " + Number(p.qty).toLocaleString("en-US") + " " + p.unit;
    $("#sbPrice").textContent = "السعر البيعي المرجعي: " + fmt(p.salePrice) + " ج.م";
  }

  function posNewInvoice() {
    posItems = [];
    $("#txtInvoiceNo").value = nextInvoiceNumber();
    $("#dtpDate").value = todayISO();
    $("#cmbPaymentMethod").value = "نقداً";
    $("#txtPosDiscount").value = "0";
    $("#txtPosSearch").value = "";
    $("#numPosQty").value = "1";
    $("#txtPosPrice").value = "";
    $("#cmbPosPicker").value = "0";
    posSelectDefaultCustomer();
    posPaymentVisibility();
    posUpdateBadge(null);
    renderPosItems();
    posRecalc();
  }

  function posPaymentVisibility() {
    const m = $("#cmbPaymentMethod").value;
    const isBank = m.includes("بنكي");
    const isWallet = m.includes("محفظة");
    $("#fldPosBank").hidden = !isBank;
    $("#fldPosWallet").hidden = !isWallet;
    const fill = (sel, type) => {
      const s = $(sel);
      s.innerHTML = "";
      treasury.filter((t) => t.type === type).forEach((t) => {
        const o = document.createElement("option");
        o.value = t.id;
        o.textContent = t.name;
        s.appendChild(o);
      });
    };
    if (isBank) fill("#cmbPosBank", "bank");
    if (isWallet) fill("#cmbPosWallet", "wallet");
  }

  function posOnSearch() {
    const q = $("#txtPosSearch").value.trim();
    if (!q) return;
    const p = findProductFlexible(q);
    if (p) {
      posUpdateBadge(p);
    }
  }

  function posPickFromList() {
    const id = parseInt($("#cmbPosPicker").value, 10);
    if (!id) return;
    const p = products.find((x) => x.id === id);
    if (!p) return;
    $("#txtPosSearch").value = p.nameAr;
    posUpdateBadge(p);
    $("#txtPosPrice").focus();
  }

  function posAddItem() {
    let q = $("#txtPosSearch").value.trim();
    let prod = q ? findProductFlexible(q) : null;
    if (!prod) {
      const pid = parseInt($("#cmbPosPicker").value, 10);
      if (pid) prod = products.find((p) => p.id === pid);
    }
    if (!prod) {
      toast("لم يتم العثور على صنف يطابق الاسم أو الكود المكتوب.\nيمكنك استخدام زر (➕ إضافة صنف جديد للمخزن).", "warning");
      return;
    }
    if (!prod.isActive) {
      toast("الصنف (" + prod.nameAr + ") معطل وغير متاح للبيع.", "warning");
      return;
    }
    let qty = parseFloat(String($("#numPosQty").value).replace(/,/g, ""));
    if (!(qty > 0)) qty = 1;
    let price = parseFloat(String($("#txtPosPrice").value).replace(/,/g, ""));
    if (isNaN(price) || price <= 0) {
      toast("اكتب سعر البيع المتفق عليه مع العميل في خانة «سعر البيع».", "warning");
      $("#txtPosPrice").focus();
      return;
    }

    const pct = activeDiscountPct(prod);
    const existing = posItems.find((it) => it.productId === prod.id);
    if (existing) {
      existing.qty = Math.round((existing.qty + qty) * 100) / 100;
      if (pct > 0) existing.discount = Math.round(existing.qty * existing.price * pct / 100 * 100) / 100;
    } else {
      posItems.push({
        productId: prod.id,
        code: prod.code,
        nameAr: prod.nameAr,
        unit: prod.unit,
        qty: qty,
        price: price,
        discount: pct > 0 ? Math.round(qty * price * pct / 100 * 100) / 100 : 0,
        tax: 0,
        total: 0
      });
    }
    $("#txtPosSearch").value = "";
    $("#numPosQty").value = "1";
    $("#txtPosPrice").value = "";
    $("#cmbPosPicker").value = "0";
    posUpdateBadge(prod);
    renderPosItems();
    posRecalc();
    $("#txtPosSearch").focus();
  }

  function posCalcRow(idx) {
    const it = posItems[idx];
    const sub = Math.max(it.qty * it.price - it.discount, 0);
    it.tax = TAX.enabled ? Math.round(sub * TAX.rate * 100) / 100 : 0;
    it.total = Math.round((sub + it.tax) * 100) / 100;
  }

  function posRecalc() {
    let sub = 0, tax = 0;
    posItems.forEach((it, i) => {
      posCalcRow(i);
      sub += it.qty * it.price - it.discount;
      tax += it.tax;
    });
    sub = Math.round(sub * 100) / 100;
    tax = Math.round(tax * 100) / 100;
    const extra = parseFloat(String($("#txtPosDiscount").value).replace(/,/g, "")) || 0;
    let grand = Math.round((sub + tax - extra) * 100) / 100;
    if (grand < 0) grand = 0;
    $("#lblPosSubTotal").textContent = (TAX.enabled ? "المجموع: " : "الإجمالي: ") + fmt(sub) + " ج.م";
    $("#lblPosTax").textContent = TAX.enabled ? "ضريبة المبيعات (" + Math.round(TAX.rate * 100) + "%): " + fmt(tax) + " ج.م" : "";
    $("#lblPosTax").hidden = !TAX.enabled;
    $("#lblPosTotal").textContent = (TAX.enabled ? "الصافي النهائي: " : "الإجمالي: ") + fmt(grand) + " ج.م";
    return { sub: sub, tax: tax, extra: extra, grand: grand };
  }

  function renderPosItems() {
    const tbody = $("#dgvItems tbody");
    tbody.innerHTML = "";
    posItems.forEach((it, i) => {
      posCalcRow(i);
      const tr = document.createElement("tr");
      tr.dataset.idx = i;
      tr.innerHTML =
        '<td>' + esc(it.code) + '</td>' +
        '<td style="text-align:right">' + esc(it.nameAr) + '</td>' +
        '<td>' + esc(it.unit) + '</td>' +
        '<td><input class="cell-input" data-f="qty" type="text" value="' + esc(it.qty) + '" /></td>' +
        '<td><input class="cell-input" data-f="price" type="text" value="' + fmt(it.price) + '" /></td>' +
        '<td><input class="cell-input" data-f="discount" type="text" value="' + fmt(it.discount) + '" /></td>' +
        '<td class="c-tax">' + fmt(it.tax) + '</td>' +
        '<td class="c-total">' + fmt(it.total) + '</td>' +
        '<td class="cell-actions"><button class="btn small red" type="button" data-f="del">❌</button></td>';
      tr.addEventListener("mouseenter", () => posUpdateBadge(products.find((p) => p.id === it.productId) || null));
      tbody.appendChild(tr);
    });
  }

  function savePosInvoice() {
    if (posItems.length === 0) {
      toast("يرجى إضافة أصناف إلى الفاتورة أولاً.", "warning");
      return;
    }
    const methods = ["نقداً", "آجل", "تحويل بنكي", "محافظ إلكترونية"];
    const payment = methods[$("#cmbPaymentMethod").selectedIndex] || "نقداً";
    const custId = parseInt($("#cmbPosCustomer").value, 10);
    const cust = customers.find((c) => c.id === custId);
    if (!cust) {
      toast("يرجى اختيار العميل.", "warning");
      return;
    }
    if (payment === "آجل" && cust.protected) {
      toast("الرجاء اختيار عميل حقيقي للبيع الآجل (لا يمكن ترحيلها للعميل النقدي).", "warning");
      return;
    }
    const warehouse = $("#cmbPosWarehouse").value;
    if (!warehouse) {
      toast("يرجى اختيار المستودع.", "warning");
      return;
    }

    const shortages = posItems
      .map((it) => {
        const p = products.find((x) => x.id === it.productId);
        return p && p.qty >= it.qty ? null : it.nameAr + " (المتاح: " + (p ? Number(p.qty).toLocaleString("en-US") : 0) + ")";
      })
      .filter(Boolean);
    if (shortages.length > 0) {
      toast("لا يوجد رصيد كافٍ للأصناف التالية:\n" + shortages.join("\n"), "warning");
      return;
    }

    const t = posRecalc();
    const invoice = {
      id: sales.reduce((m, x) => Math.max(m, x.id), 0) + 1,
      invoiceNumber: $("#txtInvoiceNo").value,
      invoiceDate: $("#dtpDate").value || todayISO(),
      customerId: cust.id,
      customerName: cust.nameAr,
      warehouse: warehouse,
      paymentMethod: payment,
      treasuryId: null,
      discountAmount: t.extra,
      taxAmount: t.tax,
      subTotal: t.sub,
      grandTotal: t.grand,
      items: posItems.map((it) => ({ productId: it.productId, code: it.code, nameAr: it.nameAr, unit: it.unit, qty: it.qty, price: it.price, discount: it.discount, tax: it.tax, total: it.total })),
      status: "posted"
    };

    if (payment === "آجل") {
      cust.currentBalance = Math.round((cust.currentBalance + t.grand) * 100) / 100;
      txs.push({ id: nextTxId(), customerId: cust.id, date: invoice.invoiceDate, desc: "فاتورة مبيعات آجلة رقم " + invoice.invoiceNumber, debit: t.grand, credit: 0 });
      saveCustomers();
      saveTxs();
    } else {
      const type = payment === "تحويل بنكي" ? "bank" : payment === "محافظ إلكترونية" ? "wallet" : "cash";
      const selId = payment === "تحويل بنكي" ? parseInt($("#cmbPosBank").value, 10)
        : payment === "محافظ إلكترونية" ? parseInt($("#cmbPosWallet").value, 10)
        : treasury.find((x) => x.type === "cash") ? treasury.find((x) => x.type === "cash").id : null;
      const tr = treasury.find((x) => x.id === selId && x.type === type) || treasury.find((x) => x.type === type);
      if (tr) {
        tr.balance = Math.round((tr.balance + t.grand) * 100) / 100;
        invoice.treasuryId = tr.id;
        saveTreasury();
      }
    }

    posItems.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (p) p.qty = Math.round((p.qty - it.qty) * 100) / 100;
    });
    saveProducts();

    sales.push(invoice);
    saveSales();
    addActivity("فاتورة مبيعات", "فاتورة " + invoice.invoiceNumber + " - " + cust.nameAr + " - " + fmt(t.grand) + " ج.م (" + payment + ")");

    toast("تم حفظ وتأكيد فاتورة المبيعات بنجاح برقم (" + invoice.invoiceNumber + ").", "success");
    printInvoice(invoice);
    fillPosPicker();
    fillPosDatalist();
    posNewInvoice();
  }

  function printInvoice(inv) {
    $("#invNoPrint").textContent = inv.invoiceNumber;
    $("#invDatePrint").textContent = inv.invoiceDate;
    $("#invCustPrint").textContent = inv.customerName;
    $("#invWhPrint").textContent = inv.warehouse;
    $("#invPayPrint").textContent = inv.paymentMethod;
    const tb = $("#invBodyPrint");
    tb.innerHTML = "";
    inv.items.forEach((it) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(it.code) + '</td>' +
        '<td style="text-align:right">' + esc(it.nameAr) + '</td>' +
        '<td>' + esc(it.unit) + '</td>' +
        '<td>' + esc(Number(it.qty).toLocaleString("en-US")) + '</td>' +
        '<td>' + fmt(it.price) + '</td>' +
        '<td>' + fmt(it.discount) + '</td>' +
        '<td>' + fmt(it.tax) + '</td>' +
        '<td>' + fmt(it.total) + '</td>';
      tb.appendChild(tr);
    });
    $("#invFootPrint").innerHTML =
      "المجموع: <b>" + fmt(inv.subTotal) + " ج.م</b> | الخصم الإضافي: <b>" + fmt(inv.discountAmount) + " ج.م</b> | " +
      "الضريبة: <b>" + fmt(inv.taxAmount) + " ج.م</b> | الصافي النهائي: <b>" + fmt(inv.grandTotal) + " ج.م</b>";
    printSection($("#invoicePage"));
  }

  function openSalesForCustomer(cust) {
    showView("sales");
    posNewInvoice();
    $("#cmbPosCustomer").value = String(cust.id);
    toast("تم فتح فاتورة مبيعات جديدة باسم العميل (" + cust.nameAr + ").", "info");
  }

  /* ---- إضافة سريعة: صنف ---- */
  function openQuickProduct() {
    fillSelect("#qCat", productCategories(), CATEGORIES[0]);
    fillSelect("#qUnit", UNITS, UNITS[0]);
    $("#qCode").value = nextProductCode();
    $("#qName").value = "";
    $("#qQty").value = "10";
    $("#qCost").value = "100";
    $("#qSale").value = "150";
    $("#qDisc").value = "0";
    showModal("mQuickProduct");
    $("#qName").focus();
  }

  function saveQuickProduct() {
    const nameAr = $("#qName").value.trim();
    if (!nameAr) {
      toast("اسم الصنف مطلوب.", "warning");
      return;
    }
    const purchase = parseFloat($("#qCost").value) || 0;
    const sale = parseFloat($("#qSale").value) || 0;
    const qty = parseFloat($("#qQty").value) || 0;
    const disc = parseFloat($("#qDisc").value) || 0;
    const p = {
      id: nextProductId(),
      code: $("#qCode").value.trim() || nextProductCode(),
      barcode: "",
      nameAr: nameAr,
      nameEn: "",
      category: $("#qCat").value,
      unit: $("#qUnit").value,
      defaultWarehouse: $("#cmbPosWarehouse").value || WAREHOUSES[0],
      purchasePrice: purchase,
      weightedAvgCost: purchase,
      salePrice: sale,
      discountPercent: disc,
      discountStart: "",
      discountEnd: "",
      qty: qty,
      reorder: 50,
      isActive: true
    };
    products.push(p);
    saveProducts();
    addActivity("إضافة صنف", "إضافة صنف سريع من شاشة المبيعات: " + p.nameAr + " (" + p.code + ")");
    hideModal("mQuickProduct");
    fillPosPicker();
    fillPosDatalist();
    fillPPPicker();
    fillPPDatalist();
    $("#txtPosSearch").value = p.nameAr;
    $("#txtPosPrice").value = fmt(p.salePrice);
    posUpdateBadge(p);
    toast("تم حفظ الصنف (" + p.nameAr + ") برصيد " + qty + " في المخزن.", "success");
  }

  /* ---- إضافة سريعة: عميل ---- */
  function openQuickCustomer() {
    $("#qCCode").value = nextCustomerCode();
    $("#qCName").value = "";
    $("#qCPhone").value = "";
    $("#qCWallet").value = "";
    showModal("mQuickCustomer");
    $("#qCName").focus();
  }

  function saveQuickCustomer() {
    const nameAr = $("#qCName").value.trim();
    if (!nameAr) {
      toast("اسم العميل مطلوب.", "warning");
      return;
    }
    const c = {
      id: nextCustomerId(),
      code: $("#qCCode").value.trim(),
      nameAr: nameAr,
      phone: $("#qCPhone").value.trim(),
      secondaryPhone: "",
      walletPhone: $("#qCWallet").value.trim(),
      address: "",
      notes: "",
      openingBalance: 0,
      currentBalance: 0,
      protected: false
    };
    customers.push(c);
    saveCustomers();
    addActivity("إضافة عميل", "إضافة عميل سريع من شاشة المبيعات: " + c.nameAr + " (" + c.code + ")");
    hideModal("mQuickCustomer");
    renderSalesLookups();
    $("#cmbPosCustomer").value = String(c.id);
    toast("تمت إضافة العميل (" + c.nameAr + ") وتحديده في الفاتورة.", "success");
  }

  /* ================== فواتير المشتريات (التوريد) ================== */
  function nextPurchaseInvoiceNumber() {
    const d = new Date();
    const p = (x) => String(x).padStart(2, "0");
    return "PINV-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + String(purchases.length + 1).padStart(4, "0");
  }

  function renderPurchasesLookups() {
    const supSel = $("#cmbPosSupplier");
    const prevSup = supSel.value;
    supSel.innerHTML = "";
    suppliers.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.nameAr;
      supSel.appendChild(opt);
    });
    if (prevSup && supSel.querySelector('option[value="' + prevSup + '"]')) supSel.value = prevSup;

    const whSel = $("#cmbPPWarehouse");
    const prevWh = whSel.value;
    whSel.innerHTML = "";
    WAREHOUSES.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w;
      opt.textContent = w;
      whSel.appendChild(opt);
    });
    if (prevWh && whSel.querySelector('option[value="' + prevWh + '"]')) whSel.value = prevWh;

    fillPPPicker();
    fillPPDatalist();
  }

  function fillPPPicker() {
    const sel = $("#cmbPPPicker");
    const prev = sel.value;
    sel.innerHTML = "";
    const opt0 = document.createElement("option");
    opt0.value = "0";
    opt0.textContent = "-- اختر صنفاً من المخزن للإضافة --";
    sel.appendChild(opt0);
    products.filter((p) => p.isActive).forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = "[" + p.code + "] " + p.nameAr + " (المخزن: " + Number(p.qty).toLocaleString("en-US") + " " + p.unit + " | شراء: " + fmt(p.purchasePrice) + " ج.م)";
      sel.appendChild(opt);
    });
    sel.value = prev && sel.querySelector('option[value="' + prev + '"]') ? prev : "0";
  }

  function fillPPDatalist() {
    const dl = $("#ppProductsList");
    dl.innerHTML = "";
    products.filter((p) => p.isActive).forEach((p) => {
      [p.nameAr, p.code, p.barcode].forEach((v) => {
        if (!v) return;
        const o = document.createElement("option");
        o.value = v;
        dl.appendChild(o);
      });
    });
  }

  function ppSelectDefaultSupplier() {
    const sel = $("#cmbPosSupplier");
    const def = suppliers.find((s) => s.code === "SUPP-001") || suppliers.find((s) => (s.nameAr || "").includes("نقدي")) || suppliers[0];
    if (def) sel.value = String(def.id);
  }

  function ppUpdateBadge(p) {
    if (!p) {
      $("#sbPName").textContent = "—";
      $("#sbPQty").textContent = "الرصيد: -";
      $("#sbPPrice").textContent = "سعر الشراء المرجعي: -";
      return;
    }
    $("#sbPName").textContent = p.nameAr;
    $("#sbPQty").textContent = "الرصيد: " + Number(p.qty).toLocaleString("en-US") + " " + p.unit;
    $("#sbPPrice").textContent = "سعر الشراء المرجعي: " + fmt(p.purchasePrice) + " ج.م";
  }

  function ppNewInvoice() {
    ppItems = [];
    $("#txtPInvNo").value = nextPurchaseInvoiceNumber();
    $("#dtpPDate").value = todayISO();
    $("#cmbPPaymentMethod").value = "نقداً";
    $("#txtPPDiscount").value = "0";
    $("#txtPPSearch").value = "";
    $("#numPPQty").value = "1";
    $("#txtPPPrice").value = "";
    $("#cmbPPPicker").value = "0";
    ppSelectDefaultSupplier();
    ppPaymentVisibility();
    ppUpdateBadge(null);
    renderPPItems();
    ppRecalc();
  }

  function ppPaymentVisibility() {
    const m = $("#cmbPPaymentMethod").value;
    const isBank = m.includes("بنكي");
    const isWallet = m.includes("محفظة");
    $("#fldPPBank").hidden = !isBank;
    $("#fldPPWallet").hidden = !isWallet;
    const fill = (sel, type) => {
      const s = $(sel);
      s.innerHTML = "";
      treasury.filter((t) => t.type === type).forEach((t) => {
        const o = document.createElement("option");
        o.value = t.id;
        o.textContent = t.name;
        s.appendChild(o);
      });
    };
    if (isBank) fill("#cmbPPBank", "bank");
    if (isWallet) fill("#cmbPPWallet", "wallet");
  }

  function ppOnSearch() {
    const q = $("#txtPPSearch").value.trim();
    if (!q) return;
    const p = findProductFlexible(q);
    if (p) {
      ppUpdateBadge(p);
    }
  }

  function ppPickFromList() {
    const id = parseInt($("#cmbPPPicker").value, 10);
    if (!id) return;
    const p = products.find((x) => x.id === id);
    if (!p) return;
    $("#txtPPSearch").value = p.nameAr;
    ppUpdateBadge(p);
    $("#txtPPPrice").focus();
  }

  function ppAddItem() {
    let q = $("#txtPPSearch").value.trim();
    let prod = q ? findProductFlexible(q) : null;
    if (!prod) {
      const pid = parseInt($("#cmbPPPicker").value, 10);
      if (pid) prod = products.find((p) => p.id === pid);
    }
    if (!prod) {
      toast("لم يتم العثور على صنف يطابق الاسم أو الكود المكتوب.\nيمكنك استخدام زر (➕ إضافة صنف جديد للمخزن).", "warning");
      return;
    }
    if (!prod.isActive) {
      toast("الصنف (" + prod.nameAr + ") معطل وغير متاح للتوريد.", "warning");
      return;
    }
    let qty = parseFloat(String($("#numPPQty").value).replace(/,/g, ""));
    if (!(qty > 0)) qty = 1;
    let price = parseFloat(String($("#txtPPPrice").value).replace(/,/g, ""));
    if (isNaN(price) || price <= 0) {
      toast("اكتب سعر الشراء المتفق عليه مع المورد في خانة «سعر الشراء».", "warning");
      $("#txtPPPrice").focus();
      return;
    }

    const existing = ppItems.find((it) => it.productId === prod.id);
    if (existing) {
      existing.qty = Math.round((existing.qty + qty) * 100) / 100;
    } else {
      ppItems.push({
        productId: prod.id,
        code: prod.code,
        nameAr: prod.nameAr,
        unit: prod.unit,
        qty: qty,
        price: price,
        discount: 0,
        tax: 0,
        total: 0
      });
    }
    $("#txtPPSearch").value = "";
    $("#numPPQty").value = "1";
    $("#txtPPPrice").value = "";
    $("#cmbPPPicker").value = "0";
    ppUpdateBadge(prod);
    renderPPItems();
    ppRecalc();
    $("#txtPPSearch").focus();
  }

  function ppCalcRow(idx) {
    const it = ppItems[idx];
    const sub = Math.max(it.qty * it.price - it.discount, 0);
    it.tax = TAX.enabled ? Math.round(sub * TAX.rate * 100) / 100 : 0;
    it.total = Math.round((sub + it.tax) * 100) / 100;
  }

  function ppRecalc() {
    let sub = 0, tax = 0;
    ppItems.forEach((it, i) => {
      ppCalcRow(i);
      sub += it.qty * it.price - it.discount;
      tax += it.tax;
    });
    sub = Math.round(sub * 100) / 100;
    tax = Math.round(tax * 100) / 100;
    const extra = parseFloat(String($("#txtPPDiscount").value).replace(/,/g, "")) || 0;
    let grand = Math.round((sub + tax - extra) * 100) / 100;
    if (grand < 0) grand = 0;
    $("#lblPPSubTotal").textContent = (TAX.enabled ? "المجموع: " : "الإجمالي: ") + fmt(sub) + " ج.م";
    $("#lblPPTax").textContent = TAX.enabled ? "ضريبة المبيعات (" + Math.round(TAX.rate * 100) + "%): " + fmt(tax) + " ج.م" : "";
    $("#lblPPTax").hidden = !TAX.enabled;
    $("#lblPPTotal").textContent = (TAX.enabled ? "الصافي النهائي: " : "الإجمالي: ") + fmt(grand) + " ج.م";
    return { sub: sub, tax: tax, extra: extra, grand: grand };
  }

  function renderPPItems() {
    const tbody = $("#dgvPItems tbody");
    tbody.innerHTML = "";
    ppItems.forEach((it, i) => {
      ppCalcRow(i);
      const tr = document.createElement("tr");
      tr.dataset.idx = i;
      tr.innerHTML =
        '<td>' + esc(it.code) + '</td>' +
        '<td style="text-align:right">' + esc(it.nameAr) + '</td>' +
        '<td>' + esc(it.unit) + '</td>' +
        '<td><input class="cell-input" data-f="qty" type="text" value="' + esc(it.qty) + '" /></td>' +
        '<td><input class="cell-input" data-f="price" type="text" value="' + fmt(it.price) + '" /></td>' +
        '<td><input class="cell-input" data-f="discount" type="text" value="' + fmt(it.discount) + '" /></td>' +
        '<td class="c-tax">' + fmt(it.tax) + '</td>' +
        '<td class="c-total">' + fmt(it.total) + '</td>' +
        '<td class="cell-actions"><button class="btn small red" type="button" data-f="del">❌</button></td>';
      tr.addEventListener("mouseenter", () => ppUpdateBadge(products.find((p) => p.id === it.productId) || null));
      tbody.appendChild(tr);
    });
  }

  function savePurchaseInvoice() {
    if (ppItems.length === 0) {
      toast("يرجى إضافة أصناف إلى الفاتورة أولاً.", "warning");
      return;
    }
    const methods = ["نقداً", "آجل", "تحويل بنكي", "محافظ إلكترونية"];
    const payment = methods[$("#cmbPPaymentMethod").selectedIndex] || "نقداً";
    const supId = parseInt($("#cmbPosSupplier").value, 10);
    const supplier = suppliers.find((s) => s.id === supId);
    if (!supplier) {
      toast("يرجى اختيار المورد.", "warning");
      return;
    }
    if (payment === "آجل" && supplier.protected) {
      toast("الرجاء اختيار مورد حقيقي للشراء الآجل (لا يمكن ترحيلها للمورد النقدي).", "warning");
      return;
    }
    const warehouse = $("#cmbPPWarehouse").value;
    if (!warehouse) {
      toast("يرجى اختيار المستودع.", "warning");
      return;
    }

    const t = ppRecalc();
    const invoice = {
      id: purchases.reduce((m, x) => Math.max(m, x.id), 0) + 1,
      invoiceNumber: $("#txtPInvNo").value,
      invoiceDate: $("#dtpPDate").value || todayISO(),
      supplierId: supplier.id,
      supplierName: supplier.nameAr,
      warehouse: warehouse,
      paymentMethod: payment,
      treasuryId: null,
      discountAmount: t.extra,
      taxAmount: t.tax,
      subTotal: t.sub,
      grandTotal: t.grand,
      items: ppItems.map((it) => ({ productId: it.productId, code: it.code, nameAr: it.nameAr, unit: it.unit, qty: it.qty, price: it.price, discount: it.discount, tax: it.tax, total: it.total })),
      status: "posted"
    };

    if (payment === "آجل") {
      supplier.currentBalance = Math.round((supplier.currentBalance + t.grand) * 100) / 100;
      supplierTxs.push({ id: supplierTxs.reduce((m, x) => Math.max(m, x.id), 0) + 1, supplierId: supplier.id, date: invoice.invoiceDate, desc: "فاتورة مشتريات آجلة رقم " + invoice.invoiceNumber, debit: t.grand, credit: 0 });
      saveSuppliers();
      saveSupplierTxs();
    } else {
      const type = payment === "تحويل بنكي" ? "bank" : payment === "محافظ إلكترونية" ? "wallet" : "cash";
      const selId = payment === "تحويل بنكي" ? parseInt($("#cmbPPBank").value, 10)
        : payment === "محافظ إلكترونية" ? parseInt($("#cmbPPWallet").value, 10)
        : treasury.find((x) => x.type === "cash") ? treasury.find((x) => x.type === "cash").id : null;
      const tr = treasury.find((x) => x.id === selId && x.type === type) || treasury.find((x) => x.type === type);
      if (tr) {
        tr.balance = Math.round((tr.balance - t.grand) * 100) / 100;
        invoice.treasuryId = tr.id;
        saveTreasury();
      }
    }

    ppItems.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return;
      const oldQty = Number(p.qty) || 0;
      const oldCost = Number(p.weightedAvgCost) || 0;
      const newQty = oldQty + it.qty;
      p.weightedAvgCost = Math.round(((oldCost * oldQty) + (it.price * it.qty)) / newQty * 100) / 100;
      p.qty = Math.round(newQty * 100) / 100;
      p.purchasePrice = it.price;
    });
    saveProducts();

    purchases.push(invoice);
    savePurchases();
    addActivity("فاتورة مشتريات", "فاتورة " + invoice.invoiceNumber + " - " + supplier.nameAr + " - " + fmt(t.grand) + " ج.م (" + payment + ")");

    toast("تم حفظ وتأكيد فاتورة المشتريات بنجاح برقم (" + invoice.invoiceNumber + ").", "success");
    printPurchaseInvoice(invoice);
    fillPPPicker();
    fillPPDatalist();
    ppNewInvoice();
  }

  function printPurchaseInvoice(inv) {
    $("#ppInvNo").textContent = inv.invoiceNumber;
    $("#ppDate").textContent = inv.invoiceDate;
    $("#ppSuppPrint").textContent = inv.supplierName;
    $("#ppWhPrint").textContent = inv.warehouse;
    $("#ppPayPrint").textContent = inv.paymentMethod;
    const tb = $("#ppBody");
    tb.innerHTML = "";
    inv.items.forEach((it) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(it.code) + '</td>' +
        '<td style="text-align:right">' + esc(it.nameAr) + '</td>' +
        '<td>' + esc(it.unit) + '</td>' +
        '<td>' + esc(Number(it.qty).toLocaleString("en-US")) + '</td>' +
        '<td>' + fmt(it.price) + '</td>' +
        '<td>' + fmt(it.discount) + '</td>' +
        '<td>' + fmt(it.tax) + '</td>' +
        '<td>' + fmt(it.total) + '</td>';
      tb.appendChild(tr);
    });
    $("#ppFoot").innerHTML =
      "المجموع: <b>" + fmt(inv.subTotal) + " ج.م</b> | الخصم الإضافي: <b>" + fmt(inv.discountAmount) + " ج.م</b> | " +
      "الضريبة: <b>" + fmt(inv.taxAmount) + " ج.م</b> | الصافي النهائي: <b>" + fmt(inv.grandTotal) + " ج.م</b>";
    printSection($("#purchasePage"));
  }

  /* ---- إضافة سريعة: مورد ---- */
  function openQuickSupplier() {
    $("#qSCode").value = nextSupplierCode();
    $("#qSName").value = "";
    $("#qSPhone").value = "";
    $("#qSWallet").value = "";
    showModal("mQuickSupplier");
    $("#qSName").focus();
  }

  function saveQuickSupplier() {
    const nameAr = $("#qSName").value.trim();
    if (!nameAr) {
      toast("اسم المورد مطلوب.", "warning");
      return;
    }
    const s = {
      id: nextSupplierId(),
      code: $("#qSCode").value.trim(),
      nameAr: nameAr,
      phone: $("#qSPhone").value.trim(),
      walletPhone: $("#qSWallet").value.trim(),
      address: "",
      notes: "",
      openingBalance: 0,
      currentBalance: 0,
      protected: false
    };
    suppliers.push(s);
    saveSuppliers();
    addActivity("إضافة مورد", "إضافة مورد سريع من شاشة المشتريات: " + s.nameAr + " (" + s.code + ")");
    hideModal("mQuickSupplier");
    renderPurchasesLookups();
    $("#cmbPosSupplier").value = String(s.id);
    toast("تمت إضافة المورد (" + s.nameAr + ") وتحديده في الفاتورة.", "success");
  }

  /* ================== أدوات عامة ================== */
  function downloadCSV(filename, rows) {
    const csv = rows.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function printStatementDoc(opts) {
    $("#stmName").textContent = opts.name;
    $("#stmCode").textContent = opts.code;
    $("#stmRange").textContent = opts.range;
    const bal = $("#stmBal");
    bal.textContent = fmt(opts.balance);
    bal.className = opts.balance > 0 ? "balance-debit" : "balance-credit";
    const tb = $("#stmBody");
    tb.innerHTML = "";
    if (!opts.rows || opts.rows.length === 0) {
      tb.innerHTML = '<tr><td colspan="5">لا توجد حركات على هذا الحساب.</td></tr>';
    } else {
      opts.rows.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td>' + esc(r.date) + '</td>' +
          '<td style="text-align:right">' + esc(r.desc) + '</td>' +
          '<td>' + (r.debit ? fmt(r.debit) : "-") + '</td>' +
          '<td>' + (r.credit ? fmt(r.credit) : "-") + '</td>' +
          '<td class="' + (r.balance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(r.balance) + '</td>';
        tb.appendChild(tr);
      });
    }
    printSection($("#statementPage"));
  }

  /* ================== دليل الموردين ================== */
  let suppEditingId = null;
  let actionsSupp = null;
  let paySuppPreselected = null;

  function renderSuppliers() {
    const tbody = $("#dgvSuppliers tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtSupplierSearch").value);
    suppliers
      .filter((s) => {
        if (!q) return true;
        return (
          normalizeAr(s.code).includes(q) ||
          normalizeAr(s.nameAr).includes(q) ||
          normalizeAr(s.phone).includes(q) ||
          normalizeAr(s.walletPhone).includes(q) ||
          normalizeAr(s.address).includes(q) ||
          normalizeAr(s.notes).includes(q) ||
          fmt(s.currentBalance).includes(q)
        );
      })
      .forEach((s) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(s.code) + '</td>' +
          '<td>' + esc(s.nameAr) + '</td>' +
          '<td>' + esc(s.phone || "-") + '</td>' +
          '<td>' + esc(s.walletPhone || "-") + '</td>' +
          '<td title="' + esc(s.address || "") + '">' + esc(s.address || "-") + '</td>' +
          '<td class="' + (s.currentBalance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(s.currentBalance) + ' ج.م</td>';
        tr.dataset.sid = s.id;
        tr.addEventListener("dblclick", () => openSuppActions(s));
        tr.addEventListener("click", () => {
          document.querySelectorAll("#dgvSuppliers tbody tr").forEach((r) => r.classList.remove("sel"));
          tr.classList.add("sel");
        });
        tbody.appendChild(tr);
      });
  }

  function openSuppAddEdit(supplier) {
    suppEditingId = supplier ? supplier.id : null;
    $("#suppAddEditTitle").textContent = supplier ? "✏️ تعديل بيانات المورد" : "إضافة مورد جديد";
    $("#fSCode").value = supplier ? supplier.code : nextSupplierCode();
    $("#fSName").value = supplier ? supplier.nameAr : "";
    $("#fSPhone").value = supplier ? (supplier.phone || "") : "";
    $("#fSWallet").value = supplier ? (supplier.walletPhone || "") : "";
    $("#fSAddress").value = supplier ? (supplier.address || "") : "";
    $("#fSNotes").value = supplier ? (supplier.notes || "") : "";
    $("#fSOpening").value = supplier ? fmt(supplier.openingBalance || 0) : "0.00";
    showModal("mSuppAddEdit");
    $("#fSName").focus();
  }

  function saveSupplier() {
    const name = $("#fSName").value.trim();
    if (!name) {
      toast("اسم المورد مطلوب.", "warning");
      return;
    }
    if (suppEditingId) {
      const s = suppliers.find((x) => x.id === suppEditingId);
      s.code = $("#fSCode").value.trim();
      s.nameAr = name;
      s.phone = $("#fSPhone").value.trim();
      s.walletPhone = $("#fSWallet").value.trim();
      s.address = $("#fSAddress").value.trim();
      s.notes = $("#fSNotes").value.trim();
      s.openingBalance = parseFloat($("#fSOpening").value) || 0;
      saveSuppliers();
      addActivity("تعديل مورد", "تعديل بيانات المورد: " + s.nameAr);
      toast("تم حفظ التعديلات بنجاح.", "success");
    } else {
      const opening = parseFloat($("#fSOpening").value) || 0;
      const s = {
        id: nextSupplierId(),
        code: $("#fSCode").value.trim() || nextSupplierCode(),
        nameAr: name,
        phone: $("#fSPhone").value.trim(),
        walletPhone: $("#fSWallet").value.trim(),
        address: $("#fSAddress").value.trim(),
        notes: $("#fSNotes").value.trim(),
        openingBalance: opening,
        currentBalance: opening,
        protected: false
      };
      suppliers.push(s);
      if (opening > 0) {
        supplierTxs.push({ id: supplierTxs.reduce((m, x) => Math.max(m, x.id), 0) + 1, supplierId: s.id, date: todayISO(), desc: "رصيد افتتاحي (مستحق للمورد)", debit: opening, credit: 0 });
        saveSupplierTxs();
      }
      saveSuppliers();
      addActivity("إضافة مورد", "إضافة مورد جديد: " + s.nameAr + " (" + s.code + ")");
      toast("تمت إضافة المورد بنجاح.", "success");
    }
    hideModal("mSuppAddEdit");
    renderSuppliers();
  }

  function getSupplierStatement(sup) {
    const rows = supplierTxs
      .filter((t) => t.supplierId === sup.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    let run = (parseFloat(sup.openingBalance) || 0);
    return rows.map((t) => {
      run = Math.round((run + t.debit - t.credit) * 100) / 100;
      return { date: t.date, desc: t.desc, debit: t.debit, credit: t.credit, balance: run };
    });
  }

  function openSuppActions(s) {
    actionsSupp = s;
    $("#sactTitle").textContent = "📦 إدارة المورد: " + s.nameAr + " (" + s.code + ")";
    $("#sactName").textContent = "📦 المورد: " + s.nameAr;
    $("#sactDetails1").textContent = "الكود: " + s.code + " | الهاتف: " + (s.phone || "-");
    $("#sactDetails2").textContent = "العنوان: " + (s.address || "-") + " | ملاحظات: " + (s.notes || "-");
    const bal = $("#sactBalance");
    bal.textContent = "الرصيد الحالي (المستحق): " + fmt(s.currentBalance) + " ج.م";
    bal.className = "act-bal " + (s.currentBalance > 0 ? "balance-debit" : "balance-credit");
    showModal("mSuppActions");
  }

  function openSupplierStatement(s) {
    statementCtx = { type: "supplier", obj: s };
    const rows = getSupplierStatement(s);
    const mini = $("#stmBodyMini");
    $("#stmTitle").textContent = "📋 كشف حساب تفصيلي: " + s.nameAr;
    $("#stmHeadMini").innerHTML =
      "الكود: <b>" + esc(s.code) + "</b> | الفترة: <b>" + dateRange() + "</b> | " +
      "الرصيد الحالي: <b class=\"" + (s.currentBalance > 0 ? "balance-debit" : "balance-credit") + "\">" + fmt(s.currentBalance) + " ج.م</b>";
    mini.innerHTML = "";
    if (!rows.length) {
      mini.innerHTML = '<tr><td colspan="5">لا توجد حركات على حساب هذا المورد.</td></tr>';
    } else {
      rows.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td>' + esc(r.date) + '</td>' +
          '<td style="text-align:right">' + esc(r.desc) + '</td>' +
          '<td>' + (r.debit ? fmt(r.debit) : "-") + '</td>' +
          '<td>' + (r.credit ? fmt(r.credit) : "-") + '</td>' +
          '<td class="' + (r.balance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(r.balance) + '</td>';
        mini.appendChild(tr);
      });
    }
    showModal("mStatement");
  }

  function printSupplierStatement(s) {
    printStatementDoc({
      name: s.nameAr,
      code: s.code,
      range: dateRange(),
      balance: s.currentBalance,
      rows: getSupplierStatement(s)
    });
  }

  function openPaySuppDebt(supplier) {
    paySuppPreselected = supplier || null;
    const sel = $("#psSupplier");
    sel.innerHTML = "";
    suppliers.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.nameAr + " (المستحق: " + fmt(s.currentBalance) + " ج.م)";
      sel.appendChild(opt);
    });
    if (paySuppPreselected) sel.value = String(paySuppPreselected.id);
    $("#psMethod").value = "نقداً 💵";
    $("#psAmount").value = "";
    $("#psNotes").value = "سداد دفعة نقداً من حساب المورد";
    applyTreasuryFilterSupp();
    showModal("mPaySuppDebt");
  }

  function applyTreasuryFilterSupp() {
    const method = $("#psMethod").value;
    const type = method.includes("بنكي") ? "bank" : method.includes("محفظة") ? "wallet" : "cash";
    const sel = $("#psTreasury");
    sel.innerHTML = "";
    treasury.filter((t) => t.type === type).forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
  }

  function savePaySupplement() {
    const sid = parseInt($("#psSupplier").value, 10);
    if (!sid) {
      toast("يرجى اختيار المورد.", "warning");
      return;
    }
    const amount = parseFloat($("#psAmount").value);
    if (!(amount > 0)) {
      toast("يرجى كتابة مبلغ صحيح أكبر من الصفر.", "warning");
      return;
    }
    const supp = suppliers.find((s) => s.id === sid);
    supp.currentBalance = Math.round((supp.currentBalance - amount) * 100) / 100;
    const trId = parseInt($("#psTreasury").value, 10);
    const tr = treasury.find((x) => x.id === trId);
    if (tr) {
      tr.balance = Math.round((tr.balance - amount) * 100) / 100;
      saveTreasury();
    }
    supplierTxs.push({
      id: supplierTxs.reduce((m, x) => Math.max(m, x.id), 0) + 1,
      supplierId: sid,
      date: todayISO(),
      desc: $("#psNotes").value.trim() || "سداد مستحقات مورد",
      debit: 0,
      credit: amount
    });
    saveSuppliers();
    saveSupplierTxs();
    hideModal("mPaySuppDebt");
    addActivity("سداد مورد", "سداد مستحقات " + supp.nameAr + " بمبلغ " + fmt(amount) + " ج.م");
    toast("تم تسجيل السداد بنجاح.", "success");
    renderSuppliers();
  }

  /* ================== استعلام عن الفواتير ================== */
  function renderInvoiceQuery() {
    const fromS = $("#dtpFromS").value || "2000-01-01";
    const toS = $("#dtpToS").value || "2999-12-31";
    const fromP = $("#dtpFromP").value || "2000-01-01";
    const toP = $("#dtpToP").value || "2999-12-31";

    const inRange = (d, from, to) => (d || "") >= from && (d || "") <= to;

    const fill = (tbody, list, isSales) => {
      tbody.innerHTML = "";
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="7">لا توجد فواتير في هذه الفترة.</td></tr>';
        return;
      }
      list.forEach((inv) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(inv.invoiceNumber) + '</td>' +
          '<td>' + esc(inv.invoiceDate) + '</td>' +
          '<td>' + esc(isSales ? inv.customerName : inv.supplierName) + '</td>' +
          '<td>' + fmt(inv.grandTotal) + ' ج.م</td>' +
          '<td>' + esc(inv.paymentMethod) + '</td>' +
          '<td class="cell-actions"><button class="btn small sky" type="button" data-act="print">🖨️ طباعة</button></td>';
        tr.dataset.iid = inv.id;
        tr.dataset.typ = isSales ? "s" : "p";
        tbody.appendChild(tr);
      });
    };

    const qs = normalizeAr($("#txtSearchInvS").value);
    const qp = normalizeAr($("#txtSearchInvP").value);
    const match = (inv, q, name) => {
      if (!q) return true;
      return normalizeAr(inv.invoiceNumber).includes(q) || normalizeAr(name).includes(q) || normalizeAr(inv.paymentMethod).includes(q) || fmt(inv.grandTotal).includes(q);
    };

    fill($("#dgvInvS tbody"), sales.filter((i) => inRange(i.invoiceDate, fromS, toS)).filter((i) => match(i, qs, i.customerName)), true);
    fill($("#dgvInvP tbody"), purchases.filter((i) => inRange(i.invoiceDate, fromP, toP)).filter((i) => match(i, qp, i.supplierName)), false);
  }

  /* ================== الخزينة والمصروفات ================== */
  let treasuryEditingId = null;
  let voucherMode = "in";

  function renderTreasury() {
    const tbody = $("#dgvTreasury tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtTreSearch").value);
    const totals = treasuryAmounts();
    treasury
      .filter((t) => {
        if (!q) return true;
        return normalizeAr(t.name).includes(q) || normalizeAr(t.accountNo || "").includes(q);
      })
      .forEach((t) => {
        const tr = document.createElement("tr");
        const typeName = t.type === "cash" ? "صندوق نقدي 💵" : t.type === "bank" ? "حساب بنكي 🏛️" : "محفظة 📱";
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(t.name) + '</td>' +
          '<td>' + typeName + '</td>' +
          '<td>' + esc(t.accountNo || (t.type === "bank" ? "—" : t.type === "wallet" ? (t.phone || "—") : "—")) + '</td>' +
          '<td class="' + (t.balance > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(t.balance) + ' ج.م</td>' +
          '<td>' + fmt(totals[t.id].in) + '</td>' +
          '<td>' + fmt(totals[t.id].out) + '</td>' +
          '<td class="cell-actions"><button class="btn small blue" type="button" data-act="edit">✏️</button></td>';
        tr.dataset.tid = t.id;
        tbody.appendChild(tr);
      });
  }

  function treasuryAmounts() {
    const map = {};
    treasury.forEach((t) => (map[t.id] = { in: 0, out: 0 }));
    sales.filter((s) => s.treasuryId && s.paymentMethod !== "آجل").forEach((s) => { if (map[s.treasuryId]) map[s.treasuryId].in += s.grandTotal; });
    purchases.filter((p) => p.treasuryId && p.paymentMethod !== "آجل").forEach((p) => { if (map[p.treasuryId]) map[p.treasuryId].out += p.grandTotal; });
    vouchers.forEach((v) => { if (map[v.treasuryId]) { if (v.type === "in") map[v.treasuryId].in += v.amount; else map[v.treasuryId].out += v.amount; } });
    Object.keys(map).forEach((k) => { map[k].in = Math.round(map[k].in * 100) / 100; map[k].out = Math.round(map[k].out * 100) / 100; });
    return map;
  }

  function openTreasuryDialog(t) {
    treasuryEditingId = t ? t.id : null;
    $("#treasuryModalTitle").textContent = t ? "✏️ تعديل الخزينة" : "➕ إضافة خزينة / حساب";
    $("#tName").value = t ? t.name : "";
    $("#tType").value = t ? t.type : "cash";
    $("#tAccountNo").value = t ? (t.accountNo || "") : "";
    $("#tOpening").value = t ? fmt(t.openingBalance || 0) : "0.00";
    showModal("mTreasury");
    $("#tName").focus();
  }

  function saveTreasuryModal() {
    const name = $("#tName").value.trim();
    if (!name) {
      toast("اسم الخزينة مطلوب.", "warning");
      return;
    }
    const type = $("#tType").value;
    if (treasuryEditingId) {
      const t = treasury.find((x) => x.id === treasuryEditingId);
      t.name = name;
      t.type = type;
      t.accountNo = $("#tAccountNo").value.trim();
      saveTreasury();
      addActivity("تعديل خزينة", "تعديل بيانات الخزينة: " + name);
      toast("تم حفظ التعديلات بنجاح.", "success");
    } else {
      const t = {
        id: treasury.reduce((m, x) => Math.max(m, x.id), 0) + 1,
        name: name,
        type: type,
        accountNo: $("#tAccountNo").value.trim(),
        openingBalance: parseFloat($("#tOpening").value) || 0,
        balance: parseFloat($("#tOpening").value) || 0
      };
      treasury.push(t);
      saveTreasury();
      addActivity("إضافة خزينة", "إضافة خزينة جديدة: " + name);
      toast("تمت إضافة الخزينة بنجاح.", "success");
    }
    hideModal("mTreasury");
    renderTreasury();
  }

  function openVoucher(mode) {
    voucherMode = mode;
    $("#voucherTitle").textContent = mode === "in" ? "➕ سند قبض (إيراد)" : "➖ سند صرف (مصروف)";
    const sel = $("#vTreasury");
    sel.innerHTML = "";
    treasury.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
    $("#vDate").value = todayISO();
    $("#vAmount").value = "";
    $("#vDesc").value = mode === "in" ? "إيراد (سند قبض)" : "مصروف (سند صرف)";
    showModal("mVoucher");
    $("#vAmount").focus();
  }

  function saveVoucher() {
    const tid = parseInt($("#vTreasury").value, 10);
    const amount = parseFloat($("#vAmount").value);
    if (!tid) {
      toast("يرجى اختيار الخزينة.", "warning");
      return;
    }
    if (!(amount > 0)) {
      toast("يرجى كتابة مبلغ صحيح أكبر من الصفر.", "warning");
      return;
    }
    const t = treasury.find((x) => x.id === tid);
    const sign = voucherMode === "in" ? 1 : -1;
    t.balance = Math.round((t.balance + sign * amount) * 100) / 100;
    vouchers.push({
      id: vouchers.reduce((m, x) => Math.max(m, x.id), 0) + 1,
      type: voucherMode,
      treasuryId: tid,
      date: $("#vDate").value || todayISO(),
      amount: Math.round(amount * 100) / 100,
      desc: $("#vDesc").value.trim() || (voucherMode === "in" ? "إيراد" : "مصروف")
    });
    saveTreasury();
    saveVouchers();
    hideModal("mVoucher");
    addActivity(voucherMode === "in" ? "سند قبض" : "سند صرف", (voucherMode === "in" ? "قبض إيراد" : "صرف مصروف") + " بمبلغ " + fmt(amount) + " ج.م (" + t.name + ")");
    toast("تم حفظ السند بنجاح.", "success");
    renderTreasury();
    renderTreMoves();
  }

  function renderTreMoves() {
    const moves = [];
    sales.filter((s) => s.treasuryId).forEach((s) => moves.push({ date: s.invoiceDate, name: (treasury.find((t) => t.id === s.treasuryId) || {}).name || "-", desc: "فاتورة مبيعات " + s.invoiceNumber, in: s.grandTotal, out: 0 }));
    purchases.filter((p) => p.treasuryId).forEach((p) => moves.push({ date: p.invoiceDate, name: (treasury.find((t) => t.id === p.treasuryId) || {}).name || "-", desc: "فاتورة مشتريات " + p.invoiceNumber, in: 0, out: p.grandTotal }));
    vouchers.forEach((v) => moves.push({ date: v.date, name: (treasury.find((t) => t.id === v.treasuryId) || {}).name || "-", desc: v.desc, in: v.type === "in" ? v.amount : 0, out: v.type === "out" ? v.amount : 0 }));
    moves.sort((a, b) => new Date(b.date) - new Date(a.date));
    const tbody = $("#dgvTreMoves tbody");
    tbody.innerHTML = "";
    moves.slice(0, 60).forEach((m) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(m.date) + '</td>' +
        '<td>' + esc(m.name) + '</td>' +
        '<td style="text-align:right">' + esc(m.desc) + '</td>' +
        '<td>' + (m.in ? fmt(m.in) : "-") + '</td>' +
        '<td>' + (m.out ? fmt(m.out) : "-") + '</td>';
      tbody.appendChild(tr);
    });
    if (!moves.length) tbody.innerHTML = '<tr><td colspan="5">لا توجد حركات بعد.</td></tr>';
  }

  /* ================== دليل الحسابات ================== */
  let editingAccountId = null;

  function nextAccountId() {
    return accounts.reduce((m, a) => Math.max(m, a.id), 0) + 1;
  }

  function nextAccountCode() {
    return "ACC-" + String(accounts.length + 1).padStart(3, "0");
  }

  function renderAccounts() {
    const tbody = $("#dgvAccounts tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtAccountSearch").value);
    accounts
      .filter((a) => {
        if (!q) return true;
        return normalizeAr(a.code).includes(q) || normalizeAr(a.nameAr).includes(q) || normalizeAr(a.type).includes(q);
      })
      .forEach((a) => {
        const parent = accounts.find((p) => p.id === a.parentId);
        const typeName = a.type === "asset" ? "أصل" : a.type === "liability" ? "التزام" : a.type === "equity" ? "حقوق ملكية" : a.type === "revenue" ? "إيراد" : "مصروف";
        const debit = a.type === "asset" || a.type === "expense";
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(a.code) + '</td>' +
          '<td>' + esc(a.nameAr) + '</td>' +
          '<td>' + typeName + '</td>' +
          '<td>' + esc(parent ? parent.nameAr : "—") + '</td>' +
          '<td class="' + (debit ? "balance-debit" : "balance-credit") + '">' + fmt(a.openingBalance || 0) + (debit ? " (مدين)" : " (دائن)") + '</td>' +
          '<td>' + (a.isActive ? "نشط 🟢" : "غير نشط 🔴") + '</td>';
        tr.dataset.aid = a.id;
        tr.addEventListener("dblclick", () => openAccountDialog(a));
        tbody.appendChild(tr);
      });
  }

  function openAccountDialog(a) {
    editingAccountId = a ? a.id : null;
    $("#accountModalTitle").textContent = a ? "✏️ تعديل الحساب" : "➕ إضافة حساب";
    $("#aCode").value = a ? a.code : nextAccountCode();
    $("#aName").value = a ? a.nameAr : "";
    $("#aType").value = a ? a.type : "asset";
    const sel = $("#aParent");
    sel.innerHTML = '<option value="0">— بدون حساب أب —</option>';
    accounts.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.code + " - " + p.nameAr;
      sel.appendChild(opt);
    });
    sel.value = a ? String(a.parentId || 0) : "0";
    $("#aOpening").value = a ? fmt(a.openingBalance || 0) : "0.00";
    $("#aActive").value = a ? (a.isActive ? "1" : "0") : "1";
    showModal("mAccount");
    $("#aName").focus();
  }

  function saveAccount() {
    const name = $("#aName").value.trim();
    if (!name) {
      toast("اسم الحساب مطلوب.", "warning");
      return;
    }
    const type = $("#aType").value;
    const opening = parseFloat($("#aOpening").value) || 0;
    if (editingAccountId) {
      const a = accounts.find((x) => x.id === editingAccountId);
      a.code = $("#aCode").value.trim();
      a.nameAr = name;
      a.type = type;
      a.parentId = parseInt($("#aParent").value, 10) || 0;
      a.openingBalance = opening;
      a.isActive = $("#aActive").value === "1";
      saveAccounts();
      toast("تم حفظ التعديلات بنجاح.", "success");
    } else {
      accounts.push({
        id: nextAccountId(),
        code: $("#aCode").value.trim() || nextAccountCode(),
        nameAr: name,
        type: type,
        parentId: parseInt($("#aParent").value, 10) || 0,
        openingBalance: opening,
        isActive: $("#aActive").value === "1"
      });
      saveAccounts();
      toast("تمت إضافة الحساب بنجاح.", "success");
    }
    hideModal("mAccount");
    renderAccounts();
  }

  /* ================== القيود اليومية ================== */
  let jrnLines = [];
  let journalEditingId = null;

  function renderJournal() {
    const tbody = $("#dgvJournal tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtJournalSearch").value);
    const list = journalEntries.filter((j) => {
      if (!q) return true;
      return normalizeAr(j.number).includes(q) || normalizeAr(j.desc).includes(q) || normalizeAr(j.ref).includes(q);
    });
    list.forEach((j) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td hidden></td>' +
        '<td>' + esc(j.number) + '</td>' +
        '<td>' + esc(j.date) + '</td>' +
        '<td style="text-align:right">' + esc(j.desc) + '</td>' +
        '<td>' + fmt(j.debit) + '</td>' +
        '<td>' + fmt(j.credit) + '</td>' +
        '<td>' + esc(j.ref) + '</td>';
      tr.addEventListener("dblclick", () => {
        if (confirm("هل تريد طباعة كشف القيد رقم (" + j.number + ")؟")) {
          printStatementDoc({
            name: "قيد يومية " + j.number,
            code: j.ref,
            range: j.date,
            balance: 0,
            rows: [
              { date: j.date, desc: "إجمالي المديون (قيد " + j.number + ")", debit: j.debit, credit: 0, balance: j.debit },
              { date: j.date, desc: "إجمالي الدائن (قيد " + j.number + ")", debit: 0, credit: j.credit, balance: 0 }
            ]
          });
        }
      });
      tbody.appendChild(tr);
    });
    if (!list.length) tbody.innerHTML = '<tr><td colspan="7">لا توجد قيود بعد.</td></tr>';
  }

  function openJournal() {
    journalEditingId = null;
    $("#jDate").value = todayISO();
    $("#jDesc").value = "";
    $("#jRef").value = "قيد يدوي";
    jrnLines = [{ accountId: "0", debit: "", credit: "" }, { accountId: "0", debit: "", credit: "" }];
    renderJrnLines();
    showModal("mJournal");
    $("#jDesc").focus();
  }

  function renderJrnLines() {
    const box = $("#jrnLines");
    box.innerHTML = "";
    jrnLines.forEach((line, i) => {
      const div = document.createElement("div");
      div.className = "jrn-line";
      const sel = document.createElement("select");
      sel.dataset.i = i;
      sel.dataset.f = "accountId";
      sel.innerHTML = '<option value="0">— اختر الحساب —</option>';
      accounts.filter((a) => a.parentId !== 0 && a.isActive).forEach((a) => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = a.code + " - " + a.nameAr;
        sel.appendChild(opt);
      });
      sel.value = String(line.accountId);
      const dIn = document.createElement("input");
      dIn.dataset.i = i; dIn.dataset.f = "debit"; dIn.type = "text"; dIn.value = line.debit;
      const dOut = document.createElement("input");
      dOut.dataset.i = i; dOut.dataset.f = "credit"; dOut.type = "text"; dOut.value = line.credit;
      const btn = document.createElement("button");
      btn.className = "btn small red"; btn.type = "button"; btn.textContent = "❌";
      btn.addEventListener("click", () => {
        jrnLines.splice(i, 1);
        if (!jrnLines.length) jrnLines.push({ accountId: "0", debit: "", credit: "" });
        renderJrnLines();
      });
      div.appendChild(sel); div.appendChild(dIn); div.appendChild(dOut); div.appendChild(btn);
      box.appendChild(div);
    });
    $("#jrnSum").textContent = jrnSummary();
  }

  function jrnSummary() {
    let d = 0, c = 0;
    jrnLines.forEach((l) => {
      d += parseFloat(l.debit) || 0;
      c += parseFloat(l.credit) || 0;
    });
    d = Math.round(d * 100) / 100; c = Math.round(c * 100) / 100;
    const ok = Math.abs(d - c) < 0.01;
    return "المديون: " + fmt(d) + " | الدائن: " + fmt(c) + " | " + (ok ? "✓ متوازن" : "✗ غير متوازن (الفرق " + fmt(Math.abs(d - c)) + ")");
  }

  function saveJournal() {
    const desc = $("#jDesc").value.trim();
    if (!desc) {
      toast("بيان القيد مطلوب.", "warning");
      return;
    }
    let d = 0, c = 0;
    for (const l of jrnLines) {
      const aid = parseInt(l.accountId, 10);
      if (!aid) {
        toast("يرجى اختيار حساب لكل سطر.", "warning");
        return;
      }
      d += parseFloat(l.debit) || 0;
      c += parseFloat(l.credit) || 0;
    }
    d = Math.round(d * 100) / 100; c = Math.round(c * 100) / 100;
    if (d <= 0 && c <= 0) {
      toast("أدخل مبالغ للقيد.", "warning");
      return;
    }
    if (Math.abs(d - c) > 0.01) {
      toast("القيد غير متوازن: المديون " + fmt(d) + " والدائن " + fmt(c) + ".", "warning");
      return;
    }
    const j = {
      id: journalEntries.reduce((m, x) => Math.max(m, x.id), 0) + 1,
      number: "JRN-" + String(journalEntries.length + 1).padStart(4, "0"),
      date: $("#jDate").value || todayISO(),
      desc: desc,
      ref: $("#jRef").value.trim() || "قيد يدوي",
      debit: d,
      credit: c,
      lines: jrnLines.map((l) => ({ accountId: parseInt(l.accountId, 10), debit: parseFloat(l.debit) || 0, credit: parseFloat(l.credit) || 0 }))
    };
    const dAccount = accounts.find((a) => a.id === j.lines[0].accountId);
    const cAccount = accounts.find((a) => a.id === j.lines[j.lines.length - 1].accountId);
    if (dAccount) dAccount.openingBalance = Math.round(((dAccount.openingBalance || 0) + d) * 100) / 100;
    if (cAccount && cAccount.id !== dAccount.id) cAccount.openingBalance = Math.round(((cAccount.openingBalance || 0) - c) * 100) / 100;
    journalEntries.push(j);
    persistJournal();
    saveAccounts();
    hideModal("mJournal");
    addActivity("قيد يومية", "قيد " + j.number + " - " + j.desc + " - " + fmt(d) + " ج.م");
    toast("تم حفظ القيد بنجاح (" + j.number + ").", "success");
    renderJournal();
  }

  /* ================== قائمة المركز المالي ================== */
  function renderBalance() {
    const d = new Date();
    const p = (x) => String(x).padStart(2, "0");
    $("#balDate").textContent = p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();

    const treasuryTotal = treasury.reduce((m, t) => m + (t.balance || 0), 0);
    const custDebts = customers.reduce((m, c) => m + Math.max(c.currentBalance || 0, 0), 0);
    const invValue = products.reduce((m, pr) => m + (pr.qty || 0) * (pr.weightedAvgCost || 0), 0);
    const suppDebts = suppliers.reduce((m, s) => m + Math.max(s.currentBalance || 0, 0), 0);
    const taxLiability = sales.reduce((m, s) => m + (s.taxAmount || 0), 0) - purchases.reduce((m, p2) => m + (p2.taxAmount || 0), 0);
    const capital = accounts.filter((a) => a.type === "equity").reduce((m, a) => m + (a.openingBalance || 0), 0);
    const profits = sales.reduce((m, s) => m + (s.grandTotal || 0), 0) - purchases.reduce((m, p2) => m + (p2.grandTotal || 0), 0) - vouchers.filter((v) => v.type === "out").reduce((m, v) => m + v.amount, 0) + vouchers.filter((v) => v.type === "in").reduce((m, v) => m + v.amount, 0);

    const assets = [
      ["الصناديق والبنوك والمحافظ", treasuryTotal],
      ["مديونيات العملاء", custDebts],
      ["المخزون (بالتكلفة المرجحة)", invValue],
      ["مصروفات مقدمة ومدينون آخرون", 0]
    ];
    const liab = [
      ["مستحقات الموردين", suppDebts],
      ["ضريبة المبيعات المستحقة", Math.max(taxLiability, 0)],
      ["رأس المال وحقوق الملكية", capital],
      ["أرباح الدورة (محققة)", Math.round(profits * 100) / 100]
    ];

    const ta = Math.round(assets.reduce((m, r) => m + r[1], 0) * 100) / 100;
    const tl = Math.round(liab.reduce((m, r) => m + r[1], 0) * 100) / 100;

    const fill = (tbodyId, rows, total) => {
      const tb = $(tbodyId);
      tb.innerHTML = "";
      rows.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td>' + esc(r[0]) + '</td><td>' + fmt(r[1]) + '</td>';
        tb.appendChild(tr);
      });
      const tr = document.createElement("tr");
      tr.innerHTML = '<td><b>الإجمالي</b></td><td><b>' + fmt(total) + '</b></td>';
      tr.style.fontWeight = "bold";
      tb.appendChild(tr);
    };
    fill("#dgvBalAssets tbody", assets, ta);
    fill("#dgvBalLiab tbody", liab, tl);

    const ok = Math.abs(ta - tl) < 0.01;
    $("#balResult").textContent = ok ? "الميزان متوازن ✓" : "فرق الميزان: " + fmt(Math.abs(ta - tl)) + " ج.م (يُعالج عبر القيود اليومية)";
    $("#balResult").className = "ft-total " + (ok ? "balance-credit" : "balance-debit");
  }

  function printBalance() {
    $("#blpOrg").textContent = settings.orgName || "مؤسستي";
    $("#blpDate").textContent = $("#balDate").textContent;
    const ta = $("#dgvBalAssets tbody").innerHTML;
    const tl = $("#dgvBalLiab tbody").innerHTML;
    $("#blpAssets").innerHTML = ta;
    $("#blpLiab").innerHTML = tl;
    $("#blpFoot").innerHTML = $("#balResult").textContent;
    printSection($("#balancePage"));
  }

  /* ================== كشوف حسابات الخزائن ================== */
  function renderTreStmt() {
    const sel = $("#cmbTreStmt");
    const prev = sel.value;
    sel.innerHTML = "";
    treasury.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
    if (prev && sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
    const tid = parseInt(sel.value, 10) || (treasury[0] ? treasury[0].id : 0);
    const t = treasury.find((x) => x.id === tid);
    if (!t) {
      $("#dgvTreStmt tbody").innerHTML = '<tr><td colspan="5">لا توجد خزائن.</td></tr>';
      $("#treStmtBal").textContent = "";
      return;
    }

    const moves = [];
    moves.push({ date: "بداية", desc: "الرصيد الافتتاحي", in: t.openingBalance > 0 ? t.openingBalance : 0, out: 0 });
    sales.filter((s) => s.treasuryId === tid).forEach((s) => moves.push({ date: s.invoiceDate, desc: "فاتورة مبيعات " + s.invoiceNumber, in: s.grandTotal, out: 0 }));
    purchases.filter((p) => p.treasuryId === tid).forEach((p) => moves.push({ date: p.invoiceDate, desc: "فاتورة مشتريات " + p.invoiceNumber, in: 0, out: p.grandTotal }));
    vouchers.filter((v) => v.treasuryId === tid).forEach((v) => moves.push({ date: v.date, desc: v.desc, in: v.type === "in" ? v.amount : 0, out: v.type === "out" ? v.amount : 0 }));
    moves.sort((a, b) => (a.date === "بداية" ? -1 : b.date === "بداية" ? 1 : new Date(a.date) - new Date(b.date)));

    let run = 0;
    const rows = moves.map((m) => {
      run = Math.round((run + (m.in || 0) - (m.out || 0)) * 100) / 100;
      return { date: m.date, desc: m.desc, in: m.in, out: m.out, run: run };
    });

    const tb = $("#dgvTreStmt tbody");
    tb.innerHTML = "";
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(r.date) + '</td>' +
        '<td style="text-align:right">' + esc(r.desc) + '</td>' +
        '<td>' + (r.in ? fmt(r.in) : "-") + '</td>' +
        '<td>' + (r.out ? fmt(r.out) : "-") + '</td>' +
        '<td class="' + (r.run > 0 ? "balance-debit" : "balance-credit") + '">' + fmt(r.run) + '</td>';
      tb.appendChild(tr);
    });
    $("#treStmtBal").textContent = " | الرصيد الحالي: " + fmt(t.balance) + " ج.م";
  }

  function printTreStmt() {
    const t = treasury.find((x) => x.id === parseInt($("#cmbTreStmt").value, 10));
    if (!t) return;
    $("#trpName").textContent = t.name;
    $("#trpBase").textContent = t.type === "cash" ? "صندوق نقدي" : t.type === "bank" ? "حساب بنكي" : "محفظة إلكترونية";
    $("#trpBal").textContent = fmt(t.balance);
    $("#trpBody").innerHTML = $("#dgvTreStmt tbody").innerHTML;
    $("#trpFoot").innerHTML = "الرصيد الحالي: <b>" + fmt(t.balance) + " ج.م</b>";
    printSection($("#treStmtPage"));
  }

  /* ================== التقارير ================== */
  function renderReports() {
    const from = $("#dtpRepFrom").value || "2000-01-01";
    const to = $("#dtpRepTo").value || "2999-12-31";
    const inRange = (d) => (d || "") >= from && (d || "") <= to;

    const agg = (list, isSales) => {
      const map = new Map();
      list.filter((i) => inRange(i.invoiceDate)).forEach((inv) => {
        (inv.items || []).forEach((it) => {
          const key = it.nameAr;
          const cur = map.get(key) || { qty: 0, val: 0 };
          cur.qty += it.qty;
          cur.val += it.total;
          map.set(key, cur);
        });
      });
      return [...map.entries()].map(([name, v]) => ({ name: name, qty: Math.round(v.qty * 100) / 100, val: Math.round(v.val * 100) / 100 })).sort((a, b) => b.val - a.val);
    };

    const aggParty = (list, isSales) => {
      const map = new Map();
      list.filter((i) => inRange(i.invoiceDate)).forEach((inv) => {
        const name = isSales ? inv.customerName : inv.supplierName;
        const cur = map.get(name) || { count: 0, val: 0 };
        cur.count += 1;
        cur.val += inv.grandTotal;
        map.set(name, cur);
      });
      return [...map.entries()].map(([name, v]) => ({ name: name, count: v.count, val: Math.round(v.val * 100) / 100 })).sort((a, b) => b.val - a.val);
    };

    const fill = (tbodyId, rows, cols) => {
      const tb = $(tbodyId);
      tb.innerHTML = "";
      if (!rows.length) {
        tb.innerHTML = '<tr><td colspan="' + cols + '">لا توجد بيانات.</td></tr>';
        return;
      }
      rows.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td>' + esc(r.name) + '</td><td>' + esc(r.qty != null ? Number(r.qty).toLocaleString("en-US") : r.count) + '</td><td>' + fmt(r.val) + '</td>';
        tb.appendChild(tr);
      });
    };

    fill("#dgvRepSales tbody", agg(sales, true).slice(0, 15), 3);
    fill("#dgvRepPurch tbody", agg(purchases, false).slice(0, 15), 3);
    fill("#dgvRepCust tbody", aggParty(sales, true), 3);
    fill("#dgvRepSupp tbody", aggParty(purchases, false), 3);

    const sTot = sales.filter((i) => inRange(i.invoiceDate)).reduce((m, i) => m + (i.grandTotal || 0), 0);
    const pTot = purchases.filter((i) => inRange(i.invoiceDate)).reduce((m, i) => m + (i.grandTotal || 0), 0);
    $("#repSummary").textContent = " | إجمالي المبيعات: " + fmt(sTot) + " ج.م | إجمالي المشتريات: " + fmt(pTot) + " ج.م";
  }

  function exportReports() {
    const from = $("#dtpRepFrom").value || "2000-01-01";
    const to = $("#dtpRepTo").value || "2999-12-31";
    const rows = [["صنف", "الكمية", "القيمة"]];
    $("#dgvRepSales tbody tr").forEach((tr) => rows.push([tr.cells[0].textContent, tr.cells[1].textContent, tr.cells[2].textContent]));
    downloadCSV("reports-" + from + "_" + to + ".csv", rows);
    toast("تم تنزيل ملف Excel للتقارير.", "success");
  }

  /* ================== المستخدمون والصلاحيات ================== */
  let editingUserId = null;

  function renderUsers() {
    const tbody = $("#dgvUsers tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtUserSearch").value);
    users
      .filter((u) => {
        if (!q) return true;
        return normalizeAr(u.username).includes(q) || normalizeAr(u.fullName).includes(q) || normalizeAr(u.role).includes(q);
      })
      .forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td hidden></td>' +
          '<td>' + esc(u.username) + '</td>' +
          '<td>' + esc(u.fullName) + '</td>' +
          '<td>' + esc(u.role) + '</td>' +
          '<td>' + esc(u.branch || "الفرع الرئيسي") + '</td>' +
          '<td>' + (u.isActive ? "نشط 🟢" : "موقوف 🔴") + '</td>' +
          '<td>' + esc(u.lastSeen || "—") + '</td>' +
          '<td><button class="btn small blue" type="button" data-act="edit">✏️</button>' +
          ' <button class="btn small ' + (u.username === "admin" ? "gray" : "red") + '" type="button" data-act="toggle">' + (u.username === "admin" ? "🔒" : (u.isActive ? "⏸" : "▶")) + '</button></td>';
        tr.dataset.uid = u.id;
        tbody.appendChild(tr);
      });
    if (!users.length) tbody.innerHTML = '<tr><td colspan="8">لا يوجد مستخدمون.</td></tr>';
  }

  function openUserDialog(u) {
    editingUserId = u ? u.id : null;
    $("#userModalTitle").textContent = u ? "✏️ تعديل مستخدم" : "➕ إضافة مستخدم";
    $("#uUsername").value = u ? u.username : "";
    $("#uFullName").value = u ? u.fullName : "";
    $("#uPassword").value = u ? u.password : "";
    $("#uRole").value = u ? u.role : "موظف مبيعات";
    const sel = $("#uBranch");
    sel.innerHTML = "";
    ["الفرع الرئيسي", "فرع المنصورة", "فرع الزقازيق"].forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      sel.appendChild(opt);
    });
    sel.value = u ? (u.branch || "الفرع الرئيسي") : "الفرع الرئيسي";
    $("#uActive").value = u ? (u.isActive ? "1" : "0") : "1";
    showModal("mUser");
    $("#uUsername").focus();
  }

  function saveUser() {
    const username = $("#uUsername").value.trim();
    const fullName = $("#uFullName").value.trim();
    if (!username || !fullName) {
      toast("اسم المستخدم والاسم الكامل مطلوبان.", "warning");
      return;
    }
    if (editingUserId) {
      const u = users.find((x) => x.id === editingUserId);
      u.username = username;
      u.fullName = fullName;
      if ($("#uPassword").value.trim()) u.password = $("#uPassword").value.trim();
      u.role = $("#uRole").value;
      u.branch = $("#uBranch").value;
      u.isActive = $("#uActive").value === "1";
      saveUsers();
      toast("تم حفظ التعديلات بنجاح.", "success");
    } else {
      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        toast("اسم المستخدم موجود بالفعل.", "warning");
        return;
      }
      users.push({
        id: users.reduce((m, x) => Math.max(m, x.id), 0) + 1,
        username: username,
        fullName: fullName,
        password: $("#uPassword").value.trim() || "123456",
        role: $("#uRole").value,
        branch: $("#uBranch").value,
        isActive: $("#uActive").value === "1",
        lastSeen: ""
      });
      saveUsers();
      addActivity("إضافة مستخدم", "إضافة مستخدم جديد: " + username + " (" + $("#uRole").value + ")");
      toast("تمت إضافة المستخدم بنجاح.", "success");
    }
    hideModal("mUser");
    renderUsers();
  }

  function toggleUser(id) {
    const u = users.find((x) => x.id === id);
    if (!u || u.username === "admin") return;
    u.isActive = !u.isActive;
    saveUsers();
    toast("تم " + (u.isActive ? "تفعيل" : "إيقاف") + " المستخدم (" + u.username + ").", "success");
    renderUsers();
  }

  /* ================== سجل العمليات ================== */
  function renderAudit() {
    const tbody = $("#dgvAudit tbody");
    tbody.innerHTML = "";
    const q = normalizeAr($("#txtAuditSearch").value);
    const list = activity.filter((a) => {
      if (!q) return true;
      return normalizeAr(a.ts).includes(q) || normalizeAr(a.user).includes(q) || normalizeAr(a.action).includes(q) || normalizeAr(a.desc).includes(q);
    });
    list.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + esc(a.ts) + '</td>' +
        '<td>' + esc(a.user) + '</td>' +
        '<td>' + esc(a.action) + '</td>' +
        '<td style="text-align:right">' + esc(a.desc) + '</td>';
      tbody.appendChild(tr);
    });
    if (!list.length) tbody.innerHTML = '<tr><td colspan="4">لا توجد عمليات.</td></tr>';
  }

  function exportAudit() {
    const rows = [["الوقت", "المستخدم", "العملية", "البيان"]];
    $("#dgvAudit tbody tr").forEach((tr) => rows.push(Array.from(tr.cells || []).map((c) => c.textContent)));
    downloadCSV("audit-log.csv", rows);
    toast("تم تنزيل سجل العمليات.", "success");
  }

  /* ================== الإعدادات والنسخ الاحتياطي ================== */
  function loadSettingsForm() {
    $("#setOrgName").value = settings.orgName || "";
    $("#setOrgPhone").value = settings.orgPhone || "";
    $("#setOrgAddress").value = settings.orgAddress || "";
    $("#setOrgVat").value = settings.orgVat || "";
    $("#setOrgNote").value = settings.orgNote || "";
    $("#setTaxEnabled").value = settings.taxEnabled == null ? "1" : String(settings.taxEnabled ? 1 : 0);
    $("#setTaxRate").value = settings.taxRate == null ? "14" : String(settings.taxRate * 100);
    $("#setPlan").value = settings.plan || "فردي (مستخدم واحد)";
    $("#setPlanEnd").value = settings.planEnd || "";
    $("#setPlanStatus").value = settings.planStatus || "تجربة 🧪";
    $("#setPublishUrl").value = settings.publishUrl || "https://adelsamir699-maker.github.io/";
  }

  function saveSettingsForm() {
    settings.orgName = $("#setOrgName").value.trim();
    settings.orgPhone = $("#setOrgPhone").value.trim();
    settings.orgAddress = $("#setOrgAddress").value.trim();
    settings.orgVat = $("#setOrgVat").value.trim();
    settings.orgNote = $("#setOrgNote").value.trim();
    settings.taxEnabled = $("#setTaxEnabled").value === "1";
    settings.taxRate = (parseFloat($("#setTaxRate").value) || 0) / 100;
    settings.plan = $("#setPlan").value;
    settings.planEnd = $("#setPlanEnd").value;
    settings.planStatus = $("#setPlanStatus").value;
    settings.publishUrl = $("#setPublishUrl").value.trim();
    TAX.enabled = settings.taxEnabled;
    TAX.rate = settings.taxRate;
    saveSettings();
    addActivity("إعدادات", "تعديل إعدادات البرنامج");
    toast("تم حفظ الإعدادات بنجاح.", "success");
  }

  function backupData() {
    const pack = {
      exportedAt: new Date().toISOString(),
      settings: settings,
      customers: customers,
      txs: txs,
      products: products,
      sales: sales,
      purchases: purchases,
      treasury: treasury,
      suppliers: suppliers,
      supplierTxs: supplierTxs,
      accounts: accounts,
      journalEntries: journalEntries,
      users: users,
      vouchers: vouchers,
      activity: activity
    };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mizan-web-backup-" + todayISO() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    addActivity("نسخ احتياطي", "تصدير نسخة احتياطية كاملة من البيانات");
    toast("تم تنزيل النسخة الاحتياطية (JSON).", "success");
  }

  function restoreData(jsonStr) {
    try {
      const o = JSON.parse(jsonStr);
      const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));
      set(LS_SETTINGS, o.settings || defaultSettings);
      set(LS_CUSTOMERS, o.customers || []);
      set(LS_TXS, o.txs || []);
      set(LS_PRODUCTS, o.products || []);
      set(LS_SALES, o.sales || []);
      set(LS_PURCHASES, o.purchases || []);
      set(LS_TREASURY, o.treasury || seedTreasury);
      set(LS_SUPPLIERS, o.suppliers || []);
      set(LS_SUP_TXS, o.supplierTxs || []);
      set(LS_ACCOUNTS, o.accounts || seedAccounts);
      set(LS_JOURNAL, o.journalEntries || []);
      set(LS_USERS, o.users || seedUsers);
      set(LS_VOUCHERS, o.vouchers || []);
      set(LS_ACTIVITY, o.activity || []);
      loadData();
      toast("تمت استعادة النسخة الاحتياطية بنجاح.", "success");
      showView("dashboard");
    } catch (e) {
      toast("الملف غير صالح أو تالف.", "warning");
    }
  }

  function resetData() {
    if (!confirm("سيتم مسح جميع البيانات المحفوظة في المتصفح والعودة للبيانات التجريبية. هل أنت متأكد؟")) return;
    [
      LS_CUSTOMERS, LS_TXS, LS_PRODUCTS, LS_SALES, LS_PURCHASES, LS_TREASURY,
      LS_SUPPLIERS, LS_SUP_TXS, LS_ACCOUNTS, LS_JOURNAL, LS_USERS, LS_VOUCHERS, LS_ACTIVITY, LS_SETTINGS
    ].forEach((k) => localStorage.removeItem(k));
    loadData();
    toast("تم مسح البيانات والعودة للوضع التجريبي.", "success");
    showView("dashboard");
  }

  /* ================== الساعة ================== */
  function tickClock() {
    const d = new Date();
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const p = (x) => String(x).padStart(2, "0");
    $("#clock").textContent =
      days[d.getDay()] + "، " + p(d.getDate()) + " " + months[d.getMonth()] + " " + d.getFullYear() +
      "  -  " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  /* ================== الربط ================== */
  function init() {
    loadData();
    tickClock();
    setInterval(tickClock, 1000);
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    ["dtpFromS", "dtpFromP", "dtpRepFrom"].forEach((id) => { if ($("#" + id)) $("#" + id).value = iso(d30); });
    ["dtpToS", "dtpToP", "dtpRepTo"].forEach((id) => { if ($("#" + id)) $("#" + id).value = todayISO(); });
    showView("dashboard");

    $("#btnRefresh").addEventListener("click", renderDashboard);

    $("#btnAddCustomer").addEventListener("click", () => openAddEdit(null));
    $("#btnPayCustDebt").addEventListener("click", () => openPayDebt(null));
    $("#txtCustomerSearch").addEventListener("input", renderTable);

    $("#btnSaveCustomer").addEventListener("click", saveCustomer);
    $("#btnCancelAdd").addEventListener("click", () => hideModal("mAddEdit"));

    $("#pMethod").addEventListener("change", () => {
      applyTreasuryFilter();
      updateWalletFields();
    });
    $("#pCust").addEventListener("change", updateWalletFields);
    $("#btnSavePay").addEventListener("click", savePay);
    $("#btnCancelPay").addEventListener("click", () => hideModal("mPayDebt"));

    $("#actEdit").addEventListener("click", () => {
      hideModal("mActions");
      openAddEdit(actionsCust);
    });
    $("#actStatement").addEventListener("click", () => {
      hideModal("mActions");
      openStatement(actionsCust);
    });
    $("#actPay").addEventListener("click", () => {
      hideModal("mActions");
      openPayDebt(actionsCust);
    });
    $("#actInvoice").addEventListener("click", () => {
      hideModal("mActions");
      openSalesForCustomer(actionsCust);
    });
    $("#actDelete").addEventListener("click", () => {
      const cust = actionsCust;
      if (cust.protected) {
        toast("لا يمكن حذف العميل النقدي (كاش) - محمي بالنظام.", "warning");
        return;
      }
      if (txs.some((t) => t.customerId === cust.id && t.credit > 0)) {
        toast("لا يمكن حذف العميل لوجود حركات على حسابه.", "warning");
        return;
      }
      if (confirm("هل أنت متأكد من حذف العميل (" + cust.nameAr + ")؟")) {
        customers = customers.filter((c) => c.id !== cust.id);
        saveCustomers();
        hideModal("mActions");
        toast("تم حذف العميل بنجاح.", "success");
        renderTable();
      }
    });
    $("#actClose").addEventListener("click", () => hideModal("mActions"));

    $("#btnPrintStmt").addEventListener("click", () => {
      if (statementCtx && statementCtx.type === "supplier") {
        printSupplierStatement(statementCtx.obj);
      } else {
        printStatement(actionsCust);
      }
    });
    $("#btnCloseStmt").addEventListener("click", () => hideModal("mStatement"));

    $("#btnAddProduct").addEventListener("click", () => openProductDialog(null));
    $("#btnStockTake").addEventListener("click", openStockTake);
    $("#btnRefreshProducts").addEventListener("click", renderProducts);
    $("#txtProductSearch").addEventListener("input", renderProducts);
    $("#cmbProductCategory").addEventListener("change", renderProducts);

    $("#btnSaveProduct").addEventListener("click", saveProduct);
    $("#btnCancelProduct").addEventListener("click", () => hideModal("mProduct"));

    $("#stkWarehouse").addEventListener("change", renderStockTake);
    $("#btnStkReload").addEventListener("click", renderStockTake);
    $("#btnApplyStockTake").addEventListener("click", saveStockTake);
    $("#btnCloseStockTake").addEventListener("click", () => hideModal("mStockTake"));
    $("#btnExportStockTake").addEventListener("click", exportStockTakeCSV);
    $("#btnPrintStockTake").addEventListener("click", printStockTake);
    $("#dgvStockTake tbody").addEventListener("input", (e) => {
      if (e.target.classList.contains("stk-qty-input")) computeStockDiff(e.target);
    });

    $("#btnQuickAddProduct").addEventListener("click", openQuickProduct);
    $("#btnQuickAddCust").addEventListener("click", openQuickCustomer);
    $("#btnSaveQuickProduct").addEventListener("click", saveQuickProduct);
    $("#btnCancelQuickProduct").addEventListener("click", () => hideModal("mQuickProduct"));
    $("#btnSaveQuickCustomer").addEventListener("click", saveQuickCustomer);
    $("#btnCancelQuickCustomer").addEventListener("click", () => hideModal("mQuickCustomer"));

    $("#cmbPaymentMethod").addEventListener("change", posPaymentVisibility);
    $("#cmbPosPicker").addEventListener("change", posPickFromList);
    $("#txtPosSearch").addEventListener("input", posOnSearch);
    $("#txtPosSearch").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); posAddItem(); }
    });
    $("#numPosQty").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); posAddItem(); }
    });
    $("#txtPosPrice").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); posAddItem(); }
    });
    $("#btnPosAdd").addEventListener("click", posAddItem);
    $("#btnPosNew").addEventListener("click", posNewInvoice);
    $("#btnPosSave").addEventListener("click", savePosInvoice);
    $("#txtPosDiscount").addEventListener("input", posRecalc);

    $("#dgvItems tbody").addEventListener("input", (e) => {
      const inp = e.target.closest(".cell-input");
      if (!inp) return;
      const tr = inp.closest("tr");
      const idx = parseInt(tr.dataset.idx, 10);
      const f = inp.dataset.f;
      const v = parseFloat(String(inp.value).replace(/,/g, ""));
      posItems[idx][f] = isNaN(v) ? 0 : v;
      posCalcRow(idx);
      tr.querySelector(".c-tax").textContent = fmt(posItems[idx].tax);
      tr.querySelector(".c-total").textContent = fmt(posItems[idx].total);
      posRecalc();
    });

    $("#dgvItems tbody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-f="del"]');
      if (!btn) return;
      const idx = parseInt(btn.closest("tr").dataset.idx, 10);
      posItems.splice(idx, 1);
      renderPosItems();
      posRecalc();
    });

    $("#btnPQuickAddProduct").addEventListener("click", openQuickProduct);
    $("#btnPQuickAddSupp").addEventListener("click", openQuickSupplier);
    $("#btnSaveQuickSupplier").addEventListener("click", saveQuickSupplier);
    $("#btnCancelQuickSupplier").addEventListener("click", () => hideModal("mQuickSupplier"));

    $("#cmbPPaymentMethod").addEventListener("change", ppPaymentVisibility);
    $("#cmbPPPicker").addEventListener("change", ppPickFromList);
    $("#txtPPSearch").addEventListener("input", ppOnSearch);
    $("#txtPPSearch").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); ppAddItem(); }
    });
    $("#numPPQty").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); ppAddItem(); }
    });
    $("#txtPPPrice").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); ppAddItem(); }
    });
    $("#btnPPAdd").addEventListener("click", ppAddItem);
    $("#btnPPNew").addEventListener("click", ppNewInvoice);
    $("#btnPPSave").addEventListener("click", savePurchaseInvoice);
    $("#txtPPDiscount").addEventListener("input", ppRecalc);

    $("#dgvPItems tbody").addEventListener("input", (e) => {
      const inp = e.target.closest(".cell-input");
      if (!inp) return;
      const tr = inp.closest("tr");
      const idx = parseInt(tr.dataset.idx, 10);
      const f = inp.dataset.f;
      const v = parseFloat(String(inp.value).replace(/,/g, ""));
      ppItems[idx][f] = isNaN(v) ? 0 : v;
      ppCalcRow(idx);
      tr.querySelector(".c-tax").textContent = fmt(ppItems[idx].tax);
      tr.querySelector(".c-total").textContent = fmt(ppItems[idx].total);
      ppRecalc();
    });

    $("#dgvPItems tbody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-f="del"]');
      if (!btn) return;
      const idx = parseInt(btn.closest("tr").dataset.idx, 10);
      ppItems.splice(idx, 1);
      renderPPItems();
      ppRecalc();
    });

    /* ---- الموردون ---- */
    $("#btnAddSupplier").addEventListener("click", () => openSuppAddEdit(null));
    $("#btnPaySuppDebt").addEventListener("click", () => openPaySuppDebt(null));
    $("#txtSupplierSearch").addEventListener("input", renderSuppliers);
    $("#btnSaveSupplier").addEventListener("click", saveSupplier);
    $("#btnCancelSuppAdd").addEventListener("click", () => hideModal("mSuppAddEdit"));
    $("#sactEdit").addEventListener("click", () => {
      hideModal("mSuppActions");
      openSuppAddEdit(actionsSupp);
    });
    $("#sactStatement").addEventListener("click", () => {
      hideModal("mSuppActions");
      openSupplierStatement(actionsSupp);
    });
    $("#sactPay").addEventListener("click", () => {
      hideModal("mSuppActions");
      openPaySuppDebt(actionsSupp);
    });
    $("#sactDelete").addEventListener("click", () => {
      const s = actionsSupp;
      if (s.protected) {
        toast("لا يمكن حذف المورد النقدي (كاش) - محمي بالنظام.", "warning");
        return;
      }
      if (supplierTxs.some((t) => t.supplierId === s.id)) {
        toast("لا يمكن حذف المورد لوجود حركات على حسابه.", "warning");
        return;
      }
      if (confirm("هل أنت متأكد من حذف المورد (" + s.nameAr + ")؟")) {
        suppliers = suppliers.filter((x) => x.id !== s.id);
        saveSuppliers();
        hideModal("mSuppActions");
        toast("تم حذف المورد بنجاح.", "success");
        renderSuppliers();
      }
    });
    $("#sactClose").addEventListener("click", () => hideModal("mSuppActions"));
    $("#psMethod").addEventListener("change", applyTreasuryFilterSupp);
    $("#btnSaveSupPay").addEventListener("click", savePaySupplement);
    $("#btnCancelSupPay").addEventListener("click", () => hideModal("mPaySuppDebt"));

    /* ---- الاستعلام عن الفواتير ---- */
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const t = btn.dataset.tab;
        $("#tabS").hidden = t !== "s";
        $("#tabP").hidden = t !== "p";
      });
    });
    ["dtpFromS", "dtpToS", "txtSearchInvS"].forEach((id) => $("#" + id).addEventListener("input", renderInvoiceQuery));
    ["dtpFromP", "dtpToP", "txtSearchInvP"].forEach((id) => $("#" + id).addEventListener("input", renderInvoiceQuery));
    $("#btnRefreshInvoices").addEventListener("click", renderInvoiceQuery);
    $("#dgvInvS tbody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-act="print"]');
      if (!btn) return;
      const tr = btn.closest("tr");
      const inv = sales.find((x) => x.id === parseInt(tr.dataset.iid, 10));
      if (inv) printInvoice(inv);
    });
    $("#dgvInvP tbody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-act="print"]');
      if (!btn) return;
      const tr = btn.closest("tr");
      const inv = purchases.find((x) => x.id === parseInt(tr.dataset.iid, 10));
      if (inv) printPurchaseInvoice(inv);
    });

    /* ---- الخزينة ---- */
    $("#btnAddTreasury").addEventListener("click", () => openTreasuryDialog(null));
    $("#btnVoucherIn").addEventListener("click", () => openVoucher("in"));
    $("#btnVoucherOut").addEventListener("click", () => openVoucher("out"));
    $("#txtTreSearch").addEventListener("input", renderTreasury);
    $("#btnSaveTreasury").addEventListener("click", saveTreasuryModal);
    $("#btnCancelTreasury").addEventListener("click", () => hideModal("mTreasury"));
    $("#btnSaveVoucher").addEventListener("click", saveVoucher);
    $("#btnCancelVoucher").addEventListener("click", () => hideModal("mVoucher"));
    $("#dgvTreasury tbody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-act="edit"]');
      if (!btn) return;
      const t = treasury.find((x) => x.id === parseInt(btn.closest("tr").dataset.tid, 10));
      if (t) openTreasuryDialog(t);
    });
    $("#tType").addEventListener("change", () => {
      const type = $("#tType").value;
      $("#tAccountNo").placeholder = type === "bank" ? "رقم الحساب البنكي..." : type === "wallet" ? "رقم المحفظة..." : "غير مطلوب للصندوق";
    });

    /* ---- الحسابات ---- */
    $("#btnAddAccount").addEventListener("click", () => openAccountDialog(null));
    $("#txtAccountSearch").addEventListener("input", renderAccounts);
    $("#btnSaveAccount").addEventListener("click", saveAccount);
    $("#btnCancelAccount").addEventListener("click", () => hideModal("mAccount"));

    /* ---- القيود اليومية ---- */
    $("#btnAddJournal").addEventListener("click", openJournal);
    $("#txtJournalSearch").addEventListener("input", renderJournal);
    $("#btnAddJLine").addEventListener("click", () => {
      jrnLines.push({ accountId: "0", debit: "", credit: "" });
      renderJrnLines();
    });
    $("#jrnLines").addEventListener("input", (e) => {
      const el = e.target;
      if (el.dataset.i == null) return;
      const idx = parseInt(el.dataset.i, 10);
      jrnLines[idx][el.dataset.f] = el.dataset.f === "accountId" ? el.value : String(el.value);
      $("#jrnSum").textContent = jrnSummary();
    });
    $("#btnSaveJournal").addEventListener("click", saveJournal);
    $("#btnCancelJournal").addEventListener("click", () => hideModal("mJournal"));

    /* ---- المركز المالي ---- */
    $("#btnRefreshBalance").addEventListener("click", renderBalance);
    $("#btnPrintBalance").addEventListener("click", printBalance);

    /* ---- كشوف الخزائن ---- */
    $("#cmbTreStmt").addEventListener("change", renderTreStmt);
    $("#btnPrintTreStmt").addEventListener("click", printTreStmt);

    /* ---- التقارير ---- */
    $("#btnRefreshReports").addEventListener("click", renderReports);
    $("#btnExportReports").addEventListener("click", exportReports);
    $("#dtpRepFrom").addEventListener("input", renderReports);
    $("#dtpRepTo").addEventListener("input", renderReports);

    /* ---- المستخدمون ---- */
    $("#btnAddUser").addEventListener("click", () => openUserDialog(null));
    $("#txtUserSearch").addEventListener("input", renderUsers);
    $("#btnSaveUser").addEventListener("click", saveUser);
    $("#btnCancelUser").addEventListener("click", () => hideModal("mUser"));
    $("#dgvUsers tbody").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = parseInt(btn.closest("tr").dataset.uid, 10);
      if (btn.dataset.act === "edit") {
        const u = users.find((x) => x.id === id);
        if (u) openUserDialog(u);
      } else {
        toggleUser(id);
      }
    });

    /* ---- سجل العمليات ---- */
    $("#txtAuditSearch").addEventListener("input", renderAudit);
    $("#btnExportAudit").addEventListener("click", exportAudit);

    /* ---- الإعدادات ---- */
    $("#btnSaveSettings").addEventListener("click", saveSettingsForm);
    $("#btnBackup").addEventListener("click", backupData);
    $("#btnResetData").addEventListener("click", resetData);
    $("#btnRestore").addEventListener("click", () => $("#fileRestore").click());
    $("#fileRestore").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => restoreData(String(ev.target.result));
      reader.readAsText(f);
      e.target.value = "";
    });

    document.querySelectorAll(".modal-overlay").forEach((ov) => {
      ov.addEventListener("click", (e) => {
        if (e.target === ov) ov.hidden = true;
      });
    });

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.view;
        if (BUILT_VIEWS.includes(name)) {
          showView(name);
        } else {
          toast("شاشة «" + btn.textContent.trim() + "» قيد التطوير 🚧 - ستصل قريبًا.", "info");
        }
      });
    });

    document.addEventListener("click", (e) => {
      const tr = e.target.closest("tr.dgv-row") || e.target.closest("#dgvCustomers tbody tr");
      // (التحديد يتم داخل renderTable نفسه)
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();