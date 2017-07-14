import {Injectable} from '@angular/core';
import {Node, Link, ForceDirectedGraph} from './';
import * as d3 from 'd3';
import {NodeService} from "./models/node.service";

@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
   * while maintaining the d3 simulations physics
   */
 // @Output() nodeClicked: EventEmitter<Node> = new EventEmitter<Node>();

  constructor(
    private nodeService : NodeService
  ) {  }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      let transform = d3.event.transform;
      container.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    };

    zoom = d3.zoom().on("zoom", zoomed);
    svg.call(zoom);
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    let d3element = d3.select(element);

    function started() {
      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }
      d3element.select('.tooltip').style("opacity", 0);

      d3.event.on("drag", dragged).on("end", ended);

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag()
      .on("start", started));
  }


  /** A method to bind hoverable behaviour to an svg element */
  applyHoverableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    let d3element = d3.select(element);
    let connectedLinks;
    let maximalLinks: any[] = [];
     let decorateNodes = ():void =>{
      d3element.select('circle').classed('hovering', true);
      node.hovered = true;
      d3element.selectAll('.tooltip').transition().duration(200)
        .style("opacity", .9).attr('z-index', 666);
      d3.selectAll('circle')
         .data(graph.nodes)
         .filter(getNeighborNodes) //this will pass each node in the graph to the function
         .classed('connected', true)
    };

    let decorateLinks = ():void =>{
      connectedLinks = d3.selectAll('line')
        .data(graph.links)
        .filter(getNeighborLinks)
        .classed('connected', true);

       let connectedNodes = d3.selectAll('circle')
         .data(graph.nodes)
         .filter(getNeighborNodes)
         .classed('connected', true);

         connectedLinks.filter(findMaximalLinks)
         .classed('maximal', true);

       connectedNodes.filter(findMaximalNodes)
         .classed('maximal', true);
     };

    let clearNodes = (): void =>{
      d3element.select('circle').classed('hovering', false);
      node.hovered = false;
      d3element.select('.tooltip').transition().duration(500)
        .style("opacity", 0);
    };

    let clearLinks= ():void => {
      d3.selectAll('line')
        .classed('connected', false)
        .classed('maximal', false);
      d3.selectAll('circle')
        .classed('connected', false)
        .classed('maximal', false);

    };

    let getNeighborLinks = (e:any):boolean => {
        return node.id === (typeof (e.source) == "object" ? e.source.id : e.source) || node.id === (typeof (e.target) == "object" ? e.target.id : e.target);
    };

    let getNeighborNodes = (e:any): boolean => {
      const sources = connectedLinks.data().map(link => link.source.id);
      const targets = connectedLinks.data().map(link=> link.target.id);
      let nodesList = sources.concat(targets).reduce((x, y) => x.includes(y) ? x : [...x, y], []);
      return nodesList.indexOf(e.id) > -1;
    };

   let findMaximalLinks = (e:any):boolean => {
     if(e.properties && e.properties.maximal && e.properties.maximal == "t"){
       maximalLinks= maximalLinks.concat([e.source.id, e.target.id]).reduce((x, y) => x.includes(y) ? x : [...x, y], []);
       return true;
     }else{
       return false;
     }
     };

    let findMaximalNodes = (e:any):boolean =>{
      return maximalLinks.indexOf(e.id) > -1;
    };


    let mouseOverFunction = ():void => {
      this.nodeService.hoveredNode(node);
      decorateLinks();
      decorateNodes();
    };

     let mouseOutFunction = ():void =>{
      clearNodes();
      clearLinks();
    };

    d3element.on("mouseover", mouseOverFunction);
    d3element.on("mouseout", mouseOutFunction);

  }


 /** A method to bind click events to an svg element */
 //just emits the node for other components to listen for
  applyClickableBehaviour = (element, node: Node) =>  {
    let clickedNode = {};
    let d3element = d3.select(element);
    d3element.on("click",function(d) {
      console.log(clickedNode);
      if (node == clickedNode) {
        console.log("already clicked dummy");
      } else {
        d3element.select("circle").classed("clicked", true);
        this.nodeService.changeNode(node);
        clickedNode = node;
      }
    }.bind(this));
  };


  /** The interactable graph we will simulate in this article
   * This method does not interact with the document, purely physical calculations with d3
   */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: {width, height}) {
    return new ForceDirectedGraph(nodes, links, options);
  }
}
