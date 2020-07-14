window.onload = function (e) {
  const canvas = document.getElementById('canvas');
  const wrapper = document.getElementById('canvas-wrapper');
  const ctx = canvas.getContext('2d');
  init(canvas,wrapper,e);

  function init(canvas,wrapper,e) {
    canvas.height = wrapper.offsetHeight;
    canvas.width = wrapper.offsetWidth;
    var pointAmount = 50;
    var points = new Array(pointAmount);
    
    for(let i = 0; i<pointAmount; i++) {
      points[i] = [];
    }
  
    
    var maxRadius  = 4;
    var minRadius  = 2;
  
    for (var z = 0; z < points.length; z++) { 
        var xPos =  Math.random()*canvas.width;
        var yPos =  Math.random()*canvas.height;
        points[z][0] = xPos; 
        points[z][1] = yPos; 
        points[z][2] = minRadius+(Math.random()*(maxRadius-minRadius)); 
        var angle = 0+(Math.random()*(360-0));
        points[z][3] = angle;
    } 
  
    
  
    var nearestPointAmount = 3;
    var maxDist = 100000000;
    draw(nearestPointAmount,maxDist,points,e);

    canvas.onmousemove = function(e) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      draw(nearestPointAmount,maxDist,points,e);
    }

    canvas.onclick = function(e) {
      x = e.clientX,
      y = e.clientY,
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var angle = 0+(Math.random()*(360-0));
      var radius = minRadius+(Math.random()*(maxRadius-minRadius));
      var newPoint = [x,y,radius,angle];
      points.push(newPoint);
      draw(nearestPointAmount,maxDist,points,e);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      ctx.beginPath();
      var speed = 0.5;

      for (var z = 0; z < pointAmount; z++) { 
        var x = points[z][0] - Math.cos(points[z][3])*speed;
        var y = points[z][1] - Math.sin(points[z][3])*speed;
        points[z][0] = x; 
        points[z][1] = y; 

        //if out of canvas range change direction
        if(x < -1 || y < -1 || x > canvas.width + 1 || y > canvas.height +1){
          var angle = 0+(Math.random()*(360-0));
          points[z][3] = angle; 
        }
      } 


      draw(nearestPointAmount,maxDist,points,e);
    }

    function newDirection() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      ctx.beginPath();
      var speed = 0.5;

      for (var z = 0; z < pointAmount; z++) { 
        var angle = 0+(Math.random()*(360-0));
        points[z][3] = angle;
      } 

      draw(nearestPointAmount,maxDist,points,e);
    }

    setInterval(function(){ 
      newDirection();
    }, 10000);

    setInterval(function(){ 
      animate();
    }, 50);
  }


  
  function draw(nearestPointAmount,maxDist,points,e) {
    var pointAmount = points.length;

    for(let n=0; n < pointAmount; n++) {
        //create arrays
        var smallestCords = new Array(nearestPointAmount);
        for(let j = 0; j < smallestCords.length; j++) {
          smallestCords[j] = [];
        }
  
        var smallestDist = [];
        for(let ko = 0; ko < nearestPointAmount; ko++) {
          smallestDist[ko] = 1000000000000000;
        }
  
        //loop through all points and get smallest dist
        for (let h = 0; h < pointAmount; h++) { 
          var deltaX = points[h][0]-points[n][0];
          var deltaY = points[h][1]-points[n][1];
          var distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
  
          for(let m = 0; m < smallestDist.length; m++) {
            if(distance < smallestDist[m] && distance < maxDist && distance != 0) {
              smallestDist[m] = distance;
              smallestCords[m][0] = points[h][0];
              smallestCords[m][1] = points[h][1];
              break;
            }
          }
        }
  
        color = (n==1)?"blue":(n==0)?"red":"#fff";
  
        drawCircle(ctx, points[n][0], points[n][1], points[n][2], color,smallestCords,e);
    }
  }
  
  function drawCircle(context, xPos, yPos, radius, color,smallestCords,e) {
     var startAngle        = (Math.PI/180)*0;
     var endAngle          = (Math.PI/180)*360;
     var deltaX = xPos - e.clientX;
     var deltaY = yPos - e.clientY;
     var distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);

     
     context.beginPath();
     context.arc(xPos, yPos, radius, startAngle, endAngle, false);
    var hover = (distance < 100)? true:false;
     context.fillStyle = hover ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)";
     context.fill();        

     context.closePath();
  
     for(let o = 0; o < smallestCords.length; o++) {
      context.beginPath();
      context.moveTo(xPos, yPos);
      context.lineTo(smallestCords[o][0], smallestCords[o][1]);
      context.strokeStyle = hover ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)";
      context.stroke(); 
     }
  }
  
  
}

