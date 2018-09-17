class organism {
    constructor(name, growing) {
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
    }
    grow_up(){
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
}

class pro_animal extends organism{
    constructor(name, growing, deg_hunger, phys_strength, speed) {
        super(name, growing);
        this.deg_hunger = deg_hunger;//飢餓度//int
        this.phys_strength = phys_strength;//體力//int
        this.speed = speed;//運動速度//int
    }
    meet(obj){
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
    }
    meet_carnivore(obj){
        console.log("啥都沒有發生");
    }
    meet_herbivore(obj){
        console.log("啥都沒有發生");
    }
    meet_grass(obj){
        console.log("啥都沒有發生");
    }
    meet_tree(obj){
        console.log("啥都沒有發生");
    }
}

class carnivore extends pro_animal{
    constructor(name, growing, deg_hunger, phys_strength, speed, reamount) {
        super(name, growing, deg_hunger, phys_strength, speed);
        var reamount = reamount;
        this.get_reamount = function(){
            return reamount;
        }
    }
    meet_herbivore(obj){
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
    }
    meet_carnivore(obj){
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
    }
}

class herbivore extends pro_animal{
    constructor(name, growing, deg_hunger, phys_strength, speed, reamount) {
        super(name, growing, deg_hunger, phys_strength, speed);
        var reamount = reamount;
        this.get_reamount = function(){
            return reamount;
        }
    }
    meet_herbivore(obj){
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
    }
    meet_carnivore(obj){
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
    }
    meet_grass(obj){
        this.deg_hunger-=obj.get_reamount;//自己飢餓度下降
        obj.set_death();
        console.log(this.name+" 吃了 "+obj.name);
    }
}

class lion extends carnivore{
    constructor(index){
        super("獅子"+index, Math.floor(Math.random()*10)+30, 5, 15, Math.floor(Math.random()*10)+60, 3);
    }
}
class tiger extends carnivore{
    constructor(index){
        super("老虎"+index, Math.floor(Math.random()*10)+25, 5, 12, Math.floor(Math.random()*10)+55, 2);
    }
}
class leopard extends carnivore{
    constructor(index){
        super("獵豹"+index, Math.floor(Math.random()*10)+20, 5, 10, Math.floor(Math.random()*10)+80, 1);
    }
}
class zebra extends herbivore{
    constructor(index){
        super("斑馬"+index, Math.floor(Math.random()*5)+35, 5, 15, Math.floor(Math.random()*10)+50, 3);
    }
}
class antelope extends herbivore{
    constructor(index){
        super("羚羊"+index, Math.floor(Math.random()*10)+25, 5, 12, Math.floor(Math.random()*10)+55, 2);
    }
}
class ostrich extends herbivore{
    constructor(index){
        super("鴕鳥"+index, Math.floor(Math.random()*10)+20, 5, 10, Math.floor(Math.random()*10)+85, 1);
    }
}

class plant extends organism{
    constructor(name, growing){
        super(name, growing);
    }
}

class grass extends plant{
    constructor(name, growing, reamount){
        super(name, growing);
        var reamount = reamount;
    }
    get_reamount(){
        return reamount;
    }
}

class grassA extends grass{
    constructor(index){
        super("低級牧草"+index, Math.floor(Math.random()*3)+8, 1);
    }
}
class grassB extends grass{
    constructor(index){
        super("中級牧草"+index, Math.floor(Math.random()*3)+10, 2);
    }
}
class grassC extends grass{
    constructor(index){
        super("高級牧草"+index, Math.floor(Math.random()*3)+12, 3);
    }
}

class tree extends plant{
    constructor(name, growing){
        super(name, growing);
    }
}

class treeA extends tree{
    constructor(index){
        super("蘋果樹"+index, Math.floor(Math.random()*5)+30);
    }
}
class treeB extends tree{
    constructor(index){
        super("椰子樹"+index, Math.floor(Math.random()*10)+20);
    }
}

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