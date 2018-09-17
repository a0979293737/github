var organism = function(name, growing){
    //生物
    this.name = name;//名稱//string
    this.age = 0;//年齡//初始為0
    var growing = growing;//生命週期//初始後僅可查詢
    var death = true;//死亡//初始為true，僅可使用相關function修改
    this.get_death = function () {//death參數僅可查詢不可外部訪問
        return death;
    }
    this.set_death = function () {//death參數僅可修改為已死亡
        death = false;
    }
    this.get_growing = function () {//growing參數僅可查詢不可外部訪問
        return growing;
    }
    this.grow_up = function () {
        if(this.__proto__ instanceof pro_animal && this.get_death()){//尚存活的動物 體力+1 飢餓度+1 年齡+1
            this.phys_strength++;
            if(++this.deg_hunger > 10){
                this.set_death();
                console.log(this.name+" 已經餓死了");
            }
            if(this.get_growing() < ++this.age){
                this.set_death();
                console.log(this.name+" 自然死亡了");
            }
        }else if(this.__proto__ instanceof plant && this.get_death()){//尚存活的植物 年齡+1
            if(this.get_growing() < ++this.age){
                this.set_death();
                console.log(this.name+" 已經枯死了");
            }
        }
    }
};

var pro_animal = function(name, growing, deg_hunger, phys_strength, speed){
    //動物
    organism.call(this, name, growing);//繼承生物
    this.deg_hunger = deg_hunger;//飢餓度//int
    //this.eating = eating;//進食//booleam
    this.phys_strength = phys_strength;//體力//int
    this.speed = speed;//運動速度//int
    //this.run = run;//跑//booleam
    this.meet = function (obj) {//相遇事件
        console.log(this.name+" 遇到 "+obj.name);
        if(obj.__proto__ instanceof carnivore){//遇到肉食
            this.meet_carnivore(obj);
        }else if(obj.__proto__ instanceof herbivore){//遇到草食
            this.meet_herbivore(obj);
        }else if(obj.__proto__ instanceof grass){//遇到草
            this.meet_grass(obj);
        }else if(obj.__proto__ instanceof tree){//遇到樹
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

var carnivore = function(name, growing, deg_hunger, phys_strength, speed, reamount){
    //////////////////////肉食動物//////////////////////
    pro_animal.call(this, name, growing, deg_hunger, phys_strength, speed);//繼承動物
    var reamount = reamount;//1.獵豹 2.老虎 3.獅子 4.... 5.... 6....
    this.get_reamount = function () {
        return reamount;
    }
    this.meet_herbivore = function (obj) {//Override父類別，meet_herbivore()
        //肉食動物遇到草食動物，追起來。追到就吃掉
        if(this.speed >= obj.speed){
            this.deg_hunger-=obj.get_reamount();//追到吃了，飢餓度下降
            obj.set_death();//對方死了
            console.log(obj.name+" 被吃了");
        }else{
            if(--obj.phys_strength<0) {//對方體力下降
                obj.set_death();//體力小於零則死
                this.deg_hunger-=obj.get_reamount();//飢餓度下降
                console.log(obj.name+"累死了");
            }else{
                this.deg_hunger++;//追不到，飢餓度上升
                console.log(obj.name+"逃跑了");
            }
        }
        if(--this.phys_strength<0) {//自己體力下降
            this.set_death();//體力小於零則死
            console.log(this.name+" 累死了");
        }
    };
    this.meet_carnivore = function (obj) {//Override父類別，meet_carnivore()
        //肉食動物遇到肉食動物，打起來。打贏就吃掉
        if(this.phys_strength >= obj.phys_strength){
            this.deg_hunger-=obj.get_reamount();//打贏吃了，飢餓度下降
            obj.set_death();//對方死了
            console.log(obj.name+" 被吃了");
            if(--this.phys_strength<0) {//自己體力下降
                this.set_death();//體力小於零則死
                console.log(this.name+" 累死了");
            }
        }else{
            this.set_death();//打輸，被吃了
            obj.deg_hunger--;//對方飢餓度下降
            console.log(this.name+" 被吃了");
            if(--obj.phys_strength<0) {//對方體力下降
                obj.set_death();//體力小於零則死
                console.log(obj.name+"累死了");
            }
        }
    };
};
proto = Object.create(pro_animal.prototype);//將pro_animal.prototype繼承給carnivore
proto.constructor = carnivore;
carnivore.prototype = proto;

var herbivore = function(name, growing, deg_hunger, phys_strength, speed, reamount){
    //////////////////////草食動物//////////////////////
    pro_animal.call(this, name, growing, deg_hunger, phys_strength, speed);
    var reamount = reamount;//1.鴕鳥 2.羚羊 3.斑馬 4.... 5.... 6....
    this.get_reamount = function () {
        return reamount;
    }
    this.meet_herbivore = function (obj) {
        //草食動物遇到草食動物，打起來
        if(this.phys_strength == obj.phys_strength){
            console.log("雙方打了一架，雙方損失2體力");
            if((this.phys_strength-=2)<0){//打平，扣2
                this.set_death();
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=2)<0){//打平，扣2
                obj.set_death();
                console.log(obj.name+"累死了");
            }
        }else if(this.phys_strength > obj.phys_strength){
            console.log("雙方打了一架"+this.name+" 損失1體力 "+obj.name+" 損失3體力");
            if(--this.phys_strength<0){
                this.set_death();
                console.log(this.name+"累死了");
            }
            if((obj.phys_strength-=3)<0){
                obj.set_death();
                console.log(obj.name+"累死了");
            }
        }else{
            console.log("雙方打了一架"+this.name+" 損失3體力 "+obj.name+" 損失1體力");
            if((this.phys_strength-=3)<0){
                this.set_death();
                console.log(this.name+"累死了");
            }
            if(--obj.phys_strength<0){
                obj.set_death();
                console.log(obj.name+"累死了");
            }
        }
    };
    this.meet_carnivore = function (obj) {
        //草食動物遇到肉食動物，跑起來。
        if(this.speed >= obj.speed){
            //草食跑贏
            if(--this.phys_strength<0){//體力下降
                this.set_death();//體力小於零，死去
                obj.deg_hunger-=obj.get_reamount();//對方飢餓度下降
                console.log(this.name+"累死了");
            }else{
                console.log(this.name+"逃跑了");
            }
        }else{
            //肉食跑贏
            this.set_death();//草食跑輸，被吃了
            obj.deg_hunger-=obj.get_reamount();//對方飢餓度下降
            console.log(this.name+"被吃了");
            if(--obj.phys_strength<0){//對方體力下降，若對方體力小於零，死去
                obj.set_death();
                console.log(obj.name+"累死了");
            }
        }
    };
    this.meet_grass = function (obj) {
        //草食動物遇到草，吃起來。
        this.deg_hunger-=obj.get_reamount;//自己飢餓度下降
        obj.set_death();
        console.log(this.name+" 吃了 "+obj.name);
    };
};
proto = Object.create(pro_animal.prototype);//將pro_animal.prototype繼承給herbivore
proto.constructor = herbivore;
herbivore.prototype = proto;

var lion = function(index){
    //獅子 生命週期(growing)約30~40天 體力(phys_strength)15 速度(speed)約60~70
    carnivore.call(this, "獅子"+index, Math.floor(Math.random()*10)+30, 5, 15, Math.floor(Math.random()*10)+60, 3);//繼承肉食動物
}
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給lion
proto.constructor = lion;
lion.prototype = proto;

var tiger = function(index){
    //老虎 生命週期(growing)約25~35天 體力(phys_strength)12 速度(speed)約55~65
    carnivore.call(this, "老虎"+index, Math.floor(Math.random()*10)+25, 5, 12, Math.floor(Math.random()*10)+55, 2);//繼承肉食動物
};
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給tiger
proto.constructor = tiger;
tiger.prototype = proto;

var leopard = function(index){
    //獵豹 生命週期(growing)約20~30天 體力(phys_strength)10 速度(speed)約80~90
    carnivore.call(this, "獵豹"+index, Math.floor(Math.random()*10)+20, 5, 10, Math.floor(Math.random()*10)+80, 1);//繼承肉食動物
};
proto = Object.create(carnivore.prototype);//將carnivore.prototype繼承給leopard
proto.constructor = leopard;
leopard.prototype = proto;

var zebra = function(index){
    //斑馬 生命週期(growing)約35~40天 體力(phys_strength)15 速度(speed)約50~60
    herbivore.call(this, "斑馬"+index, Math.floor(Math.random()*5)+35, 5, 15, Math.floor(Math.random()*10)+50, 3);//繼承草食動物
};
proto = Object.create(herbivore.prototype);//將herbivore.prototype繼承給zebra
proto.constructor = zebra;
zebra.prototype = proto;

var antelope = function(index){
    //羚羊 生命週期(growing)約25~35天 體力(phys_strength)10 速度(speed)約55~65
    herbivore.call(this, "羚羊"+index, Math.floor(Math.random()*10)+25, 5, 12, Math.floor(Math.random()*10)+55, 2);//繼承草食動物
};
proto = Object.create(herbivore.prototype);//將herbivore.prototype繼承給antelope
proto.constructor = antelope;
antelope.prototype = proto;

var ostrich = function(index){
    //鴕鳥 生命週期(growing)約15~20天 體力(phys_strength)8 速度(speed)約85~95
    herbivore.call(this, "鴕鳥"+index, Math.floor(Math.random()*10)+20, 5, 10, Math.floor(Math.random()*10)+85, 1);//繼承草食動物
};
proto = Object.create(herbivore.prototype);//將herbivore.prototype繼承給ostrich
proto.constructor = ostrich;
ostrich.prototype = proto;


var plant = function(name, growing){
    //植物
    organism.call(this, name, growing);//繼承生物
};
proto = Object.create(organism.prototype);//將organism.prototype繼承給plant
proto.constructor = plant;
plant.prototype = proto;

var grass = function(name, growing, reamount){
    //草
    plant.call(this, name, growing);
    var reamount = reamount;//1.低級牧草 2.中級牧草 3.高級牧草 4.... 5.... 6....
    this.get_reamount = function () {
        return reamount;
    }
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給grass
proto.constructor = grass;
grass.prototype = proto;

var grassA = function(index){
    //低級牧草 生命週期(growing)約8~10天　吃下後飢餓-1
    grass.call(this, "低級牧草"+index, Math.floor(Math.random()*3)+8, 1);
};
proto = Object.create(grass.prototype);//將grass.prototype繼承給grassA
proto.constructor = grassA;
grassA.prototype = proto;

var grassB = function(index){
    //中級牧草 生命週期(growing)約10~12天　吃下後飢餓-2
    grass.call(this, "中級牧草"+index, Math.floor(Math.random()*3)+10, 2);
};
proto = Object.create(grass.prototype);//將grass.prototype繼承給grassB
proto.constructor = grassB;
grassB.prototype = proto;

var grassC = function(index){
    //高級牧草 生命週期(growing)約12~15天　吃下後飢餓-3
    grass.call(this, "高級牧草"+index, Math.floor(Math.random()*3)+12, 3);
};
proto = Object.create(grass.prototype);//將grass.prototype繼承給grassC
proto.constructor = grassC;
grassC.prototype = proto;

var tree = function(name, growing){
    //樹
    plant.call(this, name, growing);
};
proto = Object.create(plant.prototype);//將plant.prototype繼承給tree
proto.constructor = tree;
tree.prototype = proto;

var treeA = function(index){
    //蘋果樹 生命週期(growing)約30~35天
    tree.call(this, "蘋果樹"+index, Math.floor(Math.random()*5)+30);
};
proto = Object.create(tree.prototype);//將tree.prototype繼承給treeA
proto.constructor = treeA;
treeA.prototype = proto;

var treeB = function(index){
    //蘋果樹 生命週期(growing)約20~40天
    tree.call(this, "椰子樹"+index, Math.floor(Math.random()*10)+20);
};
proto = Object.create(tree.prototype);//將tree.prototype繼承給treeB
proto.constructor = treeB;
treeB.prototype = proto;

var  animal = [];
var arr_con=[0,0,0,0,0,0,0,0,0,0,0];
for(var i=1; i<=100; i++) {//共計100日
    //每一日，所有動物 體力+1 飢餓度+1 年齡+1，所有植物 年齡+1
    animal.forEach(function(item, index){
        item.grow_up();
    })
    for(var j=0; j<animal.length; j++){
        if(!animal[j].get_death()){
            animal.splice(j--, 1);//將已死亡生物移除陣列以降低內存
        }
    }

    //產生今日的物種
    var e = Math.floor(Math.random()*9)+1;//亂數決定今日要產生e隻(棵)
    var kind = Math.floor(Math.random()*11);//亂數決定今日要產生什麼動物

    console.log();
    var msg = "";
    for(var j=1; j<=e; j++) {
        switch (kind) {
            case 0:msg="隻獅子";animal.push(new lion(++arr_con[kind]));break;
            case 1:msg="隻老虎";animal.push(new tiger(++arr_con[kind]));break;
            case 2:msg="隻獵豹";animal.push(new leopard(++arr_con[kind]));break;
            case 3:msg="隻斑馬";animal.push(new zebra(++arr_con[kind]));break;
            case 4:msg="隻羚羊";animal.push(new antelope(++arr_con[kind]));break;
            case 5:msg="隻鴕鳥";animal.push(new ostrich(++arr_con[kind]));break;
            case 6:msg="株低級牧草";animal.push(new grassA(++arr_con[kind]));break;
            case 7:msg="株中級牧草";animal.push(new grassB(++arr_con[kind]));break;
            case 8:msg="株高級牧草";animal.push(new grassC(++arr_con[kind]));break;
            case 9:msg="株蘋果樹";animal.push(new treeA(++arr_con[kind]));break;
            case 10:msg="株椰子樹";animal.push(new treeB(++arr_con[kind]));break;
            default:
        }
    }
    console.log("第" + i + "天 產生了" + e + msg);

    console.log("////////////////////");
    console.log("開始每日事件");
    animal.forEach(function(item, index){
        if(item.__proto__ instanceof pro_animal && item.get_death()){//只有存活的動物會主動遇見其他物件
            var obj;
            do{
                obj = animal[Math.floor(Math.random()*animal.length)];//隨機相遇一種物件
            }while (item == obj || !obj.get_death())//避免預見自己或已死亡的物件
            item.meet(obj);//觸發相遇事件
        }
    });
    console.log("每日事件結束");
    console.log("////////////////////");
    console.log("");
}
