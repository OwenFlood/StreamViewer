let endPoint
if (process.env.NODE_ENV === 'production') {
  endPoint = 'https://stream-viewer.herokuapp.com'
} else {
  endPoint = 'http://localhost:3051'
}

const Api = {
  logIn: ({ w3: { U3: email } }) => {
    fetch(`${endPoint}/sessions`, {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  saveSentMessage: ({ message, videoId: video_id, currentUser: current_user }, callback) => {
    fetch(`${endPoint}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        video_id,
        current_user: current_user.w3.U3,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(callback)
  },
  getVideoStats: ({ videoId, filter }, callback) => {
    fetch(
      `${endPoint}/stats?video_id=${videoId}&filter=${filter}`,
    ).then((response) => (
      response.json()
    )).then(callback)
  }
}
export default Api