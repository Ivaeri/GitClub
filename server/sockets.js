function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

<<<<<<< HEAD
  socket.on("sendWord", function (d) { //pollId hostname?
    const { pollId, enteredword, userName} = d;
    console.log("test", d.enteredword, d.pollId, userName);
    data.updateWord(d.enteredword, d.pollId, userName);
=======
  socket.on("sendWord", function (d) {
    const { pollId, enteredword } = d;
    socket.emit('updateWord', data.updateWord(d.enteredword, d.pollId));
>>>>>>> 152babae058443a093f427337ff2a571cc4ab43e
    io.emit("sendWord",  d.enteredword); 
  });
 


  socket.on("generateId", function(d) {
    socket.emit('setPollId', data.setPollId(d))
    io.emit("generateId",  { pollId: d });
    io.emit("activePollsUpdate", Object.keys(data.polls));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang, d.userName);
    socket.emit('pollData', data.getPoll(d.pollId));
    io.emit('activePollsUpdate', Object.keys(data.polls));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.activateQuestion(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.activateQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
    io.emit('participantsUpdate', data.getParticipants(d.pollId));
    
  });

  socket.on("getParticipants", function(d) {
    socket.emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on("getIndex", function(pollId) {
    let index = data.getIndex(pollId);
    io.emit('index', index);
  });

  socket.on("getWord", function(pollId) {
    let word = data.getWord(pollId);
    io.emit("word", word);
  });

  socket.on("updateIndex", function(pollId) {
    data.updateIndex(pollId);
  });

  socket.on("setGameToWon", function(pollId){
    data.setGameToWon(pollId)
  })

  socket.on("findIfWon", function(pollId) {
    let isWon = data.findIfWon(pollId)
    io.emit("wonOrNot", isWon)
  })

  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('getActivePolls', () => {
<<<<<<< HEAD
    const activePolls = Object.keys(data.polls).map(pollId => {
      const poll = data.polls[pollId]; 
        return {
            pollId: pollId,
            userName: poll.userName || "Okänd host" 
        };
    }); 
    console.log("Aktiva spel skickas:", activePolls);
=======
    const activePolls = Object.keys(data.polls); 
>>>>>>> 152babae058443a093f427337ff2a571cc4ab43e
    socket.emit('activePolls', activePolls); 
    io.emit("activePollsUpdate", activePolls);
});

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on("updateGuessedLetters", function(d){
    data.updateGuessedLetters(d.pollId, d.key);
  })

  socket.on("addAmountWrongLetters", function(pollId) {
    data.setAmountWrongLetters(pollId)
  })

  socket.on("getAmountWrongLetters", function(pollId){
    let amount = data.getAmountWrongLetters(pollId)
    io.emit("amountWrongLetters", amount)
  })

  socket.on("getGuessedLetters", function(pollId){
    let letters = data.getGuessedLetter(pollId);
    io.emit("letters", letters);
  })

}

export { sockets };