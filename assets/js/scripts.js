document.addEventListener('DOMContentLoaded', () => {
  const { auth, db, FirebaseFirestore, FirebaseAuth } = window;
  const { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, doc, getDoc } = FirebaseFirestore;
  const { signInWithEmailAndPassword } = FirebaseAuth;

  let currentOrder = {
    game: '',
    gameName: '',
    package: '',
    price: 0,
    quantity: 1
  };

  let allOrders = [];
  let selectedPayment = '';
  let currentReceipt = null;

  const games = [
    { id: 'ml', name: 'Mobile Legends', image: 'mobile-legend.jpg', status: '💎 Top Up Instan' },
    { id: 'ff', name: 'Free Fire', image: 'free-fire.jpg', status: '🔥 Top Up Instan' },
    { id: 'pubg', name: 'PUBG Mobile', image: 'pubg-mobile.jpg', status: '🔫 Top Up Instan' },
    { id: 'roblox', name: 'Roblox', image: 'roblox.jpg', status: '🎮 Top Up Instan', link: 'https://direz-store-robloxrobux.my.canva.site' },
    { id: 'genshin', name: 'Genshin Impact', image: 'genshin-impact.jpg', status: '✨ Top Up Instan', link: 'https://direzstorebydiorezz.my.canva.site/genshin-impact' },
    { id: 'telegram', name: 'TELEGRAM STARS', image: 'telegram-stars.jpg', status: '⭐ Top Up Instan', link: 'https://direzstorebydiorezz.my.canva.site/telestars' },
    { id: 'redfinger', name: 'REDFINGER VOUCHER', image: 'redfinger-voucher.jpg', status: '🎟️ Top Up Instan', link: 'https://direzstorebydiorezz.my.canva.site/redfinger' },
    { id: 'ewallet', name: 'Top Up E-Wallet', image: 'e-wallet.svg', status: '💳 Top Up Instan', link: 'https://direzstorebydiorezz.my.canva.site/e-wallet' }
  ];

  const prices = {
    ml: [
      { package: '👑 Weekly Diamond Pass', category: '👑 WEEKLY DIAMOND PASS', price: 28777 },
      { package: '💎 5', category: '🟢 DIAMOND KECIL (RAMAI)', price: 1800 },
      { package: '💎 12', category: '🟢 DIAMOND KECIL (RAMAI)', price: 3800 },
      { package: '💎 14', category: '🟢 DIAMOND KECIL (RAMAI)', price: 4300 },
      { package: '💎 19', category: '🟢 DIAMOND KECIL (RAMAI)', price: 5800 },
      { package: '💎 28', category: '🟢 DIAMOND KECIL (RAMAI)', price: 8200 },
      { package: '💎 36', category: '🟢 DIAMOND KECIL (RAMAI)', price: 10200 },
      { package: '💎 45', category: '🟢 DIAMOND KECIL (RAMAI)', price: 13300 },
      { package: '💎 50', category: '🟢 DIAMOND KECIL (RAMAI)', price: 14000 },
      { package: '💎 59', category: '🟢 DIAMOND KECIL (RAMAI)', price: 16200 },
      { package: '💎 67', category: '🟢 DIAMOND KECIL (RAMAI)', price: 18300 },
      { package: '💎 70', category: '🟢 DIAMOND KECIL (RAMAI)', price: 19200 },
      { package: '💎 85', category: '🟢 DIAMOND KECIL (RAMAI)', price: 22700 },
      { package: '💎 100', category: '🟡 DIAMOND MENENGAH', price: 27200 },
      { package: '💎 112', category: '🟡 DIAMOND MENENGAH', price: 30700 },
      { package: '💎 140', category: '🟡 DIAMOND MENENGAH', price: 37900 },
      { package: '💎 145', category: '🟡 DIAMOND MENENGAH', price: 40700 },
      { package: '💎 170', category: '🟡 DIAMOND MENENGAH', price: 45200 },
      { package: '💎 185', category: '🟡 DIAMOND MENENGAH', price: 49500 },
      { package: '💎 222', category: '🟡 DIAMOND MENENGAH', price: 58700 },
      { package: '💎 240', category: '🟡 DIAMOND MENENGAH', price: 63300 },
      { package: '💎 257', category: '🟡 DIAMOND MENENGAH', price: 68200 },
      { package: '💎 284', category: '🟡 DIAMOND MENENGAH', price: 74900 },
      { package: '💎 296', category: '🟡 DIAMOND MENENGAH', price: 77700 },
      { package: '💎 344', category: '🔥 DIAMOND BESAR', price: 91000 },
      { package: '💎 355', category: '🔥 DIAMOND BESAR', price: 93500 },
      { package: '💎 408', category: '🔥 DIAMOND BESAR', price: 107000 },
      { package: '💎 429', category: '🔥 DIAMOND BESAR', price: 113000 },
      { package: '💎 460', category: '🔥 DIAMOND BESAR', price: 121500 },
      { package: '💎 514', category: '🔥 DIAMOND BESAR', price: 135500 },
      { package: '💎 568', category: '🔥 DIAMOND BESAR', price: 146500 },
      { package: '💎 600', category: '🔥 DIAMOND BESAR', price: 155000 },
      { package: '💎 706', category: '🔥 DIAMOND BESAR', price: 182000 },
      { package: '💎 875', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 222000 },
      { package: '💎 963', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 247000 },
      { package: '💎 1.050', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 269000 },
      { package: '💎 1.136', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 291000 },
      { package: '💎 1.159', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 298000 },
      { package: '💎 1.220', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 307000 },
      { package: '💎 1.412', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 357000 },
      { package: '💎 1.704', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 438000 },
      { package: '💎 1.750', category: '👑 DIAMOND JUMBO (UNTUNG GEDE)', price: 445000 },
      { package: '💎 2.010', category: '🔥👑 DIAMOND SULTAN BESAR', price: 479000 },
      { package: '💎 2.195', category: '🔥👑 DIAMOND SULTAN BESAR', price: 527000 },
      { package: '💎 2.380', category: '🔥👑 DIAMOND SULTAN BESAR', price: 579000 },
      { package: '💎 2.901', category: '🔥👑 DIAMOND SULTAN BESAR', price: 705000 },
      { package: '💎 3.688', category: '🔥👑 DIAMOND SULTAN BESAR', price: 899000 },
      { package: '💎 4.394', category: '🔥👑 DIAMOND SULTAN BESAR', price: 1049000 },
      { package: '💎 5.532', category: '🔥👑 DIAMOND SULTAN BESAR', price: 1329000 },
      { package: '💎 7.720', category: '🔥👑 DIAMOND SULTAN BESAR', price: 1852000 },
      { package: '💎 9.288', category: '🔥👑 DIAMOND SULTAN BESAR', price: 2220000 },
      { package: '💎 10.050', category: '🔥👑 DIAMOND SULTAN BESAR', price: 2378000 },
      { package: '💎 12.976', category: '🔥👑 DIAMOND SULTAN BESAR', price: 3108000 },
      { package: '💎 16.080', category: '🔥👑 DIAMOND SULTAN BESAR', price: 3828000 },
      { package: '💎 27.864', category: '🔥👑 DIAMOND SULTAN BESAR', price: 6655000 }
    ],
    ff: [
      { package: '🚀 Member Mingguan', category: '👑 MEMBERSHIP TURBO', price: 27900 },
      { package: '🚀 Member Bulanan', category: '👑 MEMBERSHIP TURBO', price: 80900 },
      { package: '💎 75 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 10990 },
      { package: '💎 80', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 11990 },
      { package: '💎 130', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 18990 },
      { package: '💎 150 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 21990 },
      { package: '💎 190', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 28990 },
      { package: '💎 210 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 30990 },
      { package: '💎 300 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 44000 },
      { package: '💎 375', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 50000 },
      { package: '💎 400 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 0, habis: true },
      { package: '💎 500 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 66000 },
      { package: '💎 740', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 0, habis: true },
      { package: '💎 770 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 104000 },
      { package: '💎 1000 ⭐', category: '⭐ NOMINAL FAVORIT (PALING LARIS)', price: 134000 },
      { package: '💎 5', category: '🔹 PAKET KECIL', price: 1490 },
      { package: '💎 10', category: '🔹 PAKET KECIL', price: 1990 },
      { package: '💎 15', category: '🔹 PAKET KECIL', price: 2490 },
      { package: '💎 20', category: '🔹 PAKET KECIL', price: 3490 },
      { package: '💎 25', category: '🔹 PAKET KECIL', price: 4990 },
      { package: '💎 30', category: '🔹 PAKET KECIL', price: 5490 },
      { package: '💎 40', category: '🔹 PAKET KECIL', price: 6990 },
      { package: '💎 50', category: '🔹 PAKET KECIL', price: 8990 },
      { package: '💎 60', category: '🔹 PAKET KECIL', price: 9990 },
      { package: '💎 75', category: '🔹 PAKET KECIL', price: 10990 },
      { package: '💎 80', category: '🔹 PAKET KECIL', price: 11990 },
      { package: '💎 90', category: '🔹 PAKET KECIL', price: 13990 },
      { package: '💎 95', category: '🔹 PAKET KECIL', price: 14990 },
      { package: '💎 100', category: '🔹 PAKET KECIL', price: 14990 },
      { package: '💎 120', category: '🔹 PAKET KECIL', price: 16990 },
      { package: '💎 130', category: '🔷 PAKET MENENGAH', price: 18990 },
      { package: '💎 145', category: '🔷 PAKET MENENGAH', price: 19990 },
      { package: '💎 150', category: '🔷 PAKET MENENGAH', price: 21990 },
      { package: '💎 160', category: '🔷 PAKET MENENGAH', price: 23990 },
      { package: '💎 170', category: '🔷 PAKET MENENGAH', price: 24990 },
      { package: '💎 180', category: '🔷 PAKET MENENGAH', price: 26990 },
      { package: '💎 190', category: '🔷 PAKET MENENGAH', price: 28990 },
      { package: '💎 210', category: '🔷 PAKET MENENGAH', price: 30990 },
      { package: '💎 250', category: '🔷 PAKET MENENGAH', price: 33990 },
      { package: '💎 260', category: '🔷 PAKET MENENGAH', price: 34990 },
      { package: '💎 280', category: '🔷 PAKET MENENGAH', price: 36990 },
      { package: '💎 300', category: '🔶 MENENGAH – BESAR', price: 43900 },
      { package: '💎 350', category: '🔶 MENENGAH – BESAR', price: 48900 },
      { package: '💎 375', category: '🔶 MENENGAH – BESAR', price: 50900 },
      { package: '💎 400', category: '🔶 MENENGAH – BESAR', price: 54900 },
      { package: '💎 405', category: '🔶 MENENGAH – BESAR', price: 55900 },
      { package: '💎 420', category: '🔶 MENENGAH – BESAR', price: 56900 },
      { package: '💎 425', category: '🔶 MENENGAH – BESAR', price: 58400 },
      { package: '💎 475', category: '🔶 MENENGAH – BESAR', price: 62900 },
      { package: '💎 500', category: '🔶 MENENGAH – BESAR', price: 65900 },
      { package: '💎 520', category: '🔶 MENENGAH – BESAR', price: 69900 },
      { package: '💎 545', category: '🔶 MENENGAH – BESAR', price: 73400 },
      { package: '💎 565', category: '🔶 MENENGAH – BESAR', price: 75900 },
      { package: '💎 600', category: '🔶 MENENGAH – BESAR', price: 80900 },
      { package: '💎 645', category: '🔶 MENENGAH – BESAR', price: 85900 },
      { package: '💎 655', category: '🔶 MENENGAH – BESAR', price: 87900 },
      { package: '💎 700', category: '🔶 MENENGAH – BESAR', price: 93900 },
      { package: '💎 725', category: '🔶 MENENGAH – BESAR', price: 96900 },
      { package: '💎 770', category: '🔶 MENENGAH – BESAR', price: 103900 },
      { package: '💎 800', category: '🔶 MENENGAH – BESAR', price: 108900 },
      { package: '💎 860', category: '🔶 MENENGAH – BESAR', price: 115900 },
      { package: '💎 925', category: '🔶 MENENGAH – BESAR', price: 124900 },
      { package: '💎 1000', category: '🔶 MENENGAH – BESAR', price: 133900 },
      { package: '💎 1200', category: '👑 PAKET JUMBO', price: 164900 },
      { package: '💎 1300', category: '👑 PAKET JUMBO', price: 177900 },
      { package: '💎 1440', category: '👑 PAKET JUMBO', price: 194900 },
      { package: '💎 1490', category: '👑 PAKET JUMBO', price: 200900 },
      { package: '💎 1580', category: '👑 PAKET JUMBO', price: 212900 },
      { package: '💎 1800', category: '👑 PAKET JUMBO', price: 240900 },
      { package: '💎 2000', category: '👑 PAKET JUMBO', price: 267900 },
      { package: '💎 2100', category: '👑 PAKET JUMBO', price: 280900 },
      { package: '💎 2200', category: '👑 PAKET JUMBO', price: 293900 },
      { package: '💎 2280', category: '👑 PAKET JUMBO', price: 305900 },
      { package: '💎 2350', category: '👑 PAKET JUMBO', price: 315900 },
      { package: '💎 2400', category: '👑 PAKET JUMBO', price: 325900 },
      { package: '💎 2575', category: '👑 PAKET JUMBO', price: 350900 },
      { package: '💎 2720', category: '👑 PAKET JUMBO', price: 370900 },
      { package: '💎 3000', category: '👑 PAKET JUMBO', price: 409900 },
      { package: '💎 3310', category: '🔥👑 SUPER JUMBO', price: 454900 },
      { package: '💎 3640', category: '🔥👑 SUPER JUMBO', price: 499900 },
      { package: '💎 3800', category: '🔥👑 SUPER JUMBO', price: 524900 },
      { package: '💎 4000', category: '🔥👑 SUPER JUMBO', price: 549900 },
      { package: '💎 4340', category: '🔥👑 SUPER JUMBO', price: 594900 },
      { package: '💎 4720', category: '🔥👑 SUPER JUMBO', price: 644900 },
      { package: '💎 5500', category: '🔥👑 SUPER JUMBO', price: 749900 },
      { package: '💎 6000', category: '🔥👑 SUPER JUMBO', price: 819900 },
      { package: '💎 6480', category: '🔥👑 SUPER JUMBO', price: 879900 },
      { package: '💎 6900', category: '🔥👑 SUPER JUMBO', price: 939900 },
      { package: '💎 7290', category: '🔥👑 SUPER JUMBO', price: 989900 },
      { package: '💎 8010', category: '🔥👑 SUPER JUMBO', price: 1079900 },
      { package: '💎 9290', category: '🔥👑 SUPER JUMBO', price: 1229900 },
      { package: '💎 9800', category: '🔥👑 SUPER JUMBO', price: 1289900 },
      { package: '💎 14.850', category: '🔥👑 SUPER JUMBO', price: 1879900 },
      { package: '💎 36.500', category: '🔥👑 SUPER JUMBO', price: 4799900 },
      { package: '💎 37.050', category: '🔥👑 SUPER JUMBO', price: 4869900 },
      { package: '💎 73.100', category: '🔥👑 SUPER JUMBO', price: 9029900 }
    ],
    pubg: [
      { package: '60 UC', category: '🟤 PAKET BRONZE', price: 16200 },
      { package: '120 UC', category: '🟤 PAKET BRONZE', price: 32400 },
      { package: '180 UC', category: '🟤 PAKET BRONZE', price: 47600 },
      { package: '240 UC', category: '🟤 PAKET BRONZE', price: 63800 },
      { package: '325 UC (300+25)', category: '⚪ PAKET SILVER', price: 79500 },
      { package: '385 UC (360+25)', category: '⚪ PAKET SILVER', price: 94600 },
      { package: '445 UC (420+25)', category: '⚪ PAKET SILVER', price: 111800 },
      { package: '505 UC (480+25)', category: '⚪ PAKET SILVER', price: 126900 },
      { package: '565 UC (540+25)', category: '🟡 PAKET GOLD', price: 142200 },
      { package: '660 UC (600+60)', category: '🟡 PAKET GOLD', price: 158700 },
      { package: '720 UC', category: '🟡 PAKET GOLD', price: 174900 },
      { package: '780 UC', category: '🟡 PAKET GOLD', price: 189500 },
      { package: '840 UC', category: '🔷 PAKET PLATINUM', price: 204000 },
      { package: '900 UC', category: '🔷 PAKET PLATINUM', price: 219000 },
      { package: '985 UC', category: '🔷 PAKET PLATINUM', price: 244000 },
      { package: '1105 UC', category: '🔷 PAKET PLATINUM', price: 274500 },
      { package: '1320 UC', category: '💎 PAKET DIAMOND', price: 313500 },
      { package: '1500 UC', category: '💎 PAKET DIAMOND', price: 364000 },
      { package: '1800 UC', category: '💎 PAKET DIAMOND', price: 394000 },
      { package: '2125 UC', category: '💎 PAKET DIAMOND', price: 467000 },
      { package: '2460 UC', category: '👑 PAKET CROWN', price: 547000 },
      { package: '2785 UC', category: '👑 PAKET CROWN', price: 623000 },
      { package: '3120 UC', category: '👑 PAKET CROWN', price: 705500 },
      { package: '3850 UC', category: '👑 PAKET CROWN', price: 782000 },
      { package: '4030 UC', category: '🏆 PAKET CONQUEROR', price: 828000 },
      { package: '4510 UC', category: '🏆 PAKET CONQUEROR', price: 935000 },
      { package: '5650 UC', category: '🏆 PAKET CONQUEROR', price: 1171000 },
      { package: '8100 UC', category: '🏆 PAKET CONQUEROR', price: 1564000 },
      { package: 'Elite Pass PUBG Mobile', category: '🎟️ ELITE PASS', price: 184000 },
      { package: 'Elite Pass Plus PUBG Mobile', category: '🎟️ ELITE PASS', price: 465000 }
    ],
    roblox: [
      { package: '400 Robux', category: '🎮 PAKET STANDAR', price: 25000 },
      { package: '800 Robux', category: '🎮 PAKET STANDAR', price: 45000 },
      { package: '1700 Robux', category: '🌟 PAKET PREMIUM', price: 85000 },
      { package: '4500 Robux', category: '🎮 PAKET JUMBO', price: 200000 }
    ],
    genshin: [
      { package: '60 Primogem', category: '✨ PAKET KECIL', price: 10000 },
      { package: '300 Primogem', category: '✨ PAKET MENENGAH', price: 45000 },
      { package: '980 Primogem', category: '✨ PAKET BESAR', price: 120000 },
      { package: '1980 Primogem', category: '✨ PAKET JUMBO', price: 240000 }
    ],
    telegram: [
      { package: '1 Star', category: '⭐ PAKET KECIL', price: 5000 },
      { package: '10 Stars', category: '⭐ PAKET MENENGAH', price: 45000 },
      { package: '25 Stars', category: '⭐ PAKET BESAR', price: 100000 },
      { package: '100 Stars', category: '⭐ PAKET JUMBO', price: 350000 }
    ],
    redfinger: [
      { package: '30 Hari', category: '🎟️ PAKET AKSES', price: 35000 },
      { package: '90 Hari', category: '🎟️ PAKET AKSES', price: 90000 },
      { package: '180 Hari', category: '🎟️ PAKET AKSES', price: 165000 },
      { package: '365 Hari', category: '🎟️ PAKET AKSES', price: 300000 }
    ]
  };

  async function initFirebaseData() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'product_data'));
      if (settingsDoc.exists()) {
        const savedData = settingsDoc.data();
        if (savedData.prices) Object.assign(prices, savedData.prices);
        if (savedData.games) {
          savedData.games.forEach(savedGame => {
            const index = games.findIndex(g => g.id === savedGame.id);
            if (index !== -1) Object.assign(games[index], savedGame);
          });
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
    renderGames();
  }

  function scrollToTop() {
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
      wrapper.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function scrollToGames() {
    const gamesElement = document.getElementById('games');
    if (gamesElement) {
        gamesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    const wrapper = document.querySelector('.wrapper');
    const headerHeight = 110;

    if (element && wrapper) {
      const rect = element.getBoundingClientRect();
      const targetPos = wrapper.scrollTop + rect.top - headerHeight;
      wrapper.scrollTo({ top: targetPos, behavior: 'smooth' });
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderGames() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';

      if (game.link) {
        card.addEventListener('click', () => window.open(game.link, '_blank'));
      } else {
        card.addEventListener('click', () => showPrices(game.id, game.name));
      }

      card.innerHTML = `
        <div class="game-icon">
          <img src="assets/Picture/${game.image}" alt="${game.name}" loading="lazy" onerror="this.src='assets/Picture/default-game.jpg'">
        </div>
        <div class="game-name">${game.name}</div>
        <div class="game-status">${game.status}</div>
      `;
      grid.appendChild(card);
    });
  }

  function searchGames() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    const inputValue = input.value.toLowerCase().trim();

    if (inputValue.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    const filtered = games.filter(game =>
      game.name.toLowerCase().includes(inputValue) ||
      game.id.toLowerCase().includes(inputValue)
    );

    if (filtered.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    dropdown.innerHTML = '';
    filtered.forEach(game => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `<span class="search-item-icon"><img src="assets/Picture/${game.image}" alt="${game.name}" loading="lazy" onerror="this.src='assets/Picture/default-game.jpg'"></span>${game.name}`;
      item.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        dropdown.classList.remove('active');
        if (game.link) {
          window.open(game.link, '_blank');
        } else {
          showPrices(game.id, game.name);
        }
      });
      dropdown.appendChild(item);
    });

    dropdown.classList.add('active');
  }

  function showPrices(gameId, gameName) {
    currentOrder.game = gameId;
    currentOrder.gameName = gameName;

    const serverIdGroup = document.getElementById('serverIdGroup');
    if (gameId === 'ml') {
      serverIdGroup.style.display = 'block';
    } else {
      serverIdGroup.style.display = 'none';
      document.getElementById('serverId').value = '';
    }

    const priceTitle = document.getElementById('priceTitle');
    const priceGrid = document.getElementById('priceGrid');

    priceTitle.textContent = `Pilih Paket ${gameName}`;
    priceGrid.innerHTML = '';

    const grouped = {};
    if (prices[gameId]) {
      prices[gameId].forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
    }

    Object.entries(grouped).forEach(([category, items]) => {
      const categoryHeader = document.createElement('div');
      categoryHeader.style.cssText = `grid-column: 1 / -1; font-size: 1.1rem; font-weight: 900; color: #ffed4e; background: rgba(212, 175, 133, 0.1); padding: 0.8rem 1.2rem; border-radius: 10px; border-left: 4px solid #d4af85; margin-top: 1rem; font-family: 'Cairo', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center; gap: 0.8rem;`;
      categoryHeader.textContent = category;
      priceGrid.appendChild(categoryHeader);

      items.forEach((item) => {
        const box = document.createElement('div');
        box.className = 'price-item';
        let priceContent;
        if (item.habis) {
          priceContent = `<div class="price-habis">HABIS</div>`;
        } else {
          priceContent = `<div class="price-amount">${item.package}</div><div class="price-rupiah">Rp${item.price.toLocaleString('id-ID')}</div>`;
        }
        box.innerHTML = priceContent;
        if (!item.habis) {
          box._itemData = item;
        } else {
          box.style.cursor = 'not-allowed';
          box.style.opacity = '0.6';
        }
        priceGrid.appendChild(box);
      });
    });

    const priceSection = document.getElementById('priceSection');
    priceSection.classList.add('active');
    setTimeout(() => smoothScrollTo('priceSection'), 500);
  }

  function selectPrice(item, element) {
    document.querySelectorAll('.price-item:not([style*="opacity"])').forEach(el => el.classList.remove('selected', 'active'));
    if (element) element.classList.add('selected', 'active');

    currentOrder.package = item.package;
    currentOrder.price = item.price;
    currentOrder.quantity = 1;

    document.getElementById('summaryGame').textContent = currentOrder.gameName;
    document.getElementById('summaryPackage').textContent = item.package;
    updateTotal();

    const formPesanan = document.getElementById('form-pesanan');
    formPesanan.classList.add('active');
  }

  function updateTotal() {
    let total = currentOrder.price * currentOrder.quantity;
    const cashFeeLabel = document.getElementById('cashFeeLabel');

    if (selectedPayment === 'cash') {
      total += 1000;
      if (cashFeeLabel) cashFeeLabel.style.display = 'inline';
    } else {
      if (cashFeeLabel) cashFeeLabel.style.display = 'none';
    }

    document.getElementById('qtyDisplay').textContent = currentOrder.quantity;
    document.getElementById('summaryTotal').textContent = `Rp${total.toLocaleString('id-ID')}`;
  }

  function selectPayment(method, btn) {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPayment = method;
    document.getElementById('paymentMethod').value = method;
    updateTotal();
  }

  function cancelOrder() {
    document.getElementById('form-pesanan').classList.remove('active');
    document.getElementById('priceSection').classList.remove('active');
    document.querySelectorAll('.price-item').forEach(el => el.classList.remove('selected', 'active'));
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    document.getElementById('gameId').value = '';
    document.getElementById('serverId').value = '';
    document.getElementById('nickname').value = '';
    document.getElementById('whatsapp').value = '';
    document.getElementById('email').value = '';
    selectedPayment = '';
    const cashFeeLabel = document.getElementById('cashFeeLabel');
    if (cashFeeLabel) cashFeeLabel.style.display = 'none';
  }

  async function submitOrder(e) {
    e.preventDefault();

    if (!selectedPayment) {
      alert('Pilih metode pembayaran terlebih dahulu!');
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Memproses...';

    const gameId = document.getElementById('gameId').value;
    const serverId = document.getElementById('serverId').value;
    const nickname = document.getElementById('nickname').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    const orderNum = `DRZ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let total = currentOrder.price * currentOrder.quantity;
    if (selectedPayment === 'cash') total += 1000;

    const orderData = {
      order_number: orderNum,
      game: currentOrder.gameName,
      package: currentOrder.package,
      price: `Rp${total.toLocaleString('id-ID')}`,
      game_id: gameId,
      server_id: serverId,
      nickname: nickname,
      whatsapp: whatsapp,
      email: email,
      payment_method: selectedPayment,
      status: 'proses',
      modal: 0,
      profit: 0,
      order_date: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      showNotification('Pesanan berhasil dibuat!');
      showReceipt(orderNum, currentOrder.gameName, currentOrder.package, nickname, total, selectedPayment, gameId, serverId, email);
      cancelOrder();
    } catch (err) {
      console.error('Submit order error:', err);
      showNotification('Gagal mengirim pesanan. Silakan coba lagi.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '🛍️ Pesan Sekarang';
    }
  }

  function showReceipt(orderNum, game, pkg, nickname, total, payment, gameId, serverId, email) {
    document.getElementById('modalOrderNum').textContent = orderNum;
    document.getElementById('modalGame').textContent = game;
    document.getElementById('modalPackage').textContent = pkg;
    document.getElementById('modalGameId').textContent = gameId;
    document.getElementById('modalNickname').textContent = nickname;
    document.getElementById('modalPayment').textContent = payment.toUpperCase();
    document.getElementById('modalTotal').textContent = `Rp${total.toLocaleString('id-ID')}`;

    currentReceipt = { orderNum, game, pkg, nickname, total, payment, whatsapp: document.getElementById('whatsapp').value, email: email, gameId, serverId, quantity: currentOrder.quantity, price: currentOrder.price };
    document.getElementById('receiptModal').classList.add('show');
  }

  function closeReceipt() {
    document.getElementById('receiptModal').classList.remove('show');
  }

  function sendToWhatsApp() {
    const r = currentReceipt; if (!r) return;
    const adminPhone = '6285646335331';
    const dateStr = new Date().toLocaleString('id-ID');
    const msg = `✅ PESANAN BARU - DIREZ STORE\n━━━━━━━━━━━━━━━━━━━━\nNo: ${r.orderNum}\nGame: ${r.game}\nPaket: ${r.pkg}\nNickname: ${r.nickname}\nID: ${r.gameId} ${r.serverId ? `(${r.serverId})` : ''}\nTotal: Rp${r.total.toLocaleString('id-ID')}\nMetode: ${r.payment.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━\nTerima kasih!`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function sendToEmail() {
    const r = currentReceipt; if (!r) return;
    const adminEmail = 'direzstudio@gmail.com';
    const subject = `📦 Pesanan DiRez Store - ${r.orderNum}`;
    const body = `Pesanan Baru:\nNo: ${r.orderNum}\nGame: ${r.game}\nPaket: ${r.pkg}\nNickname: ${r.nickname}\nID: ${r.gameId}\nTotal: Rp${r.total.toLocaleString('id-ID')}`;
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openHistory(e) {
    if (e) e.preventDefault();
    document.getElementById('historyPhoneInput').value = '';
    document.getElementById('historyFormSection').style.display = 'block';
    document.getElementById('historyList').style.display = 'none';
    document.getElementById('historyModal').classList.add('show');
  }

  let historyUnsubscribe = null;
  function searchHistory() {
    const phone = document.getElementById('historyPhoneInput').value.trim();
    if (!phone) { alert('Masukkan nomor WhatsApp!'); return; }

    if (historyUnsubscribe) historyUnsubscribe();

    const list = document.getElementById('historyList');
    list.innerHTML = '⏳ Mencari...';
    list.style.display = 'block';
    document.getElementById('historyFormSection').style.display = 'none';

    const q = query(collection(db, 'orders'), where('whatsapp', '==', phone), orderBy('updatedAt', 'desc'));
    historyUnsubscribe = onSnapshot(q, (snapshot) => {
      list.innerHTML = '';
      if (snapshot.empty) {
        list.innerHTML = '<div style="text-align:center; padding:2rem;">❌ Tidak ada pesanan.</div>';
      } else {
        snapshot.forEach(doc => {
          const order = doc.data();
          const item = document.createElement('div');
          item.className = 'history-item';
          item.innerHTML = `
            <div class="history-order-num">📦 ${order.order_number}</div>
            <div class="history-details">
              <div><strong>🎮 ${order.game}</strong> - ${order.package}</div>
              <div><strong>💰 ${order.price}</strong> | Status: <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></div>
            </div>`;
          list.appendChild(item);
        });
      }
    });
  }

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

  async function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    if (!email || !password) { showNotification('Lengkapi email dan password!', 'error'); return; }

    const loading = document.getElementById('adminLoginLoading');
    loading.style.display = 'block';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Login berhasil! Mengalihkan...');
      setTimeout(() => window.location.href = 'admin.html', 1000);
    } catch (err) {
      console.error('Login error:', err);
      showNotification('Login gagal! Periksa email dan password.', 'error');
    } finally {
      loading.style.display = 'none';
    }
  }

  // Event Listeners
  document.querySelector('.logo')?.addEventListener('click', scrollToTop);
  document.getElementById('footer-owner')?.addEventListener('click', () => {
    let clicks = window._footerClicks || 0;
    clicks++;
    window._footerClicks = clicks;
    if (clicks >= 10) {
      window._footerClicks = 0;
      document.getElementById('adminLoginModal').classList.add('show');
    }
    setTimeout(() => { window._footerClicks = 0; }, 3000);
  });

  document.getElementById('nav-history')?.addEventListener('click', openHistory);
  document.getElementById('searchInput')?.addEventListener('keyup', searchGames);
  document.getElementById('btn-scroll-games')?.addEventListener('click', scrollToGames);
  document.getElementById('btn-qty-dec')?.addEventListener('click', () => { if(currentOrder.quantity > 1) { currentOrder.quantity--; updateTotal(); }});
  document.getElementById('btn-qty-inc')?.addEventListener('click', () => { if(currentOrder.quantity < 10) { currentOrder.quantity++; updateTotal(); }});
  document.querySelectorAll('.payment-option').forEach(btn => btn.addEventListener('click', () => selectPayment(btn.dataset.method, btn)));
  document.getElementById('orderForm')?.addEventListener('submit', submitOrder);
  document.getElementById('btn-cancel-order')?.addEventListener('click', cancelOrder);
  document.getElementById('btn-receipt-wa')?.addEventListener('click', sendToWhatsApp);
  document.getElementById('btn-receipt-email')?.addEventListener('click', sendToEmail);
  document.getElementById('btn-receipt-close')?.addEventListener('click', closeReceipt);
  document.getElementById('btn-history-search')?.addEventListener('click', searchHistory);
  document.getElementById('btn-history-reset')?.addEventListener('click', () => {
    document.getElementById('historyPhoneInput').value = '';
    document.getElementById('historyFormSection').style.display = 'block';
    document.getElementById('historyList').style.display = 'none';
  });
  document.getElementById('btn-history-close')?.addEventListener('click', () => document.getElementById('historyModal').classList.remove('show'));
  document.getElementById('btn-admin-login')?.addEventListener('click', adminLogin);
  document.getElementById('btn-admin-login-close')?.addEventListener('click', () => document.getElementById('adminLoginModal').classList.remove('show'));
  document.getElementById('adminPassword')?.addEventListener('keydown', (e) => { if(e.key === 'Enter') adminLogin(); });

  document.addEventListener('click', (e) => {
    const priceItem = e.target.closest('.price-item');
    if (priceItem && !priceItem.classList.contains('price-habis') && priceItem._itemData) {
      selectPrice(priceItem._itemData, priceItem);
      setTimeout(() => smoothScrollTo('form-pesanan'), 400);
    }
  });

  initFirebaseData();
});
