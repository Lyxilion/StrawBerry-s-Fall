BasicGame.GameHardcore = function (game) {
	var player;
	var ledges;
	var bads;
	var scoreH;
	var back;
	var compa;
	var badsCompa;
	var cursors;
	var bool;
	var scoreText;
	var shoots;
	var nextFire;
};
BasicGame.GameHardcore.prototype = {
    create: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		back = this.game.add.sprite(0,0,"back");
		this.game.camera.bounds = null;
		ledges = this.game.add.group();
		ledges.enableBody = true;
		ledges.physicsBodyTypes = Phaser.Physics.ARCADE;
		shoots = this.game.add.group();
		shoots.enableBody = true;
		shoots.physicsBodyTypes = Phaser.Physics.ARCADE;
		shoots.createMultiple(30, 'shoot', 0, false);
		
		bads = this.game.add.group();
		bads.enableBody = true;
		bads.physicsBodyTypes = Phaser.Physics.ARCADE;
		scoreText = this.game.add.text(25, 25, "" , { font: '30px Courrier New', fill: '#000' });
		cursors = this.game.input.keyboard.createCursorKeys();
		badsCompa = this.game.camera.y-500;
		nextFire = this.game.time.now;
		compa = this.game.camera.y;
		scoreH = this.game.camera.y;
		this.spawnPlayer();
		this.spawnLedge();
		this.loadLedge();
    },
    update: function () {
		this.game.physics.arcade.collide(player, ledges, this.jump, null , this);
		this.game.physics.arcade.overlap(player, bads, this.killPlayer, null , this);
		this.game.physics.arcade.overlap(bads, shoots, this.killBad, null , this);
		
		scoreH = - this.game.camera.y;
		if(this.game.camera.y < badsCompa) {
			this.spawnBad(this.game.camera.y);
			badsCompa = this.game.camera.y-500;
		}
		
		if(this.game.camera.y < compa) {
			this.spawnLedge(this.game.camera.y);
			compa = this.game.camera.y -75;
		}
		
		if(player.body.velocity.y < 0 ) {
			player.frame = 0;
		}
		else {
			player.frame = 1;
		}
		
		
		if(this.game.input.activePointer.isDown && nextFire < this.game.time.now) {
			this.shoot();
			nextFire = this.game.time.now + 500;
		}
		
		
		if(player.y -350 < this.game.camera.y) {
			this.game.camera.y = player.y-350;
			back.y = player.y-350;
			scoreText.y = player.y-325;
		}
		
		if(this.game.physics.arcade.distanceBetween(this.game.camera,player) > 800) {
			this.killPlayer();
		}
		
		if(player.x > 368) {
			player.x = 0;
		}
		if(player.x <0) {
			player.x = 368;
		}
		
		if (cursors.left.isDown) {
			player.body.velocity.x = -200;
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = 200;
		}
		else {
			if(player.body.velocity.x > 0) {
				player.body.velocity.x -= 5;
			}
			else {
				player.body.velocity.x += 5;
			}
		}
		if(this.game.physics.arcade.distanceBetween(ledges.getAt(0),player) > 500) {
			ledges.getAt(0).destroy();
		}
		if(this.game.physics.arcade.distanceBetween(shoots.getAt(0),player) > 500) {
			shoots.getAt(0).destroy();
		}
		
		scoreText.setText("score : " + scoreH);	
		
    },
	spawnPlayer : function() {
		player = this.game.add.sprite(368/2,350,'player');
		ledges.create(368/2,400, "ledge4");
		player.anchor.setTo(0.5,0.5);
		this.game.physics.arcade.enable(player);
		player.body.gravity.y = 600;
	},
	jump : function(n,ledge) {
		ledge.kill();
		player.body.velocity.y = -375;
	},
	
	shoot : function() {
		if(this.game.input.mousePointer.y>player.y+40) {
			var bullet = shoots.getFirstExists(false);
			bullet.checkWorldBounds = true;
			bullet.reset(player.x, player.y);
			bullet.rotation = this.game.physics.arcade.angleToPointer(bullet);
			this.game.physics.arcade.velocityFromRotation(bullet.rotation+3.14, 600, bullet.body.velocity);
		}
	},
	killBad : function(bad) {
		bad.kill();
	},
	loadLedge : function() {
		for(var i = 0; i < 20; i++) {
			var x = this.game.rnd.integerInRange(10, 318);
			var ledge = ledges.create(x,i*50, "ledge4");
			ledge.body.checkCollision.down = false;
			ledge.body.immovable = true;
		}
	},
	spawnLedge : function(y) {
		var x = this.game.rnd.integerInRange(10, 318);
		var ledge = ledges.create(x,y, "ledge4");
		ledge.body.checkCollision.down = false;
		ledge.body.immovable = true;
	},
	
	spawnBad : function (y)  {
		var x = this.game.rnd.integerInRange(10, 318);
		var bad = bads.create(x,y, "bad1");
				this.game.add.tween(bad)
				.to({ x: bad.x+20}, 500)
				.to({ x: bad.x-20}, 1000)
				.to({ x: bad.x}, 500)
				.loop().start();
	
	},
	killPlayer : function() {
		this.game.state.start("GameOver");
	},
};