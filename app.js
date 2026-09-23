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

  /* ================== الحالة ================== */
  let customers = [];
  let txs = [];
  let products = [];
  let activity = [];
  let sales = [];
  let treasury = [];
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
    } catch (e) {
      customers = seedCustomers;
      txs = seedTxs;
      products = seedProducts.map(normalizeProduct);
      activity = seedActivity;
      sales = [];
      treasury = seedTreasury;
    }
    if (!localStorage.getItem(LS_CUSTOMERS)) saveCustomers();
    if (!localStorage.getItem(LS_TXS)) saveTxs();
    if (!localStorage.getItem(LS_PRODUCTS)) saveProducts();
    if (!localStorage.getItem(LS_ACTIVITY)) saveActivity();
    if (!localStorage.getItem(LS_SALES)) saveSales();
    if (!localStorage.getItem(LS_TREASURY)) saveTreasury();
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

  /* ================== الروترة بين الشاشات ================== */
  const BUILT_VIEWS = ["dashboard", "customers", "products"];

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
  }

  /* ================== لوحة التحكم ================== */
  function renderDashboard() {
    $("#kSales").textContent = fmt(8450.0) + " ج.م";
    $("#kPurchases").textContent = fmt(3200.0) + " ج.م";
    $("#kExpenses").textContent = fmt(450.0) + " ج.م";
    $("#kProfit").textContent = fmt(1230.5) + " ج.م";
    $("#kTreasury").textContent = fmt(25000.0) + " ج.م";

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
    window.print();
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
    window.print();
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
      toast("🧾 شاشة فواتير المبيعات قادمة قريبًا في نسخة الويب.", "info");
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
      printStatement(actionsCust);
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