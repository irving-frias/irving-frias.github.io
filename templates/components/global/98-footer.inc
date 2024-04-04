</main>
<footer class="mt-auto py-5">
  <div class="container social-section">
    <div class="row">
      <div class="col-md-7">
        <h2>{{ translate('Section', 'es') }}</h2>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <a href="{{ translate('/', 'es') }}" data-translate-url="{{ reverse_url('/') }}" class="nav-link p-0 text-body-secondary">{{ translate('Home', 'es') }}</a>
          </li>
            <li class="nav-item mb-2">
              <a href="{{ translate('/features', 'es') }}" data-translate-url="{{ reverse_url('/features') }}" class="nav-link p-0 text-body-secondary">{{ translate('Features', 'es') }}</a>
          </li>
            <li class="nav-item mb-2">
              <a href="{{ translate('/pricing', 'es') }}" data-translate-url="{{ reverse_url('/pricing') }}" class="nav-link p-0 text-body-secondary">{{ translate('Pricing', 'es') }}</a>
          </li>
            <li class="nav-item mb-2">
              <a href="{{ translate('/faqs', 'es') }}" data-translate-url="{{ reverse_url('/faqs') }}" class="nav-link p-0 text-body-secondary">{{ translate('FAQs', 'es') }}</a>
          </li>
            <li class="nav-item mb-2">
              <a href="{{ translate('/about', 'es') }}" data-translate-url="{{ reverse_url('/about') }}" class="nav-link p-0 text-body-secondary">{{ translate('About', 'es') }}</a>
          </li>
        </ul>
      </div>

      <div class="col-md-5">
        <form action="https://formsubmit.co/e8a243cd088ba52169929712e99b5e00" method="POST">
          <h2>{{ translate('Contact me', 'es') }}</h2>
          <div class="d-flex flex-column flex-sm-row w-100 gap-2">
            <label for="email" class="visually-hidden">{{ translate('Email address', 'es') }}</label>
            <input type="email" name="email" class="form-control" placeholder="{{ translate('Email address', 'es') }}" required>
            <button class="btn btn-primary" type="submit">{{ translate('Subscribe', 'es') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="container copyright-section">
    <div class="row">
      <div class="col-12">
      <div class="d-flex flex-column flex-sm-row justify-content-center py-4 my-4 border-top text-center">
        <p>{{ translate('© 2024 Irving Frias, Inc. All rights reserved.', 'es') }}</p>
        <ul class="list-unstyled d-flex">
          <li class="ms-3">
            <a class="link-body-emphasis" href="https://twitter.com/irvingfrias41">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 24 24">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </a>
          </li>
          <li class="ms-3">
            <a class="link-body-emphasis" href="https://www.instagram.com/gio_frias330/">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-instagram" viewBox="0 0 24 24">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
            </a>
          </li>
          <li class="ms-3">
            <a class="link-body-emphasis" href="https://www.facebook.com/gio.frias.73">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-facebook" viewBox="0 0 24 24">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</footer>