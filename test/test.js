import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import readline from 'readline';
chai.should();
chai.use(sinonChai);

let coffeeMachine;

const readlineInterfaceStub = {
    question: sinon.stub().callsFake((query, callback) => {
        coffeeMachine = callback;
    }),
    close: sinon.stub(),
    on: sinon.stub()
};

sinon.stub(readline, 'createInterface').returns(readlineInterfaceStub);
const consoleLog = sinon.stub(console, 'log');

await import('../index.js');

describe('Coffee machine', () => {
    afterEach(() => {
        consoleLog.resetHistory();
    });

    it('Should not return a chocolate when not enough money provided', () => {
        coffeeMachine('C:1:0.2');
        console.log.should.have.been.calledWith('Cannot make the drink, 0.40 euros are missing');
    });

    it('Should not return a coffee when not enough money provided', () => {
        coffeeMachine('H:1:0.2');
        console.log.should.have.been.calledWith('Cannot make the drink, 0.30 euros are missing');
    });

    it('Should not return a tea when not enough money provided', () => {
        coffeeMachine('T:1:0.2');
        console.log.should.have.been.calledWith('Cannot make the drink, 0.20 euros are missing');
    });

    it('Should return a chocolate when enough money provided and two sugars', () => {
        coffeeMachine('C:2:10');
        console.log.should.have.been.calledWith('Drink maker makes 1 coffee with 2 sugars and a stick');
    });

    it('Should return a coffee when enough money provided and one sugar', () => {
        coffeeMachine('H:1:1');
        console.log.should.have.been.calledWith('Drink maker makes 1 chocolate with 1 sugars and a stick');
    });

    it('Should return a tea when enough money provided and no sugar', () => {
        coffeeMachine('T:0:1');
        console.log.should.have.been.calledWith('Drink maker makes 1 tea with no sugar and therefore no stick');
    });

    it('Should return a message when asked', () => {
        coffeeMachine('M:Hello world!:');
        console.log.should.have.been.calledWith('Hello world!');
    });

});

