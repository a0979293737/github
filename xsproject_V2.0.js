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
    this.meet = function (obj) {//相遇事件
        console.log(this.name+" 遇到 "+obj.name);
        if(obj.species == 0 ){//遇到肉食
            this.meet_carnivore(obj);
        }else if(obj.species == 1){//遇到草食
            this.meet_herbivore(obj);
        }else if(obj.species == 2){
            this.meet_grass(obj);
        }else{
            this.meet_tree(obj);
        };
    };
    this.meet_carnivore = function (obj) {
        console.log("啥都沒有發生");
    }
    this.meet_herbivore = function (obj) {
        console.log("啥都沒有發生");
    }
    this.meet_grass = function (obj) {
        console.log("啥都沒有發生");
    }
    this.meet_tree = function (obj) {
        console.log("啥都沒有發生");
    }
};
var proto = Object.create(organism.prototype);//將organism.prototype繼承給pro_animal
proto.constructor = pro_animal;
pro_animal.prototype = proto;

var carnivore = function(name, age, growing, death, deg_hunger, eating, phys_strength, speed, run, sta){
    //////////////////////肉食動物//////////////////////
    pro_animal.call(this, name, age, growing, death, deg_hunger, eating, phys_strength, speed, run);//繼承動物
    this.species = 0;//0.肉食
    this.sta = sta;//1.獅子 2.老虎 3.獵豹 4.... 5.... 6....
    this.meet_herbivore = function (obj) {//Override父類別，meet_herbivore()
        //肉食動物遇到草食動物，追起來。追到就吃掉
        if(this.speed >= obj.speed){
            this.deg_hunger--;//追到吃了，飢餓度下降
            obj.death = false;//對方死了
            console.log(obj.name+" 被吃了");
        }else{
            if(--obj.phys_strength<0) {//對方體力下降
                obj.death = false//體力小於零則死
                this.deg_hunger--;//飢餓度下降
                console.log(obj.name+"累死了");
            }else{
                this.deg_hunger++;//追不到，飢餓度上升
                console.log(obj.name+"逃跑了");
            }
        }
        if(--this.phys_strength<0) {//自己體力下降
            this.death = false;//體力小於零則死
            console.log(this.name+" 累死了");
        }
    };
    this.meet_carnivore = function (obj) {//Override父類別，meet_carnivore()
        //肉食動物遇到肉食動物，打起來。打贏就吃掉
        if(this.phys_strength >= obj.phys_strength){
            this.deg_hunger--;//打贏吃了，飢餓度下降
            obj.death = false;//對方死了
            console.log(obj.name+" 被吃了");
            if(--this.phys_strength<0) {//自己體力下降
                this.death = false;//體力小於零則死
                console.log(this.name+" 累死了");
            }
        }else{
            this.death = false;//打輸，被吃了
            obj.deg_hunger--;//對方飢餓度下降
            console.log(this.name+" 被吃了");
            if(--obj.phys_strength<0) {//對方體力下降
                obj.death = false//體力小於零則死
                console.log(obj.name+"累死了");
            }
        }
    };
};
proto = Object.create(pro_animal.prototype);//將pro_animal.prototype繼承給carnivore
proto.constructor = carnivore;
carnivore.prototype = proto;

var herbivore = function(name, age, growing, death, deg_hunger, eating, phys_strength, speed, run, sta){
    //////////////////////草食動物//////////////////////
    pro_animal.call(this, name, age, growing, death, deg_hunger, eating, phys_strength, speed, run);
    this.species = 1;//1.草食
    this.sta = sta;//1.斑馬 2.羚羊 3.鴕鳥 4.... 5.... 6....
    this.meet_herbivore = function (obj) {
        //草食動物遇到草食動物，打起來
        if(this.sta == obj.sta){
            console.log("雙方打了一架，雙方損失2體力");
            if((this.phys_strength-=2)<0){//打平，扣2
                this.death = false;
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=2)<0){//打平，扣2
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }else if(this.sta < obj.sta){
            console.log("雙方打了一架"+this.name+" 損失1體力 "+obj.name+" 損失3體力");
            if(--this.phys_strength<0){
                this.death = false;
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=3)<0){
                obj.death = false;
                console.log(obj.name+"累死了");
            }
        }else{
            console.log("雙方打了一架"+this.name+" 損失3體力 "+obj.name+" 損失1體力");
            if((this.phys_strength-=3)<0){
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
        this.deg_hunger-=obj.sta+1;//自己飢餓度下降
        obj.death=false;
        console.log(this.name+" 吃了 "+obj.name);
    };
};
proto = Object.create(pro_animal.prototype);//將pro_animal.prototype繼承給herbivore
proto.constructor = herbivore;
herbivore.prototype = proto;

var lion = function(index){
    //獅子 生命週期(growing)約30~40天 體力(phys_strength)15 速度(speed)約60~70
    carnivore.call(this, "獅子"+index, 1, Math.floor(Math.random()*10)+30, true, 5, false, 15, Math.floor(Math.random()*10)+60, false, 1);//繼承肉食動物
}
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給lion
proto.constructor = lion;
lion.prototype = proto;

var tiger = function(index){
    //老虎 生命週期(growing)約25~35天 體力(phys_strength)12 速度(speed)約55~65
    carnivore.call(this, "老虎"+index, 1, Math.floor(Math.random()*10)+25, true, 5, false, 12, Math.floor(Math.random()*10)+55, false, 2);//繼承肉食動物
};
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給tiger
proto.constructor = tiger;
tiger.prototype = proto;

var leopard = function(index){
    //獵豹 生命週期(growing)約20~30天 體力(phys_strength)10 速度(speed)約80~90
    carnivore.call(this, "獵豹"+index, 1, Math.floor(Math.random()*10)+20, true, 5, false, 10, Math.floor(Math.random()*10)+80, false, 3);//繼承肉食動物
};
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給leopard
proto.constructor = leopard;
leopard.prototype = proto;

var zebra = function(index){
    //斑馬 生命週期(growing)約35~40天 體力(phys_strength)15 速度(speed)約50~60
    herbivore.call(this, "斑馬"+index, 1, Math.floor(Math.random()*10)+30, true, 5, false, 15, Math.floor(Math.random()*10)+50, false, 1);//繼承草食動物
};
proto = Object.create(leopard.prototype);//將leopard.prototype繼承給zebra
proto.constructor = zebra;
zebra.prototype = proto;

var antelope = function(index){
    //羚羊 生命週期(growing)約25~35天 體力(phys_strength)10 速度(speed)約55~65
    herbivore.call(this, "羚羊"+index, 1, Math.floor(Math.random()*10)+25, true, 5, false, 12, Math.floor(Math.random()*10)+55, false, 2);//繼承草食動物
};
proto = Object.create(leopard.prototype);//將leopard.prototype繼承給antelope
proto.constructor = antelope;
antelope.prototype = proto;

var ostrich = function(index){
    //鴕鳥 生命週期(growing)約15~20天 體力(phys_strength)8 速度(speed)約85~95
    herbivore.call(this, "鴕鳥"+index, 1, Math.floor(Math.random()*10)+20, true, 5, false, 10, Math.floor(Math.random()*10)+85, false, 3);//繼承草食動物
};
proto = Object.create(leopard.prototype);//將leopard.prototype繼承給ostrich
proto.constructor = ostrich;
ostrich.prototype = proto;


var plant = function(name, age, growing, death, sta, species){
    //植物
    organism.call(this, name, age, growing, death);//繼承生物
    this.species = species;//２.草 3.樹
    this.sta = sta;//1.低級牧草 2.中級牧草 3.高級牧草 4.... 5.... 6....
};
proto = Object.create(organism.prototype);//將organism.prototype繼承給plant
proto.constructor = plant;
plant.prototype = proto;

var grassA = function(index){
    //低級牧草 生命週期(growing)約8~10天　吃下後飢餓-1
    plant.call(this, "低級牧草"+index, 1, Math.floor(Math.random()*3)+8, true, 1, 2);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給grassA
proto.constructor = grassA;
grassA.prototype = proto;

var grassB = function(index){
    //中級牧草 生命週期(growing)約10~12天　吃下後飢餓-2
    plant.call(this, "中級牧草"+index, 1, Math.floor(Math.random()*3)+10, true, 2, 2);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給grassB
proto.constructor = grassB;
grassB.prototype = proto;

var grassC = function(index){
    //高級牧草 生命週期(growing)約12~15天　吃下後飢餓-3
    plant.call(this, "高級牧草"+index, 1, Math.floor(Math.random()*3)+12, true, 3, 2);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給grassC
proto.constructor = grassC;
grassC.prototype = proto;

var treeA = function(index){
    //蘋果樹 生命週期(growing)約30~35天
    plant.call(this, "蘋果樹"+index, 1, Math.floor(Math.random()*5)+30, true, 0, 3);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給treeA
proto.constructor = treeA;
treeA.prototype = proto;

var treeB = function(index){
    //蘋果樹 生命週期(growing)約20~40天
    plant.call(this, "椰子樹"+index, 1, Math.floor(Math.random()*10)+20, true, 1, 3);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給treeB
proto.constructor = treeB;
treeB.prototype = proto;


var  animal = [];
var arr_con=[0,0,0,0,0,0,0,0,0,0,0];
var arr_mem=["獅子","老虎","獵豹","斑馬","羚羊","鴕鳥","低級牧草","中級牧草","高級牧草","蘋果樹","椰子樹"];
for(var i=1; i<=100; i++) {//共計100日
    animal.forEach(function(item, index){
        if(!item.death){//移除已死亡物種降低內存
            animal.splice(index, 1);
        }
    })
    //每一日，所有動物 體力+1 飢餓度+1 年齡+1，所有植物 年齡+1
    animal.forEach(function(item, index){
        if(item.species<2){
            item.phys_strength++;
            if(++item.deg_hunger > 10){
                item.death = false;
                console.log(item.name+" 已經餓死了");
            }
            if(item.growing < ++item.age){
                item.death = false;
                console.log(item.name+" 自然死亡了");
            }
        }else{
            if(item.growing < ++item.age){
                item.death = false;
                console.log(item.name+" 已經枯死了");
            }
        }
    })

    //產生今日的物種
    var e = Math.floor(Math.random()*9)+1;//亂數決定今日要產生e隻(棵)
    var kind = Math.floor(Math.random()*11);//亂數決定今日要產生什麼動物

    console.log();
    console.log("第" + i + "天 產生了" + e + ((kind<6)?"隻":"株") + arr_mem[kind]);
    for(var j=1; j<=e; j++) {
        switch (kind) {
            case 0:animal.push(new lion(++arr_con[kind]));break;
            case 1:animal.push(new tiger(++arr_con[kind]));break;
            case 2:animal.push(new leopard(++arr_con[kind]));break;
            case 3:animal.push(new zebra(++arr_con[kind]));break;
            case 4:animal.push(new antelope(++arr_con[kind]));break;
            case 5:animal.push(new ostrich(++arr_con[kind]));break;
            case 6:animal.push(new grassA(++arr_con[kind]));break;
            case 7:animal.push(new grassB(++arr_con[kind]));break;
            case 8:animal.push(new grassC(++arr_con[kind]));break;
            case 9:animal.push(new treeA(++arr_con[kind]));break;
            case 10:animal.push(new treeB(++arr_con[kind]));break;
            default:
        }
    }

    console.log("////////////////////");
    console.log("開始每日事件");
    animal.forEach(function(item, index){
        if(item.death && item.species<2){//只有存活的動物會主動遇見其他物件
            var obj;
            do{
                obj = animal[Math.floor(Math.random()*animal.length)];//隨機相遇一種物件
            }while (item == obj || !obj.death)//避免預見自己與已死亡的物件
            item.meet(obj);//觸發相遇事件
        }
    });
    console.log("每日事件結束");
    console.log("////////////////////");
    console.log("");
}