const cellSize = 10
let cellGrid = []
let gridClone = []
let cellNeighbours = []


// Cell Object
function Cell(x,y,alive) {
		this.x = x
		this.y = y
		this.alive = alive		
		this.draw = function(){
			stroke(0)
			alive ? fill(255) : fill(0)			
			square(this.x,this.y,cellSize,cellSize)
		}
}

function setup() {
	frameRate(24)
	createCanvas(640, 480);
	for(i=0;i<width/cellSize;i++){
		cellGrid[i] = []
		for(j=0;j<height/cellSize;j++){
			alive = Math.floor(Math.random() * 2)
			cellGrid[i][j] = new Cell(i*cellSize,j*cellSize,alive)
		}
	}
}

function draw() {
	if(gridClone[0]){
		cellGrid = gridClone
		gridClone = []
	}
	for(i=0;i<width/cellSize;i++){
		for(j=0;j<height/cellSize;j++){
			cellGrid[i][j].draw()
		}
	}

	for(i=0;i<width/cellSize;i++){
		cellNeighbours[i] = []
		for(j=0;j<height/cellSize;j++){
			cellNeighbours[i][j] = 0
			for(k=-1;k<=1;k++){
				for(l=-1;l<=1;l++){
					cellNeighbours[i][j] += cellGrid[((i-k)+cellGrid.length) % cellGrid.length][((j-l)+cellGrid[0].length) % cellGrid[0].length].alive
				}
			}
			cellNeighbours[i][j] -= cellGrid[i][j].alive
		}
	}	
	
	for(i=0;i<width/cellSize;i++){
		gridClone[i] = []
		for(j=0;j<height/cellSize;j++){
			if(cellGrid[i][j].alive==1){
				if(cellNeighbours[i][j]<2 || cellNeighbours[i][j]>3){
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,0)
				}
				else{
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,1)
				}
			}
			else if(cellGrid[i][j].alive==0){
				if(cellNeighbours[i][j]==3){
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,1)
				}
				else{
					gridClone[i][j] = new Cell(i*cellSize,j*cellSize,0)
				}
			}
		}
	}
}