import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  search(query: string, page: number = 1): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/search/${query}?page=${page}`);
}


  getCardById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/card/${id}`);
  }
}
