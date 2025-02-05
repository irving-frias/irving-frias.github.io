const mix = require('laravel-mix');
const glob = require('glob');
const htmlMinifier = require('html-minifier-terser');
const fs = require('fs');
const fs_extra = require('fs-extra');
const twig = require('twig');
const matter = require('gray-matter');
const chokidar = require('chokidar');

let compileTimeout;

// 🚀 **Compilar JavaScript**
function compileJS() {
    mix.scripts(['src/js/main.js'], 'dist/js/app.js');
    console.log('✔ JS compilado');
}

// 🚀 **Compilar SCSS**
function compileSCSS() {
    mix.sass('src/scss/main.scss', 'dist/css').options({
        postCss: [require('autoprefixer'), require('cssnano')({ preset: 'default' })],
    });
    console.log('✔ SCSS compilado');
}

// 🧹 **Limpiar la carpeta `dist/` antes de compilar**
function cleanDist() {
    if (fs.existsSync('dist')) {
        fs_extra.emptyDirSync('dist');
        console.log('🧹 Limpieza completa en /dist/');
    }
}

// 📝 **Compilar archivos Twig**
function compileTwig() {
    const files = glob.sync('pages/*.twig');

    files.forEach((file) => {
        const fileContent = fs_extra.readFileSync(file, 'utf8');
        const parsed = matter(fileContent);
        const data = parsed.data;

        twig.renderFile(file, data, (err, html) => {
            if (err) {
                console.error(`❌ Error compilando ${file}:`, err);
                return;
            }
            const outputPath = file.replace('pages/', 'dist/').replace('.twig', '.html');
            fs_extra.ensureDirSync('dist');
            fs_extra.writeFileSync(outputPath, html, 'utf8');
            console.log(`✔ Renderizado: ${outputPath}`);
        });
    });
}

// ⚡ **Minificar archivos HTML**
async function minifyHtml() {
    const files = glob.sync('dist/*.html');

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');

        const minified = await htmlMinifier.minify(content, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
        });

        fs.writeFileSync(file, minified, 'utf8');
    }

    console.log('✔ Minificación de HTML completada');
}

// 📂 **Copiar la carpeta de assets si existe**
function copyAssets() {
    if (fs.existsSync('assets')) {
        mix.copyDirectory('assets', 'dist/assets');
        console.log('✔ Archivos de assets copiados');
    }
}

// 👀 **Watcher para detectar cambios y recompilar automáticamente**
function watchFiles() {
    chokidar.watch(['templates/**/*.twig', 'pages/*.twig', 'src/js/**/*.js', 'src/scss/**/*.scss'])
        .on('all', (event, path) => {
            console.log(`🔄 ${event.toUpperCase()}: ${path}`);

            clearTimeout(compileTimeout);
            compileTimeout = setTimeout(async () => {
                console.log('🔄 Cambios detectados, recompilando...');
                cleanDist();
                compileJS();
                compileSCSS();
                compileTwig();
                await minifyHtml();
                copyAssets();
            }, 300); // Debounce de 300ms
        });
}

// 🏁 **Ejecución inicial**
(async () => {
    cleanDist();
    compileJS();
    compileSCSS();
    compileTwig();
    await minifyHtml();
    copyAssets();
})();
