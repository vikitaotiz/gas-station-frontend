export default(({app}, inject) => {
    // Inject $notification() in Vue
    inject('notification_kitchen', () => {
        let src = '../notification_sounds/kitchen.mp3'
        let audio = new Audio(src)
        audio.play()
    })
})