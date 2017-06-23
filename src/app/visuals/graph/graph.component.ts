import {Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy} from '@angular/core';
import {D3Service, ForceDirectedGraph, Node, Link} from '../../d3';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" *ngFor="let node of nodes"
            [draggableNode]="node" [hoverableNode]="node" [clickableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @Input('nodes') nodes;
  @Input('links') links;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  graph: ForceDirectedGraph;
  constructor(private d3Service: D3Service,
              private ref: ChangeDetectorRef){}

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngOnChanges(change) {
    //todo: are there cases where only 1 node woud return?
    if (this.graph) {
      if(this.links.length > 0){
        //force change detection
        this.graph.simulation.nodes(this.nodes);
      }else{
        console.log("new graph?");
   /*     this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
        this.graph.simulation.nodes(this.nodes);*/
        //this.graph.initLinks();
        //this.graph.initNodes();
        this.graph.connectNodes(this.nodes, this.links);
      }
    }
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  private _options: {width, height} = {width: 800, height: 600};

  get options() {

    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
