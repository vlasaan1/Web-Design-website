class Clicker {

    /**
     * @param {number} size - width and height of the play-area in pixels
     * @param {number} maxCellSize - max cell radius in pixels. minSize is always 1
     * @param {number} speed - time in milliseconds how long a cell stays until it disappears
     * @param {number} victoryPoints - how many points needed for victory.
     */
    constructor(size, maxCellSize, speed, victoryPoints) {
        // TODO
        this.size = size 
        this.maxCellSize = maxCellSize 
        this.speed = speed 
        this.victoryPoints = victoryPoints 
        this.score = 0 
        this.startTime = null 
        this.cells = [] 
        this.renderTo = null 
        this.timerInterval = null 
        this.victoryAchieved = false 
    }

    /**
     *  @param {Element} renderTo - start the game in this element (replaces its previous content)
     */
    play(renderTo) {
        // TODO
        this.renderTo = renderTo 
        this.startTime = Date.now() 
        this.startGameLoop() 
        this.attachClickEvent() 

        window.addEventListener('resize', () => this.onWindowResize());
    }

    attachClickEvent() {
        this.renderTo.addEventListener('click', (event) => {
            const clickedCell = event.target.closest('.cell') 
            if (clickedCell) {
                this.handleCellClick(clickedCell) 
            }
        }) 
    }

    startGameLoop() {
        this.updateCells() 
        this.timerInterval = setInterval(() => {
            if (!this.victoryAchieved) {
                this.updateCells();
            } else {
                clearInterval(this.timerInterval);
                this.endGame();
            }
        }, 250); // Adjusted to 500ms
    }

    onWindowResize() {
        if (this.resizing) return;
        this.resizing = true;
    
        // Clear existing cells
        this.cells.forEach(cell => cell.remove());
        this.cells = [];
    
        setTimeout(() => {
            if (this.score >= this.victoryPoints) {
                this.endGame();
            } else {
                this.renderCells();
            }
            this.resizing = false; // Reset the flag
        }, 4000);
    }
    

    renderCells() {
        if (this.score >= this.victoryPoints) {
            this.endGame() 
            return
        }

        const cell = document.createElement('div') 
        const cellSize = this.generateRandomCellSize() 
        const containerWidth = this.renderTo.clientWidth;
        const containerHeight = this.renderTo.clientHeight;
        // Adjust x and y so the cell stays within the container bounds
        const x = this.generateRandomPosition(containerWidth - cellSize);
        const y = this.generateRandomPosition(containerHeight - cellSize);

        cell.classList.add('cell') 
        cell.style.width = cellSize + 'px' 
        cell.style.height = cellSize + 'px' 
        cell.style.left = x + 'px' 
        cell.style.top = y + 'px' 
        cell.textContent = this.calculateCellScore(cellSize) 
        this.renderTo.appendChild(cell) 
        this.cells.push(cell) 

    

        cell.addEventListener('click', () => {
            this.handleCellClick(cell) 
        }) 
        
        setTimeout(() => {
	        if (cell.classList.contains('cell-clicked')) {
	            this.removeCell(cell) 
	        }
	     }, 200) 
	        
		setTimeout(() => {
	        if (cell.classList.contains('cell')) {
	            this.removeCell(cell) 
	        }
	        }, this.speed) 
	}

    updateCells() {
    	if (!(this.victoryAchieved) && (this.cells.length === 0)) {
            this.renderCells() 
        }
    }
    
    removeCell(cell) {
        const index = this.cells.indexOf(cell) 
        cell.remove() 
        if (index !== -1) {
            this.cells.splice(index, 1) 
        }
    }

    generateRandomCellSize() {
        return Math.floor(Math.random() * this.maxCellSize) + 20 
    }

    generateRandomPosition(max) {
        return Math.floor(Math.random() * max) 
    }

    calculateCellScore(cellSize) {
        return Math.floor(this.maxCellSize - cellSize/2 + 1)
    }

    handleCellClick(cell) {
        if (this.score >= this.victoryPoints) {
            this.endGame() 
            return
        }
        if (!cell.classList.contains('cell-clicked')) {
            cell.classList.add('cell-clicked') 
            const cellScore = parseInt(cell.textContent) 
            this.score += cellScore 
            document.getElementById('score-value').textContent = this.score 
    	}
        else{
            this.renderCells() 
        }
    }

    endGame() {
        const endTime = Date.now() 
        const elapsedTime = Math.round((endTime - this.startTime) / 1000) 
        const victoryMessage = `${this.score} points, it took you ${elapsedTime} seconds!` 
        document.getElementById('score-value').textContent = victoryMessage 
        this.victoryAchieved = true 
    }
}

window.Clicker = Clicker 
