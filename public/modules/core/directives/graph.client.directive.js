'use strict';

angular.module('core').directive('graph', ['d3', '_',
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

                var drawGraph, redrawGraph;

                var width = scope.width,
                    height = scope.height,
                    inputData = scope.data;

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .charge(-200)
                    .linkDistance(100)
                    .size([width, height]);

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', width)
                    .attr('height', height);

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

                onMouseoverLink = function(that, d, i){
                    d3.select(that).style('stroke-width', Math.sqrt(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue)) * 5);
                };

                onMouseoutLink = function(that, d, i){
                    d3.select(that).style('stroke-width', Math.sqrt(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue)));
                };

                onClickLink = function(that, d, i){
                    scope.selectLink(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue));
                };

                onMouseoverNode = function(that, d, i){

                };

                onMouseoutNode = function(that, d, i){

                };

                onClickNode = function(that, d, i){
                    scope.selectNode(d.identification.name);
                    d.fixed = !d.fixed;
                };

                drawGraph = function(){
                    
                    force
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .start();

                    var link = svg.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; })
                        .enter().append('line')
                        .attr('class', 'link')
                        .style('stroke-width', function(d) { return Math.sqrt(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue)); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var node = svg.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; })
                        .enter().append('circle')
                        .attr('class', 'node')
                        .attr('r', function(d){
                            if(d.weight >= 5){
                                if(d.weight <= 20){
                                    return d.weight;
                                }
                                return 20;
                            }
                            return 5;
                        })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    node.append('title')
                        .text(function(d) { return d.identification.name; });

                    force.on('tick', function() {
                        link.attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });

                        node.attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });
                    });
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

                    force.stop();

                    force.links(inputData.links, function(d){return d._id;}).nodes(inputData.nodes, function(d){return d._id;});

                    var newLinks = svg.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; });

                    var newNodes = svg.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; });

                    // Redraw the existing one

                    var existingNewLinks = newLinks
                        .style('stroke-width', function(d) { return Math.sqrt(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue)); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var existingNewNodes = newNodes
                        .attr('r', function(d){
                            if(d.weight >= 5){
                                if(d.weight <= 20){
                                    return d.weight;
                                }
                                return 20;
                            }
                            return 5;
                        })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    existingNewNodes.append('title')
                        .text(function(d) { return d.identification.name; });

                    // Draw the newly appended

                    var appendedNewLinks = newLinks.enter()
                        .append('line')
                        .attr('class', 'link')
                        .style('stroke-width', function(d) { return Math.sqrt(allowNullImpact(d.dependency.impact && d.dependency.impact.numericalValue)); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var appendedNewNodes = newNodes.enter()
                        .append('circle')
                        .attr('class', 'node')
                        .attr('r', function(d){
                            if(d.weight >= 5){
                                if(d.weight <= 20){
                                    return d.weight;
                                }
                                return 20;
                            }
                            return 5;
                        })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    appendedNewNodes.append('title')
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

                    force.start();

                    force.on('tick', function() {
                        d3.selectAll('.link').attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });

                        d3.selectAll('.node').attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });
                    });

                };

            }
        };
	}
]);
