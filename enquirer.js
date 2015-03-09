'use strict';

var Enquirer;
Enquirer = new Component('./enquirer.js');

Enquirer.require('IKnowledgeBase', function (kb, done) {
  this.knowledgeBase = kb;
  done();
});

Enquirer.require('IResponder', function (responder, done) {
  this.responder = responder;
  done();
});

Enquirer.provide('IEnquirer', function (done) {
  done({'discover' : this.discover});
});

Enquirer.install(function (done) {
  var asked = [];
    this.discover = function () {
        asked = [];
        var todos = this.knowledgeBase.list();
        var count = todos.length;
        var isTheAnimal = false;
        var j;
        for(var i=0;isTheAnimal==false && i<count;i++){
            isTheAnimal = true;
            var questions = this.knowledgeBase.retrieve(todos[i]);
            var question;
            j=i;
            for (question in questions) {
                var verR = this.verAnswear(question);
                if (verR === -1){
                    var respo = this.responder.ask(question);
                    if (respo !== questions[question]) isTheAnimal = false;
                    this.saveAnswear(question,respo);
                }else{
                    if (verR !== questions[question]) isTheAnimal = false;
                }
            }
        }
        if (isTheAnimal)
            return todos[j];
        else
            return false;
    }.bind(this);
    this.saveAnswear = function (question,answear) {
        asked.push([question,answear]);
    }.bind(this);
    this.verAnswear = function (question) {
        var tam = asked.length;
        for(var i=0;i<tam;i++){
            if (asked[i][0] === question) return asked[i][1];
        }
        return -1;
    }.bind(this);
    done();
});
