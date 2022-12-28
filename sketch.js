var face_x = [] //臉X軸陣列
var face_y = [] //臉Y軸陣列
var face_size = [] //臉大小陣列
var face_num = 3 //臉數量陣列
var song
var songIsplay=false
var amp
var vol=0
var m_x,m_y
var music_btn,mouse_btn,Speech_btn
var mouseIsplay=true
var myRec = new p5.SpeechRec();
var result
var clr=[] //宣告陣列clr=[]
var clr_r=[]  //宣告陣列資料，記錄每一朵花的基本資料
var positionListX =[]  //所有花的X軸位置，List串列，array陣列
var positionListY =[]  //所有花的Y軸位置
var clrList=[]      //所有花瓣顏色
var clr_r_List = []  //所有花圓心顏色
var sizeList =[]  //所有花的大小
//------------------手勢辨識變數宣告-------------------
let handpose; //手勢
let video;//攝影機取得放影像資料的地方
let predictions = [];//放手勢辨識資料的陣列
let pointerX, pointerY, pointerZ;
let pointerX8,pointerY8,pointerZ8,pointerX4,pointerY4,d//d為4,8點之間的距離
let pointerX14,pointerY14,pointerX16,pointerY16//用四個變數紀錄第14(pointerX14,pointerY14)及第16個點(pointerX16,pointerY16)的xy軸
//---------------------------------------------------

function preload(){
  song = loadSound("music408.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)

  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", (results) => {
    predictions = results;
    });
  video.hide();

  music_btn = createButton("播音樂") //設定播音樂的按鈕
  music_btn.position(300,10) //設定按鈕的位置(200,10)
  music_btn.size(250, 100) //設定按鈕大小(250,100)
  music_btn.style('background-color', 'black') //設定按鈕背景
  music_btn.style('font-size', '44px') //設定按鈕文字大小
  music_btn.style('color', 'pink') //設定按鈕文字顏色
  music_btn.mousePressed(music_btn_pressed) //設定按鈕點擊的連結函數

  mouse_btn = createButton("暫停音樂")
  mouse_btn.position(570,10)
  mouse_btn.size(350, 100)
  mouse_btn.style('background-color', 'black')
  mouse_btn.style('font-size', '44px')
  mouse_btn.style('color', 'pink')
  mouse_btn.mousePressed(mouse_btn_pressed) 

  Speech_btn = createButton("語音辨識(跳舞/不要跳)") 
  Speech_btn.position(940,10) 
  Speech_btn.size(350, 100)
  Speech_btn.style('background-color', 'black');
  Speech_btn.style('font-size', '32px')
  Speech_btn.style('color', 'pink')
  Speech_btn.mousePressed(Speech_btn_pressed)

  for(var i=0;i<face_num;i++){
    face_size[i] = random(250,300)  
    face_x[i] = random(100,width)
    face_y[i] = random(300,height-200)
  }
}

function modelReady() {
  console.log("Model ready!");
}


function music_btn_pressed(){
  song.stop()
  song.play()
  songIsplay = true
  mouseIsplay = false
  amp=new p5.Amplitude()  
  music_btn.style('background-color', '#a8dadc');//設定按鈕顏色 
  mouse_btn.style('background-color', 'black');//設定按鈕顏色 
  Speech_btn.style('background-color', 'black');//設定按鈕顏色 
}

function mouse_btn_pressed(){
  song.pause()
  mouseIsplay = true
  songIsplay = false
  music_btn.style('background-color', 'black');//設定按鈕顏色 
  mouse_btn.style('background-color', '#a8dadc');//設定按鈕顏色 
  Speech_btn.style('background-color', 'black');//設定按鈕顏色 
}

function Speech_btn_pressed(){ //語音說話
  music_btn.style('background-color', 'black');//設定按鈕顏色 
  mouse_btn.style('background-color', 'black');//設定按鈕顏色 
  Speech_btn.style('background-color', '#a8dadc');//設定按鈕顏色 
  myRec.onResult = showResult;
  myRec.start();  

}

function showResult() //辨識你語音說什麼判斷跳不跳舞
{

	if(myRec.resultValue==true) {
    push()
      translate(0,0)
      background(192, 255, 192);
      fill(255,0,0)
      textStyle("italic")
      text(myRec.resultString,1200,10);
      text(myRec.resultString,0, height/2);
    pop()
	     result = myRec.resultString
         if(myRec.resultString==="跳舞")
            {
                music_btn_pressed()  //說跳舞等於你按下撥放音樂按鈕讓他跳舞
             }
         if(myRec.resultString==="不要跳")
            {
              song.pause()
              mouseIsplay = true
              songIsplay = false
              mouse_btn_pressed()  //說不要跳等於你按下暫停音樂按鈕讓他停止
             }
	}
}

function draw() {
  //攝影機反向
  translate(width, 0);
  scale(-1, 1);
  //+++++++++
  background(220);

  drawKeypoints(); //取得手指位置
  d= dist(pointerX8,pointerY8,pointerX4,pointerY4)
  for(var k=0;k<positionListX.length;k++)
  {
    r_Flower(clrList[k], clr_rList[k],sizeList[k],positionListX[k],positionListY[k])
  }

  textSize(40)
  text("X:"+mouseX+" Y:"+mouseY,50,50)

  push()
    textSize(40)
    fill(255,0,0)
    textStyle("italic")
    text(result,1100,200)
  pop()

  for(var j=0;j<face_num;j++){

    push()
    var f_s = face_size[j]
    translate(face_x[j],face_y[j])
    rectMode(CENTER)
    fill("#99582a")
    rect(0,0,f_s,f_s-100)
    fill("#6f1d1b")
    triangle(0,-f_s/15,-f_s/30,f_s/15,f_s/30,f_s/15)
    fill("#bb9457")
    ellipse(-f_s/4,-f_s/3,f_s/5)
    ellipse(f_s/4,-f_s/3,f_s/5)
    fill("#432818")
    ellipse(-f_s/4+map(mouseX,0,width,-f_s/40,f_s/12),-f_s/3+map(mouseY,0,height,-f_s/40,f_s/12),f_s/12)
    ellipse(f_s/4+map(mouseX,0,width,-f_s/40,f_s/12),-f_s/3+map(mouseY,0,height,-f_s/40,f_s/12),f_s/12)

    if(!songIsplay)
    {
      fill("#a68a64")
      noStroke()
      rect(0,f_s/3.8,f_s/1.66,f_s/15)
    }
    else
    {
      vol = amp.getLevel() //取得聲音值(值為0~1之間)
      // console.log(vol)
      fill("#a68a64")
      noStroke()
      rect(0,f_s/3.8,f_s/1.8,f_s/10,map(vol,0,0.5,f_s/5,f_s/1.2))
    }

    pop()
  }
}

if(songIsplay){
  vol = amp.getLevel()
  m_x =map(vol,0,1,0,width) 
  m_y= map(vol,0,1,0,height)
}
else
if(mouseIsplay)
{
  m_x = mouseX
  m_y= mouseY

}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      // noStroke();
      if (j == 8) {				
				pointerX8 = map(keypoint[0],0,640,0,width)
				pointerY8 = map(keypoint[1],0,480,0,height)
        pointerZ8 = map(keypoint[2],0,480,0,height)
        console.log(pointerZ8)
        if(pointerZ8<-150)
        {
          R_draw(pointerX8,pointerY8)
        }
				ellipse(pointerX8, pointerY8, 30, 30);
      } else
      if (j == 4) {   
		fill(255,0,0)
        pointerX4 = map(keypoint[0],0,640,0,width)
        pointerY4 = map(keypoint[1],0,480,0,height)
				// pointerZ = keypoint[2]
				// print(pointerZ)
        ellipse(pointerX4, pointerY4, 30, 30);
		
      } else
      if (j == 14) {
        pointerX14 = keypoint[0];
        pointerY14 =  keypoint[1];
      } else
      if (j == 16) {
        pointerX16 = keypoint[0];
        pointerY16 =  keypoint[1];
      }
			
    }
  
  }
}

function R_draw(handX,handY)
{
  positionListX.push(handX) //把花X位置存入到positionListX list資料內
  positionListY.push(handY) //把花Y位置存入到positionListY list資料內
  clrList.push(colors[int(random(colors.length))])
  clr_rList.push(colors_r[int(random(colors_r.length))]) //花圓心顏色放到list
  sizeList.push(random(0.5,1.5))
  let data_total = positionListX.length //目前資料筆數
  push()
    translate(positionListX[data_total-1],positionListY[data_total-1])
    drawFlower(clrList[data_total-1], clr_rList[data_total-1], sizeList[data_total-1]) 
  pop() 

}