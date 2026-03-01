document.addEventListener('DOMContentLoaded', () => {
  let currentOrder = {
    game: '',
    gameName: '',
    package: '',
    price: 0,
    quantity: 1
  };

  let allOrders = [];
  let selectedPayment = '';
  // Used for receipt modal sharing
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

  const dataHandler = {
    onDataChanged(data) {
      allOrders = data || [];
    }
  };

  async function initSDK() {
    if (window.dataSdk) {
      await window.dataSdk.init(dataHandler);

      const productRes = await window.dataSdk.list('product_data');
      if (productRes.isOk && productRes.data && productRes.data.length > 0) {
        const savedPrices = productRes.data[0].prices;
        if (savedPrices) {
          Object.assign(prices, savedPrices);
        }
        const savedGames = productRes.data[0].games;
        if (savedGames) {
          // Update existing games with saved data
          savedGames.forEach(savedGame => {
            const index = games.findIndex(g => g.id === savedGame.id);
            if (index !== -1) {
              Object.assign(games[index], savedGame);
            }
          });
        }
      }
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
      // Robust offset calculation using getBoundingClientRect
      // This works even if element.offsetTop is relative to a nested offsetParent
      const rect = element.getBoundingClientRect();
      const targetPos = wrapper.scrollTop + rect.top - headerHeight;

      wrapper.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    } else if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
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
    prices[gameId].forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    Object.entries(grouped).forEach(([category, items]) => {
      const categoryHeader = document.createElement('div');
      categoryHeader.style.cssText = `
        grid-column: 1 / -1;
        font-size: 1.1rem;
        font-weight: 900;
        color: #ffed4e;
        background: rgba(212, 175, 133, 0.1);
        padding: 0.8rem 1.2rem;
        border-radius: 10px;
        border-left: 4px solid #d4af85;
        margin-top: 1rem;
        font-family: 'Cairo', sans-serif;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      `;
      categoryHeader.textContent = category;
      priceGrid.appendChild(categoryHeader);

      items.forEach((item) => {
        const box = document.createElement('div');
        box.className = 'price-item';

        let priceContent;
        if (item.habis) {
          priceContent = `
            <div class="price-habis">HABIS</div>
          `;
        } else {
          priceContent = `
            <div class="price-amount">${item.package}</div>
            <div class="price-rupiah">Rp${item.price.toLocaleString('id-ID')}</div>
          `;
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

    setTimeout(() => {
      smoothScrollTo('priceSection');
    }, 500);
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

  function increaseQty() {
    if (currentOrder.quantity < 10) {
      currentOrder.quantity++;
      updateTotal();
    }
  }

  function decreaseQty() {
    if (currentOrder.quantity > 1) {
      currentOrder.quantity--;
      updateTotal();
    }
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

  function generateOrderNumber() {
    return `DRZ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  async function submitOrder(e) {
    e.preventDefault();

    if (!selectedPayment) {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-weight: 700; border: 1.5px solid rgba(239, 68, 68, 0.3);';
      errorDiv.textContent = '⚠️ Pilih metode pembayaran terlebih dahulu!';
      document.getElementById('form-pesanan').insertBefore(errorDiv, document.getElementById('form-pesanan').firstChild);
      setTimeout(() => errorDiv.remove(), 3000);
      return;
    }

    const gameId = document.getElementById('gameId').value;
    const serverId = document.getElementById('serverId').value;
    const nickname = document.getElementById('nickname').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    const orderNum = generateOrderNumber();
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
      order_date: new Date().toISOString()
    };

    if (window.dataSdk) {
      const result = await window.dataSdk.create(orderData);
      if (result.isOk) {
        showReceipt(orderNum, currentOrder.gameName, currentOrder.package, nickname, total, selectedPayment, gameId, serverId, email);
        cancelOrder();
      }
    } else {
        // Fallback for when SDK is missing (for local testing)
        showReceipt(orderNum, currentOrder.gameName, currentOrder.package, nickname, total, selectedPayment, gameId, serverId, email);
        cancelOrder();
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
    const r = currentReceipt;
    if (!r) return;
    const adminPhone = '6285646335331';
    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const msg = `╔═════════════════════════════════╗
║  ✅ PESANAN SUKSES - DIREZ STORE ✅  ║
║      Ramadan Mubarak 1447 H          ║
║        100% Amanah & Terpercaya      ║
╚═══════════════════════════════════════╝

📦 NOMOR PESANAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${r.orderNum}

👤 DATA PELANGGAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama Pemain     : ${r.nickname}
📱 WhatsApp     : ${r.whatsapp}
📧 Email        : ${r.email}

🎮 DETAIL PEMBELIAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Game           : ${r.game}
Paket          : ${r.pkg}
Jumlah         : ${r.quantity}x
Harga Satuan   : Rp${r.price.toLocaleString('id-ID')}
🆔 ID Game     : ${r.gameId}
${r.serverId ? `🏰 ID Server   : ${r.serverId}\n` : ''}
💳 METODE PEMBAYARAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${r.payment.toUpperCase()}

💰 TOTAL BAYAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rp${r.total.toLocaleString('id-ID')}

📅 TANGGAL & WAKTU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dateStr}

════════════════════════════════════════
✅ PESANAN DITERIMA & DIPROSES SEGERA ✅
════════════════════════════════════════

📞 HUBUNGI ADMIN
💬 Chat: https://wa.me/${adminPhone}
🌐 Website: https://direzstorebydiorezz.my.canva.site

Terimakasih telah berbelanja di DiRez Store!
Semoga bermanfaat & barokah di bulan Ramadan ✨

دعاء وصيام وقيام مقبول بإذن الله
والسلام عليكم ورحمة الله وبركاته`;

    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function sendToEmail() {
    const r = currentReceipt;
    if (!r) return;
    const adminEmail = 'direzstudio@gmail.com';
    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const emailBody = `════════════════════════════════════════════════════════════
✅ STRUK PESANAN DIREZ STORE - 100% AMANAH ║
══════════════════════════════════════════════════════════════════

NOMOR PESANAN: ${r.orderNum}
Tanggal & Waktu: ${dateStr}

DATA PELANGGAN
──────────────────────────────────────────────────────────
Nama Pemain    : ${r.nickname}
WhatsApp       : ${r.whatsapp}
Email          : ${r.email}

DETAIL PEMBELIAN
──────────────────────────────────────────────────────────
Game           : ${r.game}
Paket          : ${r.pkg}
Jumlah         : ${r.quantity}x
Harga Satuan   : Rp${r.price.toLocaleString('id-ID')}
ID Game        : ${r.gameId}
${r.serverId ? `ID Server      : ${r.serverId}\n` : ''}
METODE PEMBAYARAN
──────────────────────────────────────────────────────────
${r.payment.toUpperCase()}

RINCIAN BIAYA
──────────────────────────────────────────────────────────
Subtotal       : Rp${r.price.toLocaleString('id-ID')} x ${r.quantity}
─────────────────────────────────────────────────────────
TOTAL BAYAR    : Rp${r.total.toLocaleString('id-ID')}
═════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
✅ PESANAN DITERIMA & DIPROSES SEGERA ✅
════════════════════════════════════════════════════════════

Terimakasih telah mempercayai DiRez Store!
Pesanan Anda akan diproses dalam waktu segera.

Semoga bermanfaat dan barokah! ✨

DiRez Store
100% Amanah • Terpercaya • Berkah
https://direzstorebydiorezz.my.canva.site
WhatsApp Admin: https://wa.me/6285646335331

دعاء وصيام وقيام مقبول بإذن الله
والسلام عليكم ورحمة الله وبركاته`;

    const subject = `📦 Struk Pesanan DiRez Store - ${r.orderNum}`;
    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  }

  function contactAdmin() {
    const adminPhone = '6285646335331';
    window.open(`https://wa.me/${adminPhone}`, '_blank');
  }

  function openHistory(e) {
    if (e) e.preventDefault();
    document.getElementById('historyPhoneInput').value = '';
    document.getElementById('historyFormSection').style.display = 'block';
    document.getElementById('historyList').style.display = 'none';
    document.getElementById('historyModal').classList.add('show');
  }

  function searchHistory() {
    const searchPhone = document.getElementById('historyPhoneInput').value.trim();
    const list = document.getElementById('historyList');

    if (!searchPhone) {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 700; border: 1.5px solid rgba(239, 68, 68, 0.3); margin-bottom: 1rem;';
      errorDiv.textContent = '⚠️ Masukkan nomor WhatsApp terlebih dahulu!';
      list.innerHTML = '';
      list.appendChild(errorDiv);
      list.style.display = 'block';
      return;
    }

    const filteredOrders = allOrders.filter(order => order.whatsapp === searchPhone);
    list.innerHTML = '';

    if (filteredOrders.length === 0) {
      const notFoundDiv = document.createElement('div');
      notFoundDiv.style.cssText = `
        background: linear-gradient(135deg, #1a5f47 0%, #0d3b2a 100%);
        border: 3px solid #d4af85;
        border-radius: 16px;
        padding: 3rem 2rem;
        text-align: center;
        box-shadow: 0 8px 25px rgba(212, 175, 133, 0.15);
      `;
      notFoundDiv.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1.5rem;">❌</div>
        <div style="font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Playfair Display', 'Abril Fatface', 'Cairo', sans-serif; margin-bottom: 1rem;">Pesanan Tidak Ditemukan</div>
        <div style="color: #d4af85; font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem;">Nomor WhatsApp: <span style="color: #f5deb3;">${searchPhone}</span></div>
      `;
      list.appendChild(notFoundDiv);
    } else {
      filteredOrders.forEach((order, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
          <div class="history-order-num">
            <span>📦</span>${order.order_number}
          </div>
          <div class="history-details">
            <div><strong>🎮 Game:</strong> ${order.game} - ${order.package}</div>
            <div><strong>💰 Total:</strong> ${order.price}</div>
            <div><strong>👤 Nama:</strong> ${order.nickname}</div>
            <div><strong>💳 Metode:</strong> ${order.payment_method.toUpperCase()}</div>
          </div>
        `;
        list.appendChild(item);
      });
    }

    document.getElementById('historyFormSection').style.display = 'none';
    document.getElementById('historyList').style.display = 'block';
  }

  function resetHistory() {
    document.getElementById('historyPhoneInput').value = '';
    document.getElementById('historyFormSection').style.display = 'block';
    document.getElementById('historyList').style.display = 'none';
  }

  function closeHistory() {
    document.getElementById('historyModal').classList.remove('show');
  }

  // --- Admin Logic ---

  let footerClicks = 0;
  let footerTimer = null;

  function handleFooterClick() {
    footerClicks++;
    if (footerTimer) clearTimeout(footerTimer);

    if (footerClicks >= 10) {
      footerClicks = 0;
      document.getElementById('adminLoginModal').classList.add('show');
    } else {
      footerTimer = setTimeout(() => {
        footerClicks = 0;
      }, 3000);
    }
  }

  async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (!password) return;

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (data.isOk) {
        localStorage.setItem('adminToken', data.token);
        document.getElementById('adminLoginModal').classList.remove('show');
        document.getElementById('adminPassword').value = '';
        showDashboard();
      } else {
        alert('Password salah!');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }

  async function checkAdminSession() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.isOk) {
        showDashboard();
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.error('Verify error:', err);
    }
  }

  function showDashboard() {
    document.getElementById('adminDashboard').classList.add('active');
    calculateAdminStats();
    renderAdminOrders();
    renderAdminProducts();
  }

  function adminLogout() {
    localStorage.removeItem('adminToken');
    document.getElementById('adminDashboard').classList.remove('active');
  }

  function calculateAdminStats() {
    const stats = {
      total: allOrders.length,
      berhasil: 0,
      proses: 0,
      gagal: 0,
      omzet: 0,
      modal: 0,
      products: {}
    };

    allOrders.forEach(order => {
      if (order.status === 'berhasil') {
        stats.berhasil++;
        const price = parseInt(order.price.replace(/[^0-9]/g, '')) || 0;
        const modal = parseInt(order.harga_modal) || 0;
        stats.omzet += price;
        stats.modal += modal;
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
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.order_number}</td>
        <td>${order.game}<br><small>${order.package}</small></td>
        <td>${order.nickname}<br><small>${order.game_id} ${order.server_id ? `(${order.server_id})` : ''}</small></td>
        <td>${order.price}</td>
        <td>
          <input type="number" class="price-input-sm" value="${order.harga_modal || 0}"
            onchange="window._updateOrderField('${order.id}', 'harga_modal', this.value)">
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
    if (window.dataSdk) {
      await window.dataSdk.update(id, { [field]: value });
      // allOrders will be updated via dataHandler.onDataChanged
      calculateAdminStats();
      renderAdminOrders();
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

    // Render Game Settings
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
      if (window.dataSdk) {
        const res = await window.dataSdk.list('product_data');
        const saveData = { games: games.map(g => ({ id: g.id, name: g.name, link: g.link })) };
        if (res.isOk && res.data && res.data.length > 0) {
          await window.dataSdk.update(res.data[0].id, saveData);
        } else {
          await window.dataSdk.create({ type: 'product_data', ...saveData });
        }
      }
      renderGames();
      renderAdminProducts();
    }
  };

  window._updateProduct = async (gameId, index, field, value) => {
    if (field === 'price') value = parseInt(value) || 0;
    prices[gameId][index][field] = value;
    if (window.dataSdk) {
      const res = await window.dataSdk.list('product_data');
      if (res.isOk && res.data && res.data.length > 0) {
        await window.dataSdk.update(res.data[0].id, { prices });
      } else {
        await window.dataSdk.create({ type: 'product_data', prices });
      }
    }
    renderAdminProducts();
  };

  // --- Attach Event Listeners ---

  // Header Logo
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', scrollToTop);

  const footerOwner = document.getElementById('footer-owner');
  if (footerOwner) footerOwner.addEventListener('click', handleFooterClick);

  // History Nav Link
  const historyLink = document.getElementById('nav-history');
  if (historyLink) historyLink.addEventListener('click', openHistory);

  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('keyup', searchGames);

  // Event Buttons
  const btnScrollGames = document.getElementById('btn-scroll-games');
  if (btnScrollGames) btnScrollGames.addEventListener('click', scrollToGames);

  const btnWebEvent = document.getElementById('btn-web-event');
  if (btnWebEvent) btnWebEvent.addEventListener('click', () => window.open('https://direzstorebydiorezz.my.canva.site/event', '_blank'));

  // Quantity Buttons
  const btnQtyDec = document.getElementById('btn-qty-dec');
  if (btnQtyDec) btnQtyDec.addEventListener('click', decreaseQty);

  const btnQtyInc = document.getElementById('btn-qty-inc');
  if (btnQtyInc) btnQtyInc.addEventListener('click', increaseQty);

  // Payment Options
  // Note: These are static in the original HTML but might be better dynamic or we loop.
  // In the original, they are static HTML.
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(btn => {
    // We need to know which method it corresponds to.
    // The original passed 'gopay', 'dana', etc.
    // I should add data-method attribute in HTML or infer from text.
    // Best is to add data-method in HTML. I will assume I add it.
    btn.addEventListener('click', (e) => {
        // If data-method is missing, we can try to guess or just rely on the button having an attribute.
        // I will add data-method to the HTML buttons.
        const method = btn.getAttribute('data-method');
        if (method) selectPayment(method, btn);
    });
  });

  // Form Submit
  const form = document.querySelector('form');
  if (form) form.addEventListener('submit', submitOrder);

  // Cancel Button
  const btnCancel = document.getElementById('btn-cancel-order');
  if (btnCancel) btnCancel.addEventListener('click', cancelOrder);

  // Footer Contact
  const btnContactAdmin = document.getElementById('btn-contact-admin');
  if (btnContactAdmin) btnContactAdmin.addEventListener('click', contactAdmin);

  // Receipt Modal Actions
  const btnReceiptWa = document.getElementById('btn-receipt-wa');
  if (btnReceiptWa) btnReceiptWa.addEventListener('click', sendToWhatsApp);

  const btnReceiptEmail = document.getElementById('btn-receipt-email');
  if (btnReceiptEmail) btnReceiptEmail.addEventListener('click', sendToEmail);

  const btnReceiptClose = document.getElementById('btn-receipt-close');
  if (btnReceiptClose) btnReceiptClose.addEventListener('click', closeReceipt);

  // History Modal Actions
  const btnHistorySearch = document.getElementById('btn-history-search');
  if (btnHistorySearch) btnHistorySearch.addEventListener('click', searchHistory);

  const btnHistoryReset = document.getElementById('btn-history-reset');
  if (btnHistoryReset) btnHistoryReset.addEventListener('click', resetHistory);

  const btnHistoryClose = document.getElementById('btn-history-close');
  if (btnHistoryClose) btnHistoryClose.addEventListener('click', closeHistory);

  // Admin Listeners
  const btnAdminLogin = document.getElementById('btn-admin-login');
  if (btnAdminLogin) btnAdminLogin.addEventListener('click', adminLogin);

  const btnAdminLoginClose = document.getElementById('btn-admin-login-close');
  if (btnAdminLoginClose) btnAdminLoginClose.addEventListener('click', () => {
    document.getElementById('adminLoginModal').classList.remove('show');
  });

  const btnAdminLogout = document.getElementById('btn-admin-logout');
  if (btnAdminLogout) btnAdminLogout.addEventListener('click', adminLogout);

  const orderStatusFilter = document.getElementById('orderStatusFilter');
  if (orderStatusFilter) orderStatusFilter.addEventListener('change', renderAdminOrders);

  const productGameFilter = document.getElementById('productGameFilter');
  if (productGameFilter) productGameFilter.addEventListener('change', renderAdminProducts);

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Unified event delegation for package selection and auto-scroll
  document.addEventListener('click', (e) => {
    const priceItem = e.target.closest('.price-item');
    if (!priceItem) return;

    // Skip if it's out of stock
    if (priceItem.style.opacity === '0.6' || priceItem.innerText.includes('HABIS')) return;

    // Use stored item data for selection
    if (priceItem._itemData) {
      selectPrice(priceItem._itemData, priceItem);

      // Auto scroll with 400ms delay
      setTimeout(() => {
        smoothScrollTo('form-pesanan');
      }, 400);
    }
  });

  // Initialize
  initSDK();
  checkAdminSession();
});
