var theCity = function(){};
theCity.prototype = {

  preload: function(){
    game.load.image('bg', 'assets/city/bg.png');
    game.load.spritesheet('btn', 'assets/city/btn.png', 58, 24);
  },

  create:function(){
    game.add.sprite(0,0,'bg');
    game.add.button(307,251, 'btn', this.shipyard, this, 0, 0, 1, 0);
    game.add.button(699,251, 'btn', this.spice, this, 0, 0, 1, 0);
    game.add.button(307,541, 'btn', this.inn, this, 0, 0, 1, 0);
    game.add.button(699,541, 'btn', this.waters, this, 0, 0, 1, 0);
  },

  waters:function(){
    this.game.state.start("TheGame");
  },

  spice:function(){
    this.game.state.start("TheBuy");
  },

  shipyard:function(){
    this.game.state.start("TheShipyard");
  },

  inn:function(){
    prices = [
  [20,rand(20,23),rand(23,26),rand(17,20),rand(17,20),rand(17,20),rand(20,23),rand(14,17),rand(17,20),rand(11,14),rand(7,11),rand(7,11)],
  [rand(20,23),20,rand(17,20),rand(20,23),rand(17,20),rand(20,23),rand(14,17),rand(17,20),rand(14,17),rand(17,20),rand(11,14),rand(11,14)],
  [rand(23,26),rand(17,20),20,rand(17,20),rand(20,23),rand(17,20),rand(17,20),rand(20,23),rand(23,26),rand(11,14),rand(17,20),rand(17,20)],
  [rand(23,26),rand(20,23),rand(17,20),20,rand(20,23),rand(11,14),rand(17,20),rand(11,14),rand(17,20),rand(17,20),rand(23,26),rand(14,17)],
  [rand(20,23),rand(20,23),rand(17,20),rand(17,20),20,rand(17,20),rand(20,23),rand(17,20),rand(14,17),rand(17,20),rand(17,20),rand(14,17)],
  [rand(20,23),rand(17,20),rand(11,14),rand(17,20),rand(11,14),20,rand(11,14),rand(23,26),rand(23,26),rand(20,23),rand(11,14),rand(17,20)],
  [rand(20,23),rand(20,23),rand(17,20),rand(14,17),rand(20,23),rand(17,20),20,rand(14,17),rand(17,20),rand(11,14),rand(23,26),rand(17,20)],
  [rand(17,20),rand(17,20),rand(17,20),rand(17,20),rand(17,20),rand(14,17),rand(17,20),20,rand(11,14),rand(11,14),rand(17,20),rand(23,26)],
  [rand(17,20),rand(11,14),rand(20,23),rand(20,23),rand(20,23),rand(23,26),rand(14,17),rand(20,23),20,rand(17,20),rand(20,23),rand(26,29)],
  [rand(14,17),rand(11,14),rand(17,20),rand(14,17),rand(17,20),rand(20,23),rand(17,20),rand(17,20),rand(23,26),20,rand(17,20),rand(23,26)],
  [rand(11,14),rand(7,11),rand(20,23),rand(20,23),rand(14,17),rand(17,20),rand(11,14),rand(17,20),rand(17,20),rand(17,20),20,rand(29,32)],
  [rand(7,11),rand(7,11),rand(11,14),rand(23,26),rand(11,14),rand(20,23),rand(17,20),rand(20,23),rand(11,14),rand(17,20),rand(17,20),20]
    ];
  }
}