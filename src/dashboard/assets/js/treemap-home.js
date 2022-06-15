/* minifyOnSave */
/**
 * @preserve =========================================================
 * esg:one Dashboard Application
 * =========================================================
 * @license Copyright 2021 Beathamm Ltd (https://esg-one.co)
 * @author  22 Digital Ltd (https://22digital.ltd)
 * @author  Justin Hartman <code@22digital.ltd>
 */
//
// Load dataset from Json file and render graph.
//
d3.json('/dashboard/assets/data/treemap.json', function (data) {
  //
  // Chart
  //
  var margin = { top: 0, bottom: 0, left: 0, right: 0 },
    width = $('#card').width(),
    height = 450,
    formatNumber = d3.format(',d'),
    transitioning;

  var x = d3.scaleLinear().domain([0, width]).range([0, width]);

  var y = d3
    .scaleLinear()
    .domain([0, height - margin.top - margin.bottom])
    .range([0, height - margin.top - margin.bottom]);

  var color = d3.scaleOrdinal().range(
    d3.schemeCategory10.map(function (c) {
      c = d3.rgb(c);
      // c.opacity = 0.6;
      return c;
    })
  );
  // Untested:
  // var color = d3.scaleOrdinal().range(['#3C7BC5', '#1BA2C1', '#5DBFC2']).domain(legend);
  //
  // var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
  var fader = function (color) {
    return d3.interpolateRgb(color, '#fff')(0.2);
  };
  var format = d3.format(',d');
  var treemap;
  var svg, grandparent;

  updateDrillDown();

  function updateDrillDown() {
    if (svg) {
      svg.selectAll('*').remove();
    } else {
      svg = d3
        .select('#domainDrillDown')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.bottom - margin.top)
        .style('border-radius', '5px')
        .style('margin-left', -margin.left + 'px')
        .style('margin.right', -margin.right + 'px')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style('shape-rendering', 'crispEdges');

      // Breadcrumb navigation append class.
      grandparent = svg.append('g').attr('class', 'grandparent');
      // Breadcrumb navigation create rectangle.
      grandparent
        .append('rect')
        .attr('y', -margin.top)
        .attr('x', 0)
        .attr('width', width + 1)
        .attr('height', 25);
      // Breadcrumb navigation text.
      grandparent
        .append('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .attr('x', 6)
        .attr('y', 6 - margin.top)
        .attr('dy', '.80em');

      // Create the treemap container.
      treemap = d3
        .treemap()
        //.tile(d3.treemapResquarify)
        .size([width, height])
        .round(false)
        .paddingInner(1);
    }

    var root = d3
      .hierarchy(data)
      .eachBefore(function (d) {
        d.id = (d.parent ? d.parent.id + '.' : '') + d.data.shortName;
      })
      .sum((d) => d.size)
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });

    initialize(root);
    accumulate(root);
    layout(root);
    treemap(root);
    display(root);
  }

  function initialize(root) {
    root.x = root.y = 0;
    root.x1 = width;
    root.y1 = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes.
  function accumulate(d) {
    return (d._children = d.children)
      ? (d.value = d.children.reduce(function (p, v) {
          return p + accumulate(v);
        }, 0))
      : d.value;
  }

  // Compute the treemap layout recursively.
  function layout(d) {
    if (d._children) {
      // treemap.nodes({_children: d._children});
      // treemap(d);
      d._children.forEach(function (c) {
        c.x0 = d.x0 + c.x0 * d.x1;
        c.y0 = d.y0 + c.y0 * d.y1;
        c.x1 *= d.x1;
        c.y1 *= d.y1;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
      .datum(d.parent)
      .on('click', transition)
      .select('text')
      .text(name(d));

    var g1 = svg.insert('g', '.grandparent').datum(d).attr('class', 'depth');

    var g = g1.selectAll('g').data(d._children).enter().append('g');

    g.filter(function (d) {
      return d._children;
    })
      .classed('children', true)
      .on('click', transition);

    var children = g
      .selectAll('.child')
      .data(function (d) {
        return d._children || [d];
      })
      .enter()
      .append('g');

    children
      .append('rect')
      .attr('class', 'child')
      .call(rect)
      .append('title')
      .text(function (d) {
        return d.data.shortName + ' (' + formatNumber(d.value) + ')';
      });

    children
      .append('text')
      .attr('class', 'ctext')
      .style('font-size', '12px')
      .style('font-weight', 'normal')
      .text(function (d) {
        return d.data.shortName;
      })
      .call(text2);

    g.append('rect').attr('class', 'parent').call(rect);

    var t = g
      .append('text')
      .attr('class', 'ptext')
      // .attr('dy', '1.9em')
      .attr('dx', '0.2em');

    // Node headings.
    t.append('tspan')
      .attr('dy', '0.5em')
      .style('font-weight', 'normal')
      .style('font-size', '12px')
      .style('fill', '#f2f2f2')
      .text(function (d) {
        return d.data.shortName;
      });
    t.append('tspan')
      .attr('dy', '1.2em')
      .attr('dx', '0.3em')
      .style('fill', '#f2f2f2')
      .style('font-size', '12px')
      .style('font-weight', 'normal')
      .text(function (d) {
        if (d.data.metric) {
          return d.data.size + ' ' + d.data.metric;
        } else {
          return d.data.size;
        }
      });
    t.call(text);

    g.selectAll('rect').style('fill', function (d) {
      return color(d.data.shortName);
    });

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
        t1 = g1.transition().duration(750),
        t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x0, d.x0 + d.x1]);
      y.domain([d.y0, d.y0 + d.y1]);

      // Enable anti-aliasing during the transition.
      svg.style('shape-rendering', null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll('.depth').sort(function (a, b) {
        return a.depth - b.depth;
      });

      // Fade-in entering text.
      g2.selectAll('text').style('fill-opacity', 0);

      // Transition to the new view.
      t1.selectAll('text').call(text).style('fill-opacity', 0);
      t2.selectAll('text').call(text).style('fill-opacity', 1);
      t1.selectAll('rect').call(rect);
      t2.selectAll('rect').call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().on('end', function () {
        svg.style('shape-rendering', 'crispEdges');
        transitioning = false;
      });
    }

    return g;
  }

  // Title on individual blocks.
  function text(text) {
    text.selectAll('tspan').attr('x', function (d) {
      return x(d.x0) + 6;
    });
    text
      .attr('x', function (d) {
        return x(d.x0) + 6;
      })
      .attr('y', function (d) {
        // This loop determines where the label sits on the rect.
        // If it's a top block then we add 40y so it sits nicely in the block
        // else if it's a smaller block (less than 350y) then we don't add too
        // much padding. The default y value is the height (y) + 35 which works
        // well on most blocks.
        var h = y(d.y0);
        if (h === 0) {
          return 40;
        } else if (h < 390) {
          return h + 15;
        }
        return h + 35;
      })
      .style('fill', 'transparent')
      .style('opacity', function (d) {
        return this.getComputedTextLength() < x(d.x0 + d.x1) - x(d.x0) ? 1 : 0;
      });
  }

  function text2(text) {
    text
      .attr('x', function (d) {
        return x(d.x0 + d.x1) - this.getComputedTextLength() - 6;
      })
      .attr('y', function (d) {
        return y(d.y0 + d.y1);
      })
      .style('opacity', function (d) {
        return this.getComputedTextLength() < x(d.x0 + d.x1) - x(d.x0) ? 0 : 1;
      });
  }

  function rect(rect) {
    rect
      .attr('x', function (d) {
        return x(d.x0);
      })
      .attr('y', function (d) {
        return y(d.y0);
      })
      .attr('width', function (d) {
        return x(d.x0 + d.x1) - x(d.x0);
      })
      .attr('height', function (d) {
        return y(d.y0 + d.y1) - y(d.y0);
      });
  }

  // Overview breadcrumb.
  function name(d) {
    return d.parent
      ? name(d.parent) + ' / ' + d.data.shortName + ' (' + d.data.size + '%)'
      : d.data.shortName;
  }
});
