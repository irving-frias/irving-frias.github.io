
<!DOCTYPE html>
<html lang="{{ translate('en', 'es') }}" class="h-100" data-bs-theme="dark" data-slug="{{ slug }}" data-slug-en="{{ slug_en }}" data-slug-es="{{ slug_es }}" data-description="{{ page_description }}" data-date="{{ date }}" data-image="{{ og_image }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Irving Frias | {{ page_title }}</title>
    <link rel="stylesheet" href="/css/irving-frias.min.css" media="all" />
    <meta name="description" content="{{ page_description }}">
    <meta property="og:image" itemprop="image primaryImageOfPage" content="{{ og_image }}">
    <meta property="og:title" content="{{ page_title }}">
    <meta property="og:description" content="{{ page_description }}">
    <meta property="og:site_name" content="Irving Frias">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{{ page_title }}">
    <meta name="twitter:description" content="{{ page_description }}">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
  </head>
  <body class="d-flex flex-column h-100">
    {% include './02-header.inc' with context %}
    <main role="main" class="flex-shrink-0 z-1">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1>{{ page_title }}</h1>
          </div>
        </div>
      </div>