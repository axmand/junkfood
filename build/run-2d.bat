cd  %~dp0

node r.js -o build-2d.js

echo node r.js -o build-2d.js out=../../app/vendor/hmap.js

node r.js -o cssIn=../src/resource/css/main.css out=../build-min/css/build-min.css optimizeCss=standard

node r.js -o cssIn=../src/resource/css/main.css out=../../app/resource/css/hmap.css optimizeCss=standard

pause