var gulp              = require('gulp');
var concat            = require('gulp-concat');
var minifycss         = require('gulp-minify-css')
var removeSourcemaps  = require('gulp-remove-sourcemaps');
var rename            = require("gulp-rename");
var sass              = require('gulp-sass')(require('sass'));
var uglify            = require('gulp-uglify');
var w3cValidation     = require('gulp-w3c-html-validation');
var twig              = require('gulp-twig');
var htmlbeautify      = require('gulp-html-beautify');
var deploy            = require('gulp-gh-pages');
var shell             = require('gulp-shell');
var i18nExtract       = require('gulp-i18n-extract');
const fs              = require('fs');
const path            = require('path');
const puppeteer       = require('puppeteer');
const data            = require('gulp-data');
const cheerio         = require('gulp-cheerio');
const paginationator  = require('gulp-paginationator');
const json            = require('gulp-json');
const htmlmin         = require('gulp-htmlmin');

//registerFont('assets/fonts/tacobox.ttf', { family: 'tacobox' });

process.setMaxListeners(15);

// Function to extract page title from HTML content without using a library
function extractPageTitle(htmlContent) {
  // Find the index of the opening <title> tag
  const titleStartIndex = htmlContent.indexOf('<title>');
  if (titleStartIndex === -1) {
      return ''; // If <title> tag not found, return an empty string
  }

  // Find the index of the closing </title> tag
  const titleEndIndex = htmlContent.indexOf('</title>', titleStartIndex);
  if (titleEndIndex === -1) {
      return ''; // If </title> tag not found, return an empty string
  }

  // Extract the title text between the <title> and </title> tags
  const title = htmlContent.substring(titleStartIndex + 7, titleEndIndex); // Add 7 to skip over '<title>'
  return title.trim(); // Trim any leading or trailing whitespace
}

// Function to generate OG image
async function generateOGImage(text, folder, file) {
  // Launch headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Set viewport size
  await page.setViewport({ width: 1200, height: 630 });

  // Navigate to a blank HTML page
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OG Image</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center; /* Center vertically */
                justify-content: center; /* Center horizontally */
                width: 100%;
                height: 100%;
                background-color: #007bff; /* Example background color */
                color: #ffffff; /* Example text color */
                font-family: Arial, sans-serif; /* Example font family */
                font-size: 48px; /* Example font size */
                text-align: center;
                line-height: 1.5;
                height: 100vh;
            }
        </style>
    </head>
    <body>
      ${text}
    </body>
    </html>
  `);

  // Capture screenshot and save as PNG
  await page.screenshot({ path: `${folder}/${file}`, type: 'png' });

  // Close browser
  await browser.close();
}

function getAllSubfolders(dirPath) {
  // Get all items (files and folders) in the directory
  const items = fs.readdirSync(dirPath);

  // Initialize an array to store subfolders
  const subfolders = [];

  // Iterate through each item
  items.forEach(item => {
      // Get the full path of the item
      const itemPath = path.join(dirPath, item);

      // Check if the item is a directory
      if (fs.statSync(itemPath).isDirectory()) {
          // If it's a directory, add it to the subfolders array
          subfolders.push(itemPath);

          // Recursively get subfolders of this directory
          subfolders.push(...getAllSubfolders(itemPath));
      }
  });

  // Return the array of subfolders
  return subfolders;
}

// Global options.
var htmlbeautify_options = {
  indent_size: 2,
  indent_char: ' ',
  end_with_newline: true
};

var js_scripts_contrib = [
  './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
];

var js_scripts_custom = [
  './js-src/theme-mode.js',
  './js-src/language-toggle.js',
  './js-src/posts.js'
];

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(removeSourcemaps())
    .pipe(rename('irving-frias.css'))
    .pipe(gulp.dest('./css/'));
});

gulp.task('css_min', function () {
  return gulp.src('./css/irving-frias.css')
    .pipe(minifycss())
    .pipe(rename('irving-frias.min.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('validate-html', function () {
  return gulp.src('./templates/components/*.inc')
    .pipe(w3cValidation({
      generateReport: 'false',
      relaxerror: [
        "The character encoding was not declared. Proceeding using “windows-1252”.",
        "Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.",
        "End tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”",
        "End of file seen without seeing a doctype first. Expected “<!DOCTYPE html>”.",
        "Element “head” is missing a required instance of child element “title”.",
        'Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.',
        'This document appears to be written in '
      ]
    }));
});

gulp.task('watch', function () {
  gulp.watch([
      './scss/*.scss',
      './scss/**/*.scss',
      './templates/*',
      './templates/**/*',
      './js/*.js'
    ], gulp.series(['build-dev']));
});


function translate(text, lang) {
  // Define your translations here
  const data = fs.readFileSync('translations.json', 'utf8');
  const translations = JSON.parse(data);

  // Check if translation exists for the given language
  if (translations[text] && translations[text][lang]) {
      return translations[text][lang];
  } else {
      // Return original text if translation not found
      return text;
  }
}

function reverse_url(text, lang) {
  const data = fs.readFileSync('reverse_urls.json', 'utf8');
  const translations = JSON.parse(data);

  // Check if translation exists for the given language
  if (translations[text] && translations[text][lang]) {
    return translations[text][lang];
  } else {
      // Return original text if translation not found
      return text;
  }
}

// Task to compile Twig files with translation
gulp.task('twig', function () {
  return gulp.src(['./templates/pages/en/*.html'])
      .pipe(twig({
          functions: [
              {
                  name: 'translate', // Name of the translation function
                  func: function(text) {
                      return translate(text, 'en'); // Translate to English by default
                  }
              },
              {
                name: 'reverse_url', // Name of the translation function
                func: function(text) {
                    return reverse_url(text, 'en'); // Translate to English
                }
            }
          ]
      }))
      .pipe(htmlbeautify(htmlbeautify_options))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./dist/'))
      .on('end', function() {
        // After processing, read the files in the destination directory and extract page titles
        fs.readdirSync('./dist/').forEach(file => {
          if (file.endsWith('.html')) {
            const content = fs.readFileSync(path.join('./dist/', file), 'utf8');
            const pageTitle = extractPageTitle(content);

            // Check if the file exists
            fs.access(`./assets/pages/en/${file.replace('.html', '.png')}`, fs.constants.F_OK, (err) => {
              if (err) {
                generateOGImage(pageTitle, './assets/pages/en/', file.replace('.html', '.png'));
              }
            });
          }
        })
      });
});

// Task to compile Twig files with Spanish translation
gulp.task('twig-es', function () {
  return gulp.src(['./templates/pages/es/*.html'])
      .pipe(twig({
          functions: [
              {
                  name: 'translate', // Name of the translation function
                  func: function(text) {
                      return translate(text, 'es'); // Translate to Spanish
                  }
              },
              {
                  name: 'reverse_url', // Name of the translation function
                  func: function(text) {
                      return reverse_url(text, 'es'); // Translate to English
                  }
              }
          ]
      }))
      .pipe(htmlbeautify(htmlbeautify_options))
      .pipe(gulp.dest('./dist/es/'))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .on('end', function() {
        // After processing, read the files in the destination directory and extract page titles
        fs.readdirSync('./dist/es/').forEach(file => {
          if (file.endsWith('.html')) {
            const content = fs.readFileSync(path.join('./dist/es/', file), 'utf8');
            const pageTitle = extractPageTitle(content);
            fs.access(`./assets/pages/es/${file.replace('.html', '.png')}`, fs.constants.F_OK, (err) => {
              if (err) {
                generateOGImage(pageTitle, './assets/pages/es/', file.replace('.html', '.png'));
              }
            });
          }
        })
      });
});

// Task to compile Twig files for posts
gulp.task('twig-posts', function () {
  return gulp.src('./templates/posts/en/**/**/*.html')
    .pipe(twig({
      functions: [
        {
          name: 'translate', // Name of the translation function
          func: function (text) {
            return translate(text, 'en'); // Translate to English by default
          }
        },
        {
          name: 'reverse_url', // Name of the translation function
          func: function (text) {
            return reverse_url(text, 'en'); // Translate to English
          }
        }
      ]
    }))
    .pipe(htmlbeautify(htmlbeautify_options))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(function(file) {
      // Get the relative path of the source file
      const relativePath = path.relative('./templates/posts/en/', file.path);
      // Split the relative path and select only the first two elements (year and month)
      const [year, month] = relativePath.split(path.sep).slice(0, 2);
      const fileName = path.basename(file.path);
      // Construct the destination path
      const destPath = path.join('./dist/posts/');
      return destPath;
    }))
    .on('end', function() {
      const targetDirectory = './dist/posts';
      const allSubfolders = getAllSubfolders(targetDirectory);
      // Get last value from array
      const lastValue = allSubfolders[allSubfolders.length - 1];
      const convertedPath = lastValue.replace('dist', 'assets').replace('posts', 'posts/en');

      // After processing, read the files in the destination directory and extract page titles
      fs.readdirSync(lastValue).forEach(file => {
        if (file.endsWith('.html')) {
          const content = fs.readFileSync(path.join(lastValue, file), 'utf8');
          const pageTitle = extractPageTitle(content);
          fs.access(`${convertedPath}/${file.replace('.html', '.png')}`, fs.constants.F_OK, (err) => {
            if (err) {
              generateOGImage(pageTitle, convertedPath, file.replace('.html', '.png'));
            }
          });
        }
      })
    });
});

// Task to compile Twig files with translation to Spanish
gulp.task('twig-posts-es', function () {
  return gulp.src('./templates/posts/es/**/**/*.html')
    .pipe(twig({
      functions: [
        {
          name: 'translate', // Name of the translation function
          func: function (text) {
            return translate(text, 'es'); // Translate to English by default
          }
        },
        {
          name: 'reverse_url', // Name of the translation function
          func: function (text) {
            return reverse_url(text, 'es'); // Translate to English
          }
        }
      ]
    }))
    .pipe(htmlbeautify(htmlbeautify_options))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(function(file) {
      // Get the relative path of the source file
      const relativePath = path.relative('./templates/posts/es/', file.path);
      // Split the relative path and select only the first two elements (year and month)
      const [year, month] = relativePath.split(path.sep).slice(0, 2);
      const fileName = path.basename(file.path);
      // Construct the destination path
      const destPath = path.join('./dist/es/posts/');
      return destPath;
    }))
    .on('end', function() {
      const targetDirectory = './dist/es/posts';
      const allSubfolders = getAllSubfolders(targetDirectory);
      // Get last value from array
      const lastValue = allSubfolders[allSubfolders.length - 1];
      const convertedPath = lastValue.replace('dist', 'assets').replace('assets/es/posts/', 'assets/posts/es/');

      // After processing, read the files in the destination directory and extract page titles
      fs.readdirSync(lastValue).forEach(file => {
        if (file.endsWith('.html')) {
          const content = fs.readFileSync(path.join(lastValue, file), 'utf8');
          const pageTitle = extractPageTitle(content);
          fs.access(`${convertedPath}/${file.replace('.html', '.png')}`, fs.constants.F_OK, (err) => {
            if (err) {
              generateOGImage(pageTitle, convertedPath, file.replace('.html', '.png'));
            }
          });
        }
      })
    });
});

gulp.task('pagination', function() {
  let files = [];

  return gulp.src('dist/posts/**/**/*.html')
    .pipe(cheerio(function ($, file) {
      // Use the cheerio instance to parse HTML data
      // For example, to get the title of the post:
      let title = $('h1').text();
      let url = $('html').attr('data-slug');
      let description = $('html').attr('data-description') || '';
      let date = $('html').attr('data-date') || '';
      let image = $('html').attr('data-image') || '';

      // Add the parsed data to the file object
      file.data = {
          title: title,
          url: url,
          description: description,
          date: date,
          image: image
      };

      files.push(file);

      return file.data;
    }))
    .on('end', function(e) {
      // After all files have been processed
      if (files) {
        let stories = files.map(file => file.data);
        let pages = Math.ceil(stories.length / 9);

        if (!fs.existsSync('dist/paginated_json/en/')) {
          fs.mkdirSync('dist/paginated_json/en/', { recursive: true });
        }

        for (let i = 0; i < pages; i++) {
          let pageStories = stories.slice(i * 9, (i + 1) * 9);
          let object = {
            data: pageStories,
            pages: pages
          }
          fs.writeFileSync(`dist/paginated_json/en/page-${i + 1}.json`, JSON.stringify(object, null, 2));
        }
      } else {
        console.log('No files processed');
      }
    });
});

gulp.task('pagination-es', function() {
  let files_es = [];

  return gulp.src('dist/es/posts/**/**/*.html')
    .pipe(cheerio(function ($, file) {
      // Use the cheerio instance to parse HTML data
      // For example, to get the title of the post:
      let title = $('h1').text();
      let url = $('html').attr('data-slug');
      let description = $('html').attr('data-description') || '';
      let date = $('html').attr('data-date') || '';
      let image = $('html').attr('data-image') || '';

      // Add the parsed data to the file object
      file.data = {
          title: title,
          url: url,
          description: description,
          date: date,
          image: image
      };

      files_es.push(file);

      return file.data;
    }))
    .on('end', function(e) {
      // After all files have been processed
      if (files_es) {
        let stories = files_es.map(file => file.data);
        let pages = Math.ceil(stories.length / 9);

        if (!fs.existsSync('dist/paginated_json/es/')) {
          fs.mkdirSync('dist/paginated_json/es/', { recursive: true });
        }

        for (let i = 0; i < pages; i++) {
          let pageStories = stories.slice(i * 9, (i + 1) * 9);
          let object = {
            data: pageStories,
            pages: pages
          }
          fs.writeFileSync(`dist/paginated_json/es/page-${i + 1}.json`, JSON.stringify(object, null, 2));
        }
      } else {
        console.log('No files processed');
      }
    });
});

gulp.task('js', function () {
  return gulp.src([...js_scripts_contrib, ...js_scripts_custom])
    .pipe(concat('irving-frias.js'))
    .pipe(removeSourcemaps())
    .pipe(gulp.dest('./js/'));
});
gulp.task('js_min', function () {
  return gulp.src([...js_scripts_contrib, ...js_scripts_custom])
    .pipe(concat('irving-frias.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));
});

// Define a Gulp task to run the shell script
gulp.task('run_shell_script', shell.task([
  'sh generate.sh'
]));

gulp.task('copy-assets', function() {
  return gulp.src('assets/**/*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/assets')); // Copy to the destination folder
});

gulp.task('copy-css', function() {
  return gulp.src('css/**/*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/css')); // Copy to the destination folder
});

gulp.task('copy-js', function() {
  return gulp.src('js/**/*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/js')); // Copy to the destination folder
});

gulp.task('copy-htaccess', function() {
  return gulp.src('.htaccess') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});

gulp.task('copy-favicon', function() {
  return gulp.src('favicon*.*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});

gulp.task('copy-android-favicon', function() {
  return gulp.src('android-*.*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});

gulp.task('copy-apple-favicon', function() {
  return gulp.src('apple-*.*') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});

gulp.task('copy-site-manifest', function() {
  return gulp.src('site.webmanifest') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});

gulp.task('copy-about-file', function() {
  return gulp.src('about.txt') // Select all files and subdirectories in the source folder
    .pipe(gulp.dest('dist/')); // Copy to the destination folder
});


gulp.task('build', gulp.series([
  'sass',
  'css_min',
  'js',
  'js_min',
  'twig',
  'twig-es',
  'twig-posts',
  'twig-posts-es',
  'copy-assets',
  'copy-css',
  'copy-js',
  'copy-htaccess',
  'copy-favicon',
  'copy-android-favicon',
  'copy-apple-favicon',
  'copy-site-manifest',
  'copy-about-file',
  'run_shell_script',
  'pagination',
  'pagination-es',
]));

/**
 * Push build to gh-pages
 */
gulp.task('deploy_gh', function () {
  return gulp.src("dist/")
    .pipe(deploy({
      remoteUrl: "git@github.com:irving-frias/irving-frias.github.io.git",
      branch: "main"
    }))
});

gulp.task('deploy', gulp.series([
  'build',
  'deploy_gh'
]));

gulp.task('watch', function () {
  gulp.watch([
      './scss/*.scss',
      './scss/**/*.scss',
      './templates/*',
      './templates/**/*',
      './js-src/*.js'
    ], gulp.series(['build']));
});

gulp.task('default', gulp.series(['watch']));