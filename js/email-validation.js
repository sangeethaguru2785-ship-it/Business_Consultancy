(function () {
    'use strict';

    const INVALID_MESSAGE = 'Please enter a valid email address (e.g. name@company.com).';
    const EMPTY_MESSAGE = 'Please enter your email address.';

    function isValidEmail(value) {
        const email = String(value || '').trim();

        if (!email || email.length > 254) return false;
        if (/\s/.test(email)) return false;
        if ((email.match(/@/g) || []).length !== 1) return false;
        if (email.indexOf('..') !== -1) return false;

        const parts = email.split('@');
        const local = parts[0];
        const domain = parts[1];

        if (!local || local.length > 64) return false;
        if (!/^[A-Za-z0-9._%+-]+$/.test(local)) return false;
        if (local.charAt(0) === '.' || local.charAt(local.length - 1) === '.') return false;

        const labels = domain.split('.');
        if (labels.length < 2) return false;
        if (!/^[A-Za-z]{2,63}$/.test(labels[labels.length - 1])) return false;

        for (let i = 0; i < labels.length; i += 1) {
            const label = labels[i];
            if (!label || label.length > 63) return false;
            if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)) return false;
        }

        return true;
    }

    function markInvalid(input) {
        if (!input) return;
        input.classList.add('field-invalid');
        input.setAttribute('aria-invalid', 'true');
    }

    function clearInvalid(input) {
        if (!input) return;
        input.classList.remove('field-invalid');
        input.removeAttribute('aria-invalid');
    }

    window.StacklyEmail = {
        isValid: isValidEmail,
        invalidMessage: INVALID_MESSAGE,
        emptyMessage: EMPTY_MESSAGE,
        markInvalid: markInvalid,
        clearInvalid: clearInvalid
    };
})();
