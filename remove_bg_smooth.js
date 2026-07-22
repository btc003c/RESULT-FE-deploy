const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/brand-logo.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        var r = this.data[idx];
        var g = this.data[idx + 1];
        var b = this.data[idx + 2];
        
        // Un-premultiply algorithm assuming the image was blended over a white background (255, 255, 255)
        // Since the logo colors (teal and yellow) are darker than white, the minimum color channel value 
        // accurately represents how much white was blended in.
        let min_val = Math.min(r, g, b);
        let alpha = 255 - min_val; 
        
        if (alpha < 5) {
            // Pure white or very close
            this.data[idx + 3] = 0; 
        } else {
            let a = alpha / 255;
            
            // Reverse the blending formula: Result = Color * a + White * (1 - a)
            let orig_r = Math.min(255, Math.max(0, (r - 255 * (1 - a)) / a));
            let orig_g = Math.min(255, Math.max(0, (g - 255 * (1 - a)) / a));
            let orig_b = Math.min(255, Math.max(0, (b - 255 * (1 - a)) / a));
            
            this.data[idx] = Math.round(orig_r);
            this.data[idx + 1] = Math.round(orig_g);
            this.data[idx + 2] = Math.round(orig_b);
            this.data[idx + 3] = alpha;
        }
      }
    }
    this.pack().pipe(fs.createWriteStream('public/brand-logo-transparent.png'))
      .on('finish', () => console.log('Smooth bg removal done!'));
  });
