const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/logo.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        var r = this.data[idx];
        var g = this.data[idx + 1];
        var b = this.data[idx + 2];
        // Remove white or near-white background
        if (r > 240 && g > 240 && b > 240) {
          this.data[idx + 3] = 0;
        }
      }
    }
    this.pack().pipe(fs.createWriteStream('public/logo_transparent.png'))
      .on('finish', () => console.log('Done!'));
  });
