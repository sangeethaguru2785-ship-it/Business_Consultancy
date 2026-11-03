(function () {
    'use strict';

    const shell = document.getElementById('dashboardShell');
    const toggle = document.getElementById('dashToggle');
    const overlay = document.getElementById('dashOverlay');

    const closeSidebar = () => shell && shell.classList.remove('sidebar-open');

    if (toggle && shell) {
        toggle.addEventListener('click', () => shell.classList.toggle('sidebar-open'));
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    document.querySelectorAll('.dash-nav-link[href="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.dash-nav-link').forEach((el) => el.classList.remove('active'));
            link.classList.add('active');
            closeSidebar();
        });
    });

    if (!window.Chart) return;

    const palette = {
        primary: '#8b5cf6',
        primaryLt: '#a78bfa',
        cyan: '#22d3ee',
        teal: '#2dd4bf',
        gold: '#fbbf24',
        rose: '#fb7185',
        fuchsia: '#d946ef',
        grid: 'rgba(255, 255, 255, .06)',
        text: '#b4bcd4',
        surface: '#0d0923'
    };

    Chart.defaults.color = palette.text;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.borderColor = palette.grid;

    const legend = {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 18 }
    };

    const tooltip = {
        backgroundColor: 'rgba(13, 9, 35, .96)',
        borderColor: 'rgba(139, 92, 246, .35)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        titleColor: '#eef2ff',
        bodyColor: '#b4bcd4',
        displayColors: true,
        boxPadding: 4
    };

    const revenueCanvas = document.getElementById('revenueChart');

    if (revenueCanvas) {
        const ctx = revenueCanvas.getContext('2d');
        const fill = ctx.createLinearGradient(0, 0, 0, 280);
        fill.addColorStop(0, 'rgba(139, 92, 246, .45)');
        fill.addColorStop(1, 'rgba(139, 92, 246, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [180, 210, 195, 260, 300, 280, 340, 365, 410, 390, 445, 480],
                        borderColor: palette.primary,
                        backgroundColor: fill,
                        fill: true,
                        tension: .42,
                        borderWidth: 2.5,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: palette.cyan,
                        pointHoverBorderColor: '#fff'
                    },
                    {
                        label: 'Target',
                        data: [200, 220, 240, 260, 285, 305, 330, 355, 380, 405, 430, 460],
                        borderColor: palette.cyan,
                        borderDash: [6, 6],
                        fill: false,
                        tension: .42,
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend, tooltip },
                scales: {
                    x: { grid: { display: false }, ticks: { maxRotation: 0 } },
                    y: {
                        grid: { color: palette.grid },
                        ticks: { callback: (value) => '$' + value + 'k' }
                    }
                }
            }
        });
    }

    const statusCanvas = document.getElementById('statusChart');

    if (statusCanvas) {
        new Chart(statusCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Completed', 'On Hold', 'At Risk'],
                datasets: [{
                    data: [48, 126, 14, 8],
                    backgroundColor: [palette.cyan, palette.teal, palette.gold, palette.rose],
                    borderColor: palette.surface,
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: { legend, tooltip }
            }
        });
    }

    const progressCanvas = document.getElementById('progressChart');

    if (progressCanvas) {
        new Chart(progressCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending'],
                datasets: [{
                    data: [14, 3, 1],
                    backgroundColor: [palette.teal, palette.cyan, palette.gold],
                    borderColor: palette.surface,
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: { legend, tooltip }
            }
        });
    }

    const analyticsRevenueCanvas = document.getElementById('analyticsRevenueChart');

    if (analyticsRevenueCanvas) {
        const ctx = analyticsRevenueCanvas.getContext('2d');
        const fill = ctx.createLinearGradient(0, 0, 0, 280);
        fill.addColorStop(0, 'rgba(34, 211, 238, .4)');
        fill.addColorStop(1, 'rgba(34, 211, 238, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [180, 210, 195, 260, 300, 280, 340, 365, 410, 390, 445, 480],
                        borderColor: palette.cyan,
                        backgroundColor: fill,
                        fill: true,
                        tension: .42,
                        borderWidth: 2.5,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: palette.primary
                    },
                    {
                        label: 'Pipeline',
                        data: [220, 245, 260, 300, 330, 360, 390, 430, 470, 520, 560, 610],
                        borderColor: palette.primaryLt,
                        borderDash: [6, 6],
                        fill: false,
                        tension: .42,
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend, tooltip },
                scales: {
                    x: { grid: { display: false }, ticks: { maxRotation: 0 } },
                    y: { grid: { color: palette.grid }, ticks: { callback: (value) => '$' + value + 'k' } }
                }
            }
        });
    }

    const analyticsSourceCanvas = document.getElementById('analyticsSourceChart');

    if (analyticsSourceCanvas) {
        new Chart(analyticsSourceCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Financial Services', 'Retail', 'Technology', 'Healthcare', 'Energy'],
                datasets: [{
                    data: [32, 24, 19, 15, 10],
                    backgroundColor: [palette.primary, palette.cyan, palette.teal, palette.gold, palette.rose],
                    borderColor: palette.surface,
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '66%',
                plugins: { legend, tooltip }
            }
        });
    }

    const spendCanvas = document.getElementById('spendChart');

    if (spendCanvas) {
        const ctx = spendCanvas.getContext('2d');
        const fill = ctx.createLinearGradient(0, 0, 0, 240);
        fill.addColorStop(0, 'rgba(34, 211, 238, .85)');
        fill.addColorStop(1, 'rgba(34, 211, 238, .18)');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [{
                    label: 'Spend',
                    data: [8.5, 6.2, 12.4, 9.1, 7.8, 10.2],
                    backgroundColor: fill,
                    hoverBackgroundColor: palette.primary,
                    borderRadius: 8,
                    borderSkipped: false,
                    maxBarThickness: 34
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: palette.grid },
                        ticks: { callback: (value) => '$' + value + 'k' }
                    }
                }
            }
        });
    }
})();
