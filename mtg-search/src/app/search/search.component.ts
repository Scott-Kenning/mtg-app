import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    query: string = '';

    redirectToResults() {
        this.router.navigate(['/search'], { queryParams: { query: this.query } });
    }

    constructor(private router: Router) { }
}