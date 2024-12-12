function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });
  socket.on("sendWord", function (d) {
    socket.emit('updateWord', data.updateWord(d))
    console.log("Word received from client:", d);
    io.emit("sendWord",  { enteredWord: d }); 
  });

  socket.on("generateId", function(d) {
    socket.emit('setPollId', data.setPollId(d))
    console.log("poll Id set to:", d);
    io.emit("generateId",  { pollId: d });
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
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
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });
  
  socket.on('getActivePolls', () => {
    const activePolls = Object.keys(data.polls); // Hämta alla aktiva spel-ID:n
    console.log("Aktiva spel skickas:", activePolls);
    socket.emit('activePolls', activePolls); // Skicka tillbaka till klienten
});

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });
}

export { sockets };