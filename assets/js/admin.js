document.addEventListener('DOMContentLoaded', () => {
  const { auth, db, FirebaseFirestore, FirebaseAuth } = window;
  const { onSnapshot, collection, query, orderBy, updateDoc, doc, getDoc, setDoc } = FirebaseFirestore;
  const { onAuthStateChanged, signOut } = FirebaseAuth;

  let allOrders = [];
  let games = [
    { id: 'ml', name: 'Mobile Legends', image: 'mobile-legend.jpg', status: '💎 Top Up Instan' },
    { id: 'ff', name: 'Free Fire', image: 'free-fire.jpg', status: '🔥 Top Up Instan' },
    { id: 'pubg', name: 'PUBG Mobile', image: 'pubg-mobile.jpg', status: '🔫 Top Up Instan' },
    { id: 'roblox', name: 'Roblox', image: 'roblox.jpg', status: '🎮 Top Up Instan' },
    { id: 'genshin', name: 'Genshin Impact', image: 'genshin-impact.jpg', status: '✨ Top Up Instan' },
    { id: 'telegram', name: 'TELEGRAM STARS', image: 'telegram-stars.jpg', status: '⭐ Top Up Instan' },
    { id: 'redfinger', name: 'REDFINGER VOUCHER', image: 'redfinger-voucher.jpg', status: '🎟️ Top Up Instan' },
    { id: 'ewallet', name: 'Top Up E-Wallet', image: 'e-wallet.svg', status: '💳 Top Up Instan' }
  ];
  let prices = {};

  // --- Auth Guard ---
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'index.html';
    } else {
      initAdmin();
    }
  });

  function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.style.cssText = `
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  async function initAdmin() {
    setupRealtimeOrders();
    await loadSettings();
    setupEventListeners();
    document.getElementById('adminLoadingOverlay').style.display = 'none';
    showNotification('Admin Dashboard siap.');
  }

  function setupRealtimeOrders() {
    const q = query(collection(db, 'orders'), orderBy('updatedAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      calculateAdminStats();
      renderAdminOrders();
    });
  }

  async function loadSettings() {
    const settingsDoc = await getDoc(doc(db, 'settings', 'product_data'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (data.prices) prices = data.prices;
      if (data.games) {
        data.games.forEach(savedGame => {
          const index = games.findIndex(g => g.id === savedGame.id);
          if (index !== -1) Object.assign(games[index], savedGame);
        });
      }
    }
    renderAdminProducts();
  }

  function calculateAdminStats() {
    const now = new Date();
    const todayStr = now.toDateString();
    const monthYearStr = now.getMonth() + '-' + now.getFullYear();

    const stats = {
      total: allOrders.length,
      berhasil: 0,
      proses: 0,
      gagal: 0,
      omzet: 0,
      modal: 0,
      omzetToday: 0,
      profitToday: 0,
      omzetMonth: 0,
      profitMonth: 0,
      products: {}
    };

    allOrders.forEach(order => {
      const price = parseInt(order.price.replace(/[^0-9]/g, '')) || 0;
      const modal = parseInt(order.modal) || 0;
      const profit = order.status === 'berhasil' ? (price - modal) : 0;

      if (order.status === 'berhasil') {
        stats.berhasil++;
        stats.omzet += price;
        stats.modal += modal;

        const orderDate = order.updatedAt?.toDate ? order.updatedAt.toDate() : new Date(order.order_date);
        if (orderDate.toDateString() === todayStr) {
          stats.omzetToday += price;
          stats.profitToday += profit;
        }
        if ((orderDate.getMonth() + '-' + orderDate.getFullYear()) === monthYearStr) {
          stats.omzetMonth += price;
          stats.profitMonth += profit;
        }
      } else if (order.status === 'proses') {
        stats.proses++;
      } else if (order.status === 'gagal') {
        stats.gagal++;
      }

      const prodKey = `${order.game} - ${order.package}`;
      stats.products[prodKey] = (stats.products[prodKey] || 0) + 1;
    });

    document.getElementById('stat-total-orders').textContent = stats.total;
    document.getElementById('stat-berhasil').textContent = stats.berhasil;
    document.getElementById('stat-proses').textContent = stats.proses;
    document.getElementById('stat-gagal').textContent = stats.gagal;
    document.getElementById('stat-omzet').textContent = `Rp${stats.omzet.toLocaleString('id-ID')}`;
    document.getElementById('stat-modal').textContent = `Rp${stats.modal.toLocaleString('id-ID')}`;
    document.getElementById('stat-untung').textContent = `Rp${(stats.omzet - stats.modal).toLocaleString('id-ID')}`;

    document.getElementById('stat-omzet-today').textContent = `Rp${stats.omzetToday.toLocaleString('id-ID')}`;
    document.getElementById('stat-profit-today').textContent = `Rp${stats.profitToday.toLocaleString('id-ID')}`;
    document.getElementById('stat-omzet-month').textContent = `Rp${stats.omzetMonth.toLocaleString('id-ID')}`;
    document.getElementById('stat-profit-month').textContent = `Rp${stats.profitMonth.toLocaleString('id-ID')}`;

    let topProduct = '-';
    let maxCount = 0;
    for (const [prod, count] of Object.entries(stats.products)) {
      if (count > maxCount) {
        maxCount = count;
        topProduct = prod;
      }
    }
    document.getElementById('stat-top-product').textContent = topProduct;
  }

  function renderAdminOrders() {
    const list = document.getElementById('adminOrderList');
    if (!list) return;
    const filter = document.getElementById('orderStatusFilter').value;

    const filtered = allOrders.filter(o => filter === 'all' || o.status === filter);
    list.innerHTML = '';

    filtered.forEach(order => {
      const orderDate = order.updatedAt?.toDate ? order.updatedAt.toDate() : new Date(order.order_date);
      const dateStr = orderDate.toLocaleString('id-ID');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${order.order_number}</strong><br><small>${dateStr}</small></td>
        <td>${order.game}<br><small>${order.package}</small></td>
        <td>
          ${order.nickname}<br>
          <small>ID: ${order.game_id} ${order.server_id ? `(${order.server_id})` : ''}</small><br>
          <small>WA: ${order.whatsapp}</small>
        </td>
        <td>${order.price}</td>
        <td>
          <input type="number" class="price-input-sm" value="${order.modal || 0}"
            onchange="window._updateOrderField('${order.id}', 'modal', this.value)">
        </td>
        <td>
          <select class="status-badge status-${order.status}"
            onchange="window._updateOrderField('${order.id}', 'status', this.value)">
            <option value="proses" ${order.status === 'proses' ? 'selected' : ''}>PROSES</option>
            <option value="berhasil" ${order.status === 'berhasil' ? 'selected' : ''}>BERHASIL</option>
            <option value="gagal" ${order.status === 'gagal' ? 'selected' : ''}>GAGAL</option>
          </select>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  window._updateOrderField = async (id, field, value) => {
    try {
      const updateData = { [field]: value, updatedAt: new Date() };
      if (field === 'status' && value === 'berhasil') {
        // Recalculate profit if status changes to berhasil
        const orderSnap = await getDoc(doc(db, 'orders', id));
        if (orderSnap.exists()) {
          const order = orderSnap.data();
          const price = parseInt(order.price.replace(/[^0-9]/g, '')) || 0;
          const modal = parseInt(order.modal) || 0;
          updateData.profit = price - modal;
        }
      }
      await updateDoc(doc(db, 'orders', id), updateData);
      showNotification('Data diperbarui.');
    } catch (err) {
      console.error('Update error:', err);
      showNotification('Gagal memperbarui data!', 'error');
    }
  };

  function renderAdminProducts() {
    const list = document.getElementById('adminProductList');
    const filter = document.getElementById('productGameFilter');
    const gameSettings = document.getElementById('gameSettings');
    if (!list || !filter || !gameSettings) return;

    if (filter.options.length === 0) {
      games.forEach(game => {
        const opt = document.createElement('option');
        opt.value = game.id;
        opt.textContent = game.name;
        filter.appendChild(opt);
      });
    }

    const gameId = filter.value;
    const gameData = games.find(g => g.id === gameId);

    gameSettings.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid #d4af85;">
        <div>
          <label style="color:#d4af85; display:block; margin-bottom:0.5rem; font-weight:700;">Nama Game</label>
          <input type="text" class="form-input" value="${gameData.name}" onchange="window._updateGame('${gameId}', 'name', this.value)">
        </div>
        <div>
          <label style="color:#d4af85; display:block; margin-bottom:0.5rem; font-weight:700;">Link Provider (Opsional)</label>
          <input type="text" class="form-input" value="${gameData.link || ''}" placeholder="Kosongkan jika topup instan" onchange="window._updateGame('${gameId}', 'link', this.value)">
        </div>
      </div>
    `;

    list.innerHTML = '';
    if (prices[gameId]) {
      prices[gameId].forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" class="form-input" value="${item.package}" onchange="window._updateProduct('${gameId}', ${index}, 'package', this.value)"></td>
          <td>${item.category}</td>
          <td><input type="number" class="price-input-sm" value="${item.price}" onchange="window._updateProduct('${gameId}', ${index}, 'price', this.value)"></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window._updateProduct('${gameId}', ${index}, 'habis', ${!item.habis})">
              ${item.habis ? 'STOK ADA' : 'HABIS'}
            </button>
          </td>
        `;
        list.appendChild(tr);
      });
    } else if (gameData.link) {
      list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: #d4af85;">Produk ini menggunakan link eksternal.</td></tr>';
    }
  }

  window._updateGame = async (gameId, field, value) => {
    const gameIndex = games.findIndex(g => g.id === gameId);
    if (gameIndex !== -1) {
      games[gameIndex][field] = value;
      try {
        await setDoc(doc(db, 'settings', 'product_data'), { games: games.map(g => ({ id: g.id, name: g.name, link: g.link })), prices }, { merge: true });
        showNotification('Pengaturan game disimpan.');
        renderAdminProducts();
      } catch (err) {
        showNotification('Gagal menyimpan pengaturan.', 'error');
      }
    }
  };

  window._updateProduct = async (gameId, index, field, value) => {
    if (field === 'price') value = parseInt(value) || 0;
    if (!prices[gameId]) return;
    prices[gameId][index][field] = value;
    try {
      await setDoc(doc(db, 'settings', 'product_data'), { prices }, { merge: true });
      showNotification('Produk diperbarui.');
      renderAdminProducts();
    } catch (err) {
      showNotification('Gagal memperbarui produk.', 'error');
    }
  };

  function setupEventListeners() {
    document.getElementById('btn-admin-logout').addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = 'index.html';
    });

    document.getElementById('orderStatusFilter').addEventListener('change', renderAdminOrders);
    document.getElementById('productGameFilter').addEventListener('change', renderAdminProducts);

    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      });
    });
  }
});
