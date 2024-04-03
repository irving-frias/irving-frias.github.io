</main>
<footer class="mt-auto">
  <div class="container">
    <div class="row">
      <div class="col-md-7">
        <h5>{{ translate('Section', 'es') }}</h5>
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
          <h5>{{ translate('Contact me', 'es') }}</h5>
          <div class="d-flex flex-column flex-sm-row w-100 gap-2">
            <label for="email" class="visually-hidden">{{ translate('Email address', 'es') }}</label>
            <input type="email" name="email" class="form-control" placeholder="{{ translate('Email address', 'es') }}" required>
            <button class="btn btn-primary" type="submit">{{ translate('Subscribe', 'es') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-12">
      <div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
        <p>{{ translate('© 2024 Irving Frias, Inc. All rights reserved.', 'es') }}</p>
        <ul class="list-unstyled d-flex">
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#twitter"></use></svg></a></li>
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</footer>