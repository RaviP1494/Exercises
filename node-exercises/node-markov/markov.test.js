const { MarkovMachine } = require('./markov').default;

const test_text = "the cat is in the hat and the hat hates the apple in the cat";
describe("Markov Machine Test", function () {
    beforeEach(function () {
        this.markovMachine = new MarkovMachine(test_text);
    })
    test("testing chain pattern on random word in input", function () {
        const words = test_text.split(" ");
        const random_idx = Math.floor(Math.random() * words.length - 1);
        const random_word = words[random_idx];
        expect(this.markovMachine.chains[random_word]).toContain(words[random_idx + 1]);
    })
});