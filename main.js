const container = document.querySelector(".container");
const gameStart = document.querySelector(".playing button");
const gameWindow = document.querySelector(".game-window");
const speed = document.querySelector(".speed span");
const score = document.querySelector(".score span");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
let rocket;
// 로켓 움직임을 위한 값 width값의 3분의 1씩 움진인다
const one_move = 294/3;

let currentMeteorities = [];
let counter = 0;

let game_level = [300, 1000, 1800, 3600];
let game_index = 0;

let fall_speed = 1;
let speed_level = 1;
let game_score = 0;

let hit_point = 80;

// =============Game Sound Effects==================
function clickSound(){
    let click = document.getElementById("click");
    click.playbackRate = 2;
    click.play();
}

function explosionSound(){
    let explo = document.getElementById("explo");
    explo.playbackRate = 4.0;
    explo.play();
}

function moveSound(){
    let move = document.getElementById("move");
    move.playbackRate = 3.0;
    move.play();
}

function speedSound(){
    let s = document.getElementById("speed");
    s.playbackRate = 2;
    s.play();
}

function countDownSound(){
    let countDown = document.getElementById("countdown");
    countDown.playbackRate = 0.98;
    countDown.play();
}

function loseSound(){
    let lose = document.getElementById('lose');
    lose.playbackRate = 1.5;
    lose.play();
}

function backgroundSound(){
    const bk = document.getElementById('background');
    if(bk.paused){
        bk.play();
    }
    else{
        bk.pause();
        bk.currentTime = 0;
    }
}

// ============   게임 시작 윈도우 =====================
gameStart.addEventListener('click', (event) => {
    //게임 시작버튼 노드 삭제
    clickSound();
    let window = container.children[3];
    container.removeChild(window);
    countDown(); 
});

//  게임시작 버튼을 누르면 3초부터 카운터 시작후 게임 진행
function countDown(){
    initGameData();
    let count_down = document.createElement("div");
    count_down.setAttribute("class", "count-down");
    container.appendChild(count_down);

    let cd = document.querySelector(".count-down");
    let count = 3;
    cd.innerText = count

    countDownSound();

    let count_interval = setInterval(() =>{
        count--;
        cd.innerText = count

        if(count === -1){   
            cd.innerText = "Start!!!";
        }
        else if(count < -1){
            let  a = clearInterval(count_interval);
            container.removeChild(count_down);
            // 게임 불러오기
            init();
        }
    }, 1000);
}

function gameOver() {
    let game_over = document.createElement("div");
    game_over.setAttribute("class", "game-over");
    container.appendChild(game_over);
    
    const over = document.querySelector(".game-over");
    
    let text = document.createElement("h1");
    text.innerText ="Game Over";

    let button = document.createElement("button");
    button.innerText = "다시시작";

    over.appendChild(text);
    over.appendChild(button);

    backgroundSound();
    loseSound();


    const gameOverBtn = document.querySelector(".game-over button");
    gameOverBtn.addEventListener("click", (event)=>{
        clickSound();
        container.removeChild(game_over);
        
        while(gameWindow.hasChildNodes()){
            gameWindow.removeChild(gameWindow.firstChild);
        }
        countDown();
    });
    
}

// ===================================== 게임 초기화 ===============================
function init(){
    initRocket();
    initGameData();
    backgroundSound();
    game();
}

function initRocket(){

    let rocket_q = document.createElement("div");
    rocket_q.setAttribute("class","rocket");
    gameWindow.appendChild(rocket_q);

    rocket = document.querySelector(".rocket");

    rocket.style.width = 100 + "px";
    rocket.style.height = 100 + "px";
    rocket.style.bottom = 0 + "px";
    rocket.style.left = (294/3) + "px";
}

function initGameData(){
    speed.innerText = 1;
    score.innerText = 0;
    counter = 0;
    game_index = 0;
    speed_level = 1;
    fall_speed = 1;
    game_score = 0;
    hit_point = 80;
    currentMeteorities = [];
    
}

//======================================== 게임 컨트롤 ===========================================
document.addEventListener("keydown", (event) =>{
    if(event.key === "ArrowLeft"){
        moveLeft();
    }

    else if(event.key === "ArrowRight"){
        moveRight();
    }
});

function moveLeft(){
    let left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
        if(left>0){
            moveSound();
            rocket.style.left = left - one_move +"px";
        }
}

function moveRight(){
    let left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
    if(left < 294 - one_move){
        moveSound();
        rocket.style.left = left + one_move + "px";
    }
}

function speedUp(){
    if(fall_speed < 2.3){
        fall_speed += 0.3;
        speed_level += 1;
        speedSound();
        speed.innerText = speed_level;
    } 
    // else if(event.key ==="ArrowUp"){
    //     if(fall_speed < 2.5){
    //         fall_speed += 0.5;
    //         speed_level += 1;
    //         speedSound();
    //     }
    //     speed.innerText = speed_level;
    // }
}

// 모바일 플레이를 위한 컨트롤
document.addEventListener("click", (event)=>{
    
    if(event.target.nodeName === "svg" || event.target.nodeName === "SPAN" || event.target.nodeName === "path"){

        if(event.target.className === "left"){
            moveLeft();
        }
        else if(event.target.className ==="right"){
            moveRight();
        }
        else if(event.target.nodeName === "svg"){
            if(event.target.parentNode.className === "left"){
                moveLeft();
            }
            else if(event.target.parentNode.className === "right"){
                moveRight();
            }
        }
        else if(event.target.nodeName === "path"){
            if(event.target.parentNode.parentNode.className === "left"){
                moveLeft();
            }
            else if(event.target.parentNode.parentNode.className === "right"){
                moveRight();
            }
        }
        else{
            return;
        }
    }
    else{
        return;
    }
});

function game(){
        let playing = setInterval(() =>{
        // 마지막으로 생성됬던 노드들
        let mt1_Last = document.getElementById("meteor" + (counter - 1));
        let mt2_Last = document.getElementById("meteor2" + (counter - 1));
        let h_Last = document.getElementById("hole" + (counter - 1));

        // 마지막으로 생성된 노드들의 Top의 위치 값을 얻는다
        if(counter > 0){
            var mt1_last_top = parseInt(window.getComputedStyle(mt1_Last).getPropertyValue("top"));
            var mt2_last_top = parseInt(window.getComputedStyle(mt2_Last).getPropertyValue("top"));
            var h_last_top = parseInt(window.getComputedStyle(h_Last).getPropertyValue("top"));
        }

        // 마지막으로 생성된 노드들의 위치가 120 이상일때(생성된 노드의 카운트가 0일때)
        //새로운 노드들을 생성한다
        if(mt1_last_top >= 0 || counter == 0){
            // 운석1 생성 및 속성값 부여
            let meteo_1 = document.createElement("div");
            meteo_1.setAttribute("class", "meteor");
            meteo_1.setAttribute("id", "meteor" + counter);

            // 운석2 생성 및 속성값 부여
            let meteo_2 = document.createElement("div");
            meteo_2.setAttribute("class", "meteor");
            meteo_2.setAttribute("id", "meteor2" + counter);

            // 구멍 생성 및 속성값 부여
            let hole = document.createElement("div");
            hole.setAttribute("class", "hole");
            hole.setAttribute("id", "hole" + counter);

            // 게임 창에 운성 노드들을 너어준다.
            gameWindow.appendChild(meteo_1);
            gameWindow.appendChild(meteo_2);
            gameWindow.appendChild(hole);

            // 마지막으로 생성됬던 노드들의 위치보다 -120된 
            // 위치에서 생성된다 즉 Top = 0 에서 위치함
            meteo_1.style.top = mt1_last_top - 200 + "px";
            meteo_2.style.top = mt1_last_top - 200 + "px";
            hole.style.top = mt1_last_top - 200 + "px"

            // 운석 위치 좌표들
            const positions = [0 , one_move, (294 - one_move)];

            // (0~2)의 난수 생성
            let random = Math.floor(Math.random() * 3);
            let other = [];

            for(let i = 0; i < positions.length ; i++){
                if(i != random){
                    other.push(i);
                }
            }

            //운석들과 구멍들 위치 랜덤 설정 
            meteo_1.style.left = positions[other[0]] + "px";
            meteo_2.style.left = positions[other[1]] + "px";
            hole.style.left = positions[random] + "px";

            currentMeteorities.push(counter);
            counter++;
        }

        
        for(let i = 0; i < currentMeteorities.length; i ++){
            let current = currentMeteorities[i];
            
            let i_m1 = document.getElementById("meteor" + current);
            let i_m2 = document.getElementById("meteor2" + current);
            let i_h = document.getElementById("hole" + current);

            // 운석 떨어지는 속도
            let i_m1_top = parseFloat(window.getComputedStyle(i_m1).getPropertyValue("top"));
            let i_m1_left = parseInt(window.getComputedStyle(i_m1).getPropertyValue("left"));
            let i_m2_left = parseInt(window.getComputedStyle(i_m2).getPropertyValue("left"));
            
            i_m1.style.top = i_m1_top + fall_speed + "px";
            i_m2.style.top = i_m1_top + fall_speed + "px";
            i_h.style.top = i_m1_top + fall_speed + "px";
            

            let gw_height = parseFloat(window.getComputedStyle(gameWindow).getPropertyValue("height"));
            // console.log(gw_height);

            if(i_m1_top > gw_height-120){
                i_m1.classList.add("explosion");
                i_m2.classList.add("explosion");
            }

            if(i_m1_top > gw_height - 100){
                explosionSound();
                currentMeteorities.shift();
                i_m1.remove();
                i_m2.remove();
                i_h.remove();
                
                //speed_level에 비례하게 게임 점수가 올라감
                game_score += (10 * speed_level);
                score.innerText = game_score ;

                let levelup_message = document.createElement("div");
                levelup_message.setAttribute("class", "message");
                
                if(game_score >= 3600){
                    speed.innerText = 'MAX SPEED';
                }
                else if(game_score >= game_level[game_index]){
                    speedUp();    
                    container.appendChild(levelup_message);
                    let message = document.querySelector(".message");
                    message.innerText = "Level Up";
                    game_index++;
                }
                
                if(container.contains(levelup_message)){
                    let remove_message = setInterval(()=>{
                    container.removeChild(levelup_message);
                    clearInterval(remove_message);
                    },1000);
                }

            }
            
            let rocket_top = parseInt(window.getComputedStyle(rocket).getPropertyValue("top"));
            let rocket_left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
            
            // hit_point is 80
            // max speed 2.3일때 운석의 Top의 범위를 줄인다
            if(fall_speed === 2.3){
                hit_point = 40;
            }

            if(((parseInt(i_m1_top) + hit_point) === rocket_top) && (rocket_left === i_m1_left || rocket_left === i_m2_left)
            || ((parseInt(i_m1_top) + hit_point) > rocket_top) && (rocket_left === i_m1_left || rocket_left === i_m2_left)){
                clearInterval(playing);
                gameOver();
            }
        }
    }, 1);
}
