let d = 1;
class Stage {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.pointsArray = new Array();
    this.done = false;
    this.champ = -1;
  }

  addPoints(pointArr) {
    for (let p of pointArr) {
      this.addPoint(p);
    }
  }
  addPoint(poi) {
    let p = new Point(poi);
    this.pointsArray.push(p);
  }

  calculate() {
    /*出揃ったら1回回す**/
    for (let p of this.pointsArray) {
      let a = 1;
      //p.set_R(calcDist(p,this.pointsArray));
    }
    return this.pointsArray.map((x) => calcDist(x, this.pointsArray));
  }

  inflate() {
    /**動いている間は毎frame回す */
    let CIMap = this.pointsArray.map((x) => canInflate(x, this));
    for (let i in CIMap) {
      let poi = this.pointsArray[i];
      if (CIMap[i]) {
        poi.inflation(d);
      }
    }
    //拡大修了したら優勝を決める
    if (CIMap.every((x) => !x)) {
      this.decideChamp();
      this.done = true;
    }
  }

  decideChamp() {
    let c = -1;
    let curmax = 0;
    for (let i in this.pointsArray) {
      let poi = this.pointsArray[i];
      if (curmax < poi.drawr) {
        c = i;
        curmax = poi.drawr;
      }
    }
    this.champ = c;
  }
}

class Point {
  constructor(ps) {
    this.x = ps[0];
    this.y = ps[1];
    this.r = 0;
    this.drawr = 0;
    console.log("point!" + this.x + this.y);
  }

  set_R(r) {
    this.r = r;
  }

  getPos() {
    let res = [this.x, this.y];
    return res;
  }

  inflation(d) {
    //拡大が止まったらfalseを返す
    if (this.drawr < this.r || 1) {
      this.drawr += d;
      console.log(this.drawr);
      return true;
    } else {
      return false;
    }
  }
}

function getDist(p1, p2) {
  let x1, x2, y1, y2;
  [x1, y1] = p1.getPos();
  [x2, y2] = p2.getPos();
  let d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return d;
}

function calcDist(p1, pointsArray) {
  let meet = false;
  let res = Infinity;
  for (let p of pointsArray) {
    if (p == p1 && meet == false) {
      meet = true;
    } else {
      res = Math.min(res, getDist(p, p1));
    }
  }
  return res;
}

function canInflate(p1, stage) {
  let pointsArray = stage.pointsArray;
  //p1目線で
  let good = true;
  let meet = false;
  for (let p2 of pointsArray) {
    if (p2 == p1 && meet == false) {
      meet = true;
    } else {
      let curD = getDist(p1, p2);
      let r1 = p1.drawr;
      let x = p1.x;
      let y = p1.y;
      let r2 = p2.drawr;
      let hitTop = y - r1 - d < 0 || y + r1 + d > stage.height;
      let hitSide = x - r1 - d < 0 || x + r1 + d > stage.width;
      if (r1 + r2 + d > curD || hitTop || hitSide) {
        good = false;
      }
    }
  }
  return good;
}

function setup() {
  let w = windowWidth;
  let h = windowHeight;
  createCanvas(windowWidth, windowHeight);
  Board = new Stage(windowWidth, windowHeight);
  background(200, 200, 200);
  let P_s = [];
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * (windowWidth + 1));
    let y = Math.floor(Math.random() * (windowHeight + 1));
    P_s.push([x, y]);
  }
  Board.addPoints(P_s);
  let s = Board.calculate();
  console.log(s);
}

function draw() {
  noStroke();
  fill("FFFFFF");
  if (!Board.done) {
    for (let poi of Board.pointsArray) {
      let x, y, drawr;
      x = poi.x;
      y = poi.y;
      drawr = poi.drawr;
      //console.log(x,y,drawr);
      ellipse(x, y, 2 * drawr - 5);
    }
    for (let j = 1; j < 6; j++) {
      Board.inflate();
    }
  } else {
    for (let i in Board.pointsArray) {
      let poi = Board.pointsArray[i];
      let x, y, drawr;
      x = poi.x;
      y = poi.y;
      drawr = poi.drawr;
      //console.log(x,y,drawr);
      if (i == Board.champ) {
        fill("#e94709");
      } else {
        fill("#FFFFFF");
      }
      ellipse(x, y, 2 * drawr);
    }
  }
}
