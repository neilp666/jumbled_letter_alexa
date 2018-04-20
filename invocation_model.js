{
  "intents": [
   {
     "intent": "AMAZON.StartOverIntent"
   },
   {
     "intent": "AMAZON.ResumeIntent"
   },
   {
     "intent": "AMAZON.YesIntent"
   },
   {
     "intent": "AMAZON.NoIntent"
   },
   {
     "intent": "AMAZON.StopIntent"
   },
   {
     "intent": "DeleteIntent"
   },
   {
     "intent": "AnswerIntent",
     "slots" : [
       {
         "name" : "Guess",
         "type" : "Answers"
       },
       {
         "name" : "LetterOne",
         "type" : "Alphabets"
       },
       {
         "name" : "LetterTwo",
         "type" : "Alphabets"
       },
       {
         "name" : "LetterThree",
         "type" : "Alphabets"
       },
       {
         "name" : "LetterFour",
         "type" : "Alphabets"
       }
     ]
   }
  ]
}

custom slot types

Answers

book
ball
fire

Alphabets


AMAZON.StartOverIntent start
AMAZON.StartOverIntent start a game

AMAZON.ResumeIntent resume my game
AMAZON.ResumeIntent resume

AnswerIntent is it {LetterOne} {LetterTwo} {LetterThree} {LetterFour} {Guess}
AnswerIntent is the word {LetterOne} {LetterTwo} {LetterThree} {LetterFour} {Guess}
AnswerIntent my answer is {LetterOne} {LetterTwo} {LetterThree} {LetterFour} {Guess}

DeleteIntent delete my previous game
DeleteIntent delete everything
