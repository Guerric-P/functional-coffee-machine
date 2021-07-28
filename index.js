const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pipe = (...fns) =>
  fns.reduce((prevFn, nextFn) =>
    (...args) => nextFn(prevFn(...args)),
    value => value
  );

const drink = type => cost => money =>
  money - cost >= 0
    ? number => `Drink maker makes 1 ${type} with ${number || 'no'} sugar${number ? 's' : ''} and ${number ? 'a stick' : 'therefore no stick'}`
    : () => `Cannot make the drink, ${(cost - money).toFixed(2)} euros are missing`;

const actions = {
  T: drink('tea')(0.4),
  H: drink('chocolate')(0.5),
  C: drink('coffee')(0.6),
  M: message => message
}

const parse = pipe(input => input.split(':'), ([action, ...numbers]) => [action, ...numbers.map(x => x ? x : 0).map(Number.parseFloat)]);

const proceed = actions => ([action, data, money]) => actions[action](money)(data);

const validate = input => /[TCHM]:.*:\d?/.test(input) ? input : (() => { throw "Invalid input" })();

const loop = () => rl.question('What do you want to buy?', pipe(validate, parse, proceed(actions), console.log, loop));

rl.on("close", () => {
  console.log("\nBye!");
  process.exit(0);
});

loop();
