import { mockData } from './mockData.js';

const els = {
    loading: document.getElementById('loading'),
    noData: document.getElementById('no-data'),
    content: document.getElementById('wallet-content'),
    avatar: document.getElementById('user-avatar'),
    name: document.getElementById('user-name'),
    email: document.getElementById('user-email'),
    status: document.getElementById('user-status'),
    balance: document.getElementById('user-balance'),
    transactions: document.getElementById('transactions-list')
};

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function renderUser(user) {
    // 0. Detect View from Query Params
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view') || 'payments'; // Default to payments

    // Hide loading, show content
    els.loading.style.display = 'none';
    els.noData.style.display = 'none';
    els.content.style.display = 'block';

    // Update Profile
    els.avatar.src = user.avatar;
    els.name.textContent = user.name;
    els.email.textContent = user.email;
    els.status.textContent = user.status;

    // Determine target data and title
    let targetData = [];
    let title = "Recent Transactions";
    let balanceLabel = "Current Balance";

    // Show/Hide Admin Section
    const adminSection = document.getElementById('admin-actions');
    if (adminSection) adminSection.style.display = (view === 'admin') ? 'grid' : 'none';

    if (view === 'payouts') {
        targetData = user.payouts || [];
        title = "Recent Payouts";
        balanceLabel = "Total Payouts";
    } else if (view === 'orders') {
        targetData = user.orders || [];
        title = "Recent Orders";
        balanceLabel = "Total Spent";
    } else if (view === 'admin') {
        targetData = []; // Admin view might show logs instead
        title = "Employee Admin Panel";
        balanceLabel = "Risk Score";
        els.balance.textContent = "Low (0.05)";
    } else {
        targetData = user.payments || [];
        title = "Recent Payments";
        balanceLabel = "Current Balance";
    }

    // Update Titles
    const headerTitle = document.querySelector('.transactions-header span');
    const labelText = document.querySelector('.balance-label');
    if (headerTitle) headerTitle.textContent = title;
    if (labelText) labelText.textContent = balanceLabel;

    if (view !== 'admin') {
        els.balance.textContent = formatCurrency(user.balance, user.currency);
    }

    // Update Transactions/List
    els.transactions.innerHTML = '';
    if (view !== 'admin' && targetData.length === 0) {
        els.transactions.innerHTML = '<div class="empty-state" style="padding:20px">No data for this category.</div>';
    }

    targetData.forEach(t => {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const isCredit = t.type === 'credit';
        const sign = isCredit ? '+' : '';
        const amountClass = isCredit ? 'credit' : 'debit';

        const subtext = view === 'orders' ? `Order ID: ${t.id} • ${t.status}` : formatDate(t.date);

        item.innerHTML = `
            <div class="t-info">
                <span class="t-desc">${t.description}</span>
                <span class="t-date">${subtext}</span>
            </div>
            <div class="t-amount ${amountClass}">${sign}${formatCurrency(t.amount, user.currency)}</div>
        `;
        els.transactions.appendChild(item);
    });
}

// Admin Action Logics
window.performAction = function (action) {
    const actions = {
        block: { msg: "Юзер заблокирован!", color: "#ef4444" },
        refund: { msg: "Возврат оформлен!", color: "#3b82f6" },
        verify: { msg: "Личность подтверждена!", color: "#10b981" }
    };

    const config = actions[action];
    alert(config.msg);
    console.log(`Admin took action: ${action}`);
};

function renderNoData() {
    els.loading.style.display = 'none';
    els.content.style.display = 'none';
    els.noData.style.display = 'block';
}

function handleMessage(event) {
    // 1. Log the raw event for debugging
    console.log("Raw event received from sender:", event.origin, event.data);

    let eventData = event.data;

    // 2. Handle stringified JSON just in case
    if (typeof eventData === 'string') {
        try {
            eventData = JSON.parse(eventData);
            console.log("Parsed stringified eventData:", eventData);
        } catch (e) {
            console.error("Failed to parse eventData as JSON:", e);
            return;
        }
    }

    // 3. Check for Chatwoot appContext event
    if (eventData && eventData.event === 'appContext' && eventData.data && eventData.data.contact) {
        const email = eventData.data.contact.email;
        console.log("Found email in context:", email);

        if (!email) {
            console.warn("Email is null or empty in the received contact context.");
            renderNoData();
            return;
        }

        // 4. Case-insensitive search
        const user = mockData.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
            console.log("Matching user found:", user.name);
            renderUser(user);
        } else {
            console.warn(`User with email [${email}] not found in mock data.`);
            renderNoData();
            // Show a temporary debug message in the UI so the user knows what email was received
            els.noData.innerHTML = `<p>No wallet account found for <b>${email}</b>.</p><p style='font-size:10px; color:gray'>Received event type: ${eventData.event}</p>`;
        }
    } else {
        console.log("Ignored event (not appContext or missing contact info)");
    }
}

// Listen for Chatwoot events
window.addEventListener("message", handleMessage);

// --- DEV MODE HELPERS ---
// Uncomment to test locally without Chatwoot
/*
setTimeout(() => {
    window.postMessage({
        event: 'appContext',
        data: {
            contact: {
                email: 'test@example.com' 
            }
        }
    }, '*');
}, 1000);
*/
