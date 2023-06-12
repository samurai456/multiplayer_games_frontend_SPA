
class CustomWs extends WebSocket{
    constructor(url){
        super(url)
        super.onopen = this.onopen;
        super.onerror = this.onerror;
        super.onclose = this.onclose;
        super.onmessage = this.onmessage;
        this.customCallbacks = [];
    }
    onerror(){
        console.log('connection error ocured')
    }
    onclose(){
        console.log('connection closed')
    }
    onopen(){
        console.log('connection opend')
    }
    delCbByKey(key){
        this.customCallbacks = this.customCallbacks.filter(i=>i.key!==key);
    }
    addCustomCb({key, cb}){
        this.customCallbacks.push({key, cb});
    }
    onmessage(m){
        const data = m.data;
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            console.log(data);
            console.log('received data is not json!');
            return
        }
        this.customCallbacks.forEach(i=>i.cb(jsonData));
    }
    send(m){
        if(!this.readyState){
            setTimeout(()=>this.send(m), 200);
            return
        }
        const data = JSON.stringify(m);
        super.send(data);
    }
}

export { CustomWs }