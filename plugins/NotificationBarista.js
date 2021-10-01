export default(({app}, inject) => {
    // Inject $notification() in Vue
    inject('notification_barista', () => {
        let src = '../notification_sounds/barista.mp3'
        let audio = new Audio(src)
        audio.play()
    })
})