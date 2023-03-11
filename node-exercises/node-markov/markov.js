/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    const uniqueWords = new Set(this.words);
    let chains = {}
    uniqueWords.forEach(word => chains[word] = []);
    for (let i = 0; i < this.words.length - 1; i++) {
      if (i !== this.words.length) {
        if (!(chains[this.words[i]].includes(this.words[i + 1]))) {
          chains[this.words[i]].push(this.words[i + 1]);
        }
      }
    }
    this.chains = chains;
  }

  getRandomWord(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  /** return random text from chains */

  makeText(numWords = 100) {
    let i = this.getRandomWord(this.words);
    let retTextArray = [];
    retTextArray.push(i);
    while (retTextArray.length < numWords) {
      let lastWord = retTextArray[retTextArray.length - 1];
      let nextWord = this.getRandomWord(this.chains[lastWord]);
      if (nextWord) {
        retTextArray.push(nextWord);
      }
      else {
        break;
      }
    }
    return retTextArray.join(' ');
  }
}

module.exports = {
  MarkovMachine
};

