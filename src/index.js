const d3 = require('d3');
import onlyCountryData from '../static/country_no_duplicate.csv'
import allInfoCountry from '../static/2015_2019_no_duplicate.csv'
"use strict";

(function() {
// MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE
/**
* Add a function that will be called when the window is loaded.
*/
window.addEventListener("load", init);
window.addEventListener('scroll', handleStickyVisibility);
window.myColor = [];
var focusline;
var focus;
var bisect;
var selectedCountryList2;
window.selectedCountryList = [];
window.selectedFactorList = [];
var allAboutCountry = [];
var allAboutCountry_2015 = [];
var allAboutCountry_2016 = [];
var allAboutCountry_2017 = [];
var allAboutCountry_2018 = [];
var allAboutCountry_2019 = [];
var HappinessScore = [];
var national_stat = [];
var line_svg;
var rectForPointer;
var margin = { top: 50, right: 35, bottom: 50, left: 90 },
w = 530 - (margin.left + margin.right),
h = 500 - (margin.top + margin.bottom);
var y = d3.scaleLinear()
.range([h, 0]);
var x = d3.scaleLinear()
.range([ 0, w]);


var yAxis = d3.axisLeft().scale(y).ticks(10);
var xAxis = d3.axisBottom().scale(x).ticks(4);

/**
* CHANGE: Describe what your init function does here.
*/


function init() {
// THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS
  var country_list = [];
  Promise
  .all([d3.csv(onlyCountryData), d3.csv(allInfoCountry)])
    .then(function(data) {
    data[0].forEach(function(d){
      country_list.push(d.Country);
    })
    var temp2015 = 0;
    var temp2016 = 0;
    var temp2017 = 0;
    var temp2018 = 0;
    var temp2019 = 0;
    /*d3.csv(allInfoCountry).then(function(data2) {*/
    data[1].forEach(function(d){
      allAboutCountry.push(d);
      if (d.Year == 2015) {
        allAboutCountry_2015.push(d);
        temp2015 += parseFloat(d["Happiness Score"]);
      } else if (d.Year == 2016) {
        allAboutCountry_2016.push(d);
        temp2016 += parseFloat(d["Happiness Score"]);
      } else if (d.Year == 2017) {
        temp2017 += parseFloat(d["Happiness Score"]);
        allAboutCountry_2017.push(d);
      } else if (d.Year == 2018) {
        allAboutCountry_2018.push(d);
        temp2018 += parseFloat(d["Happiness Score"]);
      } else if (d.Year == 2019) {
        allAboutCountry_2019.push(d);
        temp2019 += parseFloat(d["Happiness Score"]);
      }
    })
   country_list.forEach(function(d) {
      window.myColor.push(colorMap(d,true));
   });

   window.myColor.push(colorMap("Global Average", false));
    national_stat.push(adddata("Global Average", temp2015 / 143, 2015));
    national_stat.push(adddata("Global Average", temp2016 / 143, 2016));
    national_stat.push(adddata("Global Average", temp2017/ 143, 2017));
    national_stat.push(adddata("Global Average", temp2018/143, 2018));
    national_stat.push(adddata("Global Average", temp2019/143, 2019));

    line_svg = d3.select('#years_chart').append('svg')
    .attr("id", "line-chart")
    .attr("width", w + margin.left + margin.right+170)
    .attr("height", h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    line_svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .attr("class","myXaxis");
    line_svg.append("g")
    .attr("class","myYaxis")
    .attr("transform", "translate(" + -12 + ",  0 )");
    drawYearsPlotChart(line_svg);
    drawList();
  })
  .catch(err=> alert(err));

  id("sticky_record").style.visibility = "hidden";
  autocomplete(document.getElementById("myInput"), country_list);
  id("submit_btn").addEventListener('click', handleCountrySubmit);
  id("submit_btn").disabled = true;
}


function adddata(n, d, y) {
  return {
    Country: n,
    Year: y,
    "Happiness Score": d
  };
}


function handleFactorSelect() {
  if (!window.selectedFactorList.includes(document.getElementById("factor_select").value)
  && window.selectedFactorList.length < 3){
    qs("#show_fact h4").textContent = "Your Factor to Happiness:";
    window.selectedFactorList.push(document.getElementById("factor_select").value);
    var factor_item = gen('div');
    var factor_name = gen('p');
    factor_name.textContent = document.getElementById("factor_select").value;
    var delete_btn = gen('button');
    delete_btn.id = "delete_btn";
    delete_btn.classList.add("delete_btn");
    delete_btn.classList.add("add_delete_btn");
    delete_btn.textContent = "-";
    factor_item.appendChild(factor_name);
    factor_item.appendChild(delete_btn);
    delete_btn.addEventListener('click', removeFactorElement);
    id("selected_factor_list").appendChild(factor_item);
  }
}
function colorMap(c, boo) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    if (boo) {
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } else {
    color = "rgba(0, 0, 0, 0.3)";
  }
  return {
    Country: c,
    Color: color
  }
}

function removeFactorElement() {
  console.log(this.parentNode.parentNode.childNodes);
  if (this.parentNode.parentNode.childNodes.length === 2) {
    qs("#show_fact h4").textContent = "(Please Select Factor to Happiness)";
  }
  var firstChildValue = this.parentNode.firstElementChild.textContent;
  const index = selectedFactorList.indexOf(firstChildValue);
  if (index > -1) {
    selectedFactorList.splice(index, 1);
  }
  this.parentNode.parentNode.removeChild(this.parentNode);
}

function handleCountrySubmit() {
  if (!window.selectedCountryList.includes(document.getElementById("myInput").value)
    && window.selectedCountryList.length <= 5) {
    qs("#show_country h4").textContent = "Your Countries:";
    window.selectedCountryList.push(document.getElementById("myInput").value);
    var country_item = gen('div');
    var country_name = gen('p');
    country_name.textContent = document.getElementById("myInput").value;
    var delete_btn = gen('button');
    delete_btn.classList.add("delete_btn");
    delete_btn.classList.add("add_delete_btn");
    delete_btn.textContent = "-";
    country_item.appendChild(country_name);
    country_item.appendChild(delete_btn);
    delete_btn.addEventListener('click', removeCountryElement);
    id("selected_country_list").appendChild(country_item);
    id("submit_btn").disabled = true;
    document.getElementById("myInput").value = "";
    d3.select("#line-chart").selectAll(".lines").remove();
    d3.select("#line-chart").selectAll(".legends").remove();
    d3.select("#line-chart").selectAll(".rect_pointer").remove();
    drawYearsPlotChart(line_svg);
  }
}

function DrawFocus() {
    bisect = d3.bisector(function(d) { return d.Year; }).left;
    line_svg.selectAll(".focus_line").remove();
    line_svg.selectAll(".focus_text").remove();
    line_svg.selectAll(".focus_circle").remove();
    line_svg.selectAll(".tooltips").remove();
    var tooltip_point = line_svg.append("circle").attr("class", "tooltips").attr("id", "tooltip_point").attr("fill", "white").attr("opacity", 0).attr("stroke", "grey").attr("r", 3).attr("stroke-width", 2);
    var tooltip = line_svg.append("text").attr("class", "tooltips").attr("id","tooltip").style("font-size", "12px").attr("fill", "grey").attr("stroke", "white").attr("stroke-width", 0.05).attr("font-weight", "bold")
    .style('display', 'none')
		.attr("text-anchor", "middle")
    .attr("dy", "0.35em");

    var tooltip_for_rank = line_svg.append("text").attr("class", "tooltips").attr("id","tooltipR").style("font-size", "12px").attr("fill", "grey").attr("stroke", "white").attr("stroke-width", 0.05).attr("font-weight", "bold")
    // line_svg.append("div").attr("class", "tooltips").attr("id","tooltip")
    // .attr("opacity", 1)
    // .attr("background-color", "blue")
    // .attr("border", "solid")
    // .attr("border-width", "2px")
    // .attr("border-radius", "5px")
    // .attr("padding", "10px")

		.style('display', 'none')
		.attr("text-anchor", "middle")
    .attr("dy", "0.35em");

    focusline = line_svg.append("line")
    .attr("class", "focus_line")
    .attr("x1", w)
    .attr("x2", w)
    .attr("y1", -20)
    .attr("y2", h)
    .attr("opacity", 0)
    .attr("stroke-width", 2)
    .attr("stroke", "pink")
    .attr("stroke-dasharray", "8,2")
    .style("pointer-events", "none")
    for (var i = 0; i < selectedCountryList2.length; i++) {
      var ftext =line_svg.append("text")
        .attr("class", "focus_text")
        .attr("fill", window.myColor.find(el => el.Country === selectedCountryList2[i])["Color"])
        .attr("id", "focustext"+i)
        .attr("font-size", 13 + "px")
        .attr("x", w+5)
        .attr("y", y(HappinessScore[(i+1)*5-1]["Happiness Score"]))
        .attr("fill-opacity", 0)
        .text(Math.round(HappinessScore[(i+1)*5-1]["Happiness Score"]*100)/100)
    }
    rectForPointer = line_svg
.append('rect')
.attr("class", "rect_pointer")
.style("fill", "none")
.style("pointer-events", "all");

    for (var i = 0; i < selectedCountryList2.length; i++) {
        line_svg.append("circle")
        .attr("class", "focus_circle")
        .attr("id","focuscircle"+i)
        // .attr("border-style", "solid")
        // .attr("border-width", "3px")
        // .attr("border-color", myColor.find(el => el.Country === selectedCountryList2[i])["Color"])
        .attr("fill", window.myColor.find(el => el.Country === selectedCountryList2[i])["Color"])
        .attr("cx", w)
        .attr("cy", y(HappinessScore[(i+1)*5-1]["Happiness Score"]))
        .attr("opacity", 0)
        .attr("r", 3)
        .style("pointer-events", "all")
        .on("mouseover", function(d, i) {
          line_svg.selectAll(".lines").transition().duration(200).attr("opacity", 0.15);
          var x0 = x.invert(d3.mouse(this)[0]);
          var m = bisect(HappinessScore, x0, 1);
          var d0 = HappinessScore[m]
          var d1 = HappinessScore[m-1];
          var selectedData;
          if (typeof d0 != 'undefined' && typeof d1 != 'undefined') {
                selectedData = x0 - d0.Year < d1.Year - x0 ? d1: d0;
          } else {
                selectedData = d1;
          }
          tooltip_point.attr("cx", this.cx.baseVal.value)
                 .attr("cy", this.cy.baseVal.value)
                 .attr("opacity", 1)
          var currID = this.getAttribute("id");
          currID = parseInt(currID.substr(11));
          line_svg.selectAll("#line"+currID).transition().duration(100).attr("opacity", 0.7);
          tooltip.attr('x', this.cx.baseVal.value +10)
          .attr('y', this.cy.baseVal.value - 30)
          .transition()
          .style('display', 'block')
          .text(selectedCountryList2[currID]+ ": " + Math.round(HappinessScore[(currID+1)*5-1+(selectedData.Year-2019)]["Happiness Score"]*100)/100)
          var happyRank;
          if (currID == 0) {
            happyRank = "N/A";
          } else if (selectedData.Year == 2015) {
            happyRank = (allAboutCountry_2015.find(d => d.Country === selectedCountryList2[currID]))["Happiness Rank"];
          } else if (selectedData.Year == 2016) {
            happyRank = (allAboutCountry_2016.find(d => d.Country === selectedCountryList2[currID]))["Happiness Rank"];
          } else if (selectedData.Year == 2017) {
            happyRank = (allAboutCountry_2017.find(d => d.Country === selectedCountryList2[currID]))["Happiness Rank"];
          } else if (selectedData.Year == 2018) {
            happyRank = (allAboutCountry_2018.find(d => d.Country === selectedCountryList2[currID]))["Happiness Rank"];
          } else if (selectedData.Year == 2019) {
            happyRank = (allAboutCountry_2019.find(d => d.Country === selectedCountryList2[currID]))["Happiness Rank"];
          }

          tooltip_for_rank.attr('x', this.cx.baseVal.value + 10)
          .attr('y', this.cy.baseVal.value - 15)
          .transition()
          .style('display', 'block')
          .text("World Rank: " + happyRank);

          // tooltip
          // .html(selectedCountryList2[currID]+ ":" + Math.round(HappinessScore[(currID+1)*5-1+(selectedData.Year-2019)]["Happiness Score"]*100)/100)
          // .attr("opacity", 1)
          // .attr("left", this.cx.baseVal.value) // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          // .attr("top", this.cy.baseVal.value)
          // // }
         })
         .on("mouseout", function(d){
          tooltip_point.attr("opacity", 0);
          tooltip.transition().style('display', 'none').text("");
          tooltip_for_rank.transition().style('display', 'none').text("");
          //tooltip.attr("opacity", 0);
          line_svg.selectAll(".lines").transition().duration(200).attr("opacity", 0.8);
         })
    }

    rectForPointer.attr('width', w)
    .attr('height', h)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
}

function mouseover() {
  focusline
  .transition("fadeFocus")
  .duration(400)
  .attr("opacity", 1)

  for (var count = 0; count < selectedCountryList2.length; count++) {
      line_svg.selectAll("#focustext"+count)
      .transition("fadeFocus")
      .duration(700)
      .attr("fill-opacity", 1)

      line_svg.selectAll("#focuscircle"+count)
      .transition("fadeFocus")
      .duration(700)
      .attr("opacity", 1)
  }
}

function mousemove() {
  // recover coordinate we need
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisect(HappinessScore, x0, 1);
  var d0 = HappinessScore[i]
  var d1 = HappinessScore[i-1];
  var selectedData;
  if (typeof d0 != 'undefined' && typeof d1 != 'undefined') {
        selectedData = x0 - d0.Year < d1.Year - x0 ? d1: d0;
        line_svg.selectAll(".focus_line")
        .transition()
        .duration(700)
        .attr("x1", x(selectedData.Year))
        .attr("x2", x(selectedData.Year))


        for (var count = 0; count < selectedCountryList2.length; count++) {
          line_svg.selectAll("#focustext"+count)
          .transition()
          .duration(700)
          .attr("x", x(selectedData.Year)+5)
          .attr("y", y(HappinessScore[(count+1)*5-1+(selectedData.Year-2019)]["Happiness Score"])-7)
          .text(Math.round(HappinessScore[(count+1)*5-1+(selectedData.Year-2019)]["Happiness Score"]*100)/100)


          line_svg.selectAll("#focuscircle"+count)
          .transition()
          .duration(700)
          .attr("cx", x(selectedData.Year))
          .attr("cy", y(HappinessScore[(count+1)*5-1+(selectedData.Year-2019)]["Happiness Score"]))
        }
  }
  }
function mouseout() {
  focusline
          .transition()
          .duration(400)
          .attr("opacity", 0)

          for (var count = 0; count < selectedCountryList2.length; count++) {
            line_svg.selectAll("#focustext"+count)
            .transition("fadeFocus")
            .duration(700)
            .attr("fill-opacity", 0)

            line_svg.selectAll("#focuscircle"+count)
            .transition("fadeFocus")
            .duration(700)
            .attr("opacity", 0)
          }
}
function drawList() {
  var table_svg = d3.select("#table").append("svg")
      .attr("height", 1)
      .attr("width", 1)

  var table = d3.select("#table")
      .append("table")
      .attr("id", "rank-table")
      .attr("class", "table table-condensed table-striped");
  var  thead = table.append("thead");
  var  tbody = table.append("tbody");
var headUse = ["Rank","Country/Region","Happiness Score"];
thead.append("tr")
thead.select("tr")
                .append("th")
                .text("Rank");
                thead.select("tr")
                .append("th")
                .text("Country/Region")
                .style("text-align", "center");
thead.select("tr")
.append("th")
.text("Happiness Score");

for (var num = 0; num < 15; num++) {
  var temp = tbody.append("tr")
        temp.append("td")
             .text(num+1)
             .style("text-align", "center")
             .property("value");
       temp.append("td")
            .style("text-align", "center")
            .text(allAboutCountry_2019[num].Country);
        temp.append("td")
            .style("text-align", "center")
            .text(allAboutCountry_2019[num]["Happiness Score"]);
}
d3.selectAll("tr").style("color", "#883658").style("text-stoke", "2px");
tbody.selectAll("tr")
      .on("click", function(d) {
          var row = parseInt(d3.select(this).select("td").node().textContent);
          if (window.selectedCountryList.length <=5 && !window.selectedCountryList.includes(allAboutCountry_2019[row-1].Country)) {
            qs("#show_country h4").textContent = "Your Countries:";
            var countryA = allAboutCountry_2019[row-1].Country;
            window.selectedCountryList.push(countryA);
            var country_item = gen('div');
            var country_name = gen('p');
            country_name.textContent = countryA;
            var delete_btn = gen('button');
            delete_btn.classList.add("delete_btn");
            delete_btn.classList.add("add_delete_btn");
            delete_btn.textContent = "-";
            country_item.appendChild(country_name);
            country_item.appendChild(delete_btn);
            delete_btn.addEventListener('click', removeCountryElement);
            id("selected_country_list").appendChild(country_item);
            id("submit_btn").disabled = true;
            document.getElementById("myInput").value = "";
            d3.select("#line-chart").selectAll(".lines").remove();
            d3.select("#line-chart").selectAll(".legends").remove();
            drawYearsPlotChart(line_svg);
          }
      })
      .on("mouseover", function(d){
        d3.select(this)
          .style("background-color", "pink")
          .style("opacity", "0.8")
          .style("color", "#f5fbff")
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .style("background-color", "transparent")
        .style("color", "#883658")
        .style("opacity", "1");
      })
      // .on("click",function(d){
      //     if (selectedCountryList.length<5 && selectedCountryList())


      // })

console.log(headUse);
}

function drawYearsPlotChart(line_svg) {
  // initial Global average graph
  // if (selectedCountryList.length == 0) {
  //     x.domain(d3.extent(national_stat, function(d){return d.Year;}));
  //     line_svg.selectAll(".myXaxis").call(xAxis);
  //     y.domain([d3.min(national_stat, function(d) { return +d["Happiness Score"] - 0.4; }), d3.max(national_stat, function(d) { return +d["Happiness Score"] + 0.2; })]);
  //     line_svg.selectAll(".myYaxis").transition()
  //       .duration(1000)
  //       .call(yAxis);
  //       var average_line = d3.line()
  //       .x(function(d){return x(d["Year"]);})
  //       .y(function(d){return y(d["Happiness Score"]);});
  //       line_svg.append("path")
  //       .datum(national_stat)
  //       .attr("class", "lines")
  //       .attr('d', average_line)
  //       .style("stroke-width", 4)
  //       .style("fill", "none")
  //       .attr("stroke", "black");
  // } else {
  // for country you selected!

  HappinessScore = [];
  selectedCountryList2 = ["Global Average"];
  for (var i = 0; i < national_stat.length; i++) {
    HappinessScore.push(national_stat[i]);
  }
   window.selectedCountryList.forEach(function (d) {
      selectedCountryList2.push(d);
      let temp2015 = allAboutCountry_2015.find(el => el.Country === d);
      let temp2016 = allAboutCountry_2016.find(el => el.Country === d);
      let temp2017 = allAboutCountry_2017.find(el => el.Country === d);
      let temp2018 = allAboutCountry_2018.find(el => el.Country === d);
      let temp2019 = allAboutCountry_2019.find(el => el.Country === d);
      HappinessScore.push(adddata(d, parseFloat(temp2015["Happiness Score"]), 2015));
      HappinessScore.push(adddata(d, parseFloat(temp2016["Happiness Score"]), 2016));
      HappinessScore.push(adddata(d, parseFloat(temp2017["Happiness Score"]), 2017));
      HappinessScore.push(adddata(d, parseFloat(temp2018["Happiness Score"]), 2018));
      HappinessScore.push(adddata(d, parseFloat(temp2019["Happiness Score"]), 2019));
   });
  x.domain(d3.extent(HappinessScore, function(d){return d.Year;}));

  line_svg.selectAll(".myXaxis").call(xAxis);

  y.domain([d3.min(HappinessScore, function(d) { return +d["Happiness Score"] - 0.4; }), d3.max(HappinessScore, function(d) { return +d["Happiness Score"] + 0.2; })]);

  line_svg.selectAll(".myYaxis")
    .transition()
    .duration(1000)
    .call(yAxis);
    line_svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("x", -h+170)
    .attr("font-size", 12 + "px")
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Happiness Score (out of 10)")
    .attr("fill", "rgb(83, 69, 69)");
    var newTemp = 0;
selectedCountryList2.forEach(function(d) {
    var currentCountry = HappinessScore.filter(function(e) {return e.Country === d;});
    var line = d3.line()
    .x(function(d){return x(d["Year"]);})
    .y(function(d){return y(d["Happiness Score"]);});

    var path = line_svg.append("path")
      .datum(currentCountry)
      .attr("class", "lines")
      .attr("id", function(d) {
        return "line" + newTemp;
      })
      .attr('d', line)
      .style("stroke-width", 2.5)
      .style("fill", "none")
      .attr("stroke", window.myColor.find(el => el.Country === d)["Color"])
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0.8)
      .attr("stroke-linecap", "round");
  newTemp++;
  const pathLength = path.node().getTotalLength();
  // D3 provides lots of transition options, have a play around here:
  // https://github.com/d3/d3-transition
  const transitionPath = d3
  .transition()
  .ease(d3.easeSin)
  .duration(1000);

  path
  .attr("stroke-dashoffset", pathLength)
  .attr("stroke-dasharray", pathLength)
  .transition(transitionPath)
  .attr("stroke-dashoffset", 0);
  });


for (let i = 0; i < selectedCountryList2.length; i++) {
  line_svg.append("rect").attr("class","legends").attr("x",w+50).attr("y",30+25*i).attr("width", 10).attr("height", 10).style("fill", window.myColor.find(el => el.Country === selectedCountryList2[i])["Color"]);
  line_svg.append("text").attr("class","legends").attr("x", w+70).attr("y", 36+25*i).text(selectedCountryList2[i]).style("font-size", "12px").attr("alignment-baseline","middle").attr("fill","grey");
}

DrawFocus();
}

function removeCountryElement() {
  if (this.parentNode.parentNode.childNodes.length === 2) {
    qs("#show_country h4").textContent = "(Please Select Countries)";
  }
  this.parentNode.parentNode.removeChild(this.parentNode);
  var firstChildValue = this.parentNode.firstElementChild.textContent;
  const index = window.selectedCountryList.indexOf(firstChildValue);
  if (index > -1) {
    window.selectedCountryList.splice(index, 1);
  }
  d3.select("#line-chart").selectAll(".lines").remove();
  d3.select("#line-chart").selectAll(".legends").remove();
  d3.select("#line-chart").selectAll(".rect_pointer").remove();
  drawYearsPlotChart(line_svg);
}

function handleStickyVisibility() {
  if (window.pageYOffset < 1400) {
    id("sticky_record").style.visibility = "hidden";
  } else {
    id("sticky_record").style.visibility = "visible";
  }
}



function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*active button*/
              id("submit_btn").disabled = false;
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 8) {
        id("submit_btn").disabled = true;
      }
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}



/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
//



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
/**
* Returns the first element that matches the given CSS selector.
* @param {string} selector - CSS query selector.
* @returns {object} The first DOM object matching the query.
*/
function qs(selector) {
return document.querySelector(selector);
}
/**
* Returns the array of elements that match the given CSS selector.
* @param {string} selector - CSS query selector
* @returns {object[]} array of DOM objects matching the query.
*/
function qsa(selector) {
return document.querySelectorAll(selector);
}
/**
* Returns a new element with the given tag name.
* @param {string} tagName - HTML tag name for new DOM element.
* @returns {object} New DOM object for given HTML tag.
*/
function gen(tagName) {
return document.createElement(tagName);
}
})();
