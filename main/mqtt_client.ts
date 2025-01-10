import mqtt from "mqtt";
import { globalMainWindow } from "./background";

export const mqttClient = mqtt.connect("mqtt://rover-server");
interface fileTranmit {
    filename: string;
    team: string;
}
interface uploadAllowed {
    enable: boolean;
}
mqttClient.on("connect", (packet: mqtt.IConnackPacket) => {
    console.log("MQTT Connected", packet.cmd)
    mqttClient.subscribe("/app/reportState")
    mqttClient.subscribe("/app/enableUpload")
})

mqttClient.on("error", (error: Error | mqtt.ErrorWithReasonCode) => {
    console.log("MQTT Error : ", error.message)
})


mqttClient.on("message", (topic: string, payload: Buffer, packet: mqtt.IPublishPacket) => {
    if (topic === "/app/reportState") {
        var payloadJson = JSON.parse(payload.toString())
        console.log(JSON.stringify(payloadJson))
        var toFront: fileTranmit = {
            filename: payloadJson["url"],
            team: payloadJson["team"]
        }
        globalMainWindow.webContents.send("image", toFront)
    }
    if (topic === "/app/enableUpload"){
        var uploadStateToFront : uploadAllowed = JSON.parse(payload.toString())
        globalMainWindow.webContents.send("imageState",uploadStateToFront)
    }
})

