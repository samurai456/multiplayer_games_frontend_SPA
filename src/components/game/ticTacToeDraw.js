

class TicTacToeDraw{
    constructor(s, canv){
        this.ctx = canv.getContext('2d');
        this.s = s;
        this.ctx.lineWidth = 20;
    }

    changeSize(s, moves){
        this.cls();
        this.s = s;
        this.ctx.lineWidth = 20;
        this.drawAll(moves);
    }

    drawAll(moves){
        this.cls();
        this.drawBorders()
        moves.forEach((row, y)=>{
            row.forEach((i, x)=>{
                if(i===1) this.drawXStatic({x, y})
                if(i===2) this.drawOStatic({x, y})
            });
        });
    }

    drawBorders(){
        const s = this.s;
        this.ctx.fillRect(s/3-5,0, 10, s)
        this.ctx.fillRect(s/3*2-5,0, 10, s)
        this.ctx.fillRect(0, s/3-5, s, 10)
        this.ctx.fillRect(0, s/3*2-5, s, 10)
    }

    cls(){
        this.ctx.clearRect(0,0, this.s, this.s)
    }

    drawO({x, y}){
        const [centerX, centerY, radius] = this.getOCrds(this.s, x, y);
        this.animativeODraw(centerX, centerY, radius);
    }

    getOCrds(s, x, y){
        const centerX = s/3*x+s/3/2;
        const centerY = s/3*y+s/3/2;
        const radius = s/3/2-20;
        return [centerX, centerY, radius]
    }

    animativeODraw(centerX, centerY, radius){
        let x = 0;
        const intervalId = setInterval(()=>{
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 3.6, x/100+3.6)
            this.ctx.stroke();
            if(x>630) clearInterval(intervalId)
            x+=10;
        }, 12)
    }

    drawX({x, y}){
        this.drawXLine1(this.s, this.ctx, x, y);
        setTimeout(()=>this.drawXLine2(this.s, this.ctx, x, y), 400);
    }

    drawXLine1(s, ctx, x, y){
        const [xCrd, yCrd, xCrdE, yCrdE] = this.getXLine1Crds(s, x, y); 
        this.animativeXDrawLine1(xCrd, yCrd, xCrdE, yCrdE);
    }

    getXLine1Crds(s, x, y){
        const xCrd = s/3*x+20;
        const yCrd = s/3*y+20;
        const xCrdE = s/3*(x+1)-20;
        const yCrdE =  s/3*(y+1)-20;
        return [xCrd, yCrd, xCrdE, yCrdE]
    }

    drawXLine2(s, ctx, x, y){
        const [xCrd, yCrd, xCrdE, yCrdE] = this.getXLine2Crds(s, x, y);
        this.animativeXDrawLine2(xCrd, yCrd, xCrdE, yCrdE);
    }

    getXLine2Crds(s, x, y){
        const xCrd = s/3*(x+1)-20;
        const yCrd = s/3*y+20;
        const xCrdE = s/3*x+20;
        const yCrdE = s/3*(y+1)-20;
        return [xCrd, yCrd, xCrdE, yCrdE]
    }

    animativeXDrawLine1(xCrd, yCrd, xCrdE, yCrdE){
        let x = xCrd;
        let y = yCrd;
        let step = (xCrdE-xCrd)/30
        const id = setInterval(()=>{
            this.ctx.beginPath();
            this.ctx.moveTo(xCrd, yCrd);
            if(x < xCrdE){
                (x+step>xCrdE)?(x=xCrdE):(x+=step);
                (y+step>yCrdE)?(y=yCrdE):(y+=step);
            } else {
                clearInterval(id)
            }
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }, 12);
    }

    animativeXDrawLine2(xCrd, yCrd, xCrdE, yCrdE){
        let x = xCrd;
        let y = yCrd;
        let step = (xCrd-xCrdE)/30
        const id = setInterval(()=>{
            this.ctx.beginPath();
            this.ctx.moveTo(xCrd, yCrd);
            if(x > xCrdE){
                (x-step>xCrdE)?(x-=step):(x=xCrdE);
                (y+step>yCrdE)?(y=yCrdE):(y+=step);
            } else {
                clearInterval(id)
            }
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }, 12);
    }

    drawXStatic({x, y}){
        this.drawXLine1Static(this.s, x, y);
        this.drawXLine2Static(this.s, x, y)
    }

    drawXLine1Static(s, x, y){
        const [xCrd, yCrd, xCrdE, yCrdE] = this.getXLine1Crds(s, x, y);
        this.drawLineStatic(xCrd, yCrd, xCrdE, yCrdE);
    }
    
    drawXLine2Static(s, x, y){
        const [xCrd, yCrd, xCrdE, yCrdE] = this.getXLine2Crds(s, x, y);
        this.drawLineStatic(xCrd, yCrd, xCrdE, yCrdE);
    }

    drawLineStatic(xCrd, yCrd, xCrdE, yCrdE){
        this.ctx.beginPath();
        this.ctx.moveTo(xCrd, yCrd);
        this.ctx.lineTo(xCrdE, yCrdE);
        this.ctx.stroke();
    }

    drawOStatic({x, y}){
        const [centerX, centerY, radius] = this.getOCrds(this.s, x, y);
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 6.30)
        this.ctx.stroke();
    }

    drawStreak(poss){
        const [x, y] = poss.at(0);
        const [xE, yE] = poss.at(-1);
        const [xCrd, yCrd, xCrdE, yCrdE] = this.getStreakCrds(this.s, x, y, xE, yE);
        setTimeout(()=>this.drawStreakStatic(xCrd, yCrd, xCrdE, yCrdE), 800);
    }

    drawStreakStatic(xCrd, yCrd, xCrdE, yCrdE){
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 25;
        this.ctx.beginPath();
        this.ctx.moveTo(xCrd, yCrd);
        this.ctx.lineTo(xCrdE, yCrdE);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 25;
    }

    getStreakCrds(s, x, y, xE, yE){
        const xCrd = s/3*x+s/3/2;
        const yCrd = s/3*y+s/3/2;
        const xCrdE = s/3*xE+s/3/2;
        const yCrdE = s/3*yE+s/3/2;
        return [xCrd, yCrd, xCrdE, yCrdE]
    }
}

export { TicTacToeDraw }