// This is the simon game object
var gameObject = {
  level: 0,
  turn: 0, //current turn
	difficulty: 1, // user difficulty
	score: 0, //current score
	active: false, //whether a turn is active or not
	handler: false, // whether the click and sound handlers are active
	gameSequence: [], //array containing the generated/randomized pads
  gameCopy: [],
  //initialises the game
  init: function(){
    var that = this;
    that.initGameHandler();
  },

  initGameHandler: function(){
      this.gameSequence = [];
			this.gameCopy = [];
			this.level = 0;
			this.active = true;
			$('p[data-action="lose"]').hide();
      $('[data-action=start]').hide();
      window.setTimeout(function() {
  					$('[data-action=won-text]').hide();
  		}, 2000);
      $('[data-action=restart]').show();
      this.difficulty = $('input[name=mode]:checked').val();
      this.beginLevel();
  },

  beginLevel: function(){
    $('[data-round]').text(++this.level);
    if(this.level == 21){
      window.setTimeout(function() {
  					$('[data-action=won-text]').show();
  		}, 250);
      this.endGame();
    }else{
      var randNum = this.generateRandomNum();
      this.gameSequence.push(randNum);
      this.gameCopy = this.gameSequence.slice(0);
      this.animateBoard(this.gameSequence);
    }
  },

  generateRandomNum: function() {
			return Math.floor((Math.random()*4)+1);
	},

  animateBoard: function(gameSequence){
      var i = 0;
			var that = this;
      var animationInterval = setInterval(function() {
        that.playSound(gameSequence[i]);
        that.lightTileUp(gameSequence[i]);

        i++;

        if (i >= gameSequence.length) {
          clearInterval(animationInterval);
          that.activateGameBoard();
        }
      }, 600);

  },

  playSound: function(tile){
    var audio = $('<audio autoplay></audio>');
    audio.append('<source src="http://localhost/jsapps/simongame/sounds/' + tile + '.ogg" type="audio/ogg" />');
    audio.append('<source src="http://localhost/jsapps/simongame/sounds/' + tile + '.mp3" type="audio/mp3" />');
    $('[data-action=sound]').html(audio);
  },

  lightTileUp: function(tile){
    var $tile = $('[data-tile=' + tile + ']').addClass('flash');
    window.setTimeout(function() {
					$tile.removeClass('flash');
		}, 300);
  },

  activateGameBoard: function(){
    var that = this;
    $('.wheel').on('click', '[data-tile]', function(e) {
      that.registerClick(e);
    }).on('mousedown', '[data-tile]', function(){
        $(this).addClass('active');
        that.playSound($(this).data('tile'));
    }).on('mouseup', '[data-tile]', function(){
        $(this).removeClass('active');
    });
    $('[data-tile]').addClass('hoverable');
  },

  registerClick: function(e) {
    var gameResponse = this.gameCopy.shift();
    var playerResponse = $(e.target).data('tile');
    this.active = (gameResponse === playerResponse);
    this.checkGameStatus();
  },

  checkGameStatus: function(){
    if (this.gameCopy.length === 0 && this.active) {
      this.deactivateGameBoard();
			this.beginLevel();
    }else if(!this.active && this.difficulty!= 2){
      $('[data-action=restart]').hide();
      this.deactivateGameBoard();
      this.continueLevel();

    }else if (this.difficulty == 2 && this.active == false) {
      $('[data-action=restart]').hide();
      $('[data-action=replay]').show();
      $('p[data-action=lose]').show();
      window.setTimeout(function() {
  					$('p[data-action=lose]').hide();
  		}, 4000);
      this.deactivateGameBoard();
    }
  },

  deactivateGameBoard: function(){
    $('.wheel').off('click', '[data-tile]').off('mousedown', '[data-tile]').off('mouseup', '[data-tile]');
    $('[data-tile]').removeClass('hoverable');
  },

  endGame: function(){
    this.deactivateGameBoard();
		$($('[data-round]').get(0)).text('0');
    window.setTimeout(this.init(), 5000);
  },

  continueLevel: function(){
    $('p[data-action=lose]').show();
    $('[data-action=replay]').show();
    window.setTimeout(function() {
					$('p[data-action=lose]').hide();
		}, 4000);
  },
  replayLevel: function(){
    $('[data-action=replay]').hide();
    if(this.difficulty == 2){
      this.generateNewSequence();
    }
    this.gameCopy = this.gameSequence.slice(0);
    this.animateBoard(this.gameSequence);
  },
  generateNewSequence: function(){
    this.gameSequence.length = 0;
    for(i=0;i<this.level;i++){
      this.gameSequence.push(Math.floor(Math.random() * 4) + 1);
    }
  },
}




$(document).ready(function(){
  $('[data-action=replay]').on('click', function(){
    $('[data-action=restart]').show();
    gameObject.active = true;
    gameObject.replayLevel();

  });

  $('[data-action=start]').on('click', function(){
    gameObject.init();
  });

  $('[data-action=restart]').on('click', function(){
    gameObject.deactivateGameBoard();
    gameObject.init();
  });


});
