
var gbks = gbks || {};
gbks.cornify = gbks.cornify || {};
gbks.cornify.Rainbow = function() {
  
  this.init = function(context) {
    this.mouseX = null;
    this.mouseY = null;
    this.painters = null;
    this.interval = null;
    
    this.BRUSH_SIZE = 1;
    this.BRUSH_PRESSURE = 1;
    
    this.context = context;
    this.context.globalCompositeOperation = 'source-over';

    this.mouseX = window.innerWidth;
    this.mouseY = 200;
    
    this.maxBrushSize = Math.round( Math.random()*10+5 );

    this.painters = new Array();
    var ease;
    for (var i = 0; i < 13; i++) {
      ease = 0.7 + i*0.01;
      this.painters.push({ dx: -50, dy: 225 - i*10+60, ax: 0, ay: 0, div: 0.01, ease: ease });
    }
    
     this.interval = setInterval($.proxy(this.update, this), 1000/60 );
  };
    
  this.update = function() {
    var i;
    
    this.context.lineWidth = this.BRUSH_SIZE*10;   
    this.context.lineCap = 'round';     
    //this.context.strokeStyle = "rgba(" + this.COLOR[0] + ", " + this.COLOR[1] + ", " + this.COLOR[2] + ", " + 0.15 * this.BRUSH_PRESSURE + ")";
    
    var colors = [
          [216, 48, 32],
          
            [234, 96, 16],
          
          [252, 144, 0],
          
            [253, 186, 0],  
          
          [255, 228, 0],
          
            [186, 213, 25],
          
          [116, 202, 51],
          
            [66, 193, 116],
          
          [23, 183, 182],
          
            [12, 127, 181],
          [0, 72, 179],
            [122, 36, 187],
          [245, 0, 196]
  
          ];
    
    var i = 0;
    var painterLength = this.painters.length;
    var painter;
    var context = this.context;
    for (; i < painterLength; i++)
    {
      this.context.strokeStyle = "rgba(" + colors[i][0] + ", " + colors[i][1] + ", " + colors[i][2] + ", " + 1 * this.BRUSH_PRESSURE + ")";
      
      painter = this.painters[i];
      
      this.context.beginPath();
      context.moveTo(painter.dx, painter.dy);   
      
      var before = [painter.dx, painter.dy];
  
      painter.dx -= painter.ax = (painter.ax + (painter.dx - this.mouseX) * painter.div) * painter.ease;
      painter.dy -= painter.ay = (painter.ay + (painter.dy - this.mouseY) * painter.div) * painter.ease;
      
      var deltaX = Math.abs(painter.dx - before[0]);
      var deltaY = Math.abs(painter.dy - before[1]);
      var length = Math.max(1, Math.sqrt(deltaX*deltaX + deltaY*deltaY));
      this.context.lineWidth = Math.min(10, Math.round(this.BRUSH_SIZE*10 * length/10));
      //this.context.lineWidth = 10;
      
      context.lineTo(painter.dx, painter.dy);
      context.stroke();
    }
  };
  
  this.destroy = function() {
    clearInterval(this.interval);
  };

  this.strokeStart = function( mouseX, mouseY ) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    
    var i;
    var length = this.painters.length;
    var painter;

    for (; i < length; i++)
    {
      painter = this.painters[i];
      
      painter.dx = mouseX;
      painter.dy = mouseY;
    }

    this.shouldDraw = true;
  };

  this.stroke = function( mouseX, mouseY ) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  };

  this.strokeEnd = function() {
  
  };
  
};

gbks.cornify.RainbowCanvas = function() {
  
  this.init = function(canvas) {
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.BRUSH_SIZE = 1;
    this.BRUSH_PRESSURE = 1;
    this.COLOR = [0, 0, 0];
    this.BACKGROUND_COLOR = [173, 222, 229];
    this.mouseX = 0;
    this.mouseY = 0;
    this.USER_AGENT = navigator.userAgent.toLowerCase();
    
    this.mouseMoveMethod = $.proxy(this.onCanvasMouseMove, this);
    this.resizeMethod = $.proxy(this.onWindowResize, this);
    
    var holder = $('#rainbowCanvas');
    if(holder.length == 0) return;
    
    holder.css({
      'background-repeat': 'no-repeat',
      'background-position': 'center center'
    });
    
    var container = $('<div></div>');
    holder.append(container);
  
    this.canvas = canvas;
    //canvas = document.createElement("canvas");
    canvas.attr({
      width: this.SCREEN_WIDTH,
      height: this.SCREEN_HEIGHT
    });
    container.append(canvas);
    
    var context = canvas[0].getContext("2d");
    
    this.brush = new gbks.cornify.Rainbow();
    this.brush.init(context);
    this.brush.BRUSH_SIZE = this.BRUSH_SIZE;
    this.brush.BRUSH_PRESSURE = this.BRUSH_PRESSURE;
    //this.brush = eval('new Ribbon(context)');
    
    $(window).bind('mousemove', this.mouseMoveMethod);
    $(window).bind('resize', this.resizeMethod);
    
    //window.addEventListener('mousemove', this.mouseMoveMethod, false);
    //window.addEventListener('resize', this.onWindowResize, false);
    
    this.onWindowResize(null);
    this.onCanvasMouseDown(null);
  };
  
  this.onWindowMouseMove = function( event ) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };

  this.onWindowResize = function( event ) {
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    
    //rainbowCanvas.canvas.width = this.SCREEN_WIDTH;
    this.canvas.attr({
      'height': this.SCREEN_HEIGHT
    });
  };
  
  this.onCanvasMouseDown = function( event ) {
    $(window).bind('onmousemove', this.mouseMoveMethod);
  };
  
  this.onCanvasMouseMove = function(event) {
    this.brush.stroke(event.clientX, event.clientY);
  };
  
};
