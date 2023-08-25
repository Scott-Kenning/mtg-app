import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-card-details',
    templateUrl: './card-details.component.html',
})

export class CardDetailsComponent implements OnInit {
    card: any;

    constructor(private route: ActivatedRoute, private httpClient: HttpClient, private location: Location) {}

    goBack() {
        this.location.back();
    }

    getColor(color: string): string {
        switch (color) {
            case 'W': return 'white';
            case 'U': return 'blue';
            case 'B': return 'black';
            case 'R': return 'red';
            case 'G': return 'green';
            default: return 'gray';
        }
    }

    isObjectEmpty(obj: any): boolean {
        return Object.keys(obj).length === 0;
    }

    getLegalStatusKeys(legalities: { [key: string]: string }): string[] {
        return Object.keys(legalities).filter(key => legalities[key] !== 'not_legal');
    }        

    capitalizeFirstLetter(str: string): string {
        str = str.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
        str = str.replace('Historicbrawl', 'Historic Brawl')
                 .replace('Paupercommander', 'Pauper Commander');
        return str;
    }
    
    isFlipped: boolean = false;
    faceIndex: number = 0;

    toggleCardFace() {
        this.isFlipped = !this.isFlipped;
        this.faceIndex = this.isFlipped ? 1 : 0
    }

    ngOnInit(): void {
        const cardName = this.route.snapshot.paramMap.get('name');
        this.httpClient.get<any>('https://mtg-app-api.vercel.app/card/' + cardName).subscribe(data => {
            this.card = data;
        });
    }
}
