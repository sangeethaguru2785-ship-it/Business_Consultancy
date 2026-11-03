/* ================================================================
   STACKLY — CONTACT FORM
   Client-side validation and submit feedback.
   ================================================================ */
(function () {
    'use strict';

    const form = document.querySelector('.contact-form');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailValidator = window.StacklyEmail;

    const NAME_REGEX = /^[A-Za-z\s]+$/;
    const PHONE_REGEX = /^[0-9]+$/;

    if (nameInput) {
        nameInput.addEventListener('beforeinput', (e) => {
            if (e.data && /[^A-Za-z\s]/.test(e.data)) {
                e.preventDefault();
            }
        });
        nameInput.addEventListener('input', () => {
            const cleaned = nameInput.value.replace(/[^A-Za-z\s]/g, '');
            if (nameInput.value !== cleaned) {
                nameInput.value = cleaned;
            }
            emailValidator.clearInvalid(nameInput);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('beforeinput', (e) => {
            if (e.data && /[^0-9]/.test(e.data)) {
                e.preventDefault();
            }
        });
        phoneInput.addEventListener('input', () => {
            const cleaned = phoneInput.value.replace(/[^0-9]/g, '');
            if (phoneInput.value !== cleaned) {
                phoneInput.value = cleaned;
            }
            emailValidator.clearInvalid(phoneInput);
        });
    }

    const setStatus = (message, isError) => {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(isError));
        status.classList.add('show');
    };

    const clearStatus = () => {
        if (!status) return;
        status.classList.remove('show', 'is-error');
        status.textContent = '';
    };

    form.addEventListener('input', (event) => {
        if (event.target === emailInput) {
            emailValidator.clearInvalid(emailInput);
        }
        if (status && status.classList.contains('is-error')) {
            clearStatus();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearStatus();

        if (nameInput) {
            const nameVal = nameInput.value.trim();

            if (!nameVal) {
                emailValidator.markInvalid(nameInput);
                setStatus('Please enter your full name.', true);
                nameInput.focus();
                return;
            }

            if (!NAME_REGEX.test(nameVal) || !/[A-Za-z]/.test(nameVal)) {
                emailValidator.markInvalid(nameInput);
                setStatus('Name must contain only alphabets (A–Z, a–z).', true);
                nameInput.focus();
                return;
            }

            emailValidator.clearInvalid(nameInput);
        }

        if (emailInput) {
            const email = emailInput.value.trim();

            if (!email) {
                emailValidator.markInvalid(emailInput);
                setStatus(emailValidator.emptyMessage, true);
                emailInput.focus();
                return;
            }

            if (!emailValidator.isValid(email)) {
                emailValidator.markInvalid(emailInput);
                setStatus(emailValidator.invalidMessage, true);
                emailInput.focus();
                return;
            }

            emailValidator.clearInvalid(emailInput);
        }

        if (phoneInput) {
            const phoneVal = phoneInput.value.trim();

            if (phoneVal && !PHONE_REGEX.test(phoneVal)) {
                emailValidator.markInvalid(phoneInput);
                setStatus('Phone number must contain only numeric digits (0–9).', true);
                phoneInput.focus();
                return;
            }

            emailValidator.clearInvalid(phoneInput);
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        window.location.href = '404.html';
    });
})();
