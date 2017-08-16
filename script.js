// Global configuration. All sizes are in px, Times in ms
var cfg = {
    interval: 100,
    particle_life: 6000,
    particle_size: 2,
    particle_speed: 100,
    bg_color: "#000",
    particle_color:"#FFAE00",
    canvas_width: 640,
    canvas_height: 480,
    sphere_color: "orange",
    sphere_origin_x: this.canvas_width / 2,
    sphere_origin_y: this.canvas_height / 2,
    
    particle_origin_x: this.canvas_width / 2,
    particle_origin_y: this.canvas_height / 2,  
};

// Let's classify this business
class ParticleSystem {
    
    constructor(canvasId, cfg) {
        // Setup
        this.particles = [];
        this.cfg = cfg;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.cfg.canvas_width;
        this.canvas.height = this.cfg.canvas_height;
        this.ctx.fillStyle = this.cfg.bg_color;
        this.ctx.fillRect(0, 0, this.cfg.canvas_width, this.cfg.canvas_height);

        // Animation Loop
        this.loop = setInterval(() => {
            this.drawParticles();
        }, this.cfg.interval);

        var stopMe = document.getElementById("stop");
        stopMe.addEventListener("click", () => {
            clearInterval(this.loop);
        });

        // Spawner Loop
        this.spawner = setInterval(() => {
            this.addParticle();    
        }, this.cfg.interval);

        var stopSpawn = document.getElementById("stopSpawn");
        stopSpawn.addEventListener('click', () => {
            clearInterval(this.spawner);
        });
    }

    drawParticles() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.cfg.canvas_width, this.cfg.canvas_height);
    
        // draw background
        this.ctx.fillStyle = this.cfg.bg_color;
        this.ctx.fillRect(0, 0, this.cfg.canvas_width, this.cfg.canvas_height);
    
        this.ctx.fillStyle = this.cfg.particle_color;
        this.ctx.shadowColor = this.cfg.particle_color;
        this.ctx.shadowBlur = 10;
        this.particles.forEach((v) => {
    
            this.ctx.fillRect(
                v.x,
                v.y,
                this.cfg.particle_size,
                this.cfg.particle_size
            );  
            
            // update coordinates
            v.direction_x = v.direction_x * ((v.x > this.canvas.width || v.x < 0) ? -1 : 1);      
            v.direction_y = v.direction_y * ((v.y > this.canvas.height || v.y < 0) ? -1 : 1);
    
            v.x = v.x + (v.direction_x * this.cfg.particle_speed * (this.cfg.interval/1000));   
            v.y = v.y + (v.direction_y * this.cfg.particle_speed * (this.cfg.interval/1000));
        });
    }

    addParticle() {
        var rect_x = Math.floor(Math.random() * this.cfg.canvas_width);
        var rect_y = Math.floor(Math.random() * this.cfg.canvas_height);
        this.particles.push({x: rect_x, y: rect_y, life: this.cfg.particle_life, direction_x: 1, direction_y: 1});
    }
}

var particleSystem = new ParticleSystem("c", cfg);