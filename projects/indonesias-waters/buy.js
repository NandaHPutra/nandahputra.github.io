var theBuy = function(){};
theBuy.prototype = {

  preload: function(){
    game.load.image('bg', 'assets/buy/bg.png');
    game.load.image('scroll', 'assets/buy/scroll.png');
    game.load.spritesheet('buysell', 'assets/buy/buysell.png', 58, 24);
    game.load.spritesheet('back', 'assets/buy/back.png', 58, 24);
  },

  create:function(){
    game.world.setBounds(0,0,800, 1500);

    game.add.sprite(0,0,'bg');
    scroll = game.add.sprite(736,145,'scroll');
    scroll.inputEnabled = true;
    scroll.input.enableDrag();
    scroll.input.allowHorizontalDrag = false;

    for(var i=0;i<12;i++){
      var text = game.add.text(180,167+112*i,prices[seaportNumber][i], { font: '15px arial'});
    }
    for(var i=0;i<12;i++){
      var text = game.add.text(585,167+112*i,(prices[seaportNumber][i]-3), { font: '15px arial'});
    }
    for(var i=0;i<12;i++){
      invText[i] = game.add.text(670,167+112*i,(inven[i]), { font: '15px arial'});
    }

    for(var i=0;i<12;i++){
      var btn = game.add.button(126,198+112*i, 'buysell', this.buy, this, 0, 0, 1, 0);
      btn.anchor.setTo(0,0);
      btn.variable = "1-"+i;
    }
    for(var i=0;i<12;i++){
      var btn = game.add.button(188,198+112*i, 'buysell', this.buy, this, 0, 0, 1, 0);
      btn.anchor.setTo(0,0);
      btn.variable = "2-"+i;
    }
    for(var i=0;i<12;i++){
      var btn = game.add.button(573,198+112*i, 'buysell', this.sell, this, 0, 0, 1, 0);
      btn.anchor.setTo(0,0);
      btn.variable = "1-"+i;
    }
    for(var i=0;i<12;i++){
      var btn = game.add.button(634,198+112*i, 'buysell', this.sell, this, 0, 0, 1, 0);
      btn.anchor.setTo(0,0);
      btn.variable = "2-"+i;
    }

    cashText = game.add.text(650,95,cash , { font: '15px arial'});
    slotText = game.add.text(650,77,slot+'/100', { font: '15px arial'});

    game.add.button(30,10, 'back', this.back, this, 0, 0, 1, 0);
  },

  update:function(){
    game.camera.follow(scroll);
    if(scroll.y<145){scroll.y=145;}
    else if(scroll.y>1410){scroll.y=1410;}
  },

  updateText:function(){
    cashText.setText(cash);
    slotText.setText(slot+'/100');
    for(var i=0;i<12;i++){
      invText[i].setText(inven[i]);
    }
  },

  buy:function(btn){
    var item = btn.variable.split("-");
    var sum = item[0]=='1'?'1':'10';
    item = item[1];

    if(prices[seaportNumber][item]*sum<=cash){
      cash-=prices[seaportNumber][item]*sum;
      inven[item]+=parseInt(sum);
      slot+=parseInt(sum);
      this.updateText();
    }
  },

  sell:function(btn){
    var item = btn.variable.split("-");
    var sum = item[0]=='1'?'1':'10';
    item = item[1];

    if(inven[item]>=sum){
      cash+=(prices[seaportNumber][item]-3)*sum;
      inven[item]-=parseInt(sum);
      slot-=parseInt(sum);
      this.updateText();
    }
  },

  back:function(btn){
    this.game.state.start("TheCity");
  }
}