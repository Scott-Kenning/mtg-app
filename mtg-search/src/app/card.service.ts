import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  search(query: string, page: number): Observable<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);  // Encoding the query
    return this.http.get<SearchResponse>(`${this.baseUrl}/search/${encodedQuery}?page=${page}`);
  }

  getCardById(id: string): Observable<any> {
    const encodedId = encodeURIComponent(id);  // Encoding the id
    return this.http.get<any>(`${this.baseUrl}/card/${encodedId}`);
  }
}
