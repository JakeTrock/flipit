var floodfill=(function(){function f(p,v,u,l,t,g,B){var k=p.length;var q=[];var o=(v+u*g)*4;var r=o,z=o,s,A,n=g*4;var h=[p[o],p[o+1],p[o+2],p[o+3]];if(!a(o,h,l,p,k,t)){return false}q.push(o);while(q.length){o=q.pop();if(e(o,h,l,p,k,t)){r=o;z=o;A=parseInt(o/n)*n;s=A+n;while(A<z&&A<(z-=4)&&e(z,h,l,p,k,t)){}while(s>r&&s>(r+=4)&&e(r,h,l,p,k,t)){}for(var m=z+4;m<r;m+=4){if(m-n>=0&&a(m-n,h,l,p,k,t)){q.push(m-n)}if(m+n<k&&a(m+n,h,l,p,k,t)){q.push(m+n)}}}}return p}function a(j,l,h,m,k,g){if(j<0||j>=k){return false}if(m[j+3]===0&&h.a>0){return true}if(Math.abs(l[3]-h.a)<=g&&Math.abs(l[0]-h.r)<=g&&Math.abs(l[1]-h.g)<=g&&Math.abs(l[2]-h.b)<=g){return false}if((l[3]===m[j+3])&&(l[0]===m[j])&&(l[1]===m[j+1])&&(l[2]===m[j+2])){return true}if(Math.abs(l[3]-m[j+3])<=(255-g)&&Math.abs(l[0]-m[j])<=g&&Math.abs(l[1]-m[j+1])<=g&&Math.abs(l[2]-m[j+2])<=g){return true}return false}function e(j,l,h,m,k,g){if(a(j,l,h,m,k,g)){m[j]=h.r;m[j+1]=h.g;m[j+2]=h.b;m[j+3]=h.a;return true}return false}function b(j,n,m,i,k,g,o){if(!j instanceof Uint8ClampedArray){throw new Error("data must be an instance of Uint8ClampedArray")}if(isNaN(g)||g<1){throw new Error("argument 'width' must be a positive integer")}if(isNaN(o)||o<1){throw new Error("argument 'height' must be a positive integer")}if(isNaN(n)||n<0){throw new Error("argument 'x' must be a positive integer")}if(isNaN(m)||m<0){throw new Error("argument 'y' must be a positive integer")}if(g*o*4!==j.length){throw new Error("width and height do not fit Uint8ClampedArray dimensions")}var l=Math.floor(n);var h=Math.floor(m);if(l!==n){console.warn("x truncated from",n,"to",l)}if(h!==m){console.warn("y truncated from",m,"to",h)}k=(!isNaN(k))?Math.min(Math.abs(Math.round(k)),254):0;return f(j,l,h,i,k,g,o)}var d=function(l){var h=document.createElement("div");var g={r:0,g:0,b:0,a:0};h.style.color=l;h.style.display="none";document.body.appendChild(h);var i=window.getComputedStyle(h,null).color;document.body.removeChild(h);var k=/([\.\d]+)/g;var j=i.match(k);if(j&&j.length>2){g.r=parseInt(j[0])||0;g.g=parseInt(j[1])||0;g.b=parseInt(j[2])||0;g.a=Math.round((parseFloat(j[3])||1)*255)}return g};function c(p,n,m,i,o,q,g){var s=this;var k=d(this.fillStyle);i=(isNaN(i))?0:i;o=(isNaN(o))?0:o;q=(!isNaN(q)&&q)?Math.min(Math.abs(q),s.canvas.width):s.canvas.width;g=(!isNaN(g)&&g)?Math.min(Math.abs(g),s.canvas.height):s.canvas.height;var j=s.getImageData(i,o,q,g);var l=j.data;var h=j.width;var r=j.height;if(h>0&&r>0){b(l,p,n,k,m,h,r);s.putImageData(j,i,o)}}if(typeof CanvasRenderingContext2D!="undefined"){CanvasRenderingContext2D.prototype.fillFlood=c}return b})();
var blank = "canvas.png",
    tool = "pen",
    pos = 0,
    imgs = [],
    canvas = document.getElementById('okb'),
    ctx = canvas.getContext("2d"),
    lastPosition = null,
    drawing = false,
    rc = false,
    lw = document.getElementById("sz").value,
    dtype = 0,
    allAction=[new Array()],
    csteps=[0],
    audchunks = [],
    recorder,
    exportaudio,
    exportvideo,
    curColor = document.getElementById('cl').value;

function random(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
document.getElementById("sz").onchange = function() { lw = document.getElementById("sz").value; };

function startDraw(evt) {
    if (tool == "bucket") {
        if(curColor.toString()=="#000000")ctx.fillStyle = "#000001";else ctx.fillStyle = curColor.toString();//really weird error, cannot fill with 000000 black?!?
        ctx.fillFlood(evt.offsetX, evt.offsetY);
    }else drawing = true;
}
canvas.onmousedown = startDraw;

function stopDraw() {
    drawing = false;
    var cStep=csteps[pos];
    cStep++;
    var undoarr=allAction[pos];
    // if (cStep < undoarr.length) { undoarr.length = cStep; } 
    undoarr.push(canvas.toDataURL());
    console.log("newpush");
    csteps[pos]=cStep;
    allAction[pos]=undoarr;
}
canvas.onmouseup = stopDraw;
canvas.onmouseleave = stopDraw;

function mouseMove(evt) {
    var pos = { x: evt.offsetX, y: evt.offsetY };
    if (lastPosition !== null && drawing === true) {
        ctx.beginPath();
        if (tool == "eraser") {ctx.strokeStyle = ctx.fillStyle = "#FFFFFF";}
        else if (tool == "pen") {ctx.strokeStyle = ctx.fillStyle = curColor.toString();}
        if (dtype == 0) {
            ctx.lineWidth = lw;
            ctx.moveTo(lastPosition.x, lastPosition.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.closePath();
            ctx.stroke();
        } else if (dtype == 1) {
            for (var v = 25; v > 0; v--) ctx.fillRect(pos.x + v * lw, pos.y, 1, 1);
        } else if (dtype == 2) {
            for (var v = random(1, 20 + lw); v > 0; v--) ctx.fillRect(pos.x + random(1, 5 * (lw / 2)), pos.y + random(1, 5 * (lw / 2)), 1, 1);
        }
    }
    lastPosition = pos;
}
canvas.onmousemove = mouseMove;

function startRecording() {
    const chunks = [];
    const stream = document.getElementById("seccv").captureStream();
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = e => exportVid(new Blob(chunks, { type: 'video/webm' }));
    rec.start();
    setTimeout(() => rec.stop(), 60000);
}

function exportVid(blob) {
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.getElementById("popover").appendChild(vid);
    const a = document.createElement('a');
    a.download = 'myvid.webm';
    a.href = vid.src;
    a.textContent = 'download the video';
    document.getElementById("popover").appendChild(a);
}

function runframes() {
    var flens = [],
        b = 0,
        h = 0,
        r = document.getElementById("frames").getElementsByTagName('div');
    for (var i in r) {
        console.log((64 + r[i].offsetWidth) - 2 / 64);
        flens[h] = (64 + r[i].offsetWidth) - 2 / 64;
        h++;
    }
    setInterval(function() {
        if (b < imgs.length) {
            console.log(b);
            var cimg = new Image();
            cimg.src = imgs[b];
            cimg.onload = function() {
                (document.getElementById("seccv").getContext('2d')).drawImage(cimg, 0, 0);
            }
            b++;
        }
    }, flens[b]);
    console.log(flens);
}
/*
 var reader = new FileReader();
 reader.readAsDataURL(blob); 
 reader.onloadend = function() {
     base64data = reader.result;                
     console.log(base64data);
 }
*/
function showrec(){
    if(rc){
        document.getElementById("pop").style.display="block";
    }else{
        document.getElementById("pop").style.display="none";
    }
    rc=!rc;
}
function recaud() {

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            rec = new MediaRecorder(stream);
            rec.ondataavailable = e => {
                console.log("recording...");
                audchunks.push(e.data);
                console.log(audchunks);

                let blob = new Blob(audchunks, { 'type': 'audio/ogg; codecs=opus' });
                exportaudio = window.URL.createObjectURL(blob);

            };
            rec.start(5000);

        })
        .catch(e => console.log(e));
}

function sfr(pos) { //innef.
    var lin = document.getElementById('frames');
    lin.innerHTML = "";
    for (var h = 0; h < imgs.length; h++) {
        var Durl = imgs[h];
        var img = document.createElement("IMG");
        img.setAttribute("src", Durl);
        img.setAttribute("height", "64px");
        img.setAttribute("width", "64px");
        var stretchdiv = document.createElement("DIV");
        stretchdiv.setAttribute("id", "sd");
        if (h == pos) img.setAttribute("style", "border:1px solid red;");
        stretchdiv.appendChild(img);
        lin.appendChild(stretchdiv);
    }
}

function vue(dir) {
    allAction.push(new Array());
    csteps.push(0);
    if (imgs[pos] != document.getElementById('okb').toDataURL('image/png', .7)) imgs[pos] = document.getElementById('okb').toDataURL('image/png', .7);
    if (imgs[imgs.length - 1] != blank) imgs.push(blank);
    if (dir == "fw") {
        pos = pos + 1;
    } else if (dir == "bk" && pos > 0) {
        pos = pos - 1;
    } else return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    if (pos < imgs.length - 1 && imgs[pos] != blank) {
        var fr = new Image();
        fr.onload = function() {
            ctx.drawImage(fr, 0, 0);
        };
        fr.src = imgs[pos];
    }
    sfr(pos);
    /*document.getElementById("okb").style.background = "url('" + imgs[pos] + "') no-repeat";
    document.getElementById("okb").style.opacity="0.1"; // ghostlayer?*/
    ////////////////////////////////////////////////////////////////////////////////////HOW TO DO THIS?
}


function undo() {
    var undoarr=allAction[pos];
    var cStep=csteps[pos];
    console.log(cStep);
    if (cStep > 0) {
        cStep--;
        var cimg = new Image();//WORK ON
        cimg.src = undoarr[cStep];
        cimg.onload = function() { console.log("loaded");ctx.drawImage(cimg, 0, 0); }
    }
    csteps[pos]=cStep;
    allAction[pos]=undoarr;
}

function redo() {
    var undoarr=allAction[pos];
    var cStep=csteps[pos];
    console.log(cStep);
    if (cStep < undoarr.length - 1) {
        cStep++;
        var cimg = new Image();
        cimg.src = undoarr[cStep];
        cimg.onload = function() { ctx.drawImage(cimg, 0, 0); }
    }
    csteps[pos]=cStep;
    allAction[pos]=undoarr;
}