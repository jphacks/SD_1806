import axios from 'axios'

// 同一ネットワークに接続し，APIサーバの立っているPC(orデバイス)のIPにアクセスする
const API_ROOT = "http://10.32.228.233:5000/"

export function example(context: any) {
    axios.get(API_ROOT + "amount")
        .then(res => {
            console.log(res)
            context.setState({
                amount: res.data.amount*25,
                name: "プラごみ"
            })
        })
        .catch(error => {
            console.log('error');
        });
}