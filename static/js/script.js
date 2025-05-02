document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ratingScreen = document.getElementById('ratingScreen');
    const lowRatingForm = document.getElementById('lowRatingForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const followupMessage = document.getElementById('followupMessage');
    const stars = document.querySelectorAll('.rating-stars i');
    const continueBtn = document.getElementById('continue-btn');
    const feedbackForm = document.getElementById('detailedFeedbackForm');
    const submitBtn = document.getElementById('submit-feedback-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');

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
        const googleReviewUrl = "https://www.google.com/search?q=skincare+in+lagos&oq=skincare+in+lagos&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQIxgnMgYIAhAjGCcyDAgDEAAYFBiHAhiABDIHCAQQABiABDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDI3ODFqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8&lqi=ChFza2luY2FyZSBpbiBsYWdvc1oTIhFza2luY2FyZSBpbiBsYWdvc5IBGmJlYXV0eV9wcm9kdWN0c193aG9sZXNhbGVyqgFkCg0vZy8xMXZrejIyOTl0CgsvZy8xMjJfZ2YxehABKgwiCHNraW5jYXJlKAAyHxABIhsLgOjaU8l9EsuItb10k9u88G-zsb5hCh0ScvUyFRACIhFza2luY2FyZSBpbiBsYWdvcw#rlimm=4827505469685586878&lrd=0x103bf4ff0cc43d99:0x42febea5bfdd5bbe,3,,,,";
        
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

    
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Disable all form inputs
        const inputs = feedbackForm.querySelectorAll('input, textarea, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // Hide loading state
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            submitBtn.disabled = false;
            
            // Show thank you message
            document.getElementById('lowRatingForm').classList.add('hidden');
            document.getElementById('thankYouMessage').classList.remove('hidden');
            document.getElementById('followupMessage').textContent = "We appreciate your feedback and will use it to improve our service.";
            
            // Re-enable form inputs (in case user wants to submit another review)
            inputs.forEach(input => {
                input.disabled = false;
            });
            
            // Reset form
            feedbackForm.reset();
        }, 2000); // Simulate 2 second delay for submission
    });
    
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

