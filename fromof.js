import { from, of, asyncScheduler } from 'rxjs';

const fruits$ = from(['apple', 'tangerine', 'pear'], asyncScheduler);
const animals$ = of(1, 2, 3);

fruits$.subscribe(console.log);
animals$.subscribe(console.log);
