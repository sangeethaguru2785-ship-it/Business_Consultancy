(function () {
    'use strict';

    const roleButtons = Array.prototype.slice.call(document.querySelectorAll('.role-switch button'));
    const roleInput = document.getElementById('authRole');
    const roleHint = document.getElementById('roleHint');
    const alertBox = document.getElementById('authAlert');
    const form = document.getElementById('loginForm') || document.getElementById('signupForm');
    const nameInput = document.getElementById('signupName');
    const phoneInput = document.getElementById('signupPhone') || (form && form.querySelector('input[type="tel"], input[name="phone"]'));
    const emailInput = document.getElementById('loginEmail') || document.getElementById('signupEmail');
    const emailValidator = window.StacklyEmail;
    const passwordInput = document.getElementById('loginPassword') || document.getElementById('signupPassword');
    const passwordValidator = window.StacklyPassword;
    const rememberMeInput = document.getElementById('rememberMe');
    const rememberError = document.getElementById('rememberError');

    if (rememberMeInput) {
        rememberMeInput.addEventListener('change', function () {
            if (rememberMeInput.checked && rememberError) {
                rememberError.style.display = 'none';
            }
            if (emailValidator) emailValidator.clearInvalid(rememberMeInput);
        });
    }

    const NAME_REGEX = /^[A-Za-z\s]+$/;
    const PHONE_REGEX = /^[0-9]+$/;

    if (nameInput) {
        nameInput.addEventListener('beforeinput', function (e) {
            if (e.data && /[^A-Za-z\s]/.test(e.data)) {
                e.preventDefault();
            }
        });
        nameInput.addEventListener('input', function () {
            const cleaned = nameInput.value.replace(/[^A-Za-z\s]/g, '');
            if (nameInput.value !== cleaned) {
                nameInput.value = cleaned;
            }
            if (emailValidator) emailValidator.clearInvalid(nameInput);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('beforeinput', function (e) {
            if (e.data && /[^0-9]/.test(e.data)) {
                e.preventDefault();
            }
        });
        phoneInput.addEventListener('input', function () {
            const cleaned = phoneInput.value.replace(/[^0-9]/g, '');
            if (phoneInput.value !== cleaned) {
                phoneInput.value = cleaned;
            }
            if (emailValidator) emailValidator.clearInvalid(phoneInput);
        });
    }

    const hints = {
        login: {
            admin: 'Manage clients, projects and firm-wide performance.',
            client: 'Track your projects, milestones and invoices.'
        },
        signup: {
            admin: 'Create a firm workspace to manage clients and delivery.',
            client: 'Create a client account to track your engagements.'
        }
    };

    const mode = form && form.id === 'signupForm' ? 'signup' : 'login';

    const dashboardByRole = {
        admin: 'admin.html',
        client: 'client.html'
    };

    function nameFromEmail(email) {
        const local = String(email || '').split('@')[0].split('+')[0];
        const cleaned = local
            .replace(/[._-]+/g, ' ')
            .replace(/\d+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const name = cleaned
            .split(' ')
            .filter(Boolean)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');

        return name || 'User';
    }

    function formatName(name) {
        return String(name || '').replace(/\s+/g, ' ').trim();
    }

    function showAlert(message) {
        if (!alertBox) return;
        alertBox.textContent = message;
        alertBox.classList.add('show');
    }

    function clearAlert() {
        if (!alertBox) return;
        alertBox.textContent = '';
        alertBox.classList.remove('show');
    }

    function setRole(role) {
        if (role !== 'admin' && role !== 'client') role = 'client';

        roleButtons.forEach(function (button) {
            const isActive = button.getAttribute('data-role') === role;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if (roleInput) roleInput.value = role;
        if (roleHint) roleHint.textContent = hints[mode][role];
        clearAlert();
    }

    roleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const role = button.getAttribute('data-role');
            setRole(role);
            localStorage.setItem('stacklyRole', role);
        });
    });

    const storedRole = localStorage.getItem('stacklyRole');
    setRole(storedRole === 'admin' || storedRole === 'client' ? storedRole : 'admin');

    document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = document.getElementById(button.getAttribute('data-toggle-password'));
            if (!input) return;

            const reveal = input.type === 'password';
            input.type = reveal ? 'text' : 'password';
            button.innerHTML = '<i class="bi ' + (reveal ? 'bi-eye-slash' : 'bi-eye') + '"></i>';
            button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
        });
    });

    if (!form) return;

    form.addEventListener('input', function (event) {
        clearAlert();
        if (event.target && event.target.matches('input, textarea, select')) {
            emailValidator.clearInvalid(event.target);
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearAlert();

        if (mode === 'signup' && nameInput) {
            const nameVal = nameInput.value.trim();

            if (!nameVal) {
                emailValidator.markInvalid(nameInput);
                showAlert('Please enter your full name.');
                nameInput.focus();
                return;
            }

            if (!NAME_REGEX.test(nameVal) || !/[A-Za-z]/.test(nameVal)) {
                emailValidator.markInvalid(nameInput);
                showAlert('Name must contain only alphabets (A–Z, a–z).');
                nameInput.focus();
                return;
            }
        }

        if (phoneInput) {
            const phoneVal = phoneInput.value.trim();

            if (phoneVal && !PHONE_REGEX.test(phoneVal)) {
                emailValidator.markInvalid(phoneInput);
                showAlert('Phone number must contain only numeric digits (0–9).');
                phoneInput.focus();
                return;
            }
        }

        if (emailInput) {
            const emailValue = emailInput.value.trim();

            if (!emailValue) {
                emailValidator.markInvalid(emailInput);
                showAlert(emailValidator.emptyMessage);
                emailInput.focus();
                return;
            }

            if (!emailValidator.isValid(emailValue)) {
                emailValidator.markInvalid(emailInput);
                showAlert(emailValidator.invalidMessage);
                emailInput.focus();
                return;
            }
        }

        if (passwordInput) {
            const passwordError = passwordValidator.getError(passwordInput.value);

            if (passwordError) {
                passwordValidator.markInvalid(passwordInput);
                showAlert(passwordError);
                passwordInput.focus();
                return;
            }
        }

        if (mode === 'login' && rememberMeInput && !rememberMeInput.checked) {
            if (emailValidator) emailValidator.markInvalid(rememberMeInput);
            if (rememberError) {
                rememberError.textContent = 'Please select Remember Me to continue';
                rememberError.style.display = 'block';
            } else {
                showAlert('Please select Remember Me to continue');
            }
            rememberMeInput.focus();
            return;
        }

        if (mode === 'signup') {
            const confirmInput = document.getElementById('signupConfirm');

            if (!confirmInput || !confirmInput.value) {
                passwordValidator.markInvalid(confirmInput);
                showAlert('Please confirm your password.');
                if (confirmInput) confirmInput.focus();
                return;
            }

            if (passwordInput && confirmInput.value !== passwordInput.value) {
                passwordValidator.markInvalid(confirmInput);
                showAlert('Passwords do not match. Please try again.');
                confirmInput.focus();
                return;
            }
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const role = roleInput && roleInput.value === 'client' ? 'client' : 'admin';
        const dashboard = dashboardByRole[role];
        const fullNameInput = document.getElementById('signupName');
        const email = emailInput ? emailInput.value.trim() : '';
        const displayName = mode === 'signup' && fullNameInput && fullNameInput.value.trim()
            ? formatName(fullNameInput.value)
            : nameFromEmail(email);

        localStorage.setItem('stacklyRole', role);
        localStorage.setItem('stacklyUserName', displayName);
        localStorage.setItem('stacklyUserEmail', email);

        const submit = form.querySelector('button[type="submit"]');
        const label = mode === 'signup' ? 'Creating account' : 'Signing in';

        if (submit) {
            submit.disabled = true;
            submit.innerHTML = '<span class="auth-spinner"></span> ' + label + '...';
        }

        window.setTimeout(function () {
            window.location.href = dashboard;
        }, 700);
    });
})();
