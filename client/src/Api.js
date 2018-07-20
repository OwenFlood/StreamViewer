let endPoint
if (process.env.NODE_ENV === 'production') {
  endPoint = 'im an end point'
} else {
  endPoint = 'http://localhost:3051'
}

const Api = {
  saveSentMessage: ({ message, currentUser: current_user }) => {
    fetch(`${endPoint}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        current_user: current_user.w3.U3,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
}
export default Api