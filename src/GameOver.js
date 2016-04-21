BasicGame.GameOver = function (game) {
var scoreT;
};

BasicGame.GameOver.prototype = {
    create: function () {
	
		if(scoreH!=null) {
			scoreT = scoreH;
		}
		else {
			scoreT = score;
		}
		
		this.game.add.sprite(0,0,"back");	
		var title = this.game.add.sprite(368/2,-100,'title');
		title.anchor.setTo(0.5,0.5);
		this.game.add.tween(title).to({ y: 100 },2000, Phaser.Easing.Elastic.InOut, true, 0);	
		var scoreText = this.game.add.text(368/2, 300, "" , { font: '30px Courrier New', fill: '#000' });
		scoreText.anchor.setTo(0.5,0.5);
		scoreText.setText(scoreT);
		var playButton = this.game.add.button(368/2,850,"play",this.play,this,1,0)
		playButton.anchor.setTo(0.5,0.5);
		this.game.add.tween(playButton).to({ y: 400 },2000, Phaser.Easing.Elastic.InOut, true, 0);
		
		
		var playButton = this.game.add.button(368/2,850,"play2",this.playHard,this,1,0)
		playButton.anchor.setTo(0.5,0.5);
		this.game.add.tween(playButton).to({ y: 550 },2000, Phaser.Easing.Elastic.InOut, true, 0);
		
		this.score();
		
    },
	play : function () {
		this.game.state.start("Game");
	},
	playHard : function () {
		this.game.state.start("GameHardcore");
	},
	score : function() {
		
		var sSaveUserName  = GJAPI.sUserName;
        var sSaveUserToken = GJAPI.sUserToken;
		if (GJAPI.sUserName) {
			if(score!=null) {
				GJAPI.UserLoginManual(sSaveUserName, sSaveUserToken);
				GJAPI.ScoreAdd(83691, score, score + " points");
				score = null;
			}
			else {
				GJAPI.UserLoginManual(sSaveUserName, sSaveUserToken);
				GJAPI.ScoreAdd(98588, scoreH, scoreH + " points");
				scoreH = null;
			}
		}
		else {
			if(score!=null) {
				GJAPI.ScoreAddGuest(83691, score, score + " points", "Guest");
				score = null;
			}
			else {
				GJAPI.ScoreAddGuest(98588, scoreH, scoreH + " points", "Guest");
				scoreH = null;
			}
		}		
	}
};