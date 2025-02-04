const mix = require('laravel-mix');
const glob = require('glob');
const htmlMinifier = require('html-minifier-terser');
const fs = require('fs');
const fs_extra = require('fs-extra');
const twig = require('twig');
const matter = require('gray-matter');

// Define JavaScript files in order
const jsFiles = [
  'src/js/main.js'
];

// Merge JavaScript files in order
mix.scripts(jsFiles, 'dist/js/app.js');

// Function to render Twig files
function compileTwig() {
  const files = glob.sync('pages/*.twig');

  files.forEach(file => {
      const fileContent = fs_extra.readFileSync(file, 'utf8');
      const parsed = matter(fileContent); // Extract YAML front matter
      const templateData = parsed.content; // The Twig content
      const data = parsed.data; // Variables from front matter

      twig.renderFile(file, data, (err, html) => {
          if (err) {
              console.error(`❌ Error rendering ${file}:`, err);
              return;
          }
          const outputPath = file.replace('pages/', 'dist/').replace('.twig', '.html');
          fs_extra.ensureDirSync('dist'); // Ensure output folder exists
          fs_extra.writeFileSync(outputPath, html, 'utf8');
          console.log(`✔ Rendered ${outputPath}`);
      });
  });
}

// Procesar SCSS con minificación
mix.sass('src/scss/main.scss', 'dist/css')
   .options({
       postCss: [require('autoprefixer'), require('cssnano')({ preset: 'default' })],
   });

// Función para minificar HTML
async function minifyHtml() {
    const files = glob.sync('*.html');

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');

        let minified = await htmlMinifier.minify(content, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
        });

        fs.writeFileSync(`dist/${file}`, minified, 'utf8');
    }
}

// Render Twig templates
compileTwig();

// Ejecutar la minificación antes de que termine la compilación
minifyHtml().then(() => {
    console.log('✔ HTML minificado correctamente');
}).catch(err => {
    console.error('Error al minificar HTML:', err);
});

// Copiar la carpeta `assets/`
mix.copyDirectory('assets', 'dist/assets');

// Habilitar cache busting solo en producción
if (mix.inProduction()) {
    mix.version();
}
