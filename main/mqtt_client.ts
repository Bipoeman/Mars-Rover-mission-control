import mqtt from "mqtt";
import { globalMainWindow } from "./background";

export const mqttClient = mqtt.connect("mqtt://localhost");
interface fileTranmit {
    filename: string;
    team: string;
  }
mqttClient.on("connect",(packet: mqtt.IConnackPacket)=>{
    console.log("MQTT Connected",packet.cmd)
    mqttClient.subscribe("/app/reportState")
})

mqttClient.on("error",(error: Error | mqtt.ErrorWithReasonCode)=>{
    console.log("MQTT Error : ",error.message)
})


mqttClient.on("message",(topic: string, payload: Buffer, packet: mqtt.IPublishPacket)=>{
    if (topic === "/app/reportState"){
        var payloadJson = JSON.parse(payload.toString())
        console.log(JSON.stringify(payloadJson))
        var toFront : fileTranmit = {
            filename : payloadJson["url"],
            team : payloadJson["team"]
        }
        globalMainWindow.webContents.send("image",toFront)
    }
})

