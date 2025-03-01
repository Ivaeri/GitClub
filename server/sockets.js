function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on("setLang", function(d) {
    data.setLang(d.pollId, d.lang);
  });

  socket.on("getLang", function(pollId) {
    let lang = data.getLang(pollId);
    io.emit("lang", {lang: lang, pollId: pollId});
  });



  socket.on("setWordAndGenerateGameInfo", function (d) { //pollId hostname?
    const { pollId, enteredword, hostName} = d;
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
    io.emit("activePollsUpdate", Object.keys(data.polls));
  });

 
  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang, d.userName);
    socket.emit('pollData', data.getPoll(d.pollId));
    io.emit('activePollsUpdate', Object.keys(data.polls));
  });
  
  socket.on("inActivateIfFull", function(pollId) {
    data.inActivateIfFull(pollId)
  });


  socket.on("removePollIdFromList", function(pollId) {
    data.addToInActivePolls(pollId)
  },);

  socket.on("reActivatePollId", function(pollId) {
  const inActivePolls = data.reActivatePollId(pollId)
  io.emit("inActivePolls", inActivePolls)
  });

  socket.on("getInActivePolls", function(pollId) {
  const inActivePolls = data.getInActivePolls(pollId)
    io.emit("inActivePolls", inActivePolls)
  }) 

 

  socket.on("newGameHasStarted", function(pollId) {
  io.emit("newGameIsStarted", pollId)
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.wins);
   // io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
   // io.emit('participantsUpdate', data.getParticipants(d.pollId));
  
   
    
  });
  socket.on('leavePoll', function(d) {
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
    io.emit('index', {index: index, pollId: pollId});
  });

  socket.on("getWord", function(pollId) {
    let word = data.getWord(pollId);
    io.emit("word", {word: word, pollId: pollId});
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


  socket.on('NailInCoffin' , function(d) {
    data.nailInCoffin(d.userName, d.pollId);

  });
  socket.on('getLeaderboard', function(pollId) {
    let leaderboard = data.getLeaderboard(pollId);
    io.emit("leaderboard", leaderboard);

  });
  socket.on('getNailInCoffin', function(pollId) {
    let nail = data.getNailInCoffin(pollId);
    io.emit("nail", nail);
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
    data.startNewGame(d.pollId, d.hostName, d.enteredword, d.lang);
  })

}

export { sockets };