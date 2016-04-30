'use strict';

angular.module('core').directive('graph', ['d3', '_',
	function(d3, _) {
        var graphLink = function(scope, element){


            var width = scope.width,
                height = scope.height,
                inputData = scope.data;

            console.log(inputData);

            var color = d3.scale.category20();

            var force = d3.layout.force()
                .charge(-200)
                .linkDistance(100)
                .size([width, height]);

            var svg = d3.select(element[0]).append('svg')
                .attr('width', width)
                .attr('height', height);


            force
                .nodes(inputData.nodes)
                .links(inputData.links)
                .start();

            // After force.start() d3 adds more data to nodes and you can start using e.g. 'weight'
            var max = _.max(inputData.nodes, function(node){
                return node.weight;
            });
            var min = _.min(inputData.nodes, function(node){
                return node.weight;
            });
            console.log(max);
            console.log(min);
            // max/min = prop => if min is 5, then max is prop*5

            var link = svg.selectAll('.link')
                .data(inputData.links)
                .enter().append('line')
                .attr('class', 'link')
                .style('stroke-width', function(d) { return Math.sqrt(d.value); })
                .on('mouseover', function(d) {
                    d3.select(this).style('stroke-width', function(d) { return Math.sqrt(d.value) * 5; });
                })
                .on('mouseout', function(d) {
                    d3.select(this).style('stroke-width', function(d) { return Math.sqrt(d.value); });
                })
                .on('click', function(d,i){scope.selectLink(d.value);  });

            var node = svg.selectAll('.node')
                .data(inputData.nodes)
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
                .style('fill', function(d) { return color(d.group); })
                // .call(force.drag)
                .on('click', function(d,i){scope.selectNode(d.name);  });

            node.append('title')
                .text(function(d) { return d.name; });

            force.on('tick', function() {
                link.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                node.attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });
            });

            var marker = d3.select('svg').append('defs')
                .append('marker')
                .attr('id', 'Triangle')
                .attr('refX', 12)
                .attr('refY', 6)
                .attr('markerUnits', 'userSpaceOnUse')
                .attr('markerWidth', 12)
                .attr('markerHeight', 18)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M 0 0 12 6 0 12 3 6');

            d3.selectAll('line').attr('marker-end', 'url(#Triangle)');


        };

		return {
			// template: '<div></div>',
			restrict: 'EA',
			link: graphLink,
            scope:{
                data : '=data',
                selectNode : '=selectNode',
                selectLink : '=selectLink',
                width : '=width',
                height : '=height'
            }
		};
	}
]);
