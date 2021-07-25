import { observable, Observable } from 'rxjs';
import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import * as fake  from 'faker';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  people$: Observable<Person[]> = new Observable;

  constructor(
    private mainService:MainService
  ) { }

  ngOnInit(): void {
    this.people$ = this.mainService.getPeople();
  }

  addOne(){
    const p:Person = {
      name: fake.name.findName(),
      age: fake.random.number({min: 18, max:99}),
      email: fake.internet.email(),
      company: fake.company.companyName(),
      cuntry: fake.address.country()
    }
    this.mainService.addPerson(p);
  }

  generate(){
    for (let i = 0; i < 5; i++) {
      this.addOne()

    }
  }



}
