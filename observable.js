import { Observable } from "rxjs";

// Ejemplo de creación de observador
const observableAlpha$ = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);

  // Esto lanzará un error y ya no emitirá más datos
  a = b * c;

  subscriber.next(3);

  // A partir de aquí se corta el flujo de datos y no se emite ningún dato.
  subscriber.complete();
  subscriber.next(4);
});

const observador = {
  next: (value) => {
    console.log('Valor recibido:', value);
  },
  complete: () => {
    console.log('Observable completado');
  },
  error: (error) => {
    console.error('Error recibido:', error);
  }
}

observableAlpha$.subscribe(observador);