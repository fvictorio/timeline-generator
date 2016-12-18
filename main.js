const data = [];

const container = d3.select('#container');

container.call(drawTimeline, data);

const form = document.querySelector('form');
const labelInput = form.querySelector('input[name=label]');
const startInput = form.querySelector('input[name=start]');
const endInput = form.querySelector('input[name=end]');
form.onsubmit = function () {
  const label = labelInput.value;
  const start = startInput.value;
  const end = endInput.value;
  const event = { label, start, end };

  data.push(event);
  draw(container, data);

  labelInput.value = '';
  startInput.value = '';
  endInput.value = '';

  labelInput.focus();

  return false;
}

function draw(container, data) {
  container.html('');
  container.call(drawTimeline, data, {
    padding: {
      left: 100,
      right: 100
    }
  });
}

const copyAsJSONButton = document.querySelector('#copy-as-json');
copyAsJSONButton.onclick = function () {
  window.prompt('Here you are', JSON.stringify(data));
};
const pasteAsJSONButton = document.querySelector('#paste-as-json');
pasteAsJSONButton.onclick = function () {
  var newData = window.prompt('Paste your data');
  data.push.apply(data, JSON.parse(newData));
  draw(container, data);
};


function drawTimeline(selection, data, options = {}) {
  if (!data.length) return;

  data = _(data).sortBy('start').value();

  // Parameters
  const padding = {};
  padding.bottom = options.padding && options.padding.bottom || 50;
  padding.top = options.padding && options.padding.top || 0;
  padding.left = options.padding && options.padding.left || 10;
  padding.right = options.padding && options.padding.right || 20;
  const width = options.width || 1000;
  const height = data.length * 75;

  // x scale
  const minYear = _(data).map('start').min();
  const maxYear = _(data).map('end').max();
  const xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, width]);


  // y scale
  const yScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([0, height])
    .paddingInner(0.05)
    .paddingOuter(0.05);

  const svg = selection.append('svg')
    .attr('width', width + padding.left + padding.right)
    .attr('height', height + padding.top + padding.bottom);

  const canvas = svg.append('g')
    .classed('canvas', true)
    .attr('transform', `translate(${padding.left}, ${padding.top})`);

  // x axis
  const xAxis = d3.axisBottom(xScale);
  canvas.append('g')
    .classed('x axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  // lines
  const lines = canvas.append('g').classed('lines', true)
    .selectAll('g').data(data).enter().append('g')
    .attr('transform', (d, i) => {
      const x = xScale(d.start);
      const y = yScale(i);
      return `translate(${x}, ${y})`;
    });

  lines.on('click', (d, i) => {
    data.splice(i, 1);
    draw(container, data);
  });

  lines.append('rect')
    .attr('width', d => xScale(d.end) - xScale(d.start))
    .attr('height', yScale.bandwidth())
    .attr('fill', (d, i) => d3.interpolateWarm(i));
  lines.append('text')
    .attr('x', 10)
    .attr('y', 4 + yScale.bandwidth() / 2)
    .text(d => d.label);
}
