const TILE_OPTION_NUMBER = 6;
const TOOL_OPTION_NUMBER = 3;

const gameTable = document.querySelector('.game-area__game');
const lastMindedTileElement = document.querySelector('.tools-sidebar__lastMindedTile');
const tools = document.querySelectorAll('.tool');
const menu = document.querySelector('.menu');
const startBtn = document.querySelector('.menu__btn');

const state = {
    gameStart: false,
    worldMatrix: [],
    selectedTool: -1, // 0-pickaxe => rock(4) , 1-shovel => dirt,dirt-grass(0,1), 2-axe => leaves,wood(2,3) 
    lastMindedTile: -1, //0-dirt , 1-dirt-grass , 2- leaves, 3- wood, 4-rock ,5-water
}

const startGame = () => {
    menu.style.display = 'none';
}

const createWorld = (mat, tileOnClickHandler) => {
    for (let i = 0; i < mat.length; i++) {
        const line = document.createElement('div');
        line.classList.add('row');

        for (let j = 0; j < mat[i].length; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            //adding datasets
            for (const [key, value] of Object.entries(mat[i][j])) {
                tile.dataset[key] = value;
            }
            //adding events
            tile.addEventListener('click', tileOnClickHandler);
            line.appendChild(tile);
        }

        gameTable.appendChild(line);
    }
}

const createMatrix = (row, col) => {
    let mat = [];
    for (let i = 0; i < row; i++) {
        const r = [];
        for (let j = 0; j < col; j++) {
            r.push({})
        }
        mat.push(r);
    }

    const dirtLevel = row - parseInt((Math.floor((Math.random() * 4) ) * 0.1) * row);

    for (let i = row - 1; i >= 0; i--) {
        
        for (let j = 0; j < col; j++) {
            const tile = {};
            tile.col = j;
            tile.row = i;
            if (i >= dirtLevel) {
                tile.type = 0;
            } else if (i === dirtLevel - 1) {
                tile.type = 1;
            } else if (i === dirtLevel - 2) {
                if (j >= col - 2) {
                    mat[i][j] = {
                        type: -1,
                        col: j,
                        row: i
                    };
                    mat[i - 1][j] = {
                        type: -1,
                        col: j ,
                        row: i -1
                    };
                    mat[i - 2][j] = {
                        type: -1,
                        col: j ,
                        row: i -2
                    };

                } else {
                    const rand = getRandom9();
                    mat[i - 2][j] = {
                        type: rand[0],
                        col: j ,
                        row: i -2
                    };
                    mat[i - 2][j + 1] = {
                        type: rand[1],
                        col: j + 1,
                        row: i - 2
                    };
                    mat[i - 2][j + 2] = {
                        type: rand[2],
                        col: j + 2,
                        row: i - 2
                    };
                    mat[i - 1][j] = {
                        type: rand[3],
                        col: j ,
                        row: i -1
                    };
                    mat[i - 1][j + 1] = {
                        type: rand[4],
                        col: j + 1,
                        row: i - 1
                    };
                    mat[i - 1][j + 2] = {
                        type: rand[5],
                        col: j +2,
                        row: i -1
                    };
                    mat[i][j] = {
                        type: rand[6],
                        col: j,
                        row: i
                    };
                    mat[i][j + 1] = {
                        type: rand[7],
                        col: j+1,
                        row: i 
                    };
                    mat[i][j + 2] = {
                        type: rand[8],
                        col: j +2,
                        row: i 
                    };
                    j += 2;
                }
                continue;
            } else {
                tile.type = -1;
            }
            mat[i][j] = tile;
        }
        if (i === dirtLevel - 2) {
            i -= 2;
        };
    }
    console.log(mat);
    return mat;
}

getRandom9 = () => {
    const kind = Math.floor((Math.random() * 6));

    switch (kind) {
        case 0:
            return [2, 2, 2, 2, 2, 2, -1, 3, -1]; //tree
        case 1:
            return [-1, -1, -1, -1, -1, -1, 4, 4, -1]; //rock
        case 2:
            return [-1, -1, -1, -1, 2, -1, 2, 2, 2]; //tree
        case 3:
            return [-1, 2, -1, -1, 3, 4, -1, 3, 4]; //tree & rock
        case 4:
            return [-1, -1, -1, 4, 4, 4, 4, 4, 4]; //rock
        case 5:
            return [-1, -1, -1, -1, 5, -1, 5, 5, 5]; //cloud

        default:
            return [-1, -1, -1, -1, -1, -1, -1, -1, -1]; //empty
    }
}

const updateLastMindedTIle = (type) => {
    state.lastMindedTile = type;
    lastMindedTileElement.dataset.type = type;
}

//validate tool can mine element
const validTool = (type, selectedTool) => {
    switch (selectedTool) {
        case 0: //p0-pickaxe => rock(4)i
            if (type == 4) return true;
            break;
        case 1: // 1-shovel => dirt,dirt-grass(0,1)
            if (type == 0 || type == 1) return true;
            break;
        case 2: // 2-axe => leaves,wood(2,3) 
            if (type == 2 || type == 3) return true;
            break;
        default:
            console.error("invalid tool number");
            break;
    }
    return false;
};

//adds warning after invalid tool press;
const toolwarning = () => {
    tools.forEach(t => {
        t.classList.add('warning');
        setTimeout(removeAllWarning, 200);
    })
}

const removeAllWarning = () => {
    tools.forEach(t => {
        t.classList.remove('warning');
    })
}

//resets all active tools
const resetSelectedTools = () => {
    tools.forEach(t => {
        t.classList.remove('active');
    })
}

//events
const onStartGameClickHandler = () => {
    menu.style.display = 'none';
    gameTable.style.display = "block";

    state.worldMatrix = createMatrix(12, 16);
    createWorld(state.worldMatrix, tileOnClickHandler);
}

const toolOnClickHandler = (e) => {
    const tool = e.currentTarget;
    const toolType = parseInt(tool.dataset.tool);
    if (isNaN(toolType)) {
        console.error('invalid tool type');
        return;
    }
    resetSelectedTools();
    tool.classList.add('active');
    state.selectedTool = toolType;

}

const tileOnClickHandler = (e) => {
    console.log(e.currentTarget.dataset.type);
    const tile = e.currentTarget;
    let type = parseInt(tile.dataset.type);
    //check inputs 
    if (isNaN(type)) {
        console.error('invalid type');
        return;
    }

    if (type >= 0) { //mine tile

        if (!validTool(type, state.selectedTool)) {
            console.error('invalid tool');
            toolwarning();
            return;
        }

        tileStateObject = state.worldMatrix[tile.dataset.row][tile.dataset.col];
        if (!tileStateObject) {
            return;
        }
        tileStateObject.type = -1;
        tile.dataset.type = -1;
        updateLastMindedTIle(type);

    } else if (type == -1) { // plant tile
        if (state.lastMindedTile >= 0) {
            tile.dataset.type = state.lastMindedTile;
            state.lastMindedTile = -1;
            lastMindedTileElement.dataset.type = -1;
        }
    }
}

const addEventsToTools = (toolOnClickHandler) => {
    tools.forEach(tool => {
        tool.addEventListener('click', toolOnClickHandler)
    })
}

//main
gameTable.style.display = "none";
addEventsToTools(toolOnClickHandler);
startBtn.addEventListener('click', onStartGameClickHandler);
