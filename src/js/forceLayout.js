import * as d3 from 'd3';

export default function forceLayout(data, options) {

    const fl = new ForceLayout(data, options)
        .calculate()
        .addPositionToData();

    return fl.layoutData;
}

export class ForceLayout {

    constructor(data, options) {

        this.options = Object.assign({
            rectPadding: 5,
            ticks: 400,
            canvasWidth: 640,
            canvasHeight: 640
        }, options);

        this.data = data;   //taglist data
        this.nodes = [];    //x-y-size representations of data
        this.rects = [];    //d3 rects
        this.svg = null;    //d3 svg
        this.layoutData = [];    //calculated
    }

    calculate() {
        
        return this
            .initNodes()
            .initD3();
    }

    initD3() {

        const options = this.options;

        let collisionForce = rectCollide()
            .size(function (d) { return [d.size, d.size] })
        
        this.svg = d3.select('#d3force')
            .append('svg')
            .attr('width', options.canvasWidth)
            .attr('height', options.canvasHeight)
        
        this.rects = this.svg
            .selectAll('rect')
            .data(this.nodes)
            .enter()
                .append('rect')
                .style('fill', 'black')
                .attr('width', function (d) { return d.size })
                .attr('height', function (d) { return d.size })
                .attr('x', function (d) { return d.x })
                .attr('y', function (d) { return d.y })
        
        let simulation = d3.forceSimulation(this.nodes)
            .velocityDecay(0.15)
            .force("x", d3.forceX().strength(0.00125))
            .force("y", d3.forceY().strength(0.01))
            .force("collide", collisionForce)
            .force("center", d3.forceCenter(options.canvasWidth/2, options.canvasHeight/2))
            
        simulation
            .on("tick", () => {
                this.rects
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    //.attr('width', d => d.size - options.rectPadding) 
                    //.attr('height', d => d.size - options.rectPadding) 
            })
            .tick(options.ticks);

        return this;
    }

    initNodes() {

        const { data, options } = this;

        this.nodes = data.map(function (_, i) {
            
            let tagAmount = data[i].objectCount;
            let size = Math.sqrt(tagAmount*100);
            let factorDistToCenter = 1;
            
            let x = options.canvasWidth/2;
            let y = options.canvasHeight/2;
            
            let angle = Math.random()*Math.PI*2;
            let dist = 100*factorDistToCenter;
        
            return {
                x: x + Math.sin(angle)*dist,
                y: y + Math.cos(angle)*dist,
                size: size + options.rectPadding
            }
        });

        return this;
    }

    addPositionToData() {

        const { data, rects, options } = this;

        //console.log(':(((', data);

        const layoutData = [];

        rects.each(function(d, i) {

            layoutData.push({
                title: data[i].title,
                x: d.x,
                y: d.y,
                size: d.size - options.rectPadding
            })

            /*data[i] = Object.assign(data[i], {
                x: d.x,
                y: d.y,
                size: d.size - options.rectPadding
            });*/
        })

        this.layoutData = layoutData;
        //console.log(':)))', this.layoutData);

        return this;
    }
}

/*
function withPromise(data, options) {
    return new Promise((resolve, reject) => {
        const fl = new ForceLayout(data, options);
        ForceLayout.on('calculated', (data) => resolve(data));
    });
}
*/



/**
 * rectCollide
 * D3 Collision Force
 * @see https://bl.ocks.org/cmgiven/547658968d365bcc324f3e62e175709b
 */
function rectCollide() {
    let nodes, sizes, masses
    let size = constant([0, 0])
    let strength = 1
    let iterations = 1

    function force() {
        let node, size, mass, xi, yi
        let i = -1
        while (++i < iterations) { iterate() }

        function iterate() {
            let j = -1
            let tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

            while (++j < nodes.length) {
                node = nodes[j]
                size = sizes[j]
                mass = masses[j]
                xi = xCenter(node)
                yi = yCenter(node)

                tree.visit(apply)
            }
        }

        function apply(quad, x0, y0, x1, y1) {
            let data = quad.data
            let xSize = (size[0] + quad.size[0]) / 2
            let ySize = (size[1] + quad.size[1]) / 2
            if (data) {
                if (data.index <= node.index) { return }

                let x = xi - xCenter(data)
                let y = yi - yCenter(data)
                let xd = Math.abs(x) - xSize
                let yd = Math.abs(y) - ySize

                if (xd < 0 && yd < 0) {
                    let l = Math.sqrt(x * x + y * y)
                    let m = masses[data.index] / (mass + masses[data.index])

                    if (Math.abs(xd) < Math.abs(yd)) {
                        node.vx -= (x *= xd / l * strength) * m
                        data.vx += x * (1 - m)
                    } else {
                        node.vy -= (y *= yd / l * strength) * m
                        data.vy += y * (1 - m)
                    }
                }
            }

            return x0 > xi + xSize || y0 > yi + ySize ||
                   x1 < xi - xSize || y1 < yi - ySize
        }

        function prepare(quad) {
            if (quad.data) {
                quad.size = sizes[quad.data.index]
            } else {
                quad.size = [0, 0]
                let i = -1
                while (++i < 4) {
                    if (quad[i] && quad[i].size) {
                        quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                        quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
                    }
                }
            }
        }
    }

    function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2 }
    function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2 }

    force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
    }

    force.size = function (_) {
        return (arguments.length
             ? (size = typeof _ === 'function' ? _ : constant(_), force)
             : size)
    }

    force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
    }

    force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
    }

    return force

    function constant(_) {
        return function () { return _ }
    }
}