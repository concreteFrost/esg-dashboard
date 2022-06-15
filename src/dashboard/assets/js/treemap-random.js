/* minifyOnSave */
/**
 * @preserve =========================================================
 * esg:one Dashboard Application
 * =========================================================
 * @license Copyright 2021 Beathamm Ltd (https://esg-one.co)
 * @author  22 Digital Ltd (https://22digital.ltd)
 * @author  Justin Hartman <code@22digital.ltd>
 */
// margin for the graph
var margin = { top: 0, bottom: 0, left: 0, right: 0 },
  // width = 980 - margin.left - margin.right,
  // height = 500 - margin.top - margin.bottom;
  width = $('#card').width() - margin.left - margin.right,
  height = 325;

// legend
var legend = ['Environment', 'Social', 'Governance'];

// color scale
var color = d3
  .scaleOrdinal()
  .range(['#3C7BC5', '#1BA2C1', '#5DBFC2'])
  .domain(legend);

// define tree map
var tree = d3.treemap().size([width, height]).padding(1).round(true);

// data
d3.csv('/dashboard/assets/data/treemap-random.csv', function (error, data) {
  data.forEach(function (d) {
    d.value = +d.value1;
    d.value2 = +d.value2;
  });

  // create a tree like object
  var root = stratifyData(data);
  tree(root);

  // select the top div
  var topNode = d3.select('#random');

  // create all the blocks
  var node = topNode
    .selectAll('.node')
    .data(root.leaves(), function (d) {
      return d.data.name;
    })
    .enter()
    .append('div')
    .attr('class', 'node');

  // append label
  var nodeLabel = node.append('div').attr('class', 'node-label');

  // append label
  var nodeValue = node.append('div').attr('class', 'node-value');

  // define positions
  node.call(position);
});

// change data structure into a node tree which
// can be used by the treemap
function stratifyData(data) {
  console.log(data);

  var stratif = d3
    .stratify()

    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    });

  return stratif(data)
    .sum(function (d) {
      return d.value;
    })
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });
}

// update the position of a block
function position(d) {
  d.attr('title', function (d) {
    return d.id + '\n' + d.value + ' T / $ rev';
  })
    .style('left', function (d) {
      return d.x0 + 'px';
    })
    .style('top', function (d) {
      return d.y0 + 'px';
    })
    .style('width', function (d) {
      return d.x1 - d.x0 + 'px';
    })
    .style('height', function (d) {
      return d.y1 - d.y0 + 'px';
    })
    .style('background', function (d, i) {
      return !d.children ? color(d.parent.data.name) : null;
    });

  d.select('.node-label').text(function (d) {
    return d.data.name;
  });

  d.select('.node-value').text(function (d) {
    return d.data.value;
  });
}

//
// Create legend
//
var svg = d3
  .select('#random')
  .append('svg')
  .attr('width', width)
  .attr('height', height + 70)
  .append('g')
  .attr('class', 'legend')
  // .attr('transform', 'translate(' + (width - 365) + ', ' + (height + 40) + ')');
  .attr('transform', 'translate(5, ' + (height + 40) + ')');

// legend title
svg
  .append('text')
  .style('font-weight', 'bold')
  .attr('x', 0)
  .attr('y', -15)
  .text('Legend');

// create g for each legend item
var legendItem = svg
  .selectAll('.legend-item')
  .data(legend)
  .enter()
  .append('g')
  .attr('class', 'legend-item')
  .attr('transform', function (d, i) {
    if (i == 2) {
      return 'translate(' + i * 120 + ',0)';
    } else {
      return 'translate(' + i * 150 + ',0)';
    }
  });

// legend rectangle
legendItem
  .append('rect')
  .attr('width', 20)
  .attr('height', 20)
  .style('fill', function (d) {
    return color(d);
  });

// legend text
legendItem
  .append('text')
  .attr('x', 25)
  .attr('y', 15)
  .text(function (d) {
    return d;
  });
