document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ratingScreen = document.getElementById('ratingScreen');
    const lowRatingForm = document.getElementById('lowRatingForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const followupMessage = document.getElementById('followupMessage');
    const stars = document.querySelectorAll('.rating-stars i');
    const continueBtn = document.getElementById('continue-btn');
    const feedbackForm = document.getElementById('detailedFeedbackForm');

    let selectedRating = 0;

    // Star Rating Logic
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        star.addEventListener('mouseout', function() {
            if (selectedRating === 0) {
                resetStars();
            } else {
                highlightStars(selectedRating);
            }
        });

        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            continueBtn.disabled = false;
            highlightStars(selectedRating);
        });
    });

    // Continue Button Logic
    continueBtn.addEventListener('click', function() {
        if (selectedRating <= 3) {
            // Show detailed feedback form
            ratingScreen.classList.add('hidden');
            lowRatingForm.classList.remove('hidden');
        } else {
            // Redirect to Google Reviews for 4-5 stars
            redirectToGoogleReviews();
        }
    });

    // Feedback Form Submission
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            feedback: document.getElementById('feedback').value,
            rating: selectedRating
        };

        // Send to server
        fetch('/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showThankYouMessage("We appreciate your feedback. Our team will review your comments.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showThankYouMessage("Thank you for your feedback!");
        });
    });

    // Helper Functions
    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.remove('active', 'hover');
            if (parseInt(star.getAttribute('data-rating')) <= rating) {
                star.classList.add('hover');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('hover');
        });
    }

    function redirectToGoogleReviews() {
        // In production, replace with your actual Google Review URL
        const googleReviewUrl = "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID";
        
        // Show temporary message before redirect
        ratingScreen.classList.add('hidden');
        followupMessage.textContent = "Redirecting you to Google Reviews...";
        thankYouMessage.classList.remove('hidden');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = googleReviewUrl;
        }, 2000);
    }

    function showThankYouMessage(message) {
        lowRatingForm.classList.add('hidden');
        followupMessage.textContent = message;
        thankYouMessage.classList.remove('hidden');
    }
});

// Add at the bottom of your existing code
document.getElementById('back-to-rating').addEventListener('click', function() {
    lowRatingForm.classList.add('hidden');
    ratingScreen.classList.remove('hidden');
    resetForm();
});

document.getElementById('new-review').addEventListener('click', function() {
    thankYouMessage.classList.add('hidden');
    ratingScreen.classList.remove('hidden');
    resetForm();
});

function resetForm() {
    // Reset stars
    selectedRating = 0;
    resetStars();
    continueBtn.disabled = true;
    
    // Reset form fields if needed
    if (feedbackForm) {
        feedbackForm.reset();
    }
}