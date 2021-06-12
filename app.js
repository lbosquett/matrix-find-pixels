let size = 10;

let states = {
    INITIAL: 0,
    READ_WHITE: 1,
    READ_BLACK: 2,
};

const app = new Vue({
    el: "#app",
    mounted: function() {
        this.fillRandom(0.2);
        this.run();
    },
    methods: {
        resetMask: function() {
            this.mask = new Array(size).fill([]).map(x => new Array(size).fill(0));
        },
        run: function() {
            this.reads = 0;
            this.resetMask();
            for (let x = 0; x < this.data.length; x++) {
                let state = states.INITIAL;
                for (let y = 0; y < this.data[x].length; y++) {
                    const pixel = this.read(x, y);
                    switch (state) {
                        case states.INITIAL:
                            if (pixel === 0) {
                                state = states.READ_WHITE;
                                continue;
                            }

                            if (y === 0) {
                                state = states.READ_BLACK;
                                continue;
                            }
                            break;
                        case states.READ_WHITE:
                            if (pixel === 1) {
                                state = states.READ_BLACK;
                                continue;
                            }
                            // remains in this state
                            break;
                        case states.READ_BLACK:
                            if (pixel === 0) {
                                // here we found [ 0 1 0 ]
                                const upper = x > 0 && y > 0 ? this.read(x - 1, y - 1) : 0;
                                const bottom = (x + 1) < this.data.length && y > 0 ? this.read(x + 1, y - 1) : 0;
                                if (upper == 0 && bottom == 0) {
                                    // replace pixel to 0
                                    // I'm not using read function here because is a write to memory
                                    this.data[x][y - 1] = 0;
                                    this.mask[x][y - 1] = 1;
                                }
                                state = states.READ_WHITE;
                                continue;
                            }
                            state = states.INITIAL;
                            break;
                    }
                }
            }
            this.data = this.data.slice();
        },
        fillRandom: function(chance) {
            for (let x = 0; x < this.data.length; x++) {
                for (let y = 0; y < this.data[x].length; y++) {
                    let pixel = Math.random() > (1 - chance) ? 1 : 0;
                    this.data[x][y] = pixel;
                }
            }
            this.data = this.data.slice();
            this.resetMask();
        },
        checkerboardFill: function() {
            for (let x = 0; x < this.data.length; x++) {
                for (let y = 0; y < this.data[x].length; y++) {
                    let pixel = x % 2 == 0 ? 1 - y % 2 : y % 2;
                    this.data[x][y] = pixel;
                }
            }
            this.data = this.data.slice();
            this.resetMask();
        },
        read: function(x, y) {
            this.reads++;
            return this.data[x][y];
        }
    },
    data: () => ({
        reads: 0,
        mask: new Array(size).fill([]).map(x => new Array(size).fill(0)),
        data: new Array(size).fill([]).map(x => new Array(size).fill(0))
    })
});
