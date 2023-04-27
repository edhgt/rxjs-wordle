import { interval, timer } from 'rxjs';

const sequenceNumbers$ = interval(2000);
const delayedTimers$ = timer(5000);

sequenceNumbers$.subscribe(console.log);
delayedTimers$.subscribe(console.log);