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
                    width = 710 - margin.left - margin.right,
                    barHeight = 20;

                var x, xAxis, setChartParameters,
                    onMouseover, onMouseout, onClick,
                    drawChart, redrawChart;

                scope.$watchCollection(parseData, function(newVal, oldVal){
                    data = newVal;
                    redrawChart();
                });

                setChartParameters = function(){

                    var minDefinition = d3.min(data, function(d){if(d.identification.reqStartDate){return new Date(d.identification.reqStartDate);}});
                    var maxDefinition = d3.max(data, function(d){if(d.identification.reqEndDate){return new Date(d.identification.reqEndDate);}});

                    var minDelivery = d3.min(data, function(d){if(d.gateData.start){return new Date(d.gateData.start);}});
                    var maxDelivery = d3.max(data, function(d){if(d.gateData.end){return new Date(d.gateData.end);}});

                    var minAbsolute = d3.min([minDefinition, minDelivery], function(d){if(d){return d;}});
                    var maxAbsolute = d3.max([maxDefinition, maxDelivery], function(d){if(d){return d;}});

                    x = d3.time.scale()
                        .domain([minAbsolute, maxAbsolute])
                        .range([0, width-(1.5*margin.left + 1.5*margin.right)]);

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

                d3.select(element[0]).append('svg');

                drawChart = function(){

                    setChartParameters();

                    var chart = d3.select('svg')
                        .attr('width', width)
                        .attr('height', (2 * barHeight * data.length) + 2 * margin.top)
                        .append('g')
                        .attr('id', 'chart')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    chart.append('g')
                        .attr('class', 'x axis')
                        .call(xAxis)
                        .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');

                    var bar = chart.selectAll('.bar')
                        .data(data, function(d){
                            return d._id;
                        })
                        .enter().append('g')
                        .attr('class', 'bar')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * 2 * barHeight) + margin.top) + ')'; });

                    bar.append('rect')
                        .attr('class', 'rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    bar.append('rect')
                        .attr('class', 'rectDelivery')
                        .attr('y', barHeight-1)
                        .attr('fill', function(d){ return d.gateData.status; })
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    bar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                };

                redrawChart = function(){

                    setChartParameters();

                    var svg = d3.select('svg')
                        .attr('height', (2 * barHeight * data.length) + 2 * margin.top);

                    var chart = svg.select('#chart');

                    chart.select('.x.axis')
                        .call(xAxis);

                    // Bind the new data

                    var newBars = chart.selectAll('.bar')
                        .data(data, function(d){
                            return d._id;
                        });

                    // Redraw the ones not changed

                    newBars
                        .transition().duration(1000)
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * 2 * barHeight) + margin.top) + ')'; });

                    newBars.selectAll('.rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));});

                    newBars.selectAll('.rectDelivery')
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));});

                    newBars.selectAll('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; });


                    // Draw the ones added

                    var newAppendedBar = newBars.enter().append('g')
                        .attr('class', 'bar')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * 2 * barHeight) + margin.top) + ')'; });

                    newAppendedBar.append('rect')
                        .attr('class', 'rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); })
                        .append('title')
                            .text(function(d){ return d.identification.name +' - '+'Start: '+d3.time.format('%b %a %e, %Y')(new Date(d.identification.reqStartDate))+' - '+'End: '+d3.time.format('%b %a %e, %Y')(new Date(d.identification.reqEndDate)); });

                    newAppendedBar.append('rect')
                        .attr('class', 'rectDelivery')
                        .attr('y', barHeight-1)
                        .attr('fill', function(d){ return d.gateData.status; })
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); })
                        .append('title')
                            .text(function(d){ return d.identification.name +' - '+'Start: '+d3.time.format('%b %a %e, %Y')(new Date(d.gateData.start))+' - '+'End: '+d3.time.format('%b %a %e, %Y')(new Date(d.gateData.end)); });

                    newAppendedBar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });




                    // Remove the ones removed

                    var newRemovedBar = newBars.exit().remove();

                };

                drawChart();

            }
        };
    }
]);
