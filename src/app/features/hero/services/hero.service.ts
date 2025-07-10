import { Injectable, inject, Host } from "@angular/core";

import { Hero } from "../models/hero.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable()
export class HeroService {
    private http = inject(HttpClient);
    private readonly heroStorageKey = "heroesData";
    private heroList: Hero[] = [];

    constructor() {}

    getHeroesList(): Observable<Hero[]> {
        const storedHeroes = this.getHeroesFromStorage();
        if (storedHeroes) {
            this.heroList = [...storedHeroes];
            return of(storedHeroes);
        }

        return this.http.get<Hero[]>("/assets/data/wikipedia_marvel_data.json").pipe(
            tap((heroes) => {
                this.heroList = [...heroes];
                this.saveHeroesToStorage();
            }),
            catchError((error) => {
                console.error(`Loading heroes error ${error}`);
                return of([]);
            })
        );
    }

    addNewHero(newHero: Hero) {
        this.heroList.unshift(newHero);
        this.saveHeroesToStorage();
    }

    updateHero(updatedHero: Hero) {
        const index = this.heroList.findIndex((hero: Hero) => hero.nameLabel === updatedHero.nameLabel);
        if (index !== -1) {
            this.heroList[index] = updatedHero;
            this.saveHeroesToStorage();
        }
    }

    deleteHero(heroName: string) {
        this.heroList = this.heroList.filter((hero: Hero) => hero.nameLabel !== heroName);
        this.saveHeroesToStorage();
    }

    private saveHeroesToStorage() {
        localStorage.setItem(this.heroStorageKey, JSON.stringify(this.heroList));
    }

    private getHeroesFromStorage(): Hero[] | null {
        const heroes = localStorage.getItem(this.heroStorageKey);
        if (!heroes) {
            return null;
        }
        return JSON.parse(heroes);
    }
}
