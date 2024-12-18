function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on("sendWord", function (d) {
    const { pollId, enteredword } = d;
    console.log("test", d.enteredword, d.pollId);
    socket.emit('updateWord', data.updateWord(d.enteredword, d.pollId));
    io.emit("sendWord",  d.enteredword); 
  });
 

  socket.on("generateId", function(d) {
    socket.emit('setPollId', data.setPollId(d))
    console.log("poll Id set to:", d);
    io.emit("generateId",  { pollId: d });
    io.emit("activePollsUpdate", Object.keys(data.polls));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
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
    console.log("called for participants:", d.pollId);
  });
  socket.on("getIndex", function(pollId) {
    let index = data.getIndex(pollId);
    io.emit('index', index);
    console.log("get index in socket:", index);
  });

  socket.on("getWord", function(pollId) {
    console.log("reached sockets for getWord")
    let word = data.getWord(pollId);
    console.log("word i socket before sending back to players;", word);
    io.emit("word", word);
  });

  socket.on("updateIndex", function(pollId) {
    console.log("update index reached sockets for id:", pollId);
    data.updateIndex(pollId);
    /*
    let index = data.updateIndex(d.pollId, d.index);
    io.emit("index", index);
    console.log("index sent back to playerview:", index)
    */
    
  });

  socket.on("setGameToWon", function(pollId){
    console.log("reached setgametowon in sockets")
    data.setGameToWon(pollId)
  })

  socket.on("findIfWon", function(pollId) {
    let isWon = data.findIfWon(pollId)
    console.log("having requested if won via sockets", isWon)
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
    const activePolls = Object.keys(data.polls); 
    console.log("Aktiva spel skickas:", activePolls);
    socket.emit('activePolls', activePolls); 
    io.emit("activePollsUpdate", Object.keys(data.polls));
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