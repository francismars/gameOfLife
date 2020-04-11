const cellSize = 10
const range = cellSize/2
const ALIVE = 1
const DEAD = 0
let dragStatus = 0
let generation = 0
let cellGrid = []
let cellNeighbours = []
let pause = false
let locked = false


// Cell Object
function Cell(x,y,living) {
		this.x = x
		this.y = y
		this.living = living		
		this.draw = function(){
			// On Mouse Over
			if (this.x + range > (mouseX - range) && this.x + range < (mouseX + range) && 
				this.y + range > (mouseY - range) && this.y + range < (mouseY + range)) {
				stroke(0)
				this.living ? fill(255) : fill(0)			
				ellipse(this.x + range, this.y + range, cellSize-range, cellSize-range)
			}
			else {
				stroke(123)
				fill(255)				
				square(this.x,this.y,cellSize,cellSize)	
				if(this.living) { 
					stroke(0)
					fill(0)
					ellipse(this.x + range, this.y + range, cellSize-range, cellSize-range) 
				}
			}
		}
		this.flip = function() {
			this.living ? this.living=DEAD : this.living=ALIVE
		}
}

//Creates New Empty Grid
function initiateGrid() {
	generation = 0
	for(i=0;i<width/cellSize;i++){
		cellGrid[i] = []
		for(j=0;j<height/cellSize;j++){
			living = Math.floor(Math.random() * 2)
			cellGrid[i][j] = new Cell(i*cellSize,j*cellSize,living)
		}
	}	
}

function setup() {
	createCanvas(640, 480)
	initiateGrid()	
	
	textGeneration = createP()
	textGeneration.position(700, 75)
	
	buttonPause = createButton("Pause")
	buttonPause.position(700, 125)
	buttonPause.mousePressed(pauseGame)
	
	buttonReset = createButton("Reset")
	buttonReset.position(700, 150)
	buttonReset.mousePressed(initiateGrid)
	
	buttonReset = createButton("End Life")
	buttonReset.position(700, 175)
	buttonReset.mousePressed(allDead)
}


// End All Life
function allDead(){
	for(i=0;i<width/cellSize;i++){
		for(j=0;j<height/cellSize;j++){				
			cellGrid[i][j].living = DEAD
		}
	}	
	generation = 0
	pause = false
	pauseGame()	
}

function mousePressed() {
	if(mouseX<width && mouseY<height){
		cellGrid[Math.floor(mouseX/cellSize)][Math.floor(mouseY/cellSize)].flip()
		locked = true
		dragStatus = cellGrid[Math.floor(mouseX/cellSize)][Math.floor(mouseY/cellSize)].living
	}
}

function mouseReleased() {
  locked = false;
}

function mouseDragged() {
  if (locked) {
	if(mouseX<width && mouseY<height){
		cellGrid[Math.floor(mouseX/cellSize)][Math.floor(mouseY/cellSize)].living = dragStatus
	}
  }
}

function pauseGame(){
	if(!pause){
		buttonPause.html("Play")
		pause = true		
	} else {
		buttonPause.html("Pause")
		pause = false		
	}
}

// Creates Next Generation
function newGeneration() {
	let gridClone = []
	for(i=0;i<width/cellSize;i++){
		gridClone[i] = []
		// Rules Of The Game
		for(j=0;j<height/cellSize;j++){
			if(cellGrid[i][j].living==ALIVE){
				if(cellNeighbours[i][j]<2 || cellNeighbours[i][j]>3){
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,DEAD)
				}
				else{
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,ALIVE)
				}
			}
			else if(cellGrid[i][j].living==DEAD){
				if(cellNeighbours[i][j]==3){
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,ALIVE)
				}
				else{
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,DEAD)
				}
			}
		}
	}
	generation++
	textGeneration.html('Generation: '+ generation)
	cellGrid = gridClone
}

// Check Number of Neighbours per Cell
function checkNeighbours() {	
	for(i=0;i<width/cellSize;i++){
		cellNeighbours[i] = []
		for(j=0;j<height/cellSize;j++){
			cellNeighbours[i][j] = -cellGrid[i][j].living
			for(k=-1;k<=1;k++){
				for(l=-1;l<=1;l++){
					neighbourX = ((i-k)+cellGrid.length) % cellGrid.length
					neighbourY = ((j-l)+cellGrid[0].length) % cellGrid[0].length
					cellNeighbours[i][j] += cellGrid[neighbourX][neighbourY].living
				}
			}
		}
	}
}

function draw() {
	// Draw all Cells
	for(i=0;i<width/cellSize;i++){
		for(j=0;j<height/cellSize;j++){
			cellGrid[i][j].draw()			
		}
	}
	if(!pause){
		checkNeighbours()	
		newGeneration()		
	}

}