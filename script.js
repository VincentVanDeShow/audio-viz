var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('audioElement');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

// This creates the giant array if you log the frequency data
let frequencyData = new Uint8Array(200);

// base values
let svgHeight = '300';
let svgWidth = '1000';
// set the padding of the bars
let barPadding = '2';

function createSvg(parent, height, width) {
  return d3.select(parent).append('svg').attr('height', height).attr('width', width);
}

// Create the SVG
let svg = createSvg('body', svgHeight, svgWidth);

// Create our initial D3 chart.
svg.selectAll('rect')
   .data(frequencyData)
   .enter()
   .append('rect')
   .attr('x', function (d, i) {
      return i * (svgWidth / frequencyData.length);
   })
   .attr('width', svgWidth / frequencyData.length - barPadding);



   // Continuously loop and update chart with frequency data.
function renderChart() {
    requestAnimationFrame(renderChart);

    // Copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData);

    // Update d3 chart with new data.
    svg.selectAll('rect')
    // load RT audio data
       .data(frequencyData)
    //    set y
       .attr('y', function(d) {
          return svgHeight - d;
       })
    //    return height
       .attr('height', function(d) {
          return d;
       })
    //    fill the bars
       .attr('fill', function(d) {
          return 'rgb(0,' + d +', ' + d + ')';
       });
 }

 // Run the loop
 renderChart();