import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TipsService } from '../services/tips.service';

@Component({
  selector: 'app-tips-details',
  templateUrl: './tips-details.component.html',
  styleUrls: ['./tips-details.component.sass']
})
export class TipsDetailsComponent implements OnInit {
  tip: any = {};
  selectday: number;
  ls_have: boolean;
  selectID = 1;
  error = false;
  constructor(
    private tipsService: TipsService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  selectDay(val: number, val2: number) {
    this.selectday = val + val2;
    if (this.selectday > 2) {
      this.ls_have = true;
    } else {
      this.ls_have = false;
    }
    return this.selectday;
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.selectID = +params.get('id');
          return this.tipsService.getTip(this.selectID);
        })
      )
      .subscribe(response => {
        const tip: any = response;
        this.tip = tip.article;
        this.tip.content = this.tip.content.split(/(?:\r\n|\r|\n\n)/g);
        this.error = false;
      }, error => (this.error = true));
  }

  goBack() {
    this.location.back();
  }
}
