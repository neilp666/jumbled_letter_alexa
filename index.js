"use strict";
var Alexa = require('alexa-sdk');
var arr = [{"Q":"kobo","A":"book"},{"Q":"labl","A":"ball"},{"Q":"eirf","A":"fire"}];

exports.handler = function(event,context,callback) {
  var alexa = Alexa.handler(event,context,callback);
  alexa.dynamoDBTableName = "JumbledLetters1";
  alexa.appId = "amzn1.ask.skill.89db5656-40a0-4d12-95e2-ad4f5659870d";
  alexa.registerHandlers(handler);
  intialize(event, function() {
    alexa.execute();
  });
};

function intialize(event,callback){
  if(event.session.attributes.Game === undefined){
    event.session.attributes.Game={};
  }
  callback();
}

var handler = {
  "start" : function() {
    this.attributes.Game.score = 0;
    this.attributes.Game.index = 0;
    this.attributes.Game.count = 3;
    var question = arr[0].Q;
    var q = "<break time= '0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
    var qc = question.split('').join("   ");
    var speech = "Welcome to Jumbled Letters, let's begin , here are your jumbled letters " + q + " . Guess the word, you have 3 attempts left";
    this.emit(":askWithCard",speech,speech, "Jumbled letters",qc);
  },
  "resume": function() {
    var index = this.attributes.Game.index;
    var count = this.attributes.Game.count;
    var question = arr[index].Q;
    var q = "<break time= '0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
    var qc = question.split('').join("   ");
    var speech = "Welcome back, here are your jumbled letters" + q + " . Guess the word, you have " + count + "attempts left";
    this.emit(":askWithCard",speech,speech, "Jumbled letters",qc);
  },
  "LaunchRequest" : function(){
    if(this.attributes.Game.score === undefined){
        this.emit('start');
    }else if(this.attributes.Game.end === 1){
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the question that I have, you have scored " + score + "If you wish to delete this game and start over again say delete my previous game";
        this.emit(':ask', speech, speech1);
    }else{
        var speech = "You have already played the game. Your score is " + this.attributes.Game.score + ". To resume your game say resume my game, or to delete my previous game ";
        this.emit(':ask', speech, speech);
    }
  },
  "AMAZON.StartOverIntent" : function(){
    if(this.attributes.Game.score === undefined){
        this.emit('start');
    } else if{this.attributes.Game.end === 1){
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the question that I have, you have scored " + score + "If you wish to delete this game and start over again say delete my previous game";
        this.emit(':ask', speech, speech1);
    } else {
        var speech = "You have already played the game. Your score is " + this.attributes.Game.score + ". To resume your game say resume my game, or to delete my previous game ";
        this.emit(':ask', speech, speech);
    }
  },
  "AnswerIntent" : function() {
    var guess = this.event.request.intent.slots.Guess.value;
    var l1 = this.event.request.intent.slots.LetterOne.value;
    var l2 = this.event.request.intent.slots.LetterTwo.value;
    var l3 = this.event.request.intent.slots.LetterThree.value;
    var l4 = this.event.request.intent.slots.LetterFour.value;
    var index = this.attributes.Game.index;
    var count = this.attributes.Game.count;
    var answer = arr[index].A;
    var a = answer.split('');
    if(guess !== undefined && l1 !== undefined && l2 !=undefined && l3 !== undefined && l4 !==undefined) {
      l1 = l1.toLowercase();
      l2 = l2.toLowercase();
      l3 = l3.toLowercase();
      l4 = l4.toLowercase();
      if(guess === answer && (l1 === a[0] || l1 === a[0] + ".") && (l2 === a[1] || l2 === a[1] + ".") && (l3 === a[2] || l3 === a[2] + ".") && (l4 === a[3] || l4 === a[3] + "."))
          this.attributes.Game.score += 1;
          var score = this.attributes.Game.score;
          var speech = "Good Job, you have guessed it right in " + (4-count) + " attempts. Your score is " + score + ". Do you wish to play again? say Yes to play again and No to quit.";
          this.emit(":ask", speech, speech);
    } else {
      this.attributes.Game.count -= 1;
      count = this.attributes.Game.count;
      var question = arr[index].Q;
      var q = "<break time= '0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
      if (count > 0) {
          var speech1 = "Please try again, your jumbled letters were " + q + ". You have " + count + " attempts left";
          this.emit(":ask", speech1, speech1);
      } else {
          var ans = "<break time= '0.5s'/>" + answer.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
          var speech2 = "Sorry, there are no attempts left, the correct word is " + ans + answer + ". Do you wish to play again? say Yes to play again and No to quit";
          this.emit(":ask", speech2 , speech2);
      }
    }
  }else{
    this.emit(":ask", "Please guess by spelling out the word", "Please guess by spelling out the word");
  }
},
    "AMAZON.YesIntent": function() {
      if(this.attributes.Game.index === arr.length - 1){
          this.attributes.Game.end = 1;
          var score = this.attributes.Game.score;
          var speech = "I have asked all the question that I have, you have scored " + score + "If you wish to delete this game and start over again say delete my previous game";
          this.emit(":ask",speech,speech);
      }else {
          this.attributes.Game.index += 1;
          this.attributes.Game.count = 3;
          this.emit('resume');
      }
    },
    "AMAZON.NoIntent": function() {
      if(this.attributes.Game.index === arr.length - 1){
          this.attributes.Game.end = 1;
          this.emit(:"tell","Thank You");
      }else {
          this.attributes.Game.index += 1;
          this.attributes.Game.count = 3;
          this.emit(":tell", "Thank you");
      }
},
  "AMAZON.ResumeIntent": function(){
    if(this.attributes.Game.score === undefined) {
      var speech = "You have not started the game yet, to start the game say, start a game";
      this.emit(":ask", speech, speech);
    }
    else if{this.attributes.Game.end === 1){
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the question that I have, you have scored " + score + "If you wish to delete this game and start over again say delete my previous game";
        this.emit(":ask", speech1, speech1);
  } else {
        this.emit('resume');
  }
},
  "DeleteIntent": function() {
    if(this.attributes.Game.score === undefined) {
        var speech = "You have not started the game yet, to start the game say, start a game";
        this.emit(":ask", speech, speech);
    } else {
        this.attributes.Game.end = 0;
        this.emit('start');
      }
  },
  "AMAZON.StopIntent": function() {
    this.emit(":tell", "Thank you");
  }
};


Jumbled letters

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
