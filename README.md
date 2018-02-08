## Algorithm


## Build
```
npm i
gulp
```
## Project directory tree
```
src/
├── pug/
│	└── main.pug
├── sass/
│	├── reset/
|	|	└── _reset.sass
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
