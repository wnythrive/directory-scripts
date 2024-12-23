document.addEventListener('DOMContentLoaded', function () {
  // Combine fs-cmsfilter-complete and social-share logic
  document.addEventListener('fs-cmsfilter-complete', () => {
    const cmsContainer = document.querySelector('.thrive_directory-list');
    if (!cmsContainer) return;

    const cmsItems = [...cmsContainer.querySelectorAll('.thrive_listing')];
    const premiumListings = cmsItems.filter(item => item.querySelector('#Spotlight-Listing'));
    const regularListings = cmsItems.filter(item => !item.querySelector('#Spotlight-Listing'));

    cmsContainer.innerHTML = '';
    [...premiumListings, ...regularListings].forEach(item => cmsContainer.appendChild(item));
  });

  // Social sharing
  const items = [...document.querySelectorAll('.thrive_listing, .thrive_update')];
  const baseURL = 'https://wnybizboard.com';

  items.forEach(item => {
    const slug = item.getAttribute('data-slug');
    if (!slug) return;

    const itemURL = item.classList.contains('thrive_listing')
      ? `${baseURL}/listings/${slug}`
      : `${baseURL}/updates/${slug}`;

    [...item.querySelectorAll('.social-share_link')].forEach(link => {
      const platform = link.getAttribute('data-platform');
      const platforms = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemURL)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(itemURL)}&text=${encodeURIComponent('Check this out!')}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(itemURL)}`,
      };

      if (platform === 'instagram') {
        link.addEventListener('click', event => {
          event.preventDefault();
          navigator.clipboard.writeText(itemURL).then(() => alert('Link copied!')).catch(console.error);
        });
      } else {
        link.setAttribute('href', platforms[platform] || '');
        link.setAttribute('target', '_blank');
      }
    });
  });

  // Prevent Enter Key Default Action
  window.addEventListener('keydown', event => {
    if (event.key === 'Enter') event.preventDefault();
  });

  // Smooth Scrolling
  const scrollToTarget = (target, duration = 1000) => {
    const start = window.pageYOffset;
    const distance = target.offsetTop - start;
    const startTime = performance.now();

    const scroll = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start + distance * easedProgress);
      if (progress < 1) requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  };

  const submitButton = document.getElementById('submit_filter-button');
  const targetElement = document.getElementById('Thrive-Directory');
  if (submitButton && targetElement) {
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      scrollToTarget(targetElement);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.toString() && !window.location.hash.includes('Thrive-Directory') && targetElement) {
    scrollToTarget(targetElement);
  }

  // CMS Nest Loading
  [{ list: '.categories_list', item: '.categories_item' },
   { list: '.thrive_nest-list', item: '.thrive_nest-item' }].forEach(({ list, item }) => {
    const container = document.querySelector(list);
    if (container) {
      [...container.querySelectorAll(item)].slice(1).forEach(el => el.remove());
    }
  });
});
