import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private baseUrl = 'https://mtg-app-api.vercel.app';

  constructor(private http: HttpClient) { }

  search(query: string, page: number, color?: string, rarity?: string, sort?: string): Observable<SearchResponse> {
    // const encodedQuery = encodeURIComponent(query);  // Encoding the query
  
    let params = new URLSearchParams();
    params.set('query', query);
    params.set('page', page.toString());
  
    if (color) params.set('color', color);
    if (rarity) params.set('rarity', rarity);
    if (sort) params.set('sort', sort);
  
    const url = `${this.baseUrl}/search?${params.toString()}`;
      
    return this.http.get<SearchResponse>(url);
  }
  


  getCardById(id: string): Observable<any> {
    const encodedId = encodeURIComponent(id);  // Encoding the id
    return this.http.get<any>(`${this.baseUrl}/card/${encodedId}`);
  }
}
