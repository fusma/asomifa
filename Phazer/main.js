var sceneConfig = {
  preload: preload,
  create: create,
  update: update,
  pack: {
      files: [
          { type: 'image', key: 'sonic', url: 'assets/sprites/sonic_havok_sanity.png' }
      ]
  }
};

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: sceneConfig,
  fps: {
		target: 60,// 1秒間に24回update
		forceSetTimeOut: true
	},
  physics:{
    default:"arcade",
    arcade:{
      debug: true,
      gravity:{y:0},
    }
  }
};

var game = new Phaser.Game(config);

//衝突判定に使うやつ(特に下)
let circleGroup;
let rectangleGroup;


function preload(){
  /*ロード時関数*/
  console.log("preload start")
  createStage()//もろもろのスプライトを配置
}

function create(){
  let { width, height } = this.sys.game.canvas;
  bg = this.add.rectangle(width/2, height/2, width,height, 0xc8c8c8);
  /*初期化関数*/
  console.log("create start")
  console.log(this.config)
  circleGroup = this.physics.add.group();
  rectangleGroup = this.physics.add.group();
  for(let i=1;i<20;i++){
    console.log(i)
    var graphics = this.add.graphics();
    let randx = Phaser.Math.Between(0,width);
    let randy = Phaser.Math.Between(0,height);
    let radius = 2;
    let r = this.add.circle(randx,randy,radius-2,0xffffff);
    circleGroup.add(r)
    this.physics.add.existing(r, false);
    r.body.setCircle(radius+3,-radius/2,-radius/2);
    r.setData("canInflate",true);
    console.log(r.data.values.canInflate)
  }
  var r1 = this.add.circle(100, 100, 39, 0x02ff00);
  function overlap(a,b){
    //丸同士の衝突の処理
    a.setData("canInflate",false);
  }
  //衝突判定の追加
  for(let c of circleGroup.getChildren()){
    this.physics.add.overlap(c,circleGroup,overlap,null,this)
  }
}

function update(){
  let { width, height } = this.sys.game.canvas;
  /*フレーム更新*/  
  for(let c of circleGroup.getChildren()){
    let x = c.x;
    let y = c.y;
    let r = c.radius;
   // console.log(r,y,1)
    let inCam = x>r & x+r < width & y>r & y+r < height;
    console.log(c.data.values.canInflate)
    if(c.data.values.canInflate& inCam){
      console.log(x,y,r)
      shield = 0;//shield は、当たり判定と実際の円の大きさの差
      radius = r + 1;
      c.radius = radius;
      c.body.setCircle(c.radius+shield,-shield,-shield);
    }
  }
  let positionList = addPoint()
  //丸の生成


}

function createStage(){
  console.log("stage created")
  //障害物はここで追加
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