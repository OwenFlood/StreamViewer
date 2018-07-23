import React from 'react'
import '../styles/Watch.css'
import {
  Grid,
  Row,
  Col,
  PageHeader,
  FormControl,
  Alert,
} from 'react-bootstrap'
import Api from '../Api'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: [],
      chatMessages: [],
      message: '',
      currentChatId: null,
      error: false,
    }
    this.streamId = window.location.search.split('=')[1]
  }

  componentDidMount() {
    this.getCurrentLiveStream()
  }

  render() {
    return (
      <Grid>
        <PageHeader style={{textAlign: 'left'}}>
          Your Stream
        </PageHeader>
        {this.state.error && (<Alert bsStyle="warning">Something Went Wrong</Alert>)}
        <Row>
          <Col xs={12} md={6} style={{ height: 390 }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${this.streamId}`}
            />
          </Col>
          <Col className="well" style={{ textAlign: 'left', marginBottom: '0px' }} xs={12} md={6}>
            <h3><strong>Live Chat</strong></h3>
            <ul id="live-chat">
              {this.renderChatMessages()}
            </ul>
            <form onSubmit={this.sendChatMessage}>
              <FormControl
                type="text"
                value={this.state.message}
                placeholder="Type in Chat"
                onChange={({ target: { value } }) => this.setState({ message: value })}
              />
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
  
  renderChatMessages = () => (
    this.state.chatMessages.map(({ author, message }, index) => (
      <div key={index}>
        <span style={{ fontWeight: 300 }}>{author}</span>: {message}
      </div>
    ))
  )
  
  sendChatMessage = (e) => {
    e.preventDefault()
    const sendMessage = window.gapi.client.youtube.liveChatMessages.insert({
      part: 'snippet',
      snippet: {
        liveChatId: this.state.currentChatId,
        type: 'textMessageEvent',
        textMessageDetails: {
          messageText: this.state.message,
        },
      },
    })
    sendMessage.execute((response) => {
      if (response.error) {
        this.setState({ error: response.error })
        return
      }
      Api.saveSentMessage({
        message: this.state.message,
        currentUser: this.props.currentUser,
      })
    })
    
    
    this.setState({ message: '' })
  }
  
  listenToChatScroll = () => {
    // scroll chat window to bottom when new messages appear
    // ideally this would only happen when the scroll is
    // already at the bottom (like most live chats)
    let chat = document.getElementById('live-chat')
    chat.scrollTop = chat.scrollHeight
  }
  
  getCurrentLiveStream = () => {
    const youtubeApi = window.gapi.client.youtube
    if (!youtubeApi) {
      // if the youtube api is not currently loaded,
      // the function below loads it and calls this function
      this.loadYoutubeApi()
      return
    }
    
    // fetching the live stream object
    const currentStream = window.gapi.client.youtube.videos.list({
      part: 'liveStreamingDetails',
      id: this.streamId,
    })
    currentStream.execute(({ items: videos }) => {
      // save the chatId for fetching, then begin live chat loop
      this.setState({
        currentChatId: videos[0].liveStreamingDetails.activeLiveChatId,
      }, this.listenToLiveChat)
    })
  }
  
  listenToLiveChat = (pageToken) => {
    // fetching the chat messages
    const chatMessages = window.gapi.client.youtube.liveChatMessages.list({
      part: 'snippet,authorDetails',
      liveChatId: this.state.currentChatId,
      maxResults: 200,
      pageToken,
    })
    chatMessages.execute(({ items, nextPageToken, pollingIntervalMillis }) => {
      const messages = items.map(({ snippet, authorDetails }) => ({
        message: snippet.displayMessage,
        author: authorDetails.displayName,
      }))
      this.setState({
        chatMessages: this.state.chatMessages.concat(messages),
      }, () => {
        // set delay before calling recursively.
        setTimeout(() => {
          this.listenToLiveChat(nextPageToken)
        }, pollingIntervalMillis);
        this.listenToChatScroll()
      })
    })
  }
  
  loadYoutubeApi = () => {
    window.gapi.client.load('youtube', 'v3', (response) => {
      this.getCurrentLiveStream()
    })
  }
}