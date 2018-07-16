import React from 'react'
import {
  Grid,
  Row,
  Col,
  Image,
  PageHeader,
} from 'react-bootstrap'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: [],
      chatMessages: [],
    }
    this.streamId = window.location.search.split('=')[1]
  }

  componentDidMount() {
    this.listenToLiveChat()
  }

  render() {
    return (
      <Grid>
        <PageHeader style={{textAlign: 'left'}}>
          Your Stream
        </PageHeader>
        <iframe
          width="420"
          height="315"
          src={`https://www.youtube.com/embed/${this.streamId}`}
        />
        {this.state.chatMessages.map((message) => (
          <div>{message}</div>
        ))}
      </Grid>
    )
  }
  
  listenToLiveChat = () => {
    const youtubeApi = window.gapi.client.youtube
    if (!youtubeApi) {
      this.loadYoutubeApi()
      return
    }
    // debugger
    
    const currentStream = window.gapi.client.youtube.videos.list({
      part: 'liveStreamingDetails',
      id: this.streamId,
    })
    currentStream.execute(({ items: videos }) => {
      const chatId = videos[0].liveStreamingDetails.activeLiveChatId

      const chatMessages = window.gapi.client.youtube.liveChatMessages.list({
        part: 'snippet',
        liveChatId: chatId,
      })
      chatMessages.execute(({ items }) => {
        const messages = items.map(({ snippet }) => (
          snippet.displayMessage
        ))
        this.setState({ chatMessages: this.state.chatMessages.concat(messages) })
        // I need to use nextPageToken and pollingIntervalMillis
        // to continueously hit the server for constant updates
        // on the chat
        // debugger
      })
    })
    

    // const searchRequest = window.gapi.client.youtube.search.list({
    //   part: 'snippet',
    //   maxResults: '3',
    //   type: 'video',
    //   eventType: 'live',
    // })
    // searchRequest.execute(({ items: videos }) => {
    //   this.setState({ videos })
    // })
  }
  
  loadYoutubeApi = () => {
    window.gapi.client.load('youtube', 'v3', (response) => {
      this.getCurrentLiveStream()
    })
  }
}