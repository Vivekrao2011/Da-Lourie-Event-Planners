/* ==========================================================================
   DA LOURIE EVENT PLANNERS - INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Sticky Header & Back-To-Top Button
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Sticky header
    if (scrollPos > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     2. Mobile Drawer Navigation
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerCtaBtn = document.getElementById('drawerCtaBtn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ------------------------------------------------------------------------
     3. Animated Stat Counters
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  }

  const statsSection = document.querySelector('.hero-stats-strip');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(num => countUp(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback
    statNumbers.forEach(num => countUp(num));
  }

  /* ------------------------------------------------------------------------
     4. Interactive Event Budget / Investment Estimator
     ------------------------------------------------------------------------ */
  const guestRange = document.getElementById('guestRange');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const typeOptions = document.querySelectorAll('.type-option');
  const tierCards = document.querySelectorAll('.tier-card');
  const addonPills = document.querySelectorAll('.addon-pill');
  const priceRangeOutput = document.getElementById('priceRangeOutput');
  const applyEstimateBtn = document.getElementById('applyEstimateToContact');

  // Base pricing configurations
  const typeMultipliers = {
    wedding: 1.25,
    corporate: 1.15,
    private: 0.95,
    destination: 1.55
  };

  const tierBaseCosts = {
    full: 18000,
    partial: 12000,
    coordination: 7500
  };

  const addonValues = {
    floral: 8000,
    lighting: 4500,
    concierge: 3500,
    sommelier: 4000
  };

  function updateEstimator() {
    if (!guestRange || !priceRangeOutput) return;

    // 1. Selected Event Type
    let selectedType = 'wedding';
    const checkedType = document.querySelector('input[name="eventType"]:checked');
    if (checkedType) selectedType = checkedType.value;

    // Highlight active option
    typeOptions.forEach(opt => {
      const radio = opt.querySelector('input');
      if (radio && radio.checked) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 2. Guests
    const guests = parseInt(guestRange.value, 10);
    guestCountDisplay.textContent = `${guests} Guests`;

    // 3. Service Tier
    let selectedTier = 'full';
    const checkedTier = document.querySelector('input[name="serviceTier"]:checked');
    if (checkedTier) selectedTier = checkedTier.value;

    tierCards.forEach(card => {
      const radio = card.querySelector('input');
      if (radio && radio.checked) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 4. Addons
    let addonsTotal = 0;
    addonPills.forEach(pill => {
      const check = pill.querySelector('input');
      if (check && check.checked) {
        pill.classList.add('active');
        addonsTotal += addonValues[check.value] || 0;
      } else {
        pill.classList.remove('active');
      }
    });

    // Cost Calculation Logic
    const baseManagement = tierBaseCosts[selectedTier] || 15000;
    const perGuestCost = selectedTier === 'full' ? 120 : (selectedTier === 'partial' ? 75 : 45);
    const guestSubtotal = guests * perGuestCost;

    const multiplier = typeMultipliers[selectedType] || 1.0;
    const calculatedBase = (baseManagement + guestSubtotal + addonsTotal) * multiplier;

    const lowerBound = Math.round((calculatedBase * 0.9) / 500) * 500;
    const upperBound = Math.round((calculatedBase * 1.15) / 500) * 500;

    // Format with commas
    const formattedLow = `$${lowerBound.toLocaleString()}`;
    const formattedHigh = `$${upperBound.toLocaleString()}`;

    priceRangeOutput.textContent = `${formattedLow} – ${formattedHigh}`;
  }

  // Event listeners for Estimator
  if (guestRange) guestRange.addEventListener('input', updateEstimator);

  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const radio = opt.querySelector('input');
      if (radio) {
        radio.checked = true;
        updateEstimator();
      }
    });
  });

  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input');
      if (radio) {
        radio.checked = true;
        updateEstimator();
      }
    });
  });

  addonPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const check = pill.querySelector('input');
      if (check && e.target !== check) {
        check.checked = !check.checked;
        updateEstimator();
      } else if (check) {
        updateEstimator();
      }
    });
  });

  // Transfer Estimate parameters to contact form
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', () => {
      const checkedType = document.querySelector('input[name="eventType"]:checked');
      const formEventType = document.getElementById('formEventType');
      const eventVision = document.getElementById('eventVision');
      const guests = guestRange.value;
      const priceText = priceRangeOutput.textContent;

      if (formEventType && checkedType) {
        if (checkedType.value === 'wedding') formEventType.value = 'Luxury Wedding';
        else if (checkedType.value === 'corporate') formEventType.value = 'Corporate Gala';
        else if (checkedType.value === 'private') formEventType.value = 'Private Soirée';
        else if (checkedType.value === 'destination') formEventType.value = 'Destination Celebration';
      }

      if (eventVision) {
        eventVision.value = `Estimated for approx ${guests} guests with target investment around ${priceText}. We'd love to discuss date availability and full design details.`;
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast('Configuration Saved', 'Your estimated details have been transferred to the inquiry form below.');
    });
  }

  // Initial calculation run
  updateEstimator();

  /* ------------------------------------------------------------------------
     5. Portfolio Filter Tabs
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. Lightbox Modal Functionality
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxButtons = document.querySelectorAll('.view-lightbox-btn');

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Celebration Portfolio Photo';
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const caption = btn.getAttribute('data-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  /* ------------------------------------------------------------------------
     7. Testimonials Carousel / Slider
     ------------------------------------------------------------------------ */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  const slides = document.querySelectorAll('.testimonial-card');
  let currentSlide = 0;

  if (slides.length > 0 && dotsContainer) {
    // Generate dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlide() {
      if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlide();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Optional subtle auto-rotation
    let slideTimer = setInterval(nextSlide, 7000);
    const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => clearInterval(slideTimer));
      sliderWrapper.addEventListener('mouseleave', () => {
        slideTimer = setInterval(nextSlide, 7000);
      });
    }
  }

  /* ------------------------------------------------------------------------
     8. FAQ Accordion
     ------------------------------------------------------------------------ */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    const body = header.nextElementSibling;
    const item = header.parentElement;

    // Expand initially opened items
    if (header.getAttribute('aria-expanded') === 'true' && body) {
      item.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 'px';
    }

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Optional: Close other accordions
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.parentElement.classList.remove('active');
          const otherBody = otherHeader.nextElementSibling;
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        header.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------------
     9. Consultation Modal Dialog
     ------------------------------------------------------------------------ */
  const openConsultBtn = document.getElementById('openConsultationBtn');
  const consultModal = document.getElementById('consultModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const serviceModalButtons = document.querySelectorAll('.open-modal-service');
  const quickConsultForm = document.getElementById('quickConsultForm');

  function openConsultModal(defaultCategory = null) {
    if (!consultModal) return;
    consultModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (defaultCategory) {
      const select = document.getElementById('mType');
      if (select) {
        if (defaultCategory.toLowerCase().includes('wedding')) select.value = 'Wedding';
        else if (defaultCategory.toLowerCase().includes('gala')) select.value = 'Corporate';
        else if (defaultCategory.toLowerCase().includes('soir')) select.value = 'Private Soirée';
      }
    }
  }

  function closeConsultModal() {
    if (!consultModal) return;
    consultModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openConsultBtn) openConsultBtn.addEventListener('click', () => openConsultModal());
  if (drawerCtaBtn) {
    drawerCtaBtn.addEventListener('click', () => {
      closeMobileMenu();
      openConsultModal();
    });
  }

  serviceModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceTitle = btn.getAttribute('data-title');
      openConsultModal(serviceTitle);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConsultModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeConsultModal);

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeConsultModal();
      closeMobileMenu();
    }
  });

  // Quick Consult Form Submission
  if (quickConsultForm) {
    quickConsultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value.trim();
      const email = document.getElementById('mEmail').value.trim();
      const phone = document.getElementById('mPhone').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill in your name, email, and contact phone.');
        return;
      }

      closeConsultModal();
      quickConsultForm.reset();
      showToast('Consultation Requested', `Thank you, ${name}. Our client director will reach out within 24 hours.`);
    });
  }

  /* ------------------------------------------------------------------------
     10. Main Contact Form Validation & Submission
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');

      let isValid = true;

      // Validate Name
      if (!fullName.value.trim()) {
        fullName.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        fullName.parentElement.classList.remove('has-error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        email.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        email.parentElement.classList.remove('has-error');
      }

      // Validate Phone
      if (!phone.value.trim() || phone.value.trim().length < 7) {
        phone.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        phone.parentElement.classList.remove('has-error');
      }

      if (isValid) {
        const clientName = fullName.value.trim();
        showToast('Inquiry Received with Distinction', `Thank you, ${clientName}. We have logged your celebration dossier and our senior director will be in touch.`);
        contactForm.reset();
      }
    });

    // Real-time error clearance
    ['fullName', 'email', 'phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.parentElement.classList.remove('has-error');
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     11. Toast Notifications
     ------------------------------------------------------------------------ */
  const toastNotice = document.getElementById('toastNotice');
  const toastClose = document.getElementById('toastClose');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(title, msg) {
    if (!toastNotice) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = msg;

    toastNotice.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 5500);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      if (toastNotice) toastNotice.classList.remove('show');
    });
  }

  // Refresh Lucide icons if dynamically modified
  if (window.lucide) {
    lucide.createIcons();
  }
});
