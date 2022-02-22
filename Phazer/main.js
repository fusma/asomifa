var sceneConfig = {
  preload: preload,
  create: create,
  update: update,
  pack: {
      files: [
      ]
  }
};

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: "100%",
  height: "100%",
  mode: Phaser.Scale.RESIZE,
  scene: sceneConfig,
  fps: {
		target: 60,// 1秒間に24回update
		forceSetTimeOut: true
	},
  physics:{
    default:"arcade",
    arcade:{
      debug: false,//trueにすると当たり判定が見える
      gravity:{y:0},
    }
  }
};

var game = new Phaser.Game(config);

//衝突判定に使うやつ(特に下)
let circleGroup;
let rectangleGroup;
//開始前フラグ
let beforeStart = true;
//人数
var CPUNUM = 6;


function createStage(){
  console.log("stage created")
  //障害物はここで追加
}

function preload(){
  /*ロード時関数*/
  console.log("preload start")
  createStage()//もろもろのスプライトを配置
  this.load.image("shimashima_1", "https://cdn.glitch.global/2e525d0d-af84-4fb3-8435-b9d42b387e12/shimashima_2.png?v=1645509102115");
}


function create(){
  let { width, height } = this.sys.game.canvas;
  bg = this.add.rectangle(width/2, height/2, width,height, 0xc8c8c8);
  /*初期化関数*/
  console.log("create start")
  circleGroup = this.physics.add.group();
  rectangleGroup = this.physics.add.group();
  //ゲーム終了のフラグ
  this.gameEnd = false;
  this.endDone = false;//終了処理が終わった時用


  //円と四角をそれぞれ生成する関数
  function addCircle(x,y,radius,isPlayer,color=0xffffff,Name=""){
    if(isPlayer){color=0xffff00;}
    let r = this.add.circle(x,y,radius,color);
    circleGroup.add(r)
    this.physics.add.existing(r,false);
    r.body.setCircle(radius+3,-radius/2,-radius/2);
    r.setData("canInflate",true);
    r.setData("isPlayer",isPlayer);
    r.setData("Name",Name);
  }

  function addRect(x,y,w,h,color=0x303030){
    // let rect = this.add.rectangle(width*0.3,height*0.4,150*width/800,70*height/600,0x303030);
    let rect = this.add.image(width*0.3,height*0.4, "shimashima_1");
    rect.scale = 0.08;
    rectangleGroup.add(rect)
  }

  //障害物はここで足す
  addRect.bind(this)(width*0.3,height*0.4,150*width/800,70*height/600,0x303030)

  function overlap(a,b){
    //丸同士の衝突の処理
    a.setData("canInflate",false);
  }
  //衝突判定の追加


  //クリック時に起こること
  this.input.on('pointerdown', function(pointer){
    if(beforeStart){//開始前フラグの破壊と、開始用のやつ
    this.playerX = pointer.x;
    this.playerY = pointer.y;
    addCircle.bind(this)(this.playerX,this.playerY,2,isPlayer=true);
    for(let i=0;i<CPUNUM;i++){
      //ほかの円の生成処理
      //console.log(i);
      let randx = Phaser.Math.Between(0,width);
      let randy = Phaser.Math.Between(0,height);
      cnt = 0;
      while(rectangleGroup.getChildren().some((x)=>Phaser.Geom.Rectangle.Contains(x.getBounds(),randx,randy))){
        randx = Phaser.Math.Between(0,width);
        randy = Phaser.Math.Between(0,height);
        console.log(randx,randy,cnt);
        cnt += 1;
      }
      let radius = 2;
      addCircle.bind(this)(randx,randy,radius);
      for(let c of circleGroup.getChildren()){
        this.physics.add.overlap(c,circleGroup,overlap,null,this)
        this.physics.add.overlap(c,rectangleGroup,overlap,null,this)
      }
    }
    beforeStart = false;
    }else if(this.endDone){
      console.log("bye");
      window.location.reload();
    }
    //当たり判定の追加

 }.bind(this));


}

function update(){
  let { width, height } = this.sys.game.canvas;
  let self = this;
  if(!self.endDone){
  let updatecnt = false;
  if(beforeStart){
    console.log("")
  }else{
  /*フレーム更新*/  
  for(let i=0;i<1;i++){
    for(let c of circleGroup.getChildren()){
      let x = c.x;
      let y = c.y;
      let r = c.radius;
    // console.log(r,y,1)
      let inCam = x>r & x+r < width & y>r & y+r < height;
      if(c.data.values.canInflate& inCam){
        updatecnt = true;
        let dr = 4 //1fに大きくなるサイズ
        let shield = 2;//shield は、当たり判定と実際の円の大きさの差
        radius = r + dr;
        c.radius = radius;
        c.body.setCircle(c.radius+shield,-shield,-shield);
      }
    }
  }
  //アップデートが全てうまく行けば終了処理
  if(!updatecnt & !this.endDone){
    //終了処理

    gameEnd();
  }
  }



  function gameEnd(){
    let max_R = -1;
    let champ = -1;
    circleGroup.getChildren().forEach((c,index) => {
      //プレイヤー名の記入
      let cx = c.x;
      let cy = c.y;
      let cr = c.radius;
      let text = self.add.text(cx,cy,"player"+index, {fontFamily:"Ubuntu",color:"black",boundsAlignH:"center",fontSize:Math.max(7,cr*0.3)}).setOrigin(0.5,0.5);
      if(max_R<c.radius){
        max_R = c.radius;
        champ = index;
      }
    })
    //優勝の円の色を変える
    self.champCircle = circleGroup.getChildren()[champ]
    self.champCircle.setFillStyle(0xff0000);
    self.endDone = true;
    let champx = self.champCircle.x;
    let champy = self.champCircle.y;
    //self.champCircle.data.values.isPlayerが、playerがおいたものかどうかのフラグ
    if(self.champCircle.data.values.isPlayer){
      let text = self.add.text(width/2,height/2,"You Win",{color:"Green",fontFamily:'Ubuntu',fontSize:100}).setOrigin(0.5, 0.5);
    }else{
      console.log(self.champCircle.data);
      let text = self.add.text(champx,champy,"", {color:"Yellow",boundsAlignH:"center",fontSize:30}).setOrigin(0.5, 0.5);
    }
  }

}


function addPoint(){
  //場所の追加、条件設定など
  //リストを返す
  let P_s = [];
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * (config.width + 1));
    let y = Math.floor(Math.random() * (config.height + 1));
    P_s.push([x, y]);
  }
  return P_s
}
}