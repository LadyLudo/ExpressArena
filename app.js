const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express! This is the server!');
})

app.get('/sum', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    if(!a) {
        return res.status(400).send('Please provide number a')
    }
    if(!b) {
        return res.status(400).send('Please provide number b')
    }

    const sum = a+b;
    res.send(`The sum of ${a} and ${b} is: ${sum}`);
})

app.get('/cipher', (req, res) => {
    const message = req.query.text;
    const shift = req.query.shift;
    
    const encryptedMessage = message
    .toUpperCase()
    .split('')
    .map(letter => {
        const code = letter.charCodeAt(0);
        if (code < 65 || code > 91) {
            return letter;
        }
        let diff = code-65;
        diff = diff + shift;
        diff = diff%26;

        const newLetter = String.fromCharCode(diff+65);
        return newLetter
    })
    .join('');

    res.send(`The message is "${message}", and you want it shifted by ${shift}.
    Your encrypted message is now: "${encryptedMessage}"`)
})

app.get('/lotto', (req, res) => {
    const numbers = req.query.numbers.map(n => parseInt(n));

    function genRandomNums(length) {
        let nums = []
        for (i=0; i<length; i++) {
            nums.push(Math.round(Math.random()*20))
        }
        return nums
    }
    const lottoNums = genRandomNums(6)

    let diff= lottoNums.filter(n => numbers.includes(n))
    let correctGuesses = diff.length

    let response
    switch(correctGuesses) {
        case 0:
        case 1:
        case 2: 
        case 3:
            response = "Sorry, you lose.";
            break;
        case 4:
            response = "Congratulations, you win a free ticket!";
            break;
        case 5:
            response = "Congratulations, you win $100!";
            break;
        case 6:
            response = "Wow! Unbelievable! You could have won the mega millions!"
    }
    
    
    res.send(`The lotto numbers are: ${lottoNums}. You numbers are: ${numbers}. Checked against the numbers you have ${correctGuesses} correct. ${response}`)

})


app.listen(8000, () => {
    console.log('Express server is listening on port 8000!')
})