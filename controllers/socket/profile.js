
/**
 * <p>绑定 profile 事件</p>
 */
exports = module.exports = function (data) {

    if (!data)
        return;
    console.log(this.id + '改变个人资料' + data.face + ',' + data.nickname);
    this.nickname = data.nickname || this.nickname;
    this.face = data.face || this.face;
    this.desc = data.desc || this.desc;
    this.rooms.forEach(function (roomId) {
        this.to(roomId).emit('profile', {
            id: this.id,
            roomId: roomId,
            nickname: this.nickname,
            face: this.face,
            desc: this.desc
        });
    });

};