import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CardService } from '../card.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    query: string = '';
    cards: any[] = [];
    // Add the currentPage property to keep track of the current page
currentPage: number = 1;

// Update the searchCards method to include the current page in the request
searchCards() {
    this.cardService.search(this.query, this.currentPage).subscribe(cards => {
        this.cards = cards;
    });
}

// Add methods to navigate to the previous and next pages
prevPage() {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.searchCards();
    }
}

nextPage() {
    this.currentPage++;
    this.searchCards();
}


    constructor(private cardService: CardService) {}

}
