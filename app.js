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

  /* ================== الحالة ================== */
  let customers = [];
  let txs = [];
  let editingId = null;

  /* ================== أدوات ================== */
  const $ = (sel) => document.querySelector(sel);

  function loadData() {
    try {
      customers = JSON.parse(localStorage.getItem(LS_CUSTOMERS)) || seedCustomers;
      txs = JSON.parse(localStorage.getItem(LS_TXS)) || seedTxs;
    } catch (e) {
      customers = seedCustomers;
      txs = seedTxs;
    }
    if (!localStorage.getItem(LS_CUSTOMERS)) saveCustomers();
    if (!localStorage.getItem(LS_TXS)) saveTxs();
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
  const TREASURIES = {
    cash: [{ id: 1, label: "الصندوق الرئيسي (نقدي)" }],
    bank: [{ id: 2, label: "البنك الأهلي المصري (1234567890)" }],
    wallet: [{ id: 3, label: "محفظة فودافون كاش (01002655282)" }]
  };

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
    const list = method.includes("بنكي") ? TREASURIES.bank : method.includes("محفظة") ? TREASURIES.wallet : TREASURIES.cash;
    const sel = $("#pTreasury");
    sel.innerHTML = "";
    list.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.label;
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
    renderTable();

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

    document.querySelectorAll(".modal-overlay").forEach((ov) => {
      ov.addEventListener("click", (e) => {
        if (e.target === ov) ov.hidden = true;
      });
    });

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;
        toast("هذه الشاشة قيد التطوير 🚧 - ستصل قريبًا.", "info");
      });
    });

    document.addEventListener("click", (e) => {
      const tr = e.target.closest("tr.dgv-row") || e.target.closest("#dgvCustomers tbody tr");
      // (التحديد يتم داخل renderTable نفسه)
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();