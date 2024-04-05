<section class="comments">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div id="disqus_thread"></div>
      </div>
    </div>
  </div>
</section>

<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    var disqus_config = function () {
    this.page.url = '{{ base_url }}{{ slug }}';  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = '{{ slug }}-{{ date }}-{{ type }}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://https-irving-frias-netlify-app.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();

    document.querySelector('#theme-mode').addEventListener('change', function (e) {
      DISQUS.reset({ reload: true, config: disqus_config });
    });
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>