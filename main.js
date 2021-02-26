const gameWindow = document.querySelector(".game-window");
const rocket = document.getElementById("rocket");
const speed = document.querySelector(".speed span");
const score = document.querySelector(".score span");

// 로켓 움직임을 위한 값 width값의 3분의 1씩 움진인다
const one_move = 354/3;

let currentMeteorities = [];
let counter = 0;
let fall_speed = 1;
let speed_level = 1;
let game_score = 0;

// ===================================== 게임 초기화 ===============================
function init(){
    initRocket();
    initGameInfo();
}

function initRocket(){
    rocket.style.width = one_move + "px";
    rocket.style.height = 120 + "px";
    rocket.style.top = 602 + "px";
    rocket.style.left = (354/3) + "px";
}

function initGameInfo(){
    speed.innerText = 1;
    score.innerText = 0;
}

//======================================== 게임 컨트롤 ===========================================
document.addEventListener("keydown", (event) =>{
    if(event.key === "ArrowLeft"){
        let left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
        if(left>0){
            rocket.style.left = left - one_move +"px";
        }
    }

    else if(event.key === "ArrowRight"){
        let left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
        if(left < 354 - one_move){
            rocket.style.left = left + one_move + "px";
        }
    }

    else if(event.key ==="ArrowUp"){
        if(fall_speed < 2){
            fall_speed += 0.5;
            speed_level += 1;
        }
        speed.innerText = speed_level;
    }

    else if(event.key ==="ArrowDown"){
        if(fall_speed > 1){
            fall_speed -= 0.5;
            speed_level -= 1;
        }
        speed.innerText = speed_level;
    }
});


let meteorites = setInterval(() =>{
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
        meteo_1.style.top = mt1_last_top - 240 + "px";
        meteo_2.style.top = mt1_last_top - 240 + "px";
        hole.style.top = mt1_last_top - 240 + "px"

        // 운석 위치 좌표들
        const positions = [0 , one_move, (354 - one_move)];

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

        if(i_m1_top > 660){
            currentMeteorities.shift();
            i_m1.remove();
            i_m2.remove();
            i_h.remove();
            
            //speed_level에 비례하게 게임 점수가 올라감
            game_score += (10* speed_level);
            score.innerText = game_score ;
        }
        
        let rocket_top = parseInt(window.getComputedStyle(rocket).getPropertyValue("top"));
        let rocket_left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
        
        if(((parseInt(i_m1_top) + 100) == rocket_top) && (rocket_left == i_m1_left || rocket_left == i_m2_left) ){
            clearInterval(meteorites)
            resetGame();
        }
    }

}, 1);

function resetGame(){

    
}

init();