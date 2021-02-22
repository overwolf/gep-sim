var gulp = require('gulp');
var bump = require('gulp-bump');
var replace = require('gulp-replace');
var fs = require('fs');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var gulpsync = require('gulp-sync')(gulp);

gulp.task('bump', function () {
	var bumpType = 'minor';
	console.log(process.argv)
	for (var i = 0; i < process.argv.length; i++) {
		if (process.argv[i].substring(0, '-bump:'.length) == '-bump:') {
			console.log(process.argv[i])
			bumpType = process.argv[i].substring('-bump:'.length);
			console.log(bumpType)
		}
	}
	return gulp.src('./package.json')
		.pipe(bump({ type: bumpType }))
		.pipe(gulp.dest('./'));

});

//------------------------------------------------------------------------------
gulp.task('setManifestVersion', function () {
	var getPackageJson = function () {
		return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	};

	var newVer = getPackageJson().version;

	return gulp.src(['./build/manifest.json'])
		.pipe(replace('99.9999.999', newVer))
		.pipe(gulp.dest('build/'));
});

//------------------------------------------------------------------------------
gulp.task('clean', async function (done) {
	await gulp.src(['./dist/'], { allowEmpty: true })
		.pipe(clean({ force: true}));

	done();
});

//------------------------------------------------------------------------------
gulp.task('createOpk', function () {
	var newVer = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
	return gulp.src('build/**')
		.pipe(zip('game-events-simulator-' + newVer + '.opk'))
		.pipe(gulp.dest('dist'));
});

//------------------------------------------------------------------------------
gulp.task('buildReactApp', shell.task('react-scripts build'));

//------------------------------------------------------------------------------
gulp.task(
	'build', gulp.series([
		//'clean', 
		'buildReactApp', 
		'bump', 
		'setManifestVersion', 
		'
		'
]));