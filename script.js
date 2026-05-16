document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const pageSections = document.querySelectorAll('.page-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target section id
            const targetId = item.getAttribute('data-target');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Hide all sections
            pageSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Optionally, update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Handle initial load with hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetNav = document.querySelector(`.nav-item[data-target="${hash}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }

    // Toggle like buttons
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.style.color = '#ff4757'; // Red
            } else {
                icon.style.color = ''; // Default
            }
        });
    });

    // Toggle donation pills
    const donationPills = document.querySelectorAll('.donation-options .glass-pill');
    donationPills.forEach(pill => {
        pill.addEventListener('click', () => {
            donationPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Mobile nav toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const headerRight = document.querySelector('.header-right');
    if (mobileNavToggle && headerRight) {
        mobileNavToggle.addEventListener('click', () => {
            headerRight.classList.toggle('show');
        });
    }

    // Nav items in header (like Crypto)
    const headerNavItems = document.querySelectorAll('.nav-item-header[data-target]');
    headerNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            // Remove active from other header navs/filters
            document.querySelectorAll('.filter-btn').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Hide all sections
            pageSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Filter Buttons (General toggle)
    const filterBtns = document.querySelectorAll('.filter-btn:not(.nav-item-header)');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            
            // If we are filtering, we should make sure we are on the home page
            const homeNav = document.querySelector('.nav-item[data-target="home"]');
            if (homeNav && !homeNav.classList.contains('active')) {
                homeNav.click();
            }
        });
    });

    // Tabs toggle
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Interactive buttons feedback (Catch all others)
    const interactiveBtns = document.querySelectorAll('button:not(.filter-btn):not(.tab):not(.like-btn):not(.mobile-nav-toggle), .tag.add');
    interactiveBtns.forEach(btn => {
        if (!btn.classList.contains('theme-toggle') && !btn.closest('.donation-options') && !btn.classList.contains('nav-item')) {
            btn.addEventListener('click', (e) => {
                if (btn.tagName === 'A') e.preventDefault();
                alert('Feature coming soon! Thanks for exploring.');
            });
        }
    });

    // Live Clock
    const liveClock = document.getElementById('live-clock');
    if (liveClock) {
        setInterval(() => {
            const now = new Date();
            // Format: Hari, Tanggal Bulan Tahun HH:MM:SS
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            liveClock.innerHTML = now.toLocaleDateString('id-ID', options).replace(/\./g, ':');
        }, 1000);
    }

    // Live Market Simulation
    const liveAssets = document.querySelectorAll('.live-asset');
    if (liveAssets.length > 0) {
        setInterval(() => {
            liveAssets.forEach(asset => {
                const priceEl = asset.querySelector('.mc-price');
                const changeEl = asset.querySelector('.mc-change');
                const pctEl = asset.querySelector('.pct');
                const pathEl = asset.querySelector('.chart-path');
                
                if (!priceEl || !pctEl) return;
                
                // Get base price
                let basePrice = parseFloat(priceEl.getAttribute('data-base'));
                
                // Generate random fluctuation (-0.5% to +0.5%)
                let fluctuation = (Math.random() - 0.5) * 0.01;
                let newPrice = basePrice * (1 + fluctuation);
                
                // Update base price
                priceEl.setAttribute('data-base', newPrice);
                
                // Format IDR
                let prefix = 'Rp ';
                priceEl.innerHTML = prefix + Math.round(newPrice).toLocaleString('id-ID');
                
                // Fluctuate percentage
                let currentPct = parseFloat(pctEl.innerHTML);
                // The currentPct is absolute in the HTML, we need to know if it was fall or growth
                let isFall = changeEl.classList.contains('fall');
                let actualPct = isFall ? -currentPct : currentPct;
                
                let newPct = actualPct + (fluctuation * 100);
                
                // Update DOM
                if (newPct >= 0) {
                    changeEl.className = 'mc-change growth';
                    changeEl.innerHTML = '+<span class="pct">' + Math.abs(newPct).toFixed(2) + '</span>%';
                    if (pathEl) pathEl.setAttribute('stroke', '#4ade80');
                } else {
                    changeEl.className = 'mc-change fall';
                    changeEl.innerHTML = '-<span class="pct">' + Math.abs(newPct).toFixed(2) + '</span>%';
                    if (pathEl) pathEl.setAttribute('stroke', '#ef4444');
                }
                
                // Flash effect for price change
                priceEl.style.transition = 'opacity 0.2s';
                priceEl.style.opacity = '0.5';
                setTimeout(() => {
                    priceEl.style.opacity = '1';
                }, 200);
            });
        }, 3000); // Update every 3 seconds
    }
});
