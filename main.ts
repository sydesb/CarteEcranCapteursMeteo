function AfficheMeteo () {
    dht11_dht22.queryData(
    DHTtype.DHT22,
    DigitalPin.P1,
    true,
    false,
    false
    )
    Temperature = dht11_dht22.readData(dataType.temperature)
    Humidite = dht11_dht22.readData(dataType.humidity)
    if (dht11_dht22.readDataSuccessful()) {
        I2C_LCD1602.ShowString("T:", 0, 0)
        I2C_LCD1602.ShowNumber(Math.round(Temperature), 2, 0)
        I2C_LCD1602.ShowString("C Hum:", 4, 0)
        I2C_LCD1602.ShowNumber(Math.round(Humidite), 10, 0)
        I2C_LCD1602.ShowString("%", 12, 0)
        I2C_LCD1602.ShowNumber(CalculHauteurNeige(), 14, 0)
        I2C_LCD1602.ShowString("m", 15, 0)
    }
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "1") {
        nom = "Rene Cassin"
        strip.showRainbow(1, 360)
    }
    if (receivedString == "2") {
        nom = "Vera Rubin   "
        strip.showRainbow(1, 360)
    }
    if (receivedString == "3") {
        nom = "            "
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
})
function CalculHauteurNeige () {
    capteurNeige = pins.analogReadPin(AnalogPin.P2)
    if (capteurNeige < capteurNeigeMax) {
        capteurNeige = capteurNeigeMax
    }
    if (capteurNeige > CapteurNeigeMin) {
        capteurNeige = CapteurNeigeMin
    }
    HauteurNeige = Math.round(9 * ((capteurNeige - CapteurNeigeMin) / (capteurNeigeMax - CapteurNeigeMin)))
    if (HauteurNeige > 9) {
        HauteurNeige = 9
    }
    return HauteurNeige
}
let temps = 0
let HauteurNeige = 0
let capteurNeige = 0
let Humidite = 0
let Temperature = 0
let CapteurNeigeMin = 0
let capteurNeigeMax = 0
let nom = ""
let strip: neopixel.Strip = null
basic.showIcon(IconNames.Heart)
I2C_LCD1602.LcdInit(0)
radio.setGroup(97)
strip = neopixel.create(DigitalPin.P0, 8, NeoPixelMode.RGB)
nom = "            "
capteurNeigeMax = 199
CapteurNeigeMin = 270
let tempsdebut = input.runningTime() - 2000
basic.clearScreen()
basic.forever(function () {
    if (nom != "            ") {
        I2C_LCD1602.ShowString(nom, 0, 1)
        for (let j = 0; j <= 7; j++) {
            strip.setPixelColor(j, neopixel.colors(NeoPixelColors.Black))
            strip.show()
            basic.pause(500)
        }
    }
    temps = input.runningTime()
    if (temps - tempsdebut > 2000) {
        tempsdebut = temps
        AfficheMeteo()
    }
    I2C_LCD1602.ShowString(nom, 0, 1)
})
