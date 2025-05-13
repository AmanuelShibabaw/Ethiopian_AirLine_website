document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Page navigation logic
    const allNavLinks = document.querySelectorAll('.nav-link-custom, .btn-custom[data-page], .footer-nav-link[data-page]');
    const pageSections = document.querySelectorAll('.page-section');
    const mainContent = document.getElementById('mainContent');
    const skeletonLoaderResults = document.getElementById('skeletonLoaderResults');
    const actualFlightResults = document.getElementById('actualFlightResults');

    function setActivePage(pageId, skipScroll = false) {
        pageSections.forEach(section => {
            if (section) section.classList.add('hidden');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('hidden');
            if (!skipScroll && mainContent) {
                // Scroll to top of main content, not the entire window
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (pageId === 'searchResults') {
                if (skeletonLoaderResults) skeletonLoaderResults.style.display = 'block';
                if (actualFlightResults) actualFlightResults.classList.add('hidden');
                setTimeout(() => {
                    if (skeletonLoaderResults) skeletonLoaderResults.style.display = 'none';
                    if (actualFlightResults) actualFlightResults.classList.remove('hidden');
                    lucide.createIcons();
                }, 1500);
            }
        } else {
            console.warn(`Page section with ID "${pageId}" not found.`);
        }

        // Update active link styling for main nav and mobile nav
        document.querySelectorAll('.nav-link-custom').forEach(link => {
            if (link) {
                link.classList.remove('nav-link-active-custom');
                if (link.dataset.page === pageId) {
                    link.classList.add('nav-link-active-custom');
                }
            }
        });

        const mobileMenuElement = document.getElementById('mobile-menu');
        if (mobileMenuElement && mobileMenuElement.classList.contains('block')) {
            toggleMobileMenu(); // Close mobile menu after navigation
        }
        lucide.createIcons(); // Re-render icons after page change
    }

    allNavLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                if (pageId) {
                    setActivePage(pageId);
                }
            });
        }
    });

    setActivePage('home', true); // Initial page load (Home), skip scroll

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMobileMenu() {
        if (mobileMenu && mobileMenuButton) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            // Toggle icons by finding them within the button
            const icons = mobileMenuButton.querySelectorAll('.current-icon');
            icons.forEach(icon => icon.classList.toggle('hidden'));
        }
    }
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }


    // Login Modal Logic
    const loginModal = document.getElementById('loginModal');
    const loginModalButton = document.getElementById('loginModalButton');
    const loginModalButtonMobile = document.getElementById('loginModalButtonMobile');
    const closeLoginModalButton = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm'); // Changed from loginSubmitButton to the form
    const userProfileDropdownContainer = document.getElementById('userProfileDropdownContainer');
    const userProfileDropdownContainerMobile = document.getElementById('userProfileDropdownContainerMobile');

    function openLoginModal() { if (loginModal) loginModal.classList.add('show'); }
    function closeLoginModal() { if (loginModal) loginModal.classList.remove('show'); }

    if (loginModalButton) loginModalButton.addEventListener('click', openLoginModal);
    if (loginModalButtonMobile) loginModalButtonMobile.addEventListener('click', openLoginModal);
    if (closeLoginModalButton) closeLoginModalButton.addEventListener('click', closeLoginModal);

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => { // Changed to listen to form submit
            e.preventDefault();
            closeLoginModal();
            showToast('Login successful! Welcome back.', 'success');
            if (loginModalButton) loginModalButton.classList.add('hidden');
            if (loginModalButtonMobile) loginModalButtonMobile.classList.add('hidden');
            if (userProfileDropdownContainer) userProfileDropdownContainer.classList.remove('hidden');
            if (userProfileDropdownContainerMobile) userProfileDropdownContainerMobile.classList.remove('hidden');
            lucide.createIcons(); // Refresh icons if profile pic appears
        });
    }

    // User Profile Dropdown Toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userProfileDropdown = document.getElementById('userProfileDropdown');

    if (userMenuButton && userProfileDropdown) {
        userMenuButton.addEventListener('click', () => {
            const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true' || false;
            userMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            userProfileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
            if (userProfileDropdown && !userProfileDropdown.classList.contains('hidden') && userMenuButton && !userMenuButton.contains(event.target) && !userProfileDropdown.contains(event.target)) {
                userProfileDropdown.classList.add('hidden');
                userMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Toast Notification Logic
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    function showToast(message, type = 'success') {
        if (toastMessage && toastNotification) {
            toastMessage.textContent = message;
            toastNotification.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-sky-500'); // Clear other types
            if (type === 'success') toastNotification.classList.add('bg-green-500');
            else if (type === 'error') toastNotification.classList.add('bg-red-500');
            else if (type === 'warning') toastNotification.classList.add('bg-yellow-500');
            else if (type === 'info') toastNotification.classList.add('bg-sky-500'); // Added info type

            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);
        }
    }

    // Confirm Booking Button
    const confirmBookingButton = document.getElementById('confirmBookingButton');
    if (confirmBookingButton) {
        confirmBookingButton.addEventListener('click', () => {
            showToast('Booking Confirmed! Check your email for details.', 'success');
            setTimeout(() => setActivePage('dashboard'), 1000);
        });
    }

    // Seat Selection Logic
    const seatMapContainer = document.getElementById('seatMapContainer');
    const selectedSeatDisplay = document.getElementById('selectedSeatDisplay');
    if (seatMapContainer && selectedSeatDisplay) {
        seatMapContainer.addEventListener('click', (e) => {
            const seat = e.target.closest('.seat-base'); // Target base class
            if (seat && !seat.classList.contains('seat-occupied')) {
                const currentSelected = seatMapContainer.querySelector('.seat-selected');
                if (currentSelected && currentSelected !== seat) {
                    currentSelected.classList.remove('seat-selected');
                    currentSelected.classList.add('seat-available');
                }
                seat.classList.toggle('seat-selected');
                seat.classList.toggle('seat-available'); // Toggle available only if not becoming selected

                const newlySelectedSeat = seatMapContainer.querySelector('.seat-selected');
                selectedSeatDisplay.textContent = newlySelectedSeat ? newlySelectedSeat.dataset.seat : 'None';
            }
        });
    }

    // Dashboard Navigation
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
    const dashboardContents = document.querySelectorAll('.dashboard-content');

    dashboardNavItems.forEach(item => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHref = item.getAttribute('href');
                if (!targetHref || !targetHref.startsWith('#')) return; // Basic check for valid href

                // Handle logout separately
                if (item.id === 'dashboardLogoutButton') {
                    showToast('Logged out successfully.', 'info');
                    // Simulate logged out state
                    if (loginModalButton) loginModalButton.classList.remove('hidden');
                    if (loginModalButtonMobile) loginModalButtonMobile.classList.remove('hidden');
                    if (userProfileDropdownContainer) userProfileDropdownContainer.classList.add('hidden');
                    if (userProfileDropdownContainerMobile) userProfileDropdownContainerMobile.classList.add('hidden');
                    if (userProfileDropdown && !userProfileDropdown.classList.contains('hidden')) userProfileDropdown.classList.add('hidden'); // Close dropdown if open
                    setActivePage('home');
                    return;
                }

                const targetId = targetHref.substring(1) + 'Content';

                dashboardNavItems.forEach(nav => {
                    if (nav) {
                        nav.classList.remove('bg-sky-100', 'text-sky-700');
                        nav.classList.add('text-gray-600');
                    }
                });
                item.classList.add('bg-sky-100', 'text-sky-700');
                item.classList.remove('text-gray-600');

                dashboardContents.forEach(content => {
                    if (content) content.classList.add('hidden');
                });
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                } else {
                    console.warn(`Dashboard content with ID "${targetId}" not found.`);
                }
                lucide.createIcons();
            });
        }
    });

    // Admin Panel Navigation
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    const adminContents = document.querySelectorAll('.admin-content');

    adminNavItems.forEach(item => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHref = item.getAttribute('href');
                if (!targetHref || !targetHref.startsWith('#')) return;
                const targetId = targetHref.substring(1) + 'Content';

                adminNavItems.forEach(nav => {
                    if (nav) {
                        nav.classList.remove('bg-sky-100', 'text-sky-700');
                        nav.classList.add('text-gray-600');
                    }
                });
                item.classList.add('bg-sky-100', 'text-sky-700');
                item.classList.remove('text-gray-600');

                adminContents.forEach(content => {
                    if (content) content.classList.add('hidden');
                });
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                } else {
                    console.warn(`Admin content with ID "${targetId}" not found.`);
                }
                lucide.createIcons();
            });
        }
    });

    // Set current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Flight Search Form Submission
    const flightSearchForm = document.getElementById('flightSearchForm');
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            setActivePage('searchResults');
            showToast('Searching for flights...', 'info');
        });
    }
}); // End of DOMContentLoaded