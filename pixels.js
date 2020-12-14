const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;
});

//creates particle version of image
function drawImage() {
    let imageWidth = image1.width;
    let imageHeight = image1.height;

    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width/2 - image1.width * 2,
            this.y = y + canvas.height/2 - image1.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - image1.width * 2, 
            this.baseY = y + canvas.height/2 - image1.height * 2,
            this.density = (Math.random() * 10) + 2;
        } 

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx/distance;
            let forceDirectionY = dy/distance;

            //max distance past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;
            
            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);
        
            if (distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if(this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }

            this.draw();
        }
    }

    function init() {
        particleArray = [];

        //scanning image extracting pixel info
        for( let y=0, y2 = data.height; y < y2; y++) {
            for(let x = 0, x2 = data.width; x < x2; x++) {
                if(data.data[(y * 4 * data.width) + (x*4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;

                    let color = "rgb(" + data.data[(y * 4 * data.width) +(x*4)] + "," + data.data[(y * 4 * data.width) + (x*4) + 1] + ',' + data.data[(y * 4 * data.width) + (x*4) + 2] + ")";

                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, .05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight
        init();
    });
}


const image1 = new Image();
image1.src = 'data:image/png;base64,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'

window.addEventListener('load', () => {
    console.log('page has loaded');
    ctx.drawImage(image1, 0, 0);
    drawImage();
})