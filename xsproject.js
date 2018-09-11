var organism = function(name, age, growing, death){
    //生物
    this.name = name;//名稱//string
    this.age = age;//年齡//int
    this.growing = growing;//生長//int
    this.death = death;//死亡//boolean
};

var pro_animal = function(name, age, growing, death, deg_hunger, eating, phys_strength, speed, run){
    //動物
    organism.call(this, name, age, growing, death);//繼承生物
    this.deg_hunger = deg_hunger;//飢餓度//int
    this.eating = eating;//進食//booleam
    this.phys_strength = phys_strength;//體力//int
    this.speed = speed;//運動速度//int
    this.run = run;//跑//booleam
};

var carnivore = function(name, age, growing, death, deg_hunger, eating, phys_strength, speed, run, sta){
    //////////////////////肉食動物//////////////////////
    pro_animal.call(this, name, age, growing, death, deg_hunger, eating, phys_strength, speed, run);//繼承動物
    this.sta = sta;//0~2.肉食動物 3~5.草食動物 6~8.草 9~10.樹
    this.meet = function (obj) {
        if(obj.sta >= 0 && obj.sta <= 2){//肉食動物遇到肉食
            this.meet_carnivore(obj);
        }else if(obj.sta >= 3 && obj.sta <= 5){//肉食動物遇到草食
            this.meet_herbivore(obj);
        }else{
            console.log(this.name+" 遇到 "+arr_mem[obj.sta]+" 啥都沒有發生");//肉食動物遇到草跟樹，啥都沒發生
        }
    };
    this.meet_herbivore = function (obj) {
        //肉食動物遇到草食動物，追起來。追到就吃掉
        console.log(this.name+" 遇到 "+obj.name);
        if(this.speed >= obj.speed){
            this.deg_hunger--;//追到吃了，飢餓度下降
            obj.death = false;//對方死了
            console.log(obj.name+" 被吃了");
        }else{
            if(--obj.phys_strength<0) {//對方體力下降
                obj.death = false
                this.deg_hunger--;//飢餓度下降
                console.log(obj.name+"累死了");
            }else{
                this.deg_hunger++;//追不到，飢餓度上升
                console.log(obj.name+"逃跑了");
            }
        }
        if(--this.phys_strength<0) {//自己體力下降
            this.death = false;
            console.log(this.name+" 累死了");
        }
    };
    this.meet_carnivore = function (obj) {
        //肉食動物遇到肉食動物，打起來。打贏就吃掉
        console.log(this.name+" 遇到 "+obj.name);
        if(this.phys_strength >= obj.phys_strength){
            this.deg_hunger--;//打贏吃了，飢餓度下降
            obj.death = false;//對方死了
            console.log(obj.name+" 被吃了");
            if(--this.phys_strength<0) {//自己體力下降
                this.death = false;
                console.log(this.name+" 累死了");
            }
        }else{
            this.death = false;//打輸，被吃了
            obj.deg_hunger--;//對方飢餓度下降
            console.log(this.name+" 被吃了");
            if(--obj.phys_strength<0) {//對方體力下降
                obj.death = false
                console.log(obj.name+"累死了");
            }
        }
    };
};

var herbivore = function(name, age, growing, death, deg_hunger, eating, phys_strength, speed, run, sta){
    //////////////////////草食動物//////////////////////
    pro_animal.call(this, name, age, growing, death, deg_hunger, eating, phys_strength, speed, run);//繼承動物
    this.sta = sta;//1.肉食動物 2.草食動物 3.草 4.樹
    this.meet = function (obj) {
        if(obj.sta >= 0 && obj.sta <= 2){//草食動物遇到肉食
            this.meet_carnivore(obj);
        }else if(obj.sta >= 3 && obj.sta <= 5){//草食動物遇到草食
            this.meet_herbivore(obj);
        }else if(obj.sta >= 6 && obj.sta <= 8){//草食動物遇到草
            this.meet_grass(obj);
        }else{
            //草食動物遇到樹，啥都沒發生
            console.log(this.name+"遇到 "+arr_mem[obj.sta]+" 啥都沒有發生");
        }
    };
    this.meet_herbivore = function (obj) {
        //草食動物遇到草食動物，打起來
        if(this.sta == obj.sta){
            console.log(this.name+" 遇到 "+ obj.name +"，打了一架，雙方損失體力3");
            if((this.phys_strength-=3)<0){//打平，扣3
                this.death = false;
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=3)<0){//打平，扣3
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }else if(this.sta < obj.sta){
            console.log(this.name+" 遇到 "+ obj.name +"，打了一架");
            console.log(this.name+" 損失體力1");
            console.log(obj.name+" 損失體力5");
            if(--this.phys_strength<0){
                this.death = false;
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=5)<0){
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }else{
            console.log(this.name+" 遇到 "+ obj.name +"，打了一架");
            console.log(this.name+" 損失體力5");
            console.log(obj.name+" 損失體力1");
            if((this.phys_strength-=5)<0){
                this.death = false;
                console.log(this.name+"累死了");
            }
            if(--obj.phys_strength<0){
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }
    };
    this.meet_carnivore = function (obj) {
        //草食動物遇到肉食動物，跑起來。
        console.log(this.name+" 遇到 "+obj.name);
        if(this.speed >= obj.speed){
            //草食跑贏
            if(--this.phys_strength<0){//體力下降
                this.death = false;//體力小於零，死去
                obj.deg_hunger--;//對方飢餓度下降
                console.log(this.name+"累死了");
            }else{
                console.log(this.name+"逃跑了");
            }
        }else{
            //肉食跑贏
            this.death = false;//草食跑輸，被吃了
            obj.deg_hunger--;//對方飢餓度下降
            console.log(this.name+"被吃了");
            if(--obj.phys_strength<0){//對方體力下降，若對方體力小於零，死去
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }
    };
    this.meet_grass = function (obj) {
        //草食動物遇到草，吃起來。
        this.deg_hunger--;//自己飢餓度下降
        this.phys_strength++;
        obj.death=false;
        console.log(this.name+" 吃了 "+arr_mem[obj.sta]);
    };
};

var plant = function(name, death){
    //植物
    this.name=name;
    this.death=death;
};

var grass = function(name, death, sta){
    //////////////////////草//////////////////////
    plant.call(this, name, death);//繼承植物
    this.sta = sta;
};

var tree = function(name, death, sta){
    //////////////////////樹//////////////////////
    plant.call(this, name, death);//繼承植物
    this.sta = sta;
};

var animal = {};
var arr_con=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var arr_mem=['老虎', "獅子", "獵豹",  "斑馬", "羚羊", "鴕鳥", "高級牧草", "普通牧草", "低級牧草", "蘋果樹", "椰子樹"];
for(var i=1; i<=100; i++) {
    var e = Math.floor(Math.random()*10)+1;
    var f = Math.floor(Math.random()*11);
    for(var j=1; j<=e; j++){
        switch (f) {
            case 0: case 1: case 2:animal[arr_con[11]++] = new carnivore((arr_mem[f])+(++arr_con[f]), 1, 10, true, 5, false, 10, (f+6)*10, false, f);break;
            case 3: case 4: case 5:animal[arr_con[11]++] = new herbivore((arr_mem[f])+(++arr_con[f]), 1, 10, true, 5, false, 10, (f+5)*11, false, f);break;
            case 6: case 7: case 8: case 9: case 10:animal[arr_con[11]++] =  new grass((arr_mem[f])+(++arr_con[f]), true,f);break;
            default:break;
        }
    }
    console.log("第" + i + "天，出生了" + e +((f>5)?"棵":"隻") +arr_mem[f]);

    for(var k=0; k<arr_con[11]-1; k++){
        if(animal[k].sta<6 && animal[k].death){
            var meet_eve;
            do{
                meet_eve = Math.floor(Math.random()*arr_con[11]);
            }while (k == meet_eve || !animal[meet_eve].death)
            animal[k].meet(animal[meet_eve]);
        }
    }
    console.log();
}
