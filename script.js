const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

if (siteHeader) {
  let scrolling = false;
  window.addEventListener('scroll', () => {
    const next = window.scrollY > 12;
    if (next !== scrolling) {
      scrolling = next;
      siteHeader.classList.toggle('is-scrolling', scrolling);
    }
  }, { passive: true });
}

const modeTabs = document.querySelectorAll('[data-mode]');
const modePanels = document.querySelectorAll('[data-mode-panel]');
modeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    modeTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    modePanels.forEach((panel) => {
      panel.hidden = panel.dataset.modePanel !== mode;
    });
  });
});

const featureChoices = document.querySelectorAll('[data-feature-title]');
const featureTitle = document.querySelector('[data-feature-title-display]');
const featureCopy = document.querySelector('[data-feature-copy-display]');
const featureLabel = document.querySelector('[data-feature-label-display]');
featureChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    featureChoices.forEach((item) => {
      const active = item === choice;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (featureTitle) featureTitle.textContent = choice.dataset.featureTitle;
    if (featureCopy) featureCopy.textContent = choice.dataset.featureCopy;
    if (featureLabel) featureLabel.textContent = choice.dataset.featureLabel;
  });
});

const campaignSlides = [
  { image: 'assets/1.jpeg', alt: 'StylersIn massage and self-care campaign', category: 'Wellbeing', title: 'A pause, made for you.', description: 'Find services that help you feel cared for, from massage to a fresh new style.' },
  { image: 'assets/2.jpeg', alt: 'StylersIn wigs and braids style campaign', category: 'Find your look', title: 'More ways to wear your style.', description: 'Explore protective styles, wigs, braids and talented stylers in your area.' },
  { image: 'assets/3.jpeg', alt: 'StylersIn app download artwork with a phone preview', category: 'The app experience', title: 'Your next appointment starts here.', description: 'Browse services, see what is nearby and book from the comfort of your phone.' },
  { image: 'assets/4.jpeg', alt: 'Barber serving a client in his shop', category: 'For independent stylers', title: 'More focus on your craft.', description: 'Connect with clients and make the day-to-day of running your styling business easier.' },
  { image: 'assets/5.jpeg', alt: 'StylersIn team celebrating together', category: 'The StylersIn community', title: 'Good people. Good energy.', description: 'Meet the community helping make great styling easier to find and book.' },
  { image: 'assets/6.jpeg', alt: 'StylersIn stylist sign-up campaign with a stylist serving a client', category: 'Grow your business', title: 'Your next client is looking.', description: 'Join StylersIn, showcase your services and make it easier for new clients to find you.' },
];

const campaignCarousel = document.querySelector('.campaign-carousel');
if (campaignCarousel) {
  const campaignImage = campaignCarousel.querySelector('.campaign-image');
  const campaignPosition = campaignCarousel.querySelector('[data-campaign-position]');
  const campaignCategory = campaignCarousel.querySelector('[data-campaign-category]');
  const campaignTitle = campaignCarousel.querySelector('[data-campaign-title]');
  const campaignDescription = campaignCarousel.querySelector('[data-campaign-description]');
  const campaignIndicators = [...campaignCarousel.querySelectorAll('[data-campaign-go]')];
  const campaignToggle = campaignCarousel.querySelector('[data-campaign-toggle]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeCampaign = 0;
  let timer = null;
  let pausedByUser = reducedMotion.matches;
  let pausedByPointer = false;
  let pausedByFocus = false;

  campaignSlides.slice(1).forEach((slide) => {
    const preload = new Image();
    preload.src = slide.image;
  });

  const scheduleCampaign = () => {
    window.clearInterval(timer);
    if (!pausedByUser && !pausedByPointer && !pausedByFocus) {
      timer = window.setInterval(() => showCampaign(activeCampaign + 1, false), 6000);
    }
  };

  const updateCampaignToggle = () => {
    campaignToggle.classList.toggle('is-paused', pausedByUser);
    campaignToggle.setAttribute('aria-pressed', String(pausedByUser));
    campaignToggle.setAttribute('aria-label', pausedByUser ? 'Play slideshow' : 'Pause slideshow');
  };

  const showCampaign = (index, resetTimer = true) => {
    activeCampaign = (index + campaignSlides.length) % campaignSlides.length;
    const slide = campaignSlides[activeCampaign];
    campaignImage.src = slide.image;
    campaignImage.alt = slide.alt;
    campaignPosition.textContent = `Image ${activeCampaign + 1} of ${campaignSlides.length}`;
    campaignCategory.textContent = slide.category;
    campaignTitle.textContent = slide.title;
    campaignDescription.textContent = slide.description;
    campaignIndicators.forEach((indicator, indicatorIndex) => {
      const active = indicatorIndex === activeCampaign;
      indicator.classList.toggle('is-active', active);
      indicator.setAttribute('aria-pressed', String(active));
    });
    if (resetTimer) scheduleCampaign();
  };

  campaignCarousel.querySelector('[data-campaign-prev]').addEventListener('click', () => showCampaign(activeCampaign - 1));
  campaignCarousel.querySelector('[data-campaign-next]').addEventListener('click', () => showCampaign(activeCampaign + 1));
  campaignIndicators.forEach((indicator) => {
    indicator.addEventListener('click', () => showCampaign(Number(indicator.dataset.campaignGo)));
  });

  campaignToggle.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    if (!pausedByUser) pausedByFocus = false;
    updateCampaignToggle();
    scheduleCampaign();
  });

  campaignCarousel.addEventListener('pointerenter', () => {
    pausedByPointer = true;
    scheduleCampaign();
  });
  campaignCarousel.addEventListener('pointerleave', () => {
    pausedByPointer = false;
    scheduleCampaign();
  });
  campaignCarousel.addEventListener('focusin', () => {
    pausedByFocus = true;
    scheduleCampaign();
  });
  campaignCarousel.addEventListener('focusout', (event) => {
    if (!campaignCarousel.contains(event.relatedTarget)) {
      pausedByFocus = false;
      scheduleCampaign();
    }
  });

  campaignCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showCampaign(activeCampaign - 1);
    if (event.key === 'ArrowRight') showCampaign(activeCampaign + 1);
  });

  reducedMotion.addEventListener('change', (event) => {
    pausedByUser = event.matches;
    updateCampaignToggle();
    scheduleCampaign();
  });

  updateCampaignToggle();
  scheduleCampaign();
}
