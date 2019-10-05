import * as d3 from 'd3';

export default function forceLayout(data, options) {

    const layoutData = new ForceLayout(data, options)
        .calculate()
        .getLayoutData();

    //re-center layout according to bounding box
    const x = Math.min(...layoutData.map(d => d.x)),
      y = Math.min(...layoutData.map(d => d.y)),
      w = Math.max(...layoutData.map(d => d.x+d.size)),
      h = Math.max(...layoutData.map(d => d.y+d.size));
    const bbox = {    
        x: x,
        y: y,
        width: Math.abs(x - w),
        height: Math.abs(y - h) 
    };
    const offset = {
        x: (bbox.width/2) - Math.abs(bbox.x),
        y: (bbox.height/2) - Math.abs(bbox.y)
    }
    layoutData.forEach(d => {
        d.x -= offset.x;
        d.y -= offset.y;
    })

    return layoutData;
}

export class ForceLayout {

    /**
     * constructor
     * @param {Array} data a list of {id, weight}
     * @param {Object} options 
     */
    constructor(data, options) {

        this.options = Object.assign({
            rectPadding: 24,
            ticks: 400,
            scaleFactor: 64, //item size = scalingFunction(item weight) * scaleFactor
            canvasWidth: 1280,
            canvasHeight: 800
        }, options);

        this.data = data;   //taglist data
        this.nodes = [];    //x-y-size representations of data
        this.rects = [];    //d3 rects
        this.svg = null;    //d3 svg
    }

    calculate() {
        
        this
            .initNodes()
            .initD3()
            .runD3()
            .getLayoutData();

        return this;
    }

    initD3() {
        
        this.svg = d3.select('body')
            .append('svg')
            .attr('id', 'd3debug')
            .attr('width', this.options.canvasWidth)
            .attr('height', this.options.canvasHeight)

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

        return this;
    }

    runD3() {

        let collisionForce = rectCollide()
            .size(function (d) { return [d.size, d.size] })
        
        let simulation = d3.forceSimulation(this.nodes)
            .velocityDecay(0.15)
            .force("x", d3.forceX().strength(0.01))
            .force("y", d3.forceY().strength(0.01))
            .force("collide", collisionForce)
            .force("center", d3.forceCenter(this.options.canvasWidth/2, this.options.canvasHeight/2))
            
        simulation
            .on("tick", () => {
                this.rects
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
            })
            .tick(this.options.ticks);

        return this;
    }

    initNodes() {

        const { data, options } = this;

        let totalRad = Math.random()*Math.PI*2;
        let spiralDist = 50;

        const dataByWeight = data.sort((a, b) => b.weight - a.weight);

        this.nodes = dataByWeight.map((_, i) => {

            let size = this.scalingFunction(data[i].weight);
            size *= options.scaleFactor;
            spiralDist += size/2;
            
            const itemRadius = size/2;
            const hypothenuse = Math.hypot(size, itemRadius);
            const rad = Math.sin(itemRadius/hypothenuse);

            totalRad += rad;
            
            //center
            let x = (options.canvasWidth/2);
            let y = (options.canvasHeight/2);
            //spiral position 
            x += Math.sin(totalRad) * spiralDist;
            y += Math.cos(totalRad) * spiralDist;
            
            //consider canvas aspect ratio
            const aspect = options.canvasWidth / options.canvasHeight;
            x *= aspect;

            totalRad += rad;
        
            return {
                x: x,
                y: y,
                size: size + options.rectPadding
            }
        });

        return this;
    }

    //@todo different default scalings as static class methods, custom function via option
    scalingFunction(weight) {

        //scale linear by weight
        //return weight;
        
        //scale linear by area
        return Math.sqrt(weight); 
        
        //scale logarithmic by weight
        //return Math.log(1+weight)

        
        //scale logarithmic with d3
        /*const weightList = data.map(tag => tag.weight)
        const logScale = d3.scaleLog()
            .base(5)
            .domain(d3.extent(weightList))
            .range([1000,10000])*/
    }

    getLayoutData() {

        const { data, rects, options } = this;

        const layoutData = [];

        rects.each(function(d, i) {
            layoutData.push({
                id: data[i].id,
                x: d.x - (options.canvasWidth/2), //let's give back coords centered around 0, 0
                y: d.y - (options.canvasHeight/2),
                size: d.size - options.rectPadding
            })
        })

        return layoutData;
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