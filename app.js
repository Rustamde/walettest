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
    // Hide loading, show content
    els.loading.style.display = 'none';
    els.noData.style.display = 'none';
    els.content.style.display = 'block';

    // Update Profile
    els.avatar.src = user.avatar;
    els.name.textContent = user.name;
    els.email.textContent = user.email;
    els.status.textContent = user.status;

    // Update Balance
    els.balance.textContent = formatCurrency(user.balance, user.currency);

    // Update Transactions
    els.transactions.innerHTML = ''; // Clear prev
    user.transactions.forEach(t => {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const isCredit = t.type === 'credit';
        const sign = isCredit ? '+' : '';
        const amountClass = isCredit ? 'credit' : 'debit';

        item.innerHTML = `
            <div class="t-info">
                <span class="t-desc">${t.description}</span>
                <span class="t-date">${formatDate(t.date)}</span>
            </div>
            <div class="t-amount ${amountClass}">${sign}${formatCurrency(t.amount, user.currency)}</div>
        `;
        els.transactions.appendChild(item);
    });
}

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
