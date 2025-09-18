// Get elements
const closeButton = document.getElementById('closeBtn');
const popup = document.getElementById('popup');
const form = document.getElementById('editProfileForm');
const popupMessage = document.getElementById('popupMessage');

// Close popup and redirect on close button click
closeButton.addEventListener('click', () => {
    popup.style.display = 'none';  // Hide the popup
    window.location.href = 'home.html';  // Redirect to the home or dashboard page
});

// Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent page reload on form submission

    // Display success message
    popupMessage.style.display = 'block';
    
    // Hide success message after 3 seconds
    setTimeout(() => {
        popupMessage.style.display = 'none';
        popup.style.display = 'none';  // Hide popup after success
        window.location.href = 'home.html';  // Redirect to home/dashboard
    }, 3000);
});
