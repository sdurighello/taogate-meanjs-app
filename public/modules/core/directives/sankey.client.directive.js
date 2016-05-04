'use strict';

angular.module('core').directive('sankey', ['d3', '_',
    function(d3, _) {
        return {
            restrict: 'EA',
            scope:{
                data : '=data',
                selectNode : '=selectNode',
                selectLink : '=selectLink',
                width : '=width',
                height : '=height'
            },
            link: function(scope, element){

                var setParameters, intensityRamp,
                    drawGraph, redrawGraph;

                var width = scope.width,
                    height = scope.height,
                    inputData = scope.data;

                var color = d3.scale.category20();

                var sankey = d3.sankey()
                    .size([width, height])
                    .nodeWidth(20)
                    .nodePadding(200);

                var gWidthOffset = 20;
                var gHeightOffset = 20;

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', width + gWidthOffset)
                    .attr('height', height + gHeightOffset);

                var sankeyG = svg.append('g')
                    .attr('transform', 'translate('+ gWidthOffset +','+ gHeightOffset +')')
                    .attr('id', 'sankeyG');

                var onMouseoverLink, onMouseoverNode,
                    onMouseoutLink, onMouseoutNode,
                    onClickLink, onClickNode;

                var allowNullImpact = function(impact){
                    if(impact && impact.numericalValue && (impact.numericalValue > 0)){
                        return impact.numericalValue;
                    }
                    return 1;
                };

                var getNodeColorGroup = function(d){
                    return 1;
                };

                // LINK interactivity functions

                onMouseoverLink = function(that, d, i){
                    d3.select(that).style('stroke-opacity', 0.8);
                };

                onMouseoutLink = function(that, d, i){
                    d3.selectAll('path.link').style('stroke-opacity', 0.5);
                };

                onClickLink = function(that, d, i){
                    scope.selectLink(d);
                };

                // NODE interactivity functions

                onMouseoverNode = function(that, d, i){

                };

                onMouseoutNode = function(that, d, i){

                };

                onClickNode = function(that, d, i){
                    scope.selectNode(d);
                };

                setParameters = function(){
                    intensityRamp = d3.scale.linear()
                        .domain([0, d3.max(inputData.links, function(d){
                            return d.value;
                        })])
                        .range(['black', 'red']);
                };

                // DRAW

                drawGraph = function(){

                    setParameters();

                    sankey
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .layout(200);

                    var link = sankeyG.selectAll('.link')
                        .data(inputData.links, function(d){return d._id;})
                        .enter().append('path')
                        .attr('class', 'link')
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke-opacity', 0.5)
                        .style('fill', 'none')
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var node = sankeyG.selectAll('.node')
                        .data(inputData.nodes, function(d){return d._id;})
                        .enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    node.append('rect')
                        .attr('height', function(d){ return d.dy; })
                        .attr('width', 20)
                        .style('fill', 'pink')
                        .style('stroke', 'gray');

                    node.append('text')
                        .attr('x', 0)
                        .attr('y', function(d){ return d.dy / 2; })
                        .attr('text-anchor', 'middle')
                        .text(function(d) { return d.identification.name; });

                };

                drawGraph();

                scope.$watchCollection(
                    function(){ return scope.data; },
                    function(newVal, oldVal){
                        if(newVal !== oldVal){
                            console.log(newVal);
                            inputData = newVal;
                            redrawGraph();
                        }
                    });

                redrawGraph = function(){

                    setParameters();

                    sankey
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .layout(32);

                    var newLinks = sankeyG.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; });

                    var newNodes = sankeyG.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; });

                    // Redraw the existing one

                    var existingNewLinks = newLinks
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var existingNewNodes = newNodes
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    existingNewNodes.selectAll('rect')
                        .attr('height', function(d){ return d.dy; });

                    existingNewNodes.selectAll('text')
                        .attr('y', function(d){ return d.dy / 2; })
                        .text(function(d) { return d.identification.name; });

                    // Draw the newly appended

                    var appendedNewLinks = newLinks.enter()
                        .append('path')
                        .attr('class', 'link')
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke-opacity', 0.5)
                        .style('fill', 'none')
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var appendedNewNodes = newNodes.enter()
                        .append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    appendedNewNodes.append('rect')
                        .attr('height', function(d){ return d.dy; })
                        .attr('width', 20)
                        .style('fill', 'pink')
                        .style('stroke', 'gray');

                    appendedNewNodes.append('text')
                        .attr('x', 0)
                        .attr('y', function(d){ return d.dy / 2; })
                        .attr('text-anchor', 'middle')
                        .text(function(d) { return d.identification.name; });

                    // Delete the exited

                    newLinks.exit()
                        .transition()
                        .duration(3000)
                        .style('opacity', 0)
                        .remove();

                    newNodes.exit()
                        .transition()
                        .duration(4000)
                        .style('opacity', 0)
                        .remove();


                };

            }
        };
    }
]);
