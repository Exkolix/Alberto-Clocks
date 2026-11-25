ALBERTO WATCH COMPANY - build notes (dev)
Run: open the folder in VS Code and use Live Server on index.html (or double-click index.html).
After editing views/*.html or data/watches.json run:  node tools/bundle.js   (keeps double-click mode working)
Placeholder art:  node tools/make-placeholders.js   (replace assets/img/* with real photos)
Hero video: put hero.mp4 in assets/video/ (10-15 s, under 5 MB).

Files by owner
  Obash   : css/tokens.css base.css shell.css home.css, all js/, index.html, views/home.html
  Teammate A: products, price list, popup content (views/products.html, views/price-list.html + their own css)
  Teammate B: gallery, about, store-locator, support, technology, sitemap views

NOTE for views/*.html: keep the last line (an HTML comment containing </body>). VS Code Live Server pastes its reload script
before the first </body>; without that line it pastes inside every <svg> and cuts the page short. node tools/bundle.js adds it if missing.
