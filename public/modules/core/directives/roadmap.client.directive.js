'use strict';

angular.module('core').directive('roadmap', ['d3', '_', '$parse',
    function(d3, _, $parse) {
        return {
            restrict: 'EA',
            // scope:{
            //     data : '=data',
            //     selectProject : '=selectProject'
            // },
            link: function(scope, element, attrs){

                var parseData = $parse(attrs.data);
                var parseSelectProject = $parse(attrs.selectProject);

                var selectProject = parseSelectProject(scope);
                var data = parseData(scope);

                var margin = {top: 20, right: 20, left: 20},
                    width = 960 - margin.left - margin.right,
                    barHeight = 20;

                var x, xAxis, setChartParameters,
                    onMouseover, onMouseout, onClick,
                    svg,
                    drawChart, redrawChart;

                scope.$watchCollection(parseData, function(newVal, oldVal){
                    data = newVal;
                    redrawChart();

                    console.log(newVal);
                });

                setChartParameters = function(){

                    x = d3.time.scale()
                        .domain([d3.min(data, function(d){return d.start;}), d3.max(data, function(d){return d.end;}) ])
                        .range([0, width-(margin.left + margin.right)]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('top');

                };

                onMouseover = function(that, d){
                    d3.select(that).style('cursor', 'pointer');
                };

                onMouseout = function(that, d){
                    d3.select(that).style('cursor', 'auto');
                };

                onClick = function(that, d){
                    selectProject(d);
                };

                svg = d3.select(element[0]).append('svg');

                drawChart = function(){

                    setChartParameters();

                    var chart = svg
                        .attr('class', 'chart')
                        .attr('width', width)
                        .attr('height', (barHeight * data.length) + 2 * margin.top)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    chart.append('g')
                        .attr('class', 'x axis')
                        .call(xAxis)
                        .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');


                    var bar = chart.selectAll('.bar')
                        .data(data)
                        .enter().append('g')
                        .attr('class', 'bar')
                        .attr('transform', function(d, i) { return 'translate('+ (x(d.start) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });


                    bar.append('rect')
                        .attr('width', function(d){ return x(d.end) - x(d.start);})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    bar.append('text')
                        .attr('x', function(d) { return (x(d.end) - x(d.start))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    // Tooltip
                    bar.append('title')
                        .text(function(d){ return d.name; });

                };

                redrawChart = function(){
                    // TO-DO
                };

                drawChart();

            }
        };
    }
]);
