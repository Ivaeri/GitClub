function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on("setWordAndGenerateGameInfo", function (d) { //pollId hostname?
    const { pollId, enteredword, hostName} = d;
    console.log(d)
    data.updateWord(d.enteredword, d.pollId, d.hostName);
    const activePolls = Object.keys(data.polls).map(pollId => {
      const poll = data.polls[pollId]; 
      let hostName = poll.hostName;
        return {
            pollId: pollId,
            hostName: hostName || "Okänd host" 
        };
    }); 
    io.emit("activePollsUpdate", activePolls);
  });

  socket.on("getActivePolls", () => {
    const activePolls = Object.keys(data.polls).map(pollId => {
      const poll = data.polls[pollId]; 
      let hostName = poll.hostName;
      return {
        pollId: pollId,
        hostName: hostName || "Okänd host"
      };
    }); 
    io.emit("activePollsUpdate", activePolls);
  });
 
  socket.on("generateId", function(d) {
    socket.emit('setPollId', data.setPollId(d))
    //io.emit("generateId",  { pollId: d });
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

  socket.on("removePollIdFromList", function(pollId) {
    console.log("removePollIdFromList körs i sockets.js", pollId)
    data.addToInActivePolls(pollId)
  },);

  socket.on("reActivatePollId", function(pollId) {
  console.log("reActivatePollId körs i sockets.js", pollId)
  const inActivePolls = data.reActivatePollId(pollId)
  io.emit("inActivePolls", inActivePolls)
  });

  socket.on("getInActivePolls", function(pollId) {
  const inActivePolls = data.getInActivePolls(pollId)
  console.log("getInActivePolls körs i sockets.js", inActivePolls)

    io.emit("inActivePolls", inActivePolls)
  }) 

 

  socket.on("newGameHasStarted", function(pollId) {
  io.emit("newGameIsStarted", pollId)
  console.log("newGameHasStarted in sockets", pollId)
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.activateQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name);
   // io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
   // io.emit('participantsUpdate', data.getParticipants(d.pollId));
    
  });
  socket.on('leavePoll', function(d) {
    console.log("reached leavePoll in sockets.js") 
    const { pollId, userName } = d;
    if (data.polls[pollId]) {
      data.leaveGame(pollId, userName);
        }
  }
);


  socket.on("getParticipants", function(d) {

    io.emit('participantsUpdate',  { participants: data.getParticipants(d.pollId), pollId: d.pollId });
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
    console.log("game is won")
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

  socket.on('NailInCoffin' , function(d) {
    data.nailInCoffin(d.userName, d.pollId);
    console.log("nail in coffin", d.userName, d.pollId)
  });

  socket.on('getNailInCoffin', function(pollId) {
    let nail = data.getNailInCoffin(pollId);
    io.emit("nail", nail);
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
    io.emit("amountWrongLetters", {amount: amount, pollId: pollId})
  })

  socket.on("getGuessedLetters", function(pollId){
    let letters = data.getGuessedLetter(pollId);
    io.emit("letters", {letters: letters, pollId: pollId});
  })

  socket.on("StartNewGame", function(d) {
    data.startNewGame(d.pollId, d.hostName, d.enteredword);
  })

}

export { sockets };