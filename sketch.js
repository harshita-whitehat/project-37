var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState;
var readState;
var sadDog,garden,washroom, database;

function preload(){
   dogImg=loadImage("Images/Dog.png");
   dogImg1=loadImage("Images/happy dog.png");
   sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");
bedroom=loadImage("Images/Bed Room.png");

  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);
  
  foodObj = new Food();


  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;
   
  feed=createButton("Feed the dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(500,95);
  addFood.mousePressed(addFoods);

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

    //read game state from database
    readState=database.ref('gameState');
    readState.on("value",function(data){
      gameState=data.val();
    });
}

// function to display UI
function draw() {
  //    background(46,139,87);
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
     }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
  }
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  

  drawSprites();
 
}
//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dogImg1);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
  //function to read food Stock
  function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }
  
  
  //function to update food stock and last fed time
  function feedDog(){
    dog.addImage(dogImg1);
    
    if(foodObj.getFoodStock()<= 0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0);
    }else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    }
    
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
  
  //function to add food in stock
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }