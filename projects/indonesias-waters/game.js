
var theGame = function(){};
theGame.prototype = {


  preload: function(){
    game.load.image('laut', 'assets/laut.png');
    game.load.spritesheet('kapal', 'assets/kapal.png',60,43);

    game.load.image('sumatra', 'assets/sumatra.png');
    game.load.image('jawa', 'assets/jawa.png');
    game.load.image('kalimantan', 'assets/kalimantan.png');
    game.load.image('bali', 'assets/bali.png');
    game.load.image('ntb', 'assets/ntb.png');
    game.load.image('ntt', 'assets/ntt.png');
    game.load.image('timor', 'assets/timor.png');
    game.load.image('sulawesi', 'assets/sulawesi.png');
    game.load.image('irian', 'assets/irian.png');

    game.load.image('seaport', 'assets/seaport.png');

    game.load.spritesheet('aim', 'assets/aim.png',60,250);
    game.load.image('projectile', 'assets/projectile.png');
    game.load.spritesheet('splash', 'assets/splash.png',30,30);
    game.load.spritesheet('blast', 'assets/blast.png',30,30);
    game.load.spritesheet('smoke', 'assets/smoke.png',25,25);

    game.load.spritesheet('left', 'assets/buttons/left.png', 45, 45);
    game.load.spritesheet('right', 'assets/buttons/right.png', 45, 45);
    game.load.spritesheet('up', 'assets/buttons/up.png', 45, 45);
    game.load.spritesheet('down', 'assets/buttons/down.png', 45, 45);
    game.load.spritesheet('none', 'assets/buttons/none.png', 45, 60);
    game.load.spritesheet('fire', 'assets/buttons/fire.png', 75, 40);

    game.load.physics('indo', 'assets/indocollider.json');
    game.load.physics('ckapal', 'assets/kapalcollider.json');
    game.load.physics('cseaport', 'assets/seaportcollider.json'); 
  },

  create:function(){
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    playerCG = game.physics.p2.createCollisionGroup();
    landsCG = game.physics.p2.createCollisionGroup();
    projectilesCG = game.physics.p2.createCollisionGroup();
    AIsCG = game.physics.p2.createCollisionGroup();
    seaportsCG = game.physics.p2.createCollisionGroup();  

    game.add.sprite(0,0,'laut');  
    game.world.setBounds(0,0,frameX, frameY);
    game.add.tileSprite(0,0,8200,3000,'laut');

    this.createSeaports();
    this.createLands();  
    this.createPools();
    this.createAIs();
    this.createPlayer();
    this.createButtons();

    health = game.add.sprite(50,50,'kapal');
    health.frame = 3;
    health.rotation = 0.5*Math.PI;

    this.aimPort();
    gear=0;
    player.frame=gear+1;
    turning=NONE;
  },

  createPools: function(){
    projectiles = game.add.group();
    projectiles.enableBody = true;
    projectiles.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < 100; i++)
    {
      var proj = projectiles.create(0,0, 'projectile');
      proj.body.setCircle(3);
      proj.body.setCollisionGroup(projectilesCG);
      proj.body.collides([playerCG, AIsCG, landsCG],this.explode,this);
      proj.body.mass=0.001;
      proj.kill();
    } 

    blasts=game.add.group();
    for(var i=0; i<100; i++) {
        var p = blasts.create(0,0, 'blast');
        p.anchor.setTo(0.5,0.5);
        p.kill();
    }
    splashes=game.add.group();
    for(var i=0; i<100; i++) {
        var p = splashes.create(0,0, 'splash');
        p.anchor.setTo(0.5,0.5);
        p.kill();
    }
    smokes=game.add.group();
    for(var i=0; i<200; i++) {
        var p = smokes.create(0,0, 'smoke');
        p.anchor.setTo(0.5,0.5);
        p.kill();
    }
  },
  createSeaports: function(){
    seaports = game.add.group();
    seaports.enableBody = true;
    seaports.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < seaportX.length; i++)
    {
      var s = seaports.create(seaportX[i], seaportY[i], 'seaport'); 
      s.body.clearShapes();        
      s.body.loadPolygon('cseaport', 'seaport');
      s.body.setCollisionGroup(seaportsCG);
      s.body.collides([playerCG]);
      s.body.data.motionState = 2;


    } 
  },

  createLands: function(){
    lands = game.add.group();
    lands.enableBody = true;
    lands.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < 9; i++)
    {
      var land = lands.create(landsX[i], landsY[i], landNames[i]); 
      land.body.clearShapes();        
      land.body.loadPolygon('indo', landNames[i]);
      land.body.setCollisionGroup(landsCG);
      land.body.collides([playerCG,projectilesCG]);
      land.body.data.motionState = 2;
      land.health=99999999999;
    } 
  },

  createPlayer: function(){
    aim = game.add.sprite(0, 0, 'aim');
    aim.anchor.setTo(0.5,0.5);

    player = game.add.sprite(seaportSpawnX[startingPoint],seaportSpawnY[startingPoint],'kapal');
    game.physics.p2.enable(player,false);  
    player.body.clearShapes();
    player.body.loadPolygon('ckapal', 'kapal');
    player.body.setCollisionGroup(playerCG);
    player.body.collides(landsCG, this.crash, this);
    player.body.collides([AIsCG, projectilesCG]);
    player.body.collides([seaportsCG],this.enter,this);
    player.frame=gear+1;
    player.body.rotation=0.8;
    player.health=maxHealth;
  },

  createAIs: function(){
    AIs = game.add.group();
    AIs.enableBody = true;
    AIs.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < AIX.length; i++)
    {
      var ai = AIs.create(AIX[i], AIY[i], 'kapal'); 
      ai.frame = 3;
      ai.health=100;
      ai.body.clearShapes();        
      ai.body.loadPolygon('ckapal', 'kapal');
      ai.body.setCollisionGroup(AIsCG);
      ai.body.collides([playerCG,projectilesCG]);
      ai.tint = this.rgbToHex(150,150,150);
      AIaimings.push(1);
      AIfireCDs.push(0);  
    } 
  },

  createButtons: function(){
    btnLeft = game.add.button(0,0, 'left', this.turnLeft, this, 0, 0, 1, 0);
    btnRight = game.add.button(0,0, 'right', this.turnRight, this, 0, 0, 1, 0);
    btnUp = game.add.button(0,0, 'up', this.gearUp, this, 0, 0, 1, 0);
    btnDown = game.add.button(0,0, 'down', this.gearDown, this, 0, 0, 1, 0);

    btnPort = game.add.button(0,0, 'left', this.aimPort, this, 0, 0, 0, 0);
    btnSboard = game.add.button(0,0, 'right', this.aimSBoard, this, 0, 0, 0, 0);

    btnNone = game.add.button(0,0, 'none', this.aimNone, this, 0, 0, 0, 0);
    btnFire = game.add.button(0,0, 'fire', this.fireCannon, this, 0, 0, 0, 0);
  },

  gearUp: function(){if(gear==maxGear-1&&aiming!=NONE){return;}gear=gear==maxGear?maxGear:gear+1;player.frame=gear+1;},
  gearDown: function(){gear=gear==minGear?minGear:gear-1;player.frame=gear+1;},
  fireCannon: function(){if(fireCD==0&&aiming!=1){fireCD=cannonCooldown;}},
  aimPort: function(){
    if(fireCD<cannonCooldown-cannonQty){aiming=PORT; aim.frame=aiming;}
    gear=gear==maxGear?gear-1:gear;player.frame=gear+1;
    btnPort.setFrames(1, 1, 1, 1);
    btnSboard.setFrames(0, 0, 0, 0);
    btnNone.setFrames(0, 0, 0, 0);
  },
  aimSBoard: function(){
    if(fireCD<cannonCooldown-cannonQty){aiming=SBOARD; aim.frame=aiming;}
    gear=gear==maxGear?gear-1:gear;player.frame=gear+1;
    btnPort.setFrames(0, 0, 0, 0);
    btnSboard.setFrames(1, 1, 1, 1);
    btnNone.setFrames(0, 0, 0, 0);
  },
  aimNone: function(){
    if(fireCD<cannonCooldown-cannonQty){aiming=NONE; aim.frame=aiming;}
    btnPort.setFrames(0, 0, 0, 0);
    btnSboard.setFrames(0, 0, 0, 0);
    btnNone.setFrames(1, 1, 1, 1);
  },
  turnLeft: function(){
    turning=turning==NONE?PORT:NONE;
    if(turning==PORT){btnLeft.setFrames(1,1,1,1);}
    else{btnLeft.setFrames(0,0,0,0);}
    btnRight.setFrames(0,0,0,0);
  },
  turnRight: function(){
    turning=turning==NONE?SBOARD:NONE;
    if(turning==SBOARD){btnRight.setFrames(1,1,1,1);}
    else{btnRight.setFrames(0,0,0,0);}
    btnLeft.setFrames(0,0,0,0);
  },


  update: function() {
    game.camera.focusOnXY(player.body.x, player.body.y);
    this.poolUpdate();
    this.cannonUpdate();
    this.positionUpdate();
    this.AIUpdate();
    this.buttonUpdate();

    if(health==null){return;}
    health.reset(game.camera.x+240,game.camera.y+game.camera.height-100);
    health.tint = this.rgbToHex(155*(player.health>maxHealth/2?(maxHealth-player.health*2)+maxHealth:maxHealth)/maxHealth+100,155*(player.health<maxHealth/2?player.health*2:maxHealth)/maxHealth+100,100);
  },

  poolUpdate: function(){
    projectiles.forEachAlive(function (p){
      if(p.health==1){
        var sp = splashes.getFirstDead();
        sp.revive();
        sp.reset(p.body.x,p.body.y);
        sp.health=10;
      }
      p.damage(1);
    },this);

    splashes.forEachAlive(function (sp){sp.damage(1); sp.frame=Math.floor((10-sp.health)/2);},this);
    blasts.forEachAlive(function (sp){sp.damage(1); sp.frame=Math.floor((10-sp.health)/2);},this);
    smokes.forEachAlive(function (sp){sp.damage(1); sp.frame=Math.floor((10-sp.health)/2);},this);
  },
  positionUpdate: function(){
    speed = Math.sqrt(Math.pow(player.body.velocity.x,2)+Math.pow(player.body.velocity.y,2));
    if(turning==PORT) {
        player.body.rotation-=(speed/effRotSpeed<1?rotateSpeed*speed/effRotSpeed:rotateSpeed*effRotSpeed/speed)*(gear<0?-1:1);
    }else if(turning==SBOARD){
        player.body.rotation+=(speed/effRotSpeed<1?rotateSpeed*speed/effRotSpeed:rotateSpeed*effRotSpeed/speed)*(gear<0?-1:1);
    }

    var rot = player.body.rotation;

    player.body.data.force[0]=Math.cos(rot)*(accel*gear+drag*(gear<0?-1:1))*(1-speed/maxSpeed);
    player.body.data.force[1]=Math.sin(rot)*(accel*gear+drag*(gear<0?-1:1))*(1-speed/maxSpeed);
    player.body.data.force[0]-=speed==0?0:player.body.velocity.x*drag/speed;
    player.body.data.force[1]-=speed==0?0:player.body.velocity.y*drag/speed;

    aim.reset(player.body.x, player.body.y);
    aim.rotation=player.body.rotation;
  },

  cannonUpdate: function(){
    if(fireCD>cannonCooldown-cannonQty){
      var p = projectiles.getFirstDead();
      if(p != null || p != undefined) {
        p.revive();
        game.physics.p2.enableBody(p,true);
        switch(aiming){
          case PORT:
            var gunPlace = 30-45*(fireCD-cannonCooldown+cannonQty)/cannonQty;
            p.reset(player.body.x+Math.cos(player.rotation+0.5*Math.PI)*11+Math.cos(player.rotation)*gunPlace,player.body.y+Math.sin(player.rotation+0.5*Math.PI)*11+Math.sin(player.rotation)*gunPlace);
            p.health=cannonRange;
            p.body.velocity.x = ( Math.cos(player.rotation+0.5*Math.PI)+(1-2*Math.random())*(1-cannonAccuracy))*projectileSpeed;
            p.body.velocity.y = (Math.sin(player.rotation+0.5*Math.PI)+(1-2*Math.random())*(1-cannonAccuracy))*projectileSpeed;
            break;
          case SBOARD:
            var gunPlace = -30+45*(fireCD-cannonCooldown+cannonQty)/cannonQty;
            p.reset(player.body.x-Math.cos(player.rotation+0.5*Math.PI)*11-Math.cos(player.rotation)*gunPlace,player.body.y-Math.sin(player.rotation+0.5*Math.PI)*11-Math.sin(player.rotation)*gunPlace);
            p.health=cannonRange;
            p.body.velocity.x = (Math.cos(player.rotation-0.5*Math.PI)-(1-2*Math.random())*(1-cannonAccuracy))*projectileSpeed;
            p.body.velocity.y = (Math.sin(player.rotation-0.5*Math.PI)-(1-2*Math.random())*(1-cannonAccuracy))*projectileSpeed;
            break;
        }

        var s = smokes.getFirstDead();
        s.revive();
        s.reset(p.body.x,p.body.y);
        s.health=10;
      }    
    }
    fireCD=fireCD>0?fireCD-1:0;
  },

  AIUpdate: function(){
    AIs.forEachAlive(function (AI){

      var AIindex = AIs.getIndex(AI);
      var AIfireCD = AIfireCDs[AIindex];
      var AIaiming = AIaimings[AIindex];
      var AItoPlayer = this.distance(player.body.x, AI.body.x, player.body.y, AI.body.y);

      if(AItoPlayer<200){
        var targetAngle = game.physics.arcade.angleToXY(AI, player.body.x, player.body.y);
        if(targetAngle != AI.rotation) {
            var delta =  Math.abs(targetAngle-AI.rotation+0.5*Math.PI)<Math.abs(targetAngle-AI.rotation-0.5*Math.PI)?targetAngle-AI.rotation+0.5*Math.PI:targetAngle-AI.rotation-0.5*Math.PI;
            if(delta > 0.2) {
              AI.body.rotation+=AIrotatespeed;
            } else if(delta < -0.2){
              AI.body.rotation-=AIrotatespeed;
            } else if(AIfireCD==0){
              AIaimings[AIindex] = this.distance(AI.body.x+Math.cos(AI.rotation+Math.PI*0.5)*10,player.body.x,AI.body.y+Math.sin(AI.rotation+Math.PI*0.5)*10,player.body.y)>this.distance(player.body.x,AI.body.x+Math.cos(AI.rotation-Math.PI*0.5)*10,player.body.y,AI.body.y+Math.sin(AI.rotation-Math.PI*0.5)*10)?SBOARD:PORT;
              AIfireCDs[AIindex]=AIcannonCooldown;
            }
            AI.body.velocity.x = -Math.cos(AI.rotation) * AImaxspeed;
            AI.body.velocity.y = -Math.sin(AI.rotation) * AImaxspeed;
        }else{
          AI.body.velocity.x = 0;
          AI.body.velocity.y = 0;
        }
        
        if(AIfireCD>AIcannonCooldown-AIcannonQty){
          var p = projectiles.getFirstDead();
          if(p != null || p != undefined) {
            p.revive();
            game.physics.p2.enableBody(p,true);
            switch(AIaiming){
              case PORT:
                var gunPlace = 30-45*(AIfireCD-AIcannonCooldown+AIcannonQty)/AIcannonQty;
                p.reset(AI.body.x+Math.cos(AI.rotation+0.5*Math.PI)*11+Math.cos(AI.rotation)*gunPlace,AI.body.y+Math.sin(AI.rotation+0.5*Math.PI)*11+Math.sin(AI.rotation)*gunPlace);
                p.health=AIcannonRange;
                p.body.velocity.x = (Math.cos(AI.rotation+0.5*Math.PI)+(1-2*Math.random())*(1-AIcannonAccuracy))*projectileSpeed;
                p.body.velocity.y = (Math.sin(AI.rotation+0.5*Math.PI)+(1-2*Math.random())*(1-AIcannonAccuracy))*projectileSpeed;
                break;
              case SBOARD:
                var gunPlace = -30+45*(AIfireCD-AIcannonCooldown+AIcannonQty)/AIcannonQty;
                p.reset(AI.body.x-Math.cos(AI.rotation+0.5*Math.PI)*11-Math.cos(AI.rotation)*gunPlace,AI.body.y-Math.sin(AI.rotation+0.5*Math.PI)*11-Math.sin(AI.rotation)*gunPlace);
                p.health=AIcannonRange;
                p.body.velocity.x = (Math.cos(AI.rotation-0.5*Math.PI)-(1-2*Math.random())*(1-AIcannonAccuracy))*projectileSpeed;
                p.body.velocity.y = (Math.sin(AI.rotation-0.5*Math.PI)-(1-2*Math.random())*(1-AIcannonAccuracy))*projectileSpeed;   
                break;  
            }

            var s = smokes.getFirstDead();
            s.revive();
            s.reset(p.body.x,p.body.y);
            s.health=10;
          }    
        }
      }else if(AItoPlayer<400){
        var targetAngle = game.physics.arcade.angleToXY(AI, player.body.x, player.body.y)+Math.PI;
        if(targetAngle != AI.rotation) {
            var delta =  -targetAngle+AI.rotation;
            if(delta > 0) {
              AI.body.rotation-=AIrotatespeed;
            } else {
              AI.body.rotation+=AIrotatespeed;
            }
            if(Math.abs(delta) < game.math.degToRad(1)) {
              AI.body.rotation = targetAngle;
            }
            AI.body.velocity.x = -Math.cos(AI.rotation) * AImaxspeed;
            AI.body.velocity.y = -Math.sin(AI.rotation) * AImaxspeed;
        }else{
          AI.body.velocity.x = 0;
          AI.body.velocity.y = 0;
        }
      }
      AIfireCDs[AIindex]=AIfireCDs[AIindex]>0?AIfireCDs[AIindex]-1:0;
    },this);
  },

  buttonUpdate: function() {
    btnLeft.reset(game.camera.x+30,game.camera.y+game.camera.height-100);
    btnRight.reset(game.camera.x+120,game.camera.y+game.camera.height-100);
    btnUp.reset(game.camera.x+75,game.camera.y+game.camera.height-130);
    btnDown.reset(game.camera.x+75,game.camera.y+game.camera.height-70);
    btnPort.reset(game.camera.x+game.camera.width-180,game.camera.y+game.camera.height-80);
    btnSboard.reset(game.camera.x+game.camera.width-80,game.camera.y+game.camera.height-80);
    btnNone.reset(game.camera.x+game.camera.width-130,game.camera.y+game.camera.height-95);
    btnFire.reset(game.camera.x+game.camera.width-110,game.camera.y+game.camera.height-160);

    var f = ((fireCD/cannonCooldown)*5);
    f=f<0?0:f;
    btnFire.setFrames(f,f,f,f);
  },





  crash:function(crashing, crashto) {
    var dmg = Math.floor(Math.sqrt(Math.pow(crashing.velocity.x,2)+Math.pow(crashing.velocity.y,2))*60);
    crashing.sprite.damage(dmg);
    console.log('crashing island for ' + dmg + ' damage');
  },

  explode:function(projectile, target) {
    var b = blasts.getFirstDead();
    b.revive();
    b.reset(projectile.x,projectile.y);
    b.health=10;
    projectile.sprite.kill();
    target.sprite.damage(4);
  },

  enter:function(player, seaport) {
    var portNumber = seaportX.indexOf(Math.floor(seaport.x));
    console.log(portNumber+' '+seaport.x);
    seaportNumber = portNumber;
    this.game.state.start("TheCity");
  },






  distance:function (x1, x2, y1, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  },

  rgbToHex:function (r, g, b) {
      return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
