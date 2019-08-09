import * as d3 from 'd3';


function forceLayout(data, options) {

    //console.clear();
    //data = data.slice(0, 2);
    //console.log('--- input ---');
    //console.log(data);

    const defaults = {
        rectPadding: 5,
        ticks: 300,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight
    }

    options = Object.assign(defaults, options);

    const tagCountList = data.map(tag => tag.tagCount)

    const logScale = d3.scaleLog()
        .base(5)
        .domain(d3.extent(tagCountList))
        .range([1000,10000])
    
    let nodes = Array.apply(null, Array(data.length)).map(function (_, i) {
        
        let size = Math.sqrt(logScale(data[i].tagCount));
        let factorDistToCenter = 1-(size/data.length);
        
        let x = options.canvasWidth/2;
        let y = options.canvasHeight/2;
        
        let angle = Math.random()*Math.PI*2;
        let dist = 100*factorDistToCenter;
    
        return {
            x: x + Math.sin(angle)*dist,
            y: y + Math.cos(angle)*dist,
            size: size
        }
    });
    
    let collisionForce = rectCollide()
        .size(function (d) { return [d.size, d.size] })
    
    let svg = d3.select('body').append('svg')
    
    let rects = svg
        .attr('width', options.canvasWidth)
        .attr('height', options.canvasHeight)
        .selectAll('rect')
        .data(nodes)
        .enter()
            .append('rect')
            .style('fill', 'black')
            .attr('width', function (d) { return d.size })
            .attr('height', function (d) { return d.size })
            .attr('x', function (d) { return d.x })
            .attr('y', function (d) { return d.y })
    
    
    let simulation = d3.forceSimulation(nodes)
        .velocityDecay(0.15)
        .force("x", d3.forceX().strength(0.00125))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", collisionForce)
        .force("center", d3.forceCenter(options.canvasWidth/2, options.canvasHeight/2))
    
    
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
    }
    
    function constant(_) {
        return function () { return _ }
    }
    
    
    simulation
        .on("tick", () => {
            rects
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr('width', d => d.size - options.rectPadding) 
                .attr('height', d => d.size - options.rectPadding) 
        })
        .tick(options.ticks);

    
    const layoutData = [];
    rects.each(function(d, i) {

        const bbox = this.getBBox();
        bbox.title = data[i].title;
        layoutData.push(bbox);
    })

    //console.log('---- output ----');
    //console.log(layoutData);

    return layoutData;
}


export default forceLayout;