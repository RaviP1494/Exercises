const {MarkovMachine} = require('./markov');

const test_text = "the cat is in the hat and the hat hates the apple in the cat";
describe("Markov Machine Test", function(){
    beforeEach(function(){
        this.mm = new MarkovMachine(test_text);
    })
    test("testing chain pattern on random word in input", function(){
        const words = test_text.split(" ");
        let random_idx = Math.floor(Math.random() * words.length - 1);
        let random_word = words[random_idx];
        expect(this.mm.chains[random_word]).toContain(words[random_idx + 1]);
    })
});