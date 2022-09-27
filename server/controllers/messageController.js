const Messages = require('../models/messageModel')

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body

    console.log(from, 'from!')

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 })

    const projectedMessages = messages.map((msg) => {
      console.log(msg, 'msg?@?')
      // {
      //   message: { text: 'hi het12 nice to meet you !' },
      //   _id: new ObjectId("6330594aeee0b70190255a8f"),
      //   users: [ '63305938eee0b70190255a8a', '633058d2eee0b70190255a78' ],
      //   sender: new ObjectId("63305938eee0b70190255a8a"),
      //   createdAt: 2022-09-25T13:36:10.863Z,
      //   updatedAt: 2022-09-25T13:36:10.863Z,
      //   __v: 0
      // } msg?@?
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      }
    })
    res.json(projectedMessages)
  } catch (ex) {
    next(ex)
  }
}

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    })

    if (data) return res.json({ msg: 'Message added successfully.' })
    else return res.json({ msg: 'Failed to add message to the database' })
  } catch (ex) {
    next(ex)
  }
}
