import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from './services/account.service';
import { StocksService } from './services/stocks.service';
import { Stock } from './services/stocks.model';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ StocksService ]
})
export class AppComponent implements OnInit, OnDestroy {
  refresh: boolean = true;
  stocks: Stock[] = [];
  interval: any;

  constructor(
    private accountService: AccountService, 
    private stocksService: StocksService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.accountService.init();
    this.load();
    this.interval = setInterval(() => {
      if (this.refresh) {
        this.load()
      }
    }, 15000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  toggleRefresh(): void {
    this.refresh = !this.refresh;
    let onOff = (this.refresh) ? 'On' : 'Off';
    this.alertService.alert(`You have turned automaic refresh ${onOff}`, 'info', 0);
  }

  reset(): void {
    this.accountService.reset();
    this.alertService.alert(`You have reset your portfolio`)
  }

  about() {
    this.alertService.alert(`This app is built using Angular CLI and Project Clarity`)
  }

  private load() {
    this.stocksService.getStocks()
        .subscribe(stocks => {
          this.stocks = stocks; 
        }, error => {
          console.error(`There was error loading stocks: ${error}`)
        });
  }
}
