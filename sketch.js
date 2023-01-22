



var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables;
var game_score;
var flagPole;
var lives;
var jumpSound;
var collectCoinSound;
var fallingCanyonSound;
var gameOverSound;
var platform;
var final_sound=true;
var backGroundSound;

function preload()
{
    
    soundFormats('mp3', 'wav');
    jumpSound = loadSound('assets/jumpS.mp3');
    jumpSound.setVolume(0.05);
    //load sounds
    collectCoinSound = loadSound('assets/CoinCollecting.mp3');
    collectCoinSound.setVolume(0.05);
    fallingCanyonSound = loadSound('assets/FallinginCanyon.wav');
    fallingCanyonSound.setVolume(0.09);
    gameOverSound = loadSound('assets/Gameover.wav');
    gameOverSound.setVolume(0.5);
    backGroundSound = loadSound('assets/BacgroundMusic1.mp3');
    backGroundSound.setVolume(0.01);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    
    startGame();
}

function draw()
{
	background(100, 155, 255); //blue sky/background

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    //translate code
    push();
    translate(scrollPos,0);

    //draw the clouds
    for(var i=0; i<clouds.length; i++)
        {
            drawClouds(clouds[i]);
        }

	//Draw mountains
    for (var i = 0; i < mountains.length; i++)
        {
          drawMountains(mountains[i]);
        }

    // Draw trees
    for(var i=0; i<trees_x.length; i++)
            {
                drawTrees(trees_x[i]);
            }
    //Draw plaforms
     for(var i=0;i<platform.length;i++)
    {
        platform[i].draw();
    }

    //Draw canyons
    for(i=0; i<canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

	//Draw collectables 
    for(i=0; i<collectables.length; i++)
           {
               if(!collectables[i].isFound)
               {
                   drawCollectable(collectables[i]);
                   checkCollectable(collectables[i]);
               }
           }
    
    //Draw Flag
    renderFlagpole();
    
    if(flagPole.isReached == false)
        {
            checkFlagpole();
        }
    
    // pop statement to enable translation
    pop();
    
	//Draw the game character
	drawGameChar();
     
    //Check if player has died
    checkPlayerDie();
    
    //Draw game score
    fill("red");
    text("Score: " + game_score, 20, 20);
    for(var i=0; i<lives; i++)
    {
        fill("red");
        text("Lives remaining", 20, 40);
        life_token_face(150+i*40,100);
    }
    //Conditional statement for game over and end of game
    if(lives<1)
    {
         push();
        fill(50);
        noStroke();
        textSize(50);
        text("Game Over!", (width/2)-150, height/2);
        pop();
        
        return;
    } 
    else if(flagPole.isReached)
    {
        
        push();
        fill(50);
        noStroke();
        textSize(50);
        text("Level Complete!", (width/2)-150, height/2);
        pop();
        return;
        
    }
    
    //Logic to make game character move in the desired direction and backgrund scrolling 
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5;
		}
	}

    //Logic to make the game character rise and fall
    if(gameChar_y < floorPos_y)
    {
        var is_contacted=false;
        for(var i=0;i<platform.length;i++)
        {
            
            if(platform[i].check_contact(gameChar_world_x,gameChar_y))
            {
                
                is_contacted=true;
                break;
            }
        }
        if(is_contacted==false)
        {
            
            gameChar_y+=2.5;
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
        {
            isFalling = false;
        }
    //Logic to make game character plummet
    if(isPlummeting == true)
        {
            isFalling = true;
            gameChar_y += 2;
            
        }

	// Updates the position of the game character
	gameChar_world_x = gameChar_x - scrollPos;
}

 
//function to chose the keys relevant to game character movement
// When keys are pressed
function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == 37)
        {
            isLeft = true;
            
        }
    else if(keyCode == 39)
        {
            isRight = true;
            
        }
    if(keyCode == 32 && (isFalling==false))
        {
            gameChar_y-=100;
            jumpSound.play();
        }

}

//When keys are released
function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if(keyCode == 37)
        {
            isLeft = false;          
        }
    else if(keyCode == 39)
        {
            isRight = false;
        
        }

}

// ------------------------------
// Game character render function
// ------------------------------

// Functon of life token face
function life_token_face(gameChar_x, gameChar_y)
{
    
    
    stroke(0);
    strokeWeight(1);
    fill(236, 188, 180);
    ellipse(gameChar_x,gameChar_y-60,28);
    fill(255);
    ellipse(gameChar_x-7,gameChar_y-61,7,7);
    ellipse(gameChar_x+7,gameChar_y-61,7,7);
    fill(0);
    ellipse(gameChar_x+7,gameChar_y-61,2);
    ellipse(gameChar_x-7,gameChar_y-61,2);
    fill(0);
    ellipse(gameChar_x,gameChar_y-55,2);
    fill(255,255);
    ellipse(gameChar_x,gameChar_y-50,6,4);
    
}

//Function to Check if player is dead

function checkPlayerDie()
{
    if(gameChar_y<height*3 &&
      gameChar_y>height)
        {
            lives -= 1;
            if(lives>0)
            {
                startGame();
            }
            if(lives==0 && final_sound)
            {
                final_sound=false;
                gameOverSound.play();
                backGroundSound.stop();
            }
        }
}

//Function to start the game

function startGame()
{
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
    game_score = 0;
    
    scrollPos = 0;

	
	gameChar_world_x = gameChar_x - scrollPos;

    
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	
    
    trees_x = [
        145,350,575,850,145+width,350+width,
        575+width,850+width,145-width,350-width,
        575-width,850-width
    ];
    
    collectables = [ 
        {x_Pos: 200, x_Size: 55,isFound: false},
        {x_Pos: 400, x_Size: 40,isFound: false},
        {x_Pos: 600, x_Size: 55,isFound: false},
        {x_Pos: 800, x_Size: 40, isFound: false},
        {x_Pos: 1000, x_Size: 40, isFound: false},
        {x_Pos: 200+width, x_Size: 55, isFound: false},
        {x_Pos: 400+width, x_Size: 40, isFound: false},
        {x_Pos: 600+width, x_Size: 55, isFound: false},
        {x_Pos: 800+width, x_Size: 40, isFound: false},
        {x_Pos: 1000+width, x_Size: 40, isFound: false},
        {x_Pos: 200-width, x_Size: 55, isFound: false},
        {x_Pos: 400-width, x_Size: 40, isFound: false},
        {x_Pos: 600-width, x_Size: 55, isFound: false},
        {x_Pos: 800-width, x_Size: 40, isFound: false},
        {x_Pos: 1000-width, x_Size: 40, isFound: false}

    ];
    
     clouds = [ 
        {x_Pos: 70, y_Pos: 50, x_Size: 45, y_Size: 30},
        {x_Pos: 275, y_Pos: 120, x_Size: 75, y_Size: 47},
        {x_Pos: 500, y_Pos: 100, x_Size: 45, y_Size: 30},
        {x_Pos: 680, y_Pos: 75, x_Size: 50, y_Size: 38},
        {x_Pos: 870, y_Pos: 50, x_Size: 45, y_Size: 30},
        {x_Pos: 70-width, y_Pos: 50, x_Size: 45, y_Size: 30},
        {x_Pos: 275-width, y_Pos: 120, x_Size: 75, y_Size: 47},
        {x_Pos: 500-width, y_Pos: 100, x_Size: 45, y_Size: 30},
        {x_Pos: 680-width, y_Pos: 75, x_Size: 50, y_Size: 38},
        {x_Pos: 870-width, y_Pos: 50, x_Size: 45, y_Size: 30},
        {x_Pos: 70+width, y_Pos: 50, x_Size: 45, y_Size: 30},
        {x_Pos: 275+width, y_Pos: 120, x_Size: 75, y_Size: 47},
        {x_Pos: 500+width, y_Pos: 100, x_Size: 45, y_Size: 30},
        {x_Pos: 680+width, y_Pos: 75, x_Size: 50, y_Size: 38},
        {x_Pos: 870+width, y_Pos: 50, x_Size: 45, y_Size: 30}
    ];
    
    
    mountains = [ 
        {x_Pos: 110},
        {x_Pos: 655},
        {x_Pos: 110+width},
        {x_Pos: 655+width},
        {x_Pos: 110-width},
        {x_Pos: 655-width}
    ];
    
    
    canyons = [
        {x_Pos: 400, x_Size: 110},
        {x_Pos: 940, x_Size: 140},
        {x_Pos: 400+width, x_Size: 110},
        {x_Pos: 940+width, x_Size: 140},
        {x_Pos: 400-width, x_Size: 110},
        {x_Pos: 940-width, x_Size: 140}
    ];
    
    platform=[];
    platform.push(create_platform(600,floorPos_y-65,200));
    
  
    game_score = 0;
    
    flagPole = {isReached: false, x_Pos: 1100+width};
    backGroundSound.stop();
    backGroundSound.loop();
}

//Function to draw flag
function renderFlagpole()
{
    
    strokeWeight(5);
    stroke(180);
    line(flagPole.x_Pos,floorPos_y-2.5, flagPole.x_Pos, floorPos_y - 250);
    
    noStroke();
    if(flagPole.isReached)
        {
           fill("orange");
           rect(flagPole.x_Pos, floorPos_y-250, 50,50); 
        }
    else
        {
            fill("orange");
            rect(flagPole.x_Pos, floorPos_y-50, 50, 50);
        }
    
}

//Function to check flag
function checkFlagpole()
{
    var d= abs(gameChar_world_x - flagPole.x_Pos)
    
    if(d<15 && gameChar_y>=floorPos_y)
        {
           flagPole.isReached = true;
            backGroundSound.stop();
        }
          
    else
        {
            flagPole.isReached = false;
        }
}
//Function draw GameChar
function drawGameChar()
{
	
    //add jumping left code
    if(isLeft && isFalling)
	{
        
        ellipse(gameChar_x,gameChar_y,2,2);
        fill(236, 188, 180);
        rect(gameChar_x-3,gameChar_y-50, 6,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180); 
        ellipse(gameChar_x,gameChar_y-60,20,24);
        fill(255);
        ellipse(gameChar_x-7,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x-9,gameChar_y-61,1.5);
        fill(255,255);
        ellipse(gameChar_x-5,gameChar_y-53,3,2);
        fill(25,200,200);
        rect(gameChar_x-9.5,gameChar_y-43,15,22);
        rect(gameChar_x-15.5,gameChar_y-43,15,5);
        fill(236, 188, 180);
        ellipse(gameChar_x-15.5,gameChar_y-43,3,6);
        fill(150);
        rect(gameChar_x-12.5,gameChar_y-24,8,10);
        rect(gameChar_x-3,gameChar_y-21,8,13);
        fill(0);
        rect(gameChar_x-18,gameChar_y-15,11,8,4);
        rect(gameChar_x-5,gameChar_y-12,10,8,4);

	}
    
    //add jumping right code
	else if(isRight && isFalling)
	{
		
        ellipse(gameChar_x,gameChar_y,2,2);
	    fill(236, 188, 180);
        rect(gameChar_x-3,gameChar_y-50, 6,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180);
        ellipse(gameChar_x,gameChar_y-60,20,24);
        fill(255);
        ellipse(gameChar_x+7,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x+9,gameChar_y-61,1.5);
        fill(255,255);
        ellipse(gameChar_x+5,gameChar_y-53,3,2);
        fill(25,200,200);
        rect(gameChar_x-6.5,gameChar_y-43,15,22);
        rect(gameChar_x+2,gameChar_y-43,15,5);
        fill(236, 188, 180);
        ellipse(gameChar_x+17.5,gameChar_y-42,3,6);
        fill(150);
        rect(gameChar_x-7,gameChar_y-20,8,13);
        rect(gameChar_x+3,gameChar_y-24,8,10);
        fill(0);
        rect(gameChar_x+3,gameChar_y-16,12,8,4);
        rect(gameChar_x-7,gameChar_y-12,10,8,4);
	}
    
    // add walking left code
	else if(isLeft)
	{
		ellipse(gameChar_x,gameChar_y,2,2);
        fill(236, 188, 180);
        rect(gameChar_x-5,gameChar_y-50, 5,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180);
        ellipse(gameChar_x-3,gameChar_y-60,20,24);
        fill(255);
        ellipse(gameChar_x-9,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x-11,gameChar_y-61,1.5);
        fill(255,255);
        ellipse(gameChar_x-9,gameChar_y-53,3,2);
        fill(25,200,200);
        rect(gameChar_x-9.5,gameChar_y-43,13,22);
        rect(gameChar_x-8.5,gameChar_y-43,5,15);
        fill(236, 188, 180);
        ellipse(gameChar_x-6.5,gameChar_y-24,3,5.5);
        fill(150);
        rect(gameChar_x-10.5,gameChar_y-21,6,20);
        rect(gameChar_x-3,gameChar_y-20,6,20);
        fill(0);
        rect(gameChar_x-16,gameChar_y-6,11,8,4);
        rect(gameChar_x-7,gameChar_y-6,10,8,4);

	}
    
    //add walking right code
	else if(isRight)
	{
        ellipse(gameChar_x,gameChar_y,2,2);
        fill(236, 188, 180);
        rect(gameChar_x,gameChar_y-50, 6,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180);
        ellipse(gameChar_x+3,gameChar_y-60,20,24);
        fill(255);
        ellipse(gameChar_x+9,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x+11,gameChar_y-61,1.5);
        fill(255,255);
        ellipse(gameChar_x+9,gameChar_y-53,3,2);
        fill(25,200,200);
        rect(gameChar_x-5,gameChar_y-43,13,22);
        rect(gameChar_x+2,gameChar_y-43,5,15);
        fill(236, 188, 180);
        ellipse(gameChar_x+6,gameChar_y-24,3,6);
        fill(150);
        rect(gameChar_x-4.5,gameChar_y-20,6,20);
        rect(gameChar_x+3,gameChar_y-21,6,20);
        fill(0);
        rect(gameChar_x+3,gameChar_y-6,13,8,4);
        rect(gameChar_x-5,gameChar_y-6,10,8,4);

	}
    
    //add jump facing forward code
	else if(isFalling || isPlummeting)
	{
		
        fill(236, 188, 180);
        rect(gameChar_x-5,gameChar_y-50, 10,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180);
        ellipse(gameChar_x,gameChar_y-60,28);
        fill(255);
        ellipse(gameChar_x-7,gameChar_y-61,7,7);
        ellipse(gameChar_x+7,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x+7,gameChar_y-64,3);
        ellipse(gameChar_x-7,gameChar_y-64,3);
        fill(0);
        ellipse(gameChar_x,gameChar_y-55,2);
        fill(255,255);
        ellipse(gameChar_x,gameChar_y-50,6,4);
        fill(25,200,200);
        rect(gameChar_x-11.5,gameChar_y-43,22,22);
        rect(gameChar_x-15.5,gameChar_y-43,5,10);
        rect(gameChar_x+9.5,gameChar_y-51,5,10);
        fill(236, 188, 180);
        ellipse(gameChar_x+12.5,gameChar_y-53,3,6);
        ellipse(gameChar_x-12.5,gameChar_y-29,3,6);
        fill(150);
        rect(gameChar_x-11.5,gameChar_y-21,11,13);
        rect(gameChar_x-.5,gameChar_y-25,11,10);
        fill(0);
        rect(gameChar_x-11,gameChar_y-10,11,8,4);
        rect(gameChar_x+1,gameChar_y-20,10,8,4);


	}
    
    //add stand front facing code
	else
	{
		
        fill(236, 188, 180);
        rect(gameChar_x-5,gameChar_y-50, 10,10);
        stroke(0);
        strokeWeight(1);
        fill(236, 188, 180);
        ellipse(gameChar_x,gameChar_y-60,28);
        fill(255);
        ellipse(gameChar_x-7,gameChar_y-61,7,7);
        ellipse(gameChar_x+7,gameChar_y-61,7,7);
        fill(0);
        ellipse(gameChar_x+7,gameChar_y-61,2);
        ellipse(gameChar_x-7,gameChar_y-61,2);
        fill(0);
        ellipse(gameChar_x,gameChar_y-55,2);
        fill(255,255);
        ellipse(gameChar_x,gameChar_y-50,6,2);
        fill(25,200,200);
        rect(gameChar_x-11.5,gameChar_y-43,22,22);
        rect(gameChar_x-15.5,gameChar_y-43,5,10);
        rect(gameChar_x+9.5,gameChar_y-43,5,10);
        fill(236, 188, 180);
        ellipse(gameChar_x+12.5,gameChar_y-29,3,6);
        ellipse(gameChar_x-12.5,gameChar_y-29,3,6);
        fill(150);
        rect(gameChar_x-11.5,gameChar_y-21,22,16);
        line(gameChar_x,gameChar_y-21,gameChar_x,gameChar_y-5);
        fill(0);
        rect(gameChar_x-14,gameChar_y-5,11,8,4);
        rect(gameChar_x+3,gameChar_y-5,10,8,4);

	}

    
}
//Background render functions

//function to draw clouds
function drawClouds(t_clouds)
{
        
            fill(255);
            ellipse(t_clouds.x_Pos,t_clouds.y_Pos,
                    t_clouds.x_Size,t_clouds.y_Size+15);
            
            ellipse(t_clouds.x_Pos+20,t_clouds.y_Pos,
                    t_clouds.x_Size+10,t_clouds.y_Size+5);
            
            ellipse(t_clouds.x_Pos-12,t_clouds.y_Pos,
                    t_clouds.x_Size,t_clouds.y_Size); 
            
}

//function to draw mountains
function drawMountains(t_mountains)
{
      
            fill("grey");
            triangle( t_mountains.x_Pos-50,floorPos_y, t_mountains.x_Pos+150,
                      floorPos_y,t_mountains.x_Pos+80,floorPos_y-350);
             
            fill(100);
            triangle( t_mountains.x_Pos+130,floorPos_y, t_mountains.x_Pos+280,
                      floorPos_y,t_mountains.x_Pos+80,floorPos_y-350);
}

//function to draw trees
function drawTrees(t_trees)
{
            
            fill(107, 68, 35);
        
            rect(t_trees-22,floorPos_y-100,45,100);
        
            fill("green");
        
            triangle(t_trees-75,floorPos_y-55,
                 t_trees+75,floorPos_y-55,
                 t_trees,floorPos_y-160);
        
            triangle(t_trees-60,floorPos_y-100,
                 t_trees+60,floorPos_y-100,
                 t_trees,floorPos_y-185);
    
}


//function to draw canyon
function drawCanyon(t_canyon)
{

     fill(130, 102, 68);
            rect(t_canyon.x_Pos,floorPos_y,
                  t_canyon.x_Size,250);
             
            fill(0,86,179);
            rect(t_canyon.x_Pos+10, floorPos_y,
                  t_canyon.x_Size-20,250);
    
}

//function to check canyon
function checkCanyon(t_canyon)
{
    if((gameChar_world_x>t_canyon.x_Pos-10) && (gameChar_world_x<t_canyon.x_Pos+t_canyon.x_Size-10) &&(gameChar_y==floorPos_y))
        {
            isPlummeting=true;
            fallingCanyonSound.play();
            
            gameChar_y+=15;
           
        }
 
}

//Function to draw collectable
function drawCollectable(t_collectable)
{
            fill("gold");
            ellipse(t_collectable.x_Pos+30, floorPos_y-30,
                    t_collectable.x_Size);
           
            fill("yellow");
            ellipse(t_collectable.x_Pos+30, floorPos_y-30,
                    t_collectable.x_Size-15);
    
}

// function to check collectable
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_Pos+30, floorPos_y-30)<t_collectable.x_Size)
        {
          t_collectable.isFound = true;
          game_score += 1;
          collectCoinSound.play();  
        }
}

//function to create platform
function create_platform(x,y,leng)
{
    var plt = 
    {
        x:x,
        y:y,
        leng:leng,
        draw: function()
        {
            fill(107, 68, 35);
            rect(this.x,this.y,this.leng, 20);
            fill(150);
            rect(this.x,this.y+10,this.leng, 15);
            
        },
        check_contact: function(gc_x,gc_y)
        {
            if((gc_x > this.x) && (gc_x < this.x+this.leng))
            {
                var d=(this.y-gc_y);
                if(d>=0 && d<5)
                {
                    return true;
                }
                
            };
            return false;
        }
    };
    return plt;
}
