'use strict';

module.exports = ({ strapi }) => ({
  stream() {
    const ctx = strapi.requestContext.get()
    const { id, client } = strapi.queue.addClient()

    ctx.set({
      'Content-Type': 'audio/mp3',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    // when the client closes the connection, remove it from the queue
    ctx.res.on('close', () => {
      console.log(`client ${id} closed connection`);
      strapi.queue.removeClient(id)
    })

    return client
  },
});
