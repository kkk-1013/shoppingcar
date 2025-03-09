//单件商品的数据
class UIgoods{
    constructor(g){
        this.data = g;
        this.choose = 0;
    }
    //获取总价
    getTotalPrice(){
        return this.data.price * this.choose;
    }
    //是否被选中
    IsChoose(){
        return this.choose > 0;
    }
    //增加选择数量+1
    increase(){
        this.choose++;
    }
    //减少选择数量+1
    reduce(){
        if(this.choose == 0){
            return;
        }
        this.choose--;
    }
}
//整个页面的数据
class UIData{
    constructor(){
        const uiGoods = [];
        for(let i = 0; i < goods.length;i++){
            let uig = new UIgoods(goods[i]);
            uiGoods.push(uig);
        }
        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }
    
    getTotalPrice(){
        let sum = 0;
        for(let i = 0;i<this.uiGoods.length;i++){
            var g = this.uiGoods[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }
    //增加某件商品的数量
    increase(index){
        this.uiGoods[index].increase();
    }

    //减少某件商品的数量
    reduce(index){
        this.uiGoods[index].reduce();
    }

    //总共选择了多少件商品
    getTotalChooseNumber(){
        let number = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            number += this.uiGoods[i].choose;
        }
        return number;
    }

    //是否有商品在购物车
    haveGoodsInCar(){
        return this.getTotalChooseNumber() > 0;
    }
    
    //是否达到起送标准
    isCrossDeliveryThreshold(){
        return this.getTotalPrice() >= this.deliveryThreshold;
    }

    //商品是否被选中
    IsChoose(index) {
        return this.uiGoods[index].IsChoose();
    }
}

//界面逻辑
class UI{
    constructor(){
        this.uiData = new UIData();
        this.doms = {
            goodsContainer : document.querySelector('.goods-list'),
            deliveryPrice : document.querySelector('.footer-car-tip'),
            footerPay : document.querySelector('.footer-pay'),
            footerPaySpan : document.querySelector('.footer-pay span'),
            totalPrice : document.querySelector('.footer-car-total'),
            shoppingCar :  document.querySelector('.footer-car'),
            badge : document.querySelector('.footer-car-badge'),

        };
        var carRect = this.doms.shoppingCar.getBoundingClientRect();
        var jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5,
        }
        this.jumpTarget = jumpTarget;
        this.createHTML();
        this.updateFooter();
        this.updateFooter();
        this.listenEvent();
    }

    //事件监听器
    listenEvent(){
        this.doms.shoppingCar.addEventListener('animationend',function(){
            this.classList.remove('animate')
        });
    }
    //构建页面的商品数据
    createHTML(){ 
        //1.生成html字符串（执行效率低，开发效率高）
        let html = '';
        for (let i = 0;i < this.uiData.uiGoods.length;i++){
            let g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
            <img src="${g.data.pic}" alt="" class="goods-pic" />
            <div class="goods-info">
            <h2 class="goods-title">${g.data.title}</h2>
            <p class="goods-desc">${g.data.desc}
            </p>
            <p class="goods-sell">
            <span>月售 ${g.data.sellNumber}</span>
            <span>好评率${g.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
            <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${g.data.price}</span>
            </p>
            <div class="goods-btns">
                <i index='${i}' class="iconfont i-jianhao"></i>
                <span>${g.choose}</span>
                <i index='${i}' class="iconfont i-jiajianzujianjiahao"></i>
            </div>
            </div>
        </div>
        </div>`
        }
        this.doms.goodsContainer.innerHTML = html;
    }

    increase(index){
        this.uiData.increase(index);
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index);
    }

    reduce(index){
        this.uiData.reduce(index);
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index);
    }

    //更新某个元素的商品状态
    updateGoodsItem(index){
        let goodsItem = this.doms.goodsContainer.children[index];
        if(this.uiData.IsChoose(index)){
            goodsItem.classList.add('active');
        }
        else{
            goodsItem.classList.remove('active');
        }
        let span = goodsItem.querySelector('.goods-btns span');
        span.textContent = this.uiData.uiGoods[index].choose;
    }

    //更新页脚
    updateFooter(){
        let total = this.uiData.getTotalPrice();
        this.doms.deliveryPrice.textContent = `配送费￥${ this.uiData.deliveryPrice }`;
        if(this.uiData.isCrossDeliveryThreshold()){
            this.doms.footerPay.classList.add('active');
        }else{
            this.doms.footerPay.classList.remove('active');
            //更新还差多少钱起送
            let dis = this.uiData.deliveryThreshold - total;
            dis = Math.round(dis);
            this.doms.footerPaySpan.textContent = `还差${dis}元起送`;
        }
        //设置总价 保留两位小数
        this.doms.totalPrice.textContent = total.toFixed(2);
        //设置购物车的样式状态
        if(this.uiData.haveGoodsInCar()){
            this.doms.shoppingCar.classList.add('active');
        }else{
            this.doms.shoppingCar.classList.remove('active');
        }

        //设置购物车数量
        this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
    }

    //购物车动画
    carAnimate(){
        this.doms.shoppingCar.classList.add('animate');
    }

    //跳跃
    jump(index){
        var jumpStar = this.doms.goodsContainer.children[index].
        querySelector('.i-jiajianzujianjiahao');
        var rect = jumpStar.getBoundingClientRect();
        var star = {
            x : rect.left,
            y : rect.top,
        };
        //跳
        var div = document.createElement('div');
        div.className = 'add-to-car';
        var i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';
        div.style.transform = `translatex(${star.x}px)`;
        i.style.transform = `translateY(${star.y}px)`;
        div.appendChild(i);
        document.body.appendChild(div);
        
        //强行渲染 读任何一个全局属性都会强行渲染
        div.clientWidth;

        div.style.transform = `translate(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;

        var that = this;
        div.addEventListener('transitionend',function(){
            div.remove();
            that.carAnimate();
        },
        {
            once : true,
        });
    }
}
let ui = new UI()

//事件
ui.doms.goodsContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('i-jiajianzujianjiahao')){
        var index = +e.target.getAttribute('index');
        ui.increase(index);
    }
    else if(e.target.classList.contains('i-jianhao')){
        var index = +e.target.getAttribute('index');
        ui.reduce(index);
    }
});
