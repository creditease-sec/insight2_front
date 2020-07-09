import axios from 'axios';
import {console_log} from './common'

export function gc(isForce = false) {

    let  gc = localStorage.getItem("global_config");

    if (gc && !isForce){
        console_log(gc,"全局变量")
        return JSON.parse(gc)
    }
    else{
        if(isForce){
            console_log("强制加载","全局变量")    
        }else{
            console_log("全局静态变量未加载","全局变量")
        }
        axios.get("/api/static/config?type=ALL").then(res=>{
            localStorage.setItem("global_config",JSON.stringify(res.data) )
            return res.data
        })
    }

}

export const global_config  = gc()

