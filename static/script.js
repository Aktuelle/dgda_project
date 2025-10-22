document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = 0;

    // Open lightbox when an image is clicked
    galleryGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const clickedImage = e.target;
            const clickedItems = Array.from(galleryItems);
            currentIndex = clickedItems.indexOf(clickedImage);

            openLightbox(clickedImage);
        }
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigate images
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    function openLightbox(image) {
        lightboxImage.src = image.src;
        lightboxCaption.textContent = image.alt;
        lightbox.style.display = 'flex';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function prevImage() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        updateLightboxImage();
    }

    function nextImage() {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const nextImage = galleryItems[currentIndex];
        lightboxImage.src = nextImage.src; // Corrected to use nextImage.src
        lightboxCaption.textContent = nextImage.alt;
    }
    // ... existing lightbox JavaScript code ...

    // --- Upcoming Events Calendar ---
    const upcomingEvents = [
        { date: 'Oct 25, 2025', title: 'Beginner Debate Workshop', location: 'Lomé Campus' },
        { date: 'Nov 10, 2025', title: 'DGDA Internal Tournament', location: 'City Center Auditorium' },
        { date: 'Dec 05, 2025', title: 'End of Year Showcase', location: 'National Theatre of Togo' },
        { date: 'Jan 15, 2026', title: 'New Member Orientation', location: 'Lomé Campus' }
    ];

    const eventList = document.getElementById('event-list');

    function populateUpcomingEvents() {
        if (!eventList) return; // Exit if the element is not found

        // Clear any existing content
        eventList.innerHTML = '';

        const now = new Date();
        const filteredEvents = upcomingEvents.filter(event => new Date(event.date) > now).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (filteredEvents.length === 0) {
            const noEventItem = document.createElement('li');
            noEventItem.innerHTML = '<p>No upcoming events at this time.</p>';
            eventList.appendChild(noEventItem);
            return;
        }

        // Generate list items for each event
        filteredEvents.forEach(event => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="event-details">
                    <span class="event-date">${event.date}</span>
                    <span class="event-title">${event.title}</span>
                </div>
                <div class="event-location">${event.location}</div>
            `;
            eventList.appendChild(listItem);
        });

        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission

                let isValid = true;
                const fullName = document.getElementById('fullName');
                const email = document.getElementById('email');
                const location = document.getElementById('location');
                const terms = document.getElementById('terms');
                const formMessage = document.getElementById('form-message');

                // Reset error messages
                document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
                formMessage.style.display = 'none';

                // Full Name validation
                if (fullName.value.trim() === '') {
                    document.getElementById('fullName-error').textContent = 'Full Name is required.';
                    document.getElementById('fullName-error').style.display = 'block';
                    isValid = false;
                }

                // Email validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email.value.trim() === '') {
                    document.getElementById('email-error').textContent = 'Email Address is required.';
                    document.getElementById('email-error').style.display = 'block';
                    isValid = false;
                } else if (!emailPattern.test(email.value)) {
                    document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                    document.getElementById('email-error').style.display = 'block';
                    isValid = false;
                }

                // Location validation
                if (location.value.trim() === '') {
                    document.getElementById('location-error').textContent = 'Location is required.';
                    document.getElementById('location-error').style.display = 'block';
                    isValid = false;
                }

                // Terms and Conditions validation
                if (!terms.checked) {
                    document.getElementById('terms-error').textContent = 'You must agree to the terms and conditions.';
                    document.getElementById('terms-error').style.display = 'block';
                    isValid = false;
                }

                if (isValid) {
                    // Here you would typically send the form data to a server
                    // For this example, we just show a success message
                    formMessage.textContent = 'Registration successful! We will be in touch shortly.';
                    formMessage.style.display = 'block';
                    registrationForm.reset(); // Clear the form
                }
            });
        }
    }

    // Call the function to populate the events when the page loads
    populateUpcomingEvents();
});