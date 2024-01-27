import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent implements OnInit{
  error:any;
  constructor(private router: Router){
    const navigation = this.router.getCurrentNavigation();
    //The optional chaining ?. is not an operator, but a special syntax construct, that also works with functions and square brackets.
    // For example, ?.() is used to call a function that may not exist.
    // The ?.[] syntax also works, if we’d like to use brackets [] to access properties instead of dot .. Similar to
    this.error = navigation?.extras?.state?.['error']
  }

  ngOnInit() {

  }
}
