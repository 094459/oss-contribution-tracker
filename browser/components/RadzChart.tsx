
import * as React from 'react';

const d3 = require("d3");

interface Props {
    data: object[];
    centerText: string;
    height: number;
    width:number;
    id: string;
    cornerRadius:number;
    padAngle: number;
    centerTextSize: string;
    centerTextdx: string;
}

export default class Rad extends React.Component<Partial<Props>, {}> { 
  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentDidMount() {
    const dataset  = this.props.data;
    this.generateChart(dataset);
  }

  componentWillReceiveProps() {
    this.generateChart(this.props.data);
  }

  generateChart(data){
    let width = this.props.width,
    height = this.props.height,
    radius = Math.min(width, height) / 2;

    function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    let arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.65)
        .cornerRadius(this.props.cornerRadius)
        .padAngle(this.props.padAngle);

    let outerArc = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);

    // remove previous svg each time from the div
    d3.select("#"+this.props.id).remove();

    let svg = d3.select("#radzChart"+this.props.id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id",this.props.id)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let label = svg.select('.labelName').selectAll('text')
              .data(data)
            .enter().append('text')
              .attr('dy', '.35em')
              .html(function(d) {
                  return d.data[label] + ': <tspan>' + d.value + '</tspan>';
              })
              .attr('class', 'labelName')
              .attr('transform', function(d) {
                  var pos = outerArc.centroid(d);
                  pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                  return 'translate(' + pos + ')';
              })
              .style('text-anchor', function(d) {
                  return (midAngle(d)) < Math.PI ? 'start' : 'end';
              });

    let g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.label); });

    g.append("text")
      .attr("transform", function(d){
          var pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        }
       )
      .attr("dy", ".35em")
      .html(function(d) {
        return d.data.label + ': <tspan>' + d.data.value + '</tspan>';
      })
      .style('text-anchor', function(d) {
          return (midAngle(d)) < Math.PI ? 'start' : 'end';
      })

    g.append('polyline')
          .attr('points', function(d) {
              var pos = outerArc.centroid(d);
              pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
              return [arc.centroid(d), outerArc.centroid(d), pos]
          })
          .attr("class", "polyline")

    g.append("text").text(this.props.centerText).attr("dy", ".35em").attr("dx", this.props.centerTextdx).attr("class", "largeText").style("font-size", this.props.centerTextSize)
  }

  render(){
    {this.generateChart(this.props.data);}
    return  <div id={"radzChart" + this.props.id} />
  }
}
