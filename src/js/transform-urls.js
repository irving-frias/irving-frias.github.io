if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
      transformUrls();
  });
} else {
  transformUrls();
}

function transformUrls() {
  let url_alternates = document.querySelectorAll('[data-alternate]');
  let currentUrl = window.location.pathname; // Get current page URL
  let langToggle = document.querySelector('.lang-toggle a');

  url_alternates.forEach(function(element) {
    if (currentUrl !== element.getAttribute('href')) {
      return;
    }

    langToggle.setAttribute('href', element.getAttribute('data-alternate'));
  });
}