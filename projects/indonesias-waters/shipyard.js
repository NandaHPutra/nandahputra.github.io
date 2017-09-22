var theShipyard = function(){};
theShipyard.prototype = {

  preload: function(){
    game.load.image('bg', 'assets/shipyard/bg.png');
    game.load.spritesheet('btn', 'assets/city/btn.png', 58, 24);
    game.load.spritesheet('back', 'assets/buy/back.png', 58, 24);
  },

  create:function(){
    game.add.sprite(0,0,'bg');
    game.add.button(693,128, 'btn', this.cannon, this, 0, 0, 1, 0);
    game.add.button(693,228, 'btn', this.acc, this, 0, 0, 1, 0);
    game.add.button(693,327, 'btn', this.armor, this, 0, 0, 1, 0);
    game.add.button(693,426, 'btn', this.speed, this, 0, 0, 1, 0);
    game.add.button(693,525, 'btn', this.reload, this, 0, 0, 1, 0);
    cashText = game.add.text(650,45,cash , { font: '15px arial'});
    game.add.button(30,10, 'back', this.back, this, 0, 0, 1, 0);
  },

  cannon:function(){
    if(cannonLevel<4&&cash>=200){
      cannonLevel++;
      cash-=200;
    }
    cashText.setText(cash);
    this.resetStat();
  },

  acc:function(){
    if(accLevel<4&&cash>=200){
      accLevel++;
      cash-=200;
    }
    cashText.setText(cash);
    this.resetStat();
  },

  reload:function(){
    if(reloadLevel<4&&cash>=200){
      reloadLevel++;
      cash-=200;
    }
    cashText.setText(cash);
    this.resetStat();
  },

  speed:function(){
    if(speedLevel<4&&cash>=200){
      speedLevel++;
      cash-=200;
    }
    cashText.setText(cash);
    this.resetStat();
  },

  armor:function(){
    if(armorLevel<4&&cash>=200){
      armorLevel++;
      cash-=200;
    }
    cashText.setText(cash);
    this.resetStat();
  },

  back:function(){
    this.game.state.start("TheCity");
  },

  resetStat:function(){
    accel=0.15+0.02*speedLevel;
    maxSpeed=3+0.3*speedLevel;
    cannonCooldown = 500-reloadLevel*50;
    cannonQty = 20+cannonLevel*4;
    cannonRange = 70+accLevel*5;
    cannonAccuracy=0.75+accLevel*0.03;
    maxHealth=100+armorLevel*50;
  }
}