(function () {
    'use strict';

    const NAV = {
        admin: {
            groups: [
                {
                    label: 'Main',
                    links: [
                        { key: 'overview', label: 'Overview', icon: 'bi-grid-1x2', href: 'admin.html' },
                        { key: 'clients', label: 'Clients', icon: 'bi-people', href: 'admin-clients.html', badge: '250' },
                        { key: 'projects', label: 'Projects', icon: 'bi-kanban', href: 'admin-projects.html' },
                        { key: 'reports', label: 'Reports', icon: 'bi-bar-chart-line', href: 'admin-reports.html' },
                        { key: 'analytics', label: 'Analytics', icon: 'bi-graph-up-arrow', href: 'admin-analytics.html' }
                    ]
                },
                {
                    label: 'Manage',
                    links: [
                        { key: 'team', label: 'Team', icon: 'bi-person-badge', href: 'admin-team.html' },
                        { key: 'invoices', label: 'Invoices', icon: 'bi-receipt', href: 'admin-invoices.html' },
                        { key: 'settings', label: 'Settings', icon: 'bi-gear', href: 'admin-settings.html' }
                    ]
                }
            ]
        },
        client: {
            groups: [
                {
                    label: 'Workspace',
                    links: [
                        { key: 'overview', label: 'Overview', icon: 'bi-grid-1x2', href: 'client.html' },
                        { key: 'projects', label: 'My Projects', icon: 'bi-kanban', href: 'client-projects.html', badge: '3' },
                        { key: 'milestones', label: 'Milestones', icon: 'bi-flag', href: 'client-milestones.html' },
                        { key: 'documents', label: 'Documents', icon: 'bi-folder2-open', href: 'client-documents.html' }
                    ]
                },
                {
                    label: 'Billing',
                    links: [
                        { key: 'invoices', label: 'Invoices', icon: 'bi-receipt', href: 'client-invoices.html' },
                        { key: 'payments', label: 'Payments', icon: 'bi-credit-card', href: 'client-payments.html' }
                    ]
                },
                {
                    label: 'Support',
                    links: [
                        { key: 'help', label: 'Help Center', icon: 'bi-life-preserver', href: 'client-help.html' },
                        { key: 'settings', label: 'Settings', icon: 'bi-gear', href: 'client-settings.html' }
                    ]
                }
            ]
        }
    };

    const USER = {
        admin: { name: 'Arjun Kumar', role: 'Administrator', email: 'arjun@stackly.com', avatar: '' },
        client: { name: 'Meera Nair', role: 'Client Partner', email: 'meera@novagroup.com', avatar: 'alt' }
    };

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));

    const initialsFromName = (name) => {
        const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
        if (!parts.length) return 'U';
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const body = document.body;
    const role = body.getAttribute('data-dash-role');
    const active = body.getAttribute('data-dash-page') || 'overview';
    const config = NAV[role];

    if (!config) return;

    const storedName = (localStorage.getItem('stacklyUserName') || '').trim();
    const storedEmail = (localStorage.getItem('stacklyUserEmail') || '').trim();
    const user = Object.assign({}, USER[role], {
        name: storedName || USER[role].name,
        email: storedEmail || USER[role].email
    });

    user.initials = initialsFromName(user.name);

    const avatarClass = 'dash-avatar' + (user.avatar ? ' ' + user.avatar : '');
    const settingsHref = role === 'admin' ? 'admin-settings.html' : 'client-settings.html';

    const sidebarHost = document.getElementById('dashSidebarHost');
    const topbarHost = document.getElementById('dashTopbarHost');

    if (sidebarHost) {
        const groups = config.groups.map((group) => {
            const links = group.links.map((link) => {
                const isActive = link.key === active ? ' active' : '';
                const badge = link.badge ? '<span class="dash-nav-badge">' + link.badge + '</span>' : '';
                return '<a href="' + link.href + '" class="dash-nav-link' + isActive + '">' +
                    '<i class="bi ' + link.icon + '"></i><span>' + link.label + '</span>' + badge + '</a>';
            }).join('');
            return '<span class="dash-nav-label">' + group.label + '</span>' + links;
        }).join('');

        sidebarHost.innerHTML =
            '<aside class="dash-sidebar">' +
                '<a href="index.html" class="dash-brand">' +
                    '<img src="images/logo-brand.webp" alt="Stackly logo">' +
                '</a>' +
                '<nav class="dash-nav">' + groups + '</nav>' +
                '<div class="dash-sidebar-foot">' +
                    '<a href="' + settingsHref + '" class="dash-profile-link" title="Profile settings">' +
                        '<span class="' + avatarClass + '">' + escapeHtml(user.initials) + '</span>' +
                        '<div><strong>' + escapeHtml(user.name) + '</strong><small>' + escapeHtml(user.role) + '</small></div>' +
                    '</a>' +
                    '<div class="dash-sidebar-actions">' +
                        '<a href="index.html" class="dash-home-link" aria-label="Go to Home" title="Go to Home"><i class="bi bi-house-door"></i></a>' +
                        '<a href="login.html" aria-label="Sign out" title="Sign out"><i class="bi bi-box-arrow-right"></i></a>' +
                    '</div>' +
                '</div>' +
            '</aside>';
    }

    if (topbarHost) {
        topbarHost.innerHTML =
            '<header class="dash-topbar">' +
                '<button class="dash-toggle" id="dashToggle" type="button" aria-label="Toggle menu"><i class="bi bi-list"></i></button>' +
                '<div class="dash-topbar-title">' + (role === 'admin' ? 'Admin Dashboard' : 'Client Dashboard') + '</div>' +
                '<div class="dash-topbar-actions">' +
                    '<a href="' + settingsHref + '" class="dash-user" title="Profile settings">' +
                        '<div><strong>' + escapeHtml(user.name) + '</strong><small>' + escapeHtml(user.role) + '</small></div>' +
                        '<span class="' + avatarClass + '">' + escapeHtml(user.initials) + '</span>' +
                    '</a>' +
                '</div>' +
            '</header>';
    }

    document.querySelectorAll('[data-user-name]').forEach((element) => {
        element.textContent = user.name;
    });

    document.querySelectorAll('[data-user-first-name]').forEach((element) => {
        element.textContent = user.name.split(/\s+/)[0];
    });

    document.querySelectorAll('[data-user-email]').forEach((element) => {
        element.textContent = user.email;
    });

    document.querySelectorAll('[data-user-name-input]').forEach((element) => {
        element.value = user.name;
    });

    document.querySelectorAll('[data-user-email-input]').forEach((element) => {
        element.value = user.email;
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goToNotFound = () => {
        if (reduceMotion) {
            window.location.href = '404.html';
            return;
        }

        document.body.classList.add('is-leaving');
        window.setTimeout(() => {
            window.location.href = '404.html';
        }, 250);
    };

    document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = event.target;
        if (!(target instanceof Element)) return;
        if (!target.closest('.dash-content')) return;
        if (target.closest('.dash-sidebar, .dash-topbar, .faq')) return;
        if (target.closest('input, textarea, select, option, label')) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        goToNotFound();
    }, true);

    const isInternalLink = (link) => {
        const href = link.getAttribute('href');
        if (!href) return false;
        if (href.charAt(0) === '#') return false;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
        if (link.target === '_blank' || link.hasAttribute('download')) return false;

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return false;
        if (url.pathname === window.location.pathname && url.hash) return false;
        return /\.html$/i.test(url.pathname) || /\/$/.test(url.pathname);
    };

    document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('a');
        if (!link || !isInternalLink(link)) return;

        const destination = link.href.split('#')[0];
        if (destination === window.location.href.split('#')[0]) return;

        if (reduceMotion) return;

        event.preventDefault();
        document.body.classList.add('is-leaving');

        window.setTimeout(() => {
            window.location.href = link.href;
        }, 250);
    });

    window.addEventListener('pageshow', () => {
        document.body.classList.remove('is-leaving');
    });
})();
