## Build
```
npm i
gulp
```
## Project directory tree
```
src/
├── img/
│	├── background/
|	└── sprite/
├── pug/
│	├── include/
|	|	├── section/
|	|	├── footer.pug
|	|	└── header.pug
│	├── mixin/
│	└── main.pug
├── sass/
|	├── extend/
|	|	└── _allSplite.sass
|	├── font/
|	|	└── _font.sass
│	├── import/
|	|	└── section/
|	|	├── _body.sass
|	|	├── _footer.sass
|	|	└── _header.sass
│	├── mixin/
|	|	└── _sprite.sass
│	├── reset/
|	|	└── _reset.sass
│	├── varible/
│	|	├── _main.sass
|	|	└── _sprite.sass
│	└── main.scss
└── ts/
	└── main.ts
```

## Possible errors
[one error](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc)

Solution
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

```
[two error](https://github.com/sindresorhus/gulp-autoprefixer/issues/83)

Solution: update nodejs and remove folder node_modules and again make ```npm install```

## About
[source psd](https://freebiesbug.com/psd-freebies/tajam-psd-website-template-for-agencies/)

[analogue site](http://bootstrapthemes.co/demo/html/tajem-free-html5-creative-agency-portfolio-template/)
