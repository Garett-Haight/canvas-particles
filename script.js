// Global configuration. All sizes are in px, Times in ms
var cfg = {
    interval: 16,                          // Framerate 
    particle_life: 6000,
    particle_life_variation: 1000,
    particle_limit: 100,                    // How many particles can exist at one time
    particle_size: 2,                       // base H and W of a particle
    particle_size_variation: 1,             // How much H and W of a particle can vary from particle_size
    particle_speed: 40,                     // How many pixels / sec a particle can translate
    particle_color_start: "rgba(255, 255, 0, 1)",
    particle_color_mid: "rgba(255, 174, 0, 0.7)",
    particle_color_end: "rgba(255, 174, 0, 0.3)",
    shadow_blur: 20,
    canvas_width: 640,
    canvas_height: 480,
    particle_origin_x: this.canvas_width / 2,
    particle_origin_y: this.canvas_height / 2,  
    // controls
    stopAnimation: "stop",
    stopSpawner: "stopSpawn"
};

class ParticleSystem {
    constructor(canvasId, cfg) {
        this.id = 0;
        // Setup
        this.particles = [];
        this.lastFrameTime = null;
        this.cfg = cfg;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.cfg.canvas_width;
        this.canvas.height = this.cfg.canvas_height;

        // Animation Loop
        this.loop = setInterval(() => {
            this.updateScene();
        }, this.cfg.interval);

        const stopMe = document.getElementById(this.cfg.stopAnimation);
        stopMe.addEventListener("click", () => {
            clearInterval(this.loop);
            clearInterval(this.spawner);            
        });

        // Spawner Loop
        this.spawner = setInterval(() => {
            this.addParticle();    
        }, this.cfg.interval);

        const stopSpawn = document.getElementById(this.cfg.stopSpawner);
        stopSpawn.addEventListener('click', () => {
            clearInterval(this.spawner);
        });
    }

    drawParticles() {
        let deltaT;
        let now = +new Date();
        if (this.lastFrameTime === null) {
            deltaT = this.interval;
        } 
        else {
            deltaT = now - this.lastFrameTime;
        }
        this.lastFrameTime = now;

        // clear canvas
        this.ctx.clearRect(0, 0, this.cfg.canvas_width, this.cfg.canvas_height);
        this.ctx.shadowBlur = this.cfg.shadow_blur;
        this.particles.forEach((v, idx, arr) => {
            // spark color fades as it approaches the end of it's life
            if (v.life < v.max_life * 2/3) {
                this.ctx.fillStyle = this.cfg.particle_color_mid;
                this.ctx.shadowColor = this.cfg.particle_color_mid;
            }
            else if(v.life < v.max_life * 1/3) {
                this.ctx.fillStyle = this.cfg.particle_color_end;
                this.ctx.shadowColor = this.cfg.particle_color_end;
            }
            else {
                this.ctx.fillStyle = this.cfg.particle_color_start;
                this.ctx.shadowColor = this.cfg.particle_color_start;
            }

            this.ctx.fillRect(
                v.x,
                v.y,
                v.w,
                v.h
            );
            
            if (v.life > 0) {
                // update coordinates
                v.direction_x = v.direction_x * ((v.x > this.canvas.width || v.x < 0) ? -1 : 1); 
                v.direction_y = v.direction_y * ((v.y > this.canvas.height || v.y < 0) ? -1 : 1);
        
                // Math.cos adds a little bit of randomness to movement in the x direction
                v.x = v.x + (v.direction_x * this.cfg.particle_speed * (deltaT/1000)) + (Math.cos((v.y + this.getVariation(2)) * (Math.PI/180)));

                v.y = v.y + (v.direction_y * this.cfg.particle_speed * 1.5 * (deltaT/1000));
                
                // convection current in the middle of the canvas
                v.y = v.y -  (v.x > ((this.cfg.canvas_width/2) - 100) &&  v.x < ((this.cfg.canvas_width/2) + 100) ? 2 : 0);

                v.life -= deltaT;
            }
            else {
                // remove particle from particles array if life has expired
                arr.splice(idx, 1);
            }
        });
    }

    addParticle() {
        if (this.particles.length < this.cfg.particle_limit) {
            var rect_x = Math.floor(Math.random() * this.cfg.canvas_width);
            // spawn from the bottom of the canvas
            var rect_y = Math.floor((Math.random() * (this.cfg.canvas_height / 5)) + (this.cfg.canvas_height * 4/5));
            var max_life = this.cfg.particle_life + this.getVariation(this.cfg.particle_life_variation);
            var particle_size = this.cfg.particle_size + this.getVariation(this.cfg.particle_size_variation);
            this.particles.push({
                id: this.id,
                x: rect_x,
                y: rect_y,
                w: particle_size,
                h: particle_size,
                life: max_life,
                max_life: max_life,
                direction_x: this.getVariation(1),
                direction_y: -1
            });
            this.id++;
        }
    }

    updateScene() {
        this.drawParticles();
    }

    // gets a random -/+ value within n distance of 0
    getVariation(n) {
        return Math.floor(n * (Math.random() > 0.5 ? -1 : 1));
    }
}

var particleSystem = new ParticleSystem("c", cfg);