document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const navButtons = Array.from(document.querySelectorAll('.value-nav-btn'));
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    let currentIndex = 0;
    let isAnimating = false;
    const totalSlides = slides.length;
    const animationDuration = 600; // ms
    
    // Initialize the carousel
    function initCarousel() {
        // Set initial active states
        updateActiveSlide(currentIndex);
        
        // Add event listeners
        navButtons.forEach(button => {
            button.addEventListener('click', handleNavButtonClick);
        });
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', goToPrevSlide);
            nextButton.addEventListener('click', goToNextSlide);
        }
        
        // Initialize slide positions
        updateSlidePositions();
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // Handle navigation button clicks
    function handleNavButtonClick(e) {
        const targetIndex = parseInt(e.currentTarget.getAttribute('data-target'));
        if (targetIndex !== currentIndex) {
            goToSlide(targetIndex);
        }
    }
    
    // Calculate the actual slide index considering the loop
    function getLoopAdjustedIndex(realIndex) {
        // Handle negative indices
        while (realIndex < 0) {
            realIndex += totalSlides;
        }
        // Handle indices beyond the total slides
        return realIndex % totalSlides;
    }

    // Update slide positions based on current index with loop support
    function updateSlidePositions() {
        slides.forEach((slide, index) => {
            const slideIndex = parseInt(slide.getAttribute('data-index'));
            const isActive = slide.classList.contains('active');
            
            // Apply transition for smooth animation
            slide.style.transition = `transform ${animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            
            // Calculate the relative position to the current slide
            let relativePosition = slideIndex - currentIndex;
            
            // Adjust for looping
            if (relativePosition > Math.floor(totalSlides / 2)) {
                relativePosition -= totalSlides;
            } else if (relativePosition < -Math.floor(totalSlides / 2)) {
                relativePosition += totalSlides;
            }
            
            if (relativePosition < 0) {
                // Slides to the left
                slide.style.transform = `translateX(${-70 * Math.abs(relativePosition)}%)`;
            } else if (relativePosition > 0) {
                // Slides to the right (with peek)
                // Only show 30% of the next slide
                const offset = relativePosition > 1 ? 30 + ((relativePosition - 1) * 30) : 30;
                slide.style.transform = `translateX(${offset}%)`;
            } else {
                // Current slide
                slide.style.transform = 'translateX(0)';
            }
            
            // Update z-index and opacity based on active state
            if (isActive) {
                slide.style.zIndex = '2';
                slide.style.opacity = '1';
            } else {
                slide.style.zIndex = '1';
                slide.style.opacity = '0.7';
            }
        });
    }
    
    // Update active slide and navigation states
    function updateActiveSlide(index) {
        // Update slide classes
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        navButtons.forEach((button, i) => {
            if (i === index) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update current index
        currentIndex = index;
    }
    
    // Navigate to a specific slide with loop support
    function goToSlide(index) {
        // Don't do anything if already animating or clicking the same slide
        if (isAnimating) return;
        
        // Handle wrap-around for negative indices and indices beyond the total slides
        index = ((index % totalSlides) + totalSlides) % totalSlides;
        
        // Don't do anything if clicking the same slide
        if (index === currentIndex) return;
        
        isAnimating = true;
        
        // Update current index first to ensure smooth transition
        currentIndex = index;
        
        // Update active states
        updateActiveSlide(index);
        
        // Update positions with animation
        updateSlidePositions();
        
        // Reset animation flag after the transition completes
        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);
    }
    
    // Navigate to previous slide
    function goToPrevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Navigate to next slide
    function goToNextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                goToPrevSlide();
                break;
            case 'ArrowRight':
                goToNextSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    }
    
    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - go to next slide
            goToNextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - go to previous slide
            goToPrevSlide();
        }
    }
    
    // Add touch event listeners if on a touch device
    if ('ontouchstart' in window) {
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('touchstart', handleTouchStart, false);
            carousel.addEventListener('touchend', handleTouchEnd, false);
        }
    }
    
    // Initialize the carousel
    initCarousel();
    
    // Optional: Auto-advance slides (uncomment to enable)
    // let autoSlideInterval = setInterval(goToNextSlide, 5000);
    // 
    // // Pause auto-slide on hover
    // const carouselContainer = document.querySelector('.carousel-container');
    // if (carouselContainer) {
    //     carouselContainer.addEventListener('mouseenter', () => {
    //         clearInterval(autoSlideInterval);
    //     });
    //     
    //     carouselContainer.addEventListener('mouseleave', () => {
    //         autoSlideInterval = setInterval(goToNextSlide, 5000);
    //     });
    // }
});
