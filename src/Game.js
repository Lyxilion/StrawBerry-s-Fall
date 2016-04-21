BasicGame.Game = function (game) {
	var player;
	var ledges;
	var ledges2;
	var ledges3;
	var ledges4;
	var bads;
	var score;
	var back;
	var compa;
	var badsCompa;
	var bad2Compa;
	var cursors;
	var jetpack;
	var bool;
	var bool2;
	var jetpackSpawn;
	var jetpackTime;
	var ledges4Spawn;
	var ledges4count;
	var springs;
	var tremps;
	var scoreText;
	var shoots;
	var nextFire;
};
BasicGame.Game.prototype = {
    create: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		back = this.game.add.tileSprite(0,0,364,768,'back');
		this.game.camera.bounds = null;
		ledges = this.game.add.group();
		ledges.enableBody = true;
		ledges.physicsBodyTypes = Phaser.Physics.ARCADE;
		ledges2 = this.game.add.group();
		ledges2.enableBody = true;
		ledges2.physicsBodyTypes = Phaser.Physics.ARCADE;
		ledges3 = this.game.add.group();
		ledges3.enableBody = true;
		ledges3.physicsBodyTypes = Phaser.Physics.ARCADE;
		
		ledges4 = this.game.add.group();
		ledges4.enableBody = true;
		ledges4.physicsBodyTypes = Phaser.Physics.ARCADE;
		
		bads = this.game.add.group();
		bads.enableBody = true;
		bads.physicsBodyTypes = Phaser.Physics.ARCADE;
		
		shoots = this.game.add.group();
		shoots.enableBody = true;
		shoots.physicsBodyTypes = Phaser.Physics.ARCADE;
		
		scoreText = this.game.add.text(25, 25, "" , { font: '30px Courrier New', fill: '#000' });
		springs = this.game.add.group();
		springs .enableBody = true;
		springs .physicsBodyTypes = Phaser.Physics.ARCADE;
		tremps = this.game.add.group();
		tremps.enableBody = true;
		tremps.physicsBodyTypes = Phaser.Physics.ARCADE;
		bool = true;
		bool2 = false;
		jetpackTime = this.game.time.now;
		cursors = this.game.input.keyboard.createCursorKeys();
		jetpackSpawn = -10000;
		ledges4Spawn = -25000;
		ledges4count = 20;
		boostTime = 0;
		nextFire = this.game.time.now;
		badsCompa = this.game.camera.y-5000;
		bad2Compa = this.game.camera.y-2500;
		compa = this.game.camera.y;
		score = this.game.camera.y;
		this.spawnPlayer();
		this.spawnLedge();
		this.loadLedge();
    },
    update: function () {
		this.game.physics.arcade.collide(player, ledges, this.jump, null , this);
		this.game.physics.arcade.collide(player, ledges3, this.jump, null , this);
		this.game.physics.arcade.collide(player, ledges2, this.killLedge2, null , this);
		this.game.physics.arcade.collide(player, ledges4, this.killLedge4, null , this);
		
		this.game.physics.arcade.collide(player, bads, this.killBad2, null , this);
		this.game.physics.arcade.overlap(player, bads, this.killPlayer, null , this);
		
		this.game.physics.arcade.overlap(bads, shoots, this.killBad, null , this);
		this.game.physics.arcade.overlap(player, springs, this.spring, null , this);
		this.game.physics.arcade.overlap(player, tremps, this.tremp, null , this);
		if(!bool) { this.game.physics.arcade.overlap(jetpack, player, this.jetpack, null , this); }
		
		score = - this.game.camera.y;
		
		back.tilePosition.y = -this.game.camera.y/2;
		
		if(this.game.camera.y < badsCompa) {
			this.spawnBad(this.game.camera.y);
			badsCompa = this.game.camera.y-5000;
		}
		
	
		if(this.game.camera.y < compa) {
			if(bool2) {
				this.spawnLedge(this.game.camera.y);
				bool2 = false;
			}
			else {
				var rnd = this.game.rnd.integerInRange(0, 10);
				if(rnd<4){
					this.spawnLedge(this.game.camera.y);
				}
				bool2 = true;
			}
			compa = this.game.camera.y -50;
		}
		
		if(this.game.input.activePointer.isDown && nextFire < this.game.time.now) {
			this.shoot();
			nextFire = this.game.time.now + 500;
		}
		if(player.body.velocity.y < 0 ) {
			player.frame = 0;
		}
		else {
			player.frame = 1;
		}
		if(player.y -350 < this.game.camera.y) {
			this.game.camera.y = player.y-350;
			back.y = player.y-350;
			scoreText.y = player.y-325;
		}
		if(this.game.physics.arcade.distanceBetween(this.game.camera,player) > 800) {
			this.killPlayer();
		}
		if(jetpackTime > this.game.time.now) {
			player.body.velocity.y = -1000;
			player.frame = 2;
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
		if (cursors.up.isDown && nextFire < this.game.time.now) {
			this.shoot2();
			nextFire = this.game.time.now + 500;
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
		if(this.game.physics.arcade.distanceBetween(ledges2.getAt(0),player) > 500) {
			ledges2.getAt(0).destroy();
		}
		if(this.game.physics.arcade.distanceBetween(ledges3.getAt(0),player) > 500) {
			ledges3.getAt(0).destroy();
		}
		if(this.game.physics.arcade.distanceBetween(shoots.getAt(0),player) > 100) {
			shoots.getAt(0).kill();
		}
		scoreText.setText("score : " + score);
    },
	spawnPlayer : function() {
		player = this.game.add.sprite(368/2,350,'player');
		var ledge = ledges.create(368/2,400, "ledge");
		ledge.body.checkCollision.down = false;
		ledge.body.immovable = true;
		player.anchor.setTo(0.5,0.5);
		this.game.physics.arcade.enable(player);
		player.body.gravity.y = 600;
		player.body.checkCollision.up = false;
	},
	jump : function(n,ledge) {
		player.body.velocity.y = -375;
	},
	killLedge2 : function(n,ledge) {
		ledge.kill();
	},
	killLedge4 : function(n,ledge) {
		player.body.velocity.y = -375;
		ledge.kill();
	},
	loadLedge : function() {
		for(var i = 0; i < 20; i++) {
			var x = this.game.rnd.integerInRange(10, 318);
			var ledge = ledges.create(x,i*50, "ledge");
			ledge.body.checkCollision.down = false;
			ledge.body.immovable = true;
		}
	},
	spawnLedge : function(y) {
		var x = this.game.rnd.integerInRange(10, 318);
		var rnd = this.game.rnd.integerInRange(0, 9);		
		if(this.game.camera.y < jetpackSpawn) {
			var ledge =  ledges.create(x,y, "ledge");
			jetpack = this.game.add.sprite(x,y-40,'jetpack');
			this.game.physics.arcade.enable(jetpack);
			jetpackSpawn = jetpackSpawn*2;
			bool = false;
		}
		if(this.game.camera.y < ledges4Spawn && ledges4count > 0) {
			ledges4count--;
			var x = this.game.rnd.integerInRange(10, 164);
			var ledge = ledges4.create(x,y, "ledge4");
			ledge.body.checkCollision.down = false;
			ledge.body.immovable = true;
			var ledge = ledges4.create(x+164,y, "ledge4");
			var x = this.game.rnd.integerInRange(10, 318);
			ledges4.create(x,y+50, "ledge4");
			if(ledges4count == 0) {
				ledges4Spawn = ledges4Spawn*2;
				ledges4count = 25;
			}
		}
		else {
			if(rnd < 3) {
				var ledge = ledges3.create(10,y, "ledge3");
				this.game.add.tween(ledge)
				.to({ x: ledge.x +300}, 4000)
				.to({ x: ledge.x }, 4000)
				.loop().start();
			}
				
			else {
				var ledge = ledges.create(x,y, "ledge");
				ledge.body.checkCollision.down = false;
				ledge.body.immovable = true;
				var rnd = this.game.rnd.integerInRange(0, 100);
				
				if(this.game.camera.y < bad2Compa) {
					this.spawnBad2(x-40,y);
					var ledge = ledges.create(x-40,y, "ledge");
					ledge.body.checkCollision.down = false;
					ledge.body.immovable = true;
				}
				else {
					if(rnd <10) {
						tremps.create(x,y-10,'tremp')
					}
					else if(rnd > 80) {
						springs.create(x,y-10,'spring')
					}
				}
				if(rnd > 40) {
					var x = this.game.rnd.integerInRange(10, 318);
					ledges2.create(x,y, "ledge2");
				}
				
				
				
				
				else if(rnd < 20) {
					var x = this.game.rnd.integerInRange(10, 318);
					ledges4.create(x,y, "ledge4");
				}
			}
		}
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
		bad.body.checkCollision.down = false;
		bad.body.checkCollision.left = false;
		bad.body.checkCollision.right = false;
		bad.body.immovable = true;
	},
	spawnBad2 : function (x,y)  {
		bad = bads.create(x,y-55, "bad2");
		this.game.add.tween(bad)
			.to({ x: bad.x+10}, 500)
			.to({ x: bad.x-10}, 1000)
			.to({ x: bad.x}, 500)
			.loop().start();
		bad2Compa = this.game.camera.y-5000;
		bad.body.checkCollision.down = false;
		bad.body.checkCollision.left = false;
		bad.body.checkCollision.right = false;
		bad.body.immovable = true;
	},
	killPlayer : function() {
		this.game.state.start("GameOver");
	},	
	jetpack : function(jetpack) {
		jetpackTime = this.game.time.now+3500;
		jetpack.kill();
		
	},
	tremp : function() {
		player.body.velocity.y = -1000;
	},
	spring : function() {
		player.body.velocity.y = -600;
	},
	shoot : function() {
			var bullet = shoots.create(player.x,player.y, "shoot");	
			bullet.rotation = this.game.physics.arcade.angleToPointer(bullet);
			this.game.physics.arcade.velocityFromRotation(bullet.rotation, 600, bullet.body.velocity);
	},
	shoot2 : function() {
		var bullet = shoots.create(player.x,player.y, "shoot");
		bullet.rotation=-3.14/2;
		this.game.physics.arcade.velocityFromRotation(bullet.rotation, 600, bullet.body.velocity);
	},
	killBad : function(bad) {
		bad.kill();
	},
	killBad2 : function(player, bad) {
		bad.kill();
		player.body.velocity.y = -450;
	}
};