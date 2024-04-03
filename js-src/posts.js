document.addEventListener('DOMContentLoaded', function () {
  let posts = document.querySelector('#posts');

  if (!posts) {
    return;
  }

  let post_blocks = posts.querySelector('.posts');
  let pagination = posts.querySelector('.pagination');
  const currentLang = document.querySelector('html').getAttribute('lang');
  let read_more = currentLang == 'en' ? 'Read more' : 'Leer más';
  let title_anchor = currentLang == 'en' ? 'Go to' : 'Ir a';
  const queryPage = parseInt(window.location.search.split('page=')[1], 10) || 1;

  let postsFetched = false;
  let url = `/paginated_json/${currentLang}/page-${queryPage}.json`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let posts_data = '';
      if (data.data.length > 0) {
        let counter = 0;
        let classes = 'col-md-6 col-lg-4';
        data.data.forEach(function (post) {
          if (counter == 0) {
            classes = 'col-md-6 col-xl-6';
          }

          if (counter == 1) {
            classes = 'col-md-6 col-xl-3';
          }

          if (counter == 2) {
            classes = 'col-md-6 col-xl-3';
          }

          if (counter == 3) {
            classes = 'col-md-6 col-xl-3';
          }

          if (counter == 4) {
            classes = 'col-md-6 col-xl-3';
          }

          if (counter == 5) {
            classes = 'col-md-6 col-xl-6';
          }

          let item = `
            <div class="post ${classes}">
              <div class="post-item h-100">
                <div class="content">
                  <h2>${post.title}</h2>

                  <p>${post.description}</p>

                  <div class="read-more">
                    <a href="${post.url}" title="${title_anchor} ${data[i].title}" class="btn btn-light">${read_more}</a>
                  </div>
                </div>
              </div>
            </div>
          `;

          counter++;

          if (counter == 6) {
            counter = 0;
          }
          posts_data += item;
        });
      }

      post_blocks.innerHTML = posts_data;

      if (data.pages > 1) {
        renderPagination(data.pages, pagination, currentLang, queryPage);
      }

      postsFetched = true;
    })
    .catch(function (err) {
      console.log('error: ' + err);
    })
});

function renderPagination(pages, pagination, lang, currentPage) {
  let url = lang == 'en' ? '/posts' : '/es/posts';
  let pagination_text = '';
  let prevPage = currentPage - 1;
  let nextPage = currentPage + 1;

  let prev_link = currentPage == 1
    ? `
    <li class="page-item disabled">
      <a class="page-link" rel="nofollow">Previous</a>
    </li>
    `
    : `
    <li class="page-item">
      <a class="page-link" href="${url}?page=${prevPage}">Previous</a>
    </li>
  `;

  pagination_text += prev_link;

  let next_link = currentPage == pages
    ? `
    <li class="page-item disabled">
      <a class="page-link" rel="nofollow">Next</a>
    </li>
    `
    : `
    <li class="page-item">
      <a class="page-link" href="${url}?page=${nextPage}">Next</a>
    </li>
  `;

  let page_links = '';

  for (let i = 1; i <= pages; i++) {
    if (i == currentPage) {
      page_links += `
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="${url}?page=${i}">${i}</a>
        </li>
      `;
    } else {
      page_links += `
        <li class="page-item">
          <a class="page-link" href="${url}?page=${i}">${i}</a>
        </li>
      `;
    }
  }

  pagination_text += page_links;
  pagination_text += next_link;

  pagination.innerHTML = pagination_text;

}