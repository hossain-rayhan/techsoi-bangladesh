/**
 * TechSoi Bangladesh - Main Application JavaScript
 * Handles tab navigation, pagination, and card rendering
 * Optimized for performance with lazy loading
 */

// ===== Configuration =====
const CONFIG = {
    dataPath: './data',
    itemsPerPage: 12,
    detailPages: {
        proposals: './pages/proposal-detail.html',
        issues: './pages/issue-detail.html'
    }
};

// ===== State Management =====
const state = {
    proposals: [],
    issues: [],
    activeTab: 'proposals',
    pagination: {
        proposals: { currentPage: 1, totalPages: 1 },
        issues: { currentPage: 1, totalPages: 1 }
    }
};

// ===== DOM Elements =====
const elements = {
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    proposalsGrid: document.getElementById('proposals-grid'),
    issuesGrid: document.getElementById('issues-grid'),
    proposalCount: document.getElementById('proposal-count'),
    issueCount: document.getElementById('issue-count')
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadData();
});

// ===== Tab Navigation =====
function initTabs() {
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update active tab button
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update active tab pane
    elements.tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
    });

    state.activeTab = tabId;
}

// ===== Data Loading (Lightweight Index Files) =====
async function loadData() {
    try {
        // Load lightweight index files in parallel
        const [proposalsIndex, issuesIndex] = await Promise.all([
            fetchJSON(`${CONFIG.dataPath}/proposals-index.json`),
            fetchJSON(`${CONFIG.dataPath}/issues-index.json`)
        ]);

        state.proposals = proposalsIndex.proposals || [];
        state.issues = issuesIndex.issues || [];

        // Calculate pagination
        state.pagination.proposals.totalPages = Math.ceil(state.proposals.length / CONFIG.itemsPerPage);
        state.pagination.issues.totalPages = Math.ceil(state.issues.length / CONFIG.itemsPerPage);

        // Update UI
        renderProposals();
        renderIssues();
        updateCounts(proposalsIndex.totalCount, issuesIndex.totalCount);
    } catch (error) {
        console.error('Error loading data:', error);
        showError(elements.proposalsGrid, 'Failed to load proposals');
        showError(elements.issuesGrid, 'Failed to load issues');
    }
}

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// ===== Pagination =====
function getPageItems(items, page) {
    const start = (page - 1) * CONFIG.itemsPerPage;
    const end = start + CONFIG.itemsPerPage;
    return items.slice(start, end);
}

function createPagination(type) {
    const { currentPage, totalPages } = state.pagination[type];
    
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage('${type}', ${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}>
            ← Prev
        </button>
    `;

    // Page numbers
    paginationHTML += '<div class="pagination-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `
                <button class="pagination-num ${i === currentPage ? 'active' : ''}"
                        onclick="changePage('${type}', ${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    paginationHTML += '</div>';

    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}"
                onclick="changePage('${type}', ${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;

    paginationHTML += '</div>';
    return paginationHTML;
}

function changePage(type, page) {
    const { totalPages } = state.pagination[type];
    
    if (page < 1 || page > totalPages) return;
    
    state.pagination[type].currentPage = page;
    
    if (type === 'proposals') {
        renderProposals();
    } else {
        renderIssues();
    }

    // Scroll to top of content
    document.querySelector('.tab-content').scrollIntoView({ behavior: 'smooth' });
}

// Make changePage globally available
window.changePage = changePage;

// ===== Rendering Functions =====
function renderProposals() {
    const currentPage = state.pagination.proposals.currentPage;
    const pageItems = getPageItems(state.proposals, currentPage);

    if (state.proposals.length === 0) {
        elements.proposalsGrid.innerHTML = createEmptyState(
            '💡',
            'No Proposals Yet',
            'Be the first to submit a technology proposal for Bangladesh!'
        );
        return;
    }

    const cardsHTML = pageItems.map(proposal => createProposalCard(proposal)).join('');
    const paginationHTML = createPagination('proposals');

    elements.proposalsGrid.innerHTML = `
        <div class="cards-container">${cardsHTML}</div>
        ${paginationHTML}
    `;

    // Add click handlers
    addCardClickHandlers(elements.proposalsGrid, 'proposal');
}

function renderIssues() {
    const currentPage = state.pagination.issues.currentPage;
    const pageItems = getPageItems(state.issues, currentPage);

    if (state.issues.length === 0) {
        elements.issuesGrid.innerHTML = createEmptyState(
            '📋',
            'No Issues Documented',
            'Help us identify problems that need technology solutions!'
        );
        return;
    }

    const cardsHTML = pageItems.map(issue => createIssueCard(issue)).join('');
    const paginationHTML = createPagination('issues');

    elements.issuesGrid.innerHTML = `
        <div class="cards-container">${cardsHTML}</div>
        ${paginationHTML}
    `;

    // Add click handlers
    addCardClickHandlers(elements.issuesGrid, 'issue');
}

function createProposalCard(proposal) {
    const icon = getProposalIcon(proposal.category);
    const statusClass = getStatusClass(proposal.status);

    return `
        <article class="card" data-id="${proposal.id}" data-type="proposal">
            <div class="card-header">
                <div class="card-icon">${icon}</div>
                <div class="card-title-group">
                    <h4 class="card-title">${escapeHtml(proposal.title)}</h4>
                    <span class="card-category">${escapeHtml(proposal.category)}</span>
                </div>
            </div>
            <div class="card-body">
                <p class="card-description">${escapeHtml(proposal.summary)}</p>
            </div>
            <div class="card-footer">
                <span class="card-status ${statusClass}">${proposal.status}</span>
                <span class="card-arrow">→</span>
            </div>
        </article>
    `;
}

function createIssueCard(issue) {
    const icon = getIssueIcon(issue.category);
    const statusClass = getStatusClass(issue.status);

    return `
        <article class="card" data-id="${issue.id}" data-type="issue">
            <div class="card-header">
                <div class="card-icon">${icon}</div>
                <div class="card-title-group">
                    <h4 class="card-title">${escapeHtml(issue.title)}</h4>
                    <span class="card-category">${escapeHtml(issue.category)}</span>
                </div>
            </div>
            <div class="card-body">
                <p class="card-description">${escapeHtml(issue.summary)}</p>
            </div>
            <div class="card-footer">
                <span class="card-status ${statusClass}">${issue.status}</span>
                <span class="card-arrow">→</span>
            </div>
        </article>
    `;
}

function createEmptyState(icon, title, message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
}

// ===== Card Click Handlers =====
function addCardClickHandlers(container, type) {
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            navigateToDetail(type, id);
        });
    });
}

function navigateToDetail(type, id) {
    const detailPage = type === 'proposal' 
        ? CONFIG.detailPages.proposals 
        : CONFIG.detailPages.issues;
    
    window.location.href = `${detailPage}?id=${encodeURIComponent(id)}`;
}

// ===== Helper Functions =====
function updateCounts(proposalCount, issueCount) {
    if (elements.proposalCount) {
        animateCount(elements.proposalCount, proposalCount);
    }
    if (elements.issueCount) {
        animateCount(elements.issueCount, issueCount);
    }
}

function animateCount(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 20);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 50);
}

function getProposalIcon(category) {
    const icons = {
        'governance': '🏛️',
        'healthcare': '🏥',
        'education': '📚',
        'transportation': '🚌',
        'agriculture': '🌾',
        'finance': '💰',
        'environment': '🌳',
        'technology': '💻',
        'default': '💡'
    };
    return icons[category?.toLowerCase()] || icons.default;
}

function getIssueIcon(category) {
    const icons = {
        'corruption': '⚖️',
        'healthcare': '🏥',
        'education': '📚',
        'infrastructure': '🏗️',
        'environment': '🌍',
        'economy': '📊',
        'social': '👥',
        'default': '📋'
    };
    return icons[category?.toLowerCase()] || icons.default;
}

function getStatusClass(status) {
    const statusMap = {
        'active': 'active',
        'in progress': 'active',
        'pending': 'pending',
        'under review': 'review',
        'review': 'review',
        'new': 'new',
        'open': 'new'
    };
    return statusMap[status?.toLowerCase()] || 'new';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h4>Oops! Something went wrong</h4>
            <p>${message}</p>
        </div>
    `;
}

// ===== Export for detail pages =====
window.TechSoi = {
    state,
    fetchJSON,
    escapeHtml,
    getProposalIcon,
    getIssueIcon,
    getStatusClass
};
