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
  for(let i=1;i<10;i++){
    console.log(i)
    var graphics = this.add.graphics();
    let randx = Phaser.Math.Between(0,width);
    let randy = Phaser.Math.Between(0,height);
    let r = this.add.circle(randx,randy,4,0xffffff);
    circleGroup.add(r)
    this.physics.add.existing(r, false);
    r.body.setCollideWorldBounds(true);
    r.body.setCircle(40);
    //let r = graphics.strokeCircleShape({x:randx, y:randy, radius:4});
    //let circle = new Phaser.Geom.Circle(randx,randy,20);
    //let graphi = this.add.graphics({fillStyle: { color: 0xff00ff } });
    //graphi.fillCircleShape(circle);
    //circleGroup.add(graphi);
  }
  var r1 = this.add.circle(200, 200, 33, 0x02ff00);


}

function update(){
  let { width, height } = this.sys.game.canvas;
  /*フレーム更新*/  
  for(let c of circleGroup.getChildren()){
    let x = c.x;
    let y = c.y;
    let r = c.radius;
   // console.log(r,y,1)
    let caninflate = true;
    let circleCollide = circleGroup.getChildren().some((d)=>(!(c===d)) & (Phaser.Math.Distance.Between(x,y,d.x,d.y)<=r+d.radius));
    let rectCollide = rectangleGroup.getChildren().some((d)=>(!(c===d) )& Phaser.Geom.Intersects.CircleToRectangle(c,d));
    //それぞれ円と長方形(障害物？)とどれだけcollideしているか
    let inCam = Phaser.Geom.Intersects.CircleToRectangle(c,bg);
    //画面内に入っているか
    if(!circleCollide&!rectCollide&!inCam){
      c.radius += 1;
      console.log(circleCollide,rectCollide,inCam)
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