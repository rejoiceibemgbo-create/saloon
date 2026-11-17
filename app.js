/**
 * VELOUR BEAUTY STUDIO — Core JavaScript
 * Handles:
 * - Before & After Comparison Slider (touch & mouse)
 * - Gallery Hover Interactions & Lightbox Modal
 * - Service Category Filtering
 * - Booking Form Interactivity & Live Price/Details Summary
 * - Auto-populating Booking from Services, Stylists, and Packages
 * - Mobile Navigation Drawer
 * - Toast Notification System
 * - Appointment Confirmation Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Navigation & Header Scroll State
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-cta a');
  const backToTop = document.getElementById('backToTop');

  // Sticky header blur & back-to-top visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const navOverlay = document.getElementById('navOverlay');
  const navCloseBtn = document.getElementById('navCloseBtn');

  const openDrawer = () => {
    navMenu.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', closeDrawer);
    }

    if (navOverlay) {
      navOverlay.addEventListener('click', closeDrawer);
    }

    // Close menu when clicking a navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Service Category Tabs Filter
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.service-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Quick service links in footer
  document.querySelectorAll('.quick-service-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.getAttribute('data-cat');
      const targetTab = document.querySelector(`.tab-btn[data-category="${cat}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Interactive Before & After Slider
  // --------------------------------------------------------------------------
  const sliderContainer = document.getElementById('baSlider');
  const resizeWrap = document.getElementById('baResizeWrap');
  const handle = document.getElementById('baHandle');

  if (sliderContainer && resizeWrap && handle) {
    let isDragging = false;

    // Ensure before image inside resizeWrap maintains container width
    const beforeImage = resizeWrap.querySelector('.ba-image-before');
    const updateBeforeImageWidth = () => {
      const containerWidth = sliderContainer.offsetWidth;
      if (beforeImage) {
        beforeImage.style.width = `${containerWidth}px`;
      }
    };

    updateBeforeImageWidth();
    window.addEventListener('resize', updateBeforeImageWidth);

    const updateSliderPosition = (xPos) => {
      const rect = sliderContainer.getBoundingClientRect();
      let offsetX = xPos - rect.left;

      // Clamp between 4% and 96%
      const minX = rect.width * 0.04;
      const maxX = rect.width * 0.96;
      if (offsetX < minX) offsetX = minX;
      if (offsetX > maxX) offsetX = maxX;

      const percentage = (offsetX / rect.width) * 100;
      resizeWrap.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse Events
    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events for Mobile / Tablet
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches && e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --------------------------------------------------------------------------
  // 4. Gallery Lightbox Modal
  // --------------------------------------------------------------------------
  const galleryModal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const zoomButtons = document.querySelectorAll('.gallery-zoom-btn');

  zoomButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const highRes = btn.getAttribute('data-img');
      if (highRes && modalImg && galleryModal) {
        modalImg.src = highRes;
        galleryModal.classList.add('active');
        galleryModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  const closeModal = () => {
    if (galleryModal) {
      galleryModal.classList.remove('active');
      galleryModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeModal();
    });
  }

  // Touch toggle for gallery transformation cards on mobile/tablet
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-zoom-btn') || e.target.closest('.quick-book')) return;
      if (window.innerWidth <= 868) {
        const wasActive = card.classList.contains('touch-active');
        galleryCards.forEach(c => c.classList.remove('touch-active'));
        if (!wasActive) card.classList.add('touch-active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Booking Form: Service Dropdown & Live Summary Interactivity
  // --------------------------------------------------------------------------
  const serviceSelect = document.getElementById('serviceSelect');
  const stylistSelect = document.getElementById('stylistSelect');
  const appointmentDate = document.getElementById('appointmentDate');
  const selectedTimeSlotInput = document.getElementById('selectedTimeSlot');
  const timeSlotButtons = document.querySelectorAll('.time-slot-btn');
  const appointmentForm = document.getElementById('appointmentForm');

  // Summary card display nodes
  const sumService = document.getElementById('sumService');
  const sumStylist = document.getElementById('sumStylist');
  const sumDateTime = document.getElementById('sumDateTime');
  const sumTotal = document.getElementById('sumTotal');
  const summaryStatus = document.getElementById('summaryStatus');

  // Prevent past dates in date picker
  if (appointmentDate) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
    // Pre-populate with tomorrow's date for delightful UX
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDate.value = tomorrow.toISOString().split('T')[0];
  }

  // Calculate & Update Live Summary Widget
  const updateBookingSummary = () => {
    // 1. Service & Price
    if (serviceSelect) {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      if (selectedOption && selectedOption.value) {
        sumService.textContent = selectedOption.text;
        const price = selectedOption.getAttribute('data-price') || '0';
        sumTotal.textContent = `$${parseFloat(price).toFixed(2)}`;
      }
    }

    // 2. Stylist
    if (stylistSelect) {
      const stylistOpt = stylistSelect.options[stylistSelect.selectedIndex];
      sumStylist.textContent = stylistOpt ? stylistOpt.text.split('(')[0].trim() : 'Any Available Specialist';
    }

    // 3. Date & Time Slot
    if (appointmentDate && selectedTimeSlotInput) {
      const dateVal = appointmentDate.value;
      const timeVal = selectedTimeSlotInput.value || '11:00 AM';

      if (dateVal) {
        const dateObj = new Date(dateVal + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        sumDateTime.textContent = `${formattedDate} @ ${timeVal}`;
        summaryStatus.textContent = 'Ready to Reserve';
        summaryStatus.style.background = '#E8F8F0';
        summaryStatus.style.color = '#27AE60';
      } else {
        sumDateTime.textContent = `Select date & slot below`;
      }
    }
  };

  // Event Listeners for Live Updates
  if (serviceSelect) serviceSelect.addEventListener('change', updateBookingSummary);
  if (stylistSelect) stylistSelect.addEventListener('change', updateBookingSummary);
  if (appointmentDate) appointmentDate.addEventListener('change', updateBookingSummary);

  // Time slot selection pills
  timeSlotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const timeVal = btn.getAttribute('data-time');
      if (selectedTimeSlotInput) {
        selectedTimeSlotInput.value = timeVal;
      }
      updateBookingSummary();
    });
  });

  // Run initial summary calculation on load
  updateBookingSummary();

  // --------------------------------------------------------------------------
  // 6. Quick Action Buttons: Auto-populate and Scroll to Booking
  // --------------------------------------------------------------------------
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Service Card "Book Service" buttons
  document.querySelectorAll('.select-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
        updateBookingSummary();
      }
      scrollToBooking();
      showToast(`Selected: ${serviceName.split('(')[0].trim()}`);
    });
  });

  // Lookbook Quick Book links
  document.querySelectorAll('.quick-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
        updateBookingSummary();
      }
      scrollToBooking();
      showToast(`Selected style from transformation lookbook!`);
    });
  });

  // Stylist Card "Book with [Name]" buttons
  document.querySelectorAll('.select-stylist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const stylistName = btn.getAttribute('data-stylist');
      if (stylistSelect && stylistName) {
        for (let i = 0; i < stylistSelect.options.length; i++) {
          if (stylistSelect.options[i].value === stylistName) {
            stylistSelect.selectedIndex = i;
            break;
          }
        }
        updateBookingSummary();
      }
      scrollToBooking();
      showToast(`Stylist selected: ${stylistName.split('(')[0].trim()}`);
    });
  });

  // Generic Book Triggers
  document.querySelectorAll('.book-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToBooking();
    });
  });

  // --------------------------------------------------------------------------
  // 7. Booking Form Validation & Submission Handling
  // --------------------------------------------------------------------------
  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const emailInput = document.getElementById('clientEmail');
  const submitBookingBtn = document.getElementById('submitBookingBtn');

  // Confirmation Receipt Modal Elements
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const receiptRef = document.getElementById('receiptRef');
  const receiptName = document.getElementById('receiptName');
  const receiptService = document.getElementById('receiptService');
  const receiptStylist = document.getElementById('receiptStylist');
  const receiptDateTime = document.getElementById('receiptDateTime');
  const receiptTotal = document.getElementById('receiptTotal');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate Phone
      const phoneGroup = phoneInput.closest('.form-group');
      const phoneRegex = /^[\d\s\(\)\-\+\.]{7,20}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneGroup.classList.add('has-error');
        isValid = false;
      } else {
        phoneGroup.classList.remove('has-error');
      }

      // Validate Email
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // Validate Date
      const dateGroup = appointmentDate.closest('.form-group');
      if (!appointmentDate.value) {
        dateGroup.classList.add('has-error');
        isValid = false;
      } else {
        dateGroup.classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields.', 'warning');
        return;
      }

      // Button Loading Feedback
      const originalText = submitBookingBtn.innerHTML;
      submitBookingBtn.disabled = true;
      submitBookingBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Securing Reservation...`;

      setTimeout(() => {
        // Generate Unique Reference ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refCode = `VLR-${randomNum}`;

        // Populate Receipt Modal
        if (receiptRef) receiptRef.textContent = refCode;
        if (receiptName) receiptName.textContent = nameInput.value.trim();
        if (receiptService) receiptService.textContent = serviceSelect.options[serviceSelect.selectedIndex].text;
        if (receiptStylist) receiptStylist.textContent = stylistSelect.options[stylistSelect.selectedIndex].text.split('(')[0].trim();
        if (receiptDateTime) receiptDateTime.textContent = sumDateTime.textContent;
        if (receiptTotal) receiptTotal.textContent = sumTotal.textContent;

        // Reset submit button
        submitBookingBtn.disabled = false;
        submitBookingBtn.innerHTML = originalText;

        // Show Modal
        if (bookingSuccessModal) {
          bookingSuccessModal.classList.add('active');
          bookingSuccessModal.setAttribute('aria-hidden', 'false');
        }

        showToast(`Reservation ${refCode} successfully created!`);
      }, 700);
    });
  }

  if (closeReceiptBtn && bookingSuccessModal) {
    closeReceiptBtn.addEventListener('click', () => {
      bookingSuccessModal.classList.remove('active');
      bookingSuccessModal.setAttribute('aria-hidden', 'true');
      if (appointmentForm) appointmentForm.reset();
      updateBookingSummary();
    });

    bookingSuccessModal.addEventListener('click', (e) => {
      if (e.target === bookingSuccessModal) {
        bookingSuccessModal.classList.remove('active');
        bookingSuccessModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. Copy Address Action
  // --------------------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = '482 Mulberry Boulevard, SoHo Arts District, Suite 400, New York, NY';
      navigator.clipboard.writeText(addressText).then(() => {
        showToast('Address copied to clipboard!');
      }).catch(() => {
        showToast('Address: 482 Mulberry Blvd, SoHo');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Newsletter Subscription Handler
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newsletterEmail.value) {
        showToast(`Welcome! Use promo code "VELOUR10" for 10% off your first visit.`);
        newsletterForm.reset();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconClass = 'fa-solid fa-sparkles';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Keyboard shortcut: close modals with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (galleryModal && galleryModal.classList.contains('active')) closeModal();
      if (bookingSuccessModal && bookingSuccessModal.classList.contains('active')) {
        bookingSuccessModal.classList.remove('active');
        bookingSuccessModal.setAttribute('aria-hidden', 'true');
      }
    }
  });
});
