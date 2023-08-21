import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../card.service';
import { Card, SearchResponse } from '../types';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
    cards: Card[] = [];
    currentPage: number = 1;
    query: string = '';
    hasPrevPage: boolean = false; 
    hasNextPage: boolean = true; 
    totalPages: number = 0;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.query = params['query'];
            this.currentPage = +params['page'] || 1;
            this.searchCards();
        });
    }

    searchCards() {
        this.cardService.search(this.query, this.currentPage).subscribe((response: SearchResponse) => {
            this.cards = response.cards;
            this.totalPages = response.totalPages;
            this.setHasPages();
    
            this.cards.forEach(card => {
                if (card.card_faces && card.card_faces.length > 0) {
                    card.activeFace = card.card_faces[0];
                }
            });        
        });
    }

    toggleFace(card: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (card.card_faces && card.card_faces.length === 2) {
            card.activeFace = card.activeFace === card.card_faces[0] ? card.card_faces[1] : card.card_faces[0];
        }
    }

    setHasPages() {
        this.hasPrevPage = this.currentPage > 1;
        this.hasNextPage = this.currentPage < this.totalPages;
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.setHasPages();
            this.searchCards();
        }
    }

    nextPage() {
        this.currentPage++;
        this.setHasPages();
        this.searchCards();
    }

    constructor(private cardService: CardService, private route: ActivatedRoute) {}
}
