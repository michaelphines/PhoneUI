$(function() {
	phoneUI.initialize();
	phoneUI.connected(function(result) {
	  tetris_game.reset();
	  tetris_game.start();

	  phoneUI.dialog(result.data.session_id, {
	    mode: "dtmf",
	    continuous: "true",
	    grammar: {
	      "2": function(){ tetris_game.up(); },
	      "4": function(){ tetris_game.left(); },
	      "5": function(){ tetris_game.down(); },
	      "6": function(){ tetris_game.right(); },
	      "8": function(){ tetris_game.space(); },
	      "0": function(){ tetris_game.pause(); },
	      "*": function(){ 
	        tetris_game.reset();
	        tetris_game.start();
	      }
	    }
	  })
	});

	phoneUI.disconnected(function(result) {
	  tetris_game.gameOver();
	});	
});
