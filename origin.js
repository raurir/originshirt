var con = console;
var QLD = "QLD", NSW = "NSW";
var font = "200px impact";

function canvas(width, height, append) {
  var a = document.createElement("canvas");
  // if (append) 
    document.body.appendChild(a);
  a.width = width;
  a.height = height;
  var c = a.getContext('2d');
  var circleRads = Math.PI * 2;
  c.fillCircle = function(x, y, r, colour) {
    c.beginPath();
    c.fillStyle = colour;
    c.arc(x, y, r, 0, circleRads, false);
    c.closePath();
    c.fill();
  }
  return {
    canvas: a,
    ctx: c
  }
}

var red = "#f00";

var bmpSize = 200;
var outputScale = 1;
var dim = bmpSize * outputScale;

function render(state, score, x, y) {
  var count = 0;
  var output = canvas(dim, dim, true);
  var test = canvas(dim, dim);
  var progress = canvas(dim, dim);

  function pointInShape(point) {

    test.ctx.globalCompositeOperation = 'source-over';
    test.ctx.drawImage(progress.canvas, 0, 0);
    test.ctx.globalCompositeOperation = 'source-in';
    drawShape(test.ctx, point, false);

    var pad = 2;

    var width = Math.ceil(point.size + pad) * 2;
    var height = Math.ceil(point.size + pad);
    var xs = Math.floor(point.x - width);
    var ys = Math.floor(point.y - height * 2);
    width = width * 2;
    height = height * 2;

    var pixels = test.ctx.getImageData(xs, ys, width, height).data;
    var ok = true;
    for (var x = 0; x < width && ok; x++) {
      for (var y = 0; y < height && ok; y++) {
        var pixel = (y * width + x) * 4;
        ok = pixels[pixel] === 0;
        // con.log(pixels[pixel])
      }
    }

    test.ctx.globalCompositeOperation = 'source-over';
    test.ctx.fillStyle = ok ? "rgba(0, 0, 255, 0.25)" : "rgba(255, 0, 0, 0.25)";
    test.ctx.fillRect(xs, ys, width, height);

    return ok;
  }


  function newPosition() {
    var pad = 0;
    return {
      x: pad + Math.random() * (dim - pad * 2),
      y: pad + Math.random() * (dim - pad * 2),
      size: 0.1 + Math.random() * 6// / ((count + 1) * 0.01)
    }
  }

  function drawShape(target, props, fx) {
    if (fx) {
      target.shadowColor = '#fff';
      target.shadowBlur = 2;
    }
    var scale = 2 * props.size / bmpSize;
    target.save();
    target.translate(props.x - props.size, props.y - props.size);
    target.scale(scale, scale);
    // target.drawImage(piImage, 0, 0);
    target.font = font;
    target.fillStyle = red;
    target.fillText(state, 0, 0);
    target.restore();
  }

  function generate() {
    var proposed = newPosition();
    var ok = pointInShape(proposed);
    if (ok) {
      count++;
      drawShape(output.ctx, proposed, true,);
      drawShape(progress.ctx, proposed, true);
    }
  }

  function r() {
    var iterationsPerFrame = 30;
    for (var i = 0; i < iterationsPerFrame; i++) {
      generate(true);
      generate(false);
    }
    requestAnimationFrame(r);
    // setTimeout(r, 1000);
  }

  progress.ctx.clearRect(0, 0, dim, dim);
  progress.ctx.fillStyle = red;
  progress.ctx.fillRect(0, 0, dim, dim);
  progress.ctx.globalCompositeOperation = 'destination-out';
  progress.ctx.save();
  progress.ctx.translate(dim * x, dim * y);
  progress.ctx.scale(outputScale, outputScale);
  progress.ctx.font = font;
  progress.ctx.fillText(score, 0, 0);
  progress.ctx.restore();
  progress.ctx.globalCompositeOperation = 'source-over';

  r();

}

render(QLD, 52, -0.02, 0.9);
render(NSW, 6, 0.23, 0.9);

con.log("ok");