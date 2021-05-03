const d3 = require('d3');
import factorGraphData from '../static/FactorLineChart.csv';
import { csv } from 'd3';
"use strict";

(function() {
// MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE
/**
* Add a function that will be called when the window is loaded.
*/
var fc_circle;
window.addEventListener("load", init);
var allData = [];
//console.log("factorGraph");
var selectedCountry = "";
var factors = ["Economy (GDP per Capita)","Family or social support","Health (Life Expectancy)","Freedom to make life choices","Trust (Government Corruption)","Generosity"];

var margin = { top: 70, right: 50, bottom: 90, left: 50 },
w = 400 - (margin.left + margin.right),
h = 400 - (margin.top + margin.bottom);
var y = d3.scaleLinear()
.range([h, 0]);
var x = d3.scaleLinear()
.range([0, w]);

var yAxis = d3.axisLeft().scale(y).ticks(10);
var xAxis = d3.axisBottom().scale(x).ticks(4);
var myColor = [];
var line_svg;
function init() {
    var i = 0
    factors.forEach(function(d) {
        myColor.push(colorMap(d, i));
        i++;
    });
    //drawGraph();
    id("factors_spider_chart").addEventListener('click', drawGraph);
}

function colorMap(c, i) {
    var color = ["#0D3B66", "#9e9cc2", "#F4D35E", "#EE964B", "#F95738","#63acbe","#c5c748"]
  return {
    Factor: c,
    Color: color[i]
  }
}

function addData(n, y, economy, family, health, freedom, trust, generosity) {
    return {
        Country: n,
        Year: y,
        "Economy (GDP per Capita)": economy,
        "Family or social support": family,
        "Health (Life Expectancy)": health,
        "Freedom to make life choices": freedom,
        "Trust (Government Corruption)": trust,
        "Generosity": generosity
    };
}

function addCountryData(y, f, s) {
    return {
        Year: y,
        Factor: f,
        Score: s
    };
}



function drawGraph() {
    d3.selectAll(".guide_circle").remove();
    if (selectedCountry === window.selectedCountry) {return;}
    clearChart(qs("#factor_graph"));
    var allData = [];
    selectedCountry = window.selectedCountry;
    //console.log("draw graph", selectedCountry);
    line_svg = d3.select('#factor_graph').append('svg')
    .attr("id", "line-chart")
    .attr("width", w + margin.left + margin.right+130)
    .attr("height", h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    line_svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .attr("class","myXaxis");
    line_svg.append("g")
    .attr("class","myYaxis");
    //console.log("drawGraph window.selectedCountry", window.selectedCountry);
    //console.log("readFactorGraphData");
    Promise.all([csv(factorGraphData)]).then(function(data) {
        data[0].forEach(function(d) {
            //console.log("readFactorGraphData", d);
            allData.push(addData(d.Country, parseInt(d.Year), parseFloat(d["Economy (GDP per Capita)"]), parseFloat(d["Family or social support"]), parseFloat(d["Health (Life Expectancy)"]),
            parseFloat(d["Freedom to make life choices"]), parseFloat(d["Trust (Government Corruption)"]), parseFloat(d["Generosity"])));
        })
        x.domain(d3.extent(allData, function(d){return d.Year;}));
    line_svg.selectAll(".myXaxis").call(d3.axisBottom().scale(x).ticks(4));
    y.domain([0, 2.0]);
    line_svg.selectAll(".myYaxis")
    //   .transition()
    //   .duration(1000)
      .call(yAxis)

    //title
    line_svg.append("text").attr("class", "factor_title")
    .text(selectedCountry + " Factor Score by Years")
    .attr("fill","black")
    .attr("x", (w / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "13px")

    //console.log("allDataddddd", allData);
    //console.log("aaaa", [allData[0]]);
    var currentCountry = allData.filter(function(e) {return e.Country === selectedCountry;});
    //console.log("currentCountry", currentCountry);
    var current = [];
    currentCountry.forEach(function(d) {
        factors.forEach(function(f) {
            current.push(addCountryData(d.Year, f, d[f]));
        })
    })
    //console.log("current", current);
    fc_circle = line_svg.append("circle").style("r", 3)
                .attr("fill", "grey").attr("class", "guide_circle");
    factors.forEach(function(d) {
        var currentFactor = current.filter(function(e) {return e.Factor === d})
        //console.log("currentFactor", currentFactor);
        var line = d3.line()
        .x(function(d){return x(d["Year"]);})
        .y(function(d){return y(d["Score"]);});
        //console.log("selectedCountry", selectedCountry);

        var test = line_svg.append("path")
            .datum(currentFactor)
            .attr("class", "lines")
            .attr('d', line)
            .style("stroke-width", 3)
            .style("fill", "none")
            .attr("stroke", myColor.find(el => el.Factor === d)["Color"])
            .attr("stroke-linejoin", "round")
            .attr("opacity", 0.7)
            .attr("stroke-linecap", "round")
            .on('mouseover', function (d, i) {
                //console.log("mouseover");
                //console.log(d3.mouse(this));
                var xPos = d3.mouse(this)[0];

                var index = parseInt(xPos / (w / 4)+0.5);
                var yr = d[index]["Year"];
                var f = d[index]["Factor"];
                var s = d[index]["Score"];
                //console.log("Year: " + y + " Factor: " + f + " Score: " + s);
                line_svg.selectAll(".lines").transition().duration(50).attr("opacity","0.2");

                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.85');
                line_svg.append('text')
                    .attr("id", "factor_score")
                    .text("Year: " + yr + " Factor: " + f + " Score: " + Math.round(s*100)/100)
                    .attr("fill","black")
                    .attr("x", (w / 2))
                         .attr("y", -20)
                         .attr("text-anchor", "middle")
                         .style("font-size", "10px")
                fc_circle
                        .style("opacity", 0.8)
                        .attr("cx", x(yr))
                        .attr("cy", y(s))
                        .attr("fill", myColor.find(el => el.Factor === f)["Color"]);
                })

            .on('mouseout', function (d, i) {
                //console.log("mouseout");
                id("factor_score").parentNode.removeChild(id("factor_score"));
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                line_svg.selectAll(".lines").transition().duration(100).attr("opacity","0.85")
                fc_circle
                .style("opacity", 0);
            });

        const pathLength = test.node().getTotalLength();
        // D3 provides lots of transition options, have a play around here:
        // https://github.com/d3/d3-transition
        const transitionPath = d3
            .transition()
            .ease(d3.easeSin)
            .duration(900);

        test
        .attr("stroke-dashoffset", pathLength)
        .attr("stroke-dasharray", pathLength)
        .transition(transitionPath)
        .attr("stroke-dashoffset", 0);
    })

    for (let i = 0; i < factors.length; i++) {
        line_svg.append("rect").attr("class","legends").attr("x",w+7).attr("y",-60+20*i).attr("width", 10).attr("height", 10).style("fill", myColor.find(el => el.Factor === factors[i])["Color"]);
        line_svg.append("text").attr("class","legends").attr("x", w+20).attr("y", -55+20*i).text(factors[i]).style("font-size", "12px").attr("alignment-baseline","middle")
    }
    })
    .catch(function(e){e=>alert(e);});
}
/** ------------------------------ Helper Functions ------------------------------ */
/**
* Note: You may use these in your code, but remember that your code should not have
* unused functions. Remove this comment in your own code.
*/
/**
* Returns the element that has the ID attribute with the specified value.
* @param {string} idName - element ID
* @returns {object} DOM object associated with id.
*/
function id(idName) {
    return document.getElementById(idName);
}

function clearChart(node) {
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
}

/**
* Returns the first element that matches the given CSS selector.
* @param {string} selector - CSS query selector.
* @returns {object} The first DOM object matching the query.
*/
function qs(selector) {
    return document.querySelector(selector);
}
})();
