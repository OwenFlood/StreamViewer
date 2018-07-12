import React from 'react'

export default class Home extends React.Component {
  state = {
    videos: [],
  }

  componentDidMount() {
    this.getYouTubeLiveStreams()
  }

  render() {
    return (
      <div>
        Hello {this.props.currentUser.w3.ig}.
        {this.renderVideos()}
      </div>
    )
  }
  
  renderVideos = () => {
    console.log(this.state.videos);
    return this.state.videos.map(({ id, snippet }) => (
      <div key={id.videoId}>
        <div>
          {snippet.title}
        </div>
        <div>
          <img
            width={snippet.thumbnails.medium.width}
            height={snippet.thumbnails.medium.height}
            src={snippet.thumbnails.medium.url} />
        </div>
      </div>
    ))
  }
  
  getYouTubeLiveStreams = () => {
    // load the youtube api into the gapi client
    window.gapi.client.load('youtube', 'v3', (hi) => {
      // after the client is loaded, execute the search
      const searchRequest = window.gapi.client.youtube.search.list({
        part: 'snippet',
        maxResults: '10',
        type: 'video',
        eventType: 'live',
      })
      // set state with videos returned from api
      searchRequest.execute(({ items: videos }) => {
        this.setState({ videos })
      })
    })
  }
}