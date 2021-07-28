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

const drink = type => number => `Drink maker makes 1 ${type} with ${number || 'no'} sugar${number && 's'} and ${number ? 'a stick' : 'therefore no stick'}`;

const actions = {
    T: drink('tea'),
    H: drink('chocolate'),
    C: drink('coffee'),
    M: message => message
}

const parse = input => input.split(':');

const proceed = actions => ([ action, data ]) => actions[action](data);

const validate = input => /[TCHM]:.*:\d?/.test(input) ? input : (() => { throw "Invalid input" })()

const loop = () => {
    rl.question('What do you want to buy?', pipe(validate, parse, proceed(actions), console.log, loop));
}

rl.on("close", () => {
    console.log("\nBye!");
    process.exit(0);
});

loop();
