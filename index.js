import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pipe = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

const drink = type => cost => ([number, money]) => hot =>
  money - cost >= 0
    ? `Drink maker makes 1 ${hot ? 'extra hot ' : ''}${type} with ${number || 'no'} sugar${number ? 's' : ''} and ${number ? 'a stick' : 'therefore no stick'}`
    : `Cannot make the drink, ${(cost - money).toFixed(2)} euros are missing`;

const parseNumbers = (...numbers) => numbers.map(x => x ? x : 0).map(Number.parseFloat);

const actions = {
  T: pipe(parseNumbers, drink('tea')(0.4)),
  H: pipe(parseNumbers, drink('chocolate')(0.5)),
  C: pipe(parseNumbers, drink('coffee')(0.6)),
  O: pipe(parseNumbers, drink('orange juice')(0.6)),
  M: message => () => message
}

const split = character => input => input.split(character);

const dispatch = actions => ([[action, hot], ...args]) => actions[action](...args)(hot === 'h');

const validate = input => /(?:[TCHM]h?|O):.*:\d?/.test(input) ? input : (() => { throw "Invalid input" })();

const loop = () => rl.question('What do you want to buy?', pipe(validate, split(':'), dispatch(actions), console.log, loop));

rl.on("close", () => {
  console.log("\nBye!");
  process.exit(0);
});

loop();