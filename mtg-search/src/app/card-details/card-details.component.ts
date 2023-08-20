import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
    card: any;

    constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}

    ngOnInit(): void {
        const cardName = this.route.snapshot.paramMap.get('name');
        this.httpClient.get<any>('http://localhost:3000/card/' + cardName).subscribe(data => {
            this.card = data;
        });
    }
}
