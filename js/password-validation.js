(function () {
    'use strict';

    const MIN_LENGTH = 8;

    function formatList(items) {
        if (items.length === 1) return items[0];
        if (items.length === 2) return items[0] + ' and ' + items[1];
        return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
    }

    function getError(password) {
        const value = String(password || '');

        if (!value) return 'Please enter your password.';

        const missing = [];

        if (value.length < MIN_LENGTH) missing.push('at least ' + MIN_LENGTH + ' characters');
        if (!/[A-Z]/.test(value)) missing.push('an uppercase letter');
        if (!/[a-z]/.test(value)) missing.push('a lowercase letter');
        if (!/[0-9]/.test(value)) missing.push('a number');
        if (!/[^A-Za-z0-9\s]/.test(value)) missing.push('a special character');

        if (!missing.length) return '';
        return 'Password must include ' + formatList(missing) + '.';
    }

    function isValid(password) {
        return getError(password) === '';
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

    window.StacklyPassword = {
        minLength: MIN_LENGTH,
        isValid: isValid,
        getError: getError,
        markInvalid: markInvalid,
        clearInvalid: clearInvalid
    };
})();
