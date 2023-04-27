import { Observable, Subject } from "rxjs";

const numbers$ = new Observable(suscriber => {
  suscriber.next(Math.round(Math.random() * 100));
});

const numbersRandom$ = new Subject();

const observador = {
  next: (value) => {
    console.log('observador', value);
  }
};

const observador2 = {
  next: (value) => {
    console.log('observador2', value);
  }
};

numbersRandom$.subscribe(observador);
numbersRandom$.subscribe(observador2);

// Esto no lo podemos hacer con Observable
//numbersRandom$.next(Math.round(Math.random() * 100));

// Subject funciona como multicast, y también funciona
// como un observador lo que permite hacer una cadena entre observables
// puede subscribirse a otros observables
numbers$.subscribe(numbersRandom$);