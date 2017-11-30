import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort} from "@angular/material";
import {Link} from "../../../d3/models/link";
import {LinkService} from "../../../d3/models/link.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'link-list-visual',
  templateUrl: './link-list-visual.component.html',
  styleUrls: ['./link-list-visual.component.css']
})
export class LinkListVisualComponent implements OnInit {
  displayedColumns = ['source', 'linkType', 'target', 'details', 'reference', 'score', 'confidence'];
  linkSubscription: Subscription;
  data :  Link[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private linkService: LinkService){
  }
  ngOnInit() {
   this.linkSubscription = this.linkService.linkslist$
      .subscribe(res => {
        this.dataSource.data = Array.from(new Set(res.hovered.concat(res.clicked)));
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}